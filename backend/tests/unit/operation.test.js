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
        type: 'RECEIPT',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        contactId: 'contact-123',
        sourceLocationId: 'loc-123',
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
        type: 'RECEIPT',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be greater than 0');
    });

    test('should reject zero quantity', () => {
      const invalidOperation = {
        productId: 'prod-123',
        quantity: 0,
        type: 'RECEIPT',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be greater than 0');
    });

    test('should validate transfer operation locations', () => {
      const invalidTransfer = {
        productId: 'prod-123',
        quantity: 10,
        type: 'INTERNAL',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        // Missing sourceLocationId and destinationLocationId
      };

      const result = operationValidator.validateCreate(invalidTransfer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Source location is required for internal transfers');
      expect(result.errors).toContain('Destination location is required for internal transfers');
    });

    test('should accept valid transfer operation', () => {
      const validTransfer = {
        productId: 'prod-123',
        quantity: 10,
        type: 'INTERNAL',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        sourceLocationId: 'loc-123',
        destinationLocationId: 'loc-456',
      };

      const result = operationValidator.validateCreate(validTransfer);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject missing product ID', () => {
      const invalidOperation = {
        quantity: 10,
        type: 'RECEIPT',
      };

      const result = operationValidator.validateCreate(invalidOperation);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product ID is required');
    });

    test('should reject empty product ID', () => {
      const invalidOperation = {
        productId: '',
        quantity: 10,
        type: 'RECEIPT',
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
        type: 'RECEIPT',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        contactId: 'contact-123',
        sourceLocationId: 'loc-123',
      };

      const result = operationValidator.validateCreate(operation);
      expect(result.isValid).toBe(true);
    });

    test('should accept OUTBOUND operation', () => {
      const operation = {
        productId: 'prod-123',
        quantity: 30,
        type: 'DELIVERY',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        contactId: 'contact-123',
        destinationLocationId: 'loc-456',
      };

      const result = operationValidator.validateCreate(operation);
      expect(result.isValid).toBe(true);
    });

    test('should accept ADJUSTMENT operation', () => {
      const operation = {
        productId: 'prod-123',
        quantity: 5,
        type: 'ADJUSTMENT',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const result = operationValidator.validateCreate(operation);
      expect(result.isValid).toBe(true);
    });
  });
});