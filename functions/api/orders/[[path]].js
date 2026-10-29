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

export async function onRequest(context) {
  const { request, env, params } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const pathSegments = params.path || [];
  const method = request.method;
  const authUser = await getAuthUser(request, env.DB);

  // GET /api/orders (List orders for buyer or admin)
  if (pathSegments.length === 0 && method === 'GET') {
    if (!authUser) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    let orders;
    if (authUser.role === 'admin') {
      const { results } = await env.DB.prepare(
        'SELECT id, order_number, customer_name, customer_email, total_amount, status, created_at FROM orders ORDER BY id DESC LIMIT 100'
      ).all();
      orders = results || [];
    } else {
      const { results } = await env.DB.prepare(
        'SELECT id, order_number, customer_name, total_amount, status, shipping_address, shipping_city, shipping_state, shipping_zip, created_at FROM orders WHERE user_id = ?1 ORDER BY id DESC'
      ).bind(authUser.id).all();
      orders = results || [];
    }

    return Response.json({ orders });
  }

  // GET /api/orders/lookup (Guest order tracking)
  if (pathSegments.length === 1 && pathSegments[0] === 'lookup' && method === 'GET') {
    const url = new URL(request.url);
    const orderNumber = (url.searchParams.get('order_number') || '').trim();
    const email = (url.searchParams.get('email') || '').trim().toLowerCase();

    if (!orderNumber || !email) {
      return Response.json({ error: 'Order number and email are required' }, { status: 400 });
    }

    const order = await env.DB.prepare(
      'SELECT * FROM orders WHERE order_number = ?1 AND LOWER(customer_email) = ?2 LIMIT 1'
    ).bind(orderNumber, email).first();

    if (!order) {
      return Response.json({ error: 'No order found matching the given order number and email' }, { status: 404 });
    }

    const { results: items } = await env.DB.prepare(
      'SELECT id, product_id, product_name, quantity, price_each FROM order_items WHERE order_id = ?1'
    ).bind(order.id).all();

    return Response.json({ order: { ...order, items: items || [] } });
  }

  // GET /api/orders/:orderNumber (Single order lookup with items)
  if (pathSegments.length === 1 && method === 'GET') {
    const orderNumber = pathSegments[0];
    const order = await env.DB.prepare(
      'SELECT * FROM orders WHERE order_number = ?1 LIMIT 1'
    ).bind(orderNumber).first();

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Security check: only order owner or admin, or public status check with basic non-sensitive view
    const isOwner = authUser && authUser.id === order.user_id;
    const isAdmin = authUser && authUser.role === 'admin';

    const { results: items } = await env.DB.prepare(
      'SELECT id, product_id, product_name, quantity, price_each FROM order_items WHERE order_id = ?1'
    ).bind(order.id).all();

    if (isOwner || isAdmin) {
      return Response.json({ order, items: items || [] });
    }

    // Sanitized view for tracking verification
    return Response.json({
      order: {
        order_number: order.order_number,
        status: order.status,
        total_amount: order.total_amount,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        created_at: order.created_at
      },
      items: items || []
    });
  }

  // POST /api/orders (Create pre-order / checkout)
  if (pathSegments.length === 0 && method === 'POST') {
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

    const roundedTotal = Math.round(calculatedTotal * 100) / 100;
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
      roundedTotal,
      notes ? notes.trim() : null,
      now
    ).run();

    const orderId = orderResult.meta?.last_row_id;

    for (const item of verifiedItems) {
      await env.DB.prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_each) VALUES (?1, ?2, ?3, ?4, ?5)'
      ).bind(orderId, item.product_id, item.product_name, item.quantity, item.price_each).run();

      // Deduct stock safely (ensure it doesn't go below 0)
      await env.DB.prepare(
        'UPDATE products SET stock = MAX(0, stock - ?1) WHERE id = ?2'
      ).bind(item.quantity, item.product_id).run();
    }

    return Response.json({
      ok: true,
      order_number: orderNumber,
      total: roundedTotal,
      status: 'awaiting_payment'
    });
  }

  // PUT /api/orders/:orderNumber/status (Admin updates fulfillment status)
  if (pathSegments.length === 2 && pathSegments[1] === 'status' && method === 'PUT') {
    if (!authUser || authUser.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const orderIdentifier = pathSegments[0];
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    const { status } = body || {};
    const allowedStatuses = ['awaiting_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return Response.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const numId = parseInt(orderIdentifier, 10);
    const updateRes = !isNaN(numId)
      ? await env.DB.prepare('UPDATE orders SET status = ?1 WHERE id = ?2 OR order_number = ?3').bind(status, numId, orderIdentifier).run()
      : await env.DB.prepare('UPDATE orders SET status = ?1 WHERE order_number = ?2').bind(status, orderIdentifier).run();

    if (!updateRes?.meta || updateRes.meta.changes === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    return Response.json({ ok: true, status });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
