# CI/CD Quality Gates

## Overview

Quality gates are checkpoints in CI/CD pipelines that enforce quality standards before code progresses to the next stage. They automate go/no-go decisions based on measurable criteria.

## Why Quality Gates Matter

### Without Quality Gates
- Broken code reaches production
- Manual quality checks become bottleneck
- Inconsistent quality standards
- Defects discovered late
- Rollbacks and hotfixes

### With Quality Gates
- Automated quality enforcement
- Fast feedback to developers
- Consistent standards
- Early defect detection
- Confidence in deployments

## CI/CD Pipeline Stages

```
Code Commit → Build → Unit Tests → Integration Tests → Security Scan → Deploy to Staging → E2E Tests → Deploy to Production

Quality Gates: ↓         ↓           ↓                  ↓               ↓                  ↓
```

Each stage has quality gates that must pass before proceeding.

## Common Quality Gates

### 1. Build Gate

**Criteria:**
- Build succeeds without errors
- No compilation errors
- Dependencies resolve correctly
- Docker image builds successfully

**Example (GitHub Actions):**
```yaml
name: Build Gate
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Fail if build errors
        if: failure()
        run: exit 1
```

**Gate Decision:**
✅ Pass: Build succeeds → Continue to tests
❌ Fail: Build fails → Block pipeline, notify developer

---

### 2. Unit Test Gate

**Criteria:**
- All unit tests pass
- Code coverage ≥ target (e.g., 80%)
- No test failures or errors
- Tests complete within time limit

**Example (pytest with coverage):**
```yaml
unit-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Run unit tests with coverage
      run: |
        pytest tests/unit \
          --cov=src \
          --cov-report=xml \
          --cov-fail-under=80

    - name: Upload coverage report
      uses: codecov/codecov-action@v3
```

**Gate Decision:**
✅ Pass: Tests pass, coverage ≥ 80% → Continue
❌ Fail: Tests fail or coverage < 80% → Block

---

### 3. Code Quality Gate

**Criteria:**
- No critical code smells
- Maintainability rating ≥ A
- Technical debt ratio < threshold
- Complexity within limits
- No security hotspots

**Tools:**
- SonarQube
- CodeClimate
- ESLint / Pylint
- Checkstyle

**Example (SonarQube):**
```yaml
code-quality:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: SonarQube Scan
      uses: sonarsource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

    - name: SonarQube Quality Gate
      uses: sonarsource/sonarqube-quality-gate-action@master
      timeout-minutes: 5
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**SonarQube Quality Gate Configuration:**
```
Conditions:
- Coverage on New Code ≥ 80%
- Duplicated Lines on New Code ≤ 3%
- Maintainability Rating = A
- Reliability Rating = A
- Security Rating = A
- Security Hotspots Reviewed = 100%
```

**Gate Decision:**
✅ Pass: All conditions met → Continue
❌ Fail: Any condition fails → Block

---

### 4. Security Scan Gate

**Criteria:**
- No critical vulnerabilities
- No high severity issues
- Dependencies have no known CVEs
- Secrets not exposed in code
- License compliance

**Tools:**
- Snyk
- OWASP Dependency-Check
- Trivy
- GitLeaks
- WhiteSource

**Example (Snyk):**
```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Run Snyk to check for vulnerabilities
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

    - name: Upload Snyk results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: snyk.sarif
```

**Gate Decision:**
✅ Pass: No critical/high vulnerabilities → Continue
❌ Fail: Critical or high vulnerabilities found → Block

---

### 5. Integration Test Gate

**Criteria:**
- All integration tests pass
- API contracts valid
- Database migrations successful
- External service mocks work
- Test data setup/teardown succeeds

**Example:**
```yaml
integration-tests:
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

    - name: Run integration tests
      run: |
        pytest tests/integration \
          --maxfail=1 \
          --timeout=300
      env:
        DATABASE_URL: postgresql://postgres:test@localhost/test
```

**Gate Decision:**
✅ Pass: All integration tests pass → Continue
❌ Fail: Any integration test fails → Block

---

### 6. Performance Test Gate

**Criteria:**
- Response time p95 < threshold (e.g., 500ms)
- Throughput ≥ target (e.g., 100 req/s)
- Error rate < 1%
- Resource usage within limits
- No memory leaks detected

**Tools:**
- JMeter
- k6
- Gatling
- Locust

**Example (k6):**
```yaml
performance-test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Run k6 performance test
      uses: grafana/k6-action@v0.3.0
      with:
        filename: tests/performance/load-test.js
      env:
        K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
```

**k6 Test Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% requests under 500ms
    'http_req_failed': ['rate<0.01'],   // Error rate < 1%
  },
  stages: [
    { duration: '2m', target: 100 }, // Ramp to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  let response = http.get('https://api.example.com/users');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**Gate Decision:**
✅ Pass: All thresholds met → Continue
❌ Fail: Any threshold exceeded → Block

---

### 7. End-to-End Test Gate

**Criteria:**
- Critical user journeys pass
- UI tests pass across browsers
- No console errors
- Visual regression tests pass
- Accessibility checks pass

**Example (Playwright):**
```yaml
e2e-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Install Playwright
      run: npm ci && npx playwright install --with-deps

    - name: Run E2E tests
      run: npx playwright test

    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: playwright-report/
```

**Gate Decision:**
✅ Pass: All E2E tests pass → Continue to production
❌ Fail: Any critical test fails → Block

---

## Quality Gate Strategy by Environment

### Development Branch
**Gates:**
- ✅ Build
- ✅ Unit tests
- ✅ Linting
- ⚠️ Code quality (warning only)

**Strategy:** Fast feedback, non-blocking for minor issues

### Pull Request
**Gates:**
- ✅ Build
- ✅ Unit tests (100% must pass)
- ✅ Code coverage ≥ 80%
- ✅ Code quality (blocking)
- ✅ Security scan
- ✅ Integration tests

**Strategy:** Comprehensive, blocking gates before merge

### Main/Master Branch
**Gates:**
- ✅ All PR gates
- ✅ Integration tests (extended suite)
- ✅ Performance tests
- ✅ E2E smoke tests

**Strategy:** Production-ready validation

### Staging Deployment
**Gates:**
- ✅ All main branch gates
- ✅ Full E2E test suite
- ✅ Performance regression tests
- ✅ Security penetration tests

**Strategy:** Final validation before production

### Production Deployment
**Gates:**
- ✅ Manual approval (for critical systems)
- ✅ Deployment health checks
- ✅ Canary metrics validation
- ✅ Rollback readiness

**Strategy:** Safety and rollback capability

---

## Implementing Quality Gates

### GitHub Actions Example (Complete Pipeline)

```yaml
name: CI/CD Pipeline with Quality Gates

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Gate 1: Build
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifact
          path: dist/

  # Gate 2: Unit Tests & Coverage
  unit-tests:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi

  # Gate 3: Code Quality
  code-quality:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run ESLint
        run: npm run lint
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # Gate 4: Security Scan
  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # Gate 5: Integration Tests
  integration-tests:
    needs: [unit-tests, code-quality, security]
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:integration

  # Gate 6: Deploy to Staging
  deploy-staging:
    needs: integration-tests
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build-artifact
      - name: Deploy to staging
        run: ./scripts/deploy-staging.sh

  # Gate 7: E2E Tests in Staging
  e2e-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
        env:
          BASE_URL: https://staging.example.com

  # Gate 8: Production Deployment
  deploy-production:
    needs: e2e-tests
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build-artifact
      - name: Deploy to production
        run: ./scripts/deploy-production.sh
```

---

## Quality Metrics Dashboard

### What to Track

**Build Metrics:**
- Build success rate
- Build duration
- Build frequency

**Test Metrics:**
- Test pass rate
- Test coverage
- Test execution time
- Flaky test count

**Quality Metrics:**
- Code quality score
- Technical debt
- Bug density
- Security vulnerabilities

**Deployment Metrics:**
- Deployment frequency
- Lead time for changes
- Mean time to recovery (MTTR)
- Change failure rate

### Tools for Dashboards
- Grafana
- DataDog
- New Relic
- SonarQube Dashboard
- GitHub Insights

---

## Best Practices

### 1. Make Gates Fast
- Unit tests < 5 minutes
- Integration tests < 15 minutes
- Full pipeline < 30 minutes
- Cache dependencies

### 2. Make Gates Reliable
- Eliminate flaky tests
- Use stable test data
- Isolate tests properly
- Retry transient failures (max 2 retries)

### 3. Make Gates Actionable
- Clear failure messages
- Link to logs
- Suggest fixes
- Show diff/blame

### 4. Make Gates Configurable
- Different thresholds per environment
- Override capability (with approval)
- Gradual rollout of new gates

### 5. Make Gates Visible
- Real-time status dashboard
- Notifications (Slack, email)
- Historical trends
- Team metrics

---

## Common Mistakes

### Too Many Gates
**Problem:** Pipeline too slow, developers frustrated

**Solution:** Prioritize critical gates, parallelize where possible

### Gates Too Strict
**Problem:** Every minor issue blocks deployment

**Solution:** Differentiate blocking vs warning, adjust thresholds

### No Gate Ownership
**Problem:** Gates fail frequently, nobody fixes them

**Solution:** Assign ownership, track gate health

### Manual Gates in Automation
**Problem:** Human approval required at every stage

**Solution:** Automate decisions, reserve manual approval for production only

---

## What Senior Engineers Know

**Quality gates are not about perfection.** They're about acceptable risk. A 90% pass rate might be fine for non-critical systems.

**Fast gates win.** A 5-minute feedback loop gets fixed. A 2-hour feedback loop gets ignored. Optimize for speed.

**Gates should fail rarely.** If gates fail >10% of the time, they're too strict or tests are unreliable. Adjust.

**The best gate is the one that catches bugs in production.** Measure defect escape rate. If production bugs are common, your gates aren't working.

**Treat flaky tests as critical bugs.** One flaky test makes the entire gate unreliable. Fix or delete flaky tests immediately.

---

## Exercise

**Design a CI/CD pipeline with quality gates for:**

A microservices-based e-commerce application with:
- Frontend (React)
- Backend API (Node.js)
- Database (PostgreSQL)
- Message Queue (RabbitMQ)

**Include:**
1. List of quality gates
2. Order of gates
3. Pass/fail criteria for each
4. Estimated time for each gate
5. Monitoring and alerting strategy

---

## Next Steps

- Learn [Exploratory Testing](06-exploratory-testing.md)
- Understand [Regression Strategy](07-regression-strategy.md)
- Master [Test Data Management](08-test-data-management.md)
- Practice setting up CI/CD pipelines with quality gates
