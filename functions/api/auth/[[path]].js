function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aLen = a.length;
  const bLen = b.length;
  let diff = aLen ^ bLen;
  const maxLen = Math.max(aLen, bLen);
  for (let i = 0; i < maxLen; i++) {
    const charA = i < aLen ? a.charCodeAt(i) : 0;
    const charB = i < bLen ? b.charCodeAt(i) : 0;
    diff |= (charA ^ charB);
  }
  return diff === 0;
}

async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return bufToHex(derivedBits);
}

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

async function getUserFromSession(request, db) {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies.qm_session;
  if (!sessionToken) return null;

  const now = new Date().toISOString();
  const session = await db.prepare(
    'SELECT user_id FROM sessions WHERE token = ?1 AND expires_at > ?2 LIMIT 1'
  ).bind(sessionToken, now).first();

  if (!session) return null;

  const user = await db.prepare(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?1 LIMIT 1'
  ).bind(session.user_id).first();

  return user || null;
}

export async function onRequest(context) {
  const { request, env, params } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const pathSegments = params.path || [];
  const subpath = pathSegments.join('/');
  const method = request.method;

  if (subpath === 'me' && method === 'GET') {
    const user = await getUserFromSession(request, env.DB);
    return Response.json({ user: user || null });
  }

  if (subpath === 'signup' && method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    const { name, email, password } = body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return Response.json({ error: 'Full name must be at least 2 characters' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return Response.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?1 LIMIT 1').bind(cleanEmail).first();
    if (existing) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    const saltHex = bufToHex(saltBytes);
    const hashHex = await hashPassword(password, saltHex);
    const now = new Date().toISOString();

    const insertRes = await env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, password_salt, role, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
    ).bind(name.trim(), cleanEmail, hashHex, saltHex, 'buyer', now).run();

    const userId = insertRes.meta?.last_row_id;

    const sessionBytes = new Uint8Array(32);
    crypto.getRandomValues(sessionBytes);
    const sessionToken = bufToHex(sessionBytes);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await env.DB.prepare(
      'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?1, ?2, ?3, ?4)'
    ).bind(sessionToken, userId, expiresAt, now).run();

    const cookieHeader = `qm_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;

    return new Response(
      JSON.stringify({
        ok: true,
        user: {
          id: userId,
          name: name.trim(),
          email: cleanEmail,
          role: 'buyer'
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader
        }
      }
    );
  }

  if (subpath === 'login' && method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    const { email, password } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = await env.DB.prepare(
      'SELECT id, name, email, password_hash, password_salt, role FROM users WHERE email = ?1 LIMIT 1'
    ).bind(cleanEmail).first();

    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const inputHash = await hashPassword(password, user.password_salt);
    if (!timingSafeEqual(inputHash, user.password_hash)) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const sessionBytes = new Uint8Array(32);
    crypto.getRandomValues(sessionBytes);
    const sessionToken = bufToHex(sessionBytes);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?1, ?2, ?3, ?4)'
    ).bind(sessionToken, user.id, expiresAt, now).run();

    const cookieHeader = `qm_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;

    return new Response(
      JSON.stringify({
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader
        }
      }
    );
  }

  if (subpath === 'logout' && method === 'POST') {
    const cookieHeader = request.headers.get('Cookie');
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies.qm_session;

    if (sessionToken) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?1').bind(sessionToken).run();
    }

    const expiredCookie = 'qm_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': expiredCookie
      }
    });
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}
