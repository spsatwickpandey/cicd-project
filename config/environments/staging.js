module.exports = {
  app: {
    name: 'CI/CD Node.js API',
    version: '1.0.0',
    port: process.env.PORT || 3000,
    environment: 'staging',
  },
  database: {
    host: process.env.DB_HOST || 'staging-db.example.com',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'cicd_api_staging',
    user: process.env.DB_USER || 'staging_user',
    password: process.env.DB_PASSWORD || 'staging_password',
  },
  redis: {
    host: process.env.REDIS_HOST || 'staging-redis.example.com',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || 'staging_redis_password',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'staging-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 50, // Lower limit for staging
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://staging.example.com',
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
    paymentService: process.env.PAYMENT_SERVICE_URL || 'https://staging-payment.example.com',
    emailService: process.env.EMAIL_SERVICE_URL || 'https://staging-email.example.com',
  },
};
