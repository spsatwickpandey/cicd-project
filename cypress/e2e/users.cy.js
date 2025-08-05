describe('User Management API', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should get all users', () => {
    cy.request('GET', '/api/users').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('data');
      expect(Array.isArray(response.body.data)).to.eq(true);
      expect(response.body).to.have.property('count');
      expect(typeof response.body.count).to.eq('number');
    });
  });

  it('should get user by ID', () => {
    cy.request('GET', '/api/users/1').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('id');
      expect(response.body.data).to.have.property('name');
      expect(response.body.data).to.have.property('email');
      expect(response.body.data).to.have.property('role');
    });
  });

  it('should return 404 for non-existent user', () => {
    cy.request({
      method: 'GET',
      url: '/api/users/999',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(false);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('User not found');
    });
  });

  it('should create a new user', () => {
    const newUser = {
      name: 'Cypress Test User',
      email: 'cypress@test.com',
      role: 'user',
    };

    cy.request('POST', '/api/users', newUser).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('id');
      expect(response.body.data.name).to.eq(newUser.name);
      expect(response.body.data.email).to.eq(newUser.email);
      expect(response.body.data.role).to.eq(newUser.role);
    });
  });

  it('should return 400 for missing required fields', () => {
    const invalidUser = {
      name: 'Test User',
      // Missing email
    };

    cy.request({
      method: 'POST',
      url: '/api/users',
      body: invalidUser,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(false);
      expect(response.body).to.have.property('error');
    });
  });

  it('should update an existing user', () => {
    const updateData = {
      name: 'Updated Cypress User',
      email: 'updated@cypress.com',
    };

    cy.request('PUT', '/api/users/1', updateData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('data');
      expect(response.body.data.name).to.eq(updateData.name);
      expect(response.body.data.email).to.eq(updateData.email);
    });
  });

  it('should delete an existing user', () => {
    cy.request('DELETE', '/api/users/2').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('data');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.eq('User deleted successfully');
    });
  });
}); 