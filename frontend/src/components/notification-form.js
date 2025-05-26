class NotificationForm {
  constructor() {
    this.form = {
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
        }
      ]
    };
  }

  getForm() {
    return this.form;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationForm;
} 