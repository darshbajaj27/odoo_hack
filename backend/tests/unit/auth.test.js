// ============================================
// backend/tests/unit/auth.test.js
// ============================================
const { PrismaClient } = require('@prisma/client');

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

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn(),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload) => `mock_token_${payload.userId}`),
  verify: jest.fn(),
}));

const AuthController = require('../../controllers/authController');
const bcrypt = require('bcrypt');
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
        name: 'Test User',
        role: 'STAFF',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STAFF',
        status: 'ACTIVE',
        avatar: 'TU',
        password: 'hashed_Test@1234',
      });

      await AuthController.signup(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should reject signup with existing email', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'Test@1234',
        name: 'Test User',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
      });

      await AuthController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already registered',
      });
    });

    test('should reject signup with missing fields', async () => {
      req.body = {
        email: 'test@example.com',
      };

      await AuthController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email, password, and name are required',
      });
    });
  });

  describe('login', () => {
    test('should login with valid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      bcrypt.compare.mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed_Test@123',
        name: 'Test User',
        role: 'STAFF',
        status: 'ACTIVE',
      });

      await AuthController.login(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.any(Object),
        })
      );
    });

    test('should reject login with invalid email', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'Test@123',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });

    test('should reject login with invalid password', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      bcrypt.compare.mockResolvedValue(false);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed_CorrectPassword',
        name: 'Test User',
        status: 'ACTIVE',
      });

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });

    test('should reject login with missing fields', async () => {
      req.body = {
        email: 'test@example.com',
      };

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
    });

    test('should reject login with inactive account', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      bcrypt.compare.mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed_Test@123',
        name: 'Test User',
        status: 'INACTIVE',
      });

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account is inactive',
      });
    });
  });

  describe('forgotPassword', () => {
    test('should accept valid email for password reset', async () => {
      req.body = {
        email: 'test@example.com',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });
      prisma.user.update.mockResolvedValue({});

      await AuthController.forgotPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'If the email exists, an OTP has been sent',
      });
    });

    test('should not reveal if email does not exist', async () => {
      req.body = {
        email: 'nonexistent@example.com',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      await AuthController.forgotPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'If the email exists, an OTP has been sent',
      });
    });

    test('should reject missing email', async () => {
      req.body = {};

      await AuthController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email is required',
      });
    });
  });

  describe('verifyOtp', () => {

    test('should reject invalid OTP', async () => {
      const now = Date.now();
      const futureDate = new Date(now + 5 * 60 * 1000);

      req.body = {
        email: 'test@example.com',
        otp: 'wrong-otp',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        otpSecret: '123456',
        otpExpires: futureDate,
      });

      await AuthController.verifyOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid OTP',
      });
    });

    test('should reject expired OTP', async () => {
      const pastDate = new Date(Date.now() - 1000);

      req.body = {
        email: 'test@example.com',
        otp: '123456',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        otpSecret: '123456',
        otpExpires: pastDate,
      });

      await AuthController.verifyOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'OTP has expired',
      });
    });
  });

  describe('resetPassword', () => {
    test('should reject missing token or password', async () => {
      req.body = {
        resetToken: 'valid-token',
      };

      await AuthController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Reset token and new password are required',
      });
    });
  });
});
