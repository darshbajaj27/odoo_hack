// ============================================
// backend/tests/integration/products.integration.test.js
// ============================================
const request = require('supertest');
const app = require('../../server');
const dbHelper = require('../helpers/dbHelper');
const requestHelper = require('../helpers/requestHelper');

describe('Products Integration Tests', () => {
  let adminToken;
  let userToken;
  let testAdmin;
  let testUser;

  beforeAll(async () => {
    await dbHelper.cleanupAll();
    testAdmin = await dbHelper.createTestAdmin();
    testUser = await dbHelper.createTestUser();
    adminToken = requestHelper.generateToken(testAdmin.id, testAdmin.email, 'ADMIN');
    userToken = requestHelper.generateToken(testUser.id, testUser.email, 'USER');
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('GET /api/products', () => {
    test('should list all products for authenticated user', async () => {
      await dbHelper.createTestProducts(3);

      const response = await requestHelper.authGet(app, '/api/products', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThan(0);
    });

    test('should filter products by category', async () => {
      await dbHelper.createTestProduct({ category: 'Electronics' });
      await dbHelper.createTestProduct({ category: 'Tools' });

      const response = await requestHelper.authGet(
        app,
        '/api/products?category=Electronics',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.products.every(p => p.category === 'Electronics')).toBe(true);
    });

    test('should search products by name or SKU', async () => {
      await dbHelper.createTestProduct({ name: 'Laptop Pro', sku: 'LAP-001' });
      await dbHelper.createTestProduct({ name: 'Mouse', sku: 'MSE-001' });

      const response = await requestHelper.authGet(
        app,
        '/api/products?search=Laptop',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.products.some(p => p.name.includes('Laptop'))).toBe(true);
    });

    test('should paginate products correctly', async () => {
      await dbHelper.createTestProducts(15);

      const response = await requestHelper.authGet(
        app,
        '/api/products?page=1&limit=10',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeLessThanOrEqual(10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    test('should reject unauthenticated requests', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return product details', async () => {
      const product = await dbHelper.createTestProduct();

      const response = await requestHelper.authGet(
        app,
        `/api/products/${product.id}`,
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(product.name);
      expect(response.body).toHaveProperty('sku');
      expect(response.body).toHaveProperty('price');
    });

    test('should return 404 for non-existent product', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/products/non-existent-id',
        userToken
      );

      expect(response.status).toBe(404);
    });

    test('should include locations in product details', async () => {
      const warehouse = await dbHelper.createTestWarehouse();
      const location = await dbHelper.createTestLocation(warehouse.id);
      const product = await dbHelper.createTestProduct();

      const response = await requestHelper.authGet(
        app,
        `/api/products/${product.id}`,
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('locations');
    });
  });

  describe('POST /api/products', () => {
    test('should create a new product as admin', async () => {
      const productData = {
        name: 'New Product',
        sku: `TEST-${Date.now()}`,
        category: 'Electronics',
        price: 199.99,
        quantity: 50,
        reorderLevel: 10,
        description: 'Test product description',
      };

      const response = await requestHelper.authPost(
        app,
        '/api/products',
        adminToken,
        productData
      );

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(productData.name);
      expect(response.body.sku).toBe(productData.sku);
      expect(response.body.price).toBe(productData.price);
    });

    test('should reject duplicate SKU', async () => {
      const existingProduct = await dbHelper.createTestProduct({ sku: 'DUP-SKU' });

      const productData = {
        name: 'Another Product',
        sku: 'DUP-SKU',
        category: 'Electronics',
        price: 99.99,
        quantity: 10,
        reorderLevel: 5,
      };

      const response = await requestHelper.authPost(
        app,
        '/api/products',
        adminToken,
        productData
      );

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('SKU');
    });

    test('should reject creation by regular user', async () => {
      const productData = {
        name: 'New Product',
        sku: `TEST-${Date.now()}`,
        category: 'Electronics',
        price: 199.99,
        quantity: 50,
        reorderLevel: 10,
      };

      const response = await requestHelper.authPost(
        app,
        '/api/products',
        userToken,
        productData
      );

      expect(response.status).toBe(403);
    });

    test('should reject invalid price', async () => {
      const productData = {
        name: 'Invalid Product',
        sku: `TEST-${Date.now()}`,
        category: 'Electronics',
        price: -50,
        quantity: 10,
        reorderLevel: 5,
      };

      const response = await requestHelper.authPost(
        app,
        '/api/products',
        adminToken,
        productData
      );

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update a product as admin', async () => {
      const product = await dbHelper.createTestProduct();

      const updateData = {
        name: 'Updated Product Name',
        price: 299.99,
      };

      const response = await requestHelper.authPut(
        app,
        `/api/products/${product.id}`,
        adminToken,
        updateData
      );

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
    });

    test('should reject update by regular user', async () => {
      const product = await dbHelper.createTestProduct();

      const response = await requestHelper.authPut(
        app,
        `/api/products/${product.id}`,
        userToken,
        { name: 'Updated Name' }
      );

      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent product', async () => {
      const response = await requestHelper.authPut(
        app,
        '/api/products/non-existent-id',
        adminToken,
        { name: 'Updated Name' }
      );

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should delete a product as admin', async () => {
      const product = await dbHelper.createTestProduct();

      const response = await requestHelper.authDelete(
        app,
        `/api/products/${product.id}`,
        adminToken
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
    });

    test('should reject deletion by non-admin', async () => {
      const product = await dbHelper.createTestProduct();

      const response = await requestHelper.authDelete(
        app,
        `/api/products/${product.id}`,
        userToken
      );

      expect(response.status).toBe(403);
    });
  });
});