class Validator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username) {
    return (
      username &&
      username.length >= 3 &&
      username.length <= 20 &&
      /^[a-zA-Z0-9._-]+$/.test(username)
    );
  }

  static validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return !phone || phoneRegex.test(phone);
  }

  static validateRequired(value) {
    return !!(value && value.toString().trim().length > 0);
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateForm(formData) {
    const errors = {};

    // Account validation
    if (formData.account) {
      if (!this.validateRequired(formData.account.firstName)) {
        errors.firstName = "First name is required";
      }
      if (!this.validateRequired(formData.account.lastName)) {
        errors.lastName = "Last name is required";
      }
      if (!this.validateUsername(formData.account.username)) {
        errors.username = "Username must be 3-20 characters, alphanumeric only";
      }
      if (!this.validateEmail(formData.account.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (formData.account.phone && !this.validatePhone(formData.account.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validator;
} 