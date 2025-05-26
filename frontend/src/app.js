// Application State Management
class PreferencesState {
  constructor() {
    this.data = {
      account: {
        username: "john.doe",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1 (555) 123-4567"
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

// Initialize components
const accountForm = new AccountForm();
const notificationForm = new NotificationForm();
const themeForm = new ThemeForm();
const privacyForm = new PrivacyForm();

// Main Layout
const mainLayout = {
  rows: [
    {
      view: "tabview",
      id: "preferencesTabview",
      tabbar: {
        type: "top",
        height: 50
      },
      cells: [
        {
          header: "Account",
          body: accountForm.getForm()
        },
        {
          header: "Notifications",
          body: notificationForm.getForm()
        },
        {
          header: "Theme",
          body: themeForm.getForm()
        },
        {
          header: "Privacy",
          body: privacyForm.getForm()
        }
      ]
    },
    {
      height: 60,
      cols: [
        {},
        {
          view: "button",
          value: "Reset All",
          width: 120,
          click: function() {
            webix.confirm({
              title: "Reset Settings",
              text: "Reset all settings to default values?",
              ok: "Reset",
              cancel: "Cancel"
            }).then(function(result) {
              if (result) {
                resetAllForms();
                ErrorHandler.showSuccess("All settings have been reset to defaults.");
              }
            });
          }
        },
        { width: 20 },
        {
          view: "button",
          value: "Cancel",
          width: 100,
          click: function() {
            if (appState.hasChanges()) {
              webix.confirm({
                title: "Unsaved Changes",
                text: "You have unsaved changes. Discard them?",
                ok: "Discard",
                cancel: "Keep Editing"
              }).then(function(result) {
                if (result) {
                  loadFormData();
                  ErrorHandler.showSuccess("Changes discarded.");
                }
              });
            } else {
              ErrorHandler.showSuccess("No changes to discard.");
            }
          }
        },
        { width: 20 },
        {
          view: "button",
          value: "Save Changes",
          css: "webix_primary",
          width: 140,
          click: function() {
            saveAllPreferences();
          }
        }
      ]
    }
  ]
};

// Initialize the application
webix.ready(function() {
  webix.ui(mainLayout, document.getElementById("preferences-app"));
  loadFormData();
  setupFormHandlers();
  setupKeyboardNavigation();
  enhanceAccessibility();
});

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
    ErrorHandler.showError("Please fix the validation errors before saving.");
    return;
  }

  updateStateFromForms();
  appState.saveChanges();
  ErrorHandler.showSuccess("Preferences saved successfully!");
  applyThemeSettings();
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
  const tabbarNode = tabview.getTabbar().$view;
  tabbarNode.setAttribute("role", "tablist");
  tabbarNode.setAttribute("aria-label", "User preferences categories");
}

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