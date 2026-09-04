/**
 * GymForce API Service
 * Handles communication with FastAPI backend (http://localhost:8000),
 * including CORS with credentials and CSRF Double-Submit token handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

let cachedCsrfToken = null;

/**
 * Get cookie value by name
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * Fetch a fresh CSRF token from the backend
 */
export async function fetchCsrfToken() {
  try {
    const res = await fetch(`${API_BASE_URL.replace('/api', '')}/api/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      cachedCsrfToken = data.csrf_token;
      return data.csrf_token;
    }
  } catch (err) {
    console.warn('Failed to fetch CSRF token from backend:', err);
  }
  return null;
}

/**
 * Get the current CSRF token (from memory, cookie, or by fetching)
 */
export async function getCsrfToken() {
  const cookieToken = getCookie('csrftoken');
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
    return cookieToken;
  }
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }
  return await fetchCsrfToken();
}

/**
 * Core fetch wrapper with CORS credentials, CSRF token, and JWT Authorization
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  // Set Content-Type for JSON body if not set and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach JWT token if stored in sessionStorage or localStorage
  try {
    const savedUser = sessionStorage.getItem('gymforce_user') || localStorage.getItem('gymforce_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.access_token) {
        headers['Authorization'] = `Bearer ${parsed.access_token}`;
      }
    }
  } catch {
    // Ignore parse error
  }

  // For state-changing methods (POST, PUT, PATCH, DELETE), attach X-CSRF-Token
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  const fetchOptions = {
    ...options,
    method,
    headers,
    credentials: 'include', // Ensure cookies (like csrftoken) are sent with cross-origin requests
  };

  const response = await fetch(url, fetchOptions);

  // Update cached CSRF token if returned in header
  const newCsrf = response.headers.get('X-CSRF-Token');
  if (newCsrf) {
    cachedCsrfToken = newCsrf;
  }

  return response;
}

export default {
  apiRequest,
  getCsrfToken,
  fetchCsrfToken,
  getCookie,
};
