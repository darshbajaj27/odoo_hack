const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma validation error
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(400).json({
      error: `${field} already exists`,
      code: 'UNIQUE_CONSTRAINT_VIOLATION',
    });
  }

  // Prisma not found error
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found',
      code: 'NOT_FOUND',
    });
  }

  // Prisma validation error
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Invalid reference',
      code: 'INVALID_REFERENCE',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED',
    });
  }

  // Validation errors
  if (err.isJoi || err.details) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details || err.message,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
