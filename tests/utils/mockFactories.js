// Mock factories for API responses and database interactions

class MockFactory {
  // User mocks
  static createUser(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 1000),
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createUserList(count = 5) {
    return Array.from({ length: count }, (_, index) =>
      this.createUser({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
      }),
    );
  }

  // Product mocks
  static createProduct(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 1000),
      name: 'Test Product',
      description: 'Test product description',
      price: 99.99,
      category: 'Test Category',
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createProductList(count = 5) {
    return Array.from({ length: count }, (_, index) =>
      this.createProduct({
        id: index + 1,
        name: `Product ${index + 1}`,
        price: (index + 1) * 10.99,
        category: index % 2 === 0 ? 'Electronics' : 'Kitchen',
      }),
    );
  }

  // API Response mocks
  static createApiResponse(data, success = true, message = null) {
    return {
      success,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static createErrorResponse(error, status = 400) {
    return {
      success: false,
      error,
      status,
      timestamp: new Date().toISOString(),
    };
  }

  static createPaginatedResponse(data, page = 1, limit = 10, total = 100) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Health check mocks
  static createHealthResponse() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'test',
      version: '1.0.0',
    };
  }

  static createDetailedHealthResponse() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'test',
      version: '1.0.0',
      memory: {
        used: 1024 * 1024 * 50, // 50MB
        total: 1024 * 1024 * 512, // 512MB
        external: 1024 * 1024 * 10, // 10MB
        rss: 1024 * 1024 * 100, // 100MB
      },
      system: {
        platform: 'linux',
        arch: 'x64',
        cpus: 4,
        loadAverage: [0.5, 0.3, 0.2],
        freeMemory: 1024 * 1024 * 1024 * 2, // 2GB
        totalMemory: 1024 * 1024 * 1024 * 8, // 8GB
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        title: 'node',
      },
    };
  }

  // Database interaction mocks
  static createDatabaseMock() {
    return {
      query: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      transaction: jest.fn(),
    };
  }

  static createUserRepositoryMock() {
    return {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    };
  }

  static createProductRepositoryMock() {
    return {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategory: jest.fn(),
      findInStock: jest.fn(),
    };
  }

  // Authentication mocks
  static createAuthToken(user = {}) {
    return {
      token: `mock-jwt-token-${user.id || 'default'}`,
      expiresIn: '24h',
      user: {
        id: user.id || 1,
        name: user.name || 'Test User',
        email: user.email || 'test@example.com',
        role: user.role || 'user',
      },
    };
  }

  static createAuthMiddlewareMock() {
    return jest.fn((req, res, next) => {
      req.user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      next();
    });
  }

  static createAdminMiddlewareMock() {
    return jest.fn((req, res, next) => {
      req.user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };
      next();
    });
  }

  // Error mocks
  static createValidationError(field, message) {
    return {
      name: 'ValidationError',
      message,
      field,
      code: 'VALIDATION_ERROR',
    };
  }

  static createNotFoundError(resource) {
    return {
      name: 'NotFoundError',
      message: `${resource} not found`,
      code: 'NOT_FOUND',
    };
  }

  static createUnauthorizedError() {
    return {
      name: 'UnauthorizedError',
      message: 'Unauthorized access',
      code: 'UNAUTHORIZED',
    };
  }

  static createForbiddenError() {
    return {
      name: 'ForbiddenError',
      message: 'Access forbidden',
      code: 'FORBIDDEN',
    };
  }

  // Performance mocks
  static createPerformanceMetrics() {
    return {
      responseTime: 150,
      memoryUsage: {
        heapUsed: 1024 * 1024 * 50,
        heapTotal: 1024 * 1024 * 512,
        external: 1024 * 1024 * 10,
        rss: 1024 * 1024 * 100,
      },
      cpuUsage: {
        user: 0.1,
        system: 0.05,
      },
    };
  }

  // Rate limiting mocks
  static createRateLimitInfo() {
    return {
      limit: 100,
      remaining: 95,
      reset: Date.now() + 900000,
      retryAfter: 0,
    };
  }

  // Logging mocks
  static createLogEntry(level = 'info', message = 'Test log message') {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId: `req-${Date.now()}`,
      userId: 1,
      ip: '127.0.0.1',
      userAgent: 'Jest/Test',
    };
  }
}

module.exports = MockFactory;
