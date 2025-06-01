import stateManager from '../../utils/stateManager.js';

const NotificationForm = () => {
  const form = {
    view: "form",
    id: "notificationForm",
    responsive: true,
    elements: [
      { template: "Notification Settings", type: "section" },
      {
        view: "checkbox",
        name: "emailNotifications",
        label: "Email Notifications",
        responsive: true
      },
      {
        view: "checkbox",
        name: "pushNotifications",
        label: "Push Notifications",
        responsive: true
      },
      {
        view: "checkbox",
        name: "smsNotifications",
        label: "SMS Notifications",
        responsive: true
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
        value: "daily",
        responsive: true
      },
      { template: "Marketing & Security", type: "section" },
      {
        view: "checkbox",
        name: "marketingEmails",
        label: "Marketing Emails",
        responsive: true
      },
      {
        view: "checkbox",
        name: "securityAlerts",
        label: "Security Alerts",
        value: true,
        responsive: true
      },
      {
        margin: 20,
        cols: [
          {
            view: "button",
            value: "Save Changes",
            css: "webix_primary",
            responsive: true,
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