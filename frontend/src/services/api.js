class ApiService {
  constructor() {
    this.baseUrl = '/api/v1';
    this.endpoints = {
      preferences: '/preferences',
      account: '/account',
      notifications: '/notifications',
      theme: '/theme',
      privacy: '/privacy'
    };
  }

  async fetchPreferences() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.preferences}`);
      if (!response.ok) throw new Error('Failed to fetch preferences');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async updatePreferences(preferences) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.preferences}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to update preferences');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async updateAccount(accountData) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.account}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData)
      });
      if (!response.ok) throw new Error('Failed to update account');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async updateNotifications(notificationData) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.notifications}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });
      if (!response.ok) throw new Error('Failed to update notifications');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async updateTheme(themeData) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.theme}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData)
      });
      if (!response.ok) throw new Error('Failed to update theme');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async updatePrivacy(privacyData) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.privacy}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privacyData)
      });
      if (!response.ok) throw new Error('Failed to update privacy settings');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiService;
} 