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

// Main Layout
const mainLayout = {
  view: "layout",
  type: "line",
  rows: [
    {
      view: "multiview",
      id: "mainView",
      animate: true,
      cells: [
        {
          id: "login",
          rows: [
            { view: "template", template: "Login", type: "header" },
            {
              cols: [
                {},
                {
                  view: "form",
                  id: "loginForm",
                  width: 400,
                  elements: [
                    { view: "text", label: "Username", name: "username", required: true },
                    { view: "text", label: "Password", name: "password", type: "password", required: true },
                    {
                      view: "button",
                      value: "Login",
                      css: "webix_primary",
                      click: function() {
                        const form = $$("loginForm");
                        if (!form.validate()) {
                          webix.message({ type: "error", text: "Please fill in all required fields" });
                          return;
                        }

                        const values = form.getValues();
                        $$("loadingWindow").show();

                        api.login(values.username, values.password)
                          .then(data => {
                            authService.setTokens(data.access, data.refresh);
                            $$("mainView").setValue("preferences");
                            webix.message({ type: "success", text: "Login successful" });
                          })
                          .catch(error => {
                            webix.message({ type: "error", text: error.message || "Login failed" });
                          })
                          .finally(() => {
                            $$("loadingWindow").hide();
                          });
                      }
                    },
                    {
                      view: "button",
                      id: "registerButton",
                      value: "Register",
                      css: "webix_secondary",
                      type: "button",
                      click: function() {
                        $$("mainView").setValue("register");
                      }
                    }
                  ],
                  rules: {
                    username: webix.rules.isNotEmpty,
                    password: webix.rules.isNotEmpty
                  }
                },
                {}
              ]
            }
          ]
        },
        {
          id: "register",
          rows: [
            { view: "template", template: "Register", type: "header" },
            {
              cols: [
                {},
                {
                  view: "form",
                  id: "registerForm",
                  width: 400,
                  elements: [
                    { view: "text", label: "Username", name: "username", required: true },
                    { view: "text", label: "Email", name: "email", required: true },
                    { view: "text", label: "Password", name: "password", type: "password", required: true },
                    { view: "text", label: "Confirm Password", name: "confirmPassword", type: "password", required: true },
                    {
                      view: "button",
                      value: "Register",
                      css: "webix_primary",
                      click: function() {
                        const form = $$("registerForm");
                        if (!form.validate()) {
                          webix.message({ type: "error", text: "Please fill in all required fields" });
                          return;
                        }

                        const values = form.getValues();
                        if (values.password !== values.confirmPassword) {
                          webix.message({ type: "error", text: "Passwords do not match" });
                          return;
                        }

                        if (values.password.length < 8) {
                          webix.message({ type: "error", text: "Password must be at least 8 characters long" });
                          return;
                        }

                        $$("loadingWindow").show();

                        api.register({
                          username: values.username,
                          email: values.email,
                          password: values.password
                        })
                          .then(() => {
                            return api.login(values.username, values.password);
                          })
                          .then(data => {
                            authService.setTokens(data.access, data.refresh);
                            $$("mainView").setValue("preferences");
                            webix.message({ type: "success", text: "Registration successful" });
                          })
                          .catch(error => {
                            webix.message({ type: "error", text: error.message || "Registration failed" });
                          })
                          .finally(() => {
                            $$("loadingWindow").hide();
                          });
                      }
                    },
                    {
                      view: "button",
                      value: "Back to Login",
                      css: "webix_secondary",
                      click: function() {
                        const mainView = $$("mainView");
                        if (mainView) {
                          mainView.setValue("login");
                        }
                      }
                    }
                  ],
                  rules: {
                    username: webix.rules.isNotEmpty,
                    email: webix.rules.isEmail,
                    password: webix.rules.isNotEmpty,
                    confirmPassword: webix.rules.isNotEmpty
                  }
                },
                {}
              ]
            }
          ]
        },
        {
          id: "preferences",
          cols: [
            {
              view: "sidebar",
              width: 250,
              css: "preferences-sidebar",
              data: [
                { id: "account", value: "Account", icon: "wxi-user" },
                { id: "notifications", value: "Notifications", icon: "wxi-bell" },
                { id: "theme", value: "Theme", icon: "wxi-palette" },
                { id: "privacy", value: "Privacy", icon: "wxi-lock" }
              ],
              on: {
                onItemClick: function(id) {
                  $$("preferencesContent").setValue(id);
                }
              }
            },
            {
              view: "multiview",
              id: "preferencesContent",
              animate: true,
              cells: [
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
                            $$("mainView").setValue("login");
                            webix.message({ type: "success", text: "Logged out successfully" });
                          }
                        }
                      ]
                    },
                    accountForm
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
                    notificationForm
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
                    themeForm
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
                    privacyForm
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Initialize the application
webix.ready(function() {
  console.log("Webix is ready");
  
  // Create the main layout
  webix.ui(mainLayout, "preferences-app");
  console.log("Main layout created");

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

  // Debug multiview
  const mainView = $$("mainView");
  console.log("MainView initialized:", mainView);

  // Check authentication status and show appropriate view
  if (authService.isAuthenticated()) {
    mainView.setValue("preferences");
    loadUserPreferences();
  } else if (authService.hasRefreshToken()) {
    // Try to refresh token
    api.refreshToken()
      .then(() => {
        mainView.setValue("preferences");
        loadUserPreferences();
      })
      .catch(() => {
        mainView.setValue("login");
      });
  } else {
    mainView.setValue("login");
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

  setupFormHandlers();
  setupKeyboardNavigation();
  enhanceAccessibility();
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
    $$(formId).attachEvent("onChange", function() {
      updateStateFromForms();
    });
  });
}

// Load form data from state
function loadFormData() {
  $$("accountForm").setValues(appState.data.account);
  $$("notificationForm").setValues(appState.data.notifications);
  $$("themeForm").setValues(appState.data.theme);
  $$("privacyForm").setValues(appState.data.privacy);
  updateThemePreview(appState.data.theme.colorScheme);
}

// Update state from form values
function updateStateFromForms() {
  appState.data.account = $$("accountForm").getValues();
  appState.data.notifications = $$("notificationForm").getValues();
  appState.data.theme = $$("themeForm").getValues();
  appState.data.privacy = $$("privacyForm").getValues();
}

// Save all preferences
function saveAllPreferences() {
  const forms = [$$("accountForm"), $$("notificationForm"), $$("themeForm"), $$("privacyForm")];
  let allValid = true;

  forms.forEach(form => {
    if (!form.validate()) {
      allValid = false;
    }
  });

  if (!allValid) {
    webix.message({ type: "error", text: "Please fix the validation errors before saving." });
    return;
  }

  updateStateFromForms();
  
  // Show loading state
  $$("loadingWindow").show();

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
      $$("loadingWindow").hide();
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
      const tabIndex = parseInt(e.key) - 1;
      $$("preferencesTabview")
        .getTabbar()
        .setValue($$("preferencesTabview").getTabbar().getFirstId() + tabIndex);
    }

    if (e.key === "Escape") {
      document.querySelector(".preferences-container").focus();
    }
  });
}

// Enhance accessibility
function enhanceAccessibility() {
  const tabview = $$("preferencesTabview");
  if (!tabview) return;
  const tabbarNode = tabview.getTabbar().$view;
  tabbarNode.setAttribute("role", "tablist");
  tabbarNode.setAttribute("aria-label", "User preferences categories");
}

// Add some basic styles
webix.ui({
  view: "template",
  css: "app-styles",
  template: `
    <link rel="stylesheet" href="styles/preferences.css">
  `
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PreferencesState,
    AccountForm,
    NotificationForm,
    ThemeForm,
    PrivacyForm
  };
} 