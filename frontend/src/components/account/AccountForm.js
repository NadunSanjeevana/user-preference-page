import stateManager from '../../utils/stateManager.js';
import Validator from '../../utils/validation.js';
import languageService from '../../services/languageService.js';

const AccountForm = () => {
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
    id: "accountForm",
    responsive: true,
    elements: [
      { 
        template: languageService.getTranslation('account.title'), 
        type: "section" 
      },
      {
        cols: [
          {
            view: "text",
            name: "firstName",
            label: languageService.getTranslation('account.firstName'),
            placeholder: languageService.getTranslation('account.firstName'),
            required: true,
            invalidMessage: languageService.getTranslation('required'),
            validate: webix.rules.isNotEmpty,
            responsive: true,
            tooltip: languageService.getTranslation('account.tooltips.firstName'),
            labelPosition: "top",
            css: "required-field"
          },
          {
            view: "text",
            name: "lastName",
            label: languageService.getTranslation('account.lastName'),
            placeholder: languageService.getTranslation('account.lastName'),
            required: true,
            invalidMessage: languageService.getTranslation('required'),
            validate: webix.rules.isNotEmpty,
            responsive: true,
            tooltip: languageService.getTranslation('account.tooltips.lastName'),
            labelPosition: "top",
            css: "required-field"
          }
        ]
      },
      {
        view: "text",
        name: "username",
        label: languageService.getTranslation('account.username'),
        placeholder: languageService.getTranslation('account.username'),
        required: true,
        invalidMessage: languageService.getTranslation('account.tooltips.username'),
        validate: function(value) {
          return Validator.validateUsername(value);
        },
        responsive: true,
        tooltip: languageService.getTranslation('account.tooltips.username'),
        labelPosition: "top",
        css: "required-field"
      },
      {
        view: "text",
        name: "email",
        label: languageService.getTranslation('account.email'),
        placeholder: languageService.getTranslation('account.email'),
        required: true,
        invalidMessage: languageService.getTranslation('account.tooltips.email'),
        validate: function(value) {
          return Validator.validateEmail(value);
        },
        responsive: true,
        tooltip: languageService.getTranslation('account.tooltips.email'),
        labelPosition: "top",
        css: "required-field"
      },
      {
        view: "text",
        name: "phone",
        label: languageService.getTranslation('account.phone'),
        placeholder: languageService.getTranslation('account.phone'),
        invalidMessage: languageService.getTranslation('account.tooltips.phone'),
        validate: function(value) {
          return Validator.validatePhone(value);
        },
        responsive: true,
        tooltip: languageService.getTranslation('account.tooltips.phone'),
        labelPosition: "top",
        attributes: { type: "tel" }
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
              const form = $$("accountForm");
              if (form.validate()) {
                try {
                  const values = form.getValues();
                  await stateManager.updatePreferences('account', values);
                  webix.message({ 
                    type: "success", 
                    text: languageService.getTranslation('success') 
                  });
                } catch (error) {
                  webix.message({ 
                    type: "error", 
                    text: error.message 
                  });
                }
              }
            }
          },
          {
            view: "button",
            value: languageService.getTranslation('account.deleteAccount'),
            css: "webix_danger",
            responsive: true,
            click: function() {
              webix.confirm({
                title: languageService.getTranslation('account.deleteAccount'),
                text: languageService.getTranslation('account.tooltips.deleteAccount'),
                ok: languageService.getTranslation('account.deleteAccount'),
                cancel: languageService.getTranslation('cancel'),
                type: "confirm-error"
              }).then(function(result) {
                if (result) {
                  webix.message({ 
                    type: "error", 
                    text: languageService.getTranslation('error') 
                  });
                }
              });
            }
          }
        ]
      },
      { 
        template: languageService.getTranslation('account.passwordSection'), 
        type: "section" 
      },
      {
        view: "text",
        name: "currentPassword",
        label: languageService.getTranslation('account.currentPassword'),
        placeholder: languageService.getTranslation('account.currentPassword'),
        type: "password",
        required: true,
        invalidMessage: languageService.getTranslation('required'),
        validate: function(value) {
          return Validator.validatePassword(value);
        },
        responsive: true,
        labelPosition: "top",
        css: "required-field",
        attributes: { autocomplete: "current-password" },
        on: {
          onAfterRender: addPasswordToggle
        }
      },
      {
        view: "text",
        name: "newPassword",
        label: languageService.getTranslation('account.newPassword'),
        placeholder: languageService.getTranslation('account.newPassword'),
        type: "password",
        required: true,
        invalidMessage: languageService.getTranslation('required'),
        validate: function(value) {
          return Validator.validatePassword(value);
        },
        responsive: true,
        labelPosition: "top",
        css: "required-field",
        attributes: { autocomplete: "new-password" },
        on: {
          onAfterRender: addPasswordToggle
        }
      },
      {
        view: "text",
        name: "confirmPassword",
        label: languageService.getTranslation('account.confirmPassword'),
        placeholder: languageService.getTranslation('account.confirmPassword'),
        type: "password",
        required: true,
        invalidMessage: languageService.getTranslation('required'),
        validate: function(value) {
          const newPassword = $$("accountForm").getValues().newPassword;
          return value === newPassword;
        },
        responsive: true,
        labelPosition: "top",
        css: "required-field",
        attributes: { autocomplete: "new-password" },
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
              const form = $$("accountForm");
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
              
              try {
                // Call API to update password
                await stateManager.updatePassword({
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword
                });
                
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
        // Load account data when form is shown
        const accountData = stateManager.state.account;
        if (accountData) {
          this.setValues(accountData);
        }
      }
    }
  };

  // Subscribe to language changes
  languageService.subscribe(() => {
    const form = $$("accountForm");
    if (form) {
      // Update form labels and tooltips
      const elements = form.getChildViews();
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
      form.refresh();
    }
  });

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("accountForm");
    if (form && state.account) {
      form.setValues(state.account);
    }
  });

  return form;
};

export default AccountForm;