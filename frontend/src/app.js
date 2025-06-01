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

// UPDATED: Apply theme settings with proper dark theme support
function applyThemeSettings() {
  const theme = appState.data.theme;
  
  // Set theme class on document root
  document.documentElement.setAttribute("data-theme", theme.colorScheme);
  
  // Apply font size
  const fontSizes = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "extra-large": "20px"
  };
  document.body.style.fontSize = fontSizes[theme.fontSize] || "16px";

  // Apply animations
  if (!theme.animations) {
    document.body.style.setProperty("--animation-duration", "0ms");
  } else {
    document.body.style.removeProperty("--animation-duration");
  }

  // Apply compact mode
  document.body.classList.toggle("compact-mode", theme.compactMode);

  // FIXED: Update Webix skin with correct skin name
  let targetScheme = theme.colorScheme;
  if (theme.colorScheme === "auto") {
    targetScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (targetScheme === "dark") {
    webix.skin.set("dark");
  } else {
    webix.skin.set("material");
  }

  // FIXED: Apply dark theme to body for global styling
  const isDark = targetScheme === "dark";
  document.body.classList.toggle("webix_dark", isDark);

  // FIXED: Update main components with proper dark theme classes
  updateComponentStyling(isDark);

  // FIXED: Update form styling more systematically
  updateFormStyling(isDark);

  // Update theme preview
  updateThemePreview(theme.colorScheme);
  
  // FIXED: Force refresh of all Webix components
  refreshWebixComponents(isDark);

  // Handle auto theme system changes
  if (theme.colorScheme === "auto") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.removeListener(handleSystemThemeChange); // Remove existing listener
    mediaQuery.addListener(handleSystemThemeChange);
  }
}

// NEW: Handle system theme changes for auto mode
function handleSystemThemeChange(e) {
  if (appState.data.theme.colorScheme === "auto") {
    applyThemeSettings();
  }
}

// NEW: Update main component styling
function updateComponentStyling(isDark) {
  // Update sidebar
  const sidebar = $$("mainSidebar");
  if (sidebar && sidebar.$view) {
    sidebar.$view.classList.toggle("webix_dark", isDark);
  }

  // Update action buttons toolbar
  const actionButtons = $$("actionButtons");
  if (actionButtons && actionButtons.$view) {
    actionButtons.$view.classList.toggle("webix_dark", isDark);
  }

  // Update main view container
  const mainView = $$("mainView");
  if (mainView && mainView.$view) {
    mainView.$view.classList.toggle("webix_dark", isDark);
  }

  // Update all toolbars in the main view
  const toolbars = document.querySelectorAll(".webix_toolbar");
  toolbars.forEach(toolbar => {
    toolbar.classList.toggle("webix_dark", isDark);
  });

  // Update scrollviews
  const scrollviews = document.querySelectorAll(".webix_scrollview");
  scrollviews.forEach(scrollview => {
    scrollview.classList.toggle("webix_dark", isDark);
  });
}

// NEW: Systematic form styling update
function updateFormStyling(isDark) {
  const forms = ["accountForm", "notificationForm", "themeForm", "privacyForm"];
  
  forms.forEach(formId => {
    const form = $$(formId);
    if (form && form.$view) {
      // Apply dark theme to form container
      form.$view.classList.toggle("webix_dark", isDark);
      
      // Update all form elements
      const elements = form.$view.querySelectorAll([
        ".webix_input",
        ".webix_el_text",
        ".webix_el_select", 
        ".webix_el_checkbox",
        ".webix_el_radio",
        ".webix_el_textarea",
        ".webix_label",
        ".webix_form_section",
        ".webix_fieldset",
        ".webix_button",
        ".webix_control"
      ].join(", "));
      
      elements.forEach(element => {
        element.classList.toggle("webix_dark", isDark);
      });
    }
  });
}

// NEW: Force refresh of Webix components
function refreshWebixComponents(isDark) {
  // Get all Webix views and update them
  const views = webix.$$("*");
  if (views && views.length) {
    views.forEach(function(view) {
      if (view && view.$view) {
        // Apply dark theme class
        view.$view.classList.toggle("webix_dark", isDark);
        
        // Force refresh for certain component types
        if (view.refresh && typeof view.refresh === 'function') {
          try {
            view.refresh();
          } catch (e) {
            console.warn("Could not refresh component:", e);
          }
        }
        
        // Special handling for specific components
        if (view.name === "sidebar" || view.name === "toolbar" || view.name === "button") {
          view.$view.classList.toggle("webix_dark", isDark);
        }
      }
    });
  }
}

// Initialize the application
webix.ready(function() {
  console.log("Webix is ready");

  // UPDATED: Add comprehensive dark theme CSS styles
  webix.html.addStyle(`
    /* Loading spinner styles */
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
    
    /* COMPREHENSIVE DARK THEME STYLES */
    body.webix_dark {
      background-color: #2c3e50 !important;
      color: #ecf0f1 !important;
    }
    
    .webix_dark {
      background-color: #34495e !important;
      color: #ecf0f1 !important;
    }
    
    .webix_dark .webix_input,
    .webix_dark .webix_el_text input,
    .webix_dark .webix_el_select select,
    .webix_dark .webix_el_textarea textarea {
      background-color: #2c3e50 !important;
      color: #ecf0f1 !important;
      border-color: #7f8c8d !important;
    }
    
    .webix_dark .webix_input:focus,
    .webix_dark .webix_el_text input:focus,
    .webix_dark .webix_el_select select:focus,
    .webix_dark .webix_el_textarea textarea:focus {
      border-color: #3498db !important;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.5) !important;
    }
    
    .webix_dark .webix_label,
    .webix_dark .webix_form_label {
      color: #ecf0f1 !important;
    }
    
    .webix_dark .webix_form_section,
    .webix_dark .webix_fieldset {
      background-color: #34495e !important;
      border-color: #7f8c8d !important;
    }
    
    .webix_dark .webix_toolbar {
      background-color: #2c3e50 !important;
      border-color: #7f8c8d !important;
    }
    
    .webix_dark .webix_sidebar {
      background-color: #2c3e50 !important;
    }
    
    .webix_dark .webix_list_item,
    .webix_dark .webix_tree_item {
      color: #ecf0f1 !important;
      background-color: transparent !important;
    }
    
    .webix_dark .webix_list_item:hover,
    .webix_dark .webix_tree_item:hover {
      background-color: #3498db !important;
    }
    
    .webix_dark .webix_selected,
    .webix_dark .webix_list_item.webix_selected {
      background-color: #3498db !important;
      color: #ffffff !important;
    }
    
    .webix_dark .webix_button {
      background-color: #34495e !important;
      color: #ecf0f1 !important;
      border-color: #7f8c8d !important;
    }
    
    .webix_dark .webix_button:hover {
      background-color: #3498db !important;
    }
    
    .webix_dark .webix_primary {
      background-color: #3498db !important;
      color: #ffffff !important;
    }
    
    .webix_dark .webix_secondary {
      background-color: #95a5a6 !important;
      color: #2c3e50 !important;
    }
    
    .webix_dark .webix_scrollview {
      background-color: #34495e !important;
    }
    
    .webix_dark .webix_multiview {
      background-color: #34495e !important;
    }
    
    .webix_dark .webix_layout {
      background-color: #34495e !important;
    }
    
    /* Checkbox and radio styling */
    .webix_dark .webix_el_checkbox input[type="checkbox"],
    .webix_dark .webix_el_radio input[type="radio"] {
      background-color: #2c3e50 !important;
      border-color: #7f8c8d !important;
    }
    
    .webix_dark .webix_el_checkbox input[type="checkbox"]:checked,
    .webix_dark .webix_el_radio input[type="radio"]:checked {
      background-color: #3498db !important;
      border-color: #3498db !important;
    }
    
    /* Theme preview styles */
    .theme-preview {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      margin: 10px;
      transition: all 0.3s ease;
    }
    
    .theme-preview.theme-light {
      background-color: #ffffff;
      color: #2c3e50;
      border: 2px solid #ecf0f1;
    }
    
    .theme-preview.theme-dark {
      background-color: #2c3e50;
      color: #ecf0f1;
      border: 2px solid #7f8c8d;
    }
    
    /* Compact mode styles */
    body.compact-mode .webix_view {
      padding: 5px !important;
    }
    
    body.compact-mode .webix_input {
      padding: 5px !important;
      height: 30px !important;
    }
    
    body.compact-mode .webix_button {
      height: 30px !important;
      padding: 5px 10px !important;
    }
    
    /* Animation controls */
    [data-theme="light"] * {
      transition: var(--animation-duration, 300ms) ease;
    }
    
    [data-theme="dark"] * {
      transition: var(--animation-duration, 300ms) ease;
    }
  `);

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
    
    // ADDED: Apply initial theme
    applyThemeSettings();

  }, 500);
});

// UPDATED: Load user preferences with theme application
function loadUserPreferences() {
  stateManager.loadUserPreferences()
    .then(preferences => {
      if (preferences) {
        appState.data = preferences;
        appState.originalData = JSON.parse(JSON.stringify(preferences));
      }
      loadFormData();
      // ADDED: Apply theme after loading preferences
      applyThemeSettings();
    })
    .catch(error => {
      console.error('Failed to load preferences:', error);
      webix.message({
        type: "error",
        text: "Could not load preferences from server. Showing default preferences.",
        expire: 5000
      });
      loadFormData();
      // ADDED: Apply default theme
      applyThemeSettings();
    });
}

// UPDATED: Form event handlers with theme change detection
function setupFormHandlers() {
  const forms = ["accountForm", "notificationForm", "themeForm", "privacyForm"];
  forms.forEach(formId => {
    const form = $$(formId);
    if (form && form.attachEvent) {
      form.attachEvent("onChange", function(newValue, oldValue, config) {
        updateStateFromForms();
        
        // If theme form changed, apply theme immediately
        if (formId === "themeForm") {
          applyThemeSettings();
        }
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
  applyThemeSettings();
}

// UPDATED: Update theme preview with proper handling
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
      const isDarkAuto = window.matchMedia("(prefers-color-scheme: dark)").matches;
      className = isDarkAuto ? "theme-dark" : "theme-light";
      text = `Theme Preview - Auto Mode (${isDarkAuto ? 'Dark' : 'Light'})`;
      break;
  }

  preview.setHTML(`<div class="theme-preview ${className}">${text}</div>`);
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