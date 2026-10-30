function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

let isDbReady = false;
async function ensureDb(db) {
  if (isDbReady || !db) return;
  try {
    await db.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'driver', created_at TEXT NOT NULL)").run();
    await db.prepare("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL)").run();
    isDbReady = true;
  } catch (err) {}
}

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB || !env.SVC_GOOGLE_CLIENT_ID || !env.SVC_GOOGLE_CLIENT_SECRET) {
      return Response.json({ error: 'Google sign-in is not fully configured' }, { status: 500 });
    }

    await ensureDb(env.DB);

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const savedState = getCookie(request, 'g_state');

    if (!code || !state || !savedState || state !== savedState) {
      return Response.json({ error: 'Invalid OAuth state or authorization code' }, { status: 400 });
    }

    const origin = url.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;

    const tokenParams = new URLSearchParams();
    tokenParams.append('code', code);
    tokenParams.append('client_id', env.SVC_GOOGLE_CLIENT_ID);
    tokenParams.append('client_secret', env.SVC_GOOGLE_CLIENT_SECRET);
    tokenParams.append('redirect_uri', redirectUri);
    tokenParams.append('grant_type', 'authorization_code');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    if (!tokenRes.ok) {
      return Response.json({ error: 'Failed to exchange authorization code with Google' }, { status: 400 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const userInfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!userInfoRes.ok) {
      return Response.json({ error: 'Failed to fetch user info from Google' }, { status: 400 });
    }

    const userInfo = await userInfoRes.json();
    if (!userInfo.email_verified || !userInfo.email) {
      return Response.json({ error: 'Google account email is not verified' }, { status: 400 });
    }

    const email = userInfo.email.trim().toLowerCase();
    const name = userInfo.name || email.split('@')[0];

    let user = await env.DB.prepare(
      'SELECT id, name, email, role FROM users WHERE email = ?1'
    ).bind(email).first();

    const now = new Date().toISOString();

    if (!user) {
      const userId = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO users (id, name, email, password_hash, salt, role, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
      ).bind(userId, name, email, 'GOOGLE_AUTH_NO_PASSWORD', 'NONE', 'driver', now).run();

      user = { id: userId, name, email, role: 'driver' };
    }

    const sessionTokenBytes = new Uint8Array(32);
    crypto.getRandomValues(sessionTokenBytes);
    const sessionToken = Array.from(sessionTokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const sessionId = crypto.randomUUID();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(sessionId, user.id, sessionToken, expiryDate, now).run();

    const cookieHeader = `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;
    const clearStateCookie = 'g_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';

    return new Response(null, {
      status: 302,
      headers: {
        'Location': user.role === 'admin' ? '/admin/dashboard' : '/',
        'Set-Cookie': cookieHeader,
        'Add-Header': clearStateCookie
      }
    });
  } catch (err) {
    return Response.json({ error: 'Google authentication error' }, { status: 500 });
  }
}