import stateManager from './utils/stateManager.js';
import AccountForm from './components/account-form.js';
import NotificationForm from './components/notification-form.js';
import ThemeForm from './components/theme-form.js';
import PrivacyForm from './components/privacy-form.js';
import Login from './components/auth/Login.js';
import Register from './components/auth/Register.js';
import authService from './services/authService.js';
import ApiService from './services/api.js';

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

// Initialize components
const accountForm = AccountForm();
const notificationForm = NotificationForm();
const themeForm = ThemeForm();
const privacyForm = PrivacyForm();
const loginForm = Login();
const registerForm = Register();

// Create action buttons component
const actionButtons = {
  view: "toolbar",
  css: "account-buttons",
  elements: [
    {
      view: "button",
      value: "Save All",
      css: "webix_primary account-button",
      click: function() {
        saveAllPreferences();
      }
    },
    {
      view: "button", 
      value: "Reset All",
      css: "webix_secondary account-button",
      click: function() {
        if (confirm("Are you sure you want to reset all preferences to default values?")) {
          resetAllForms();
        }
      }
    },
    {
      view: "button",
      value: "Change Password", 
      css: "webix_change-password account-button",
      click: function() {
        webix.message("Change password functionality would go here");
      }
    }
  ]
};

// Main application layout
const mainLayout = {
  rows: [
    {
      cols: [
        {
          view: "sidebar",
          id: "mainSidebar",
          width: 250,
          css: "preferences-sidebar",
          hidden: true, // Initially hidden
          data: [
            { id: "account", value: "Account", icon: "wxi-user" },
            { id: "notifications", value: "Notifications", icon: "wxi-bell" },
            { id: "theme", value: "Theme", icon: "wxi-palette" },
            { id: "privacy", value: "Privacy", icon: "wxi-lock" }
          ],
          on: {
            onItemClick: function(id) {
              const mainView = $$("mainView");
              if (mainView) {
                console.log("Switching to view:", id);
                mainView.setValue(id);
                // Show action buttons only for authenticated views
                const actionButtonsView = $$("actionButtons");
                if (actionButtonsView) {
                  if (["account", "notifications", "theme", "privacy"].includes(id)) {
                    actionButtonsView.show();
                  } else {
                    actionButtonsView.hide();
                  }
                }
              }
            }
          }
        },
        {
          rows: [
            {
              view: "multiview",
              id: "mainView",
              animate: true,
              cells: [
                {
                  id: "login",
                  rows: [
                    {
                      view: "toolbar",
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Login", css: "webix_header" },
                        {},
                        {
                          view: "button",
                          label: "Register",
                          width: 100,
                          click: function() {
                            const mainView = $$("mainView");
                            if (mainView) {
                              mainView.setValue("register");
                            }
                          }
                        }
                      ]
                    },
                    loginForm
                  ]
                },
                {
                  id: "register", 
                  rows: [
                    {
                      view: "toolbar",
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Register", css: "webix_header" },
                        {},
                        {
                          view: "button",
                          label: "Login",
                          width: 100,
                          click: function() {
                            const mainView = $$("mainView");
                            if (mainView) {
                              mainView.setValue("login");
                            }
                          }
                        }
                      ]
                    },
                    registerForm
                  ]
                },
                {
                  id: "account",
                  rows: [
                    {
                      view: "toolbar",
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Account Settings", css: "webix_header" },
                        {},
                        {
                          view: "button",
                          label: "Logout",
                          width: 100,
                          click: function() {
                            authService.clearTokens();
                            const mainView = $$("mainView");
                            const sidebar = $$("mainSidebar");
                            const actionButtonsView = $$("actionButtons");
                            
                            if (mainView) {
                              mainView.setValue("login");
                            }
                            if (sidebar) {
                              sidebar.unselectAll();
                              sidebar.hide(); // Hide sidebar on logout
                            }
                            if (actionButtonsView) {
                              actionButtonsView.hide();
                            }
                            webix.message({ type: "success", text: "Logged out successfully" });
                          }
                        }
                      ]
                    },
                    {
                      view: "scrollview",
                      css: "preferences-main-scroll",
                      body: accountForm
                    }
                  ]
                },
                {
                  id: "notifications",
                  rows: [
                    {
                      view: "toolbar", 
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Notification Settings", css: "webix_header" }
                      ]
                    },
                    {
                      view: "scrollview",
                      css: "preferences-main-scroll",
                      body: notificationForm
                    }
                  ]
                },
                {
                  id: "theme",
                  rows: [
                    {
                      view: "toolbar",
                      css: "webix_dark", 
                      cols: [
                        { view: "label", label: "Theme Settings", css: "webix_header" }
                      ]
                    },
                    {
                      view: "scrollview",
                      css: "preferences-main-scroll",
                      body: themeForm
                    }
                  ]
                },
                {
                  id: "privacy",
                  rows: [
                    {
                      view: "toolbar",
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Privacy Settings", css: "webix_header" }
                      ]
                    },
                    {
                      view: "scrollview", 
                      css: "preferences-main-scroll",
                      body: privacyForm
                    }
                  ]
                }
              ]
            },
            {
              view: "toolbar",
              id: "actionButtons",
              css: "account-buttons",
              hidden: true,
              elements: [
                {
                  view: "button",
                  value: "Save All",
                  css: "webix_primary account-button",
                  click: function() {
                    saveAllPreferences();
                  }
                },
                {
                  view: "button",
                  value: "Reset All", 
                  css: "webix_secondary account-button",
                  click: function() {
                    if (confirm("Are you sure you want to reset all preferences to default values?")) {
                      resetAllForms();
                    }
                  }
                },
                {
                  view: "button",
                  value: "Change Password",
                  css: "webix_change-password account-button", 
                  click: function() {
                    webix.message("Change password functionality would go here");
                  }
                }
              ]
            }
          ]
        }
      ]
    },
  ]
};

// Helper function to show authenticated view
function showAuthenticatedView(viewName = "account") {
  const mainView = $$("mainView");
  const sidebar = $$("mainSidebar");
  const actionButtonsView = $$("actionButtons");
  
  if (mainView) {
    mainView.setValue(viewName);
  }
  if (sidebar) {
    sidebar.show(); // Show sidebar for authenticated users
    sidebar.select(viewName);
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
    sidebar.hide(); // Hide sidebar for unauthenticated users
    sidebar.unselectAll();
  }
  if (actionButtonsView) {
    actionButtonsView.hide();
  }
}

// Initialize the application
webix.ready(function() {
  console.log("Webix is ready");

  // Add loading indicator
  webix.ui({
    view: "window",
    id: "loadingWindow",
    position: "center",
    modal: true,
    head: "Loading",
    body: {
      view: "template",
      template: "Loading...",
      css: "loading-template"
    },
    hidden: true
  });

  // Create the main layout
  webix.ui(mainLayout, "preferences-app");
  console.log("Main layout created");

  // Wait a bit for components to initialize
  setTimeout(() => {
    // Check authentication status and show appropriate view
    const mainView = $$("mainView");
    
    if (!mainView) {
      console.error("MainView not found after initialization");
      return;
    }

    console.log("MainView initialized:", mainView);

    if (authService.isAuthenticated()) {
      showAuthenticatedView("account");
      loadUserPreferences();
    } else if (authService.hasRefreshToken()) {
      // Try to refresh token
      api.refreshToken()
        .then(() => {
          showAuthenticatedView("account");
          loadUserPreferences();
        })
        .catch(() => {
          showUnauthenticatedView("login");
        });
    } else {
      showUnauthenticatedView("login");
    }

    // Subscribe to loading state changes
    stateManager.subscribe((state) => {
      const loadingWindow = $$("loadingWindow");
      if (loadingWindow) {
        if (state.loading) {
          loadingWindow.show();
        } else {
          loadingWindow.hide();
        }
      }
    });

    // Setup after everything is initialized
    setupFormHandlers();
    setupKeyboardNavigation();
    enhanceAccessibility();

  }, 500); // Increased timeout to ensure components are ready
});

// Load user preferences
function loadUserPreferences() {
  stateManager.loadUserPreferences()
    .then(preferences => {
      if (preferences) {
        appState.data = preferences;
        appState.originalData = JSON.parse(JSON.stringify(preferences));
      }
      loadFormData();
    })
    .catch(error => {
      console.error('Failed to load preferences:', error);
      webix.message({
        type: "error",
        text: "Could not load preferences from server. Showing default preferences.",
        expire: 5000
      });
      loadFormData();
    });
}

// Form event handlers
function setupFormHandlers() {
  const forms = ["accountForm", "notificationForm", "themeForm", "privacyForm"];
  forms.forEach(formId => {
    const form = $$(formId);
    if (form && form.attachEvent) {
      form.attachEvent("onChange", function() {
        updateStateFromForms();
      });
    } else {
      console.warn(`Form ${formId} not found or doesn't support attachEvent`);
    }
  });
}

// Load form data from state
function loadFormData() {
  const accountForm = $$("accountForm");
  const notificationForm = $$("notificationForm");
  const themeForm = $$("themeForm");
  const privacyForm = $$("privacyForm");

  if (accountForm && accountForm.setValues) {
    accountForm.setValues(appState.data.account);
  }
  if (notificationForm && notificationForm.setValues) {
    notificationForm.setValues(appState.data.notifications);
  }
  if (themeForm && themeForm.setValues) {
    themeForm.setValues(appState.data.theme);
  }
  if (privacyForm && privacyForm.setValues) {
    privacyForm.setValues(appState.data.privacy);
  }
  
  updateThemePreview(appState.data.theme.colorScheme);
}

// Update state from form values
function updateStateFromForms() {
  const accountForm = $$("accountForm");
  const notificationForm = $$("notificationForm");
  const themeForm = $$("themeForm");
  const privacyForm = $$("privacyForm");

  if (accountForm && accountForm.getValues) {
    appState.data.account = accountForm.getValues();
  }
  if (notificationForm && notificationForm.getValues) {
    appState.data.notifications = notificationForm.getValues();
  }
  if (themeForm && themeForm.getValues) {
    appState.data.theme = themeForm.getValues();
  }
  if (privacyForm && privacyForm.getValues) {
    appState.data.privacy = privacyForm.getValues();
  }
}

// Save all preferences
function saveAllPreferences() {
  const forms = [$$("accountForm"), $$("notificationForm"), $$("themeForm"), $$("privacyForm")];
  let allValid = true;

  forms.forEach(form => {
    if (form && form.validate && !form.validate()) {
      allValid = false;
    }
  });

  if (!allValid) {
    webix.message({ type: "error", text: "Please fix the validation errors before saving." });
    return;
  }

  updateStateFromForms();
  
  // Show loading state
  const loadingWindow = $$("loadingWindow");
  if (loadingWindow) {
    loadingWindow.show();
  }

  // Save to backend
  stateManager.updatePreferences("all", appState.data)
    .then(() => {
      appState.saveChanges();
      webix.message({ type: "success", text: "Preferences saved successfully!" });
      applyThemeSettings();
    })
    .catch(error => {
      console.error('Failed to save preferences:', error);
      webix.message({ 
        type: "error", 
        text: "Failed to save preferences. Please try again.",
        expire: 5000
      });
    })
    .finally(() => {
      if (loadingWindow) {
        loadingWindow.hide();
      }
    });
}

// Reset all forms
function resetAllForms() {
  const defaultState = new PreferencesState();
  appState.data = JSON.parse(JSON.stringify(defaultState.data));
  loadFormData();
}

// Update theme preview
function updateThemePreview(colorScheme) {
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
      className = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "theme-dark"
        : "theme-light";
      text = "Theme Preview - Auto Mode";
      break;
  }

  preview.setHTML(`<div class="theme-preview ${className}">${text}</div>`);
}

// Apply theme settings
function applyThemeSettings() {
  const theme = appState.data.theme;
  document.documentElement.setAttribute("data-theme", theme.colorScheme);

  const fontSizes = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "extra-large": "20px"
  };

  document.body.style.fontSize = fontSizes[theme.fontSize] || "16px";

  if (!theme.animations) {
    document.body.style.setProperty("--animation-duration", "0ms");
  } else {
    document.body.style.removeProperty("--animation-duration");
  }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener("keydown", function(e) {
    if (e.altKey && e.key >= "1" && e.key <= "4") {
      e.preventDefault();
      const mainView = $$("mainView");
      const sidebar = $$("mainSidebar");
      
      if (mainView && sidebar && !sidebar.isHidden()) { // Only if sidebar is visible
        const tabIndex = parseInt(e.key) - 1;
        const items = ["account", "notifications", "theme", "privacy"];
        if (items[tabIndex]) {
          mainView.setValue(items[tabIndex]);
          sidebar.select(items[tabIndex]);
        }
      }
    }

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
  const sidebar = $$("mainSidebar");
  if (sidebar && sidebar.$view) {
    const sidebarNode = sidebar.$view;
    sidebarNode.setAttribute("role", "navigation");
    sidebarNode.setAttribute("aria-label", "User preferences categories");
  }
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