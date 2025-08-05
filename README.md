# CI/CD Node.js API

[![Build Status](https://github.com/your-username/cicd-nodejs-api/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/cicd-nodejs-api/actions)
[![Test Coverage](https://codecov.io/gh/your-username/cicd-nodejs-api/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/cicd-nodejs-api)
[![Code Quality](https://img.shields.io/badge/code%20quality-A%2B-brightgreen)](https://github.com/your-username/cicd-nodejs-api)
[![Security](https://img.shields.io/badge/security-A%2B-brightgreen)](https://github.com/your-username/cicd-nodejs-api)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://hub.docker.com/r/your-username/cicd-nodejs-api)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A complete Node.js API project with comprehensive CI/CD pipeline setup, including Express.js API, Jest testing, ESLint configuration, Docker containerization, and GitHub Actions workflows.

## 🚀 Features

- **Express.js API** with health check endpoints
- **Jest unit testing** with coverage reporting
- **ESLint configuration** with strict rules
- **Prettier code formatting**
- **Docker containerization** with multi-stage builds
- **GitHub Actions CI/CD pipeline**
- **Environment-specific configurations**
- **Comprehensive API documentation**
- **Security best practices**

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- Docker (optional)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cicd-nodejs-api.git
   cd cicd-nodejs-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests for CI
```bash
npm run test:ci
```

## 🔧 Development

### Code Quality

**Linting**
```bash
npm run lint
npm run lint:fix
```

**Formatting**
```bash
npm run format
npm run format:check
```

### Docker

**Build image**
```bash
npm run docker:build
```

**Run container**
```bash
npm run docker:run
```

**Test container**
```bash
npm run docker:test
```

## 📚 API Documentation

### Health Check Endpoints

- `GET /api/health` - Basic health status
- `GET /api/health/detailed` - Detailed system information
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

### User Management

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product Management

- `GET /api/products` - Get all products (with filtering and sorting)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Get products by category

## 🏗️ CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow with the following stages:

1. **Lint and Format Check** - ESLint and Prettier validation
2. **Unit Tests** - Jest testing with coverage reporting
3. **Security Scan** - npm audit and Snyk security scanning
4. **Docker Build and Test** - Container build and validation
5. **Staging Deployment** - Automatic deployment to staging (develop branch)
6. **Production Deployment** - Manual deployment to production (main branch)
7. **Quality Gates** - Coverage and quality thresholds

### Pipeline Triggers

- **Push to main** - Full pipeline with production deployment
- **Push to develop** - Full pipeline with staging deployment
- **Pull Request** - Lint, test, and security checks only

## 🌍 Environment Configuration

The project supports multiple environments with specific configurations:

### Development
```bash
NODE_ENV=development npm run dev
```

### Staging
```bash
NODE_ENV=staging npm start
```

### Production
```bash
NODE_ENV=production npm start
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints

The API provides comprehensive health monitoring:

- **Basic Health**: `GET /api/health`
- **Detailed Health**: `GET /api/health/detailed`
- **Readiness**: `GET /api/health/ready`
- **Liveness**: `GET /api/health/live`

### Docker Health Checks

The Docker container includes built-in health checks that monitor:
- Application responsiveness
- Memory usage
- System resources

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** with express-rate-limit
- **Input validation** and sanitization
- **Security scanning** in CI/CD pipeline
- **Non-root user** in Docker containers

## 📁 Project Structure

```
cicd-nodejs-api/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── config/
│   └── environments/
│       ├── development.js
│       ├── staging.js
│       └── production.js
├── src/
│   ├── routes/
│   │   ├── health.js
│   │   ├── users.js
│   │   └── products.js
│   └── app.js
├── tests/
│   ├── app.test.js
│   └── routes/
│       ├── users.test.js
│       └── products.test.js
├── .eslintrc.js
├── .prettierrc
├── .dockerignore
├── Dockerfile
├── healthcheck.js
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the ESLint configuration
- Write tests for new features
- Maintain 80%+ test coverage
- Use conventional commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the [API documentation](#api-documentation)
- Review the [health check endpoints](#monitoring-and-health-checks)

## 🔄 Version History

- **v1.0.0** - Initial release with complete CI/CD pipeline
  - Express.js API with health checks
  - Jest testing with coverage
  - Docker containerization
  - GitHub Actions workflow
  - Environment configurations
  - Security features

---

**Built with ❤️ for modern CI/CD practices** 