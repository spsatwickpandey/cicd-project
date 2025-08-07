// No direct imports needed - using global testUtils

describe('Health Routes - Unit Tests', () => {
  let server;

  beforeAll(() => {
    server = global.testUtils.createTestServer();
  });

  afterAll(() => {
    // Cleanup
  });

  describe('GET /api/health', () => {
    it('should return basic health status with valid structure', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/health'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(response).toHaveValidResponseStructure();
      expect(duration).toBeWithinResponseTime(500);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });

    it('should return correct environment in test mode', async() => {
      const response = await server.get('/api/health');

      expect(response.body.environment).toBe('test');
    });

    it('should have valid timestamp format', async() => {
      const response = await server.get('/api/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should have valid uptime value', async() => {
      const response = await server.get('/api/health');

      expect(response.body.uptime).toBeGreaterThan(0);
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('GET /api/health/detailed', () => {
    it('should return detailed health information', async() => {
      const { response, duration } = await global.testUtils.performance.measureResponseTime(
        () => server.get('/api/health/detailed'),
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(1000);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('system');
      expect(response.body).toHaveProperty('process');

      // Memory validation
      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(response.body.memory).toHaveProperty('external');
      expect(response.body.memory).toHaveProperty('rss');
      expect(response.body.memory.used).toBeGreaterThan(0);
      expect(response.body.memory.total).toBeGreaterThan(0);

      // System validation
      expect(response.body.system).toHaveProperty('platform');
      expect(response.body.system).toHaveProperty('arch');
      expect(response.body.system).toHaveProperty('cpus');
      expect(response.body.system).toHaveProperty('loadAverage');
      expect(response.body.system).toHaveProperty('freeMemory');
      expect(response.body.system).toHaveProperty('totalMemory');

      // Process validation
      expect(response.body.process).toHaveProperty('pid');
      expect(response.body.process).toHaveProperty('nodeVersion');
      expect(response.body.process).toHaveProperty('title');
    });

    it('should have valid memory usage values', async() => {
      const response = await server.get('/api/health/detailed');

      const memory = response.body.memory;
      expect(memory.used).toBeLessThan(memory.total);
      expect(memory.external).toBeGreaterThanOrEqual(0);
      expect(memory.rss).toBeGreaterThan(0);
    });

    it('should have valid system information', async() => {
      const response = await server.get('/api/health/detailed');

      const system = response.body.system;
      expect(system.cpus).toBeGreaterThan(0);
      expect(system.freeMemory).toBeLessThanOrEqual(system.totalMemory);
      expect(Array.isArray(system.loadAverage)).toBe(true);
      expect(system.loadAverage).toHaveLength(3);
    });
  });

  describe('GET /api/health/ready', () => {
    it('should return readiness status', async() => {
      const response = await server.get('/api/health/ready');

      expect(response).toBeValidApiResponse(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ready');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle readiness check failure', async() => {
      // Mock a scenario where the service is not ready
      const originalHealthCheck = require('../../../src/routes/health');
      jest.spyOn(originalHealthCheck, 'checkReadiness').mockResolvedValue(false);

      const response = await server.get('/api/health/ready');

      expect(response.status).toBe(503);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('not ready');
    });
  });

  describe('GET /api/health/live', () => {
    it('should return liveness status', async() => {
      const response = await server.get('/api/health/live');

      expect(response).toBeValidApiResponse(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('alive');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle liveness check failure', async() => {
      // Mock a scenario where the service is not alive
      const originalHealthCheck = require('../../../src/routes/health');
      jest.spyOn(originalHealthCheck, 'checkLiveness').mockResolvedValue(false);

      const response = await server.get('/api/health/live');

      expect(response.status).toBe(503);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('not alive');
    });
  });

  describe('Performance Tests', () => {
    it('should respond within acceptable time limits', async() => {
      const promises = [
        server.get('/api/health'),
        server.get('/api/health/detailed'),
        server.get('/api/health/ready'),
        server.get('/api/health/live'),
      ];

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All endpoints should respond within 2 seconds total
      expect(totalTime).toBeLessThan(2000);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle concurrent health check requests', async() => {
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

      // Should handle concurrent requests efficiently
      expect(totalTime).toBeLessThan(1000);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async() => {
      const response = await server
        .post('/api/health')
        .send({ invalid: 'data' });

      expect(response.status).toBe(404);
    });

    it('should handle missing routes', async() => {
      const response = await server.get('/api/health/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Data Validation', () => {
    it('should return valid JSON response', async() => {
      const response = await server.get('/api/health');

      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(() => JSON.parse(JSON.stringify(response.body))).not.toThrow();
    });

    it('should have consistent response structure', async() => {
      const endpoints = ['', '/detailed', '/ready', '/live'];

      for (const endpoint of endpoints) {
        const response = await server.get(`/api/health${endpoint}`);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('timestamp');
        expect(typeof response.body.status).toBe('string');
        expect(typeof response.body.timestamp).toBe('string');
      }
    });
  });
});
