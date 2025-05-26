class ErrorHandler {
  static showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    errorDiv.setAttribute("role", "alert");
    errorDiv.setAttribute("aria-live", "assertive");

    const container = document.querySelector(".preferences-container");
    container.insertBefore(errorDiv, container.firstChild);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  static showSuccess(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.innerHTML = `<strong>Success:</strong> ${message}`;
    successDiv.setAttribute("role", "status");
    successDiv.setAttribute("aria-live", "polite");

    const container = document.querySelector(".preferences-container");
    container.insertBefore(successDiv, container.firstChild);

    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 5000);
  }

  static handleApiError(error) {
    console.error('API Error:', error);
    
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error
      message = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response
      message = 'No response from server. Please check your connection.';
    }
    
    this.showError(message);
  }

  static handleValidationError(errors) {
    Object.values(errors).forEach(error => {
      this.showError(error);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
} 