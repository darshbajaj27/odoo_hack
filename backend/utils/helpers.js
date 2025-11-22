/**
 * Generate a unique ID
 */
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Parse pagination parameters
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

/**
 * Calculate pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };
};

/**
 * Safe JSON parse
 */
const safeJsonParse = (data, defaultValue = null) => {
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

/**
 * Sanitize string
 */
const sanitizeString = (str) => {
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

module.exports = {
  generateId,
  formatCurrency,
  parsePagination,
  getPaginationMeta,
  safeJsonParse,
  sanitizeString,
};
