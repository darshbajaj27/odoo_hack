// ============================================
// backend/tests/integration/dashboard.integration.test.js
// ============================================
const dbHelper = require('../helpers/dbHelper');
const requestHelper = require('../helpers/requestHelper');

describe('Dashboard Integration Tests', () => {
  let userToken;

  beforeAll(async () => {
    await dbHelper.cleanupAll();
    const user = await dbHelper.createTestUser();
    userToken = requestHelper.generateToken(user.id, user.email, 'USER');

    // Create test data
    await dbHelper.createTestProducts(5);
    await dbHelper.createTestWarehouse();
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('GET /api/dashboard/stats', () => {
    test('should return statistics', async () => {
      const response = await requestHelper.authGet(app, '/api/dashboard/stats', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('totalOperations');
      expect(response.body).toHaveProperty('activeWarehouses');
      expect(response.body).toHaveProperty('totalLocations');
      expect(typeof response.body.totalProducts).toBe('number');
    });

    test('should require authentication', async () => {
      const response = await request(app).get('/api/dashboard/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/dashboard/charts', () => {
    test('should return chart data', async () => {
      const response = await requestHelper.authGet(app, '/api/dashboard/charts', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('productsByCategory');
      expect(response.body).toHaveProperty('operationsByType');
      expect(response.body).toHaveProperty('stockTrends');
    });
  });

  describe('GET /api/dashboard/recent-activity', () => {
    test('should return recent operations', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/dashboard/recent-activity',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('recentOperations');
      expect(response.body).toHaveProperty('timestamp');
      expect(Array.isArray(response.body.recentOperations)).toBe(true);
    });
  });
});