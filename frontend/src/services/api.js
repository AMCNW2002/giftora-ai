/**
 * Giftora AI - API service
 * -------------------------------------------------------------
 * The ONLY file that talks to the FastAPI backend.
 * Every function returns a Promise. After login, the JWT token is sent
 * automatically in the "Authorization: Bearer <token>" header.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const TOKEN_KEY = 'giftora-token';

export const getToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked - ignore */
  }
};

/** FastAPI sends errors as { detail: "text" } or { detail: [ {msg: ...}, ... ] } */
const readErrorMessage = (data, fallback) => {
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((d) => String(d.msg || '').replace(/^Value error, /, ''))
      .filter(Boolean)
      .join('. ');
  }
  return data?.message || fallback;
};

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  if (response.status === 204) return null;

  let data = {};
  try {
    data = await response.json();
  } catch {
    /* empty body */
  }

  if (!response.ok) {
    // Token expired / invalid -> tell the app to sign the user out
    if (response.status === 401 && auth) {
      setToken(null);
      window.dispatchEvent(new Event('giftora:unauthorized'));
    }
    throw new Error(readErrorMessage(data, 'Request failed'));
  }
  return data;
}

// backend (snake_case) -> frontend shape
const mapUser = (u) => ({ id: u.id, name: u.name, email: u.email, memberSince: u.member_since });
const toLines = (items) => items.map((i) => ({ product_id: i.id, qty: i.qty }));

export const api = {
  // ---------- Auth (the only calls that work without a token) ----------
  register: async ({ name, email, password }) => {
    const data = await request('/api/auth/register', { method: 'POST', auth: false, body: { name, email, password } });
    return { user: mapUser(data.user), token: data.token };
  },

  login: async ({ email, password }) => {
    const data = await request('/api/auth/login', { method: 'POST', auth: false, body: { email, password } });
    return { user: mapUser(data.user), token: data.token };
  },

  me: async () => mapUser(await request('/api/auth/me')),

  // ---------- Products ----------
  getProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),

  // ---------- Cart (saved in MongoDB per user) ----------
  getCart: async () => (await request('/api/cart')).items,
  saveCart: (items) => request('/api/cart', { method: 'PUT', body: { items: toLines(items) } }),

  validatePromo: (code) => request('/api/promo/validate', { method: 'POST', body: { code } }),

  checkout: async ({ items, promoCode }) => {
    const o = await request('/api/orders', {
      method: 'POST',
      body: { items: toLines(items), promo_code: promoCode || null },
    });
    return { ...o, shortId: o.id.slice(-6).toUpperCase() };
  },

  getOrders: () => request('/api/orders'),

  // ---------- Gift box ----------
  getGiftBox: () => request('/api/gift-box'),
  saveGiftBox: (box) =>
    request('/api/gift-box', {
      method: 'PUT',
      body: {
        items: toLines(box.items),
        budget: box.budget,
        ribbon: box.ribbon,
        message: box.message,
        recipient: box.recipient,
        occasion: box.occasion,
        interests: box.interests,
      },
    }),
  suggestGiftBox: ({ recipient, occasion, budget, interests }) =>
    request('/api/gift-box/suggest', { method: 'POST', body: { recipient, occasion, budget: Number(budget), interests } }),

  // ---------- AI concierge ----------
  chat: (message) => request('/api/chat', { method: 'POST', body: { message } }),
};
