import authService from '../../services/authService.js';
import ApiService from '../../services/api.js';

const Login = () => {
  const api = new ApiService();

  return {
    view: "form",
    id: "loginForm",
    width: 400,
    elements: [
      { view: "text", label: "Username", name: "username", required: true },
      { view: "text", label: "Password", name: "password", type: "password", required: true },
      {
        view: "button",
        value: "Login",
        css: "webix_primary",
        click: function() {
          const form = $$("loginForm");
          if (!form.validate()) {
            webix.message({ type: "error", text: "Please fill in all required fields" });
            return;
          }

          const values = form.getValues();
          $$("loadingWindow").show();

          api.login(values.username, values.password)
            .then(data => {
              authService.setTokens(data.access, data.refresh);
              $$("mainView").show("preferences");
              webix.message({ type: "success", text: "Login successful" });
            })
            .catch(error => {
              webix.message({ type: "error", text: error.message || "Login failed" });
            })
            .finally(() => {
              $$("loadingWindow").hide();
            });
        }
      },
    ],
    rules: {
      username: webix.rules.isNotEmpty,
      password: webix.rules.isNotEmpty
    }
  };
};

export default Login; 