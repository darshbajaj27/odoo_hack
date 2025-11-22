const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Setup for test environment
module.exports = {
  async setupTestDb() {
    // Run migrations
    // Note: In actual implementation, run prisma migrate deploy
  },

  async teardownTestDb() {
    // Clean up test data
    await prisma.$executeRawUnsafe('TRUNCATE TABLE users CASCADE');
  },

  prisma,
};
