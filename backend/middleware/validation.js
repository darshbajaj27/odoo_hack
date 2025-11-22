const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Authentication validation schemas
 */
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(), // Changed from firstName/lastName to name (matches your User model)
    role: Joi.string().valid('MANAGER', 'STAFF').optional(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  verifyOtp: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),
};

/**
 * Product validation schemas
 */
const productSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    sku: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().optional(),
    costPrice: Joi.number().positive().optional(),
    // We DO NOT require quantity here. Stock starts at 0.
    minStock: Joi.number().integer().min(0).optional(), 
    description: Joi.string().optional(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    sku: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    minStock: Joi.number().integer().min(0).optional(),
    description: Joi.string().optional(),
  }),
};

/**
 * Operation validation schemas
 */
const operationSchemas = {
  create: Joi.object({
    // Allow SKU OR ProductID
    sku: Joi.string().optional(),
    productId: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    
    quantity: Joi.number().positive().required(),
    
    // Updated ENUMS to match your new logic
    type: Joi.string().valid('RECEIPT', 'DELIVERY', 'INTERNAL', 'ADJUSTMENT').required(),
    
    fromLocationId: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    toLocationId: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    notes: Joi.string().optional(),
  }).or('sku', 'productId'), // Require at least one

  update: Joi.object({
    notes: Joi.string().optional(),
    // Operations are generally immutable in a ledger, but we allow notes updates
  }),
};

/**
 * Settings validation schemas
 */
const settingsSchemas = {
  warehouse: Joi.object({
    name: Joi.string().required(),
    shortCode: Joi.string().required(),
    address: Joi.string().required(),
  }),

  location: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('INTERNAL', 'VENDOR', 'CUSTOMER', 'INVENTORY_LOSS').required(),
    parentWarehouseId: Joi.number().required(),
  }),

  contact: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('VENDOR', 'CUSTOMER').required(),
    email: Joi.string().email().optional(),
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
      // logger.warn('Validation error:', error.details); // Uncomment if logger exists
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