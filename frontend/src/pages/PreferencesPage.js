import AccountForm from '../components/account/AccountForm.js';
import NotificationForm from '../components/notifications/NotificationForm.js';
import ThemeForm from '../components/theme/ThemeForm.js';
import PrivacyForm from '../components/privacy/PrivacyForm.js';
import LanguageSelector from '../components/common/LanguageSelector.js';
import languageService from '../services/languageService.js';
import authService from '../services/authService.js';
import stateManager from '../utils/stateManager.js';

const PreferencesPage = ({ onLogout }) => {
  // Initialize components
  const accountForm = AccountForm();
  const notificationForm = NotificationForm();
  const themeForm = ThemeForm();
  const privacyForm = PrivacyForm();

  return {
    view: "layout",
    responsive: true,
    rows: [
      {
        cols: [
          {
            view: "sidebar",
            id: "mainSidebar",
            responsive: true,
            css: "preferences-sidebar",
            data: [
              { id: "account", icon: "mdi mdi-account", value: languageService.getTranslation('account.title') },
              { id: "notifications", icon: "mdi mdi-bell", value: languageService.getTranslation('notifications.title') },
              { id: "theme", icon: "mdi mdi-palette", value: languageService.getTranslation('theme.title') },
              { id: "privacy", icon: "mdi mdi-shield", value: languageService.getTranslation('privacy.title') }
            ],
            on: {
              onItemClick: function(id) {
                const mainView = $$("mainView");
                if (mainView) {
                  mainView.setValue(id);
                }
              }
            }
          },
          {
            view: "layout",
            responsive: true,
            rows: [
              {
                view: "toolbar",
                responsive: true,
                css: "webix_dark",
                cols: [
                  { view: "label", label: languageService.getTranslation('preferences.title'), css: "webix_header" },
                  {},
                  LanguageSelector(),
                  {
                    view: "button",
                    responsive: true,
                    label: languageService.getTranslation('logout'),
                    click: onLogout
                  }
                ]
              },
              {
                view: "multiview",
                id: "mainView",
                responsive: true,
                animate: true,
                cells: [
                  {
                    id: "account",
                    responsive: true,
                    rows: [
                      {
                        view: "scrollview",
                        responsive: true,
                        css: "preferences-main-scroll",
                        body: accountForm
                      }
                    ]
                  },
                  {
                    id: "notifications",
                    responsive: true,
                    rows: [
                      {
                        view: "scrollview",
                        responsive: true,
                        css: "preferences-main-scroll",
                        body: notificationForm
                      }
                    ]
                  },
                  {
                    id: "theme",
                    responsive: true,
                    rows: [
                      {
                        view: "scrollview",
                        responsive: true,
                        css: "preferences-main-scroll",
                        body: themeForm
                      }
                    ]
                  },
                  {
                    id: "privacy",
                    responsive: true,
                    rows: [
                      {
                        view: "scrollview",
                        responsive: true,
                        css: "preferences-main-scroll",
                        body: privacyForm
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
};

export default PreferencesPage; 