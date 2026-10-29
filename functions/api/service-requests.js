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
    await db.prepare("CREATE TABLE IF NOT EXISTS service_requests (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, vehicle_year TEXT, vehicle_make TEXT, vehicle_model TEXT, issue TEXT NOT NULL, address TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL)").run();
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
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const vehicleYear = typeof body.vehicle_year === 'string' ? body.vehicle_year.trim().slice(0, 10) : '';
    const vehicleMake = typeof body.vehicle_make === 'string' ? body.vehicle_make.trim().slice(0, 50) : '';
    const vehicleModel = typeof body.vehicle_model === 'string' ? body.vehicle_model.trim().slice(0, 50) : '';
    const issue = typeof body.issue === 'string' ? body.issue.trim() : '';
    const address = typeof body.address === 'string' ? body.address.trim().slice(0, 200) : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 1000) : '';

    if (!name || name.length > 100) {
      return Response.json({ error: 'Valid customer name is required' }, { status: 400 });
    }
    if (!phone || phone.length > 40) {
      return Response.json({ error: 'Valid phone number is required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return Response.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    if (!issue || issue.length > 1000) {
      return Response.json({ error: 'Please describe the vehicle issue' }, { status: 400 });
    }

    const id = generateRandomHex(16);
    const createdAt = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO service_requests (id, name, phone, email, vehicle_year, vehicle_make, vehicle_model, issue, address, notes, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)'
    ).bind(
      id,
      name,
      phone,
      email,
      vehicleYear || null,
      vehicleMake || null,
      vehicleModel || null,
      issue,
      address || null,
      notes || null,
      'pending',
      createdAt
    ).run();

    return Response.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Failed to record service request' }, { status: 500 });
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const admin = await requireAdmin(request, env);
    if (!admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { results } = await env.DB.prepare(
      'SELECT id, name, phone, email, vehicle_year, vehicle_make, vehicle_model, issue, address, notes, status, created_at FROM service_requests ORDER BY created_at DESC LIMIT 100'
    ).all();

    return Response.json({ requests: results || [] });
  } catch (err) {
    return Response.json({ error: 'Failed to fetch service requests' }, { status: 500 });
  }
}

export async function onRequestPatch({ request, env }) {
  try {
    const admin = await requireAdmin(request, env);
    if (!admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    const status = typeof body.status === 'string' ? body.status.trim() : '';
    const allowedStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];

    if (!id || !allowedStatuses.includes(status)) {
      return Response.json({ error: 'Invalid id or status' }, { status: 400 });
    }

    await env.DB.prepare(
      'UPDATE service_requests SET status = ?1 WHERE id = ?2'
    ).bind(status, id).run();

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: 'Failed to update service request' }, { status: 500 });
  }
}