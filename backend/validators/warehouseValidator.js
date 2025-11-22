// ============================================
// backend/validators/warehouseValidator.js
// ============================================
const warehouseValidator = {
  /**
   * Validate warehouse creation
   */
  validateCreate(data) {
    const errors = [];

    // Name validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Warehouse name is required');
    } else if (data.name.length > 100) {
      errors.push('Warehouse name must not exceed 100 characters');
    }

    // Short code validation
    if (!data.shortCode || typeof data.shortCode !== 'string' || data.shortCode.trim().length === 0) {
      errors.push('Short code is required');
    } else if (data.shortCode.length > 10) {
      errors.push('Short code must not exceed 10 characters');
    } else if (!/^[A-Z0-9]+$/.test(data.shortCode)) {
      errors.push('Short code must contain only uppercase letters and numbers');
    }

    // Address validation
    if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
      errors.push('Address is required');
    } else if (data.address.length > 255) {
      errors.push('Address must not exceed 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate warehouse update
   */
  validateUpdate(data) {
    const errors = [];

    if (data.name !== undefined && data.name !== null) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Warehouse name cannot be empty');
      } else if (data.name.length > 100) {
        errors.push('Warehouse name must not exceed 100 characters');
      }
    }

    if (data.shortCode !== undefined && data.shortCode !== null) {
      if (typeof data.shortCode !== 'string' || data.shortCode.trim().length === 0) {
        errors.push('Short code cannot be empty');
      } else if (data.shortCode.length > 10) {
        errors.push('Short code must not exceed 10 characters');
      } else if (!/^[A-Z0-9]+$/.test(data.shortCode)) {
        errors.push('Short code must contain only uppercase letters and numbers');
      }
    }

    if (data.address !== undefined && data.address !== null) {
      if (typeof data.address !== 'string' || data.address.trim().length === 0) {
        errors.push('Address cannot be empty');
      } else if (data.address.length > 255) {
        errors.push('Address must not exceed 255 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = warehouseValidator;
