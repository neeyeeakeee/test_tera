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

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
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

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) {
    return Response.json({ open: false, error: 'Database not bound' }, { status: 500 });
  }

  try {
    const admin = await env.DB.prepare('SELECT id FROM users WHERE role = ?1 LIMIT 1').bind('admin').first();
    return Response.json({ open: !admin });
  } catch (err) {
    return Response.json({ open: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return Response.json({ error: 'Database not configured' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON request' }, { status: 400 });
  }

  const { token, name, email, password } = body || {};

  const expectedToken = env.ADMIN_SETUP_TOKEN;
  if (!expectedToken || typeof token !== 'string' || !timingSafeEqual(token, expectedToken)) {
    return Response.json({ error: 'Forbidden: invalid setup token' }, { status: 403 });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return Response.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!emailRegex.test(cleanEmail)) {
    return Response.json({ error: 'Valid email address required' }, { status: 400 });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
  }

  try {
    const existingAdmin = await env.DB.prepare('SELECT id FROM users WHERE role = ?1 LIMIT 1').bind('admin').first();
    if (existingAdmin) {
      return Response.json({ error: 'Admin setup is already completed' }, { status: 403 });
    }

    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    const saltHex = bufToHex(saltBytes);
    const hashHex = await hashPassword(password, saltHex);
    const now = new Date().toISOString();

    const insertRes = await env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, password_salt, role, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
    ).bind(name.trim(), cleanEmail, hashHex, saltHex, 'admin', now).run();

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
          role: 'admin'
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
  } catch (err) {
    return Response.json({ error: 'Failed to create administrator account' }, { status: 500 });
  }
}
