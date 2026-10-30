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

export async function onRequestPost({ request, env }) {
  try {
    const token = getSessionToken(request);
    if (token && env.DB) {
      const now = new Date().toISOString();
      await env.DB.prepare(
        'UPDATE sessions SET expires_at = ?1 WHERE token = ?2'
      ).bind(now, token).run();
    }

    const clearCookie = 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookie
      }
    });
  } catch (err) {
    return Response.json({ error: 'Failed to process logout' }, { status: 500 });
  }
}