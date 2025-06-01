import languageService from '../../services/languageService.js';

const LanguageSelector = () => {
  return {
    view: "toolbar",
    css: "language-selector",
    elements: [
      {
        view: "select",
        id: "languageSelect",
        options: languageService.getAvailableLanguages().map(lang => ({
          id: lang.code,
          value: lang.name
        })),
        value: languageService.getCurrentLanguage(),
        on: {
          onChange: function(newValue) {
            languageService.setLanguage(newValue);
            // Reload the page after a short delay to ensure language is saved
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        }
      }
    ]
  };
};

export default LanguageSelector; 