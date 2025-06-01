import Register from '../components/auth/Register.js';
import languageService from '../services/languageService.js';

const RegisterPage = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const registerForm = Register({
    onSuccess: function() {
      console.log("Registration successful");
      onRegisterSuccess();
    },
    onError: function(error) {
      console.error("Registration error:", error);
      webix.message({ type: "error", text: error.message || "Registration failed. Please try again." });
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
          { view: "label", label: languageService.getTranslation('register.title'), css: "webix_header" },
          {},
          {
            view: "button",
            responsive: true,
            label: languageService.getTranslation('login.title'),
            click: onSwitchToLogin
          }
        ]
      },
      registerForm
    ]
  };
};

export default RegisterPage; 