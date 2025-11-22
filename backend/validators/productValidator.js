const { PrismaClient } = require('@prisma/client');

const productValidator = {
  validateCreate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (!data.sku || data.sku.trim().length === 0) {
      errors.push('SKU is required');
    }

    if (!data.category || data.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (typeof data.price !== 'number' || data.price < 0) {
      errors.push('Price must be a positive number');
    }

    if (typeof data.quantity !== 'number' || data.quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  validateUpdate(data) {
    const errors = [];

    if (data.name && data.name.trim().length === 0) {
      errors.push('Product name cannot be empty');
    }

    if (data.sku && data.sku.trim().length === 0) {
      errors.push('SKU cannot be empty');
    }

    if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
      errors.push('Price must be a positive number');
    }

    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || data.quantity < 0)) {
      errors.push('Quantity must be a non-negative number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = productValidator;
