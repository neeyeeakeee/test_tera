async function parseResponse(res) {
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (err) {
    data = { error: text || 'Unexpected server error' };
  }
  return { ok: res.ok, status: res.status, data };
}

export async function submitServiceRequest(payload) {
  const res = await fetch('/api/service-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function getServiceRequests() {
  const res = await fetch('/api/service-requests');
  return parseResponse(res);
}

export async function updateServiceRequestStatus(id, status) {
  const res = await fetch('/api/service-requests', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status })
  });
  return parseResponse(res);
}

export async function submitContactMessage(payload) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function getContactMessages() {
  const res = await fetch('/api/contact');
  return parseResponse(res);
}

export async function loginAdmin({ email, password }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return parseResponse(res);
}

export async function logoutAdmin() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST'
  });
  return parseResponse(res);
}

export async function getAdminMe() {
  const res = await fetch('/api/auth/me');
  return parseResponse(res);
}

export async function checkAdminSetup() {
  const res = await fetch('/api/admin-setup');
  return parseResponse(res);
}

export async function setupAdmin({ token, name, email, password }) {
  const res = await fetch('/api/admin-setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, name, email, password })
  });
  return parseResponse(res);
}