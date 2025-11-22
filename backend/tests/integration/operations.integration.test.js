// ============================================
// backend/tests/integration/operations.integration.test.js
// ============================================
const dbHelper = require('../helpers/dbHelper');
const requestHelper = require('../helpers/requestHelper');

describe('Operations Integration Tests', () => {
  let adminToken;
  let userToken;
  let testUser;
  let testProduct;

  beforeAll(async () => {
    await dbHelper.cleanupAll();
    const admin = await dbHelper.createTestAdmin();
    testUser = await dbHelper.createTestUser();
    testProduct = await dbHelper.createTestProduct();
    adminToken = requestHelper.generateToken(admin.id, admin.email, 'ADMIN');
    userToken = requestHelper.generateToken(testUser.id, testUser.email, 'USER');
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('GET /api/operations', () => {
    test('should list all operations', async () => {
      await dbHelper.createTestOperation(testProduct.id, testUser.id);

      const response = await requestHelper.authGet(app, '/api/operations', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('operations');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.operations)).toBe(true);
    });

    test('should filter operations by status', async () => {
      await dbHelper.createTestOperation(testProduct.id, testUser.id, {
        status: 'COMPLETED',
      });

      const response = await requestHelper.authGet(
        app,
        '/api/operations?status=COMPLETED',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.operations.every(op => op.status === 'COMPLETED')).toBe(true);
    });

    test('should filter operations by type', async () => {
      await dbHelper.createTestOperation(testProduct.id, testUser.id, {
        type: 'INBOUND',
      });

      const response = await requestHelper.authGet(
        app,
        '/api/operations?type=INBOUND',
        userToken
      );

      expect(response.status).toBe(200);
      expect(response.body.operations.every(op => op.type === 'INBOUND')).toBe(true);
    });
  });

  describe('POST /api/operations', () => {
    test('should create a new operation', async () => {
      const operationData = {
        productId: testProduct.id,
        quantity: 50,
        type: 'INBOUND',
        notes: 'New stock arrival',
      };

      const response = await requestHelper.authPost(
        app,
        '/api/operations',
        userToken,
        operationData
      );

      expect(response.status).toBe(201);
      expect(response.body.productId).toBe(testProduct.id);
      expect(response.body.quantity).toBe(50);
      expect(response.body.type).toBe('INBOUND');
      expect(response.body.status).toBe('PENDING');
    });

    test('should reject operation with invalid product ID', async () => {
      const operationData = {
        productId: 'invalid-product-id',
        quantity: 50,
        type: 'INBOUND',
      };

      const response = await requestHelper.authPost(
        app,
        '/api/operations',
        userToken,
        operationData
      );

      expect(response.status).toBe(404);
    });

    test('should validate transfer operations', async () => {
      const warehouse = await dbHelper.createTestWarehouse();
      const fromLocation = await dbHelper.createTestLocation(warehouse.id, {
        code: 'FROM-LOC',
      });
      const toLocation = await dbHelper.createTestLocation(warehouse.id, {
        code: 'TO-LOC',
      });

      const operationData = {
        productId: testProduct.id,
        quantity: 10,
        type: 'TRANSFER',
        fromLocationId: fromLocation.id,
        toLocationId: toLocation.id,
      };

      const response = await requestHelper.authPost(
        app,
        '/api/operations',
        userToken,
        operationData
      );

      expect(response.status).toBe(201);
      expect(response.body.fromLocationId).toBe(fromLocation.id);
      expect(response.body.toLocationId).toBe(toLocation.id);
    });
  });

  describe('PATCH /api/operations/:id/status', () => {
    test('should update operation status', async () => {
      const operation = await dbHelper.createTestOperation(testProduct.id, testUser.id);

      const response = await requestHelper.authPatch(
        app,
        `/api/operations/${operation.id}/status`,
        userToken,
        { status: 'COMPLETED' }
      );

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('COMPLETED');
    });

    test('should reject invalid status', async () => {
      const operation = await dbHelper.createTestOperation(testProduct.id, testUser.id);

      const response = await requestHelper.authPatch(
        app,
        `/api/operations/${operation.id}/status`,
        userToken,
        { status: 'INVALID_STATUS' }
      );

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/operations/:id', () => {
    test('should delete pending operation as admin', async () => {
      const operation = await dbHelper.createTestOperation(testProduct.id, testUser.id, {
        status: 'PENDING',
      });

      const response = await requestHelper.authDelete(
        app,
        `/api/operations/${operation.id}`,
        adminToken
      );

      expect(response.status).toBe(200);
    });

    test('should reject deletion of completed operation', async () => {
      const operation = await dbHelper.createTestOperation(testProduct.id, testUser.id, {
        status: 'COMPLETED',
      });

      const response = await requestHelper.authDelete(
        app,
        `/api/operations/${operation.id}`,
        adminToken
      );

      expect(response.status).toBe(400);
    });

    test('should reject deletion by non-admin', async () => {
      const operation = await dbHelper.createTestOperation(testProduct.id, testUser.id);

      const response = await requestHelper.authDelete(
        app,
        `/api/operations/${operation.id}`,
        userToken
      );

      expect(response.status).toBe(403);
    });
  });
});