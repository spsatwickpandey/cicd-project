module.exports = {
  app: {
    name: 'CI/CD Node.js API',
    version: '1.0.0',
    port: process.env.PORT || 3000,
    environment: 'production',
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET, // Must be set in production
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'warn',
    format: process.env.LOG_FORMAT || 'combined',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // Higher limit for production
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://example.com',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  security: {
    helmet: true, // Always enabled in production
    cors: true, // Always enabled in production
  },
  monitoring: {
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
    healthCheckTimeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 3000,
  },
  external: {
    paymentService: process.env.PAYMENT_SERVICE_URL,
    emailService: process.env.EMAIL_SERVICE_URL,
  },
};
