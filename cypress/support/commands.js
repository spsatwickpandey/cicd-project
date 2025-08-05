// ***********************************************
// Custom commands for common operations
// ***********************************************

// Authentication commands
Cypress.Commands.add('login', (email = Cypress.env('userEmail'), password = Cypress.env('userPassword')) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=login-button]').click();
    cy.url().should('not.include', '/login');
    cy.get('[data-cy=user-menu]').should('be.visible');
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('adminEmail'), Cypress.env('adminPassword'));
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=user-menu]').click();
  cy.get('[data-cy=logout-button]').click();
  cy.url().should('include', '/login');
});

// API commands
Cypress.Commands.add('apiRequest', (method, url, body = null, options = {}) => {
  const defaultOptions = {
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    ...defaultOptions,
    ...options,
  });
});

Cypress.Commands.add('apiGet', (url, options = {}) => {
  return cy.apiRequest('GET', url, null, options);
});

Cypress.Commands.add('apiPost', (url, body, options = {}) => {
  return cy.apiRequest('POST', url, body, options);
});

Cypress.Commands.add('apiPut', (url, body, options = {}) => {
  return cy.apiRequest('PUT', url, body, options);
});

Cypress.Commands.add('apiDelete', (url, options = {}) => {
  return cy.apiRequest('DELETE', url, null, options);
});

// Database commands
Cypress.Commands.add('dbSeed', (data) => {
  return cy.task('db:seed', data);
});

Cypress.Commands.add('dbClean', () => {
  return cy.task('db:clean');
});

Cypress.Commands.add('dbReset', () => {
  return cy.task('db:reset');
});

// Form commands
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`[data-cy=${field}]`).clear().type(value);
  });
});

Cypress.Commands.add('submitForm', (formSelector = '[data-cy=submit-button]') => {
  cy.get(formSelector).click();
});

Cypress.Commands.add('validateFormErrors', (expectedErrors) => {
  Object.entries(expectedErrors).forEach(([field, errorMessage]) => {
    cy.get(`[data-cy=${field}-error]`).should('contain', errorMessage);
  });
});

// File upload commands
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = 'image/jpeg') => {
  cy.fixture(fileName).then((fileContent) => {
    cy.get(selector).attachFile({
      fileContent,
      fileName,
      mimeType: fileType,
    });
  });
});

Cypress.Commands.add('downloadFile', (selector, fileName) => {
  cy.get(selector).click();
  cy.readFile(`cypress/downloads/${fileName}`).should('exist');
});

// Navigation commands
Cypress.Commands.add('navigateTo', (path) => {
  cy.visit(path);
  cy.waitForPageLoad();
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-cy=page-loaded]', { timeout: 10000 }).should('be.visible');
});

// Element interaction commands
Cypress.Commands.add('clickElement', (selector, options = {}) => {
  cy.get(selector, options).click();
});

Cypress.Commands.add('typeInField', (selector, text, options = {}) => {
  cy.get(selector, options).clear().type(text);
});

Cypress.Commands.add('selectOption', (selector, option, options = {}) => {
  cy.get(selector, options).select(option);
});

Cypress.Commands.add('checkCheckbox', (selector, options = {}) => {
  cy.get(selector, options).check();
});

Cypress.Commands.add('uncheckCheckbox', (selector, options = {}) => {
  cy.get(selector, options).uncheck();
});

// Validation commands
Cypress.Commands.add('assertElementVisible', (selector, options = {}) => {
  cy.get(selector, options).should('be.visible');
});

Cypress.Commands.add('assertElementNotVisible', (selector, options = {}) => {
  cy.get(selector, options).should('not.be.visible');
});

Cypress.Commands.add('assertElementContains', (selector, text, options = {}) => {
  cy.get(selector, options).should('contain', text);
});

Cypress.Commands.add('assertElementHasValue', (selector, value, options = {}) => {
  cy.get(selector, options).should('have.value', value);
});

// Mobile responsive commands
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667); // iPhone SE
});

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024); // iPad
});

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720); // Desktop
});

// Visual regression commands
Cypress.Commands.add('compareSnapshot', (name, options = {}) => {
  cy.compareSnapshot(name, options);
});

Cypress.Commands.add('compareSnapshotElement', (selector, name, options = {}) => {
  cy.get(selector).compareSnapshot(name, options);
});

// Performance commands
Cypress.Commands.add('measurePageLoad', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    };
  });
});

// Network commands
Cypress.Commands.add('interceptApiCall', (method, url, response) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${url}`, response);
});

Cypress.Commands.add('waitForApiCall', (method, url) => {
  cy.wait(`@${method.toLowerCase()}_${url.replace(/\//g, '_')}`);
});

// Data management commands
Cypress.Commands.add('createTestData', (type, data) => {
  switch (type) {
    case 'user':
      return cy.apiPost('/users', data);
    case 'product':
      return cy.apiPost('/products', data);
    default:
      throw new Error(`Unknown test data type: ${type}`);
  }
});

Cypress.Commands.add('cleanupTestData', (type, id) => {
  switch (type) {
    case 'user':
      return cy.apiDelete(`/users/${id}`);
    case 'product':
      return cy.apiDelete(`/products/${id}`);
    default:
      throw new Error(`Unknown test data type: ${type}`);
  }
});

// Utility commands
Cypress.Commands.add('generateRandomEmail', () => {
  return `test-${Date.now()}@example.com`;
});

Cypress.Commands.add('generateRandomString', (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
});

Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  return cy.get(selector, { timeout });
});

Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector).scrollIntoView();
});

// Override default commands
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  return originalFn(url, options).then(() => {
    // Wait for page to be ready
    cy.waitForPageLoad();
  });
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  return originalFn(element, text, { delay: 100, ...options });
});

// Error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

// Global before each hook
beforeEach(() => {
  // Reset database state
  cy.dbReset();
  
  // Clear local storage
  cy.clearLocalStorage();
  
  // Clear session storage
  cy.clearSessionStorage();
}); 