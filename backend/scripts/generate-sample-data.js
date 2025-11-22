const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Generate sample data for testing and development
 */
async function generateSampleData() {
  console.log('Generating sample data...');

  try {
    // Clear existing data
    await prisma.operation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();

    // Create multiple users
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = await prisma.user.create({
        data: {
          email: `user${i}@stockmaster.com`,
          password: await bcrypt.hash('Password@123', 10),
          firstName: `User${i}`,
          lastName: 'Test',
          role: i === 1 ? 'ADMIN' : 'USER',
        },
      });
      users.push(user);
    }

    console.log(`Created ${users.length} users`);

    // Create warehouses
    const warehouses = [];
    for (let i = 1; i <= 3; i++) {
      const warehouse = await prisma.warehouse.create({
        data: {
          name: `Warehouse ${i}`,
          code: `WH-${String(i).padStart(3, '0')}`,
          address: `${i}00 Main Street`,
          city: `City ${i}`,
          state: `ST${i}`,
          zipCode: `${String(i).padStart(5, '0')}`,
          country: 'USA',
        },
      });
      warehouses.push(warehouse);
    }

    console.log(`Created ${warehouses.length} warehouses`);

    // Create locations for each warehouse
    const locations = [];
    for (const warehouse of warehouses) {
      for (let i = 1; i <= 5; i++) {
        const location = await prisma.location.create({
          data: {
            name: `Aisle ${String.fromCharCode(64 + i)} - Rack 1`,
            code: `LOC-${warehouse.code}-A${i}`,
            warehouseId: warehouse.id,
            aisle: String.fromCharCode(64 + i),
            rack: '1',
            shelf: '1',
          },
        });
        locations.push(location);
      }
    }

    console.log(`Created ${locations.length} locations`);

    // Create products
    const categories = ['Electronics', 'Accessories', 'Office', 'Storage', 'Tools'];
    const products = [];

    for (let i = 1; i <= 50; i++) {
      const product = await prisma.product.create({
        data: {
          name: `Product ${i}`,
          sku: `SKU-${String(i).padStart(5, '0')}`,
          description: `Description for product ${i}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          price: Math.random() * 1000 + 10,
          quantity: Math.floor(Math.random() * 500) + 10,
          reorderLevel: Math.floor(Math.random() * 50) + 5,
        },
      });
      products.push(product);
    }

    console.log(`Created ${products.length} products`);

    // Create operations
    const operationTypes = ['INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT'];
    const operationStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];

    for (let i = 0; i < 100; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const type = operationTypes[Math.floor(Math.random() * operationTypes.length)];
      const fromLoc = type === 'TRANSFER' ? locations[Math.floor(Math.random() * locations.length)] : null;
      const toLoc = ['TRANSFER', 'INBOUND'].includes(type)
        ? locations[Math.floor(Math.random() * locations.length)]
        : null;
      const user = users[Math.floor(Math.random() * users.length)];

      await prisma.operation.create({
        data: {
          productId: product.id,
          quantity: Math.floor(Math.random() * 100) + 1,
          type,
          status: operationStatuses[Math.floor(Math.random() * operationStatuses.length)],
          fromLocationId: fromLoc?.id,
          toLocationId: toLoc?.id,
          userId: user.id,
          notes: `Operation ${i + 1}`,
        },
      });
    }

    console.log('Created 100 sample operations');
    console.log('Sample data generation completed successfully!');
  } catch (error) {
    console.error('Error generating sample data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateSampleData();
