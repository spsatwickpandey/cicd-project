const request = require('supertest');
const app = require('../../src/app');

// Global test utilities
global.testUtils = {
  // Create test server instance
  createTestServer: () => {
    return request(app);
  },

  // Generate test data
  generateTestData: {
    user: (overrides = {}) => ({
      id: Math.floor(Math.random() * 1000),
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      role: 'user',
      createdAt: new Date().toISOString(),
      ...overrides,
    }),

    product: (overrides = {}) => ({
      id: Math.floor(Math.random() * 1000),
      name: 'Test Product',
      description: 'Test product description',
      price: 99.99,
      category: 'Test Category',
      inStock: true,
      createdAt: new Date().toISOString(),
      ...overrides,
    }),

    healthResponse: () => ({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'test',
    }),
  },

  // Performance testing utilities
  performance: {
    measureResponseTime: async(requestFn) => {
      const start = Date.now();
      const response = await requestFn();
      const end = Date.now();
      return {
        response,
        duration: end - start,
      };
    },

    assertResponseTime: (duration, maxTime = 1000) => {
      expect(duration).toBeLessThan(maxTime);
    },
  },

  // Database utilities
  database: {
    seedUsers: (users = []) => {
      // Mock database seeding
      return Promise.resolve(users);
    },

    clearUsers: () => {
      // Mock database clearing
      return Promise.resolve();
    },

    seedProducts: (products = []) => {
      // Mock database seeding
      return Promise.resolve(products);
    },

    clearProducts: () => {
      // Mock database clearing
      return Promise.resolve();
    },
  },

  // Authentication utilities
  auth: {
    generateToken: (user = {}) => {
      // Mock JWT token generation
      return `mock-jwt-token-${user.id || 'default'}`;
    },

    mockAuthMiddleware: (req, res, next) => {
      req.user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      next();
    },

    mockAdminMiddleware: (req, res, next) => {
      req.user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };
      next();
    },
  },
};

// Custom Jest matchers for API testing
expect.extend({
  toBeValidApiResponse(received, expectedStatus = 200) {
    const pass = received.status === expectedStatus &&
                 received.body &&
                 typeof received.body === 'object';

    if (pass) {
      return {
        message: () =>
          `expected API response to not be valid with status ${expectedStatus}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected API response to be valid with status ${expectedStatus}, but got ${received.status}`,
        pass: false,
      };
    }
  },

  toHaveValidResponseStructure(received) {
    const hasSuccess = received.body && typeof received.body.success === 'boolean';
    const hasData = received.body && (received.body.data !== undefined || received.body.error !== undefined);

    const pass = hasSuccess && hasData;

    if (pass) {
      return {
        message: () =>
          'expected API response to not have valid structure',
        pass: true,
      };
    } else {
      return {
        message: () =>
          'expected API response to have valid structure with success and data/error properties',
        pass: false,
      };
    }
  },

  toBeWithinResponseTime(received, maxTime = 1000) {
    const pass = received <= maxTime;

    if (pass) {
      return {
        message: () =>
          `expected response time to not be within ${maxTime}ms`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected response time to be within ${maxTime}ms, but got ${received}ms`,
        pass: false,
      };
    }
  },

  toHaveValidPagination(received) {
    const hasData = Array.isArray(received.body.data);
    const hasCount = typeof received.body.count === 'number';
    const hasTotal = typeof received.body.total === 'number';

    const pass = hasData && hasCount && hasTotal;

    if (pass) {
      return {
        message: () =>
          'expected API response to not have valid pagination',
        pass: true,
      };
    } else {
      return {
        message: () =>
          'expected API response to have valid pagination with data, count, and total properties',
        pass: false,
      };
    }
  },

  toHaveValidErrorResponse(received, expectedStatus = 400) {
    const pass = received.status === expectedStatus &&
                 received.body &&
                 received.body.success === false &&
                 received.body.error;

    if (pass) {
      return {
        message: () =>
          `expected API response to not be a valid error with status ${expectedStatus}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected API response to be a valid error with status ${expectedStatus}, but got ${received.status}`,
        pass: false,
      };
    }
  },
});

// Global test setup
beforeAll(async() => {
  // Global setup before all tests
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3001';
});

// Global test teardown
afterAll(async() => {
  // Global cleanup after all tests
  // Close any open connections, etc.
});

// Test timeout configuration
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
