class AccountForm {
  constructor() {
    this.form = {
      view: "form",
      id: "accountForm",
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
              validate: webix.rules.isNotEmpty
            },
            {
              view: "text",
              name: "lastName",
              label: "Last Name",
              placeholder: "Enter last name",
              required: true,
              invalidMessage: "Last name is required",
              validate: webix.rules.isNotEmpty
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
          }
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
          }
        },
        {
          view: "text",
          name: "phone",
          label: "Phone Number",
          placeholder: "Enter phone number (optional)",
          invalidMessage: "Please enter a valid phone number",
          validate: function(value) {
            return Validator.validatePhone(value);
          }
        },
        {
          margin: 20,
          cols: [
            {
              view: "button",
              value: "Change Password",
              css: "webix_primary",
              click: function() {
                webix.confirm({
                  title: "Change Password",
                  text: "Password change functionality would redirect to a secure password change form.",
                  ok: "Continue",
                  cancel: "Cancel"
                }).then(function(result) {
                  if (result) {
                    ErrorHandler.showSuccess("Password change initiated. Check your email for instructions.");
                  }
                });
              }
            },
            { width: 20 },
            {
              view: "button",
              value: "Delete Account",
              css: "webix_danger",
              click: function() {
                webix.confirm({
                  title: "Delete Account",
                  text: "This action cannot be undone. Are you sure you want to delete your account?",
                  ok: "Delete",
                  cancel: "Cancel",
                  type: "confirm-error"
                }).then(function(result) {
                  if (result) {
                    ErrorHandler.showError("Account deletion requires additional verification steps.");
                  }
                });
              }
            }
          ]
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
  module.exports = AccountForm;
} 