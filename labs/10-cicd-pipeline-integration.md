# CI/CD Pipeline Integration Lab

## Overview

**Duration:** 3 hours
**Difficulty:** Intermediate
**Category:** Test Automation

Integrate automated tests into a CI/CD pipeline using GitHub Actions. Build a complete testing workflow from commit to deployment.

## Learning Objectives

- Set up GitHub Actions workflows
- Integrate unit, integration, and E2E tests
- Implement quality gates
- Generate test reports
- Configure automated deployments

## Prerequisites

- GitHub account
- Basic Git knowledge
- Node.js project (or sample provided)
- Docker basics

## Sample Project Setup

```bash
# Clone sample project
git clone https://github.com/your-username/sample-api.git
cd sample-api

# Install dependencies
npm install

# Run tests locally
npm test
```

## Part 1: Basic CI Workflow (30 min)

### Create `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run unit tests
      run: npm test

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

### Test the Workflow

```bash
git add .github/workflows/ci.yml
git commit -m "Add CI pipeline"
git push origin main
```

Check GitHub Actions tab for results.

## Part 2: Multi-Stage Testing (45 min)

### Enhanced Pipeline

```yaml
name: Complete Test Suite

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --coverage
      - name: Upload coverage reports
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: unit-tests

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - name: Run integration tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        run: npm run test:integration

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: integration-tests

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Start application
        run: |
          npm run start &
          npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Part 3: Quality Gates (45 min)

### Add Coverage Requirements

```yaml
  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]

    steps:
      - uses: actions/checkout@v3

      - name: Download coverage
        uses: actions/download-artifact@v3
        with:
          name: coverage-report

      - name: Check coverage threshold
        run: |
          COVERAGE=$(jq '.total.lines.pct' coverage/coverage-summary.json)
          echo "Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage below 80%"
            exit 1
          fi
          echo "✅ Coverage meets threshold"

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Add Security Scanning

```yaml
  security:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          path: '.'
          format: 'HTML'
```

## Part 4: Performance Testing (30 min)

### Add k6 Load Tests

```yaml
  performance:
    name: Performance Tests
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup k6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Start API
        run: |
          npm start &
          sleep 10

      - name: Run load test
        run: k6 run tests/performance/load-test.js

      - name: Check performance thresholds
        run: |
          if [ $? -ne 0 ]; then
            echo "❌ Performance test failed"
            exit 1
          fi
```

## Part 5: Docker Build & Deploy (45 min)

### Build Docker Image

```yaml
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [quality-gate, security]

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            username/app:latest
            username/app:${{ github.sha }}
          cache-from: type=registry,ref=username/app:buildcache
          cache-to: type=registry,ref=username/app:buildcache,mode=max
```

### Deploy to Staging

```yaml
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # Add your deployment commands

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --baseUrl=https://staging.example.com
```

### Deploy to Production

```yaml
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --baseUrl=https://example.com

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production completed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Part 6: Test Reporting (15 min)

### Generate HTML Report

```yaml
      - name: Generate test report
        if: always()
        run: |
          npm install -g allure-commandline
          allure generate allure-results --clean -o allure-report

      - name: Deploy report to GitHub Pages
        if: always()
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./allure-report
          destination_dir: reports/${{ github.run_number }}
```

## Deliverables

### Complete CI/CD Pipeline

**Pipeline Stages:**
1. ✅ Code Quality (Lint, Format)
2. ✅ Unit Tests (80%+ coverage)
3. ✅ Integration Tests (with DB)
4. ✅ E2E Tests (Playwright)
5. ✅ Security Scan (Snyk, Audit)
6. ✅ Performance Tests (k6)
7. ✅ Build Docker Image
8. ✅ Deploy to Staging
9. ✅ Smoke Tests
10. ✅ Deploy to Production

### Metrics Dashboard

Track:
- Build success rate
- Test pass rate
- Average build time
- Code coverage trend
- Security vulnerabilities
- Deployment frequency

## Bonus Challenges

1. **Matrix Testing:**
```yaml
strategy:
  matrix:
    node: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

2. **Scheduled Tests:**
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Run nightly
```

3. **Manual Approval:**
```yaml
environment:
  name: production
  approval: required
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CI/CD Best Practices](https://github.com/features/actions)
- [Awesome CI/CD](https://github.com/cicdops/awesome-ciandcd)
