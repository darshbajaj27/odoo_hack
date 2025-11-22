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
        price: 99.99,
        quantity: 100,
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
        price: -10, // Invalid negative price
        quantity: 100,
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be a positive number');
    });

    test('should reject invalid quantity', () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Electronics',
        price: 99.99,
        quantity: -5, // Invalid negative quantity
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be a non-negative number');
    });

    test('should reject empty name', () => {
      const invalidProduct = {
        name: '',
        sku: 'TEST-001',
        category: 'Electronics',
        price: 99.99,
        quantity: 100,
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
        price: 99.99,
        quantity: 100,
      };

      const result = productValidator.validateCreate(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('SKU is required');
    });
  });

  describe('Product Update Validation', () => {
    test('should allow partial updates', () => {
      const partialUpdate = {
        price: 149.99,
      };

      const result = productValidator.validateUpdate(partialUpdate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid price in update', () => {
      const invalidUpdate = {
        price: -50,
      };

      const result = productValidator.validateUpdate(invalidUpdate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be a positive number');
    });

    test('should reject empty name in update', () => {
      const invalidUpdate = {
        name: '',
      };

      const result = productValidator.validateUpdate(invalidUpdate);
      expect(result.isValid).toBe(false);
    });
  });
});