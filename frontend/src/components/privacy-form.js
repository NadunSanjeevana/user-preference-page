class PrivacyForm {
  constructor() {
    this.form = {
      view: "form",
      id: "privacyForm",
      elements: [
        { template: "Privacy Settings", type: "section" },
        {
          view: "richselect",
          name: "profileVisibility",
          label: "Profile Visibility",
          options: [
            { id: "public", value: "Public" },
            { id: "friends", value: "Friends Only" },
            { id: "private", value: "Private" }
          ],
          value: "friends"
        },
        {
          view: "checkbox",
          name: "dataSharing",
          label: "Allow Data Sharing",
          labelWidth: 200
        },
        {
          view: "checkbox",
          name: "analyticsTracking",
          label: "Analytics Tracking",
          labelWidth: 200,
          value: true
        },
        {
          view: "checkbox",
          name: "locationSharing",
          label: "Location Sharing",
          labelWidth: 200
        },
        {
          view: "checkbox",
          name: "activityStatus",
          label: "Show Activity Status",
          labelWidth: 200,
          value: true
        },
        {
          view: "checkbox",
          name: "searchableProfile",
          label: "Searchable Profile",
          labelWidth: 200,
          value: true
        },
        { template: "Data Management", type: "section" },
        {
          margin: 20,
          cols: [
            {
              view: "button",
              value: "Export Data",
              css: "webix_primary",
              click: function() {
                ErrorHandler.showSuccess("Data export initiated. You will receive an email when ready.");
              }
            },
            { width: 20 },
            {
              view: "button",
              value: "Clear Data",
              css: "webix_danger",
              click: function() {
                webix.confirm({
                  title: "Clear Data",
                  text: "This will clear all your stored data. This action cannot be undone.",
                  ok: "Clear",
                  cancel: "Cancel"
                }).then(function(result) {
                  if (result) {
                    ErrorHandler.showSuccess("Data cleared successfully.");
                  }
                });
              }
            }
          ]
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
  module.exports = PrivacyForm;
} 