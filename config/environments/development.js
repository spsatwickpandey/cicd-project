module.exports = {
  app: {
    name: 'CI/CD Node.js API',
    version: '1.0.0',
    port: process.env.PORT || 3000,
    environment: 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'cicd_api_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'dev',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  security: {
    helmet: process.env.HELMET_ENABLED !== 'false',
    cors: process.env.CORS_ENABLED !== 'false',
  },
  monitoring: {
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
    healthCheckTimeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 3000,
  },
  external: {
    paymentService: process.env.PAYMENT_SERVICE_URL || 'https://api.payment.com',
    emailService: process.env.EMAIL_SERVICE_URL || 'https://api.email.com',
  },
};
