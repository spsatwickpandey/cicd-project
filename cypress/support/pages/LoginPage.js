import BasePage from './BasePage.js';

class LoginPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      emailInput: '[data-cy=email-input]',
      passwordInput: '[data-cy=password-input]',
      loginButton: '[data-cy=login-button]',
      forgotPasswordLink: '[data-cy=forgot-password-link]',
      registerLink: '[data-cy=register-link]',
      emailError: '[data-cy=email-error]',
      passwordError: '[data-cy=password-error]',
      generalError: '[data-cy=general-error]',
      loadingSpinner: '[data-cy=loading-spinner]',
      rememberMeCheckbox: '[data-cy=remember-me]',
      socialLoginButtons: {
        google: '[data-cy=google-login]',
        facebook: '[data-cy=facebook-login]',
        github: '[data-cy=github-login]',
      },
    };
  }

  // Navigation
  visit() {
    super.visit('/login');
    return this;
  }

  // Form interactions
  enterEmail(email) {
    this.type(this.selectors.emailInput, email);
    return this;
  }

  enterPassword(password) {
    this.type(this.selectors.passwordInput, password);
    return this;
  }

  clickLoginButton() {
    this.click(this.selectors.loginButton);
    return this;
  }

  checkRememberMe() {
    this.check(this.selectors.rememberMeCheckbox);
    return this;
  }

  uncheckRememberMe() {
    this.uncheck(this.selectors.rememberMeCheckbox);
    return this;
  }

  // Complete login flow
  login(email, password, rememberMe = false) {
    this.enterEmail(email);
    this.enterPassword(password);
    
    if (rememberMe) {
      this.checkRememberMe();
    }
    
    this.clickLoginButton();
    return this;
  }

  // Social login
  loginWithGoogle() {
    this.click(this.selectors.socialLoginButtons.google);
    return this;
  }

  loginWithFacebook() {
    this.click(this.selectors.socialLoginButtons.facebook);
    return this;
  }

  loginWithGithub() {
    this.click(this.selectors.socialLoginButtons.github);
    return this;
  }

  // Navigation to other pages
  goToForgotPassword() {
    this.click(this.selectors.forgotPasswordLink);
    return this;
  }

  goToRegister() {
    this.click(this.selectors.registerLink);
    return this;
  }

  // Validation methods
  shouldShowEmailError(message) {
    this.shouldShowError(this.selectors.emailError, message);
    return this;
  }

  shouldShowPasswordError(message) {
    this.shouldShowError(this.selectors.passwordError, message);
    return this;
  }

  shouldShowGeneralError(message) {
    this.shouldShowError(this.selectors.generalError, message);
    return this;
  }

  shouldNotShowEmailError() {
    this.shouldNotShowError(this.selectors.emailError);
    return this;
  }

  shouldNotShowPasswordError() {
    this.shouldNotShowError(this.selectors.passwordError);
    return this;
  }

  shouldNotShowGeneralError() {
    this.shouldNotShowError(this.selectors.generalError);
    return this;
  }

  // Loading state
  shouldShowLoadingSpinner() {
    this.shouldBeVisible(this.selectors.loadingSpinner);
    return this;
  }

  shouldHideLoadingSpinner() {
    this.shouldNotBeVisible(this.selectors.loadingSpinner);
    return this;
  }

  // Form validation
  validateEmptyForm() {
    this.clickLoginButton();
    this.shouldShowEmailError('Email is required');
    this.shouldShowPasswordError('Password is required');
    return this;
  }

  validateInvalidEmail(email) {
    this.enterEmail(email);
    this.clickLoginButton();
    this.shouldShowEmailError('Please enter a valid email');
    return this;
  }

  validateShortPassword(password) {
    this.enterPassword(password);
    this.clickLoginButton();
    this.shouldShowPasswordError('Password must be at least 6 characters');
    return this;
  }

  // Success validation
  shouldRedirectToDashboard() {
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/dashboard');
    return this;
  }

  shouldShowWelcomeMessage() {
    cy.get('[data-cy=welcome-message]').should('be.visible');
    return this;
  }

  // Accessibility
  shouldBeAccessible() {
    super.shouldBeAccessible();
    
    // Login-specific accessibility checks
    cy.get(this.selectors.emailInput).should('have.attr', 'aria-label', 'Email address');
    cy.get(this.selectors.passwordInput).should('have.attr', 'aria-label', 'Password');
    cy.get(this.selectors.loginButton).should('have.attr', 'aria-label', 'Sign in');
    
    return this;
  }

  // Visual regression testing
  takeLoginFormScreenshot() {
    this.takeElementScreenshot('[data-cy=login-form]', 'login-form');
    return this;
  }

  takeErrorStateScreenshot() {
    this.takeElementScreenshot('[data-cy=login-form]', 'login-form-with-errors');
    return this;
  }

  // Performance testing
  measureLoginPerformance() {
    const startTime = Date.now();
    
    this.login(Cypress.env('userEmail'), Cypress.env('userPassword'));
    
    cy.url().should('not.include', '/login').then(() => {
      const endTime = Date.now();
      const loginTime = endTime - startTime;
      
      // Assert login completes within 3 seconds
      expect(loginTime).to.be.lessThan(3000);
    });
    
    return this;
  }

  // Mobile responsive testing
  testMobileLogin() {
    this.setMobileViewport();
    this.visit();
    this.shouldBeAccessible();
    this.takeScreenshot('login-mobile');
    return this;
  }

  testTabletLogin() {
    this.setTabletViewport();
    this.visit();
    this.shouldBeAccessible();
    this.takeScreenshot('login-tablet');
    return this;
  }

  // API testing
  testLoginApi() {
    cy.apiPost('/auth/login', {
      email: Cypress.env('userEmail'),
      password: Cypress.env('userPassword'),
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('user');
    });
    
    return this;
  }

  testInvalidLoginApi() {
    cy.apiPost('/auth/login', {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('error');
    });
    
    return this;
  }

  // Security testing
  testPasswordVisibility() {
    this.enterPassword('testpassword');
    
    // Password should be hidden by default
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'password');
    
    // Toggle password visibility
    cy.get('[data-cy=password-toggle]').click();
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'text');
    
    return this;
  }

  testBruteForceProtection() {
    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      this.login('invalid@example.com', 'wrongpassword');
      this.shouldShowGeneralError('Invalid credentials');
    }
    
    // Should show rate limiting message
    this.shouldShowGeneralError('Too many failed attempts');
    
    return this;
  }

  // Remember me functionality
  testRememberMe() {
    this.login(Cypress.env('userEmail'), Cypress.env('userPassword'), true);
    this.shouldRedirectToDashboard();
    
    // Logout and login again
    cy.logout();
    this.visit();
    
    // Should be automatically logged in
    cy.url().should('not.include', '/login');
    
    return this;
  }

  // Social login testing
  testGoogleLogin() {
    this.loginWithGoogle();
    
    // Mock Google OAuth response
    cy.intercept('GET', '**/oauth/google**', {
      statusCode: 200,
      body: {
        token: 'mock-google-token',
        user: {
          id: 1,
          email: 'user@gmail.com',
          name: 'Google User',
        },
      },
    });
    
    this.shouldRedirectToDashboard();
    return this;
  }

  // Form persistence
  testFormPersistence() {
    const email = 'test@example.com';
    const password = 'testpassword';
    
    this.enterEmail(email);
    this.enterPassword(password);
    
    // Navigate away and back
    cy.visit('/');
    this.visit();
    
    // Form should be cleared (for security)
    cy.get(this.selectors.emailInput).should('have.value', '');
    cy.get(this.selectors.passwordInput).should('have.value', '');
    
    return this;
  }
}

export default LoginPage; 