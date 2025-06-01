import stateManager from '../../utils/stateManager.js';
import ErrorHandler from '../../utils/errorHandler.js';
import languageService from '../../services/languageService.js';

const PrivacyForm = () => {
  const form = {
    view: "form",
    id: "privacyForm",
    responsive: true,
    elements: [
      { 
        template: languageService.getTranslation('privacy.title'), 
        type: "section" 
      },
      {
        view: "richselect",
        name: "profileVisibility",
        label: languageService.getTranslation('privacy.profileVisibility'),
        tooltip: languageService.getTranslation('privacy.tooltips.profileVisibility'),
        options: [
          { id: "public", value: languageService.getTranslation('privacy.visibility.public') },
          { id: "friends", value: languageService.getTranslation('privacy.visibility.friends') },
          { id: "private", value: languageService.getTranslation('privacy.visibility.private') }
        ],
        value: "friends",
        responsive: true
      },
      {
        view: "checkbox",
        name: "dataSharing",
        label: languageService.getTranslation('privacy.dataSharing'),
        tooltip: languageService.getTranslation('privacy.tooltips.dataSharing'),
        responsive: true
      },
      {
        view: "checkbox",
        name: "analyticsTracking",
        label: languageService.getTranslation('privacy.analyticsTracking'),
        tooltip: languageService.getTranslation('privacy.tooltips.analyticsTracking'),
        value: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "locationSharing",
        label: languageService.getTranslation('privacy.locationSharing'),
        tooltip: languageService.getTranslation('privacy.tooltips.locationSharing'),
        responsive: true
      },
      {
        view: "checkbox",
        name: "activityStatus",
        label: languageService.getTranslation('privacy.activityStatus'),
        tooltip: languageService.getTranslation('privacy.tooltips.activityStatus'),
        value: true,
        responsive: true
      },
      {
        view: "checkbox",
        name: "searchableProfile",
        label: languageService.getTranslation('privacy.searchableProfile'),
        tooltip: languageService.getTranslation('privacy.tooltips.searchableProfile'),
        value: true,
        responsive: true
      },
      { 
        template: languageService.getTranslation('privacy.dataManagement'), 
        type: "section" 
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
              const form = $$("privacyForm");
              try {
                const values = form.getValues();
                await stateManager.updatePreferences('privacy', values);
                webix.message({ 
                  type: "success", 
                  text: languageService.getTranslation('privacy.success') 
                });
              } catch (error) {
                webix.message({ 
                  type: "error", 
                  text: error.message 
                });
              }
            }
          },
          { width: 20 },
          {
            view: "button",
            value: languageService.getTranslation('privacy.exportData'),
            css: "webix_primary",
            responsive: true,
            click: function() {
              ErrorHandler.showSuccess(languageService.getTranslation('privacy.exportInitiated'));
            }
          },
          { width: 20 },
          {
            view: "button",
            value: languageService.getTranslation('privacy.clearData'),
            css: "webix_danger",
            responsive: true,
            click: function() {
              webix.confirm({
                title: languageService.getTranslation('privacy.clearData'),
                text: languageService.getTranslation('privacy.clearDataWarning'),
                ok: languageService.getTranslation('privacy.clear'),
                cancel: languageService.getTranslation('cancel')
              }).then(function(result) {
                if (result) {
                  ErrorHandler.showSuccess(languageService.getTranslation('privacy.dataCleared'));
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

  // Subscribe to language changes
  languageService.subscribe(() => {
    const form = $$("privacyForm");
    if (form) {
      // Update form labels and tooltips
      const elements = form.getChildViews();
      elements.forEach(element => {
        if (element.config && element.config.name) {
          const key = `privacy.${element.config.name}`;
          element.define({
            label: languageService.getTranslation(key),
            placeholder: languageService.getTranslation(key),
            tooltip: languageService.getTranslation(`privacy.tooltips.${element.config.name}`)
          });

          // Update options for richselect
          if (element.config.view === "richselect" && element.config.name === "profileVisibility") {
            element.define({
              options: [
                { id: "public", value: languageService.getTranslation('privacy.visibility.public') },
                { id: "friends", value: languageService.getTranslation('privacy.visibility.friends') },
                { id: "private", value: languageService.getTranslation('privacy.visibility.private') }
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

export default PrivacyForm; 