// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import plugins
import 'cypress-file-upload';
import 'cypress-visual-regression/plugin';
import 'cypress-real-events/support';

// Import page objects
import LoginPage from './pages/LoginPage.js';

// Make page objects available globally
Cypress.LoginPage = LoginPage;

// Configure visual regression testing
Cypress.Commands.add('compareSnapshot', (name, options = {}) => {
  cy.compareSnapshot(name, options);
});

// Configure file upload
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = 'image/jpeg') => {
  cy.fixture(fileName).then((fileContent) => {
    cy.get(selector).attachFile({
      fileContent,
      fileName,
      mimeType: fileType,
    });
  });
});

// Configure real events for better interaction simulation
Cypress.Commands.add('realClick', { prevSubject: 'element' }, (subject, options = {}) => {
  return cy.wrap(subject).realClick(options);
});

Cypress.Commands.add('realType', { prevSubject: 'element' }, (subject, text, options = {}) => {
  return cy.wrap(subject).realType(text, options);
});

Cypress.Commands.add('realHover', { prevSubject: 'element' }, (subject, options = {}) => {
  return cy.wrap(subject).realHover(options);
});

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

// Configure retry logic for flaky tests
Cypress.Commands.add('retry', (fn, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        throw error;
      }
      cy.wait(1000); // Wait before retry
    }
  }
});

// Configure performance monitoring
Cypress.Commands.add('measurePerformance', (name, fn) => {
  const startTime = performance.now();

  return fn().then(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    cy.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);

    // Assert performance thresholds
    expect(duration).to.be.lessThan(5000); // 5 seconds max

    return duration;
  });
});

// Configure accessibility testing
Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Configure visual regression testing
Cypress.Commands.add('takeVisualSnapshot', (name, options = {}) => {
  return cy.compareSnapshot(name, {
    capture: 'viewport',
    ...options,
  });
});

// Configure API testing helpers
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.token;
  });
});

Cypress.Commands.add('apiCreateUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users`,
    body: userData,
  });
});

Cypress.Commands.add('apiCreateProduct', (productData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/products`,
    body: productData,
  });
});

// Configure test data management
Cypress.Commands.add('seedTestData', () => {
  cy.fixture('users').then((users) => {
    cy.fixture('products').then((products) => {
      // Seed users
      Object.values(users).forEach((user) => {
        if (user.email && user.password) {
          cy.apiCreateUser(user);
        }
      });

      // Seed products
      Object.values(products).forEach((product) => {
        if (product.name && product.price) {
          cy.apiCreateProduct(product);
        }
      });
    });
  });
});

// Configure cleanup
Cypress.Commands.add('cleanupTestData', () => {
  // Clean up test data after tests
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/test/cleanup`,
  });
});

// Global before each hook
beforeEach(() => {
  // Reset database state
  cy.dbReset();

  // Clear local storage
  cy.clearLocalStorage();

  // Clear session storage
  cy.clearSessionStorage();

  // Seed test data if needed
  if (Cypress.env('seedData')) {
    cy.seedTestData();
  }
});

// Global after each hook
afterEach(() => {
  // Clean up test data
  cy.cleanupTestData();
});

// Configure test retries for flaky tests
Cypress.Commands.add('retryOnFailure', (fn, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        throw error;
      }
      cy.wait(2000); // Wait longer before retry
    }
  }
});

// Configure mobile testing helpers
Cypress.Commands.add('testMobileView', () => {
  cy.viewport(375, 667); // iPhone SE
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('testTabletView', () => {
  cy.viewport(768, 1024); // iPad
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('testDesktopView', () => {
  cy.viewport(1280, 720); // Desktop
  cy.get('body').should('be.visible');
});

// Configure network stubbing helpers
Cypress.Commands.add('stubApiResponse', (method, url, response) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${url}`, response);
});

Cypress.Commands.add('stubNetworkError', (method, url) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${url}`, {
    statusCode: 500,
    body: { error: 'Internal Server Error' },
  });
});

// Configure form testing helpers
Cypress.Commands.add('fillFormAndSubmit', (formData, submitSelector = '[data-cy=submit-button]') => {
  cy.fillForm(formData);
  cy.get(submitSelector).click();
});

Cypress.Commands.add('validateFormSubmission', (expectedSuccess = true) => {
  if (expectedSuccess) {
    cy.get('[data-cy=success-message]').should('be.visible');
  } else {
    cy.get('[data-cy=error-message]').should('be.visible');
  }
});

// Configure element waiting helpers
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  return cy.get(selector, { timeout });
});

Cypress.Commands.add('waitForElementToDisappear', (selector, timeout = 10000) => {
  return cy.get(selector, { timeout }).should('not.exist');
});

// Configure assertion helpers
Cypress.Commands.add('assertElementVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

Cypress.Commands.add('assertElementNotVisible', (selector) => {
  cy.get(selector).should('not.be.visible');
});

Cypress.Commands.add('assertElementContains', (selector, text) => {
  cy.get(selector).should('contain', text);
});

Cypress.Commands.add('assertElementHasValue', (selector, value) => {
  cy.get(selector).should('have.value', value);
});

// Configure URL assertion helpers
Cypress.Commands.add('assertUrlContains', (path) => {
  cy.url().should('include', path);
});

Cypress.Commands.add('assertUrlEquals', (url) => {
  cy.url().should('eq', url);
});

// Configure API response assertion helpers
Cypress.Commands.add('assertApiResponse', (response, expectedStatus = 200) => {
  expect(response.status).to.eq(expectedStatus);
  expect(response.body).to.have.property('success');
});

Cypress.Commands.add('assertApiError', (response, expectedStatus = 400) => {
  expect(response.status).to.eq(expectedStatus);
  expect(response.body).to.have.property('error');
});

// Configure performance assertion helpers
Cypress.Commands.add('assertPageLoadTime', (maxTime = 3000) => {
  cy.window().then((win) => {
    const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
    expect(loadTime).to.be.lessThan(maxTime);
  });
});

// Configure visual regression assertion helpers
Cypress.Commands.add('assertVisualMatch', (name) => {
  cy.compareSnapshot(name);
});

// Configure accessibility assertion helpers
Cypress.Commands.add('assertAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Configure mobile responsiveness assertion helpers
Cypress.Commands.add('assertMobileResponsive', () => {
  cy.testMobileView();
  cy.get('[data-cy=mobile-menu]').should('be.visible');
});

Cypress.Commands.add('assertTabletResponsive', () => {
  cy.testTabletView();
  cy.get('[data-cy=tablet-layout]').should('be.visible');
});

Cypress.Commands.add('assertDesktopResponsive', () => {
  cy.testDesktopView();
  cy.get('[data-cy=desktop-layout]').should('be.visible');
});
