const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.operation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.location.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Create default admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@stockmaster.com',
      password: await bcrypt.hash('Admin@123', 10),
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Created admin user:', adminUser.id);

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: 'user@stockmaster.com',
      password: await bcrypt.hash('User@123', 10),
      firstName: 'Demo',
      lastName: 'User',
      phone: '+0987654321',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('Created demo user:', demoUser.id);

  // Create warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      code: 'WH-001',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isActive: true,
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Regional Warehouse',
      code: 'WH-002',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      isActive: true,
    },
  });

  console.log('Created warehouses');

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      name: 'Aisle A - Rack 1',
      code: 'LOC-A1-R1',
      warehouseId: warehouse1.id,
      aisle: 'A',
      rack: '1',
      shelf: '1',
      isActive: true,
    },
  });

  const location2 = await prisma.location.create({
    data: {
      name: 'Aisle B - Rack 2',
      code: 'LOC-B2-R2',
      warehouseId: warehouse1.id,
      aisle: 'B',
      rack: '2',
      shelf: '1',
      isActive: true,
    },
  });

  const location3 = await prisma.location.create({
    data: {
      name: 'Storage - Zone 1',
      code: 'LOC-Z1',
      warehouseId: warehouse2.id,
      aisle: 'C',
      rack: '1',
      shelf: '1',
      isActive: true,
    },
  });

  console.log('Created locations');

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      sku: 'PROD-001',
      description: 'High-performance laptop',
      category: 'Electronics',
      price: 1299.99,
      quantity: 50,
      reorderLevel: 10,
      isActive: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Mouse',
      sku: 'PROD-002',
      description: 'Wireless mouse',
      category: 'Accessories',
      price: 29.99,
      quantity: 200,
      reorderLevel: 50,
      isActive: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Keyboard',
      sku: 'PROD-003',
      description: 'Mechanical keyboard',
      category: 'Accessories',
      price: 89.99,
      quantity: 100,
      reorderLevel: 20,
      isActive: true,
    },
  });

  console.log('Created products');

  // Create contacts
  await prisma.contact.create({
    data: {
      name: 'TechSupply Inc',
      email: 'contact@techsupply.com',
      phone: '+1234567890',
      company: 'TechSupply Inc',
      type: 'SUPPLIER',
      isActive: true,
    },
  });

  console.log('Created contacts');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
