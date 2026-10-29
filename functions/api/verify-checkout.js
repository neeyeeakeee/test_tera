export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
  }

  const { order_number, session_id } = body || {};
  if (!order_number || !session_id) {
    return Response.json({ error: 'Missing order_number or session_id' }, { status: 400 });
  }

  const secretKey = env.PAY_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: 'Stripe secret key not configured' }, { status: 500 });
  }

  try {
    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    });

    const stripeData = await stripeRes.json();

    if (stripeRes.ok && stripeData.payment_status === 'paid') {
      const clientRef = stripeData.client_reference_id;
      const targetOrderNum = clientRef || order_number;

      const order = await env.DB.prepare('SELECT id, status FROM orders WHERE order_number = ?1 LIMIT 1').bind(targetOrderNum).first();
      if (order && order.status === 'awaiting_payment') {
        await env.DB.prepare('UPDATE orders SET status = ?1 WHERE order_number = ?2').bind('processing', targetOrderNum).run();
      }
    }

    return Response.json({ ok: true, payment_status: stripeData.payment_status });
  } catch (err) {
    return Response.json({ error: 'Failed to verify session with Stripe' }, { status: 500 });
  }
}
