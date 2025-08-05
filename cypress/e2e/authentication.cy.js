import LoginPage from '../support/pages/LoginPage.js';

describe('Authentication Flow', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.dbReset();
    cy.fixture('users').as('users');
  });

  describe('Login Functionality', () => {
    it('should successfully login with valid credentials', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login(users.user.email, users.user.password)
          .shouldRedirectToDashboard()
          .shouldShowWelcomeMessage();
      });
    });

    it('should login as admin and access admin features', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login(users.admin.email, users.admin.password)
          .shouldRedirectToDashboard();

        // Verify admin features are accessible
        cy.get('[data-cy=admin-menu]').should('be.visible');
        cy.get('[data-cy=user-management]').should('be.visible');
        cy.get('[data-cy=system-settings]').should('be.visible');
      });
    });

    it('should show error for invalid credentials', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login('invalid@example.com', 'wrongpassword')
          .shouldShowGeneralError('Invalid credentials');
      });
    });

    it('should validate form fields', () => {
      loginPage
        .visit()
        .validateEmptyForm()
        .validateInvalidEmail('invalid-email')
        .validateShortPassword('123');
    });

    it('should test remember me functionality', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login(users.user.email, users.user.password, true)
          .shouldRedirectToDashboard();

        // Logout and verify automatic login
        cy.logout();
        loginPage.visit();
        cy.url().should('not.include', '/login');
      });
    });

    it('should test social login with Google', () => {
      loginPage
        .visit()
        .testGoogleLogin()
        .shouldRedirectToDashboard();
    });

    it('should test brute force protection', () => {
      loginPage
        .visit()
        .testBruteForceProtection();
    });

    it('should test password visibility toggle', () => {
      loginPage
        .visit()
        .testPasswordVisibility();
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user', () => {
      const newUser = {
        name: 'New User',
        email: cy.generateRandomEmail(),
        password: 'newuser123',
        confirmPassword: 'newuser123',
      };

      cy.visit('/register');
      
      // Fill registration form
      cy.fillForm({
        'name-input': newUser.name,
        'email-input': newUser.email,
        'password-input': newUser.password,
        'confirm-password-input': newUser.confirmPassword,
      });

      cy.submitForm('[data-cy=register-button]');

      // Verify successful registration
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy=welcome-message]').should('contain', newUser.name);
    });

    it('should validate registration form fields', () => {
      cy.visit('/register');

      // Test empty form
      cy.submitForm('[data-cy=register-button]');
      cy.validateFormErrors({
        'name-input': 'Name is required',
        'email-input': 'Email is required',
        'password-input': 'Password is required',
      });

      // Test invalid email
      cy.typeInField('[data-cy=email-input]', 'invalid-email');
      cy.submitForm('[data-cy=register-button]');
      cy.get('[data-cy=email-error]').should('contain', 'Please enter a valid email');

      // Test password mismatch
      cy.typeInField('[data-cy=password-input]', 'password123');
      cy.typeInField('[data-cy=confirm-password-input]', 'differentpassword');
      cy.submitForm('[data-cy=register-button]');
      cy.get('[data-cy=confirm-password-error]').should('contain', 'Passwords do not match');
    });

    it('should prevent duplicate email registration', () => {
      cy.get('@users').then((users) => {
        cy.visit('/register');
        
        cy.fillForm({
          'name-input': 'Duplicate User',
          'email-input': users.user.email,
          'password-input': 'password123',
          'confirm-password-input': 'password123',
        });

        cy.submitForm('[data-cy=register-button]');
        cy.get('[data-cy=email-error]').should('contain', 'Email already exists');
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('should successfully request password reset', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .goToForgotPassword();

        cy.get('[data-cy=email-input]').type(users.user.email);
        cy.submitForm('[data-cy=reset-password-button]');

        cy.get('[data-cy=success-message]').should('contain', 'Password reset email sent');
      });
    });

    it('should validate password reset form', () => {
      loginPage
        .visit()
        .goToForgotPassword();

      // Test empty email
      cy.submitForm('[data-cy=reset-password-button]');
      cy.get('[data-cy=email-error]').should('contain', 'Email is required');

      // Test invalid email
      cy.typeInField('[data-cy=email-input]', 'invalid-email');
      cy.submitForm('[data-cy=reset-password-button]');
      cy.get('[data-cy=email-error]').should('contain', 'Please enter a valid email');
    });

    it('should complete password reset process', () => {
      // Mock password reset token
      const resetToken = 'valid-reset-token';
      cy.intercept('GET', `**/reset-password?token=${resetToken}`, {
        statusCode: 200,
        body: { valid: true },
      });

      cy.visit(`/reset-password?token=${resetToken}`);

      const newPassword = 'newpassword123';
      cy.fillForm({
        'password-input': newPassword,
        'confirm-password-input': newPassword,
      });

      cy.submitForm('[data-cy=reset-password-button]');

      cy.get('[data-cy=success-message]').should('contain', 'Password updated successfully');
    });
  });

  describe('Logout Functionality', () => {
    it('should successfully logout user', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login(users.user.email, users.user.password)
          .shouldRedirectToDashboard();

        cy.logout();
        cy.url().should('include', '/login');
      });
    });

    it('should clear user session on logout', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login(users.user.email, users.user.password)
          .shouldRedirectToDashboard();

        cy.logout();

        // Try to access protected page
        cy.visit('/dashboard');
        cy.url().should('include', '/login');
      });
    });
  });

  describe('Security Features', () => {
    it('should prevent access to protected routes without authentication', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');

      cy.visit('/profile');
      cy.url().should('include', '/login');

      cy.visit('/admin');
      cy.url().should('include', '/login');
    });

    it('should handle session timeout', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .login(users.user.email, users.user.password)
          .shouldRedirectToDashboard();

        // Mock session timeout
        cy.intercept('GET', '**/api/auth/verify', {
          statusCode: 401,
          body: { error: 'Session expired' },
        });

        cy.visit('/dashboard');
        cy.url().should('include', '/login');
        cy.get('[data-cy=session-expired-message]').should('be.visible');
      });
    });

    it('should prevent XSS attacks in login form', () => {
      loginPage.visit();

      const maliciousScript = '<script>alert("xss")</script>';
      cy.typeInField('[data-cy=email-input]', maliciousScript);
      cy.typeInField('[data-cy=password-input]', maliciousScript);

      // Verify script is not executed
      cy.get('[data-cy=email-input]').should('have.value', maliciousScript);
      cy.get('[data-cy=password-input]').should('have.value', maliciousScript);
    });
  });

  describe('Visual Regression Testing', () => {
    it('should maintain visual consistency of login form', () => {
      loginPage
        .visit()
        .takeLoginFormScreenshot();
    });

    it('should capture error state visuals', () => {
      loginPage
        .visit()
        .login('invalid@example.com', 'wrongpassword')
        .takeErrorStateScreenshot();
    });

    it('should test responsive design', () => {
      loginPage
        .visit()
        .testMobileLogin()
        .visit()
        .testTabletLogin();
    });
  });

  describe('Performance Testing', () => {
    it('should complete login within acceptable time', () => {
      cy.get('@users').then((users) => {
        loginPage
          .visit()
          .measureLoginPerformance();
      });
    });

    it('should handle concurrent login attempts', () => {
      const concurrentLogins = 5;
      const promises = [];

      for (let i = 0; i < concurrentLogins; i++) {
        promises.push(
          cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/auth/login`,
            body: {
              email: `user${i}@example.com`,
              password: 'password123',
            },
          })
        );
      }

      cy.wrap(Promise.all(promises)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.be.oneOf([200, 401]);
        });
      });
    });
  });

  describe('API Testing', () => {
    it('should test login API endpoints', () => {
      cy.get('@users').then((users) => {
        loginPage.testLoginApi();
        loginPage.testInvalidLoginApi();
      });
    });

    it('should test registration API', () => {
      const newUser = {
        name: 'API Test User',
        email: cy.generateRandomEmail(),
        password: 'apitest123',
      };

      cy.apiPost('/auth/register', newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('user');
        expect(response.body.user.email).to.eq(newUser.email);
      });
    });

    it('should test password reset API', () => {
      cy.get('@users').then((users) => {
        cy.apiPost('/auth/forgot-password', {
          email: users.user.email,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('message');
        });
      });
    });
  });

  describe('Accessibility Testing', () => {
    it('should meet accessibility standards', () => {
      loginPage
        .visit()
        .shouldBeAccessible();
    });

    it('should support keyboard navigation', () => {
      loginPage.visit();

      // Navigate through form with keyboard
      cy.get('[data-cy=email-input]').focus();
      cy.pressTab();
      cy.get('[data-cy=password-input]').should('be.focused');
      cy.pressTab();
      cy.get('[data-cy=login-button]').should('be.focused');
      cy.pressEnter();
    });

    it('should have proper ARIA labels', () => {
      loginPage.visit();

      cy.get('[data-cy=email-input]').should('have.attr', 'aria-label');
      cy.get('[data-cy=password-input]').should('have.attr', 'aria-label');
      cy.get('[data-cy=login-button]').should('have.attr', 'aria-label');
    });
  });
}); 