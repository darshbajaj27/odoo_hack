const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data (Order matters due to Foreign Keys)
  // It is often safer to use transaction or ensure cascade delete in schema, 
  // but manual ordering works here.
  await prisma.stockItem.deleteMany();
  await prisma.operationLine.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.location.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@stockmaster.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'MANAGER',
      status: 'ACTIVE',
    },
  });

  // Create Locations (Required for Operations)
  // 1. Vendor Location (Virtual)
  const vendorLoc = await prisma.location.create({
    data: { name: 'Vendor Location', type: 'VENDOR' }
  });

  // 2. Customer Location (Virtual)
  const customerLoc = await prisma.location.create({
    data: { name: 'Customer Location', type: 'CUSTOMER' }
  });

  // 3. Inventory Loss (Virtual)
  await prisma.location.create({
    data: { name: 'Inventory Adjustment', type: 'INVENTORY_LOSS' }
  });

  // 4. Internal Warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      shortCode: 'WH-MAIN',
      address: '123 Tech Street',
    },
  });

  const stockLoc = await prisma.location.create({
    data: {
      name: 'WH/Stock',
      type: 'INTERNAL',
      parentWarehouseId: warehouse.id
    }
  });

  console.log('Created Locations');

  // Create Products (Start with 0 stock)
  await prisma.product.create({
    data: {
      name: 'Laptop Pro',
      sku: 'LAP-001',
      category: 'Electronics',
      sellingPrice: 1200.00,
      onHand: 0
    },
  });

  await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      sku: 'ACC-002',
      category: 'Accessories',
      sellingPrice: 25.00,
      onHand: 0
    },
  });

  console.log('Created Products (Zero Stock)');
  console.log('✅ Seed completed! Use the App to "Receive" items to increase stock.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });