import stateManager from '../../utils/stateManager.js';
import languageService from '../../services/languageService.js';

const NotificationForm = () => {
  const form = {
    view: "form",
    id: "notificationForm",
    responsive: true,
    elements: [
      { 
        template: languageService.getTranslation('notifications.title'), 
        type: "section" 
      },
      {
        view: "checkbox",
        name: "emailNotifications",
        label: languageService.getTranslation('notifications.emailNotifications'),
        tooltip: languageService.getTranslation('notifications.tooltips.emailNotifications'),
        css: "required-field",
        required: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "pushNotifications",
        label: languageService.getTranslation('notifications.pushNotifications'),
        tooltip: languageService.getTranslation('notifications.tooltips.pushNotifications'),
        css: "required-field",
        required: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "smsNotifications",
        label: languageService.getTranslation('notifications.smsNotifications'),
        tooltip: languageService.getTranslation('notifications.tooltips.smsNotifications'),
        responsive: true
      },
      {
        view: "richselect",
        name: "frequency",
        label: languageService.getTranslation('notifications.frequency'),
        tooltip: languageService.getTranslation('notifications.tooltips.frequency'),
        css: "required-field",
        required: true,
        options: [
          { id: "immediate", value: languageService.getTranslation('notifications.frequencies.immediate') },
          { id: "hourly", value: languageService.getTranslation('notifications.frequencies.hourly') },
          { id: "daily", value: languageService.getTranslation('notifications.frequencies.daily') },
          { id: "weekly", value: languageService.getTranslation('notifications.frequencies.weekly') },
          { id: "never", value: languageService.getTranslation('notifications.frequencies.never') }
        ],
        value: "daily",
        responsive: true
      },
      { 
        template: languageService.getTranslation('notifications.marketingAndSecurity'), 
        type: "section" 
      },
      {
        view: "checkbox",
        name: "marketingEmails",
        label: languageService.getTranslation('notifications.types.marketing'),
        tooltip: languageService.getTranslation('notifications.tooltips.marketing'),
        css: "required-field",
        required: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "securityAlerts",
        label: languageService.getTranslation('notifications.types.security'),
        tooltip: languageService.getTranslation('notifications.tooltips.security'),
        css: "required-field",
        required: true,
        value: true,
        responsive: true
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: languageService.getTranslation('save'),
            css: "webix_primary",
            responsive: true,
            click: async function() {
              const form = $$("notificationForm");
              try {
                const values = form.getValues();
                await stateManager.updatePreferences('notifications', values);
                webix.message({ 
                  type: "success", 
                  text: languageService.getTranslation('notifications.success') 
                });
              } catch (error) {
                webix.message({ 
                  type: "error", 
                  text: error.message 
                });
              }
            }
          }
        ]
      }
    ],
    on: {
      onShow: function() {
        // Load notification data when form is shown
        const notificationData = stateManager.state.notifications;
        if (notificationData) {
          this.setValues(notificationData);
        }
      }
    },
    rules: {
      emailNotifications: webix.rules.isNotEmpty,
      pushNotifications: webix.rules.isNotEmpty,
      frequency: webix.rules.isNotEmpty,
      securityAlerts: webix.rules.isNotEmpty
    }
  };

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("notificationForm");
    if (form && state.notifications) {
      form.setValues(state.notifications);
    }
  });

  // Subscribe to language changes
  languageService.subscribe(() => {
    const form = $$("notificationForm");
    if (form) {
      // Update form labels and tooltips
      const elements = form.getChildViews();
      elements.forEach(element => {
        if (element.config && element.config.name) {
          const key = `notifications.${element.config.name}`;
          element.define({
            label: languageService.getTranslation(key),
            placeholder: languageService.getTranslation(key),
            tooltip: languageService.getTranslation(`notifications.tooltips.${element.config.name}`)
          });

          // Update options for richselect
          if (element.config.view === "richselect" && element.config.name === "frequency") {
            element.define({
              options: [
                { id: "immediate", value: languageService.getTranslation('notifications.frequencies.immediate') },
                { id: "hourly", value: languageService.getTranslation('notifications.frequencies.hourly') },
                { id: "daily", value: languageService.getTranslation('notifications.frequencies.daily') },
                { id: "weekly", value: languageService.getTranslation('notifications.frequencies.weekly') },
                { id: "never", value: languageService.getTranslation('notifications.frequencies.never') }
              ]
            });
          }
        }
      });
      form.refresh();
    }
  });

  return form;
};

export default NotificationForm; 