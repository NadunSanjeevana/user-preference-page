const AppConfig = {
  // API Configuration
  api: {
    baseUrl: '/api/v1',
    timeout: 30000,
    retryAttempts: 3
  },

  // Theme Configuration
  themes: {
    light: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#ffffff',
      text: '#333333',
      accent: '#4caf50'
    },
    dark: {
      primary: '#764ba2',
      secondary: '#667eea',
      background: '#1a1a1a',
      text: '#ffffff',
      accent: '#45a049'
    }
  },

  // Form Configuration
  forms: {
    account: {
      username: {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9._-]+$/
      },
      password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true
      }
    },
    notifications: {
      frequency: ['immediate', 'hourly', 'daily', 'weekly', 'never']
    },
    theme: {
      colorSchemes: ['light', 'dark', 'auto'],
      fontSizes: ['small', 'medium', 'large', 'extra-large'],
      layouts: ['standard', 'compact', 'spacious']
    },
    privacy: {
      visibility: ['public', 'friends', 'private']
    }
  },

  // Storage Configuration
  storage: {
    key: 'user_preferences',
    autoSaveInterval: 30000
  },

  // Accessibility Configuration
  accessibility: {
    keyboardShortcuts: {
      nextTab: 'Alt + ArrowRight',
      previousTab: 'Alt + ArrowLeft',
      save: 'Ctrl + S',
      reset: 'Ctrl + R'
    },
    ariaLabels: {
      accountTab: 'Account Settings',
      notificationsTab: 'Notification Settings',
      themeTab: 'Theme Settings',
      privacyTab: 'Privacy Settings'
    }
  },

  // Responsive Design Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  },

  // Error Messages
  messages: {
    errors: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidUsername: 'Username must be 3-20 characters, alphanumeric only',
      invalidPhone: 'Please enter a valid phone number',
      saveFailed: 'Failed to save preferences',
      loadFailed: 'Failed to load preferences'
    },
    success: {
      saved: 'Preferences saved successfully',
      reset: 'Preferences reset to defaults',
      imported: 'Preferences imported successfully',
      exported: 'Preferences exported successfully'
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppConfig;
} 