// ============================================
// backend/validators/productValidator.js
// ============================================
const productValidator = {
  /**
   * Validate product creation
   * Ensures all required fields are present and valid
   */
  validateCreate(data) {
    const errors = [];

    // SKU validation
    if (!data.sku || typeof data.sku !== 'string' || data.sku.trim().length === 0) {
      errors.push('SKU is required and must be a non-empty string');
    } else if (data.sku.length > 50) {
      errors.push('SKU must not exceed 50 characters');
    }

    // Name validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Product name is required');
    } else if (data.name.length > 255) {
      errors.push('Product name must not exceed 255 characters');
    }

    // Category validation
    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
      errors.push('Category is required');
    }

    // Cost Price validation
    if (data.costPrice !== undefined) {
      if (typeof data.costPrice !== 'number' || isNaN(data.costPrice)) {
        errors.push('Cost price must be a valid number');
      } else if (data.costPrice < 0) {
        errors.push('Cost price cannot be negative');
      }
    }

    // Selling Price validation
    if (data.sellingPrice !== undefined) {
      if (typeof data.sellingPrice !== 'number' || isNaN(data.sellingPrice)) {
        errors.push('Selling price must be a valid number');
      } else if (data.sellingPrice < 0) {
        errors.push('Selling price cannot be negative');
      }
    }

    // On Hand validation
    if (data.onHand !== undefined) {
      if (typeof data.onHand !== 'number' || isNaN(data.onHand)) {
        errors.push('On hand quantity must be a valid number');
      } else if (data.onHand < 0) {
        errors.push('On hand quantity cannot be negative');
      }
    }

    // Free to Use validation
    if (data.freeToUse !== undefined) {
      if (typeof data.freeToUse !== 'number' || isNaN(data.freeToUse)) {
        errors.push('Free to use quantity must be a valid number');
      } else if (data.freeToUse < 0) {
        errors.push('Free to use quantity cannot be negative');
      }
    }

    // Validate that free to use doesn't exceed on hand
    if (data.onHand !== undefined && data.freeToUse !== undefined) {
      if (data.freeToUse > data.onHand) {
        errors.push('Free to use cannot exceed on hand quantity');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate product update
   * Allows partial updates with validation
   */
  validateUpdate(data) {
    const errors = [];

    if (data.name !== undefined && data.name !== null) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Product name cannot be empty');
      } else if (data.name.length > 255) {
        errors.push('Product name must not exceed 255 characters');
      }
    }

    if (data.sku !== undefined && data.sku !== null) {
      if (typeof data.sku !== 'string' || data.sku.trim().length === 0) {
        errors.push('SKU cannot be empty');
      } else if (data.sku.length > 50) {
        errors.push('SKU must not exceed 50 characters');
      }
    }

    if (data.category !== undefined && data.category !== null) {
      if (typeof data.category !== 'string' || data.category.trim().length === 0) {
        errors.push('Category cannot be empty');
      }
    }

    if (data.costPrice !== undefined && data.costPrice !== null) {
      if (typeof data.costPrice !== 'number' || isNaN(data.costPrice)) {
        errors.push('Cost price must be a valid number');
      } else if (data.costPrice < 0) {
        errors.push('Cost price cannot be negative');
      }
    }

    if (data.sellingPrice !== undefined && data.sellingPrice !== null) {
      if (typeof data.sellingPrice !== 'number' || isNaN(data.sellingPrice)) {
        errors.push('Selling price must be a valid number');
      } else if (data.sellingPrice < 0) {
        errors.push('Selling price cannot be negative');
      }
    }

    if (data.onHand !== undefined && data.onHand !== null) {
      if (typeof data.onHand !== 'number' || isNaN(data.onHand)) {
        errors.push('On hand quantity must be a valid number');
      } else if (data.onHand < 0) {
        errors.push('On hand quantity cannot be negative');
      }
    }

    if (data.freeToUse !== undefined && data.freeToUse !== null) {
      if (typeof data.freeToUse !== 'number' || isNaN(data.freeToUse)) {
        errors.push('Free to use quantity must be a valid number');
      } else if (data.freeToUse < 0) {
        errors.push('Free to use quantity cannot be negative');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate low stock alert threshold
   */
  validateLowStockAlert(onHand, freeToUse) {
    const errors = [];

    if (onHand < 50) {
      errors.push('Low stock alert: On hand quantity below 50 units');
    }

    if (freeToUse < 25) {
      errors.push('Low stock alert: Free to use quantity below 25 units');
    }

    return {
      hasAlert: errors.length > 0,
      alerts: errors,
    };
  },
};

module.exports = productValidator;