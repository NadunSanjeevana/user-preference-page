import ErrorHandler from '../utils/errorHandler.js';

class ApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api/v1';  // Update with your backend URL
    this.endpoints = {
      preferences: '/preferences',
    };
  }

  async fetchPreferences() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.preferences}`, {
        method: 'GET',
        credentials: 'include',  // Include credentials
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
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
        credentials: 'include',  // Include credentials
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

  async createPreferences(preferences) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.preferences}`, {
        method: 'POST',
        credentials: 'include',  // Include credentials
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to create preferences');
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

export default ApiService; 