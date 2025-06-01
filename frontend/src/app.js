import stateManager from './utils/stateManager.js';
import AccountForm from './components/account/AccountForm.js';
import NotificationForm from './components/notifications/NotificationForm.js';
import ThemeForm from './components/theme/ThemeForm.js';
import PrivacyForm from './components/privacy/PrivacyForm.js';
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

// Initialize auth forms with callback functions
const loginForm = Login({
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

const registerForm = Register({
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
  view: "layout",
  responsive: true,
  rows: [
    {
      cols: [
        {
          view: "sidebar",
          id: "mainSidebar",
          responsive: true,
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
          view: "layout",
          responsive: true,
          rows: [
            {
              view: "multiview",
              id: "mainView",
              responsive: true,
              animate: true,
              cells: [
                {
                  id: "login",
                  responsive: true,
                  rows: [
                    {
                      view: "toolbar",
                      responsive: true,
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Login", css: "webix_header" },
                        {},
                        {
                          view: "button",
                          responsive: true,
                          label: "Register",
                          click: function() {
                            showUnauthenticatedView("register");
                          }
                        }
                      ]
                    },
                    loginForm
                  ]
                },
                {
                  id: "register",
                  responsive: true,
                  rows: [
                    {
                      view: "toolbar",
                      responsive: true,
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Register", css: "webix_header" },
                        {},
                        {
                          view: "button",
                          responsive: true,
                          label: "Login",
                          click: function() {
                            showUnauthenticatedView("login");
                          }
                        }
                      ]
                    },
                    registerForm
                  ]
                },
                {
                  id: "account",
                  responsive: true,
                  rows: [
                    {
                      view: "toolbar",
                      responsive: true,
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Account Settings", css: "webix_header" },
                        {},
                        {
                          view: "button",
                          responsive: true,
                          label: "Logout",
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
                      responsive: true,
                      css: "preferences-main-scroll",
                      body: accountForm
                    }
                  ]
                },
                {
                  id: "notifications",
                  responsive: true,
                  rows: [
                    {
                      view: "toolbar",
                      responsive: true,
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Notification Settings", css: "webix_header" }
                      ]
                    },
                    {
                      view: "scrollview",
                      responsive: true,
                      css: "preferences-main-scroll",
                      body: notificationForm
                    }
                  ]
                },
                {
                  id: "theme",
                  responsive: true,
                  rows: [
                    {
                      view: "toolbar",
                      responsive: true,
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Theme Settings", css: "webix_header" }
                      ]
                    },
                    {
                      view: "scrollview",
                      responsive: true,
                      css: "preferences-main-scroll",
                      body: themeForm
                    }
                  ]
                },
                {
                  id: "privacy",
                  responsive: true,
                  rows: [
                    {
                      view: "toolbar",
                      responsive: true,
                      css: "webix_dark",
                      cols: [
                        { view: "label", label: "Privacy Settings", css: "webix_header" }
                      ]
                    },
                    {
                      view: "scrollview",
                      responsive: true,
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
              responsive: true,
              css: "account-buttons",
              hidden: true,
              elements: [
                {
                  view: "button",
                  responsive: true,
                  value: "Save All",
                  css: "webix_primary account-button",
                  click: function() {
                    saveAllPreferences();
                  }
                },
                {
                  view: "button",
                  responsive: true,
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
                  responsive: true,
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
    }
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
    head: false,
    body: {
      view: "template",
      template: `
        <div style="text-align: center; padding: 20px;">
          <div class="loading-spinner"></div>
          <div style="margin-top: 15px; font-size: 16px;">Loading...</div>
        </div>
      `,
      css: "loading-template"
    },
    hidden: true
  });


  // Add loading spinner styles
  webix.html.addStyle(`
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      margin: 0 auto;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-template {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  `);

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