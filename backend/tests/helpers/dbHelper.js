const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const dbHelper = {
  /**
   * Create a test user
   */
  async createTestUser(data = {}) {
    const defaultData = {
      email: 'test@example.com',
      password: await bcrypt.hash('Test@123', 10),
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    };

    return prisma.user.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create a test product
   */
  async createTestProduct(data = {}) {
    const defaultData = {
      name: 'Test Product',
      sku: `PROD-${Date.now()}`,
      category: 'Test',
      price: 99.99,
      quantity: 100,
      reorderLevel: 10,
    };

    return prisma.product.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create a test warehouse
   */
  async createTestWarehouse(data = {}) {
    const defaultData = {
      name: 'Test Warehouse',
      code: `WH-${Date.now()}`,
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country',
    };

    return prisma.warehouse.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Clean up all test data
   */
  async cleanupAll() {
    await prisma.operation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();
    await prisma.contact.deleteMany();
  },
};

module.exports = dbHelper;
