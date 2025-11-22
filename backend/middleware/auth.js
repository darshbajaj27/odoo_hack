const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication middleware - Verifies JWT token
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Authorization middleware - Checks user role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.userId}`);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
