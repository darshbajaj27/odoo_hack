const dbHelper = require('./dbHelper');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedHelper = {
  /**
   * Seed test database with sample data
   */
  async seedTestDb() {
    // Create test user
    const user = await dbHelper.createTestUser({
      email: 'test@stockmaster.com',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'ADMIN',
    });

    // Create test warehouse
    const warehouse = await dbHelper.createTestWarehouse();

    // Create test products
    const products = [];
    for (let i = 1; i <= 5; i++) {
      const product = await dbHelper.createTestProduct({
        name: `Test Product ${i}`,
        sku: `TEST-SKU-${i}`,
      });
      products.push(product);
    }

    return { user, warehouse, products };
  },

  /**
   * Clean up test database
   */
  async cleanupTestDb() {
    await dbHelper.cleanupAll();
  },
};

module.exports = seedHelper;
