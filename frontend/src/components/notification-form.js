import stateManager from '../utils/stateManager.js';

const NotificationForm = () => {
  const form = {
    view: "form",
    id: "notificationForm",
    elements: [
      { template: "Notification Settings", type: "section" },
      {
        view: "checkbox",
        name: "emailNotifications",
        label: "Email Notifications",
        labelWidth: 200
      },
      {
        view: "checkbox",
        name: "pushNotifications",
        label: "Push Notifications",
        labelWidth: 200
      },
      {
        view: "checkbox",
        name: "smsNotifications",
        label: "SMS Notifications",
        labelWidth: 200
      },
      {
        view: "richselect",
        name: "frequency",
        label: "Notification Frequency",
        options: [
          { id: "immediate", value: "Immediate" },
          { id: "hourly", value: "Hourly" },
          { id: "daily", value: "Daily" },
          { id: "weekly", value: "Weekly" },
          { id: "never", value: "Never" }
        ],
        value: "daily"
      },
      { template: "Marketing & Security", type: "section" },
      {
        view: "checkbox",
        name: "marketingEmails",
        label: "Marketing Emails",
        labelWidth: 200
      },
      {
        view: "checkbox",
        name: "securityAlerts",
        label: "Security Alerts",
        labelWidth: 200,
        value: true
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: "Save Changes",
            css: "webix_primary",
            click: async function() {
              const form = $$("notificationForm");
              try {
                const values = form.getValues();
                await stateManager.updatePreferences('notifications', values);
                webix.message({ type: "success", text: "Notification settings saved successfully" });
              } catch (error) {
                webix.message({ type: "error", text: error.message });
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
    }
  };

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("notificationForm");
    if (form && state.notifications) {
      form.setValues(state.notifications);
    }
  });

  return form;
};

export default NotificationForm; 