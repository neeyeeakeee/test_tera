export async function onRequestGet({ request, env }) {
  try {
    const clientId = env.SVC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return Response.json({ error: 'Google Client ID is not configured' }, { status: 500 });
    }

    const url = new URL(request.url);
    const origin = url.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;

    const stateBytes = new Uint8Array(16);
    crypto.getRandomValues(stateBytes);
    const state = Array.from(stateBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('openid email profile')}&state=${encodeURIComponent(state)}`;

    const cookieHeader = `g_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=300`;

    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl,
        'Set-Cookie': cookieHeader
      }
    });
  } catch (err) {
    return Response.json({ error: 'Failed to initiate Google sign-in' }, { status: 500 });
  }
}