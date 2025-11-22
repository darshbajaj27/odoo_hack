// ============================================
// backend/validators/operationValidator.js
// ============================================
const operationValidator = {
  /**
   * Validate operation creation
   * Validates receipts, deliveries, internal transfers, and adjustments
   */
  validateCreate(data) {
    const errors = [];
    const validTypes = ['RECEIPT', 'DELIVERY', 'INTERNAL', 'ADJUSTMENT'];
    const validStatuses = ['DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELLED'];

    // Check product ID
    if (!data.productId) {
      errors.push('Product ID is required');
    }

    // Check quantity
    if (data.quantity === undefined || data.quantity === null) {
      errors.push('Quantity is required');
    } else if (typeof data.quantity !== 'number' || isNaN(data.quantity)) {
      errors.push('Quantity must be a valid number');
    } else if (data.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    // Check operation type
    if (!data.type || !validTypes.includes(data.type)) {
      errors.push(`Operation type must be one of: ${validTypes.join(', ')}`);
    }

    // Scheduled Date validation
    if (!data.scheduledDate) {
      errors.push('Scheduled date is required');
    } else {
      const date = new Date(data.scheduledDate);
      if (isNaN(date.getTime())) {
        errors.push('Scheduled date must be a valid date');
      } else if (date < new Date()) {
        errors.push('Scheduled date cannot be in the past');
      }
    }

    // Type-specific validations
    if (data.type === 'RECEIPT') {
      if (!data.contactId) {
        errors.push('Contact (Vendor/Supplier) is required for receipts');
      }
      if (!data.sourceLocationId) {
        errors.push('Source location is required for receipts');
      }
    }

    if (data.type === 'DELIVERY') {
      if (!data.contactId) {
        errors.push('Contact (Customer) is required for deliveries');
      }
      if (!data.destinationLocationId) {
        errors.push('Destination location is required for deliveries');
      }
    }

    if (data.type === 'INTERNAL') {
      if (!data.sourceLocationId) {
        errors.push('Source location is required for internal transfers');
      }
      if (!data.destinationLocationId) {
        errors.push('Destination location is required for internal transfers');
      }
      if (data.sourceLocationId === data.destinationLocationId) {
        errors.push('Source and destination locations must be different');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate operation line items
   * Used for multi-line operations
   */
  validateOperationLines(lines) {
    const errors = [];

    if (!Array.isArray(lines) || lines.length === 0) {
      errors.push('At least one product line is required');
      return { isValid: false, errors };
    }

    lines.forEach((line, index) => {
      if (!line.productId) {
        errors.push(`Line ${index + 1}: Product ID is required`);
      }

      if (!line.demandQty || typeof line.demandQty !== 'number' || line.demandQty <= 0) {
        errors.push(`Line ${index + 1}: Demand quantity must be a positive number`);
      }

      if (line.doneQty !== undefined && line.doneQty !== null) {
        if (typeof line.doneQty !== 'number' || line.doneQty < 0) {
          errors.push(`Line ${index + 1}: Done quantity must be a non-negative number`);
        }
        if (line.doneQty > line.demandQty) {
          errors.push(`Line ${index + 1}: Done quantity cannot exceed demand quantity`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate operation status update
   */
  validateStatusUpdate(currentStatus, newStatus) {
    const errors = [];
    const validStatuses = ['DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELLED'];
    const validTransitions = {
      DRAFT: ['WAITING', 'CANCELLED'],
      WAITING: ['READY', 'CANCELLED'],
      READY: ['DONE', 'CANCELLED'],
      DONE: [],
      CANCELLED: [],
    };

    if (!validStatuses.includes(newStatus)) {
      errors.push(`Invalid status: ${newStatus}`);
    }

    if (validTransitions[currentStatus] && !validTransitions[currentStatus].includes(newStatus)) {
      errors.push(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate operation update
   * Allows partial updates with validation
   */
  validateUpdate(data) {
    const errors = [];
    const validTypes = ['RECEIPT', 'DELIVERY', 'INTERNAL', 'ADJUSTMENT'];

    // Check quantity if provided
    if (data.quantity !== undefined && data.quantity !== null) {
      if (typeof data.quantity !== 'number' || isNaN(data.quantity)) {
        errors.push('Quantity must be a valid number');
      } else if (data.quantity <= 0) {
        errors.push('Quantity must be a positive number');
      }
    }

    // Check operation type if provided
    if (data.type !== undefined && data.type !== null) {
      if (!validTypes.includes(data.type)) {
        errors.push(`Operation type must be one of: ${validTypes.join(', ')}`);
      }
    }

    // Scheduled Date validation if provided
    if (data.scheduledDate !== undefined && data.scheduledDate !== null) {
      const date = new Date(data.scheduledDate);
      if (isNaN(date.getTime())) {
        errors.push('Scheduled date must be a valid date');
      } else if (date < new Date()) {
        errors.push('Scheduled date cannot be in the past');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate operation completion
   * Ensures all lines are completed before marking as DONE
   */
  validateCompletion(lines) {
    const errors = [];

    lines.forEach((line, index) => {
      if (line.doneQty < line.demandQty) {
        errors.push(
          `Line ${index + 1}: Incomplete - Only ${line.doneQty}/${line.demandQty} units completed`
        );
      }
    });

    return {
      isComplete: errors.length === 0,
      incompletions: errors,
    };
  },
};

module.exports = operationValidator;