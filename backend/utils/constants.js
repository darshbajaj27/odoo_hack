/**
 * Application-wide constants
 * Updated to match Prisma Schema Enums
 */

module.exports = {
  // User roles
  ROLES: {
    MANAGER: 'MANAGER',
    STAFF: 'STAFF',
  },

  // Operation types (Matches Prisma Enum OperationType)
  OPERATION_TYPES: {
    RECEIPT: 'RECEIPT',      // Vendor -> Warehouse
    DELIVERY: 'DELIVERY',    // Warehouse -> Customer
    INTERNAL: 'INTERNAL',    // Warehouse -> Warehouse
    ADJUSTMENT: 'ADJUSTMENT' // Inventory Check
  },

  // Operation statuses (Matches Prisma Enum OperationStatus)
  OPERATION_STATUS: {
    DRAFT: 'DRAFT',
    WAITING: 'WAITING',
    READY: 'READY',
    DONE: 'DONE',
    CANCELLED: 'CANCELLED',
  },

  // Contact types (Matches Prisma Enum ContactType)
  CONTACT_TYPES: {
    VENDOR: 'VENDOR',
    CUSTOMER: 'CUSTOMER',
  },
  
  // Location types (Matches Prisma Enum LocationType)
  LOCATION_TYPES: {
    INTERNAL: 'INTERNAL',
    VENDOR: 'VENDOR',
    CUSTOMER: 'CUSTOMER',
    INVENTORY_LOSS: 'INVENTORY_LOSS'
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
  },

  // Success messages
  SUCCESS: {
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
  },
};