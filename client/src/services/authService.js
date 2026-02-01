import apiClient from './apiClient';

/**
 * SSO Authentication Service
 * Uses hydra-saml-auth for authentication via np_access cookie
 */
const authService = {
  /**
   * Get current user from SSO session
   * @returns {Promise<Object|null>} User object or null if not authenticated
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/auth/me', {
        withCredentials: true
      });
      if (response.data.authenticated) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  /**
   * Redirect to SSO login
   * @param {string} returnTo - URL to return to after login
   */
  login(returnTo = window.location.pathname) {
    window.location.href = '/login?returnTo=' + encodeURIComponent(returnTo);
  },

  /**
   * Redirect to SSO logout
   */
  logout() {
    window.location.href = '/logout';
  },

  /**
   * Check if user is authenticated (async)
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  },

  // Legacy methods for backwards compatibility
  getToken() {
    // SSO uses cookies, not localStorage tokens
    return null;
  }
};

export default authService;
