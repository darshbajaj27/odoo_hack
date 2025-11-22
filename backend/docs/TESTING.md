# Testing Guide

## Overview

This guide covers testing strategies for the StockMaster backend including unit tests, integration tests, and setup/teardown procedures.

## Test Structure

```
tests/
├── helpers/              # Test utilities
│   ├── dbHelper.js      # Database operations
│   ├── seedHelper.js    # Seed data
│   └── requestHelper.js # HTTP request helpers
├── unit/                # Unit tests
│   ├── auth.test.js
│   ├── product.test.js
│   └── operation.test.js
└── integration/         # Integration tests
    ├── auth.integration.test.js
    ├── products.integration.test.js
    └── operations.integration.test.js
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test File
```bash
npm test -- auth.test.js
```

## Unit Tests

Unit tests test individual functions and modules in isolation.

### Example: Product Validator

```javascript
const productValidator = require('../validators/productValidator');

describe('Product Validator', () => {
  test('should validate valid product data', () => {
    const data = {
      name: 'Laptop',
      sku: 'PROD-001',
      category: 'Electronics',
      price: 999.99,
      quantity: 50,
      reorderLevel: 10,
    };

    const result = productValidator.validateCreate(data);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject missing required fields', () => {
    const data = { name: 'Laptop' };

    const result = productValidator.validateCreate(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

## Integration Tests

Integration tests verify that multiple components work together correctly.

### Example: Product API

```javascript
const request = require('supertest');
const app = require('../../server');
const seedHelper = require('../helpers/seedHelper');

describe('Product API', () => {
  let token;
  let testData;

  beforeAll(async () => {
    testData = await seedHelper.seedTestDb();
    token = await requestHelper.loginUser(app, testData.user.email, 'test-password');
  });

  afterAll(async () => {
    await seedHelper.cleanupTestDb();
  });

  test('GET /api/products should return all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.pagination).toBeDefined();
  });

  test('POST /api/products should create a product', async () => {
    const newProduct = {
      name: 'Test Product',
      sku: 'TEST-SKU',
      category: 'Test',
      price: 99.99,
      quantity: 50,
      reorderLevel: 5,
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.sku).toBe(newProduct.sku);
  });
});
```

## Test Helpers

### dbHelper

Provides database utilities for testing:

```javascript
const dbHelper = require('./helpers/dbHelper');

// Create test user
const user = await dbHelper.createTestUser({
  email: 'test@example.com',
});

// Create test product
const product = await dbHelper.createTestProduct({
  name: 'Test',
  price: 99.99,
});

// Clean up
await dbHelper.cleanupAll();
```

### seedHelper

Manages test data seeding:

```javascript
const seedHelper = require('./helpers/seedHelper');

// Seed database
const { user, warehouse, products } = await seedHelper.seedTestDb();

// Cleanup
await seedHelper.cleanupTestDb();
```

### requestHelper

Simplifies API request testing:

```javascript
const requestHelper = require('./helpers/requestHelper');

// Login and get token
const token = await requestHelper.loginUser(app, 'user@example.com', 'password');

// Make authenticated request
const response = await requestHelper.authenticatedRequest(
  app,
  'GET',
  '/api/products',
  token
);
```

## Test Database

Tests use an isolated test database to avoid affecting production data. Configure in `.env.test`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/stockmaster_test
```

## Mocking

### Mock Prisma Client

```javascript
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  })),
}));
```

### Mock External Services

```javascript
jest.mock('../utils/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up data after tests
3. **Mocking**: Mock external dependencies
4. **Descriptive Names**: Use clear test names
5. **Arrange-Act-Assert**: Follow AAA pattern
6. **Data Fixtures**: Use consistent test data
7. **Error Cases**: Test both success and failure paths
8. **Performance**: Keep tests fast

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View coverage report:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-commit hooks

Configure in `.github/workflows/test.yml` for GitHub Actions.

## Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="should validate valid product"
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output
```bash
npm test -- --verbose
```

## Common Issues

### Database Connection Errors
- Ensure test database exists
- Check DATABASE_URL in .env.test
- Verify PostgreSQL is running

### Timeout Errors
- Increase Jest timeout: `jest.setTimeout(10000)`
- Ensure async operations complete

### Flaky Tests
- Avoid hard timeouts
- Use proper async/await
- Clean up resources properly
