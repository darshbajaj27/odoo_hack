// frontend/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // 1. Get the token from localStorage (if you saved it there during login)
  const token = localStorage.getItem('token');

  // 2. Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // 3. Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 4. Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API Request Failed');
  }

  // 5. Return data
  return response.json();
}