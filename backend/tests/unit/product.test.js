// ============================================
// backend/tests/unit/product.test.js
// ============================================
const productValidator = require('../../validators/productValidator');

describe('Product Controller', () => {
  describe('Product Validation', () => {
    test('should validate required product fields', () => {
      const validProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Electronics',
        sellingPrice: 99.99,
        onHand: 100,
      };

      const result = productValidator.validateCreate(validProduct);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject missing required fields', () => {
      const invalidProduct = {
        name: 'Test Product',
        // Missing sku, category, price, quantity
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should reject invalid price', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Electronics',
        sellingPrice: -10, // Invalid negative price
        onHand: 100,
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Selling price cannot be negative');
    });

    test('should reject invalid quantity', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Electronics',
        sellingPrice: 99.99,
        onHand: -5, // Invalid negative quantity
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('On hand quantity cannot be negative');
    });

    test('should reject empty name', () => {
      const invalidProduct = {
        name: '',
        sku: 'TEST-001',
        category: 'Electronics',
        sellingPrice: 99.99,
        onHand: 100,
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product name is required');
    });

    test('should reject empty SKU', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: '',
        category: 'Electronics',
        sellingPrice: 99.99,
        onHand: 100,
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('SKU is required and must be a non-empty string');
    });
  });

  describe('Product Update Validation', () => {
    test('should allow partial updates', () => {
      const partialUpdate = {
        sellingPrice: 149.99,
      };

      const result = productValidator.validateUpdate(partialUpdate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid price in update', () => {
      const invalidUpdate = {
        sellingPrice: -50,
      };

      const result = productValidator.validateUpdate(invalidUpdate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Selling price cannot be negative');
    });

    test('should reject empty name in update', () => {
      const invalidUpdate = {
        name: '',
      };

      const result = productValidator.validateUpdate(invalidUpdate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product name cannot be empty');
    });
  });
});