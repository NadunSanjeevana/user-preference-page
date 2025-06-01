import languageService from '../../services/languageService.js';
import authService from '../../services/authService.js';
import stateManager from '../../utils/stateManager.js';
import Validator from '../../utils/validation.js';

const PasswordForm = () => {
  // Helper function to add password toggle
  const addPasswordToggle = function() {
    const input = this.getInputNode();
    if (!input || input.dataset.toggleAdded) return;
    
    // Mark as processed to avoid duplicate toggles
    input.dataset.toggleAdded = 'true';
    
    // Create toggle button
    const toggleBtn = document.createElement('span');
    toggleBtn.className = 'password-toggle-btn mdi mdi-eye';
    toggleBtn.style.cssText = `
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      user-select: none;
      font-size: 20px;
      color: var(--webix-form-text, #666);
      z-index: 10;
      padding: 5px;
    `;
    
    // Style the input container
    const container = input.parentNode;
    container.style.position = 'relative';
    
    // Add click handler
    toggleBtn.addEventListener('click', function() {
      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.className = 'password-toggle-btn mdi mdi-eye-off';
        toggleBtn.title = 'Hide password';
      } else {
        input.type = 'password';
        toggleBtn.className = 'password-toggle-btn mdi mdi-eye';
        toggleBtn.title = 'Show password';
      }
    });
    
    // Set initial title
    toggleBtn.title = 'Show password';
    
    // Append to container
    container.appendChild(toggleBtn);
    
    // Adjust input padding to make room for button
    input.style.paddingRight = '35px';
  };

  const form = {
    view: "form",
    id: "passwordForm",
    responsive: true,
    css: "preferences-form",
    elements: [
      { 
        template: languageService.getTranslation('account.passwordSection'), 
        type: "section" 
      },
      {
        view: "text",
        name: "currentPassword",
        type: "password",
        label: languageService.getTranslation('account.currentPassword'),
        placeholder: languageService.getTranslation('account.currentPassword'),
        required: true,
        invalidMessage: languageService.getTranslation('required'),
        validate: function(value) {
          if (!value || value.trim() === '') {
            return languageService.getTranslation('required');
          }
          const isValid = Validator.validatePassword(value);
          return isValid === true ? true : (isValid || languageService.getTranslation('validation.passwordInvalid') || 'Password format is invalid');
        },
        responsive: true,
        labelPosition: "top",
        css: "required-field",
        attributes: { autocomplete: "current-password" },
        tooltip: languageService.getTranslation('account.tooltips.currentPassword'),
        on: {
          onAfterRender: addPasswordToggle
        }
      },
      {
        view: "text",
        name: "newPassword",
        type: "password",
        label: languageService.getTranslation('account.newPassword'),
        placeholder: languageService.getTranslation('account.newPassword'),
        required: true,
        invalidMessage: languageService.getTranslation('required'),
        validate: function(value) {
          if (!value || value.trim() === '') {
            return languageService.getTranslation('required');
          }
          const isValid = Validator.validatePassword(value);
          return isValid === true ? true : (isValid || languageService.getTranslation('validation.passwordInvalid') || 'Password format is invalid');
        },
        responsive: true,
        labelPosition: "top",
        css: "required-field",
        attributes: { autocomplete: "new-password" },
        tooltip: languageService.getTranslation('account.tooltips.newPassword'),
        on: {
          onAfterRender: addPasswordToggle
        }
      },
      {
        view: "text",
        name: "confirmPassword",
        type: "password",
        label: languageService.getTranslation('account.confirmPassword'),
        placeholder: languageService.getTranslation('account.confirmPassword'),
        required: true,
        invalidMessage: languageService.getTranslation('required'),
        validate: function(value) {
          if (!value || value.trim() === '') {
            return languageService.getTranslation('required');
          }
          const form = $$("passwordForm");
          const newPassword = form.getValues().newPassword;
          if (value !== newPassword) {
            return languageService.getTranslation('account.passwordMismatch');
          }
          return true;
        },
        responsive: true,
        labelPosition: "top",
        css: "required-field",
        attributes: { autocomplete: "new-password" },
        tooltip: languageService.getTranslation('account.tooltips.confirmPassword'),
        on: {
          onAfterRender: addPasswordToggle
        }
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: languageService.getTranslation('account.updatePassword'),
            css: "webix_primary",
            responsive: true,
            click: async function() {
              const form = $$("passwordForm");
              if (!form) {
                console.error('Form not found');
                return;
              }
              
              const values = form.getValues();
              
              // Validate password fields
              if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
                webix.message({ 
                  type: "error", 
                  text: languageService.getTranslation('account.passwordRequired') 
                });
                return;
              }
              
              // Validate password match
              if (values.newPassword !== values.confirmPassword) {
                webix.message({ 
                  type: "error", 
                  text: languageService.getTranslation('account.passwordMismatch') 
                });
                return;
              }
              
              // Force validation of all fields
              const isValid = form.validate();
              console.log('Form validation result:', isValid);
              
              if (isValid) {
                try {
                  // Use stateManager instead of authService directly
                  const result = await stateManager.updatePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                  });
                  
                  if (result && result.success !== false) {
                    // Clear password fields
                    form.setValues({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                    
                    webix.message({
                      type: "success",
                      text: languageService.getTranslation('account.passwordUpdated')
                    });
                  } else {
                    webix.message({
                      type: "error",
                      text: result.message || languageService.getTranslation('error')
                    });
                  }
                } catch (error) {
                  console.error('Password change error:', error);
                  let errorMessage = languageService.getTranslation('error');
                  
                  // Handle validation errors from stateManager
                  if (error.message) {
                    try {
                      const errorData = JSON.parse(error.message);
                      if (errorData.currentPassword) {
                        errorMessage = errorData.currentPassword;
                      } else if (errorData.newPassword) {
                        errorMessage = errorData.newPassword;
                      } else if (errorData.general) {
                        errorMessage = errorData.general;
                      }
                    } catch {
                      errorMessage = error.message;
                    }
                  }
                  
                  webix.message({
                    type: "error",
                    text: errorMessage
                  });
                }
              } else {
                console.log('Form validation failed');
                webix.message({ 
                  type: "error", 
                  text: languageService.getTranslation('form.validationFailed') || 'Please check all required fields'
                });
              }
            }
          }
        ]
      },
      { 
        template: languageService.getTranslation('password.security.title'), 
        type: "section" 
      },
      {
        view: "checkbox",
        name: "twoFactorAuth",
        label: languageService.getTranslation('password.security.twoFactor'),
        tooltip: languageService.getTranslation('password.tooltips.twoFactor'),
        on: {
          onChange: async function(newValue) {
            try {
              // Use stateManager or implement the method in authService
              const result = await authService.updateTwoFactorAuth?.(newValue) || 
                           await stateManager.updatePreferences('security', { twoFactorAuth: newValue });
              if (result && result.success !== false) {
                webix.message({
                  type: "success",
                  text: languageService.getTranslation('success')
                });
              } else {
                this.setValue(!newValue); // Revert on failure
                webix.message({
                  type: "error",
                  text: result.message || languageService.getTranslation('error')
                });
              }
            } catch (error) {
              this.setValue(!newValue); // Revert on failure
              webix.message({
                type: "error",
                text: languageService.getTranslation('error')
              });
            }
          }
        }
      },
      {
        view: "checkbox",
        name: "sessionTimeout",
        label: languageService.getTranslation('password.security.sessionTimeout'),
        tooltip: languageService.getTranslation('password.tooltips.sessionTimeout'),
        on: {
          onChange: async function(newValue) {
            try {
              // Use stateManager or implement the method in authService
              const result = await authService.updateSessionTimeout?.(newValue) || 
                           await stateManager.updatePreferences('security', { sessionTimeout: newValue });
              if (result && result.success !== false) {
                webix.message({
                  type: "success",
                  text: languageService.getTranslation('success')
                });
              } else {
                this.setValue(!newValue); // Revert on failure
                webix.message({
                  type: "error",
                  text: result.message || languageService.getTranslation('error')
                });
              }
            } catch (error) {
              this.setValue(!newValue); // Revert on failure
              webix.message({
                type: "error",
                text: languageService.getTranslation('error')
              });
            }
          }
        }
      },
      {
        view: "button",
        responsive: true,
        value: languageService.getTranslation('password.security.sessions.revoke'),
        css: "webix_danger",
        tooltip: languageService.getTranslation('password.tooltips.revokeSessions'),
        click: function() {
          webix.confirm({
            title: languageService.getTranslation('password.security.sessions.revokeConfirm.title'),
            text: languageService.getTranslation('password.security.sessions.revokeConfirm.text'),
            ok: languageService.getTranslation('password.security.sessions.revoke'),
            cancel: languageService.getTranslation('cancel'),
            type: "confirm-error",
            callback: async function(result) {
              if (result) {
                try {
                  // Use stateManager or implement the method in authService
                  const response = await authService.revokeAllSessions?.() || 
                                 await stateManager.updatePreferences('security', { revokeAllSessions: true });
                  if (response && response.success !== false) {
                    webix.message({
                      type: "success",
                      text: languageService.getTranslation('password.security.sessions.revokeSuccess')
                    });
                  } else {
                    webix.message({
                      type: "error",
                      text: response.message || languageService.getTranslation('password.security.sessions.revokeError')
                    });
                  }
                } catch (error) {
                  webix.message({
                    type: "error",
                    text: languageService.getTranslation('password.security.sessions.revokeError')
                  });
                }
              }
            }
          });
        }
      }
    ],
    ready: async function() {
      try {
        // Load current security settings using stateManager or authService
        const settings = await authService.getSecuritySettings?.() || 
                        await stateManager.loadUserPreferences();
        if (settings && (settings.success !== false || settings.privacy || settings.account)) {
          const securityData = settings.data || settings.privacy || settings.account || {};
          this.setValues({
            twoFactorAuth: securityData.twoFactorAuth || false,
            sessionTimeout: securityData.sessionTimeout || false
          });
        }
      } catch (error) {
        console.error('Failed to load security settings:', error);
      }
    }
  };

  // Subscribe to language changes
  languageService.subscribe(() => {
    const formEl = $$("passwordForm");
    if (formEl) {
      // Update form labels and tooltips
      const elements = formEl.getChildViews();
      elements.forEach(element => {
        if (element.config && element.config.name) {
          const key = `account.${element.config.name}`;
          element.define({
            label: languageService.getTranslation(key),
            placeholder: languageService.getTranslation(key),
            tooltip: languageService.getTranslation(`account.tooltips.${element.config.name}`)
          });
        }
      });
      formEl.refresh();
    }
  });

  return form;
};

export default PasswordForm;