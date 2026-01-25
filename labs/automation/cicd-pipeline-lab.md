# Lab: CI/CD Pipeline Integration

**Difficulty:** Intermediate
**Duration:** 3 hours
**Category:** Automation

## Objectives

- Set up automated tests in CI/CD pipeline
- Configure quality gates
- Implement test automation in GitHub Actions
- Create test reports and notifications
- Practice deployment automation

## Prerequisites

- Completed [CI/CD Integration lesson](../../docs/03-test-automation/08-cicd-integration.md)
- Basic Git/GitHub knowledge
- Familiarity with test automation
- Understanding of YAML syntax

## Setup

### Tools Needed

- GitHub account (free)
- Node.js installed (for sample project)
- Git installed locally

### Sample Project

We'll use a simple Express.js API application.

**Clone starter repository:**
```bash
git clone https://github.com/your-org/sample-api.git
cd sample-api
npm install
```

**Project Structure:**
```
sample-api/
├── src/
│   ├── app.js
│   ├── routes/
│   └── controllers/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
└── .github/
    └── workflows/
        └── ci.yml  (we'll create this)
```

## Part 1: Basic CI Pipeline (45 minutes)

### Exercise 1.1: Create GitHub Actions Workflow

**Create `.github/workflows/ci.yml`:**

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
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run unit tests
      run: npm run test:unit

    - name: Run integration tests
      run: npm run test:integration
```

**Task:**
1. Create this workflow file
2. Commit and push to GitHub
3. Observe pipeline execution in GitHub Actions tab
4. Document results

### Exercise 1.2: Add Code Coverage

**Update workflow to collect coverage:**

```yaml
    - name: Run tests with coverage
      run: npm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/coverage-final.json
        fail_ci_if_error: true

    - name: Check coverage threshold
      run: |
        COVERAGE=$(node -pe "require('./coverage/coverage-summary.json').total.lines.pct")
        if (( $(echo "$COVERAGE < 80" | bc -l) )); then
          echo "Coverage $COVERAGE% is below 80% threshold"
          exit 1
        fi
```

**Verify:**
- Coverage report generated
- Threshold check works
- Pipeline fails if coverage <80%

## Part 2: Quality Gates (45 minutes)

### Exercise 2.1: Multi-Stage Pipeline

**Create pipeline with multiple stages:**

```yaml
name: Quality Pipeline

on:
  pull_request:
    branches: [ main ]

jobs:
  # Stage 1: Lint and Format
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  # Stage 2: Unit Tests
  unit-tests:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - uses: actions/upload-artifact@v3
        with:
          name: unit-test-results
          path: test-results/

  # Stage 3: Integration Tests
  integration-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@postgres:5432/testdb

  # Stage 4: Security Scan
  security:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm audit --audit-level=high
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Stage 5: E2E Tests
  e2e-tests:
    needs: [unit-tests, integration-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-screenshots
          path: tests/e2e/screenshots/
```

**Task:**
- Implement this multi-stage pipeline
- Make one test fail in each stage
- Observe pipeline behavior (should stop at first failure)
- Fix tests and re-run

### Exercise 2.2: Quality Gate Conditions

**Add quality gate checks:**

```yaml
  quality-gate:
    needs: [unit-tests, integration-tests, security, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - name: Quality Gate Check
        run: |
          echo "All quality checks passed!"
          echo "✅ Linting passed"
          echo "✅ Unit tests passed"
          echo "✅ Integration tests passed"
          echo "✅ Security scan passed"
          echo "✅ E2E tests passed"
          echo "🎉 Ready to merge!"
```

**Configure branch protection:**
1. Go to repository Settings → Branches
2. Add branch protection rule for `main`
3. Require status checks to pass: Select all jobs
4. Require pull request reviews

**Test:**
- Create PR with failing test
- Verify: Cannot merge until all checks pass
- Fix test and verify merge is allowed

## Part 3: Parallel Testing (45 minutes)

### Exercise 3.1: Matrix Testing

**Test across multiple configurations:**

```yaml
  test-matrix:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
        exclude:
          - os: macos-latest
            node: 16
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm test
```

**Verify:**
- Tests run on all combinations
- 8 jobs run in parallel (3 OS × 3 Node versions - 1 excluded)
- View matrix results

### Exercise 3.2: Sharded Test Execution

**Split tests for parallel execution:**

```yaml
  e2e-sharded:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:e2e -- --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.shard }}
          path: test-results/
```

**Benefits:**
- 4x faster execution (4 parallel shards)
- Better resource utilization

## Part 4: Test Reporting (45 minutes)

### Exercise 4.1: Generate Test Reports

**Add test reporting:**

```yaml
  test-and-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci

      - name: Run tests with JUnit reporter
        run: npm test -- --reporter=junit --reporter-option=output=./test-results/junit.xml

      - name: Publish Test Results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: test-results/**/*.xml
          check_name: Test Results

      - name: Create test summary
        if: always()
        run: |
          echo "## Test Results 📊" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Category | Passed | Failed | Skipped |" >> $GITHUB_STEP_SUMMARY
          echo "|----------|--------|--------|---------|" >> $GITHUB_STEP_SUMMARY
          echo "| Unit | 45 | 0 | 2 |" >> $GITHUB_STEP_SUMMARY
          echo "| Integration | 23 | 1 | 0 |" >> $GITHUB_STEP_SUMMARY
          echo "| E2E | 12 | 0 | 0 |" >> $GITHUB_STEP_SUMMARY
```

### Exercise 4.2: Notifications

**Add Slack notifications:**

```yaml
      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "❌ Pipeline failed for ${{ github.repository }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "❌ *Pipeline Failed*\n*Repository:* ${{ github.repository }}\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Pipeline"
                      },
                      "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Part 5: Deployment Pipeline (30 minutes)

### Exercise 5.1: Deploy on Success

**Add deployment stage:**

```yaml
  deploy-staging:
    needs: [quality-gate]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # Add actual deployment commands
          # e.g., deploy to Vercel, AWS, etc.

  deploy-production:
    needs: [quality-gate]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Production deployment
```

**Configure environments:**
1. Settings → Environments
2. Create "staging" and "production"
3. Add protection rules for production
4. Require manual approval

## Deliverables

Create CI/CD pipeline documentation:

1. **Pipeline Diagram**
   - Visual flow of all stages
   - Decision points
   - Parallel execution paths

2. **Configuration Files**
   - Complete workflow YAML files
   - Quality gate definitions
   - Environment configurations

3. **Metrics Dashboard**
   - Pipeline success rate
   - Average execution time
   - Test coverage trends
   - Deployment frequency

4. **Runbook**
   - How to add new tests
   - How to troubleshoot failures
   - How to deploy manually

## Bonus Challenges

1. **Performance Testing in CI:**
   - Add k6 load tests
   - Define performance budgets
   - Fail pipeline if performance degrades

2. **Visual Regression Testing:**
   - Add Percy or Chromatic
   - Compare screenshots
   - Require approval for visual changes

3. **Dependency Updates:**
   - Configure Dependabot
   - Auto-merge minor updates if tests pass
   - Notify on major updates

4. **Custom Actions:**
   - Create reusable GitHub Action
   - Publish to marketplace
   - Use in multiple projects

## Evaluation Criteria

- Pipeline completeness
- Appropriate quality gates
- Test coverage and reporting
- Notification setup
- Documentation quality

## Next Steps

- Implement in real projects
- Learn Jenkins, GitLab CI, CircleCI
- Explore advanced deployment strategies (blue/green, canary)
- Study GitOps with ArgoCD/Flux
