function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

let isDbReady = false;
async function ensureDb(db) {
  if (isDbReady || !db) return;
  try {
    await db.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'driver', created_at TEXT NOT NULL)").run();
    await db.prepare("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL)").run();
    await db.prepare("CREATE TABLE IF NOT EXISTS service_requests (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, vehicle_year TEXT, vehicle_make TEXT, vehicle_model TEXT, issue TEXT NOT NULL, address TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL)").run();
    await db.prepare("CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, subject TEXT, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'unread', created_at TEXT NOT NULL)").run();
    isDbReady = true;
  } catch (err) {}
}

async function hashPassword(password) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return { saltHex, hashHex };
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) {
    return Response.json({ open: true });
  }

  try {
    await ensureDb(env.DB);
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
    const hasAdmin = (row?.count || 0) > 0;
    return Response.json({ open: !hasAdmin });
  } catch (err) {
    return Response.json({ open: true });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  await ensureDb(env.DB);

  let body = {};
  try {
    body = await request.json();
  } catch (err) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { token, name, email, password } = body;

  const expectedToken = (env.ADMIN_SETUP_TOKEN || '').trim();
  const inputToken = typeof token === 'string' ? token.trim() : '';
  if (!expectedToken || !inputToken || !timingSafeEqual(inputToken, expectedToken)) {
    return Response.json({ error: 'Invalid or unauthorized admin setup token' }, { status: 403 });
  }

  const existing = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
  if ((existing?.count || 0) > 0) {
    return Response.json({ error: 'Admin account has already been configured' }, { status: 403 });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return Response.json({ error: 'Please enter a valid name' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
  }

  const { saltHex, hashHex } = await hashPassword(password);
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();
  const cleanEmail = email.trim().toLowerCase();

  await env.DB.prepare(
    'INSERT INTO users (id, name, email, password_hash, salt, role, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
  ).bind(userId, name.trim(), cleanEmail, hashHex, saltHex, 'admin', now).run();

  const sessionTokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const sessionToken = Array.from(sessionTokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const sessionId = crypto.randomUUID();
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES (?1, ?2, ?3, ?4, ?5)'
  ).bind(sessionId, userId, sessionToken, expiryDate, now).run();

  const cookieHeader = `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;

  return new Response(JSON.stringify({
    ok: true,
    user: { id: userId, name: name.trim(), email: cleanEmail, role: 'admin' }
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader
    }
  });
}