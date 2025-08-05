const request = require('supertest');
const app = require('../../src/app');

describe('User Routes', () => {
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(typeof response.body.count).toBe('number');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID', async () => {
      const response = await request(app).get('/api/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('role');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.role).toBe(newUser.role);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidUser = {
        name: 'Test User',
        // Missing email
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for duplicate email', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: 'john@example.com', // Already exists
        role: 'user',
      };

      const response = await request(app)
        .post('/api/users')
        .send(duplicateUser);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/users/999')
        .send(updateData);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      const response = await request(app).delete('/api/users/2');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).delete('/api/users/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 