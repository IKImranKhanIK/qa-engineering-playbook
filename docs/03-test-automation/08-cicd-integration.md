# CI/CD Integration

## Overview

Continuous Integration/Continuous Deployment (CI/CD) automates building, testing, and deploying code. Integrating automated tests into CI/CD pipelines enables fast feedback, prevents bugs from reaching production, and enables confident deployments.

## Why CI/CD Integration Matters

### Without CI/CD

```
Developer workflow:
1. Write code
2. Run tests manually (sometimes)
3. Push to main
4. Deploy manually
5. Hope nothing breaks

Result:
- Bugs slip to production
- Slow releases
- Manual testing bottleneck
- Fear of deploying
```

### With CI/CD

```
Developer workflow:
1. Write code
2. Push to branch
3. CI automatically:
   - Builds code
   - Runs all tests
   - Checks code quality
   - Reports results
4. Merge if green
5. Auto-deploy to staging
6. Auto-deploy to production

Result:
- Bugs caught before merge
- Fast, frequent releases
- Automated testing
- Confidence in deployments
```

---

## CI/CD Pipeline Structure

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Commit  │────▶│  Build   │────▶│   Test   │────▶│  Deploy  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                       │                 │                │
                       ▼                 ▼                ▼
                  Compile          Unit Tests      Staging Env
                  Lint             API Tests       Production
                  Package          E2E Tests
```

**Stages:**

1. **Build**: Compile code, install dependencies
2. **Test**: Run automated tests
3. **Deploy**: Push to environments (staging → production)

---

## GitHub Actions Example

### Basic Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

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
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run API tests
        run: npm run test:api

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### Multi-Stage Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Build
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  # Job 2: Unit Tests (runs in parallel with API tests)
  unit-tests:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  # Job 3: API Tests (runs in parallel with unit tests)
  api-tests:
    needs: build
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - name: Run API tests
        run: npm run test:api
        env:
          DATABASE_URL: postgresql://postgres:test@localhost/test

  # Job 4: E2E Tests (runs after unit and API tests)
  e2e-tests:
    needs: [unit-tests, api-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # Job 5: Deploy to staging (only on main branch)
  deploy-staging:
    needs: [e2e-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/

      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # Add your deployment script here
          # ./deploy.sh staging

  # Job 6: Deploy to production (manual approval required)
  deploy-production:
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # ./deploy.sh production
```

---

## Testing Strategies in CI/CD

### 1. PR Checks (Fast Feedback)

```yaml
# Run on every PR - must be fast (<10 minutes)
name: PR Checks

on:
  pull_request:

jobs:
  pr-checks:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit # Fast unit tests only
      - run: npm run test:api:smoke # Critical API tests only
```

**Goal:** Fast feedback (< 10 minutes)

**What to run:**
- Linting
- Unit tests
- Smoke tests (critical paths only)

### 2. Main Branch (Comprehensive)

```yaml
# Run on main - can be slower (< 30 minutes)
name: Main Branch Tests

on:
  push:
    branches: [main]

jobs:
  comprehensive-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:api # Full API suite
      - run: npm run test:e2e # Full E2E suite
      - run: npm run test:performance # Performance tests
```

**Goal:** Comprehensive testing before deployment

**What to run:**
- Full unit test suite
- Full API test suite
- Full E2E test suite
- Performance tests

### 3. Nightly Builds (Extensive)

```yaml
# Run nightly - can be slow (hours)
name: Nightly Tests

on:
  schedule:
    - cron: '0 2 * * *' # 2 AM daily

jobs:
  nightly:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:all # Everything
      - run: npm run test:integration:external # External integrations
      - run: npm run test:load # Load testing
      - run: npm run test:security # Security scans
```

**Goal:** Find issues that fast tests miss

**What to run:**
- Everything
- External integrations
- Load/stress testing
- Security scans

---

## Parallel Execution

### Matrix Strategy

```yaml
# Run tests across multiple versions
name: Matrix Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

**Result:** 9 jobs run in parallel (3 OS × 3 Node versions)

### Playwright Sharding

```yaml
# Split E2E tests across multiple machines
name: E2E Tests (Sharded)

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4] # 4 shards
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run sharded tests
        run: npx playwright test --shard=${{ matrix.shard }}/4

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: results-${{ matrix.shard }}
          path: test-results/
```

**Result:** Tests run 4x faster

---

## Environment Variables and Secrets

### Using Secrets

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run tests
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: npm run test:api
```

**Setting secrets:**
1. Go to GitHub repo → Settings → Secrets
2. Add new secret
3. Reference in workflow with `${{ secrets.SECRET_NAME }}`

### Environment-Specific Variables

```yaml
jobs:
  deploy-staging:
    environment: staging
    steps:
      - run: ./deploy.sh
        env:
          DEPLOY_ENV: staging
          API_URL: https://api-staging.example.com

  deploy-production:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          DEPLOY_ENV: production
          API_URL: https://api.example.com
```

---

## Handling Test Failures

### Retry Failed Tests

```yaml
# playwright.config.js
module.exports = {
  retries: process.env.CI ? 2 : 0, // Retry up to 2 times in CI
};
```

### Continue on Error

```yaml
jobs:
  test:
    steps:
      - name: Run flaky tests
        continue-on-error: true # Don't fail pipeline if this fails
        run: npm run test:flaky

      - name: Run critical tests
        run: npm run test:critical # This must pass
```

### Conditional Steps

```yaml
jobs:
  test:
    steps:
      - name: Run tests
        id: tests
        run: npm test

      - name: Notify on failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text": "Tests failed!"}'

      - name: Upload logs on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: failure-logs
          path: logs/
```

---

## Notifications

### Slack Integration

```yaml
jobs:
  test:
    steps:
      - name: Run tests
        run: npm test

      - name: Notify Slack on success
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{
              "text": "✅ Tests passed!",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Build:* ${{ github.run_number }}\n*Branch:* ${{ github.ref_name }}\n*Commit:* ${{ github.sha }}"
                }
              }]
            }'

      - name: Notify Slack on failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{
              "text": "❌ Tests failed!",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Build:* ${{ github.run_number }}\n*Branch:* ${{ github.ref_name }}\n*Commit:* ${{ github.sha }}\n*URL:* ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                }
              }]
            }'
```

---

## Caching Dependencies

```yaml
jobs:
  test:
    steps:
      - uses: actions/checkout@v3

      - name: Cache Node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: npm ci # Uses cache if available
      - run: npm test
```

**Benefits:**
- Faster builds (skip npm install if no changes)
- Reduced network usage

---

## Artifacts and Reports

### Upload Test Results

```yaml
jobs:
  test:
    steps:
      - run: npm test

      - name: Upload test results
        if: always() # Upload even if tests fail
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            test-results/
            coverage/
            playwright-report/

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: failure-screenshots
          path: screenshots/
```

### Publish Test Report

```yaml
jobs:
  test:
    steps:
      - run: npx playwright test

      - name: Publish Playwright Report
        if: always()
        uses: actions/upload-pages-artifact@v2
        with:
          path: playwright-report/

      - name: Deploy to GitHub Pages
        if: always()
        uses: actions/deploy-pages@v2
```

---

## Quality Gates

### Coverage Threshold

```yaml
jobs:
  test:
    steps:
      - run: npm test -- --coverage

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi
```

### Block Merge if Tests Fail

```yaml
# .github/workflows/required-checks.yml
name: Required Checks

on:
  pull_request:

jobs:
  required:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint # Must pass
      - run: npm run test:critical # Must pass
```

**Enable branch protection:**
1. GitHub repo → Settings → Branches
2. Add branch protection rule for `main`
3. Require status checks: `required`
4. Merging blocked until checks pass

---

## Docker Integration

### Run Tests in Docker

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-focal
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright test
```

### Docker Compose for Integration Tests

```yaml
jobs:
  integration-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Start services
        run: docker-compose up -d

      - name: Wait for services
        run: ./wait-for-services.sh

      - name: Run integration tests
        run: npm run test:integration

      - name: Stop services
        if: always()
        run: docker-compose down
```

---

## Best Practices

### 1. Keep Pipelines Fast

```yaml
# ❌ Bad: Slow pipeline (60 minutes)
jobs:
  test:
    steps:
      - run: npm run test:all # Everything in one job

# ✅ Good: Fast pipeline (15 minutes)
jobs:
  unit-tests:
    steps:
      - run: npm run test:unit # 5 min

  api-tests:
    steps:
      - run: npm run test:api # 5 min

  e2e-critical:
    steps:
      - run: npm run test:e2e:critical # 5 min

# Jobs run in parallel
```

**Target:** < 10 minutes for PR checks, < 30 minutes for main branch

### 2. Fail Fast

```yaml
jobs:
  test:
    steps:
      - run: npm run lint # Fast
      - run: npm run test:unit # Medium
      - run: npm run test:e2e # Slow

# If linting fails, don't run tests (save time)
```

### 3. Use Matrix for Cross-Platform

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    os: [ubuntu-latest, macos-latest]
```

### 4. Cache Aggressively

```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ~/.cache/ms-playwright
    key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

---

## What Senior Engineers Know

**CI/CD is not optional.** Manual testing doesn't scale. Automate or fall behind.

**Fast pipelines win.** 5-minute feedback gets attention. 60-minute feedback gets ignored.

**Flaky tests kill CI/CD.** Fix or quarantine them. Don't let them erode trust.

**Test the right things at the right time.** PR: Fast smoke tests. Main: Comprehensive. Nightly: Everything.

**Deployment should be boring.** If deployments are scary, automate more tests.

---

## Exercise

**Set Up CI/CD Pipeline:**

Create a GitHub Actions workflow for a web app with:

1. **PR Checks** (< 10 min):
   - Lint
   - Unit tests
   - Critical E2E tests

2. **Main Branch** (< 30 min):
   - All tests
   - Deploy to staging

3. **Production Deployment**:
   - Manual approval
   - Smoke tests in production

**Deliverable:** `.github/workflows/ci-cd.yml` file

---

## Next Steps

- Implement [Test Reporting and Analytics](09-reporting-analytics.md)
- Review [Automation Strategy](01-automation-strategy.md)
- Master [Flaky Test Prevention](07-flaky-test-prevention.md)
- Study [Framework Design Patterns](04-framework-design-patterns.md)
