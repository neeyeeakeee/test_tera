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

async function ensureSampleProducts(db) {
  const countRes = await db.prepare('SELECT COUNT(*) AS total FROM products').first();
  if (countRes && countRes.total > 0) return;

  const samples = [
    {
      name: 'Ceramic Heavy-Duty Front Brake Pad Set',
      category: 'Brakes',
      description: 'Ultra-quiet ceramic brake pads engineered for exceptional stopping power, reduced brake dust, and long-lasting rotor life. Fits popular sedans and compact SUVs.',
      price: 54.99,
      stock: 35,
      image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
      part_number: 'QM-BRK-402',
      vehicle_fitment: 'Universal fit for midsize sedans & compact SUVs (2015-2024)'
    },
    {
      name: 'High-Performance AGM Vehicle Battery (Group 35)',
      category: 'Batteries',
      description: 'Absorbent Glass Mat (AGM) battery with 680 cold cranking amps (CCA). Engineered for high electrical demands and extreme climate resistance.',
      price: 189.99,
      stock: 18,
      image_url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      part_number: 'QM-BAT-680',
      vehicle_fitment: 'Most Japanese and Domestic sedans & crossovers'
    },
    {
      name: 'OBD-II Wireless Bluetooth Diagnostic Scanner',
      category: 'Diagnostics',
      description: 'Professional-grade check engine light scanner. Wirelessly streams real-time sensor metrics, error codes, and emissions readiness straight to your phone.',
      price: 49.50,
      stock: 42,
      image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      part_number: 'QM-OBD-PRO',
      vehicle_fitment: 'All 1996 and newer OBD-II compliant cars and light trucks'
    },
    {
      name: 'Iridium Spark Plug 4-Pack (Extended Life)',
      category: 'Ignition & Engine',
      description: 'Precision engineered laser-welded iridium electrode spark plugs for improved fuel efficiency, smoother idle, and reliable cold starts.',
      price: 38.00,
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
      part_number: 'QM-SPK-IR4',
      vehicle_fitment: '4-Cylinder and V6 passenger vehicles'
    },
    {
      name: 'Heavy Duty 160-Amp Alternator Assembly',
      category: 'Electrical',
      description: 'Brand new high-output alternator with premium bearings, tested to provide uninterrupted power for starting and vehicle electronics.',
      price: 165.00,
      stock: 12,
      image_url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
      part_number: 'QM-ALT-160',
      vehicle_fitment: 'SUVs, Light Trucks, and fleet vans'
    },
    {
      name: 'Vented Performance Front Brake Rotor Set (Pair)',
      category: 'Brakes',
      description: 'Cross-machined precision balanced vented brake rotors designed for superior heat dissipation, reducing brake fade during towing and city stops.',
      price: 119.99,
      stock: 24,
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      part_number: 'QM-ROT-200',
      vehicle_fitment: 'Standard 5-lug passenger vehicles'
    }
  ];

  const now = new Date().toISOString();
  for (const item of samples) {
    await db.prepare(
      `INSERT INTO products (name, category, description, price, stock, image_url, part_number, vehicle_fitment, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
    ).bind(
      item.name,
      item.category,
      item.description,
      item.price,
      item.stock,
      item.image_url,
      item.part_number,
      item.vehicle_fitment,
      now
    ).run();
  }
}

export async function onRequest(context) {
  const { request, env, params } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  await ensureSampleProducts(env.DB);

  const pathSegments = params.path || [];
  const productId = pathSegments[0];
  const method = request.method;

  // GET /api/products
  if (pathSegments.length === 0 && method === 'GET') {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const inStock = url.searchParams.get('in_stock');
    const sort = url.searchParams.get('sort');

    let query = 'SELECT p.*, COALESCE(AVG(r.rating), 0) AS average_rating, COUNT(r.id) AS review_count FROM products p LEFT JOIN reviews r ON r.product_id = p.id WHERE 1=1';
    const bindings = [];
    let bindIdx = 1;

    if (category && category !== 'All') {
      query += ` AND p.category = ?${bindIdx}`;
      bindings.push(category);
      bindIdx++;
    }

    if (search && search.trim()) {
      query += ` AND (p.name LIKE ?${bindIdx} OR p.description LIKE ?${bindIdx} OR p.part_number LIKE ?${bindIdx})`;
      bindings.push(`%${search.trim()}%`);
      bindIdx++;
    }

    if (inStock === 'true') {
      query += ' AND p.stock > 0';
    }

    query += ' GROUP BY p.id';

    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'name') {
      query += ' ORDER BY p.name ASC';
    } else {
      query += ' ORDER BY p.id DESC';
    }

    let stmt = env.DB.prepare(query);
    if (bindings.length > 0) {
      stmt = stmt.bind(...bindings);
    }

    const { results } = await stmt.all();
    return Response.json({ products: results || [] });
  }

  // GET /api/products/:id
  if (pathSegments.length === 1 && method === 'GET') {
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await env.DB.prepare(
      `SELECT p.*, COALESCE(AVG(r.rating), 0) AS average_rating, COUNT(r.id) AS review_count 
       FROM products p 
       LEFT JOIN reviews r ON r.product_id = p.id 
       WHERE p.id = ?1 
       GROUP BY p.id LIMIT 1`
    ).bind(id).first();

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ product });
  }

  // Admin: POST /api/products (Add new part)
  if (pathSegments.length === 0 && method === 'POST') {
    const user = await getAuthUser(request, env.DB);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    const { name, category, description, price, stock, image_url, part_number, vehicle_fitment } = body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return Response.json({ error: 'Product name must be at least 3 characters' }, { status: 400 });
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return Response.json({ error: 'Price must be a valid non-negative number' }, { status: 400 });
    }

    const numStock = parseInt(stock, 10) || 0;
    const now = new Date().toISOString();

    const insertRes = await env.DB.prepare(
      `INSERT INTO products (name, category, description, price, stock, image_url, part_number, vehicle_fitment, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
    ).bind(
      name.trim(),
      (category || 'General').trim(),
      (description || '').trim(),
      numPrice,
      numStock,
      image_url || '/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg',
      (part_number || '').trim(),
      (vehicle_fitment || 'Standard fit').trim(),
      now
    ).run();

    return Response.json({ ok: true, id: insertRes.meta?.last_row_id });
  }

  // Admin: PUT /api/products/:id (Update product or stock)
  if (pathSegments.length === 1 && method === 'PUT') {
    const user = await getAuthUser(request, env.DB);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
    }

    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    const existing = await env.DB.prepare('SELECT id FROM products WHERE id = ?1 LIMIT 1').bind(id).first();
    if (!existing) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const { name, category, description, price, stock, image_url, part_number, vehicle_fitment } = body || {};
    const numPrice = price !== undefined ? parseFloat(price) : undefined;
    const numStock = stock !== undefined ? parseInt(stock, 10) : undefined;

    await env.DB.prepare(
      `UPDATE products SET
         name = COALESCE(?1, name),
         category = COALESCE(?2, category),
         description = COALESCE(?3, description),
         price = COALESCE(?4, price),
         stock = COALESCE(?5, stock),
         image_url = COALESCE(?6, image_url),
         part_number = COALESCE(?7, part_number),
         vehicle_fitment = COALESCE(?8, vehicle_fitment)
       WHERE id = ?9`
    ).bind(
      name || null,
      category || null,
      description || null,
      numPrice !== undefined && !isNaN(numPrice) ? numPrice : null,
      numStock !== undefined && !isNaN(numStock) ? numStock : null,
      image_url || null,
      part_number || null,
      vehicle_fitment || null,
      id
    ).run();

    return Response.json({ ok: true });
  }

  // Admin: DELETE /api/products/:id
  if (pathSegments.length === 1 && method === 'DELETE') {
    const user = await getAuthUser(request, env.DB);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
    }

    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    await env.DB.prepare('DELETE FROM products WHERE id = ?1').bind(id).run();
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
