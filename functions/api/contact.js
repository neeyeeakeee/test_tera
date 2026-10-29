function getSessionToken(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith('session=')) {
      return decodeURIComponent(cookie.substring('session='.length));
    }
    if (cookie.startsWith('qm_session=')) {
      return decodeURIComponent(cookie.substring('qm_session='.length));
    }
  }
  return null;
}

let isDbReady = false;
async function ensureDb(db) {
  if (isDbReady || !db) return;
  try {
    await db.prepare("CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, subject TEXT, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'unread', created_at TEXT NOT NULL)").run();
    await db.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'driver', created_at TEXT NOT NULL)").run();
    await db.prepare("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL)").run();
    isDbReady = true;
  } catch (err) {}
}

async function requireAdmin(request, env) {
  const token = getSessionToken(request);
  if (!token || !env.DB) return null;
  await ensureDb(env.DB);
  const now = new Date().toISOString();
  const session = await env.DB.prepare(
    'SELECT user_id FROM sessions WHERE token = ?1 AND expires_at > ?2'
  ).bind(token, now).first();
  if (!session) return null;
  const user = await env.DB.prepare(
    'SELECT id, name, email, role FROM users WHERE id = ?1'
  ).bind(session.user_id).first();
  if (!user || user.role !== 'admin') return null;
  return user;
}

function generateRandomHex(byteCount = 16) {
  const bytes = new Uint8Array(byteCount);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return Response.json({ error: 'Database unavailable' }, { status: 500 });
    }
    await ensureDb(env.DB);

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 150) : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || name.length > 100) {
      return Response.json({ error: 'Please provide your name' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return Response.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }
    if (!message || message.length > 2000) {
      return Response.json({ error: 'Please enter a message' }, { status: 400 });
    }

    const id = generateRandomHex(16);
    const createdAt = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO messages (id, name, email, phone, subject, message, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
    ).bind(id, name, email, phone || null, subject || null, message, 'unread', createdAt).run();

    return Response.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Failed to record contact message' }, { status: 500 });
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const admin = await requireAdmin(request, env);
    if (!admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { results } = await env.DB.prepare(
      'SELECT id, name, email, phone, subject, message, status, created_at FROM messages ORDER BY created_at DESC LIMIT 100'
    ).all();

    return Response.json({ messages: results || [] });
  } catch (err) {
    return Response.json({ error: 'Failed to retrieve messages' }, { status: 500 });
  }
}