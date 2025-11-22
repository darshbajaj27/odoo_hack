const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Production seed script
 * Seeds initial data for production environment
 */
async function main() {
  console.log('Starting production seed...');

  try {
    // Create default admin user (CHANGE PASSWORD IN PRODUCTION)
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@stockmaster.com' },
      update: {},
      create: {
        email: 'admin@stockmaster.com',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10),
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('Admin user created/updated:', adminUser.id);

    console.log('Production seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
