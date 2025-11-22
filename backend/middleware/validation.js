const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Authentication validation schemas
 */
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phone: Joi.string().optional(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

/**
 * Product validation schemas
 */
const productSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    sku: Joi.string().required(),
    description: Joi.string().optional(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    reorderLevel: Joi.number().integer().min(0).required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    sku: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    quantity: Joi.number().integer().min(0).optional(),
    reorderLevel: Joi.number().integer().min(0).optional(),
  }),
};

/**
 * Operation validation schemas
 */
const operationSchemas = {
  create: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
    type: Joi.string().valid('INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT').required(),
    fromLocationId: Joi.string().optional(),
    toLocationId: Joi.string().optional(),
    notes: Joi.string().optional(),
  }),

  update: Joi.object({
    productId: Joi.string().optional(),
    quantity: Joi.number().integer().positive().optional(),
    type: Joi.string().valid('INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT').optional(),
    fromLocationId: Joi.string().optional(),
    toLocationId: Joi.string().optional(),
    notes: Joi.string().optional(),
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('PENDING', 'COMPLETED', 'CANCELLED').required(),
  }),
};

/**
 * Settings validation schemas
 */
const settingsSchemas = {
  warehouse: Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }),

  location: Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    warehouseId: Joi.string().required(),
    aisle: Joi.string().optional(),
    rack: Joi.string().optional(),
    shelf: Joi.string().optional(),
  }),

  userRole: Joi.object({
    role: Joi.string().valid('USER', 'ADMIN', 'MANAGER').required(),
  }),

  contact: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    type: Joi.string().valid('SUPPLIER', 'CUSTOMER', 'LOGISTICS').required(),
  }),
};

/**
 * Validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      logger.warn('Validation error:', error.details);
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validation middleware exports
 */
const validateAuth = (action) => validate(authSchemas[action]);
const validateProduct = (action) => validate(productSchemas[action]);
const validateOperation = (action) => validate(operationSchemas[action]);
const validateSettings = (action) => validate(settingsSchemas[action]);

module.exports = {
  validateAuth,
  validateProduct,
  validateOperation,
  validateSettings,
};
