describe('Health Check Endpoints', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should return welcome message', () => {
    cy.request('GET', '/').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.eq('Welcome to CI/CD Node.js API');
      expect(response.body).to.have.property('version');
      expect(response.body).to.have.property('environment');
      expect(response.body).to.have.property('timestamp');
    });
  });

  it('should return basic health status', () => {
    cy.request('GET', '/api/health').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.eq('OK');
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('uptime');
      expect(response.body).to.have.property('environment');
    });
  });

  it('should return detailed health information', () => {
    cy.request('GET', '/api/health/detailed').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('memory');
      expect(response.body).to.have.property('system');
      expect(response.body).to.have.property('process');
      expect(response.body.memory).to.have.property('used');
      expect(response.body.memory).to.have.property('total');
      expect(response.body.system).to.have.property('platform');
      expect(response.body.system).to.have.property('cpus');
    });
  });

  it('should return readiness status', () => {
    cy.request('GET', '/api/health/ready').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.eq('ready');
      expect(response.body).to.have.property('timestamp');
    });
  });

  it('should return liveness status', () => {
    cy.request('GET', '/api/health/live').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.eq('alive');
      expect(response.body).to.have.property('timestamp');
    });
  });

  it('should return 404 for non-existent routes', () => {
    cy.request({
      method: 'GET',
      url: '/non-existent-route',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('Route not found');
      expect(response.body).to.have.property('path');
    });
  });
});
