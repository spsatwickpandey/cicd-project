const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Global configuration
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        // Custom tasks for database operations
        'db:seed': (data) => {
          // Database seeding task
          return null;
        },
        'db:clean': () => {
          // Database cleanup task
          return null;
        },
        'db:reset': () => {
          // Database reset task
          return null;
        },
      });

      // Visual regression testing
      on('after:screenshot', (details) => {
        // Handle screenshot comparison
        return details;
      });

      // Video processing
      on('after:spec', (spec, results) => {
        // Process test results
        return results;
      });
    },
  },

  // Component testing configuration
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },

  // Environment-specific configurations
  env: {
    // Default environment variables
    apiUrl: 'http://localhost:3000/api',
    adminEmail: 'admin@example.com',
    adminPassword: 'admin123',
    userEmail: 'user@example.com',
    userPassword: 'user123',
  },

  // Parallel execution configuration
  parallel: true,
  numTestsKeptInMemory: 10,

  // Visual testing configuration
  visualRegressionType: 'regression',
  visualRegressionBaseDirectory: 'cypress/visual-regression/base',
  visualRegressionDiffDirectory: 'cypress/visual-regression/diff',
  visualRegressionScreenshotDirectory: 'cypress/visual-regression/screenshots',

  // Test reporting
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, mocha-junit-reporter, cypress-mochawesome-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/results/results-[hash].xml',
      toConsole: true,
    },
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
      reportPageTitle: 'Cypress Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
  },

  // Screenshot and video configuration
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  trashAssetsBeforeRuns: true,

  // Performance monitoring
  experimentalMemoryManagement: true,
  experimentalModifyObstructiveThirdPartyCode: true,

  // Network stubbing
  experimentalNetworkStubbing: true,
}); 