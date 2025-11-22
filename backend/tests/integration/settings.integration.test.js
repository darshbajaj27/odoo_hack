// ============================================
// backend/tests/integration/settings.integration.test.js
// ============================================
const dbHelper = require('../helpers/dbHelper');
const requestHelper = require('../helpers/requestHelper');

describe('Settings Integration Tests', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await dbHelper.cleanupAll();
    const admin = await dbHelper.createTestAdmin();
    const user = await dbHelper.createTestUser();
    adminToken = requestHelper.generateToken(admin.id, admin.email, 'ADMIN');
    userToken = requestHelper.generateToken(user.id, user.email, 'USER');
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('GET /api/settings/warehouses', () => {
    test('should list all warehouses', async () => {
      await dbHelper.createTestWarehouse();

      const response = await requestHelper.authGet(
        app,
        '/api/settings/warehouses',
        userToken
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/settings/warehouses', () => {
    test('should create a warehouse as admin', async () => {
      const warehouseData = {
        name: 'New Warehouse',
        code: `WH-${Date.now()}`,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      };

      const response = await requestHelper.authPost(
        app,
        '/api/settings/warehouses',
        adminToken,
        warehouseData
      );

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(warehouseData.name);
      expect(response.body.code).toBe(warehouseData.code);
    });

    test('should reject creation by regular user', async () => {
      const warehouseData = {
        name: 'New Warehouse',
        code: `WH-${Date.now()}`,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      };

      const response = await requestHelper.authPost(
        app,
        '/api/settings/warehouses',
        userToken,
        warehouseData
      );

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/settings/users', () => {
    test('should list all users (admin only)', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/settings/users',
        adminToken
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should reject access by regular user', async () => {
      const response = await requestHelper.authGet(
        app,
        '/api/settings/users',
        userToken
      );

      expect(response.status).toBe(403);
    });
  });
});