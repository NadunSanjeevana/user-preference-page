import stateManager from '../utils/stateManager.js';

const ThemeForm = () => {
  const form = {
    view: "form",
    id: "themeForm",
    elements: [
      { template: "Theme Settings", type: "section" },
      {
        view: "segmented",
        name: "colorScheme",
        label: "Color Scheme",
        options: [
          { id: "light", value: "Light" },
          { id: "dark", value: "Dark" },
          { id: "auto", value: "Auto" }
        ],
        value: "light",
        on: {
          onChange: function(newValue) {
            updateThemePreview(newValue);
          }
        }
      },
      {
        view: "template",
        id: "themePreview",
        template: '<div class="theme-preview theme-light">Theme Preview - Light Mode</div>',
        height: 80
      },
      {
        view: "richselect",
        name: "fontSize",
        label: "Font Size",
        options: [
          { id: "small", value: "Small" },
          { id: "medium", value: "Medium" },
          { id: "large", value: "Large" },
          { id: "extra-large", value: "Extra Large" }
        ],
        value: "medium"
      },
      {
        view: "richselect",
        name: "layout",
        label: "Layout Style",
        options: [
          { id: "standard", value: "Standard" },
          { id: "compact", value: "Compact" },
          { id: "spacious", value: "Spacious" }
        ],
        value: "standard"
      },
      {
        view: "checkbox",
        name: "animations",
        label: "Enable Animations",
        labelWidth: 200,
        value: true
      },
      {
        view: "checkbox",
        name: "compactMode",
        label: "Compact Mode",
        labelWidth: 200
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: "Save Changes",
            css: "webix_primary",
            click: async function() {
              const form = $$("themeForm");
              try {
                const values = form.getValues();
                await stateManager.updatePreferences('theme', values);
                webix.message({ type: "success", text: "Theme settings saved successfully" });
                // Apply theme changes immediately
                applyThemeSettings(values);
              } catch (error) {
                webix.message({ type: "error", text: error.message });
              }
            }
          }
        ]
      }
    ],
    on: {
      onShow: function() {
        // Load theme data when form is shown
        const themeData = stateManager.state.theme;
        if (themeData) {
          this.setValues(themeData);
          updateThemePreview(themeData.colorScheme);
        }
      }
    }
  };

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("themeForm");
    if (form && state.theme) {
      form.setValues(state.theme);
      updateThemePreview(state.theme.colorScheme);
    }
  });

  return form;
};

// Helper function to update theme preview
function updateThemePreview(colorScheme) {
  const preview = $$("themePreview");
  if (preview) {
    preview.setHTML(`<div class="theme-preview theme-${colorScheme}">Theme Preview - ${colorScheme} Mode</div>`);
  }
}

// Helper function to apply theme settings
function applyThemeSettings(settings) {
  document.body.className = `theme-${settings.colorScheme}`;
  document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
  document.body.classList.toggle('compact-mode', settings.compactMode);
  document.body.classList.toggle('animations-enabled', settings.animations);
}

// Helper function to get font size value
function getFontSizeValue(size) {
  const sizes = {
    'small': '14px',
    'medium': '16px',
    'large': '18px',
    'extra-large': '20px'
  };
  return sizes[size] || '16px';
}

export default ThemeForm; 