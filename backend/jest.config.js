module.exports = {
  displayName: 'StockMaster Backend',
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: ['**/tests/**/*.test.js'],
  
  // Setup and teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  globalTeardown: '<rootDir>/tests/teardown.js',
  
  // Timeout for async operations (operations with DB, auth, etc.)
  testTimeout: 15000,
  
  // Coverage configuration
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    'validators/**/*.js',
    'routes/**/*.js',
    '!**/*.config.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.next/**',
  ],
  setupFiles: ['<rootDir>/tests/jest-setup.js'],
  
  // Coverage thresholds for StockMaster backend
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
    // Stricter coverage for critical components
    './validators/**/*.js': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './middleware/**/*.js': {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './controllers/**/*.js': {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Transform files
  transform: {
    '^.+\\.js$': ['babel-jest', { rootMode: 'upward' }],
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/build/',
  ],
  
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/build/',
    '/coverage/',
  ],
  
  // Verbose output for detailed test results
  verbose: true,
  
  // Bail out after first test failure (optional, remove if you want full report)
  bail: false,
  
  // Max workers for parallel testing
  maxWorkers: '50%',
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Reset mocks after each test
  resetMocks: true,
  
  // Notify when tests are slow
  notify: true,
  notifyMode: 'failure-change',
  
  // Test environment options for Node.js
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
};