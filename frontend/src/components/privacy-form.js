import stateManager from '../utils/stateManager.js';
import ErrorHandler from '../utils/errorHandler.js';

const PrivacyForm = () => {
  const form = {
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
            value: "Save Changes",
            css: "webix_primary",
            click: async function() {
              const form = $$("privacyForm");
              try {
                const values = form.getValues();
                await stateManager.updatePreferences('privacy', values);
                webix.message({ type: "success", text: "Privacy settings saved successfully" });
              } catch (error) {
                webix.message({ type: "error", text: error.message });
              }
            }
          },
          { width: 20 },
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
    ],
    on: {
      onShow: function() {
        // Load privacy data when form is shown
        const privacyData = stateManager.state.privacy;
        if (privacyData) {
          this.setValues(privacyData);
        }
      }
    }
  };

  // Subscribe to state changes
  stateManager.subscribe((state) => {
    const form = $$("privacyForm");
    if (form && state.privacy) {
      form.setValues(state.privacy);
    }
  });

  return form;
};

export default PrivacyForm; 