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

export async function onRequestGet({ request, env }) {
  try {
    const token = getSessionToken(request);
    if (!token || !env.DB) {
      return Response.json({ user: null }, { status: 401 });
    }

    const now = new Date().toISOString();
    const session = await env.DB.prepare(
      'SELECT user_id FROM sessions WHERE token = ?1 AND expires_at > ?2'
    ).bind(token, now).first();

    if (!session) {
      return Response.json({ user: null }, { status: 401 });
    }

    const user = await env.DB.prepare(
      'SELECT id, name, email, role FROM users WHERE id = ?1'
    ).bind(session.user_id).first();

    if (!user) {
      return Response.json({ user: null }, { status: 401 });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return Response.json({ error: 'Failed to check session' }, { status: 500 });
  }
}