// ============================================
// backend/tests/unit/auth.test.js
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const AuthController = require('../../controllers/authController');

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('Authentication Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('signup', () => {
    test('should signup a new user with valid data', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      });

      await AuthController.signup(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
          user: expect.any(Object),
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        })
      );
    });

    test('should reject signup with existing email', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
      });

      await AuthController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User already exists',
      });
    });
  });

  describe('login', () => {
    test('should login with valid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      const hashedPassword = await bcrypt.hash('Test@123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      });

      await AuthController.login(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          user: expect.any(Object),
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        })
      );
    });

    test('should reject login with invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid email or password',
      });
    });

    test('should reject login with incorrect password', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: hashedPassword,
      });

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid email or password',
      });
    });
  });

  describe('refresh token', () => {
    test('should refresh JWT token with valid refresh token', async () => {
      const userId = 'user-123';
      const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '30d' }
      );

      req.body = { refreshToken };

      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        role: 'USER',
      });

      await AuthController.refresh(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: expect.any(String),
        })
      );
    });

    test('should reject invalid refresh token', async () => {
      req.body = { refreshToken: 'invalid-token' };

      await AuthController.refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid refresh token',
      });
    });
  });
});