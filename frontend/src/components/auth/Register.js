import authService from '../../services/authService.js';
import ApiService from '../../services/api.js';

const Register = (callbacks = {}) => {
  const api = new ApiService();
  const { onSuccess, onError } = callbacks;

  return {
    view: "layout",
    type: "space",
    responsive: true,
    rows: [
      {},
      {
        cols: [
          {},
          {
            view: "form",
            id: "registerForm",
            responsive: true,
            elements: [
              { 
                view: "text", 
                label: "Username", 
                name: "username", 
                required: true,
                responsive: true
              },
              { 
                view: "text", 
                label: "Email", 
                name: "email", 
                required: true,
                responsive: true
              },
              { 
                view: "text", 
                label: "Password", 
                name: "password", 
                type: "password", 
                required: true,
                responsive: true
              },
              { 
                view: "text", 
                label: "Confirm Password", 
                name: "confirmPassword", 
                type: "password", 
                required: true,
                responsive: true
              },
              {
                view: "button",
                value: "Register",
                css: "webix_primary",
                responsive: true,
                click: function() {
                  const form = $$("registerForm");
                  if (!form.validate()) {
                    webix.message({ type: "error", text: "Please fill in all required fields" });
                    return;
                  }

                  const values = form.getValues();
                  if (values.password !== values.confirmPassword) {
                    webix.message({ type: "error", text: "Passwords do not match" });
                    return;
                  }

                  if (values.password.length < 8) {
                    webix.message({ type: "error", text: "Password must be at least 8 characters long" });
                    return;
                  }

                  // Show loading state
                  this.disable();
                  this.setValue("Registering...");

                  const loadingWindow = $$("loadingWindow");
                  if (loadingWindow) {
                    loadingWindow.show();
                  }

                  api.register({
                    username: values.username,
                    email: values.email,
                    password: values.password
                  })
                    .then(() => {
                      return api.login(values.username, values.password);
                    })
                    .then(data => {
                      // Store authentication tokens
                      authService.setTokens(data.access, data.refresh);
                      
                      // Clear the form
                      form.clear();
                      
                      // Show success message
                      webix.message({ type: "success", text: "Registration successful" });
                      
                      // Call the success callback to navigate to authenticated view
                      if (onSuccess) {
                        onSuccess(data);
                      } else {
                        // Fallback if no callback provided
                        console.warn("No onSuccess callback provided for registration");
                        // Try to navigate manually
                        const mainView = $$("mainView");
                        const sidebar = $$("mainSidebar");
                        if (mainView) {
                          mainView.setValue("account");
                        }
                        if (sidebar) {
                          sidebar.show();
                          sidebar.select("account");
                        }
                      }
                    })
                    .catch(error => {
                      console.error("Registration error:", error);
                      
                      // Call error callback or show default error
                      if (onError) {
                        onError(error);
                      } else {
                        webix.message({ 
                          type: "error", 
                          text: error.message || "Registration failed" 
                        });
                      }
                    })
                    .finally(() => {
                      // Reset button state
                      this.enable();
                      this.setValue("Register");
                      
                      // Hide loading window
                      if (loadingWindow) {
                        loadingWindow.hide();
                      }
                    });
                }
              },
              {
                view: "template",
                template: `
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="#" onclick="
                      const mainView = webix.$$('mainView');
                      if (mainView) {
                        mainView.setValue('login');
                      }
                      return false;
                    ">
                      Already have an account? Login here
                    </a>
                  </div>
                `,
                height: 50,
                borderless: true,
                responsive: true
              }
            ],
            rules: {
              username: webix.rules.isNotEmpty,
              email: webix.rules.isEmail,
              password: webix.rules.isNotEmpty,
              confirmPassword: webix.rules.isNotEmpty
            }
          },
          {}
        ]
      },
      {}
    ]
  };
};

export default Register;