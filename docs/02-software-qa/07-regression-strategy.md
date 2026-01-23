# Regression Testing Strategy

## Overview

Regression testing verifies that new code changes haven't broken existing functionality. As applications grow, regression testing becomes critical for maintaining quality while moving fast.

## Why Regression Testing Matters

### The Cost of Regression Bugs

**Real-World Example:**

```
Company XYZ releases new checkout flow (Feature A)
→ Existing feature: Password reset breaks (Feature B from 6 months ago)
→ Customers can't log in
→ Support tickets spike
→ Revenue lost
→ Emergency hotfix required
→ Team works weekend
```

**Problem:** Feature A had nothing to do with password reset. But a shared library change broke it.

### Without Regression Testing

- ❌ Old features break silently
- ❌ Customer trust erodes
- ❌ Production hotfixes increase
- ❌ Technical debt accumulates
- ❌ Fear of deploying

### With Regression Testing

- ✅ Confidence in deployments
- ✅ Fast feedback on breaks
- ✅ Catch issues before production
- ✅ Reduce manual testing effort
- ✅ Enable continuous deployment

---

## Types of Regression Testing

### 1. Complete Regression (Retest All)

**What:** Run entire test suite on every change

**When:**
- Major release
- Core architecture changes
- Database migrations
- Third-party library updates

**Pros:**
- Maximum coverage
- Finds hidden dependencies

**Cons:**
- Time-consuming
- Expensive (CI/CD costs)
- Slow feedback

**Example:**
```bash
# Run all 10,000 tests
npm run test:all
# Duration: 2 hours
```

### 2. Selective Regression (Risk-Based)

**What:** Run tests related to changed code

**When:**
- Feature development
- Bug fixes
- Most pull requests

**Pros:**
- Faster feedback (10-20 minutes vs 2 hours)
- Cost-effective
- Practical for frequent releases

**Cons:**
- May miss unexpected dependencies
- Requires good test organization

**Example:**
```bash
# Only run tests for payment module
npm run test:payment
# Duration: 15 minutes
```

### 3. Progressive Regression

**What:** Add new tests for new features, keep old tests

**When:**
- Continuous integration
- Agile development

**Strategy:**
```
Release 1.0: 100 tests
Release 1.1: 100 old + 50 new = 150 tests
Release 1.2: 150 old + 75 new = 225 tests
```

**Challenge:** Test suite grows continuously

**Solution:** Refactor and remove redundant tests

### 4. Corrective Regression

**What:** Rerun tests that failed previously

**When:**
- Bug fix verification
- Flaky test investigation

**Example:**
```bash
# Rerun failed tests from last run
npm run test:failed
```

---

## Building a Regression Test Suite

### Test Selection Criteria

**What to Include in Regression Suite:**

| Priority | What to Test | Why |
|----------|--------------|-----|
| **Critical** | Core business functionality | Revenue impact, user-blocking |
| **Critical** | Authentication/Authorization | Security, access control |
| **Critical** | Payment processing | Financial loss risk |
| **Critical** | Data integrity operations | Data loss/corruption |
| **High** | Frequently used features | High user impact |
| **High** | Recently changed code | High defect probability |
| **High** | Previously buggy areas | Historical defect patterns |
| **Medium** | Integration points | Cross-system dependencies |
| **Medium** | Complex business logic | High complexity = high risk |
| **Low** | Rarely used features | Low user impact |

### Test Pyramid for Regression

```
         /\
        /E2E\         10% - Critical user journeys
       /______\       (Login, Checkout, Payment)
      /        \
     /  API     \     30% - API contracts, integration
    /____________\    (REST endpoints, GraphQL, gRPC)
   /              \
  /  Unit Tests    \  60% - Business logic, utilities
 /__________________\ (Functions, classes, modules)
```

**Why this distribution?**

- **Unit tests:** Fast (milliseconds), cheap, catch 60% of bugs
- **API tests:** Medium speed (seconds), catch integration issues
- **E2E tests:** Slow (minutes), expensive, catch critical user-facing bugs

### Example Regression Suite Structure

```
regression-tests/
├── critical/              # Must pass before deployment
│   ├── auth/
│   │   ├── login.test.js
│   │   ├── logout.test.js
│   │   └── password-reset.test.js
│   ├── payment/
│   │   ├── checkout.test.js
│   │   ├── process-payment.test.js
│   │   └── refund.test.js
│   └── data-integrity/
│       ├── user-crud.test.js
│       └── order-crud.test.js
│
├── high-priority/         # Run on every PR
│   ├── search/
│   ├── profile/
│   └── notifications/
│
├── medium-priority/       # Run nightly
│   ├── admin-panel/
│   ├── reporting/
│   └── settings/
│
└── low-priority/          # Run weekly
    ├── help-center/
    └── legal-pages/
```

---

## Regression Testing Strategies

### 1. Test Impact Analysis

**Identify affected tests based on code changes.**

**Example with Git:**

```bash
# Find changed files in PR
git diff --name-only main...feature-branch

# Output:
# src/payment/process-payment.js
# src/payment/validate-card.js
```

**Map to tests:**

```javascript
// test-impact-analyzer.js
const changedFiles = getChangedFiles(); // ['src/payment/process-payment.js']

const affectedTests = {
  'src/payment/process-payment.js': [
    'tests/payment/process-payment.test.js',
    'tests/integration/checkout-flow.test.js',
    'tests/e2e/complete-purchase.test.js'
  ]
};

// Run only affected tests
const testsToRun = changedFiles.flatMap(file => affectedTests[file] || []);
runTests(testsToRun);
```

**Tools:**
- **Facebook's Jest**: `--onlyChanged` flag
- **Bazel**: Dependency-aware test runner
- **Nx**: Affected command for monorepos

### 2. Risk-Based Regression

**Prioritize tests based on risk.**

**Risk Matrix:**

| Feature | Change Frequency | Defect History | User Impact | Risk Score | Test Priority |
|---------|------------------|----------------|-------------|------------|---------------|
| Login | Low | High (5 bugs) | Critical | 8/10 | P0 |
| Payment | Medium | High (8 bugs) | Critical | 9/10 | P0 |
| Search | High | Medium (3 bugs) | High | 7/10 | P1 |
| Profile | Low | Low (1 bug) | Medium | 3/10 | P2 |
| Help Center | Low | None | Low | 1/10 | P3 |

**Risk Score Formula:**

```
Risk = (Change Frequency × 0.3) + (Defect History × 0.4) + (User Impact × 0.3)

Where:
- Change Frequency: 0-10 (0 = never, 10 = daily)
- Defect History: 0-10 (based on # of bugs)
- User Impact: 0-10 (0 = no users affected, 10 = all users blocked)
```

**Test Strategy:**

```javascript
// Run tests based on risk scores
if (riskScore >= 8) {
  runTests('critical'); // Full test suite
} else if (riskScore >= 5) {
  runTests('high-priority'); // Smoke + integration
} else {
  runTests('smoke'); // Basic sanity
}
```

### 3. Time-Boxed Regression

**Set maximum time for regression testing.**

**Example:**

```
Regression Time Budget: 30 minutes max

Breakdown:
- Critical tests: 15 minutes (must pass)
- High-priority tests: 10 minutes (should pass)
- Medium-priority tests: 5 minutes (nice to pass)

If any critical test fails: Block deployment
If high-priority fails: Notify team, allow with approval
If medium fails: Log for future investigation
```

**Implementation:**

```yaml
# .github/workflows/regression.yml
name: Regression Tests

on: [pull_request]

jobs:
  critical-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v3
      - run: npm run test:critical
      # Fails if tests take > 15 min or any test fails

  high-priority-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    continue-on-error: true  # Don't block deployment
    steps:
      - run: npm run test:high
```

### 4. Regression Test Automation

**Automate regression tests in CI/CD.**

**GitHub Actions Example:**

```yaml
name: Regression Suite

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Run nightly at 2 AM

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  api-tests:
    needs: unit-tests
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

  e2e-tests:
    needs: api-tests
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
```

---

## Test Maintenance

### Problem: Test Suite Grows, Slows Down

**Initial State:**
```
Year 1: 500 tests, runtime 5 minutes ✅
Year 2: 1,500 tests, runtime 15 minutes ✅
Year 3: 5,000 tests, runtime 60 minutes ⚠️
Year 4: 12,000 tests, runtime 180 minutes ❌
```

**Solution: Regular Test Maintenance**

### 1. Remove Redundant Tests

**Example:**

```javascript
// Redundant tests testing same thing
describe('Login', () => {
  it('should login with valid credentials', () => { /* ... */ });
  it('should log in with correct email and password', () => { /* ... */ }); // REDUNDANT
  it('should successfully authenticate user', () => { /* ... */ }); // REDUNDANT
});

// After cleanup:
describe('Login', () => {
  it('should login with valid credentials', () => { /* ... */ });
  // Removed 2 redundant tests
});
```

### 2. Refactor Slow Tests

**Before:**

```javascript
// Slow test: Creates real database records
it('should display user dashboard', async () => {
  const user = await createUserInDatabase(); // 500ms
  const session = await createSession(user); // 200ms
  const response = await api.get('/dashboard', { session }); // 100ms
  expect(response.data.username).toBe(user.username);
  await cleanupDatabase(); // 300ms
  // Total: 1100ms
});
```

**After:**

```javascript
// Fast test: Uses mocks
it('should display user dashboard', async () => {
  const user = mockUser(); // 1ms
  const session = mockSession(user); // 1ms
  jest.spyOn(api, 'get').mockResolvedValue({ data: { username: user.username } }); // 1ms
  const response = await api.get('/dashboard', { session });
  expect(response.data.username).toBe(user.username);
  // Total: 3ms (367x faster!)
});
```

### 3. Parallelize Tests

**Sequential (Slow):**

```bash
# Run tests sequentially
npm run test:suite1  # 10 min
npm run test:suite2  # 10 min
npm run test:suite3  # 10 min
# Total: 30 minutes
```

**Parallel (Fast):**

```bash
# Run tests in parallel
npm run test:suite1 &
npm run test:suite2 &
npm run test:suite3 &
wait
# Total: 10 minutes (3x faster!)
```

**GitHub Actions Parallel Jobs:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        suite: [unit, integration, e2e]
    steps:
      - run: npm run test:${{ matrix.suite }}
# All suites run in parallel
```

### 4. Flaky Test Quarantine

**Problem:** Flaky tests (pass/fail randomly) erode trust

**Solution:** Quarantine flaky tests

```javascript
// Mark flaky test
describe('Search', () => {
  it.skip('should handle concurrent searches', () => {
    // FLAKY: Fails 10% of time due to race condition
    // TODO: Fix and re-enable
  });
});
```

**Track in issue tracker:**

```markdown
# FLAKY-001: Concurrent search test fails intermittently

**Test:** tests/search/concurrent.test.js
**Failure rate:** 10%
**Root cause:** Race condition in search indexing
**Owner:** @john
**Priority:** High
**Status:** In Progress
```

---

## Regression Testing Metrics

### 1. Test Coverage

```
Test Coverage = (Lines Executed / Total Lines) × 100%

Target: 80% for critical code, 60% overall
```

**Example:**

```bash
# Generate coverage report
npm run test:coverage

# Output:
# File                | % Stmts | % Branch | % Funcs | % Lines |
# -------------------|---------|----------|---------|---------|
# All files          |   78.5  |   65.2   |   82.1  |   77.9  |
#  payment/          |   95.2  |   90.1   |   100   |   94.8  | ✅
#  auth/             |   88.7  |   75.3   |   91.2  |   87.5  | ✅
#  search/           |   62.1  |   48.9   |   68.4  |   61.3  | ⚠️
#  admin/            |   45.2  |   32.1   |   50.0  |   44.8  | ❌
```

### 2. Defect Escape Rate

```
Defect Escape Rate = (Bugs Found in Prod / Total Bugs) × 100%

Target: < 5%
```

**Example:**

```
Q1 2025:
- Bugs found in testing: 95
- Bugs found in production: 5
- Defect Escape Rate: 5/100 = 5% ✅

Q2 2025:
- Bugs found in testing: 80
- Bugs found in production: 20
- Defect Escape Rate: 20/100 = 20% ❌
```

**Action:** Defect escape rate increased. Investigate:
- Were regression tests skipped?
- New feature not covered by tests?
- Tests too shallow?

### 3. Test Execution Time

```
Target: < 30 minutes for fast feedback
```

**Trend:**

```
Jan: 15 minutes ✅
Feb: 18 minutes ✅
Mar: 25 minutes ✅
Apr: 35 minutes ❌ (Too slow!)
```

**Action:** Optimize tests (parallelize, refactor slow tests)

### 4. Test Flakiness Rate

```
Flakiness Rate = (Flaky Test Runs / Total Test Runs) × 100%

Target: < 1%
```

**Example:**

```
Test: "User checkout flow"
Runs: 100
Failures: 8
Failure patterns:
- 2 failures: Timeout
- 3 failures: Element not found
- 3 failures: Network error

Flakiness Rate: 8% ❌ (Too high!)
```

**Action:** Fix or quarantine flaky test

---

## Regression Testing Best Practices

### 1. Start Small, Grow Gradually

**Don't try to automate everything at once.**

```
Week 1: Automate login (5 tests)
Week 2: Add checkout (10 tests)
Week 3: Add user profile (8 tests)
Week 4: Add search (12 tests)
...
Month 3: 150 tests ✅
Month 6: 500 tests ✅
```

### 2. Keep Tests Independent

**Bad (Tests depend on each other):**

```javascript
describe('User Flow', () => {
  let userId;

  it('should register user', async () => {
    const response = await api.post('/register', { email: 'test@example.com' });
    userId = response.data.id; // State leaks to next test
  });

  it('should login user', async () => {
    const response = await api.post('/login', { email: 'test@example.com' });
    expect(response.data.id).toBe(userId); // Depends on previous test!
  });
});
```

**Good (Tests are independent):**

```javascript
describe('User Registration', () => {
  it('should register user', async () => {
    const response = await api.post('/register', { email: 'test1@example.com' });
    expect(response.status).toBe(201);
  });
});

describe('User Login', () => {
  beforeEach(async () => {
    // Setup: Create user before each test
    await createUser({ email: 'test2@example.com', password: 'password' });
  });

  it('should login user', async () => {
    const response = await api.post('/login', {
      email: 'test2@example.com',
      password: 'password'
    });
    expect(response.status).toBe(200);
  });
});
```

### 3. Use Test Data Builders

**Pattern:**

```javascript
// user-builder.js
class UserBuilder {
  constructor() {
    this.user = {
      email: 'default@example.com',
      name: 'Default User',
      password: 'Password123!',
      role: 'user'
    };
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  withRole(role) {
    this.user.role = role;
    return this;
  }

  asAdmin() {
    this.user.role = 'admin';
    return this;
  }

  build() {
    return this.user;
  }
}

// Usage in tests
it('should allow admin to delete users', async () => {
  const admin = new UserBuilder()
    .withEmail('admin@example.com')
    .asAdmin()
    .build();

  const response = await api.delete('/users/123', { user: admin });
  expect(response.status).toBe(200);
});
```

### 4. Clear Test Names

**Bad:**

```javascript
it('test1', () => { /* ... */ });
it('should work', () => { /* ... */ });
it('checks user', () => { /* ... */ });
```

**Good:**

```javascript
it('should reject login with invalid password', () => { /* ... */ });
it('should allow user to update profile with valid data', () => { /* ... */ });
it('should return 404 when user does not exist', () => { /* ... */ });
```

---

## What Senior Engineers Know

**Regression tests are an investment.** They cost time to write and maintain but save exponentially more time by catching bugs early.

**100% test coverage is a waste.** Aim for 80% coverage of critical paths. Diminishing returns after that.

**Flaky tests are worse than no tests.** They erode trust. Team ignores failures. Fix or delete flaky tests immediately.

**Fast tests win.** 5-minute feedback loop gets run often. 2-hour suite gets ignored or skipped. Optimize for speed.

**Tests are code too.** Apply same quality standards: DRY, clear names, refactor, review.

---

## Exercise

**Design Regression Strategy:**

You're working on an e-commerce application with:
- 5,000 unit tests (runtime: 10 min)
- 500 API tests (runtime: 20 min)
- 50 E2E tests (runtime: 30 min)

**Total runtime: 60 minutes** (too slow for PR checks!)

**Your Task:**

1. **Categorize tests into:** Critical (P0), High (P1), Medium (P2), Low (P3)
2. **Design test strategy for:**
   - Every PR (target: < 15 minutes)
   - Main branch merge (target: < 30 minutes)
   - Nightly builds (can be 60+ minutes)
3. **Propose optimization plan** to reduce runtime by 50%
4. **Define metrics** to track regression test health

**Deliverable:** Regression testing strategy document.

---

## Next Steps

- Master [Test Data Management](08-test-data-management.md) for realistic regression tests
- Learn [CI/CD Quality Gates](05-cicd-quality-gates.md) to automate regression
- Study [Test Automation](../03-test-automation/) for building maintainable suites
- Practice [Flaky Test Prevention](../03-test-automation/07-flaky-test-prevention.md)
