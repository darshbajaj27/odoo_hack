const userValidator = {
  validateCreate(data) {
    const errors = [];

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },
};

module.exports = userValidator;
