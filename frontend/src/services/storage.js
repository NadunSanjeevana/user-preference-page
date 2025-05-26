class StorageService {
  constructor() {
    this.storageKey = 'user_preferences';
  }

  savePreferences(preferences) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }

  getPreferences() {
    try {
      const preferences = localStorage.getItem(this.storageKey);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  clearPreferences() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing preferences:', error);
      return false;
    }
  }

  // Auto-save functionality
  setupAutoSave(callback, interval = 30000) {
    this.autoSaveInterval = setInterval(() => {
      if (typeof callback === 'function') {
        callback();
      }
    }, interval);
  }

  clearAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  // Export preferences to file
  exportPreferences(preferences) {
    try {
      const blob = new Blob([JSON.stringify(preferences, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user-preferences.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error exporting preferences:', error);
      return false;
    }
  }

  // Import preferences from file
  importPreferences(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const preferences = JSON.parse(event.target.result);
            this.savePreferences(preferences);
            resolve(preferences);
          } catch (error) {
            reject(new Error('Invalid preferences file format'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageService;
} 