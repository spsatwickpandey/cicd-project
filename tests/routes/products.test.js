const request = require('supertest');
const app = require('../../src/app');

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('total');
    });

    it('should filter products by category', async () => {
      const response = await request(app).get('/api/products?category=Electronics');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(product => 
        product.category.toLowerCase().includes('electronics')
      )).toBe(true);
    });

    it('should filter products by stock status', async () => {
      const response = await request(app).get('/api/products?inStock=true');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(product => product.inStock === true)).toBe(true);
    });

    it('should sort products by price in descending order', async () => {
      const response = await request(app).get('/api/products?sortBy=price&order=desc');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const prices = response.body.data.map(product => product.price);
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by ID', async () => {
      const response = await request(app).get('/api/products/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('price');
      expect(response.body.data).toHaveProperty('category');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/products/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        category: 'Test Category',
        inStock: true,
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newProduct.name);
      expect(response.body.data.price).toBe(newProduct.price);
      expect(response.body.data.category).toBe(newProduct.category);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidProduct = {
        name: 'Test Product',
        // Missing description, price, category
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid price', async () => {
      const invalidProduct = {
        name: 'Test Product',
        description: 'Test description',
        price: -10, // Invalid negative price
        category: 'Test Category',
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 199.99,
      };

      const response = await request(app)
        .put('/api/products/1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
    });

    it('should return 404 for non-existent product', async () => {
      const updateData = {
        name: 'Updated Product',
      };

      const response = await request(app)
        .put('/api/products/999')
        .send(updateData);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid price update', async () => {
      const updateData = {
        price: -50, // Invalid negative price
      };

      const response = await request(app)
        .put('/api/products/1')
        .send(updateData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product', async () => {
      const response = await request(app).delete('/api/products/3');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Product deleted successfully');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).delete('/api/products/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/products/category/:category', () => {
    it('should return products by category', async () => {
      const response = await request(app).get('/api/products/category/Electronics');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('category');
      expect(response.body.category).toBe('Electronics');
      expect(response.body.data.every(product => 
        product.category.toLowerCase() === 'electronics'
      )).toBe(true);
    });

    it('should return empty array for non-existent category', async () => {
      const response = await request(app).get('/api/products/category/NonExistent');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });
  });
}); 