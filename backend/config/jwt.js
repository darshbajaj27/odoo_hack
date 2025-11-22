/**
 * JWT configuration
 */
module.exports = {
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION || '7d',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
};
