// ============================================
// backend/tests/helpers/dbHelper.js (COMPLETE)
// ============================================
const prisma = require('../../utils/prisma'); 
const bcrypt = require('bcryptjs');



const dbHelper = {

    async cleanupAll() {
    // Order matters for Foreign Keys!
    await prisma.operationLine.deleteMany();
    await prisma.stockItem.deleteMany();
    await prisma.operation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.user.deleteMany();
  },
  /**
   * Create a test user
   */
  async createTestUser(data = {}) {
    const defaultData = {
      email: `test${Date.now()}@example.com`,
      password: await bcrypt.hash('Test@123', 10),
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      phone: '+1234567890',
      isActive: true,
    };

    return prisma.user.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create a test admin user
   */
  async createTestAdmin(data = {}) {
    return this.createTestUser({
      email: `admin${Date.now()}@example.com`,
      firstName: 'Admin',
      lastName: 'Test',
      role: 'ADMIN',
      ...data,
    });
  },

  /**
   * Create a test manager user
   */
  async createTestManager(data = {}) {
    return this.createTestUser({
      email: `manager${Date.now()}@example.com`,
      firstName: 'Manager',
      lastName: 'Test',
      role: 'MANAGER',
      ...data,
    });
  },

  /**
   * Create a test product
   */
  async createTestProduct(data = {}) {
    const defaultData = {
      name: 'Test Product',
      sku: `TEST-SKU-${Date.now()}`,
      category: 'Test Category',
      price: 99.99,
      quantity: 100,
      reorderLevel: 10,
      description: 'Test product description',
      isActive: true,
    };

    return prisma.product.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create multiple test products
   */
  async createTestProducts(count = 5) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const product = await this.createTestProduct({
        name: `Test Product ${i + 1}`,
        sku: `TEST-SKU-${Date.now()}-${i}`,
      });
      products.push(product);
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return products;
  },

  /**
   * Create a test warehouse
   */
  async createTestWarehouse(data = {}) {
    const defaultData = {
      name: 'Test Warehouse',
      code: `WH-TEST-${Date.now()}`,
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country',
      isActive: true,
    };

    return prisma.warehouse.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create multiple test warehouses
   */
  async createTestWarehouses(count = 3) {
    const warehouses = [];
    for (let i = 0; i < count; i++) {
      const warehouse = await this.createTestWarehouse({
        name: `Test Warehouse ${i + 1}`,
        code: `WH-TEST-${Date.now()}-${i}`,
      });
      warehouses.push(warehouse);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return warehouses;
  },

  /**
   * Create a test location
   */
  async createTestLocation(warehouseId, data = {}) {
    const defaultData = {
      name: 'Test Location',
      code: `LOC-TEST-${Date.now()}`,
      warehouseId,
      aisle: 'A',
      rack: '1',
      shelf: '1',
      isActive: true,
    };

    return prisma.location.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create multiple test locations
   */
  async createTestLocations(warehouseId, count = 5) {
    const locations = [];
    for (let i = 0; i < count; i++) {
      const location = await this.createTestLocation(warehouseId, {
        name: `Test Location ${i + 1}`,
        code: `LOC-TEST-${Date.now()}-${i}`,
        aisle: String.fromCharCode(65 + i), // A, B, C, etc.
      });
      locations.push(location);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return locations;
  },

  /**
   * Create a test operation
   */
  async createTestOperation(productId, userId, data = {}) {
    const defaultData = {
      productId,
      userId,
      quantity: 10,
      type: 'INBOUND',
      status: 'PENDING',
      notes: 'Test operation',
    };

    return prisma.operation.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create multiple test operations
   */
  async createTestOperations(productId, userId, count = 5) {
    const operations = [];
    const types = ['INBOUND', 'OUTBOUND', 'ADJUSTMENT', 'TRANSFER'];
    for (let i = 0; i < count; i++) {
      const operation = await this.createTestOperation(productId, userId, {
        quantity: Math.floor(Math.random() * 50) + 1,
        type: types[i % types.length],
        notes: `Test operation ${i + 1}`,
      });
      operations.push(operation);
    }
    return operations;
  },

  /**
   * Create a test contact
   */
  async createTestContact(data = {}) {
    const defaultData = {
      name: 'Test Contact',
      email: `contact${Date.now()}@test.com`,
      phone: '+1234567890',
      company: 'Test Company',
      type: 'SUPPLIER',
      isActive: true,
    };

    return prisma.contact.create({
      data: { ...defaultData, ...data },
    });
  },

  /**
   * Create multiple test contacts
   */
  async createTestContacts(count = 3) {
    const contacts = [];
    const types = ['SUPPLIER', 'CUSTOMER', 'LOGISTICS'];
    for (let i = 0; i < count; i++) {
      const contact = await this.createTestContact({
        name: `Test Contact ${i + 1}`,
        email: `contact${Date.now()}-${i}@test.com`,
        type: types[i % types.length],
      });
      contacts.push(contact);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return contacts;
  },

  /**
   * Create a complete test environment
   */
  async createTestEnvironment() {
    const user = await this.createTestUser();
    const admin = await this.createTestAdmin();
    const warehouse = await this.createTestWarehouse();
    const location = await this.createTestLocation(warehouse.id);
    const product = await this.createTestProduct();
    const operation = await this.createTestOperation(product.id, user.id);
    const contact = await this.createTestContact();

    return {
      user,
      admin,
      warehouse,
      location,
      product,
      operation,
      contact,
    };
  },

  /**
   * Clean up specific resources
   */
  async cleanupOperations() {
    await prisma.operation.deleteMany();
  },

  async cleanupProducts() {
    await prisma.product.deleteMany();
  },

  async cleanupLocations() {
    await prisma.location.deleteMany();
  },

  async cleanupWarehouses() {
    await prisma.warehouse.deleteMany();
  },

  async cleanupUsers() {
    await prisma.user.deleteMany();
  },

  async cleanupContacts() {
    await prisma.contact.deleteMany();
  },

  /**
   * Clean up all test data
   */
  async cleanupAll() {
    // Delete in correct order due to foreign key constraints
    await prisma.operation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.user.deleteMany();
  },

  /**
   * Get Prisma client
   */
  getPrisma() {
    return prisma;
  },

  /**
   * Disconnect Prisma client
   */
  async disconnect() {
    await prisma.$disconnect();
  },

  /**
   * Count records in a table
   */
  async count(model) {
    return prisma[model].count();
  },

  /**
   * Find record by ID
   */
  async findById(model, id) {
    return prisma[model].findUnique({ where: { id } });
  },
};

module.exports = dbHelper;