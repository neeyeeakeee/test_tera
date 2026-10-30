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
      const errorText = await response.text();
      let errorMsg = 'Failed to decode VIN from service';
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.error || errJson.message) {
          errorMsg = errJson.error || errJson.message;
        }
      } catch (e) {}
      return Response.json({ error: errorMsg }, { status: 400 });
    }

    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      return Response.json({ error: 'Invalid response from VIN service' }, { status: 400 });
    }

    const vehicleInfo = data.vehicle || data.data || data;

    return Response.json({
      ok: true,
      vehicle: {
        year: vehicleInfo.year || vehicleInfo.vehicle_year || vehicleInfo.model_year || '',
        make: vehicleInfo.make || vehicleInfo.vehicle_make || '',
        model: vehicleInfo.model || vehicleInfo.vehicle_model || ''
      }
    }, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'VIN lookup service unavailable' }, { status: 500 });
  }
}
