# CI/CD Pipeline Setup Guide

This document provides comprehensive instructions for setting up the complete CI/CD pipeline with all required configurations, secrets, and integrations.

## 🔧 Required Secrets

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

### Core Secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub
- `DISCORD_WEBHOOK` - Discord webhook URL for notifications

### Security & Quality Tools
- `SNYK_TOKEN` - Snyk API token for security scanning
- `SONAR_TOKEN` - SonarCloud authentication token
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI GitHub App token

### Container Registry
- `REGISTRY_USERNAME` - GitHub Container Registry username
- `REGISTRY_PASSWORD` - GitHub Container Registry password (use `GITHUB_TOKEN`)

## 🛠️ Tool Setup Instructions

### 1. Snyk Security Scanning

1. **Sign up for Snyk**: Visit [snyk.io](https://snyk.io) and create an account
2. **Get API Token**: Go to Account Settings > API Token
3. **Add to GitHub Secrets**: Add the token as `SNYK_TOKEN`

```bash
# Test Snyk locally
npm install -g snyk
snyk auth
snyk test
```

### 2. SonarCloud Code Quality

1. **Create SonarCloud Account**: Visit [sonarcloud.io](https://sonarcloud.io)
2. **Create Organization**: Set up your organization
3. **Create Project**: Create a new project for your repository
4. **Get Token**: Go to Account > Security > Generate Tokens
5. **Add to GitHub Secrets**: Add the token as `SONAR_TOKEN`
6. **Update Configuration**: Update `sonar-project.properties` with your details

```properties
sonar.projectKey=your-username_cicd-nodejs-api
sonar.organization=your-username
```

### 3. Lighthouse CI Performance Testing

1. **Install Lighthouse CI**: `npm install -g @lhci/cli`
2. **Initialize**: `lhci wizard`
3. **Get GitHub App Token**: Follow the wizard to get your token
4. **Add to GitHub Secrets**: Add the token as `LHCI_GITHUB_APP_TOKEN`

### 4. Discord Notifications

1. **Create Discord Server**: Set up a server for notifications
2. **Create Webhook**: Go to Server Settings > Integrations > Webhooks
3. **Copy Webhook URL**: Copy the webhook URL
4. **Add to GitHub Secrets**: Add the URL as `DISCORD_WEBHOOK`

### 5. GitHub Container Registry

1. **Enable Container Registry**: Go to repository Settings > Packages
2. **Configure Access**: Ensure the workflow has access to packages
3. **Update Workflow**: The workflow uses `GITHUB_TOKEN` for authentication

## 🔄 Workflow Configuration

### Environment Setup

Create environments in GitHub (`Settings > Environments`):

#### Staging Environment
- **Name**: `staging`
- **Protection Rules**: 
  - Required reviewers: 1
  - Wait timer: 0 minutes
  - Deployment branches: `develop`

#### Production Environment
- **Name**: `production`
- **Protection Rules**:
  - Required reviewers: 2
  - Wait timer: 5 minutes
  - Deployment branches: `main`

### Branch Protection

Set up branch protection rules:

#### Main Branch
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators
- Restrict pushes that create files that match the specified pattern

#### Develop Branch
- Require pull request reviews before merging
- Require status checks to pass before merging
- Include administrators

## 📊 Monitoring & Analytics

### Code Coverage

The pipeline automatically uploads coverage reports to Codecov:

1. **Sign up for Codecov**: Visit [codecov.io](https://codecov.io)
2. **Connect Repository**: Add your GitHub repository
3. **Get Token**: Add `CODECOV_TOKEN` to secrets (optional)

### Performance Monitoring

Lighthouse CI provides performance insights:

1. **View Reports**: Check the Lighthouse CI dashboard
2. **Set Thresholds**: Adjust performance thresholds in `.lighthouserc.js`
3. **Monitor Trends**: Track performance over time

### Security Monitoring

Snyk provides security insights:

1. **View Dashboard**: Check Snyk dashboard for vulnerabilities
2. **Set Policies**: Configure security policies
3. **Monitor Dependencies**: Track dependency vulnerabilities

## 🚀 Deployment Configuration

### Staging Deployment

The staging environment deploys automatically on pushes to `develop`:

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  environment: staging
```

### Production Deployment

The production environment deploys on pushes to `main`:

```yaml
deploy-production:
  if: github.ref == 'refs/heads/main'
  environment: production
```

### Custom Deployment Commands

Replace the placeholder deployment commands in the workflow:

```yaml
- name: Deploy to staging environment
  run: |
    # Add your deployment commands here
    # Example for Kubernetes:
    # kubectl set image deployment/cicd-api cicd-api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
    # kubectl rollout status deployment/cicd-api
```

## 🔍 Quality Gates

The pipeline includes quality gates that must pass:

### Code Coverage
- Minimum 80% coverage required
- Coverage reports uploaded to Codecov
- Fails pipeline if threshold not met

### Security Vulnerabilities
- No high/critical vulnerabilities allowed
- Snyk security scanning
- npm audit integration

### Performance Metrics
- Lighthouse performance scores
- Core Web Vitals thresholds
- Performance regression detection

### Code Quality
- SonarCloud analysis
- Code quality gates
- Technical debt tracking

## 📈 Pipeline Optimization

### Caching Strategy

The pipeline uses multiple caching layers:

1. **npm Cache**: Node modules caching
2. **Docker Cache**: Multi-layer Docker caching
3. **Build Cache**: GitHub Actions build cache

### Parallel Execution

Jobs run in parallel where possible:

- `lint`, `test`, `security` - Parallel execution
- `integration-tests`, `lighthouse` - Parallel after test completion
- `docker` - Runs after quality checks
- `deploy-staging`, `deploy-production` - Conditional deployment

### Resource Optimization

Stay within GitHub Actions free tier limits:

- **Monthly Minutes**: 2,000 minutes
- **Concurrent Jobs**: 20 jobs
- **Job Timeout**: 6 hours maximum

## 🛡️ Security Best Practices

### Secret Management
- Use GitHub Secrets for sensitive data
- Rotate tokens regularly
- Use least privilege principle

### Container Security
- Non-root user in Docker containers
- Multi-stage builds for smaller images
- Security scanning in CI/CD

### Code Security
- Dependency vulnerability scanning
- Static code analysis
- Security linting rules

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review error logs in GitHub Actions

2. **Test Failures**
   - Ensure all tests pass locally
   - Check for flaky tests
   - Review test coverage thresholds

3. **Deployment Failures**
   - Verify environment secrets
   - Check deployment permissions
   - Review deployment logs

4. **Performance Issues**
   - Monitor Lighthouse scores
   - Check for performance regressions
   - Review bundle size and load times

### Debug Commands

```bash
# Run tests locally
npm test

# Run Cypress tests
npm run cypress:run

# Run Lighthouse locally
npm run lighthouse

# Check security vulnerabilities
npm audit

# Run linting
npm run lint

# Check formatting
npm run format:check
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Snyk Documentation](https://docs.snyk.io/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Cypress Documentation](https://docs.cypress.io/)

## 🤝 Support

For issues with the CI/CD pipeline:

1. Check the GitHub Actions logs
2. Review the troubleshooting section
3. Create an issue in the repository
4. Contact the development team

---

## SonarCloud Integration Setup

### 1. Create a SonarCloud Account & Project
- Go to [SonarCloud](https://sonarcloud.io/) and sign in with your GitHub account.
- Create a new organization (or use an existing one).
- Create a new project and link it to your GitHub repository.
- Note your **organization key** and **project key** (e.g., `your-org_or_username` and `your-org_or_username_cicd-nodejs-api`).

### 2. Generate a SonarCloud Token
- In SonarCloud, go to **My Account > Security**.
- Click **Generate Tokens** and create a new token (e.g., `SONAR_TOKEN`).
- Copy the token value (you will not be able to see it again).

### 3. Add the Token to GitHub Secrets
- Go to your GitHub repository > **Settings > Secrets and variables > Actions**.
- Click **New repository secret**.
- Name: `SONAR_TOKEN`
- Value: (paste your SonarCloud token)

### 4. Configure sonar-project.properties
- The file should look like:

```properties
sonar.projectKey=your-org_or_username_cicd-nodejs-api
sonar.organization=your-org_or_username
sonar.host.url=https://sonarcloud.io
sonar.login=${SONAR_TOKEN}
sonar.sources=src
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.qualitygate.wait=true
sonar.qualitygate.conditions=bugs=0;vulnerabilities=0;coverage>80;duplicated_lines_density<3;maintainability_rating=A
sonar.pullrequest.provider=GitHub
sonar.pullrequest.github.repository=${GITHUB_REPOSITORY}
sonar.pullrequest.github.summary_comment=true
sonar.branch.name=${GITHUB_REF_NAME}
sonar.branch.target=${GITHUB_BASE_REF}
sonar.sourceEncoding=UTF-8
```

### 5. GitHub Actions Workflow Integration
- The workflow will automatically run SonarCloud analysis on PRs and main/develop branches.
- It will:
  - Upload coverage from Jest (`coverage/lcov.info`)
  - Enforce strict quality gates (0 bugs, 0 vulnerabilities, 80%+ coverage, <3% duplication, maintainability A)
  - Post quality gate status and comments on PRs
  - Block merges if the quality gate fails (if you enable branch protection)

### 6. Quality Gate Configuration
- The strict quality gate is enforced via `sonar.qualitygate.conditions` in the properties file.
- You can also configure and monitor quality gates in the SonarCloud UI under **Quality Gates**.

### 7. Historical Metrics & PR Comments
- SonarCloud will track historical metrics for bugs, vulnerabilities, coverage, duplication, and maintainability.
- PRs will receive automatic comments with quality gate status and metrics.

### 8. Troubleshooting
- Ensure the `SONAR_TOKEN` is valid and has project analysis permissions.
- Ensure Jest coverage is generated before the SonarCloud scan step.
- For branch/PR analysis, ensure the workflow is triggered on `pull_request`, `main`, and `develop`.
- Check the Actions log for SonarCloud output and quality gate status.

---

**Last Updated**: 2024
**Version**: 1.0.0 