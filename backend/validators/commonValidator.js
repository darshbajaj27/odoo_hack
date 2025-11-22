const commonValidator = {
  /**
   * Validate required fields
   */
  validateRequiredFields(data, fields) {
    const errors = [];

    fields.forEach((field) => {
      if (!data[field]) {
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
};

module.exports = commonValidator;
