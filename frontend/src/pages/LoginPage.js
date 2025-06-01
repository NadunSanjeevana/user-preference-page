import Login from '../components/auth/Login.js';
import languageService from '../services/languageService.js';

const LoginPage = ({ onLoginSuccess, onSwitchToRegister }) => {
  const loginForm = Login({
    onSuccess: function() {
      console.log("Login successful");
      onLoginSuccess();
    },
    onError: function(error) {
      console.error("Login error:", error);
      webix.message({ type: "error", text: error.message || "Login failed. Please try again." });
    }
  });

  return {
    view: "layout",
    responsive: true,
    rows: [
      {
        view: "toolbar",
        responsive: true,
        css: "webix_dark",
        cols: [
          { view: "label", label: languageService.getTranslation('login.title'), css: "webix_header" },
          {},
          {
            view: "button",
            responsive: true,
            label: languageService.getTranslation('register.title'),
            click: onSwitchToRegister
          }
        ]
      },
      loginForm
    ]
  };
};

export default LoginPage; 