const request = require('supertest');
const app = require('../../server'); // Adjust path as needed
const dbHelper = require('../helpers/dbHelper');
const requestHelper = require('../helpers/requestHelper');

describe('Authentication Integration Tests', () => {
  beforeEach(async () => {
    await dbHelper.cleanupUsers();
  });

  afterAll(async () => {
    await dbHelper.cleanupAll();
    await dbHelper.disconnect();
  });

  describe('POST /api/auth/signup', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'Test@1234',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should reject signup with existing email', async () => {
      await dbHelper.createTestUser({ email: 'existing@test.com' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'existing@test.com',
          password: 'Test@1234',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    test('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'Test@1234',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should reject signup with short password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'short',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const user = await dbHelper.createTestUser({
        email: 'login@test.com',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'Test@123', // Default password from dbHelper
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.id).toBe(user.id);
    });

    test('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Test@123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });

    test('should reject login with invalid password', async () => {
      await dbHelper.createTestUser({ email: 'test@test.com' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });

    test('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should return new access token with valid refresh token', async () => {
      const user = await dbHelper.createTestUser();
      const refreshToken = requestHelper.generateToken(user.id, user.email);

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    test('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    test('should accept valid email for password reset', async () => {
      await dbHelper.createTestUser({ email: 'forgot@test.com' });

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'forgot@test.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('reset');
    });

    test('should return 404 for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@test.com' });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('should reset password with valid token', async () => {
      const user = await dbHelper.createTestUser();
      const resetToken = requestHelper.generateToken(user.id, user.email);

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword@123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('success');
    });

    test('should reject invalid reset token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'NewPassword@123',
        });

      expect(response.status).toBe(400);
    });
  });
});