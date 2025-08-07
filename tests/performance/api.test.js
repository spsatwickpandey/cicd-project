// No direct imports needed - using global testUtils
const MockFactory = require('../utils/mockFactories');

describe('API Performance Tests', () => {
  let server;
  let testData;

  beforeAll(async() => {
    server = global.testUtils.createTestServer();

    // Prepare test data
    testData = {
      users: MockFactory.createUserList(50),
      products: MockFactory.createProductList(100),
    };

    // Seed test data
    await global.testUtils.database.seedUsers(testData.users);
    await global.testUtils.database.seedProducts(testData.products);
  });

  afterAll(async() => {
    // Cleanup test data
    await global.testUtils.database.clearUsers();
    await global.testUtils.database.clearProducts();
  });

  describe('Response Time Benchmarks', () => {
    it('should respond to health check within 100ms', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/health'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(100);
    });

    it('should respond to detailed health check within 200ms', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/health/detailed'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(200);
    });

    it('should list users within 300ms', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/users'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(300);
    });

    it('should list products within 400ms', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/products'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(400);
    });

    it('should get single user within 150ms', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/users/1'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(150);
    });

    it('should get single product within 150ms', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/products/1'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(150);
    });
  });

  describe('Load Testing', () => {
    it('should handle 10 concurrent health check requests', async() => {
      const concurrentRequests = 10;
      const promises = Array.from({ length: concurrentRequests }, () =>
        server.get('/api/health'),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
      });

      // Should complete within 1 second
      expect(totalTime).toBeLessThan(1000);
    });

    it('should handle 20 concurrent user list requests', async() => {
      const concurrentRequests = 20;
      const promises = Array.from({ length: concurrentRequests }, () =>
        server.get('/api/users'),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Should complete within 2 seconds
      expect(totalTime).toBeLessThan(2000);
    });

    it('should handle 15 concurrent product list requests', async() => {
      const concurrentRequests = 15;
      const promises = Array.from({ length: concurrentRequests }, () =>
        server.get('/api/products'),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Should complete within 2 seconds
      expect(totalTime).toBeLessThan(2000);
    });

    it('should handle mixed concurrent requests', async() => {
      const requests = [
        server.get('/api/health'),
        server.get('/api/users'),
        server.get('/api/products'),
        server.get('/api/users/1'),
        server.get('/api/products/1'),
        server.get('/api/health/detailed'),
      ];

      const start = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(300);
      });

      // Should complete within 1.5 seconds
      expect(totalTime).toBeLessThan(1500);
    });
  });

  describe('Stress Testing', () => {
    it('should maintain performance under sustained load', async() => {
      const iterations = 5;
      const requestsPerIteration = 10;
      const results = [];

      for (let i = 0; i < iterations; i++) {
        const promises = Array.from({ length: requestsPerIteration }, () =>
          server.get('/api/health'),
        );

        const start = Date.now();
        const responses = await Promise.all(promises);
        const duration = Date.now() - start;

        results.push({
          iteration: i + 1,
          duration,
          averageTime: duration / requestsPerIteration,
          successCount: responses.filter(r => r.status === 200).length,
        });

        // Small delay between iterations
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // All iterations should succeed
      results.forEach(result => {
        expect(result.successCount).toBe(requestsPerIteration);
        expect(result.averageTime).toBeLessThan(50); // 50ms average per request
      });

      // Performance should not degrade significantly
      const firstIteration = results[0];
      const lastIteration = results[results.length - 1];
      const performanceDegradation = (lastIteration.averageTime - firstIteration.averageTime) / firstIteration.averageTime;

      expect(performanceDegradation).toBeLessThan(0.5); // Less than 50% degradation
    });

    it('should handle burst requests without failure', async() => {
      const burstSize = 30;
      const promises = Array.from({ length: burstSize }, () =>
        server.get('/api/users'),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      const successCount = responses.filter(r => r.status === 200).length;
      expect(successCount).toBe(burstSize);

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(3000);
    });
  });

  describe('Memory Usage Monitoring', () => {
    it('should not leak memory during repeated requests', async() => {
      const initialMemory = process.memoryUsage();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        await server.get('/api/health');
        await server.get('/api/users');
        await server.get('/api/products');
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncreaseMB).toBeLessThan(50);
    });

    it('should handle large response payloads efficiently', async() => {
      const largeProductList = MockFactory.createProductList(1000);
      await global.testUtils.database.seedProducts(largeProductList);

      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/products'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(duration).toBeWithinResponseTime(2000); // Allow more time for large payload

      // Cleanup
      await global.testUtils.database.clearProducts();
    });
  });

  describe('Database Performance', () => {
    it('should handle complex queries efficiently', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/products?category=Electronics&inStock=true&sortBy=price&order=desc'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(500);
    });

    it('should handle pagination efficiently', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/products?page=1&limit=10'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(300);
    });

    it('should handle search queries efficiently', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/products?search=laptop'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(400);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors efficiently', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/users/999999'),
      );

      expect(response).toHaveValidErrorResponse(404);
      expect(duration).toBeWithinResponseTime(200);
    });

    it('should handle validation errors efficiently', async() => {
      const invalidUser = { name: 'Test' }; // Missing email

      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.post('/api/users').send(invalidUser),
      );

      expect(response).toHaveValidErrorResponse(400);
      expect(duration).toBeWithinResponseTime(200);
    });
  });

  describe('Concurrent Write Operations', () => {
    it('should handle concurrent user creation', async() => {
      const newUsers = MockFactory.createUserList(5).map(user => ({
        name: user.name,
        email: `concurrent-${Date.now()}-${user.id}@test.com`,
        role: 'user',
      }));

      const promises = newUsers.map(user =>
        server.post('/api/users').send(user),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });

    it('should handle concurrent product creation', async() => {
      const newProducts = MockFactory.createProductList(5).map(product => ({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        inStock: product.inStock,
      }));

      const promises = newProducts.map(product =>
        server.post('/api/products').send(product),
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });
  });

  describe('Performance Regression Testing', () => {
    it('should maintain consistent performance across multiple runs', async() => {
      const runs = 5;
      const results = [];

      for (let i = 0; i < runs; i++) {
        const { response, duration } = await global.testUtils.performance.measureResponseTime(
          () => server.get('/api/health'),
        );

        results.push({
          run: i + 1,
          duration,
          status: response.status,
        });

        // Small delay between runs
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // All runs should succeed
      results.forEach(result => {
        expect(result.status).toBe(200);
      });

      // Performance should be consistent (within 20% variance)
      const durations = results.map(r => r.duration);
      const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const variance = durations.map(d => Math.abs(d - averageDuration) / averageDuration);

      variance.forEach(v => {
        expect(v).toBeLessThan(0.2); // Less than 20% variance
      });
    });
  });
});
