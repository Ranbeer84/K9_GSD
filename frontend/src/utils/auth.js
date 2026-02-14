// Token management utilities

const TOKEN_KEY = 'admin_token';

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null} - JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== undefined && token !== '';
};

/**
 * Decode JWT token (without verification - for display purposes only)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get current admin username from token
 * @returns {string|null} - Username or null
 */
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  
  const decoded = decodeToken(token);
  return decoded?.username || null;
};

/**
 * Logout user (clear token and redirect)
 * @param {function} navigate - React Router navigate function
 */
export const logout = (navigate) => {
  removeToken();
  if (navigate) {
    navigate('/admin/login');
  }
};

/**
 * Check authentication and redirect if needed
 * Used in protected routes
 * @param {function} navigate - React Router navigate function
 * @returns {boolean} - True if authenticated
 */
export const checkAuth = (navigate) => {
  const token = getToken();
  
  if (!token || isTokenExpired(token)) {
    removeToken();
    if (navigate) {
      navigate('/admin/login');
    }
    return false;
  }
  
  return true;
};

/**
 * Get authorization header for API requests
 * @returns {object} - Authorization header object
 */
export const getAuthHeader = () => {
  const token = getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  return {};
};

export default {
  setToken,
  getToken,
  removeToken,
  isAuthenticated,
  decodeToken,
  isTokenExpired,
  getCurrentUser,
  logout,
  checkAuth,
  getAuthHeader
};