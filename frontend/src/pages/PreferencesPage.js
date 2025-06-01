import AccountForm from '../components/account/AccountForm.js';
import NotificationForm from '../components/notifications/NotificationForm.js';
import ThemeForm from '../components/theme/ThemeForm.js';
import PrivacyForm from '../components/privacy/PrivacyForm.js';
import PasswordForm from '../components/account/PasswordForm.js';
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
  const passwordForm = PasswordForm();

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
              { id: "password", icon: "mdi mdi-lock", value: languageService.getTranslation('password.title') },
              { id: "notifications", icon: "mdi mdi-bell", value: languageService.getTranslation('notifications.title') },
              { id: "theme", icon: "mdi mdi-palette", value: languageService.getTranslation('theme.title') },
              { id: "privacy", icon: "mdi mdi-shield", value: languageService.getTranslation('privacy.title') }
            ],
            on: {
              onItemClick: function(id) {
                const mainView = $$("mainView");
                mainView.setValue(id);
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
                  {
                    view: "button",
                    type: "icon",
                    icon: "mdi mdi-menu",
                    width: 40,
                    css: "webix_primary",
                    click: function() {
                      const sidebar = $$("mainSidebar");
                      if (sidebar) {
                        if (sidebar.isVisible()) {
                          sidebar.hide();
                          this.define("icon", "mdi mdi-menu");
                        } else {
                          sidebar.show();
                          this.define("icon", "mdi mdi-close");
                        }
                        this.refresh();
                      }
                    }
                  },
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
                    id: "password",
                    responsive: true,
                    rows: [
                      {
                        view: "scrollview",
                        responsive: true,
                        css: "preferences-main-scroll",
                        body: passwordForm
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