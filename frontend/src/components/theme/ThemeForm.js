// Fixed ThemeForm.js
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
        view: "select",
        name: "colorScheme",
        label: languageService.getTranslation('theme.colorScheme'),
        labelPosition: "top",
        css: "required-field",
        required: true,
        options: [
          { id: "light", value: languageService.getTranslation('theme.schemes.light') },
          { id: "dark", value: languageService.getTranslation('theme.schemes.dark') },
          { id: "auto", value: languageService.getTranslation('theme.schemes.auto') }
        ],
        value: "light",
        responsive: true,
        on: {
          onChange: function(newVal, oldVal) {
            // Apply theme immediately when changed
            const currentValues = $$("themeForm").getValues();
            currentValues.colorScheme = newVal;
            applyThemeImmediately(currentValues);
          }
        }
      },
      {
        view: "select",
        name: "fontSize",
        label: languageService.getTranslation('theme.fontSize'),
        labelPosition: "top",
        css: "required-field",
        required: true,
        options: [
          { id: "small", value: languageService.getTranslation('theme.sizes.small') },
          { id: "medium", value: languageService.getTranslation('theme.sizes.medium') },
          { id: "large", value: languageService.getTranslation('theme.sizes.large') },
          { id: "extra-large", value: languageService.getTranslation('theme.sizes.extraLarge') }
        ],
        value: "medium",
        responsive: true,
        on: {
          onChange: function(newVal, oldVal) {
            const currentValues = $$("themeForm").getValues();
            currentValues.fontSize = newVal;
            applyThemeImmediately(currentValues);
          }
        }
      },
      {
        view: "select",
        name: "layout",
        label: languageService.getTranslation('theme.layout'),
        labelPosition: "top",
        css: "required-field",
        required: true,
        options: [
          { id: "standard", value: languageService.getTranslation('theme.layouts.standard') },
          { id: "compact", value: languageService.getTranslation('theme.layouts.compact') },
          { id: "spacious", value: languageService.getTranslation('theme.layouts.spacious') }
        ],
        value: "standard",
        responsive: true,
        on: {
          onChange: function(newVal, oldVal) {
            const currentValues = $$("themeForm").getValues();
            currentValues.layout = newVal;
            applyThemeImmediately(currentValues);
          }
        }
      },
      {
        view: "checkbox",
        name: "animations",
        label: languageService.getTranslation('theme.animations'),
        css: "required-field",
        required: true,
        value: true,
        responsive: true,
        on: {
          onChange: function(newVal, oldVal) {
            const currentValues = $$("themeForm").getValues();
            currentValues.animations = newVal;
            applyThemeImmediately(currentValues);
          }
        }
      },
      {
        view: "checkbox",
        name: "compactMode",
        label: languageService.getTranslation('theme.compactMode'),
        responsive: true,
        on: {
          onChange: function(newVal, oldVal) {
            const currentValues = $$("themeForm").getValues();
            currentValues.compactMode = newVal;
            applyThemeImmediately(currentValues);
          }
        }
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
                
                // Update global app state
                if (window.appState) {
                  window.appState.data.theme = values;
                  window.appState.saveChanges();
                }
                
                // Update state manager
                await stateManager.updatePreferences('theme', values);
                stateManager.setState({ theme: values });
                
                // Apply theme settings
                applyThemeImmediately(values);
                
                webix.message({ 
                  type: "success", 
                  text: languageService.getTranslation('theme.success') || 'Theme saved successfully'
                });
              } catch (error) {
                console.error('Theme save error:', error);
                webix.message({ 
                  type: "error", 
                  text: error.message || 'Failed to save theme'
                });
              }
            }
          },
          {
            view: "button",
            value: languageService.getTranslation('reset') || 'Reset',
            css: "webix_secondary",
            responsive: true,
            click: function() {
              const defaultTheme = {
                colorScheme: "light",
                fontSize: "medium",
                layout: "standard",
                animations: true,
                compactMode: false
              };
              
              const form = $$("themeForm");
              form.setValues(defaultTheme);
              applyThemeImmediately(defaultTheme);
              
              webix.message({ 
                type: "info", 
                text: "Theme reset to defaults" 
              });
            }
          }
        ]
      }
    ],
    rules: {
      colorScheme: webix.rules.isNotEmpty,
      fontSize: webix.rules.isNotEmpty,
      layout: webix.rules.isNotEmpty,
      animations: webix.rules.isNotEmpty
    },
    on: {
      onShow: function() {
        // Load theme data when form is shown
        let themeData = null;
        
        // Try to get from global app state first
        if (window.appState && window.appState.data.theme) {
          themeData = window.appState.data.theme;
        } else if (stateManager.state && stateManager.state.theme) {
          themeData = stateManager.state.theme;
        }
        
        if (themeData) {
          this.setValues(themeData);
          applyThemeImmediately(themeData);
        }
      }
    }
  };

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("themeForm");
    if (form && state.theme) {
      form.setValues(state.theme);
      applyThemeImmediately(state.theme);
    }
  });

  return form;
};

// Enhanced theme application function that actually works
function applyThemeImmediately(theme) {
  try {
    console.log('Applying theme:', theme);
    
    // Queue theme application to prevent race conditions
    if (window.themeApplicationTimeout) {
      clearTimeout(window.themeApplicationTimeout);
    }
    
    window.themeApplicationTimeout = setTimeout(() => {
      try {
        // Determine the target scheme
        let targetScheme = theme.colorScheme;
        if (theme.colorScheme === "auto") {
          targetScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        // Remove existing theme classes and attributes
        document.documentElement.removeAttribute("data-theme");
        document.body.classList.remove("webix_dark", "theme-light", "theme-dark", "compact-mode", "animations-enabled", "no-animations");

        // Apply new theme
        document.documentElement.setAttribute("data-theme", targetScheme);
        
        if (targetScheme === "dark") {
          document.body.classList.add("webix_dark");
          // Force Webix to use dark skin
          if (webix.skin && webix.skin.set) {
            webix.skin.set("dark");
          }
        } else {
          // Force Webix to use light skin
          if (webix.skin && webix.skin.set) {
            webix.skin.set("material");
          }
        }

        // Apply font size
        const fontSizes = {
          small: "14px",
          medium: "16px", 
          large: "18px",
          "extra-large": "20px"
        };
        const fontSize = fontSizes[theme.fontSize] || "16px";
        document.documentElement.style.fontSize = fontSize;
        document.body.style.fontSize = fontSize;

        // Apply animations
        if (!theme.animations) {
          document.body.style.setProperty("--animation-duration", "0ms");
          document.body.classList.add("no-animations");
        } else {
          document.body.style.removeProperty("--animation-duration");
          document.body.classList.remove("no-animations");
          document.body.classList.add("animations-enabled");
        }

        // Apply compact mode
        if (theme.compactMode) {
          document.body.classList.add("compact-mode");
        }

        // Update CSS custom properties for immediate effect
        const root = document.documentElement;
        if (targetScheme === "dark") {
          root.style.setProperty('--webix-background', '#1e1e1e');
          root.style.setProperty('--webix-text', '#ffffff');
          root.style.setProperty('--webix-border', '#333333');
        } else {
          root.style.setProperty('--webix-background', '#ffffff');
          root.style.setProperty('--webix-text', '#000000');
          root.style.setProperty('--webix-border', '#dadada');
        }

        // Force update all Webix components
        const allComponents = webix.$$("*");
        if (allComponents && allComponents.length) {
          allComponents.forEach(component => {
            if (component && component.$view) {
              // Update component classes
              if (targetScheme === "dark") {
                component.$view.classList.add("webix_dark");
              } else {
                component.$view.classList.remove("webix_dark");
              }
              
              // Force refresh if possible
              if (component.refresh && typeof component.refresh === 'function') {
                try {
                  component.refresh();
                } catch (e) {
                  console.warn("Could not refresh component:", e);
                }
              }
            }
          });
        }

        // Update specific critical components
        const criticalComponents = ["mainSidebar", "mainView", "appView", "themeForm"];
        criticalComponents.forEach(componentId => {
          const component = $$(componentId);
          if (component && component.$view) {
            if (targetScheme === "dark") {
              component.$view.classList.add("webix_dark");
            } else {
              component.$view.classList.remove("webix_dark");
            }
            
            if (component.refresh) {
              try {
                component.refresh();
              } catch (e) {
                console.warn(`Could not refresh ${componentId}:`, e);
              }
            }
          }
        });

        // Handle auto theme system changes
        if (theme.colorScheme === "auto") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          // Remove existing listener to avoid duplicates
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
          mediaQuery.addEventListener('change', handleSystemThemeChange);
        }

        // Force complete UI redraw
        setTimeout(() => {
          if (webix.ui && webix.ui.redraw) {
            webix.ui.redraw();
          }
          
          // Trigger resize to force layout recalculation
          window.dispatchEvent(new Event('resize'));
        }, 50);

        console.log('Theme applied successfully:', targetScheme);
      } catch (error) {
        console.error("Error applying theme:", error);
        webix.message({ type: "error", text: "Failed to apply theme" });
      }
    }, 100); // Debounce theme changes
  } catch (error) {
    console.error("Error in theme application queue:", error);
    webix.message({ type: "error", text: "Failed to apply theme" });
  }
}

// Handle system theme changes for auto mode
function handleSystemThemeChange(e) {
  const form = $$("themeForm");
  if (form) {
    const currentValues = form.getValues();
    if (currentValues.colorScheme === "auto") {
      applyThemeImmediately(currentValues);
    }
  }
}

// Make functions globally available for the main app
window.applyThemeImmediately = applyThemeImmediately;

export default ThemeForm;