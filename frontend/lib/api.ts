// frontend/lib/api.ts

const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  : 'http://localhost:5000/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Get the token from localStorage (if available)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  // Set default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...((options.headers as Record<string, string>) || {}),
  };

  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Request Failed' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  // Return data
  return response.json();
}

// ============= AUTH API =============
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, name: string) =>
    fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  forgotPassword: (email: string) =>
    fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email: string, otp: string) =>
    fetchAPI('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  resetPassword: (email: string, token: string, newPassword: string) =>
    fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, newPassword }),
    }),
};

// ============= PRODUCTS API =============
export const productsAPI = {
  getAll: (page = 1, limit = 10, search = '') =>
    fetchAPI(`/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getById: (id: string) =>
    fetchAPI(`/products/${id}`),

  create: (productData: any) =>
    fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  update: (id: string, productData: any) =>
    fetchAPI(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    }),

  delete: (id: string) =>
    fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    }),

  adjustStock: (id: string, quantity: number) =>
    fetchAPI(`/products/${id}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    }),
};

// ============= OPERATIONS API =============
export const operationsAPI = {
  getAll: (page = 1, limit = 10, status?: string, type?: string) => {
    let url = `/operations?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (type) url += `&type=${type}`;
    return fetchAPI(url);
  },

  getById: (id: string) =>
    fetchAPI(`/operations/${id}`),

  create: (operationData: any) =>
    fetchAPI('/operations', {
      method: 'POST',
      body: JSON.stringify(operationData),
    }),

  update: (id: string, operationData: any) =>
    fetchAPI(`/operations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(operationData),
    }),

  delete: (id: string) =>
    fetchAPI(`/operations/${id}`, {
      method: 'DELETE',
    }),

  validate: (id: string) =>
    fetchAPI(`/operations/${id}/validate`, {
      method: 'POST',
    }),

  cancel: (id: string) =>
    fetchAPI(`/operations/${id}/cancel`, {
      method: 'POST',
    }),
};

// ============= DASHBOARD API =============
export const dashboardAPI = {
  getStats: () =>
    fetchAPI('/dashboard/stats'),

  getRecentOperations: (limit = 5) =>
    fetchAPI(`/dashboard/recent-operations?limit=${limit}`),

  getLowStockAlerts: () =>
    fetchAPI('/dashboard/low-stock-alerts'),

  getOperationMetrics: (days = 30) =>
    fetchAPI(`/dashboard/metrics?days=${days}`),
};

// ============= MOVES API =============
export const movesAPI = {
  getAll: (page = 1, limit = 10) =>
    fetchAPI(`/moves?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    fetchAPI(`/moves/${id}`),

  create: (moveData: any) =>
    fetchAPI('/moves', {
      method: 'POST',
      body: JSON.stringify(moveData),
    }),
};

// ============= SEARCH API =============
export const searchAPI = {
  search: (query: string) =>
    fetchAPI(`/search?q=${encodeURIComponent(query)}`),

  searchProducts: (query: string) =>
    fetchAPI(`/search/products?q=${encodeURIComponent(query)}`),

  searchOperations: (query: string) =>
    fetchAPI(`/search/operations?q=${encodeURIComponent(query)}`),
};

// ============= SETTINGS API =============
export const settingsAPI = {
  getSettings: () =>
    fetchAPI('/settings'),

  updateSettings: (settingsData: any) =>
    fetchAPI('/settings', {
      method: 'PATCH',
      body: JSON.stringify(settingsData),
    }),

  getPreferences: () =>
    fetchAPI('/settings/preferences'),

  updatePreferences: (preferencesData: any) =>
    fetchAPI('/settings/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferencesData),
    }),
};