module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    'validators/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**',
  ],
};
