// ============================================
// backend/tests/unit/operation.test.js
// ============================================
const operationValidator = require('../../validators/operationValidator');

describe('Operation Controller', () => {
  describe('Operation Validation', () => {
    test('should validate required operation fields', () => {
      const validOperation = {
        productId: 'prod-123',
        quantity: 10,
        type: 'INBOUND',
      };

      const result = operationValidator.validateCreate(validOperation);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid operation type', () => {
      const invalidOperation = {
        productId: 'prod-123',
        quantity: 10,
        type: 'INVALID_TYPE',
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Operation type must be one of'))).toBe(true);
    });

    test('should reject negative quantity', () => {
      const invalidOperation = {
        productId: 'prod-123',
        quantity: -5,
        type: 'INBOUND',
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be a positive number');
    });

    test('should reject zero quantity', () => {
      const invalidOperation = {
        productId: 'prod-123',
        quantity: 0,
        type: 'INBOUND',
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be a positive number');
    });

    test('should validate transfer operation locations', () => {
      const invalidTransfer = {
        productId: 'prod-123',
        quantity: 10,
        type: 'TRANSFER',
        // Missing fromLocationId and toLocationId
      };

      const result = operationValidator.validateCreate(invalidTransfer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('From location is required for transfer operations');
      expect(result.errors).toContain('To location is required for transfer operations');
    });

    test('should accept valid transfer operation', () => {
      const validTransfer = {
        productId: 'prod-123',
        quantity: 10,
        type: 'TRANSFER',
        fromLocationId: 'loc-123',
        toLocationId: 'loc-456',
      };

      const result = operationValidator.validateCreate(validTransfer);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject missing product ID', () => {
      const invalidOperation = {
        quantity: 10,
        type: 'INBOUND',
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product ID is required');
    });

    test('should reject empty product ID', () => {
      const invalidOperation = {
        productId: '',
        quantity: 10,
        type: 'INBOUND',
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product ID is required');
    });
  });

  describe('Operation Update Validation', () => {
    test('should allow partial updates', () => {
      const partialUpdate = {
        quantity: 20,
      };

      const result = operationValidator.validateUpdate(partialUpdate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid type in update', () => {
      const invalidUpdate = {
        type: 'INVALID_TYPE',
      };

      const result = operationValidator.validateUpdate(invalidUpdate);
      expect(result.isValid).toBe(false);
    });

    test('should reject invalid quantity in update', () => {
      const invalidUpdate = {
        quantity: -10,
      };

      const result = operationValidator.validateUpdate(invalidUpdate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be a positive number');
    });
  });

  describe('Operation Types', () => {
    test('should accept INBOUND operation', () => {
      const operation = {
        productId: 'prod-123',
        quantity: 50,
        type: 'INBOUND',
      };

      const result = operationValidator.validateCreate(operation);
      expect(result.isValid).toBe(true);
    });

    test('should accept OUTBOUND operation', () => {
      const operation = {
        productId: 'prod-123',
        quantity: 30,
        type: 'OUTBOUND',
      };

      const result = operationValidator.validateCreate(operation);
      expect(result.isValid).toBe(true);
    });

    test('should accept ADJUSTMENT operation', () => {
      const operation = {
        productId: 'prod-123',
        quantity: 5,
        type: 'ADJUSTMENT',
      };

      const result = operationValidator.validateCreate(operation);
      expect(result.isValid).toBe(true);
    });
  });
});