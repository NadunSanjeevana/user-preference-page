import stateManager from '../../utils/stateManager.js';

const ThemeForm = () => {
  const form = {
    view: "form",
    id: "themeForm",
    responsive: true,
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
        responsive: true
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
        value: "medium",
        responsive: true
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
        value: "standard",
        responsive: true
      },
      {
        view: "checkbox",
        name: "animations",
        label: "Enable Animations",
        value: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "compactMode",
        label: "Compact Mode",
        responsive: true
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: "Save Changes",
            css: "webix_primary",
            responsive: true,
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
        }
      }
    }
  };

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("themeForm");
    if (form && state.theme) {
      form.setValues(state.theme);
    }
  });

  return form;
};

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