// backend/tests/helpers/seedHelper.js (COMPLETE)
// ============================================
const dbHelper = require('./dbHelper');
const bcrypt = require('bcryptjs');

const seedHelper = {
  /**
   * Seed test database with sample data
   */
  async seedTestDb() {
    // Create test users
    const admin = await dbHelper.createTestUser({
      email: 'test-admin@stockmaster.com',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'ADMIN',
    });

    const manager = await dbHelper.createTestUser({
      email: 'test-manager@stockmaster.com',
      firstName: 'Test',
      lastName: 'Manager',
      role: 'MANAGER',
    });

    const user = await dbHelper.createTestUser({
      email: 'test-user@stockmaster.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    });

    // Create test warehouses
    const warehouses = await dbHelper.createTestWarehouses(2);

    // Create test locations
    const locations = [];
    for (const warehouse of warehouses) {
      const warehouseLocations = await dbHelper.createTestLocations(warehouse.id, 3);
      locations.push(...warehouseLocations);
    }

    // Create test products
    const products = await dbHelper.createTestProducts(10);

    // Create test operations
    const operations = [];
    for (let i = 0; i < 5; i++) {
      const product = products[i % products.length];
      const operation = await dbHelper.createTestOperation(product.id, user.id, {
        type: ['INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT'][i % 4],
        status: ['PENDING', 'COMPLETED'][i % 2],
      });
      operations.push(operation);
    }

    // Create test contacts
    const contacts = await dbHelper.createTestContacts(3);

    return {
      users: { admin, manager, user },
      warehouses,
      locations,
      products,
      operations,
      contacts,
    };
  },

  /**
   * Seed minimal test data
   */
  async seedMinimalTestDb() {
    const user = await dbHelper.createTestUser();
    const product = await dbHelper.createTestProduct();
    const warehouse = await dbHelper.createTestWarehouse();

    return { user, product, warehouse };
  },

  /**
   * Seed test data for specific feature
   */
  async seedForFeature(feature) {
    switch (feature) {
      case 'products':
        return {
          products: await dbHelper.createTestProducts(5),
          categories: ['Electronics', 'Office', 'Tools'],
        };

      case 'operations':
        const user = await dbHelper.createTestUser();
        const product = await dbHelper.createTestProduct();
        return {
          user,
          product,
          operations: await dbHelper.createTestOperations(product.id, user.id, 10),
        };

      case 'warehouses':
        const warehouses = await dbHelper.createTestWarehouses(3);
        const locations = [];
        for (const warehouse of warehouses) {
          const locs = await dbHelper.createTestLocations(warehouse.id, 5);
          locations.push(...locs);
        }
        return { warehouses, locations };

      case 'contacts':
        return {
          contacts: await dbHelper.createTestContacts(5),
        };

      default:
        throw new Error(`Unknown feature: ${feature}`);
    }
  },

  /**
   * Seed test data with specific quantities
   */
  async seedWithQuantities(quantities) {
    const data = {};

    if (quantities.users) {
      data.users = [];
      for (let i = 0; i < quantities.users; i++) {
        data.users.push(await dbHelper.createTestUser());
      }
    }

    if (quantities.products) {
      data.products = await dbHelper.createTestProducts(quantities.products);
    }

    if (quantities.warehouses) {
      data.warehouses = await dbHelper.createTestWarehouses(quantities.warehouses);
    }

    if (quantities.contacts) {
      data.contacts = await dbHelper.createTestContacts(quantities.contacts);
    }

    return data;
  },

  /**
   * Create test scenario for operations flow
   */
  async createOperationsScenario() {
    const user = await dbHelper.createTestUser();
    const warehouse = await dbHelper.createTestWarehouse();
    const location1 = await dbHelper.createTestLocation(warehouse.id, {
      name: 'Receiving',
      code: 'RCV-01',
    });
    const location2 = await dbHelper.createTestLocation(warehouse.id, {
      name: 'Storage',
      code: 'STR-01',
    });
    const product = await dbHelper.createTestProduct({ quantity: 0 });

    // Create inbound operation
    const inbound = await dbHelper.createTestOperation(product.id, user.id, {
      type: 'INBOUND',
      toLocationId: location1.id,
      quantity: 100,
      status: 'COMPLETED',
    });

    // Create transfer operation
    const transfer = await dbHelper.createTestOperation(product.id, user.id, {
      type: 'TRANSFER',
      fromLocationId: location1.id,
      toLocationId: location2.id,
      quantity: 50,
      status: 'PENDING',
    });

    return {
      user,
      warehouse,
      locations: [location1, location2],
      product,
      operations: { inbound, transfer },
    };
  },

  /**
   * Clean up test database
   */
  async cleanupTestDb() {
    await dbHelper.cleanupAll();
  },

  /**
   * Reset test database to clean state
   */
  async resetTestDb() {
    await this.cleanupTestDb();
    return await this.seedMinimalTestDb();
  },
};

module.exports = seedHelper;