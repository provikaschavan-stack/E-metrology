/**
 * e-Metrology API Client
 * All calls to the Express backend go through this module.
 * Import the sub-modules (auth, instruments) from their respective files.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('emetrology_token') || null;
}

function getAuthHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(res);
    if (data.data?.token) {
      localStorage.setItem('emetrology_token', data.data.token);
      localStorage.setItem('emetrology_user', JSON.stringify(data.data.user));
    }
    return data.data;
  },

  async register(payload) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    if (data.data?.token) {
      localStorage.setItem('emetrology_token', data.data.token);
      localStorage.setItem('emetrology_user', JSON.stringify(data.data.user));
    }
    return data.data;
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  logout() {
    localStorage.removeItem('emetrology_token');
    localStorage.removeItem('emetrology_user');
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('emetrology_user')) || null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!getToken();
  }
};

// ─── INSTRUMENTS ─────────────────────────────────────────────────────────────
export const instrumentsAPI = {
  async getAll() {
    const res = await fetch(`${BASE_URL}/instruments`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data.instruments;
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/instruments/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data.instrument;
  },

  async create(payload) {
    const res = await fetch(`${BASE_URL}/instruments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    return data.data.instrument;
  },

  async update(id, payload) {
    const res = await fetch(`${BASE_URL}/instruments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    return data.data.instrument;
  },

  async remove(id) {
    const res = await fetch(`${BASE_URL}/instruments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

// ─── VERIFICATION APPLICATIONS ──────────────────────────────────────────────
export const applicationsAPI = {
  async getAll() {
    const res = await fetch(`${BASE_URL}/applications`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data.applications;
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data.application;
  },

  async track(appNumber) {
    try {
      const res = await fetch(`${BASE_URL}/applications/track/${encodeURIComponent(appNumber)}`);
      const data = await handleResponse(res);
      return data.data.application;
    } catch {
      // Fallback to authenticated getById if track route is not used
      const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(appNumber)}`, {
        headers: getAuthHeaders()
      });
      const data = await handleResponse(res);
      return data.data.application;
    }
  },

  async create(payload) {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    return data.data.application;
  },

  async update(id, payload) {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    return data.data.application;
  },

  async assign(id, { assigned_to, remarks }) {
    const res = await fetch(`${BASE_URL}/applications/${id}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assigned_to, remarks })
    });
    const data = await handleResponse(res);
    return data.data.application;
  },

  async schedule(id, { scheduled_date, remarks }) {
    const res = await fetch(`${BASE_URL}/applications/${id}/schedule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ scheduled_date, remarks })
    });
    const data = await handleResponse(res);
    return data.data.application;
  },

  async getOfficers() {
    const res = await fetch(`${BASE_URL}/applications/officers`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data.officers;
  }
};

// ─── FIELD VERIFICATION RECORDS ──────────────────────────────────────────────
export const verificationsAPI = {
  async create(payload) {
    const res = await fetch(`${BASE_URL}/verifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/verifications/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async getByApplication(appId) {
    const res = await fetch(`${BASE_URL}/verifications/application/${encodeURIComponent(appId)}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async update(id, payload) {
    const res = await fetch(`${BASE_URL}/verifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    return data.data;
  }
};

// ─── DIGITAL CERTIFICATES & PUBLIC QR VERIFY ──────────────────────────────────
export const certificatesAPI = {
  /**
   * Public verification endpoint (NO LOGIN REQUIRED)
   */
  async publicVerify(certNumber) {
    const res = await fetch(`${BASE_URL}/public/verify/${encodeURIComponent(certNumber)}`);
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Detailed certificate retrieval
   */
  async getByNumber(certNumber) {
    if (!getToken()) return this.publicVerify(certNumber);
    const res = await fetch(`${BASE_URL}/certificates/${encodeURIComponent(certNumber)}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Get all registered certificates
   */
  async getAll() {
    const res = await fetch(`${BASE_URL}/certificates`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Explicit generation for approved application
   */
  async generate(applicationId) {
    const res = await fetch(`${BASE_URL}/certificates/generate/${applicationId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.data;
  }
};

