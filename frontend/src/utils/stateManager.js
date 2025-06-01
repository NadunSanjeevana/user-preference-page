import ApiService from '../services/api.js';

class StateManager {
  constructor() {
    this.apiService = new ApiService();
    this.state = {
      account: null,
      notifications: null,
      theme: null,
      privacy: null,
      loading: false,
      error: null
    };
    this.listeners = [];
    this.themeListeners = [];
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    // Immediately notify with current state
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Subscribe to theme changes specifically
  subscribeToTheme(listener) {
    this.themeListeners.push(listener);
    // Immediately notify with current theme
    if (this.state.theme) {
      listener(this.state.theme);
    }
    return () => {
      this.themeListeners = this.themeListeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Notify theme listeners
  notifyThemeListeners() {
    if (this.state.theme) {
      this.themeListeners.forEach(listener => listener(this.state.theme));
    }
  }

  // Update state and notify listeners
  setState(newState) {
    const oldTheme = this.state.theme;
    this.state = { ...this.state, ...newState };
    
    // If theme has changed, notify theme listeners
    if (newState.theme && JSON.stringify(oldTheme) !== JSON.stringify(newState.theme)) {
      this.notifyThemeListeners();
    }
    
    this.notify();
  }

  // Load all user preferences
  async loadUserPreferences() {
    try {
      this.setState({ loading: true, error: null });
      const preferences = await this.apiService.fetchPreferences();
      
      if (!preferences) {
        // If no preferences are returned, use default state
        this.setState({
          account: null,
          notifications: null,
          theme: null,
          privacy: null,
          loading: false
        });
        return null;
      }

      this.setState({
        account: preferences.account,
        notifications: preferences.notifications,
        theme: preferences.theme,
        privacy: preferences.privacy,
        loading: false
      });
      return preferences;
    } catch (error) {
      this.setState({ 
        error: error.message, 
        loading: false,
        account: null,
        notifications: null,
        theme: null,
        privacy: null
      });
      throw error;
    }
  }

  // Update specific preferences
  async updatePreferences(type, data) {
    try {
      this.setState({ loading: true, error: null });
      const response = await this.apiService.updatePreferences({ [type]: data });
      
      // Update state and trigger appropriate notifications
      if (type === 'theme') {
        this.setState({
          theme: response.theme,
          loading: false
        });
      } else {
        this.setState({
          [type]: response[type],
          loading: false
        });
      }
      
      return response;
    } catch (error) {
      this.setState({ error: error.message, loading: false });
      throw error;
    }
  }

  // Validate form data
  validateForm(type, data) {
    const validators = {
      account: this.validateAccountData,
      notifications: this.validateNotificationData,
      theme: this.validateThemeData,
      privacy: this.validatePrivacyData
    };

    const validator = validators[type];
    if (!validator) {
      throw new Error(`No validator found for type: ${type}`);
    }

    return validator(data);
  }

  // Form validators
  validateAccountData(data) {
    const errors = {};
    if (!data.firstName?.trim()) errors.firstName = 'First name is required';
    if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    return Object.keys(errors).length === 0 ? null : errors;
  }

  validateNotificationData(data) {
    // No complex validation needed for notification preferences
    return null;
  }

  validateThemeData(data) {
    const errors = {};
    if (!data.colorScheme) errors.colorScheme = 'Color scheme is required';
    if (!data.fontSize) errors.fontSize = 'Font size is required';
    return Object.keys(errors).length === 0 ? null : errors;
  }

  validatePrivacyData(data) {
    const errors = {};
    if (!data.profileVisibility) errors.profileVisibility = 'Profile visibility is required';
    return Object.keys(errors).length === 0 ? null : errors;
  }
}

// Create and export a singleton instance
const stateManager = new StateManager();
export default stateManager; 