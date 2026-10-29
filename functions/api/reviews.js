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

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const productId = parseInt(url.searchParams.get('product_id') || url.searchParams.get('productId'), 10);

  if (!productId || isNaN(productId)) {
    return Response.json({ error: 'product_id parameter is required' }, { status: 400 });
  }

  try {
    // Note: Never return personal email or sensitive identifiers
    const { results } = await env.DB.prepare(
      'SELECT id, product_id, user_name, rating, comment, created_at FROM reviews WHERE product_id = ?1 ORDER BY id DESC LIMIT 50'
    ).bind(productId).all();

    return Response.json({ reviews: results || [] });
  } catch (err) {
    return Response.json({ error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

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

  const { product_id, rating, comment, user_name } = body || {};
  const pId = parseInt(product_id, 10);
  if (!pId || isNaN(pId)) {
    return Response.json({ error: 'Invalid product_id' }, { status: 400 });
  }

  const starRating = parseInt(rating, 10);
  if (isNaN(starRating) || starRating < 1 || starRating > 5) {
    return Response.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
    return Response.json({ error: 'Review comment must be at least 5 characters' }, { status: 400 });
  }

  const authUser = await getAuthUser(request, env.DB);
  const authorName = authUser?.name || (user_name && typeof user_name === 'string' && user_name.trim().length >= 2 ? user_name.trim() : 'Atlanta Driver');
  const authorId = authUser?.id || 0;

  try {
    const product = await env.DB.prepare('SELECT id FROM products WHERE id = ?1 LIMIT 1').bind(pId).first();
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    await env.DB.prepare(
      'INSERT INTO reviews (product_id, user_id, user_name, rating, comment, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
    ).bind(pId, authorId, authorName, starRating, comment.trim(), now).run();

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
