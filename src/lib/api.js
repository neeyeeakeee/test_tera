export async function apiFetch(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'same-origin',
    ...options
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(endpoint, config);
    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { error: 'Network error or unable to reach server' }
    };
  }
}

export const api = {
  get: (url, options) => apiFetch(url, { method: 'GET', ...options }),
  post: (url, body, options) => apiFetch(url, { method: 'POST', body, ...options }),
  put: (url, body, options) => apiFetch(url, { method: 'PUT', body, ...options }),
  delete: (url, options) => apiFetch(url, { method: 'DELETE', ...options })
};
