const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
require('dotenv').config();

const prisma = new PrismaClient();

// Setup for test environment
module.exports = {
  async setupTestDb() {
    try {
      // Push the Prisma schema to the test database
      console.log('Setting up test database...');
      execSync('npx prisma db push --force-reset', {
        env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
        stdio: 'inherit',
      });
      console.log('Test database setup complete');
    } catch (error) {
      console.error('Failed to setup test database:', error);
      throw error;
    }
  },

  async teardownTestDb() {
    try {
      // Clean up test data
      console.log('Cleaning up test database...');
      await prisma.operation.deleteMany();
      await prisma.product.deleteMany();
      await prisma.location.deleteMany();
      await prisma.warehouse.deleteMany();
      await prisma.contact.deleteMany();
      await prisma.user.deleteMany();
      console.log('Test database cleanup complete');
    } catch (error) {
      console.error('Failed to cleanup test database:', error);
    }
  },

  async clearAllTables() {
    const tables = [
      'operations',
      'products',
      'locations',
      'warehouses',
      'contacts',
      'users',
    ];

    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table} CASCADE`);
    }
  },

  prisma,
};