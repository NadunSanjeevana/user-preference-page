class ErrorHandler {
  static showError(message) {
    webix.message({ type: "error", text: message });
  }

  static showSuccess(message) {
    webix.message({ type: "success", text: message });
  }

  static showWarning(message) {
    webix.message({ type: "warning", text: message });
  }

  static handleApiError(error) {
    console.error('API Error:', error);
    this.showError(error.message || 'An error occurred while communicating with the server');
  }

  static handleValidationError(errors) {
    if (typeof errors === 'string') {
      this.showError(errors);
    } else if (typeof errors === 'object') {
      Object.values(errors).forEach(error => {
        this.showError(error);
      });
    }
  }
}

export default ErrorHandler; 