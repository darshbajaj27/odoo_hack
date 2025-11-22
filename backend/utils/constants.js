/**
 * Application-wide constants
 */

module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER',
  },

  // Operation types
  OPERATION_TYPES: {
    INBOUND: 'INBOUND',
    OUTBOUND: 'OUTBOUND',
    TRANSFER: 'TRANSFER',
    ADJUSTMENT: 'ADJUSTMENT',
  },

  // Operation statuses
  OPERATION_STATUS: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  },

  // Contact types
  CONTACT_TYPES: {
    SUPPLIER: 'SUPPLIER',
    CUSTOMER: 'CUSTOMER',
    LOGISTICS: 'LOGISTICS',
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // JWT configuration
  JWT: {
    EXPIRATION: process.env.JWT_EXPIRATION || '7d',
    REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },

  // Error messages
  ERRORS: {
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not found',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
  },

  // Success messages
  SUCCESS: {
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
  },
};
