// No direct imports needed - using global testUtils
const app = require('../../../src/app');
const MockFactory = require('../../utils/mockFactories');

describe('Error Handler Middleware - Unit Tests', () => {
  let server;

  beforeAll(() => {
    server = global.testUtils.createTestServer();
  });

  describe('Validation Errors', () => {
    it('should handle validation errors with proper structure', async() => {

      // Mock a route that throws validation error
      const testRoute = (req, res, next) => {
        const error = new Error('Validation failed');
        error.name = 'ValidationError';
        error.field = 'email';
        error.message = 'Invalid email format';
        next(error);
      };

      // Temporarily add test route
      app.use('/test-validation', testRoute);

      const response = await server.get('/test-validation');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Validation failed');
    });

    it('should handle multiple validation errors', async() => {
      const multipleErrors = [
        MockFactory.createValidationError('email', 'Invalid email format'),
        MockFactory.createValidationError('name', 'Name is required'),
      ];

      const testRoute = (req, res, next) => {
        const error = new Error('Multiple validation errors');
        error.name = 'ValidationError';
        error.errors = multipleErrors;
        next(error);
      };

      app.use('/test-multiple-validation', testRoute);

      const response = await server.get('/test-multiple-validation');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Multiple validation errors');
    });
  });

  describe('Authentication Errors', () => {
    it('should handle unauthorized access errors', async() => {

      const testRoute = (req, res, next) => {
        const error = new Error('Unauthorized access');
        error.name = 'UnauthorizedError';
        error.code = 'UNAUTHORIZED';
        next(error);
      };

      app.use('/test-unauthorized', testRoute);

      const response = await server.get('/test-unauthorized');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Unauthorized access');
    });

    it('should handle forbidden access errors', async() => {

      const testRoute = (req, res, next) => {
        const error = new Error('Access forbidden');
        error.name = 'ForbiddenError';
        error.code = 'FORBIDDEN';
        next(error);
      };

      app.use('/test-forbidden', testRoute);

      const response = await server.get('/test-forbidden');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Access forbidden');
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Database connection failed');
        error.name = 'DatabaseError';
        error.code = 'DB_CONNECTION_ERROR';
        next(error);
      };

      app.use('/test-db-error', testRoute);

      const response = await server.get('/test-db-error');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Database connection failed');
    });

    it('should handle database query errors', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Query execution failed');
        error.name = 'DatabaseError';
        error.code = 'DB_QUERY_ERROR';
        error.sql = 'SELECT * FROM users WHERE id = ?';
        next(error);
      };

      app.use('/test-query-error', testRoute);

      const response = await server.get('/test-query-error');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Query execution failed');
    });
  });

  describe('Not Found Errors', () => {
    it('should handle resource not found errors', async() => {

      const testRoute = (req, res, next) => {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        error.code = 'NOT_FOUND';
        error.resource = 'User';
        next(error);
      };

      app.use('/test-not-found', testRoute);

      const response = await server.get('/test-not-found');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('User not found');
    });
  });

  describe('Rate Limiting Errors', () => {
    it('should handle rate limiting errors', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Too many requests');
        error.name = 'RateLimitError';
        error.code = 'RATE_LIMIT_EXCEEDED';
        error.retryAfter = 60;
        next(error);
      };

      app.use('/test-rate-limit', testRoute);

      const response = await server.get('/test-rate-limit');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Too many requests');
    });
  });

  describe('Generic Error Handling', () => {
    it('should handle unknown errors gracefully', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Unknown error occurred');
        next(error);
      };

      app.use('/test-unknown-error', testRoute);

      const response = await server.get('/test-unknown-error');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Something went wrong!');
    });

    it('should include error details in development mode', async() => {
      // Temporarily set NODE_ENV to development
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const testRoute = (req, res, next) => {
        const error = new Error('Development error');
        next(error);
      };

      app.use('/test-dev-error', testRoute);

      const response = await server.get('/test-dev-error');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Development error');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle errors without stack traces in production', async() => {
      // Temporarily set NODE_ENV to production
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const testRoute = (req, res, next) => {
        const error = new Error('Production error');
        next(error);
      };

      app.use('/test-prod-error', testRoute);

      const response = await server.get('/test-prod-error');

      expect(response).toHaveValidErrorResponse(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Internal server error');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Response Structure', () => {
    it('should maintain consistent error response structure', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Test error');
        error.code = 'TEST_ERROR';
        next(error);
      };

      app.use('/test-error-structure', testRoute);

      const response = await server.get('/test-error-structure');

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should include request ID in error responses', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Error with request ID');
        next(error);
      };

      app.use('/test-request-id', testRoute);

      const response = await server.get('/test-request-id');

      expect(response.body).toHaveProperty('requestId');
      expect(typeof response.body.requestId).toBe('string');
      expect(response.body.requestId.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Under Error Conditions', () => {
    it('should handle errors within acceptable time limits', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Performance test error');
        next(error);
      };

      app.use('/test-error-performance', testRoute);

      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/test-error-performance'),
      );

      expect(response).toHaveValidErrorResponse(500);
      expect(duration).toBeWithinResponseTime(1000);
    });

    it('should handle multiple concurrent errors', async() => {
      const testRoute = (req, res, next) => {
        const error = new Error('Concurrent error');
        next(error);
      };

      app.use('/test-concurrent-errors', testRoute);

      const promises = Array.from({ length: 5 }, () =>
        server.get('/test-concurrent-errors'),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All responses should be error responses
      responses.forEach(response => {
        expect(response).toHaveValidErrorResponse(500);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });
  });

  describe('Error Logging', () => {
    it('should log errors appropriately', async() => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const testRoute = (req, res, next) => {
        const error = new Error('Logged error');
        next(error);
      };

      app.use('/test-error-logging', testRoute);

      await server.get('/test-error-logging');

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('Logged error');

      consoleSpy.mockRestore();
    });

    it('should not log sensitive information', async() => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const testRoute = (req, res, next) => {
        const error = new Error('Error with password');
        error.password = 'secret123';
        next(error);
      };

      app.use('/test-sensitive-error', testRoute);

      await server.get('/test-sensitive-error');

      expect(consoleSpy).toHaveBeenCalled();
      const loggedMessage = consoleSpy.mock.calls[0][0];
      expect(loggedMessage).not.toContain('secret123');

      consoleSpy.mockRestore();
    });
  });
});
