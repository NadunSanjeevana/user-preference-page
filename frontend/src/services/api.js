import ErrorHandler from '../utils/errorHandler.js';

class ApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api/v1';
    this.endpoints = {
      preferences: '/preferences/',
      myPreferences: '/preferences/my_preferences/',
      token: '/token/',
      tokenRefresh: '/token/refresh/',
      register: '/register/'
    };
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      return data;
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await fetch(`${this.baseUrl}${this.endpoints.tokenRefresh}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');
      
      const data = await response.json();
      localStorage.setItem('token', data.access);
      return data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }

  async fetchPreferences() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.myPreferences}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 401) {
        await this.refreshToken();
        return this.fetchPreferences();
      }

      if (!response.ok) throw new Error('Failed to fetch preferences');
      return await response.json();
    } catch (error) {
      ErrorHandler.handleApiError(error);
      throw error;
    }
  }

  async updatePreferences(preferences) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.myPreferences}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences)
      });

      if (response.status === 401) {
        await this.refreshToken();
        return this.updatePreferences(preferences);
      }

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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences)
      });

      if (response.status === 401) {
        await this.refreshToken();
        return this.createPreferences(preferences);
      }

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