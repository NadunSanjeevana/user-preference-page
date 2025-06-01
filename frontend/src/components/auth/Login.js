import authService from '../../services/authService.js';
import ApiService from '../../services/api.js';

const Login = (callbacks = {}) => {
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
    id: "loginForm",
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
        label: "Password", 
        name: "password", 
        type: "password", 
        required: true,
                responsive: true
      },
      {
        view: "button",
        value: "Login",
        css: "webix_primary",
                responsive: true,
        click: function() {
          const form = $$("loginForm");
          if (!form.validate()) {
            webix.message({ type: "error", text: "Please fill in all required fields" });
            return;
          }

          const values = form.getValues();
          
          // Show loading state
          this.disable();
          this.setValue("Logging in...");
          
          const loadingWindow = $$("loadingWindow");
          if (loadingWindow) {
            loadingWindow.show();
          }

          api.login(values.username, values.password)
            .then(data => {
              // Store authentication tokens
              authService.setTokens(data.access, data.refresh);
              
              // Clear the form
              form.clear();
              
              // Show success message
              webix.message({ type: "success", text: "Login successful" });
              
              // Call the success callback to navigate to authenticated view
              if (onSuccess) {
                onSuccess(data);
              } else {
                // Fallback if no callback provided
                console.warn("No onSuccess callback provided for login");
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
              console.error("Login error:", error);
              
              // Call error callback or show default error
              if (onError) {
                onError(error);
              } else {
                webix.message({ 
                  type: "error", 
                  text: error.message || "Login failed. Please check your credentials." 
                });
              }
            })
            .finally(() => {
              // Reset button state
              this.enable();
              this.setValue("Login");
              
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
                mainView.setValue('register');
              }
              return false;
            ">
              Don't have an account? Register here
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
      password: webix.rules.isNotEmpty
    }
          },
          {}
        ]
      },
      {}
    ]
  };
};

export default Login;