# Flaky Test Prevention

## Overview

Flaky tests are tests that pass or fail randomly without code changes. They're one of the most frustrating problems in test automation, eroding trust in the test suite and slowing down development.

## The Cost of Flaky Tests

### Real-World Impact

```
Scenario: E-commerce company with 5,000 automated tests

Before fixing flaky tests:
- 10% flakiness rate (500 flaky tests)
- CI pipeline fails 30% of the time due to flaky tests
- Developers re-run CI 3x on average
- Each CI run: 30 minutes
- Time wasted per day: 30 min × 3 reruns × 50 PRs = 75 hours/day
- Team of 20 engineers → 3.75 hours wasted per engineer per day

After fixing flaky tests:
- 1% flakiness rate (50 flaky tests)
- CI pipeline fails 2% of the time
- Developers re-run CI rarely
- Time saved: 70 hours/day = $175,000/month in engineer time
```

**Flaky tests are NOT free. They cost time, money, and trust.**

---

## Common Causes of Flaky Tests

### 1. Timing Issues

**Problem: Race conditions and async operations**

```javascript
// ❌ Flaky: Hardcoded wait
test('user sees welcome message', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForTimeout(2000); // Hardcoded 2 second wait
  const message = await page.locator('.welcome').textContent();
  expect(message).toBe('Welcome, User!');
  // Fails if API takes > 2 seconds
});

// ✅ Fixed: Wait for specific condition
test('user sees welcome message', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForSelector('.welcome', { state: 'visible' });
  const message = await page.locator('.welcome').textContent();
  expect(message).toBe('Welcome, User!');
  // Waits only as long as needed (up to default timeout)
});
```

**Playwright's Auto-Wait:**

```javascript
// ✅ Playwright automatically waits for elements
await page.click('button'); // Waits for button to be clickable
await page.fill('input', 'text'); // Waits for input to be editable

// No manual waits needed!
```

### 2. Animations and Transitions

**Problem: Element moving during interaction**

```javascript
// ❌ Flaky: Element still animating
test('click on dropdown item', async ({ page }) => {
  await page.click('.dropdown-toggle');
  await page.click('.dropdown-item'); // Might miss if animating
});

// ✅ Fixed: Wait for animation to complete
test('click on dropdown item', async ({ page }) => {
  await page.click('.dropdown-toggle');

  // Wait for dropdown to be stable
  const dropdown = page.locator('.dropdown-menu');
  await dropdown.waitFor({ state: 'visible' });
  await page.waitForTimeout(300); // Animation duration

  // Or better: wait for CSS animation to complete
  await page.waitForFunction(() => {
    const el = document.querySelector('.dropdown-menu');
    return el && getComputedStyle(el).animationPlayState === 'paused';
  });

  await page.click('.dropdown-item');
});

// ✅ Best: Disable animations in tests
// playwright.config.js
use: {
  actionTimeout: 5000,
  // Disable CSS animations
  styleTag: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `,
}
```

### 3. Dependency on External Services

**Problem: External API fails or is slow**

```javascript
// ❌ Flaky: Depends on real weather API
test('displays weather', async ({ page }) => {
  await page.goto('/weather');
  // Real API call to weather.com
  await expect(page.locator('.temperature')).toContainText('°F');
  // Fails if API is down or slow
});

// ✅ Fixed: Mock external APIs
test('displays weather', async ({ page }) => {
  // Intercept API call
  await page.route('**/api/weather', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        temperature: 72,
        condition: 'Sunny'
      })
    });
  });

  await page.goto('/weather');
  await expect(page.locator('.temperature')).toContainText('72°F');
  await expect(page.locator('.condition')).toContainText('Sunny');
  // Always reliable
});
```

### 4. Test Order Dependencies

**Problem: Tests depend on previous tests**

```javascript
// ❌ Flaky: Test 2 depends on Test 1
test('create user', async () => {
  // Creates user with ID 123
  await api.createUser({ id: 123, name: 'Test' });
});

test('get user', async () => {
  // Assumes user 123 exists from previous test!
  const user = await api.getUser(123);
  expect(user.name).toBe('Test');
  // Fails if tests run in different order or in parallel
});

// ✅ Fixed: Independent tests
test('get user', async () => {
  // Create user in this test
  const created = await api.createUser({ name: 'Test' });

  // Use the ID from creation
  const user = await api.getUser(created.id);
  expect(user.name).toBe('Test');

  // Cleanup
  await api.deleteUser(created.id);
});
```

### 5. Shared State / Test Data

**Problem: Tests share database or cache**

```javascript
// ❌ Flaky: Tests modify same data
test('update user 1', async () => {
  await db.users.update(1, { name: 'Updated' });
  const user = await db.users.find(1);
  expect(user.name).toBe('Updated');
});

test('user 1 has original name', async () => {
  const user = await db.users.find(1);
  expect(user.name).toBe('Original'); // Fails if first test ran
});

// ✅ Fixed: Unique test data per test
test('update user', async () => {
  // Create unique user for this test
  const user = await db.users.create({ name: 'Original' });

  await db.users.update(user.id, { name: 'Updated' });
  const updated = await db.users.find(user.id);
  expect(updated.name).toBe('Updated');

  // Cleanup
  await db.users.delete(user.id);
});

test('user has original name', async () => {
  // Create own user
  const user = await db.users.create({ name: 'Original' });
  expect(user.name).toBe('Original');

  await db.users.delete(user.id);
});
```

### 6. Time-Based Logic

**Problem: Tests depend on current time**

```javascript
// ❌ Flaky: Depends on system time
test('shows correct greeting', async ({ page }) => {
  await page.goto('/dashboard');
  const hour = new Date().getHours();

  if (hour < 12) {
    await expect(page.locator('.greeting')).toContainText('Good morning');
  } else if (hour < 18) {
    await expect(page.locator('.greeting')).toContainText('Good afternoon');
  } else {
    await expect(page.locator('.greeting')).toContainText('Good evening');
  }
  // Fails at exactly 12:00 or 18:00 (race condition)
});

// ✅ Fixed: Mock time
test('shows morning greeting', async ({ page }) => {
  // Mock time to 10 AM
  await page.addInitScript(() => {
    Date.now = () => new Date('2025-01-22T10:00:00').getTime();
  });

  await page.goto('/dashboard');
  await expect(page.locator('.greeting')).toContainText('Good morning');
});

test('shows evening greeting', async ({ page }) => {
  // Mock time to 8 PM
  await page.addInitScript(() => {
    Date.now = () => new Date('2025-01-22T20:00:00').getTime();
  });

  await page.goto('/dashboard');
  await expect(page.locator('.greeting')).toContainText('Good evening');
});
```

### 7. Non-Deterministic Selectors

**Problem: Multiple elements match selector**

```javascript
// ❌ Flaky: Multiple buttons with same class
test('click submit button', async ({ page }) => {
  await page.click('button.submit'); // Which one?
  // Sometimes clicks the right button, sometimes wrong one
});

// ✅ Fixed: Unique selectors
test('click submit button', async ({ page }) => {
  // Use text content
  await page.click('button:has-text("Submit Order")');

  // Or test ID
  await page.click('[data-testid="submit-order-button"]');

  // Or role with name
  await page.getByRole('button', { name: 'Submit Order' }).click();
});
```

### 8. Resource Leaks

**Problem: Browser or memory not cleaned up**

```javascript
// ❌ Flaky: Resources not cleaned up
let browser;

beforeAll(async () => {
  browser = await chromium.launch();
});

test('test 1', async () => {
  const page = await browser.newPage();
  // ... test code
  // ❌ Forgot to close page!
});

test('test 100', async () => {
  const page = await browser.newPage();
  // ... test code
  // Fails due to memory leak from 99 unclosed pages
});

// ✅ Fixed: Clean up resources
test('test', async ({ page }) => {
  // Playwright fixtures automatically handle cleanup
  // Page closed after test
});

// Or manually:
test('manual test', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // ... test code
  } finally {
    await page.close();
    await browser.close(); // Always clean up
  }
});
```

---

## Detecting Flaky Tests

### 1. Re-run Failed Tests

```javascript
// playwright.config.js
module.exports = {
  retries: 2, // Retry failed tests up to 2 times

  // Only retry in CI
  retries: process.env.CI ? 2 : 0,
};
```

**Interpretation:**
- Test passes first time: ✅ Stable
- Test fails first time, passes on retry: ⚠️ Flaky
- Test fails all 3 times: ❌ Real failure

### 2. Repeat Tests Multiple Times

```bash
# Run test 100 times to detect flakiness
for i in {1..100}; do
  npx playwright test login.spec.js
done

# Count failures
# 0 failures: Stable
# 1-10 failures: Flaky (10% flakiness)
# 100 failures: Broken
```

**Automated:**

```javascript
// playwright.config.js
module.exports = {
  repeatEach: 3, // Run each test 3 times
};
```

### 3. Track Flakiness Metrics

```javascript
// custom-reporter.js
class FlakinessReporter {
  constructor() {
    this.results = new Map(); // testName -> [pass, fail, pass]
  }

  onTestEnd(test, result) {
    const testName = test.title;
    if (!this.results.has(testName)) {
      this.results.set(testName, []);
    }
    this.results.get(testName).push(result.status);
  }

  onEnd() {
    console.log('\nFlakiness Report:\n');

    for (const [testName, results] of this.results) {
      const passes = results.filter(r => r === 'passed').length;
      const failures = results.filter(r => r === 'failed').length;
      const total = results.length;

      if (failures > 0 && passes > 0) {
        const flakinessRate = (failures / total * 100).toFixed(1);
        console.log(`⚠️  FLAKY (${flakinessRate}%): ${testName}`);
      }
    }
  }
}

module.exports = FlakinessReporter;
```

---

## Fixing Flaky Tests

### Strategy 1: Add Explicit Waits

```javascript
// Wait for element
await page.waitForSelector('.result');

// Wait for URL
await page.waitForURL('**/dashboard');

// Wait for response
await page.waitForResponse(response =>
  response.url().includes('/api/data') && response.status() === 200
);

// Wait for function
await page.waitForFunction(() => window.dataLoaded === true);

// Wait for load state
await page.waitForLoadState('networkidle');
```

### Strategy 2: Increase Timeouts

```javascript
// playwright.config.js
module.exports = {
  timeout: 60000, // Test timeout: 60 seconds
  expect: {
    timeout: 10000, // Assertion timeout: 10 seconds
  },
  use: {
    actionTimeout: 5000, // Action timeout: 5 seconds
    navigationTimeout: 30000, // Navigation timeout: 30 seconds
  },
};

// Per-test timeout
test('slow operation', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes for this test
  // ... slow operation
});
```

### Strategy 3: Mock External Dependencies

```javascript
test('with mocked API', async ({ page }) => {
  // Mock all API calls
  await page.route('**/api/**', route => {
    const url = route.request().url();

    if (url.includes('/api/users')) {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' }
        ])
      });
    } else {
      route.continue(); // Let other requests through
    }
  });

  await page.goto('/users');
  // Now fully deterministic
});
```

### Strategy 4: Isolate Tests

```javascript
// Use test.describe.configure for isolation
test.describe.configure({ mode: 'parallel' });

test.describe('isolated tests', () => {
  test.beforeEach(async ({ page }) => {
    // Fresh state for each test
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test('test 1', async ({ page }) => {
    // Isolated
  });

  test('test 2', async ({ page }) => {
    // Isolated
  });
});
```

### Strategy 5: Use Unique Test Data

```javascript
// Generate unique email for each test
function generateUniqueEmail() {
  return `test-${Date.now()}-${Math.random().toString(36)}@example.com`;
}

test('register user', async ({ page }) => {
  const email = generateUniqueEmail();

  await page.goto('/register');
  await page.fill('#email', email);
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');

  // No conflicts with other tests
});
```

---

## Best Practices

### 1. Never Use Arbitrary Timeouts

```javascript
// ❌ Bad: Arbitrary wait
await page.waitForTimeout(5000);

// ✅ Good: Wait for specific condition
await page.waitForSelector('.loaded');
```

### 2. Disable Animations in Tests

```javascript
// Global CSS to disable animations
// playwright.config.js
use: {
  styleTag: `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  `,
}
```

### 3. Make Tests Idempotent

```javascript
// Tests should be runnable multiple times
test('idempotent test', async () => {
  const uniqueId = Date.now();

  // Create
  await api.createResource(uniqueId, { name: 'Test' });

  // Cleanup (always, even if test fails)
  try {
    // Test assertions...
  } finally {
    await api.deleteResource(uniqueId);
  }
});
```

### 4. Avoid Sleep/Wait Unless Necessary

```javascript
// ❌ Bad
await page.waitForTimeout(1000);
await page.click('button');

// ✅ Good
await page.click('button'); // Auto-waits
```

### 5. Use Stable Locators

```javascript
// Priority order:
// 1. Accessible roles and labels
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email');

// 2. Test IDs
await page.getByTestId('submit-button');

// 3. Stable attributes
await page.locator('[name="email"]');

// Avoid:
await page.locator('.btn.btn-primary:nth-child(3)'); // ❌ Fragile
```

---

## Quarantine Pattern

**When you can't fix a flaky test immediately, quarantine it:**

```javascript
// Mark test as flaky
test.fixme('flaky test', async ({ page }) => {
  // Test code...
});

// Or skip
test.skip('flaky test', async ({ page }) => {
  // Test code...
});

// Track in issue tracker
// TODO: Fix flaky test - Issue #123
```

**Create a "Flaky Tests" suite:**

```javascript
// tests/flaky/
// - Move flaky tests here
// - Run separately (nightly, not on every PR)
// - Fix one by one
```

---

## What Senior Engineers Know

**Flaky tests are tech debt.** Fix them immediately or quarantine them. Don't let them rot in your suite.

**1 flaky test ruins trust in 1000 stable tests.** Developers learn to ignore failures, and real bugs slip through.

**Most flakiness is timing-related.** Use auto-wait, wait for specific conditions, never use hard waits.

**Mock external dependencies.** Tests should not depend on external APIs, databases, or services you don't control.

**Measure flakiness.** Track flakiness rate over time. Target: < 1%. If > 5%, you have a serious problem.

---

## Exercise

**Debug Flaky Test:**

Given this flaky test:

```javascript
test('search returns results', async ({ page }) => {
  await page.goto('/search');
  await page.fill('input[name="query"]', 'laptop');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const results = await page.locator('.result').count();
  expect(results).toBeGreaterThan(0);
});
```

**Problems:**
1. Hardcoded wait (2 seconds)
2. Results might load slower
3. Selector might match multiple elements

**Fix it:**
- Remove hardcoded wait
- Wait for specific element
- Add retry logic if needed
- Mock API if external

---

## Next Steps

- Integrate tests with [CI/CD](08-cicd-integration.md)
- Implement [Test Reporting](09-reporting-analytics.md)
- Review [Automation Strategy](01-automation-strategy.md)
- Master [UI Automation Principles](02-ui-automation-principles.md)
