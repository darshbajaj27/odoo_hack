/ ============================================
// backend/validators/commonValidator.js
// ============================================
const commonValidator = {
  /**
   * Validate required fields
   */
  validateRequiredFields(data, fields) {
    const errors = [];

    fields.forEach((field) => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`${field} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate string length
   */
  validateStringLength(value, min, max, fieldName) {
    const errors = [];

    if (!value || typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
      return { isValid: false, errors };
    }

    if (value.length < min) {
      errors.push(`${fieldName} must be at least ${min} characters`);
    }

    if (value.length > max) {
      errors.push(`${fieldName} must not exceed ${max} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate number range
   */
  validateNumberRange(value, min, max, fieldName) {
    const errors = [];

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
      return { isValid: false, errors };
    }

    if (value < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }

    if (value > max) {
      errors.push(`${fieldName} must not exceed ${max}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate enum values
   */
  validateEnum(value, allowedValues, fieldName) {
    const isValid = allowedValues.includes(value);

    return {
      isValid,
      errors: isValid ? [] : [`${fieldName} must be one of: ${allowedValues.join(', ')}`],
    };
  },

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate positive number
   */
  validatePositiveNumber(value, fieldName) {
    const errors = [];

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
    } else if (value <= 0) {
      errors.push(`${fieldName} must be greater than 0`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate non-negative number
   */
  validateNonNegativeNumber(value, fieldName) {
    const errors = [];

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
    } else if (value < 0) {
      errors.push(`${fieldName} must be non-negative`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = commonValidator;
