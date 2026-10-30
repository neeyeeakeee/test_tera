export async function onRequestPost({ request, env }) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const vin = typeof body.vin === 'string' ? body.vin.trim() : '';
    if (!vin || vin.length < 5) {
      return Response.json({ error: 'Valid VIN is required' }, { status: 400 });
    }

    const apiKey = env.SVC_QUICKMECHSAIADMIN_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'QuickMechs AI Admin API key is not configured' }, { status: 500 });
    }

    const response = await fetch(`https://dev.aiadmin.quickmechs.com/api/vin?vin=${encodeURIComponent(vin)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to decode VIN from service' }, { status: 400 });
    }

    const data = await response.json();
    return Response.json({
      ok: true,
      vehicle: {
        year: data.year || data.vehicle_year || '',
        make: data.make || data.vehicle_make || '',
        model: data.model || data.vehicle_model || ''
      }
    });
  } catch (err) {
    return Response.json({ error: 'VIN lookup service unavailable' }, { status: 500 });
  }
}