module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/server.js',
    '!**/*.config.js',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/__tests__/**',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/routes/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/middleware/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json',
    'json-summary',
  ],
  
  // Test reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: './test-results',
        filename: 'test-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'Test Report',
      },
    ],
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js',
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Module name mapping for mocks
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@utils/(.*)$': '<rootDir>/tests/utils/$1',
  },
  
  // Global test variables
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/__tests__/',
    '/coverage/',
    '/test-results/',
  ],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/test-results/',
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(express|supertest)/)',
  ],
  
  // Environment variables for tests
  setupFiles: [
    '<rootDir>/tests/setup/env.setup.js',
  ],
}; 