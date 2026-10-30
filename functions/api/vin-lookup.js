export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return Response.json({ error: 'Database unavailable' }, { status: 500 });
    }
    const apiKey = env.SVC_QUICKMECHSAIADMIN_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'QuickMechs AI Admin API key is not configured' }, { status: 500 });
    }

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const vin = typeof body.vin === 'string' ? body.vin.trim() : '';
    if (!vin || vin.length < 5) {
      return Response.json({ error: 'Valid VIN is required' }, { status: 400 });
    }

    const apiRes = await fetch('https://dev.api.aiadmin.quickmechs.com/api/v1/predict/vehicle-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ vin })
    });

    const text = await apiRes.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = { raw: text };
    }

    if (!apiRes.ok) {
      return Response.json({ error: data.error || 'Vehicle lookup failed from external service' }, { status: apiRes.status });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Failed to complete VIN lookup' }, { status: 500 });
  }
}
