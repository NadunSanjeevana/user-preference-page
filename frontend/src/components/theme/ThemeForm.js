import stateManager from '../../utils/stateManager.js';
import languageService from '../../services/languageService.js';

const ThemeForm = () => {
  const form = {
    view: "form",
    id: "themeForm",
    responsive: true,
    elements: [
      { 
        template: languageService.getTranslation('theme.title'), 
        type: "section" 
      },
      {
        view: "segmented",
        name: "colorScheme",
        label: languageService.getTranslation('theme.colorScheme'),
        tooltip: languageService.getTranslation('theme.tooltips.colorScheme'),
        options: [
          { id: "light", value: languageService.getTranslation('theme.schemes.light') },
          { id: "dark", value: languageService.getTranslation('theme.schemes.dark') },
          { id: "auto", value: languageService.getTranslation('theme.schemes.auto') }
        ],
        value: "light",
        responsive: true
      },
      {
        view: "richselect",
        name: "fontSize",
        label: languageService.getTranslation('theme.fontSize'),
        tooltip: languageService.getTranslation('theme.tooltips.fontSize'),
        options: [
          { id: "small", value: languageService.getTranslation('theme.sizes.small') },
          { id: "medium", value: languageService.getTranslation('theme.sizes.medium') },
          { id: "large", value: languageService.getTranslation('theme.sizes.large') },
          { id: "extra-large", value: languageService.getTranslation('theme.sizes.extraLarge') }
        ],
        value: "medium",
        responsive: true
      },
      {
        view: "richselect",
        name: "layout",
        label: languageService.getTranslation('theme.layout'),
        tooltip: languageService.getTranslation('theme.tooltips.layout'),
        options: [
          { id: "standard", value: languageService.getTranslation('theme.layouts.standard') },
          { id: "compact", value: languageService.getTranslation('theme.layouts.compact') },
          { id: "spacious", value: languageService.getTranslation('theme.layouts.spacious') }
        ],
        value: "standard",
        responsive: true
      },
      {
        view: "checkbox",
        name: "animations",
        label: languageService.getTranslation('theme.animations'),
        tooltip: languageService.getTranslation('theme.tooltips.animations'),
        value: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "compactMode",
        label: languageService.getTranslation('theme.compactMode'),
        tooltip: languageService.getTranslation('theme.tooltips.compactMode'),
        responsive: true
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: languageService.getTranslation('save'),
            css: "webix_primary",
            responsive: true,
            click: async function() {
              const form = $$("themeForm");
              try {
                const values = form.getValues();
                await stateManager.updatePreferences('theme', values);
                webix.message({ 
                  type: "success", 
                  text: languageService.getTranslation('theme.success') 
                });
                // Apply theme changes immediately
                applyThemeSettings(values);
              } catch (error) {
                webix.message({ 
                  type: "error", 
                  text: error.message 
                });
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

  // Subscribe to language changes
  languageService.subscribe(() => {
    const form = $$("themeForm");
    if (form) {
      // Update form labels and tooltips
      const elements = form.getChildViews();
      elements.forEach(element => {
        if (element.config && element.config.name) {
          const key = `theme.${element.config.name}`;
          element.define({
            label: languageService.getTranslation(key),
            placeholder: languageService.getTranslation(key),
            tooltip: languageService.getTranslation(`theme.tooltips.${element.config.name}`)
          });

          // Update options for segmented and richselect
          if (element.config.view === "segmented" && element.config.name === "colorScheme") {
            element.define({
              options: [
                { id: "light", value: languageService.getTranslation('theme.schemes.light') },
                { id: "dark", value: languageService.getTranslation('theme.schemes.dark') },
                { id: "auto", value: languageService.getTranslation('theme.schemes.auto') }
              ]
            });
          } else if (element.config.view === "richselect") {
            if (element.config.name === "fontSize") {
              element.define({
                options: [
                  { id: "small", value: languageService.getTranslation('theme.sizes.small') },
                  { id: "medium", value: languageService.getTranslation('theme.sizes.medium') },
                  { id: "large", value: languageService.getTranslation('theme.sizes.large') },
                  { id: "extra-large", value: languageService.getTranslation('theme.sizes.extraLarge') }
                ]
              });
            } else if (element.config.name === "layout") {
              element.define({
                options: [
                  { id: "standard", value: languageService.getTranslation('theme.layouts.standard') },
                  { id: "compact", value: languageService.getTranslation('theme.layouts.compact') },
                  { id: "spacious", value: languageService.getTranslation('theme.layouts.spacious') }
                ]
              });
            }
          }
        }
      });
      form.refresh();
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