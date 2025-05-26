class ThemeForm {
  constructor() {
    this.form = {
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
        }
      ]
    };
  }

  getForm() {
    return this.form;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeForm;
} 