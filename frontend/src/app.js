import stateManager from './utils/stateManager.js';
import AccountForm from './components/account/AccountForm.js';
import NotificationForm from './components/notifications/NotificationForm.js';
import ThemeForm from './components/theme/ThemeForm.js';
import PrivacyForm from './components/privacy/PrivacyForm.js';
import Login from './components/auth/Login.js';
import Register from './components/auth/Register.js';
import authService from './services/authService.js';
import ApiService from './services/api.js';
import LanguageSelector from './components/common/LanguageSelector.js';
import languageService from './services/languageService.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import PreferencesPage from './pages/PreferencesPage.js';

// Application State Management
class PreferencesState {
  constructor() {
    this.data = {
      account: {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: ""
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        frequency: "daily",
        marketingEmails: false,
        securityAlerts: true
      },
      theme: {
        colorScheme: "light",
        fontSize: "medium",
        layout: "standard",
        animations: true,
        compactMode: false
      },
      privacy: {
        profileVisibility: "friends",
        dataSharing: false,
        analyticsTracking: true,
        locationSharing: false,
        activityStatus: true,
        searchableProfile: true
      },
      preferences: {
        title: "User Preferences"
      }
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

// Initialize application state
const appState = new PreferencesState();
const api = new ApiService();

// Initialize components with fallback functions if imports fail
let accountForm, notificationForm, themeForm, privacyForm, loginForm, registerForm;

try {
  accountForm = AccountForm();
  notificationForm = NotificationForm();
  themeForm = ThemeForm();
  privacyForm = PrivacyForm();
} catch (error) {
  console.warn("Some form components failed to initialize:", error);
  // Create fallback forms
  accountForm = createFallbackForm("account");
  notificationForm = createFallbackForm("notifications");
  themeForm = createFallbackForm("theme");
  privacyForm = createFallbackForm("privacy");
}

// Create fallback form function
function createFallbackForm(type) {
  return {
    view: "form",
    id: `${type}Form`,
    elements: [
      {
        view: "template",
        template: `<div class="fallback-form">
          <h3>${type.charAt(0).toUpperCase() + type.slice(1)} Settings</h3>
          <p>This section is loading...</p>
        </div>`,
        height: 200
      }
    ]
  };
}

// Initialize auth forms with callback functions
try {
  loginForm = Login({
  onSuccess: function() {
    console.log("Login successful, switching to authenticated view");
    showAuthenticatedView("account");
    loadUserPreferences();
  },
  onError: function(error) {
    console.error("Login error:", error);
    webix.message({ type: "error", text: error.message || "Login failed. Please try again." });
  }
});

  registerForm = Register({
  onSuccess: function() {
    console.log("Registration successful, switching to authenticated view");
    showAuthenticatedView("account");
    loadUserPreferences();
  },
  onError: function(error) {
    console.error("Registration error:", error);
    webix.message({ type: "error", text: error.message || "Registration failed. Please try again." });
  },
  onSwitchToLogin: function() {
    console.log("Switching to login view");
    showUnauthenticatedView("login");
  }
});
} catch (error) {
  console.warn("Auth forms failed to initialize:", error);
  // Create fallback auth forms
  loginForm = createFallbackAuthForm("login");
  registerForm = createFallbackAuthForm("register");
}

// Create fallback auth form
function createFallbackAuthForm(type) {
  return {
    view: "form",
    id: `${type}Form`,
    elements: [
      {
        view: "template",
        template: `<div class="fallback-auth">
          <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <p>Authentication form is loading...</p>
        </div>`,
        height: 300
      }
    ]
  };
}

// Main application layout with proper initial views
const app = {
  container: "preferences-app",
  view: "layout",
  responsive: true,
  rows: [
    {
      view: "multiview",
      id: "appView",
      responsive: true,
      animate: true,
      cells: [
        {
          id: "login",
          view: "layout",
          rows: [
            LoginPage({
              onLoginSuccess: () => {
                showPreferencesPage();
                loadUserPreferences();
              },
              onSwitchToRegister: () => {
                showRegisterPage();
              }
            })
          ]
        },
        {
          id: "register", 
          view: "layout",
          rows: [
            RegisterPage({
              onRegisterSuccess: () => {
                showPreferencesPage();
                loadUserPreferences();
              },
              onSwitchToLogin: () => {
                showLoginPage();
              }
            })
          ]
        },
        {
          id: "preferences",
          view: "layout",
          rows: [
            PreferencesPage({
              onLogout: () => {
                authService.clearTokens();
                showLoginPage();
                webix.message({ type: "success", text: "Logged out successfully" });
              }
            })
          ]
        }
      ]
    }
  ]
};

// Initialize the application
function initApp() {
  try {
    // Check authentication status
    const isAuthenticated = authService && authService.isAuthenticated ? authService.isAuthenticated() : false;
    
    if (isAuthenticated) {
      showPreferencesPage();
      loadUserPreferences();
    } else {
      showLoginPage();
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    // Fallback to login page
    showLoginPage();
  }
}

// Show login page
function showLoginPage() {
  const appView = $$("appView");
  if (appView) {
    appView.setValue("login");
  }
}

// Show register page
function showRegisterPage() {
  const appView = $$("appView");
  if (appView) {
    appView.setValue("register");
  }
}

// Show preferences page
function showPreferencesPage() {
  const appView = $$("appView");
  if (appView) {
    appView.setValue("preferences");
  }
}



// Save all preferences
async function saveAllPreferences() {
  try {
    if (api && api.saveUserPreferences) {
      await api.saveUserPreferences(appState.data);
      appState.saveChanges();
      webix.message({ type: "success", text: "Preferences saved successfully" });
    } else {
      // Fallback - just save to state
      appState.saveChanges();
      webix.message({ type: "success", text: "Preferences saved locally" });
    }
  } catch (error) {
    console.error("Error saving preferences:", error);
    webix.message({ type: "error", text: "Failed to save preferences" });
  }
}

// Reset all forms
function resetAllForms() {
  try {
    appState.resetChanges();
    
    // Reset individual forms if they have reset methods
    const forms = ["accountForm", "notificationForm", "themeForm", "privacyForm"];
    forms.forEach(formId => {
      const form = $$(formId);
      if (form && form.clear) {
        form.clear();
      }
    });
    
    // Reapply original settings
    applyThemeSettings();
    webix.message({ type: "info", text: "All changes reset" });
  } catch (error) {
    console.error("Error resetting forms:", error);
    webix.message({ type: "error", text: "Failed to reset forms" });
  }
}

// Helper function to show authenticated view
function showAuthenticatedView(viewName = "account") {
  const mainView = $$("mainView");
  const sidebar = $$("mainSidebar");
  const actionButtonsView = $$("actionButtons");
  
  if (mainView) {
    mainView.setValue(viewName);
  }
  if (sidebar) {
    // Update sidebar data with current translations
    const translations = languageService && languageService.getTranslation ? languageService : {
      getTranslation: (key) => {
        const fallbacks = {
          'account.title': 'Account',
          'notifications.title': 'Notifications',
          'theme.title': 'Theme',
          'privacy.title': 'Privacy'
        };
        return fallbacks[key] || key;
      }
    };
    
    sidebar.define({
      data: [
        { id: "account", icon: "mdi mdi-account", value: translations.getTranslation('account.title') },
        { id: "notifications", icon: "mdi mdi-bell", value: translations.getTranslation('notifications.title') },
        { id: "theme", icon: "mdi mdi-palette", value: translations.getTranslation('theme.title') },
        { id: "privacy", icon: "mdi mdi-shield", value: translations.getTranslation('privacy.title') }
      ]
    });
    sidebar.refresh();
    sidebar.show();
    sidebar.select(viewName);
    sidebar.render();
  }
  if (actionButtonsView) {
    actionButtonsView.show();
  }
}

// Helper function to show unauthenticated view
function showUnauthenticatedView(viewName = "login") {
  const mainView = $$("mainView");
  const sidebar = $$("mainSidebar");
  const actionButtonsView = $$("actionButtons");
  
  if (mainView) {
    mainView.setValue(viewName);
  }
  if (sidebar) {
    sidebar.hide();
    sidebar.unselectAll();
  }
  if (actionButtonsView) {
    actionButtonsView.hide();
  }
}

// Apply theme settings with proper dark theme support
function applyThemeSettings() {
  const preferences = stateManager.state;
  const colorScheme = preferences?.theme?.colorScheme || 'light';
  
  // Set CSS variables for theme colors
  document.documentElement.style.setProperty('--webix-form-background', colorScheme === 'dark' ? '#2d2d2d' : '#ffffff');
  document.documentElement.style.setProperty('--webix-form-text', colorScheme === 'dark' ? '#ffffff' : '#333333');
  document.documentElement.style.setProperty('--webix-form-border', colorScheme === 'dark' ? '#404040' : '#e0e0e0');
  
  // Apply dark theme class to body
  if (colorScheme === 'dark') {
    document.body.classList.add('webix_dark');
    document.body.classList.add('webix_dark_form');
  } else {
    document.body.classList.remove('webix_dark');
    document.body.classList.remove('webix_dark_form');
  }
  
  // Apply theme to all form elements
  const formElements = document.querySelectorAll('.webix_form');
  formElements.forEach(form => {
    if (colorScheme === 'dark') {
      form.classList.add('webix_dark_form');
  } else {
      form.classList.remove('webix_dark_form');
    }
  });
  
  // Force Webix to redraw all components
  webix.ui.resize();
}

// Enhanced state manager integration
function enhanceStateManagerThemeIntegration() {
  // Subscribe to theme changes from state manager
  if (stateManager && stateManager.subscribeToTheme) {
    stateManager.subscribeToTheme((theme) => {
      console.log('Theme change detected from state manager:', theme);
      if (appState && appState.data) {
        appState.data.theme = theme;
    applyThemeSettings();
  }
    });
  }

  // Subscribe to general state changes
  if (stateManager && stateManager.subscribe) {
    stateManager.subscribe((state) => {
      if (state && state.theme && appState && appState.data) {
        console.log('General state change with theme:', state.theme);
        appState.data.theme = state.theme;
        applyThemeSettings();
      }
    });
  }
}

// Enhanced initialization function
function initAppWithTheme() {
  try {
    // Make appState globally available
    window.appState = appState;
    
    // Check authentication status
    const isAuthenticated = authService && authService.isAuthenticated ? authService.isAuthenticated() : false;
    
    if (isAuthenticated) {
      showPreferencesPage();
      loadUserPreferences();
    } else {
      showLoginPage();
    }
    
    // Apply initial theme
    applyThemeSettings();
    
    // Setup theme integration
    enhanceStateManagerThemeIntegration();
    
  } catch (error) {
    console.error("Error initializing app:", error);
    // Fallback to login page
    showLoginPage();
  }
}

// Enhanced preferences loading function
async function loadUserPreferences() {
  try {
    // Show loading message
    webix.message({ type: "info", text: "Loading preferences..." });
    
    // Fetch preferences from backend
    const preferences = await api.fetchPreferences();
    
    if (preferences) {
      // Update app state
      Object.assign(appState.data, preferences);
      
      // Update state manager
      if (stateManager && stateManager.setState) {
        stateManager.setState(preferences);
      }
      
      // Apply preferences to forms
      const forms = ["accountForm", "notificationForm", "themeForm", "privacyForm"];
      forms.forEach(formId => {
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
      
      // Apply theme settings immediately
      if (preferences.theme) {
        applyThemeSettings();
      }
      
      webix.message({ type: "success", text: "Preferences loaded successfully" });
    } else {
      // If no preferences exist, create default preferences
      const defaultPreferences = {
        account: {
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: ""
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          frequency: "daily",
          marketingEmails: false,
          securityAlerts: true
        },
        theme: {
          colorScheme: "light",
          fontSize: "medium",
          layout: "standard",
          animations: true,
          compactMode: false
        },
        privacy: {
          profileVisibility: "friends",
          dataSharing: false,
          analyticsTracking: true,
          locationSharing: false,
          activityStatus: true,
          searchableProfile: true
        }
      };
      
      // Create default preferences in backend
      await api.createPreferences(defaultPreferences);
      
      // Update local state
      Object.assign(appState.data, defaultPreferences);
      if (stateManager && stateManager.setState) {
        stateManager.setState(defaultPreferences);
      }
      
      // Apply default theme
      applyThemeSettings();
      
      webix.message({ type: "info", text: "Default preferences created" });
    }
  } catch (error) {
    console.error("Error loading preferences:", error);
    webix.message({ type: "error", text: "Failed to load preferences: " + error.message });
  }
}

// Enhanced preferences application function
function applyPreferencesToForms(preferences) {
  try {
    if (preferences) {
      // Update app state
      Object.assign(appState.data, preferences);
      
      // Apply theme settings immediately
      if (preferences.theme) {
        applyThemeSettings();
      }
      
      // Update individual forms
      const forms = ["accountForm", "notificationForm", "themeForm", "privacyForm"];
      forms.forEach(formId => {
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
    }
  } catch (error) {
    console.error("Error applying preferences:", error);
  }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener("keydown", function(e) {
    // Alt + number shortcuts for navigation
    if (e.altKey && e.key >= "1" && e.key <= "4") {
      e.preventDefault();
      const mainView = $$("mainView");
      const sidebar = $$("mainSidebar");
      
      if (mainView && sidebar && !sidebar.isHidden()) {
        const tabIndex = parseInt(e.key) - 1;
        const items = ["account", "notifications", "theme", "privacy"];
        if (items[tabIndex]) {
          mainView.setValue(items[tabIndex]);
          sidebar.select(items[tabIndex]);
        }
      }
    }

    // Escape key to focus main container
    if (e.key === "Escape") {
      const container = document.querySelector(".preferences-container");
      if (container) {
        container.focus();
      }
    }
  });
}

// Enhance accessibility
function enhanceAccessibility() {
  // Add ARIA roles and labels
  const sidebar = $$("mainSidebar");
  if (sidebar && sidebar.$view) {
    sidebar.$view.setAttribute("role", "navigation");
    sidebar.$view.setAttribute("aria-label", "User preferences categories");
  }

  // Add keyboard focus styles
  const style = document.createElement('style');
  style.textContent = `
    .webix_view:focus {
      outline: 2px solid var(--primary-color, #2196F3);
      outline-offset: 2px;
    }
    .webix_button:focus {
      outline: 2px solid var(--primary-color, #2196F3);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// Global error handler for Webix components
webix.attachEvent("onLoadError", function(text, xml, xhttp, obj) {
  console.error("Webix load error:", text, obj);
  webix.message({
    type: "error",
    text: "Failed to load component data",
    expire: 5000
  });
});

// Initialize the application when Webix is ready
webix.ready(() => {
  try {
    // Create the UI
    webix.ui(app);
    
    // Initialize the app with theme support
  setTimeout(() => {
      // Make appState globally available
      window.appState = appState;
      
      // Check authentication status
      const isAuthenticated = authService && authService.isAuthenticated ? authService.isAuthenticated() : false;
      
      if (isAuthenticated) {
        showPreferencesPage();
      loadUserPreferences();
    } else {
        showLoginPage();
      }
      
      // Setup theme integration
      enhanceStateManagerThemeIntegration();
      
      // Setup additional features
    setupKeyboardNavigation();
    enhanceAccessibility();

      // Apply initial theme after everything is loaded
      setTimeout(() => {
    applyThemeSettings();
      }, 200);
    }, 100);
  } catch (error) {
    console.error("Failed to initialize application:", error);
    // Show error message to user
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h2>Application Failed to Load</h2>
        <p>Please refresh the page and try again.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
});

// Handle system theme changes for auto mode
function handleSystemThemeChange(e) {
  if (appState.data.theme.colorScheme === "auto") {
          applyThemeSettings();
        }
}

// Update theme preview
function updateThemePreview(colorScheme) {
  try {
  const preview = $$("themePreview");
  if (!preview) return;
  
  let className = "theme-light";
  let text = "Theme Preview - Light Mode";

  switch (colorScheme) {
    case "dark":
      className = "theme-dark";
      text = "Theme Preview - Dark Mode";
      break;
    case "auto":
      const isDarkAuto = window.matchMedia("(prefers-color-scheme: dark)").matches;
      className = isDarkAuto ? "theme-dark" : "theme-light";
      text = `Theme Preview - Auto Mode (${isDarkAuto ? 'Dark' : 'Light'})`;
      break;
  }

  preview.setHTML(`<div class="theme-preview ${className}">${text}</div>`);
    preview.refresh();
  } catch (error) {
    console.error("Error updating theme preview:", error);
  }
}

// Subscribe to language changes for sidebar and toolbar
if (languageService && languageService.subscribe) {
languageService.subscribe(() => {
    try {
  // Update sidebar
  const sidebar = $$("mainSidebar");
  if (sidebar) {
    sidebar.define({
      data: [
        { id: "account", icon: "mdi mdi-account", value: languageService.getTranslation('account.title') },
        { id: "notifications", icon: "mdi mdi-bell", value: languageService.getTranslation('notifications.title') },
        { id: "theme", icon: "mdi mdi-palette", value: languageService.getTranslation('theme.title') },
        { id: "privacy", icon: "mdi mdi-shield", value: languageService.getTranslation('privacy.title') }
      ]
    });
    sidebar.refresh();
  }

      // Update action buttons and toolbars
      updateTranslatedButtons();
    } catch (error) {
      console.error("Error updating translations:", error);
    }
  });
}

// Update translated buttons
function updateTranslatedButtons() {
  try {
  const actionButtons = $$("actionButtons");
  if (actionButtons) {
    const buttons = actionButtons.getChildViews();
    buttons.forEach(button => {
      if (button.config && button.config.value) {
          // Update button labels based on current translations
          if (button.config.value.includes('Save')) {
            button.define("value", languageService.getTranslation('save') || 'Save All');
          } else if (button.config.value.includes('Reset')) {
            button.define("value", languageService.getTranslation('reset') || 'Reset All');
        }
      }
    });
    actionButtons.refresh();
  }

  // Update toolbar buttons
    const toolbars = [$$("mainToolbar"), $$("loginToolbar"), $$("registerToolbar")];
  toolbars.forEach(toolbar => {
    if (toolbar) {
      const buttons = toolbar.getChildViews();
      buttons.forEach(button => {
        if (button.config && button.config.value) {
          if (button.config.value === "Logout") {
              button.define("value", languageService.getTranslation('logout') || 'Logout');
          } else if (button.config.value === "Login") {
              button.define("value", languageService.getTranslation('login') || 'Login');
          } else if (button.config.value === "Register") {
              button.define("value", languageService.getTranslation('register') || 'Register');
          }
        }
      });
      toolbar.refresh();
    }
  });
  } catch (error) {
    console.error("Error updating translated buttons:", error);
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PreferencesState,
    AccountForm,
    NotificationForm,
    ThemeForm,
    PrivacyForm,
    saveAllPreferences,
    resetAllForms,
    loadUserPreferences,
    showAuthenticatedView,
    showUnauthenticatedView
  };
}