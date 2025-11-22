const operationValidator = {
  validateCreate(data) {
    const errors = [];
    const validTypes = ['INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT'];

    if (!data.productId || data.productId.trim().length === 0) {
      errors.push('Product ID is required');
    }

    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }

    if (!data.type || !validTypes.includes(data.type)) {
      errors.push(`Operation type must be one of: ${validTypes.join(', ')}`);
    }

    if (data.type === 'TRANSFER') {
      if (!data.fromLocationId || data.fromLocationId.trim().length === 0) {
        errors.push('From location is required for transfer operations');
      }
      if (!data.toLocationId || data.toLocationId.trim().length === 0) {
        errors.push('To location is required for transfer operations');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  validateUpdate(data) {
    const errors = [];
    const validTypes = ['INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT'];

    if (data.type && !validTypes.includes(data.type)) {
      errors.push(`Operation type must be one of: ${validTypes.join(', ')}`);
    }

    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || data.quantity <= 0)) {
      errors.push('Quantity must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = operationValidator;
