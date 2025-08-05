# Comprehensive Jest Testing Framework Guide

This guide provides comprehensive documentation for the Jest testing framework implementation, including setup, best practices, and examples.

## 🏗️ Framework Architecture

### Test Structure
```
tests/
├── setup/
│   ├── jest.setup.js          # Global test setup and custom matchers
│   └── env.setup.js           # Environment configuration
├── utils/
│   └── mockFactories.js       # Mock factories for test data
├── unit/
│   ├── routes/
│   │   └── health.test.js     # Unit tests for routes
│   └── middleware/
│       └── errorHandler.test.js # Unit tests for middleware
├── integration/
│   └── users.test.js          # Integration tests
└── performance/
    └── api.test.js            # Performance and load tests
```

## 🧪 Test Categories

### 1. Unit Tests
- **Purpose**: Test individual functions and components in isolation
- **Location**: `tests/unit/`
- **Coverage**: 80% minimum threshold
- **Examples**: Route handlers, middleware, utility functions

### 2. Integration Tests
- **Purpose**: Test API endpoints and database interactions
- **Location**: `tests/integration/`
- **Coverage**: End-to-end API functionality
- **Examples**: CRUD operations, authentication flows

### 3. Performance Tests
- **Purpose**: Validate response times and load handling
- **Location**: `tests/performance/`
- **Metrics**: Response time, throughput, memory usage
- **Examples**: Load testing, stress testing, benchmarks

## 🛠️ Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json',
  ],
  reporters: [
    'default',
    'jest-junit',
    'jest-html-reporters',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js',
  ],
};
```

### Environment Setup (`tests/setup/env.setup.js`)
```javascript
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = 'test-jwt-secret';
```

## 🎯 Custom Matchers

### API Response Matchers
```javascript
// Valid API response
expect(response).toBeValidApiResponse(200);

// Valid response structure
expect(response).toHaveValidResponseStructure();

// Error response
expect(response).toHaveValidErrorResponse(400);

// Response time
expect(duration).toBeWithinResponseTime(1000);

// Pagination
expect(response).toHaveValidPagination();
```

### Usage Examples
```javascript
describe('API Response Validation', () => {
  it('should return valid API response', async () => {
    const response = await server.get('/api/health');
    
    expect(response).toBeValidApiResponse(200);
    expect(response).toHaveValidResponseStructure();
  });

  it('should respond within time limit', async () => {
    const { response, duration } = await testUtils.performance.measureResponseTime(
      () => server.get('/api/health')
    );

    expect(response).toBeValidApiResponse(200);
    expect(duration).toBeWithinResponseTime(500);
  });
});
```

## 🏭 Mock Factories

### User Mock Factory
```javascript
const MockFactory = require('../utils/mockFactories');

// Create single user
const user = MockFactory.createUser({
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
});

// Create user list
const users = MockFactory.createUserList(5);

// Create API response
const apiResponse = MockFactory.createApiResponse(user, true, 'User created');
```

### Product Mock Factory
```javascript
// Create single product
const product = MockFactory.createProduct({
  name: 'Test Product',
  price: 99.99,
  category: 'Electronics',
});

// Create product list
const products = MockFactory.createProductList(10);
```

## 🗄️ Database Utilities

### Seeding Test Data
```javascript
beforeAll(async () => {
  // Seed test data
  testUsers = MockFactory.createUserList(5);
  await testUtils.database.seedUsers(testUsers);
});

afterAll(async () => {
  // Cleanup test data
  await testUtils.database.clearUsers();
});
```

### Database Mocking
```javascript
const userRepository = MockFactory.createUserRepositoryMock();
userRepository.findById.mockResolvedValue(MockFactory.createUser());
userRepository.create.mockResolvedValue(MockFactory.createUser());
```

## 🔐 Authentication Testing

### Mock Authentication
```javascript
// Generate auth token
const authToken = testUtils.auth.generateToken(user);

// Mock auth middleware
const authMiddleware = MockFactory.createAuthMiddlewareMock();

// Test protected routes
const response = await server
  .get('/api/protected')
  .set('Authorization', `Bearer ${authToken}`);
```

### Authorization Testing
```javascript
describe('Authorization', () => {
  it('should require authentication', async () => {
    const response = await server.get('/api/protected');
    expect(response.status).toBe(401);
  });

  it('should require admin role', async () => {
    const userToken = testUtils.auth.generateToken({ role: 'user' });
    const response = await server
      .delete('/api/users/1')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(response.status).toBe(403);
  });
});
```

## ⚡ Performance Testing

### Response Time Testing
```javascript
describe('Performance Tests', () => {
  it('should respond within acceptable time', async () => {
    const { response, duration } = await testUtils.performance.measureResponseTime(
      () => server.get('/api/health')
    );

    expect(response).toBeValidApiResponse(200);
    expect(duration).toBeWithinResponseTime(100);
  });
});
```

### Load Testing
```javascript
describe('Load Testing', () => {
  it('should handle concurrent requests', async () => {
    const concurrentRequests = 10;
    const promises = Array.from({ length: concurrentRequests }, () =>
      server.get('/api/health')
    );

    const start = Date.now();
    const responses = await Promise.all(promises);
    const totalTime = Date.now() - start;

    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    expect(totalTime).toBeLessThan(1000);
  });
});
```

### Memory Usage Testing
```javascript
describe('Memory Usage', () => {
  it('should not leak memory', async () => {
    const initialMemory = process.memoryUsage();
    
    for (let i = 0; i < 100; i++) {
      await server.get('/api/health');
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
    
    expect(memoryIncreaseMB).toBeLessThan(50);
  });
});
```

## 📊 Coverage Reporting

### Coverage Thresholds
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/routes/': {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85,
  },
}
```

### Coverage Reports
- **Text**: Console output
- **LCOV**: For CI/CD integration
- **HTML**: Detailed coverage report
- **JSON**: Machine-readable format

## 🚀 Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI
npm run test:ci
```

### Specific Test Categories
```bash
# Run only unit tests
npm test -- --testPathPattern=unit

# Run only integration tests
npm test -- --testPathPattern=integration

# Run only performance tests
npm test -- --testPathPattern=performance
```

### Coverage Commands
```bash
# Generate coverage report
npm run test:coverage

# Check coverage thresholds
npm run test:coverage -- --coverageThreshold
```

## 📈 Test Reports

### JUnit XML Report
- **Location**: `test-results/junit.xml`
- **Format**: XML for CI/CD integration
- **Usage**: Jenkins, GitLab CI, GitHub Actions

### HTML Report
- **Location**: `test-results/test-report.html`
- **Features**: Interactive test results
- **Usage**: Local development and debugging

### Coverage Reports
- **Location**: `coverage/`
- **Formats**: HTML, LCOV, JSON
- **Usage**: Code quality analysis

## 🔧 Best Practices

### 1. Test Structure
```javascript
describe('Feature Name', () => {
  let server;
  let testData;

  beforeAll(async () => {
    server = testUtils.createTestServer();
    testData = await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  beforeEach(async () => {
    await resetTestData();
  });

  describe('Specific Functionality', () => {
    it('should perform expected behavior', async () => {
      // Test implementation
    });
  });
});
```

### 2. Mock Management
```javascript
// Use mock factories for consistent test data
const user = MockFactory.createUser({
  name: 'Test User',
  email: 'test@example.com',
});

// Mock external dependencies
jest.mock('../../src/services/database');
const databaseService = require('../../src/services/database');
databaseService.query.mockResolvedValue([user]);
```

### 3. Performance Testing
```javascript
// Always measure response times
const { response, duration } = await testUtils.performance.measureResponseTime(
  () => server.get('/api/endpoint')
);

expect(response).toBeValidApiResponse(200);
expect(duration).toBeWithinResponseTime(500);
```

### 4. Error Testing
```javascript
// Test error scenarios
it('should handle validation errors', async () => {
  const invalidData = { name: 'Test' }; // Missing required fields
  
  const response = await server.post('/api/users').send(invalidData);
  
  expect(response).toHaveValidErrorResponse(400);
  expect(response.body.error).toContain('required');
});
```

## 🐛 Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
npm test -- --verbose --detectOpenHandles

# Run specific test file
npm test -- tests/unit/routes/health.test.js

# Run tests with console output
npm test -- --verbose
```

### Common Issues
1. **Async/Await**: Always use async/await for asynchronous operations
2. **Cleanup**: Ensure proper cleanup in afterAll hooks
3. **Mocks**: Reset mocks between tests
4. **Timeouts**: Set appropriate timeouts for long-running tests

## 📋 Test Checklist

### Before Writing Tests
- [ ] Understand the component/function to test
- [ ] Identify edge cases and error scenarios
- [ ] Plan test data and mocks
- [ ] Consider performance implications

### While Writing Tests
- [ ] Use descriptive test names
- [ ] Test both success and failure scenarios
- [ ] Validate response structure and data
- [ ] Measure performance where applicable
- [ ] Use custom matchers for consistency

### After Writing Tests
- [ ] Run tests locally
- [ ] Check coverage thresholds
- [ ] Verify CI/CD integration
- [ ] Update documentation if needed

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Coverage Badge
```markdown
[![Test Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Last Updated**: 2024
**Version**: 1.0.0 