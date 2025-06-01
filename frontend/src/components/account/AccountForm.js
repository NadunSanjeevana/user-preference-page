import stateManager from '../../utils/stateManager.js';
import Validator from '../../utils/validator.js';
import languageService from '../../services/languageService.js';

const AccountForm = () => {
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
            tooltip: languageService.getTranslation('account.tooltips.firstName')
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
            tooltip: languageService.getTranslation('account.tooltips.lastName')
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
        tooltip: languageService.getTranslation('account.tooltips.username')
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
        tooltip: languageService.getTranslation('account.tooltips.email')
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
        tooltip: languageService.getTranslation('account.tooltips.phone')
      },
      {
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
            value: languageService.getTranslation('account.changePassword'),
            css: "webix_primary",
            responsive: true,
            click: function() {
              webix.confirm({
                title: languageService.getTranslation('account.changePassword'),
                text: languageService.getTranslation('account.tooltips.password'),
                ok: languageService.getTranslation('save'),
                cancel: languageService.getTranslation('cancel')
              }).then(function(result) {
                if (result) {
                  webix.message({ 
                    type: "success", 
                    text: languageService.getTranslation('success') 
                  });
                }
              });
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