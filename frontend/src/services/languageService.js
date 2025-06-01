import languages from '../config/languages.js';

class LanguageService {
  constructor() {
    this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    this.subscribers = new Set();
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  setLanguage(lang) {
    if (languages[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('preferredLanguage', lang);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  getTranslation(key) {
    const keys = key.split('.');
    let translation = languages[this.currentLanguage];

    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }

    return translation;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentLanguage));
  }

  getAvailableLanguages() {
    return Object.keys(languages).map(code => ({
      code,
      name: this.getLanguageName(code)
    }));
  }

  getLanguageName(code) {
    const names = {
      en: 'English',
      es: 'Español'
    };
    return names[code] || code;
  }
}

// Create a singleton instance
const languageService = new LanguageService();
export default languageService; 