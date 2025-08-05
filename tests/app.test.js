const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Welcome to CI/CD Node.js API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/health', () => {
    it('should return basic health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });

    it('should return detailed health information', async () => {
      const response = await request(app).get('/api/health/detailed');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('system');
      expect(response.body).toHaveProperty('process');
      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(response.body.system).toHaveProperty('platform');
      expect(response.body.system).toHaveProperty('cpus');
    });

    it('should return readiness status', async () => {
      const response = await request(app).get('/api/health/ready');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ready');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return liveness status', async () => {
      const response = await request(app).get('/api/health/live');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('alive');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Route not found');
      expect(response.body).toHaveProperty('path');
    });
  });
}); 