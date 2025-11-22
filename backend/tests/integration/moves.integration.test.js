// ============================================
// backend/tests/integration/moves.integration.test.js
// ============================================
const request = require('supertest');
const app = require('../../server');
const dbHelper = require('../helpers/dbHelper'); // <--- ADD THIS LINE
const requestHelper = require('../helpers/requestHelper'); // (Likely needed too)


describe('Moves Integration Tests', () => {
  let userToken;
  let testUser;
  let testProduct;

  beforeAll(async () => {
    await dbHelper.cleanupAll();
    testUser = await dbHelper.createTestUser();
    testProduct = await dbHelper.createTestProduct();
    userToken = requestHelper.generateToken(testUser.id, testUser.email, 'USER');

    // Create some test operations
    await dbHelper.createTestOperation(testProduct.id, testUser.id, {
      type: 'INBOUND',
    });
    await dbHelper.createTestOperation(testProduct.id, testUser.id, {
      type: 'OUTBOUND',
    });
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('GET /api/moves', () => {
    test('should return move history', async () => {
      const response = await requestHelper.authGet(app, '/api/moves', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('moves');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.moves)).toBe(true);
    });

    test('should filter by product', async () => {
      const response = await requestHelper.authGet(
        app,
        `/api/moves?productId=${testProduct.id}`,
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.moves.every(m => m.productId === testProduct.id)).toBe(true);
    });

    test('should filter by type', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/moves?type=INBOUND',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.moves.every(m => m.type === 'INBOUND')).toBe(true);
    });

    test('should filter by date range', async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await requestHelper.authGet(
        app,
        `/api/moves?startDate=${today}`,
        userToken
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.moves)).toBe(true);
    });
  });

  describe('GET /api/moves/stats', () => {
    test('should return move statistics', async () => {
      const response = await requestHelper.authGet(app, '/api/moves/stats', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalMoves');
      expect(response.body).toHaveProperty('movesByType');
      expect(Array.isArray(response.body.movesByType)).toBe(true);
    });
  });
});