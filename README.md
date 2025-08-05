# CI/CD Node.js API

A comprehensive Node.js API project with complete CI/CD pipeline setup including Docker, Cypress, Jest, and GitHub Actions.

## 🚀 Features

- **Node.js Express API** with health, users, and products endpoints
- **Docker containerization** with multi-stage builds
- **Comprehensive testing** with Jest and Cypress
- **CI/CD pipeline** with GitHub Actions
- **Code quality** with ESLint, Prettier, and SonarCloud
- **Security scanning** with Snyk integration
- **Performance monitoring** with Lighthouse CI
- **Quality gates** with strict SonarCloud standards

## 📋 Prerequisites

- Node.js 18+
- Docker
- Git

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/spsatwickpandey/cicd-project.git
cd cicd-project

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests with Cypress
npm run cypress:run

# Run all tests
npm run test:ci
```

## 🐳 Docker

```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run

# Test Docker container
npm run docker:test
```

## 🔧 Quality Assurance

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run SonarCloud analysis
npm run quality:check
```

## 📊 Quality Standards

This project enforces strict quality standards:

- **0 Bugs Policy**: No bugs allowed in production code
- **0 Vulnerabilities Policy**: No security vulnerabilities tolerated
- **80%+ Code Coverage**: Minimum coverage requirement
- **<3% Duplicated Lines**: Code duplication control
- **A-Rated Maintainability**: High code maintainability standards
- **A-Rated Reliability**: High code reliability standards
- **A-Rated Security**: High security standards

## 🚀 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline with:

- **Automated Testing**: Unit, integration, and E2E tests
- **Code Quality**: ESLint, Prettier, and SonarCloud analysis
- **Security Scanning**: Snyk vulnerability scanning
- **Performance Testing**: Lighthouse CI performance monitoring
- **Docker Builds**: Automated Docker image building
- **Quality Gates**: Strict SonarCloud quality gate enforcement

## 📚 Documentation

- [CI/CD Setup Guide](CI_CD_SETUP.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Cypress Guide](CYPRESS_GUIDE.md)
- [SonarCloud Setup Guide](SONARCLOUD_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Ensure quality gate passes
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This project demonstrates enterprise-grade CI/CD practices with strict quality standards and comprehensive testing strategies. 