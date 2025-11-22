const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class AuthController {
  /**
   * User signup
   * POST /api/auth/signup
   */
  static async signup(req, res) {
    const { email, password, firstName, lastName, phone } = req.body;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role: 'USER',
        },
      });

      logger.info(`New user registered: ${user.id}`);

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '7d' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error('Signup error:', error);
      res.status(500).json({ error: 'Signup failed' });
    }
  }

  /**
   * User login
   * POST /api/auth/login
   */
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      logger.info(`User logged in: ${user.id}`);

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '7d' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * Refresh JWT token
   * POST /api/auth/refresh
   */
  static async refresh(req, res) {
    const { refreshToken } = req.body;

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '7d' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  /**
   * Forgot password
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // TODO: Implement email sending logic
      logger.info(`Password reset requested for user: ${user.id}`);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  }

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      // TODO: Verify reset token from email
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      logger.info(`Password reset for user: ${decoded.userId}`);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  }
}

module.exports = AuthController;
