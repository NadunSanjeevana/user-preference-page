class Validator {
  static validateUsername(username) {
    if (!username) return false;
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  }

  static validateEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    return /^\+?[\d\s-]{10,}$/.test(phone);
  }

  static validatePassword(password) {
    if (!password) return false;
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
  }
}

export default Validator; 