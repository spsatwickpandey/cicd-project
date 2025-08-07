// Environment setup for tests
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.LOG_LEVEL = 'error';

// Mock environment variables for testing
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.REDIS_PASSWORD = '';

// API configuration
process.env.API_VERSION = 'v1';
process.env.API_PREFIX = '/api';

// Rate limiting
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';

// CORS configuration
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.CORS_CREDENTIALS = 'true';

// Security configuration
process.env.HELMET_ENABLED = 'true';
process.env.CORS_ENABLED = 'true';

// Monitoring configuration
process.env.HEALTH_CHECK_INTERVAL = '30000';
process.env.HEALTH_CHECK_TIMEOUT = '3000';

// External services (mocked for tests)
process.env.PAYMENT_SERVICE_URL = 'https://mock-payment.example.com';
process.env.EMAIL_SERVICE_URL = 'https://mock-email.example.com';
