import authService from '../../services/authService.js';
import ApiService from '../../services/api.js';

const Register = () => {
  const api = new ApiService();

  return {
    view: "form",
    id: "registerForm",
    width: 400,
    elements: [
      { view: "text", label: "Username", name: "username", required: true },
      { view: "text", label: "Email", name: "email", required: true },
      { view: "text", label: "Password", name: "password", type: "password", required: true },
      { view: "text", label: "Confirm Password", name: "confirmPassword", type: "password", required: true },
      {
        view: "button",
        value: "Register",
        css: "webix_primary",
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

          $$("loadingWindow").show();

          api.register({
            username: values.username,
            email: values.email,
            password: values.password
          })
            .then(() => {
              return api.login(values.username, values.password);
            })
            .then(data => {
              authService.setTokens(data.access, data.refresh);
              $$("mainView").show("preferences");
              webix.message({ type: "success", text: "Registration successful" });
            })
            .catch(error => {
              webix.message({ type: "error", text: error.message || "Registration failed" });
            })
            .finally(() => {
              $$("loadingWindow").hide();
            });
        }
      },
      {
        view: "button",
        value: "Back to Login",
        css: "webix_secondary",
        click: function() {
          $$("mainView").show("login");
        }
      }
    ],
    rules: {
      username: webix.rules.isNotEmpty,
      email: webix.rules.isEmail,
      password: webix.rules.isNotEmpty,
      confirmPassword: webix.rules.isNotEmpty
    }
  };
};

export default Register; 