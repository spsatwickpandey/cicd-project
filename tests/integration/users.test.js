const request = require('supertest');
const app = require('../../src/app');
const MockFactory = require('../utils/mockFactories');

describe('Users API - Integration Tests', () => {
  let server;
  let testUsers;
  let authToken;

  beforeAll(async () => {
    server = testUtils.createTestServer();
    
    // Seed test data
    testUsers = MockFactory.createUserList(5);
    await testUtils.database.seedUsers(testUsers);
    
    // Generate auth token
    authToken = testUtils.auth.generateToken(testUsers[0]);
  });

  afterAll(async () => {
    // Cleanup test data
    await testUtils.database.clearUsers();
  });

  beforeEach(async () => {
    // Reset test data before each test
    testUsers = MockFactory.createUserList(5);
    await testUtils.database.seedUsers(testUsers);
  });

  describe('GET /api/users', () => {
    it('should return all users with pagination', async () => {
      const { response, duration } = await testUtils.performance.measureResponseTime(
        () => server.get('/api/users')
      );

      expect(response).toBeValidApiResponse(200);
      expect(response).toHaveValidResponseStructure();
      expect(duration).toBeWithinResponseTime(500);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should handle pagination parameters', async () => {
      const response = await server.get('/api/users?page=1&limit=2');

      expect(response).toBeValidApiResponse(200);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should filter users by role', async () => {
      const response = await server.get('/api/users?role=admin');

      expect(response).toBeValidApiResponse(200);
      response.body.data.forEach(user => {
        expect(user.role).toBe('admin');
      });
    });

    it('should search users by name', async () => {
      const searchTerm = 'User 1';
      const response = await server.get(`/api/users?search=${searchTerm}`);

      expect(response).toBeValidApiResponse(200);
      response.body.data.forEach(user => {
        expect(user.name).toContain(searchTerm);
      });
    });

    it('should sort users by name', async () => {
      const response = await server.get('/api/users?sortBy=name&order=asc');

      expect(response).toBeValidApiResponse(200);
      const names = response.body.data.map(user => user.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID', async () => {
      const userId = 1;
      const { response, duration } = await testUtils.performance.measureResponseTime(
        () => server.get(`/api/users/${userId}`)
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(300);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('role');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await server.get('/api/users/999');

      expect(response).toHaveValidErrorResponse(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle invalid user ID format', async () => {
      const response = await server.get('/api/users/invalid-id');

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('Invalid user ID');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const newUser = MockFactory.createUser({
        name: 'Integration Test User',
        email: 'integration@test.com',
        role: 'user',
      });

      const { response, duration } = await testUtils.performance.measureResponseTime(
        () => server.post('/api/users').send(newUser)
      );

      expect(response).toBeValidApiResponse(201);
      expect(duration).toBeWithinResponseTime(500);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.role).toBe(newUser.role);
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        name: 'Test User',
        // Missing email
      };

      const response = await server.post('/api/users').send(invalidUser);

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('required');
    });

    it('should validate email format', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email',
        role: 'user',
      };

      const response = await server.post('/api/users').send(invalidUser);

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('email');
    });

    it('should prevent duplicate email addresses', async () => {
      const existingUser = testUsers[0];
      const duplicateUser = {
        name: 'Duplicate User',
        email: existingUser.email,
        role: 'user',
      };

      const response = await server.post('/api/users').send(duplicateUser);

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate role values', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'invalid-role',
      };

      const response = await server.post('/api/users').send(invalidUser);

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('role');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateData = {
        name: 'Updated User Name',
        email: 'updated@example.com',
      };

      const { response, duration } = await testUtils.performance.measureResponseTime(
        () => server.put(`/api/users/${userId}`).send(updateData)
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(500);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = { name: 'Updated Name' };
      const response = await server.put('/api/users/999').send(updateData);

      expect(response).toHaveValidErrorResponse(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should validate update data', async () => {
      const userId = 1;
      const invalidData = {
        email: 'invalid-email-format',
      };

      const response = await server.put(`/api/users/${userId}`).send(invalidData);

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('email');
    });

    it('should prevent email conflicts with other users', async () => {
      const userId = 1;
      const otherUser = testUsers[1];
      const updateData = {
        email: otherUser.email,
      };

      const response = await server.put(`/api/users/${userId}`).send(updateData);

      expect(response).toHaveValidErrorResponse(400);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const userId = 1;

      const { response, duration } = await testUtils.performance.measureResponseTime(
        () => server.delete(`/api/users/${userId}`)
      );

      expect(response).toBeValidApiResponse(200);
      expect(duration).toBeWithinResponseTime(300);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted');
      expect(response.body.data.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await server.delete('/api/users/999');

      expect(response).toHaveValidErrorResponse(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle cascade deletion', async () => {
      const userId = 1;

      // Delete user
      await server.delete(`/api/users/${userId}`);

      // Verify user is deleted
      const getResponse = await server.get(`/api/users/${userId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should require authentication for protected routes', async () => {
      const response = await server.get('/api/users/protected');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should allow access with valid token', async () => {
      const response = await server
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response).toBeValidApiResponse(200);
    });

    it('should reject invalid tokens', async () => {
      const response = await server
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid token');
    });

    it('should require admin role for certain operations', async () => {
      const regularUserToken = testUtils.auth.generateToken({
        id: 2,
        role: 'user',
      });

      const response = await server
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Forbidden');
    });
  });

  describe('Performance & Load Testing', () => {
    it('should handle bulk user creation', async () => {
      const bulkUsers = MockFactory.createUserList(10);
      const promises = bulkUsers.map(user =>
        server.post('/api/users').send(user)
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - start;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(5000);
    });

    it('should handle concurrent user operations', async () => {
      const userId = 1;
      const operations = [
        server.get(`/api/users/${userId}`),
        server.put(`/api/users/${userId}`).send({ name: 'Updated' }),
        server.get('/api/users'),
      ];

      const start = Date.now();
      const responses = await Promise.all(operations);
      const totalTime = Date.now() - start;

      // All operations should succeed
      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(300);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });

    it('should maintain performance under load', async () => {
      const loadTest = async (concurrentRequests) => {
        const promises = Array.from({ length: concurrentRequests }, () =>
          server.get('/api/users')
        );

        const start = Date.now();
        const responses = await Promise.all(promises);
        const totalTime = Date.now() - start;

        return {
          responses,
          totalTime,
          averageTime: totalTime / concurrentRequests,
        };
      };

      const results = await loadTest(20);

      // All requests should succeed
      results.responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Average response time should be reasonable
      expect(results.averageTime).toBeLessThan(100);
    });
  });

  describe('Data Validation & Sanitization', () => {
    it('should sanitize user input', async () => {
      const maliciousUser = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        role: 'user',
      };

      const response = await server.post('/api/users').send(maliciousUser);

      expect(response.status).toBe(201);
      expect(response.body.data.name).not.toContain('<script>');
    });

    it('should validate email uniqueness case-insensitively', async () => {
      const user1 = {
        name: 'User 1',
        email: 'TEST@example.com',
        role: 'user',
      };

      const user2 = {
        name: 'User 2',
        email: 'test@example.com',
        role: 'user',
      };

      await server.post('/api/users').send(user1);
      const response = await server.post('/api/users').send(user2);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should handle special characters in names', async () => {
      const specialUser = {
        name: 'José María O\'Connor-Smith',
        email: 'jose@example.com',
        role: 'user',
      };

      const response = await server.post('/api/users').send(specialUser);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(specialUser.name);
    });
  });
}); 