const { prisma } = require('./setup');

// Teardown for test environment
module.exports = {
  async teardown() {
    try {
      console.log('Running test teardown...');
      
      // Close database connections
      await prisma.$disconnect();
      
      console.log('Test teardown complete');
    } catch (error) {
      console.error('Error during teardown:', error);
    }
  },
};