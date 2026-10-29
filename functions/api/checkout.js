function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

async function getAuthUser(request, db) {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies.qm_session;
  if (!sessionToken) return null;

  const now = new Date().toISOString();
  const session = await db.prepare(
    'SELECT user_id FROM sessions WHERE token = ?1 AND expires_at > ?2 LIMIT 1'
  ).bind(sessionToken, now).first();

  if (!session) return null;
  return await db.prepare('SELECT id, name, email, role FROM users WHERE id = ?1 LIMIT 1').bind(session.user_id).first();
}

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString(36).toUpperCase();
  return `QM-${timestamp}-${rand}`;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const authUser = await getAuthUser(request, env.DB);
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
  }

  const {
    items,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    shipping_state,
    shipping_zip,
    notes
  } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Your cart is empty' }, { status: 400 });
  }

  const cleanName = (customer_name || authUser?.name || '').trim();
  if (!cleanName || cleanName.length < 2) {
    return Response.json({ error: 'A valid customer name is required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = (customer_email || authUser?.email || '').trim().toLowerCase();
  if (!emailRegex.test(cleanEmail)) {
    return Response.json({ error: 'A valid contact email is required' }, { status: 400 });
  }

  if (!shipping_address || typeof shipping_address !== 'string' || shipping_address.trim().length < 5) {
    return Response.json({ error: 'A complete delivery street address is required' }, { status: 400 });
  }

  if (!shipping_city || typeof shipping_city !== 'string' || shipping_city.trim().length < 2) {
    return Response.json({ error: 'City is required' }, { status: 400 });
  }

  if (!shipping_state || typeof shipping_state !== 'string' || shipping_state.trim().length < 2) {
    return Response.json({ error: 'State is required' }, { status: 400 });
  }

  if (!shipping_zip || typeof shipping_zip !== 'string' || shipping_zip.trim().length < 4) {
    return Response.json({ error: 'Zip code is required' }, { status: 400 });
  }

  // Calculate total securely from the database; never trust client-provided pricing
  let calculatedTotal = 0;
  const verifiedItems = [];

  for (const cartItem of items) {
    const pId = parseInt(cartItem.product_id || cartItem.id, 10);
    const qty = parseInt(cartItem.quantity, 10);
    if (isNaN(pId) || isNaN(qty) || qty <= 0) continue;

    const product = await env.DB.prepare(
      'SELECT id, name, price, stock FROM products WHERE id = ?1 LIMIT 1'
    ).bind(pId).first();

    if (!product) {
      return Response.json({ error: `Product item #${pId} was not found` }, { status: 400 });
    }

    const itemPrice = Number(product.price);
    calculatedTotal += itemPrice * qty;
    verifiedItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: qty,
      price_each: itemPrice
    });
  }

  if (verifiedItems.length === 0) {
    return Response.json({ error: 'No valid products found in order' }, { status: 400 });
  }

  const shippingFee = calculatedTotal > 150 ? 0.0 : 12.0;
  const estimatedTax = calculatedTotal * 0.07;
  const finalTotal = Math.round((calculatedTotal + shippingFee + estimatedTax) * 100) / 100;

  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();
  const userId = authUser ? authUser.id : null;

  const orderResult = await env.DB.prepare(
    `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone,
     shipping_address, shipping_city, shipping_state, shipping_zip, status, total_amount, notes, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)`
  ).bind(
    orderNumber,
    userId,
    cleanName,
    cleanEmail,
    customer_phone ? customer_phone.trim() : null,
    shipping_address.trim(),
    shipping_city.trim(),
    shipping_state.trim(),
    shipping_zip.trim(),
    'awaiting_payment',
    finalTotal,
    notes ? notes.trim() : null,
    now
  ).run();

  const orderId = orderResult.meta?.last_row_id;

  for (const item of verifiedItems) {
    await env.DB.prepare(
      'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_each) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(orderId, item.product_id, item.product_name, item.quantity, item.price_each).run();

    await env.DB.prepare(
      'UPDATE products SET stock = MAX(0, stock - ?1) WHERE id = ?2'
    ).bind(item.quantity, item.product_id).run();
  }

  const secretKey = env.PAY_SECRET_KEY;
  if (!secretKey) {
    return Response.json({
      ok: true,
      order_number: orderNumber,
      total: finalTotal,
      warning: 'Stripe secret key not set; order saved as awaiting payment.'
    });
  }

  const urlObj = new URL(request.url);
  const origin = `${urlObj.protocol}//${urlObj.host}`;
  const successUrl = `${origin}/order-confirmation?order=${encodeURIComponent(orderNumber)}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/cart`;

  const stripeParams = new URLSearchParams();
  stripeParams.append('mode', 'payment');
  stripeParams.append('success_url', successUrl);
  stripeParams.append('cancel_url', cancelUrl);
  stripeParams.append('customer_email', cleanEmail);
  stripeParams.append('client_reference_id', orderNumber);

  stripeParams.append('line_items[0][price_data][currency]', 'usd');
  stripeParams.append('line_items[0][price_data][unit_amount]', Math.round(finalTotal * 100));
  stripeParams.append('line_items[0][price_data][product_data][name]', `Quick Mechs Order #${orderNumber}`);
  stripeParams.append('line_items[0][quantity]', '1');

  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: stripeParams.toString()
    });

    const stripeData = await stripeRes.json();

    if (!stripeRes.ok || !stripeData.url) {
      return Response.json({
        ok: true,
        order_number: orderNumber,
        total: finalTotal,
        error: stripeData.error?.message || 'Failed to initialize Stripe Checkout Session'
      });
    }

    return Response.json({
      ok: true,
      url: stripeData.url,
      order_number: orderNumber,
      total: finalTotal
    });
  } catch (err) {
    return Response.json({
      ok: true,
      order_number: orderNumber,
      total: finalTotal,
      error: 'Network error connecting to Stripe API'
    });
  }
}
