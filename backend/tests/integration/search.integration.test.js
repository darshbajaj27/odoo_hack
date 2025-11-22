// ============================================
// backend/tests/integration/search.integration.test.js
// ============================================
describe('Search Integration Tests', () => {
  let userToken;

  beforeAll(async () => {
    await dbHelper.cleanupAll();
    const user = await dbHelper.createTestUser();
    userToken = requestHelper.generateToken(user.id, user.email, 'USER');

    // Create searchable data
    await dbHelper.createTestProduct({
      name: 'Laptop Pro 15',
      sku: 'LAP-PRO-15',
      description: 'High performance laptop',
    });
    await dbHelper.createTestProduct({
      name: 'Wireless Mouse',
      sku: 'MSE-WRL-01',
      description: 'Ergonomic wireless mouse',
    });
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('GET /api/search', () => {
    test('should search products and operations', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/search?q=Laptop',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('query', 'Laptop');
      expect(response.body).toHaveProperty('results');
      expect(response.body.results).toHaveProperty('products');
      expect(response.body.results.products.some(p => p.name.includes('Laptop'))).toBe(true);
    });

    test('should reject short query', async () => {
      const response = await requestHelper.authGet(app, '/api/search?q=a', userToken);

      expect(response.status).toBe(400);
    });

    test('should search by SKU', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/search?q=LAP-PRO',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.results.products.some(p => p.sku.includes('LAP-PRO'))).toBe(
        true
      );
    });
  });

  describe('GET /api/search/products', () => {
    test('should search only products', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/search/products?q=Mouse',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.some(p => p.name.includes('Mouse'))).toBe(true);
    });
  });
});