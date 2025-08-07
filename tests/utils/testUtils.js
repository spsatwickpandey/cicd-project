/**
 * Test Utilities for CI/CD Node.js API
 * Provides common utilities for testing across the application
 */

// Test utilities - no direct supertest import needed

const testUtils = {
  // Custom Jest matchers
  toBeValidApiResponse(received, expectedStatus) {
    const pass = received.status === expectedStatus &&
                 received.body &&
                 typeof received.body === 'object';

    if (pass) {
      return {
        message: () => `expected API response not to be valid with status ${expectedStatus}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected API response to be valid with status ${expectedStatus}, but got ${received.status}`,
        pass: false,
      };
    }
  },

  toHaveValidErrorResponse(received, expectedStatus) {
    const pass = received.status === expectedStatus &&
                 received.body &&
                 received.body.error;

    if (pass) {
      return {
        message: () => `expected API response not to be a valid error with status ${expectedStatus}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected API response to be a valid error with status ${expectedStatus}, but got ${received.status}`,
        pass: false,
      };
    }
  },

  toHaveValidResponseStructure(received) {
    const hasStructure = received.body &&
                        (received.body.success !== undefined || received.body.error !== undefined) &&
                        (received.body.data || received.body.error);

    if (hasStructure) {
      return {
        message: () => 'expected API response not to have valid structure',
        pass: true,
      };
    } else {
      return {
        message: () => 'expected API response to have valid structure with success and data/error properties',
        pass: false,
      };
    }
  },

  toBeWithinResponseTime(received, maxTime) {
    const pass = received <= maxTime;

    if (pass) {
      return {
        message: () => `expected response time ${received}ms not to be within ${maxTime}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response time ${received}ms to be within ${maxTime}ms`,
        pass: false,
      };
    }
  },

  // Test data generators
  generateUser(overrides = {}) {
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      ...overrides,
    };
  },

  generateProduct(overrides = {}) {
    return {
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      category: 'electronics',
      stock: 10,
      ...overrides,
    };
  },

  // Cleanup utilities
  async cleanupDatabase() {
    // Mock cleanup - in real app would clean test database
    return Promise.resolve();
  },

  // Timing utilities
  async measureResponseTime(requestPromise) {
    const start = Date.now();
    const response = await requestPromise;
    const duration = Date.now() - start;
    return { response, duration };
  },

  // Mock factories
  createMockUser(id = 1) {
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  createMockProduct(id = 1) {
    return {
      id,
      name: `Product ${id}`,
      description: `Description for product ${id}`,
      price: 99.99 + id,
      category: 'electronics',
      stock: 10 + id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Error generators
  createValidationError(message = 'Validation failed') {
    const error = new Error(message);
    error.status = 400;
    error.type = 'validation';
    return error;
  },

  createNotFoundError(resource = 'Resource') {
    const error = new Error(`${resource} not found`);
    error.status = 404;
    error.type = 'not_found';
    return error;
  },

  createUnauthorizedError(message = 'Unauthorized access') {
    const error = new Error(message);
    error.status = 401;
    error.type = 'unauthorized';
    return error;
  },

  createForbiddenError(message = 'Access forbidden') {
    const error = new Error(message);
    error.status = 403;
    error.type = 'forbidden';
    return error;
  },

  // Performance testing utilities
  async runConcurrentRequests(requestFn, count = 10) {
    const promises = Array(count).fill().map(() => requestFn());
    return Promise.all(promises);
  },

  // Memory monitoring
  getMemoryUsage() {
    const used = process.memoryUsage();
    return {
      rss: used.rss / 1024 / 1024, // MB
      heapTotal: used.heapTotal / 1024 / 1024, // MB
      heapUsed: used.heapUsed / 1024 / 1024, // MB
      external: used.external / 1024 / 1024, // MB
    };
  },
};

module.exports = testUtils;
