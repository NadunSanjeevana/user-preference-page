import stateManager from './utils/stateManager.js';
import AccountForm from './components/account/AccountForm.js';
import NotificationForm from './components/notifications/NotificationForm.js';
import ThemeForm from './components/theme/ThemeForm.js';
import PrivacyForm from './components/privacy/PrivacyForm.js';
import authService from './services/authService.js';
import ApiService from './services/api.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import PreferencesPage from './pages/PreferencesPage.js';

// Application State Management
class PreferencesState {
  constructor() {
    this.data = {
      account: { username: '', email: '', firstName: '', lastName: '', phone: '' },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        frequency: 'daily',
        marketingEmails: false,
        securityAlerts: true,
      },
      theme: {
        colorScheme: 'light',
        fontSize: 'medium',
        layout: 'standard',
        animations: true,
        compactMode: false,
      },
      privacy: {
        profileVisibility: 'friends',
        dataSharing: false,
        analyticsTracking: true,
        locationSharing: false,
        activityStatus: true,
        searchableProfile: true,
      },
    };
    this.originalData = JSON.parse(JSON.stringify(this.data));
  }

  hasChanges() {
    return JSON.stringify(this.data) !== JSON.stringify(this.originalData);
  }

  saveChanges() {
    this.originalData = JSON.parse(JSON.stringify(this.data));
  }

  resetChanges() {
    this.data = JSON.parse(JSON.stringify(this.originalData));
  }
}

// Initialize application state and API
const appState = new PreferencesState();
const api = new ApiService();

// Main application layout
const app = {
  container: 'preferences-app',
  view: 'layout',
  responsive: true,
  rows: [
    {
      view: 'multiview',
      id: 'appView',
      responsive: true,
      animate: true,
      cells: [
        {
          id: 'login',
          view: 'layout',
          rows: [
            LoginPage({
              onLoginSuccess: async () => {
                await loadUserPreferences();
                showView('preferences');
              },
              onSwitchToRegister: () => showView('register'),
            }),
          ],
        },
        {
          id: 'register',
          view: 'layout',
          rows: [
            RegisterPage({
              onRegisterSuccess: async () => {
                await loadUserPreferences();
                showView('preferences');
              },
              onSwitchToLogin: () => showView('login'),
            }),
          ],
        },
        {
          id: 'preferences',
          view: 'layout',
          rows: [
            PreferencesPage({
              onLogout: () => {
                authService.clearTokens();
                showView('login');
                webix.message({ type: 'success', text: 'Logged out successfully' });
              },
            }),
          ],
        },
      ],
    },
  ],
};

// View navigation
function showView(viewName) {
  const appView = $$('appView');
  if (appView) {
    appView.setValue(viewName);
  }
}

// Initialize the application
function initApp() {
  try {
    const isAuthenticated = authService?.isAuthenticated?.() || false;

    if (isAuthenticated) {
      showView('preferences');
      loadUserPreferences();
    } else {
      showView('login');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    showView('login');
  }
}

// Loading management
function showLoading() {
  webix
    .ui({
      view: 'window',
      id: 'loadingPopup',
      modal: true,
      position: 'center',
      head: false,
      body: {
        view: 'template',
        template: `<div style="text-align: center; padding: 20px;">
        <div class="webix_loading" style="margin-bottom: 15px;"></div>
        <div>Loading preferences...</div>
      </div>`,
      },
    })
    .show();
}

function hideLoading() {
  const popup = $$('loadingPopup');
  if (popup) popup.close();
}

// Save preferences
async function saveAllPreferences() {
  try {
    if (api?.saveUserPreferences) {
      await api.saveUserPreferences(appState.data);
      appState.saveChanges();
      webix.message({ type: 'success', text: 'Preferences saved successfully' });
    } else {
      appState.saveChanges();
      webix.message({ type: 'success', text: 'Preferences saved locally' });
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    webix.message({ type: 'error', text: 'Failed to save preferences' });
  }
}

// Reset forms
function resetAllForms() {
  try {
    appState.resetChanges();

    ['accountForm', 'notificationForm', 'themeForm', 'privacyForm'].forEach(formId => {
      const form = $$(formId);
      if (form?.clear) form.clear();
    });

    applyThemeSettings();
    webix.message({ type: 'info', text: 'All changes reset' });
  } catch (error) {
    console.error('Error resetting forms:', error);
    webix.message({ type: 'error', text: 'Failed to reset forms' });
  }
}

// Apply theme settings
function applyThemeSettings() {
  const colorScheme = appState.data.theme?.colorScheme || 'light';

  // Set CSS variables
  const root = document.documentElement;
  root.style.setProperty('--webix-form-background', colorScheme === 'dark' ? '#2d2d2d' : '#ffffff');
  root.style.setProperty('--webix-form-text', colorScheme === 'dark' ? '#ffffff' : '#333333');
  root.style.setProperty('--webix-form-border', colorScheme === 'dark' ? '#404040' : '#e0e0e0');

  // Apply dark theme classes
  document.body.classList.toggle('webix_dark', colorScheme === 'dark');
  document.body.classList.toggle('webix_dark_form', colorScheme === 'dark');

  // Update form elements
  document.querySelectorAll('.webix_form').forEach(form => {
    form.classList.toggle('webix_dark_form', colorScheme === 'dark');
  });

  webix.ui.resize();
}

// Load user preferences
async function loadUserPreferences() {
  try {
    showLoading();

    const preferences = await api.fetchPreferences();

    if (preferences) {
      Object.assign(appState.data, preferences);

      // Update state manager
      if (stateManager?.setState) {
        stateManager.setState(preferences);
      }

      // Apply to forms
      ['accountForm', 'notificationForm', 'themeForm', 'privacyForm'].forEach(formId => {
        const form = $$(formId);
        const formType = formId.replace('Form', '');

        if (form && preferences[formType]) {
          try {
            form.setValues(preferences[formType]);
          } catch (e) {
            console.warn(`Could not set values for ${formId}:`, e);
          }
        }
      });

      applyThemeSettings();
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
    webix.message({ type: 'error', text: 'Failed to load preferences: ' + error.message });
  } finally {
    hideLoading();
  }
}

// Setup state manager integration
function setupStateManagerIntegration() {
  if (stateManager?.subscribe) {
    stateManager.subscribe(state => {
      if (state?.theme && appState.data) {
        appState.data.theme = state.theme;
        applyThemeSettings();
      }
    });
  }
}

// Global error handler
webix.attachEvent('onLoadError', function (text, xml, xhttp, obj) {
  console.error('Webix load error:', text, obj);
  webix.message({
    type: 'error',
    text: 'Failed to load component data',
    expire: 5000,
  });
});

// Initialize the application when Webix is ready
webix.ready(() => {
  try {
    webix.ui(app);

    setTimeout(() => {
      window.appState = appState;
      initApp();
      setupStateManagerIntegration();
      applyThemeSettings();
    }, 100);
  } catch (error) {
    console.error('Failed to initialize application:', error);
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h2>Application Failed to Load</h2>
        <p>Please refresh the page and try again.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PreferencesState,
    saveAllPreferences,
    resetAllForms,
    loadUserPreferences,
    showView,
  };
}
