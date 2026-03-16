/**
 * API Client Utility
 * Handles all API requests with automatic token inclusion
 */

//const API_BASE_URL = "https://attendict.vercel.app";

// For production:
 const API_BASE_URL = "https://attendict.onrender.com";

/**
 * Get stored authentication token
 * @returns {string|null} - The auth token or null if not found
 */
function getAuthToken() {
  return localStorage.getItem("authToken");
}

/**
 * Generic fetch wrapper with token authentication
 * @param {string} endpoint - API endpoint (e.g., '/api/login-details')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
export async function apiCall(endpoint, options = {}) {
  try {
    const token = getAuthToken();

    // Build headers with optional Authorization header
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'omit',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // If token expired, clear it and redirect to login
    if (response.status === 401 && data.message?.includes("expired")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("personType");
      window.location.href = "/";
      return null;
    }

    return {
      status: response.status,
      data: data,
      ok: response.ok,
    };
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

/**
 * POST request with authentication
 */
export async function apiPost(endpoint, body) {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * GET request with authentication
 */
export async function apiGet(endpoint) {
  return apiCall(endpoint, {
    method: "GET",
  });
}

/**
 * DELETE request with authentication
 */
export async function apiDelete(endpoint, body = null) {
  return apiCall(endpoint, {
    method: "DELETE",
    ...(body && { body: JSON.stringify(body) }),
  });
}

/**
 * Logout - Invalidates session token
 */
export async function apiLogout() {
  const response = await apiCall("/api/logout", {
    method: "POST",
  });

  // Clear stored token and user data
  localStorage.removeItem("authToken");
  localStorage.removeItem("personType");

  return response;
}
