import stateManager from '../../utils/stateManager.js';
import Validator from '../../utils/validator.js';

const AccountForm = () => {
  const form = {
    view: "form",
    id: "accountForm",
    responsive: true,
    elements: [
      { template: "Account Settings", type: "section" },
      {
        cols: [
          {
            view: "text",
            name: "firstName",
            label: "First Name",
            placeholder: "Enter first name",
            required: true,
            invalidMessage: "First name is required",
            validate: webix.rules.isNotEmpty,
            responsive: true
          },
          {
            view: "text",
            name: "lastName",
            label: "Last Name",
            placeholder: "Enter last name",
            required: true,
            invalidMessage: "Last name is required",
            validate: webix.rules.isNotEmpty,
            responsive: true
          }
        ]
      },
      {
        view: "text",
        name: "username",
        label: "Username",
        placeholder: "Enter username (3-20 characters)",
        required: true,
        invalidMessage: "Username must be 3-20 characters, alphanumeric only",
        validate: function(value) {
          return Validator.validateUsername(value);
        },
        responsive: true
      },
      {
        view: "text",
        name: "email",
        label: "Email Address",
        placeholder: "Enter email address",
        required: true,
        invalidMessage: "Please enter a valid email address",
        validate: function(value) {
          return Validator.validateEmail(value);
        },
        responsive: true
      },
      {
        view: "text",
        name: "phone",
        label: "Phone Number",
        placeholder: "Enter phone number (optional)",
        invalidMessage: "Please enter a valid phone number",
        validate: function(value) {
          return Validator.validatePhone(value);
        },
        responsive: true
      },
      {
        cols: [
          {
            view: "button",
            value: "Save Changes",
            css: "webix_primary",
            responsive: true,
            click: async function() {
              const form = $$("accountForm");
              if (form.validate()) {
                try {
                  const values = form.getValues();
                  await stateManager.updatePreferences('account', values);
                  webix.message({ type: "success", text: "Account settings saved successfully" });
                } catch (error) {
                  webix.message({ type: "error", text: error.message });
                }
              }
            }
          },
          {
            view: "button",
            value: "Change Password",
            css: "webix_primary",
            responsive: true,
            click: function() {
              webix.confirm({
                title: "Change Password",
                text: "Password change functionality would redirect to a secure password change form.",
                ok: "Continue",
                cancel: "Cancel"
              }).then(function(result) {
                if (result) {
                  webix.message({ type: "success", text: "Password change initiated. Check your email for instructions." });
                }
              });
            }
          },
          {
            view: "button",
            value: "Delete Account",
            css: "webix_danger",
            responsive: true,
            click: function() {
              webix.confirm({
                title: "Delete Account",
                text: "This action cannot be undone. Are you sure you want to delete your account?",
                ok: "Delete",
                cancel: "Cancel",
                type: "confirm-error"
              }).then(function(result) {
                if (result) {
                  webix.message({ type: "error", text: "Account deletion requires additional verification steps." });
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