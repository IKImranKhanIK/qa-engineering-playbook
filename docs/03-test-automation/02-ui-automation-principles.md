# UI Automation Principles

## Overview

UI automation tests interact with applications through the user interface, simulating real user behavior. When done well, UI automation provides confidence that critical user journeys work. When done poorly, it creates slow, flaky tests that the team learns to ignore.

## Why UI Automation is Hard

### The Challenges

**1. UI Changes Frequently**
- New features added
- Design updates
- A/B tests
- Refactoring

**2. Timing Issues**
- Async operations
- Network delays
- Animations
- Loading states

**3. Environment Variability**
- Different browsers
- Different screen sizes
- Different network speeds
- Different data states

**4. False Negatives (Flaky Tests)**
- Test fails randomly
- Works locally, fails in CI
- Works 9/10 times

**5. False Positives**
- Test passes but app is broken
- Weak assertions
- Wrong element found

---

## Choosing UI Automation Tools

### Popular Tools Comparison

| Tool | Language | Speed | Browser Support | Best For |
|------|----------|-------|-----------------|----------|
| **Playwright** | JS/Python/Java | Fast | Chrome, Firefox, Safari, Edge | Modern web apps, parallel testing |
| **Cypress** | JavaScript | Fast | Chrome, Firefox, Edge | SPAs, great DX, React/Vue/Angular |
| **Selenium** | Multiple | Medium | All major browsers | Legacy apps, cross-browser testing |
| **Puppeteer** | JavaScript | Very Fast | Chrome/Chromium only | Chrome-specific, web scraping |
| **TestCafe** | JavaScript | Medium | All major browsers | No WebDriver needed, easy setup |

### Tool Selection Decision Tree

```
Need to test Safari?
  ├─ Yes → Playwright or Selenium
  └─ No
      Need fastest execution?
        ├─ Yes → Puppeteer or Playwright
        └─ No
            Team knows JavaScript?
              ├─ Yes → Cypress or Playwright
              └─ No → Selenium (supports Java, Python, C#)
```

---

## Playwright Deep Dive

### Why Playwright (Modern Choice)

**Advantages:**
- ✅ Auto-wait (no explicit waits needed)
- ✅ Fast execution
- ✅ Cross-browser (Chrome, Firefox, Safari)
- ✅ Multiple languages (JS, Python, Java, .NET)
- ✅ Network interception
- ✅ Great debugging tools
- ✅ Built-in test runner
- ✅ Parallel execution

**Installation:**

```bash
npm init playwright@latest
# or
npm install -D @playwright/test

# Install browsers
npx playwright install
```

### Basic Playwright Test

```javascript
// tests/login.spec.js
const { test, expect } = require('@playwright/test');

test('user can login with valid credentials', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://example.com/login');

  // Fill in credentials
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForURL('**/dashboard');

  // Assert dashboard loaded
  await expect(page.locator('h1')).toContainText('Dashboard');
  await expect(page.locator('.welcome-message')).toContainText('Welcome, Test User');
});
```

### Playwright Configuration

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Locator Strategies

### Locator Priority (Best to Worst)

**1. Accessibility Attributes (Best)**

```javascript
// By role and accessible name
await page.getByRole('button', { name: 'Login' });
await page.getByRole('textbox', { name: 'Email' });
await page.getByRole('heading', { name: 'Dashboard' });

// By label (form inputs)
await page.getByLabel('Email address');
await page.getByLabel('Password');

// By placeholder
await page.getByPlaceholder('Enter your email');

// By alt text (images)
await page.getByAltText('Company logo');
```

**Why:** Resilient to implementation changes, mirrors how users interact

**2. Test IDs (Good)**

```javascript
// Add data-testid to HTML
<button data-testid="login-button">Login</button>
<input data-testid="email-input" type="email" />

// Use in tests
await page.getByTestId('login-button');
await page.getByTestId('email-input');
```

**Why:** Explicit test hooks, won't change accidentally

**3. CSS Selectors (Okay)**

```javascript
await page.locator('.login-button');
await page.locator('#email-input');
await page.locator('button.primary');
```

**Why:** Common, but fragile (classes change)

**4. XPath (Avoid)**

```javascript
await page.locator('//button[@class="login-button"]');
await page.locator('//div[@id="container"]/form/button[1]');
```

**Why:** Hard to read, very fragile, slow

### Locator Best Practices

**Bad (Fragile):**

```javascript
// Too specific - breaks if structure changes
await page.locator('div > div > form > div:nth-child(3) > button');

// Class-based - breaks if CSS changes
await page.locator('.btn.btn-primary.btn-lg.submit-btn');

// Index-based - breaks if order changes
await page.locator('button').nth(2);
```

**Good (Resilient):**

```javascript
// User-facing attributes
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email address');

// Test IDs for dynamic content
await page.getByTestId('order-123-status');

// Combine locators for specificity
await page.locator('form').getByRole('button', { name: 'Submit' });
```

---

## Waiting Strategies

### The Golden Rule

**Never use hard waits (sleep/timeout) unless absolutely necessary.**

```javascript
// ❌ Bad: Hard wait
await page.waitForTimeout(5000); // Waits full 5 seconds always

// ✅ Good: Wait for condition
await page.waitForSelector('.success-message', { timeout: 5000 }); // Waits only as long as needed
```

### Playwright Auto-Waiting

**Playwright automatically waits for:**
- Element to be visible
- Element to be enabled
- Element to be stable (no animations)

```javascript
// No explicit wait needed!
await page.click('button'); // Auto-waits for button to be clickable
await page.fill('input', 'text'); // Auto-waits for input to be editable
```

### Explicit Waits (When Needed)

```javascript
// Wait for element to appear
await page.waitForSelector('.success-message');

// Wait for element to disappear
await page.waitForSelector('.loading-spinner', { state: 'hidden' });

// Wait for URL change
await page.waitForURL('**/dashboard');

// Wait for network request
await page.waitForResponse(response =>
  response.url().includes('/api/users') && response.status() === 200
);

// Wait for function to return true
await page.waitForFunction(() => document.querySelector('.data-loaded'));

// Wait for load state
await page.waitForLoadState('networkidle');
```

### Handling Async Operations

**Example: Wait for API response**

```javascript
test('should load user data', async ({ page }) => {
  await page.goto('/profile');

  // Wait for API call to complete
  const response = await page.waitForResponse(
    response => response.url().includes('/api/user') && response.status() === 200
  );

  // Verify data loaded
  const data = await response.json();
  expect(data.name).toBeDefined();

  // Verify UI updated
  await expect(page.locator('.user-name')).toContainText(data.name);
});
```

---

## Handling Dynamic Content

### Problem: Element IDs Change

```html
<!-- IDs change on every render -->
<div id="user-1234567890">...</div>
<div id="order-9876543210">...</div>
```

**Solution: Use stable attributes**

```javascript
// Instead of ID, use data attributes or roles
await page.getByTestId('user-card');
await page.getByRole('article', { name: /user profile/i });
```

### Problem: Loading States

```javascript
test('should display search results', async ({ page }) => {
  await page.goto('/search');
  await page.fill('input[name="query"]', 'laptop');
  await page.click('button[type="submit"]');

  // Wait for loading to finish
  await page.waitForSelector('.loading-spinner', { state: 'hidden' });

  // Now safe to check results
  const results = page.locator('.search-result');
  await expect(results).toHaveCount(10);
});
```

### Problem: Animations and Transitions

```javascript
test('should open modal', async ({ page }) => {
  await page.click('button', { name: 'Open Settings' });

  // Wait for animation to complete
  await page.waitForSelector('.modal', { state: 'visible' });
  await page.locator('.modal').waitFor({ state: 'attached' });

  // Verify modal content
  await expect(page.locator('.modal h2')).toContainText('Settings');
});
```

### Problem: Infinite Scroll

```javascript
test('should load more items on scroll', async ({ page }) => {
  await page.goto('/feed');

  // Initial count
  let itemCount = await page.locator('.feed-item').count();
  expect(itemCount).toBe(20);

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait for new items to load
  await page.waitForFunction(
    (prevCount) => document.querySelectorAll('.feed-item').length > prevCount,
    itemCount
  );

  // Verify more items loaded
  const newItemCount = await page.locator('.feed-item').count();
  expect(newItemCount).toBeGreaterThan(itemCount);
});
```

---

## Assertions

### Playwright Assertions

```javascript
// Text assertions
await expect(page.locator('h1')).toHaveText('Dashboard');
await expect(page.locator('.error')).toContainText('Invalid email');

// Visibility assertions
await expect(page.locator('.modal')).toBeVisible();
await expect(page.locator('.loading')).toBeHidden();

// State assertions
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('input')).toBeDisabled();
await expect(page.locator('checkbox')).toBeChecked();

// Count assertions
await expect(page.locator('.item')).toHaveCount(5);

// Attribute assertions
await expect(page.locator('a')).toHaveAttribute('href', '/profile');
await expect(page.locator('input')).toHaveValue('test@example.com');

// URL assertions
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle('Dashboard - MyApp');
```

### Strong vs Weak Assertions

**Weak (Insufficient):**

```javascript
test('login redirects to dashboard', async ({ page }) => {
  await login(page);
  // Just checks URL changed - could be error page!
  await expect(page).not.toHaveURL('/login');
});
```

**Strong (Better):**

```javascript
test('login redirects to dashboard', async ({ page }) => {
  await login(page);

  // Verify specific URL
  await expect(page).toHaveURL('/dashboard');

  // Verify page content
  await expect(page.locator('h1')).toContainText('Dashboard');

  // Verify user data loaded
  await expect(page.locator('.user-name')).toBeVisible();

  // Verify navigation available
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
});
```

---

## Page Interactions

### Clicking

```javascript
// Simple click
await page.click('button');

// Click with options
await page.click('button', {
  button: 'right',  // Right-click
  clickCount: 2,    // Double-click
  delay: 100        // Delay between mousedown and mouseup
});

// Force click (bypass visibility checks)
await page.click('button', { force: true }); // Use sparingly!

// Click at specific position
await page.click('button', { position: { x: 10, y: 10 } });
```

### Typing

```javascript
// Type text
await page.fill('input', 'Hello World');

// Type with delay (simulate human typing)
await page.type('input', 'Hello World', { delay: 100 });

// Press keys
await page.press('input', 'Enter');
await page.press('input', 'Control+A');

// Keyboard shortcuts
await page.keyboard.press('Control+C');
await page.keyboard.press('Meta+V'); // Cmd+V on Mac
```

### Selecting Options

```javascript
// Select by value
await page.selectOption('select', 'option-value');

// Select by label
await page.selectOption('select', { label: 'Option Label' });

// Select multiple
await page.selectOption('select[multiple]', ['value1', 'value2']);
```

### File Upload

```javascript
// Single file
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

// Multiple files
await page.setInputFiles('input[type="file"]', [
  'path/to/file1.pdf',
  'path/to/file2.jpg'
]);

// Upload with buffer
await page.setInputFiles('input[type="file"]', {
  name: 'test.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('File content')
});
```

### Drag and Drop

```javascript
// Drag and drop
await page.dragAndDrop('#source', '#target');

// Manual drag
await page.locator('#source').hover();
await page.mouse.down();
await page.locator('#target').hover();
await page.mouse.up();
```

---

## Handling Different UI Elements

### Modals and Dialogs

```javascript
// Wait for modal to appear
await page.click('button', { name: 'Delete' });
await page.waitForSelector('.modal');

// Interact with modal
await page.locator('.modal').getByRole('button', { name: 'Confirm' }).click();

// Wait for modal to close
await page.waitForSelector('.modal', { state: 'hidden' });

// JavaScript alerts
page.on('dialog', async dialog => {
  expect(dialog.message()).toBe('Are you sure?');
  await dialog.accept(); // or dialog.dismiss()
});

await page.click('button', { name: 'Delete' }); // Triggers alert
```

### Frames and iframes

```javascript
// Locate frame
const frame = page.frameLocator('iframe[name="payment-frame"]');

// Interact with elements in frame
await frame.locator('input[name="card-number"]').fill('4111111111111111');
await frame.locator('button').click();

// Wait for frame to load
await page.waitForLoadState('domcontentloaded');
```

### Shadow DOM

```javascript
// Penetrate shadow DOM
await page.locator('custom-element').locator('button').click();

// Or use deep selectors
await page.locator('custom-element >>> button').click();
```

### Multiple Tabs/Windows

```javascript
test('should open link in new tab', async ({ context, page }) => {
  // Listen for new page
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('a[target="_blank"]')
  ]);

  // Interact with new tab
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/terms/);

  // Close new tab
  await newPage.close();
});
```

---

## Mobile Testing

```javascript
// playwright.config.js
const { devices } = require('@playwright/test');

module.exports = {
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
};
```

```javascript
// Mobile-specific interactions
test('should test mobile menu', async ({ page }) => {
  await page.goto('/');

  // Tap (mobile click)
  await page.tap('.hamburger-menu');

  // Swipe
  await page.locator('.carousel').hover();
  await page.mouse.down();
  await page.mouse.move(100, 0);
  await page.mouse.up();

  // Rotate device
  await page.setViewportSize({ width: 812, height: 375 }); // Landscape
});
```

---

## Debugging UI Tests

### Visual Debugging

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Pause execution
await page.pause();
```

### Screenshots

```javascript
// Screenshot entire page
await page.screenshot({ path: 'screenshot.png' });

// Screenshot specific element
await page.locator('.error-message').screenshot({ path: 'error.png' });

// Full page screenshot
await page.screenshot({ path: 'full-page.png', fullPage: true });
```

### Video Recording

```javascript
// playwright.config.js
use: {
  video: 'on', // 'off', 'on', 'retain-on-failure', 'on-first-retry'
}
```

### Trace Files

```javascript
// playwright.config.js
use: {
  trace: 'on-first-retry', // Records trace on first retry
}
```

```bash
# View trace
npx playwright show-trace trace.zip
```

### Console Logs

```javascript
// Capture console messages
page.on('console', msg => console.log('Browser console:', msg.text()));

// Capture errors
page.on('pageerror', error => console.log('Page error:', error));
```

---

## Best Practices

### 1. Use Stable Selectors

```javascript
// ❌ Bad: Fragile
await page.click('.btn-primary:nth-child(2)');

// ✅ Good: Semantic
await page.getByRole('button', { name: 'Submit Order' });
```

### 2. One Assertion Per Concept

```javascript
// ❌ Bad: Multiple unrelated assertions
test('dashboard test', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.user-name')).toContainText('John');
  await expect(page.locator('.sidebar')).toBeVisible();
  await expect(page.locator('footer')).toContainText('2025');
});

// ✅ Good: Focused tests
test('should display dashboard heading', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('should display user name', async ({ page }) => {
  await expect(page.locator('.user-name')).toContainText('John');
});
```

### 3. Avoid Test Interdependence

```javascript
// ❌ Bad: Tests depend on order
test('create user', async ({ page }) => {
  // Creates user with email test@example.com
});

test('login user', async ({ page }) => {
  // Assumes user from previous test exists!
});

// ✅ Good: Independent tests
test('login user', async ({ page }) => {
  // Create user first
  await createTestUser({ email: 'test@example.com' });

  // Then test login
  await login(page, 'test@example.com', 'password');
});
```

### 4. Clean Test Data

```javascript
// Use beforeEach/afterEach
let testUser;

beforeEach(async () => {
  testUser = await createTestUser();
});

afterEach(async () => {
  await deleteTestUser(testUser.id);
});
```

---

## What Senior Engineers Know

**UI tests are expensive.** Reserve them for critical user journeys. Use API/unit tests for everything else.

**Flaky tests are worse than no tests.** They erode trust. Fix flakiness immediately or delete the test.

**Auto-wait is your friend.** Modern tools (Playwright, Cypress) auto-wait. Don't add explicit waits unless necessary.

**Test user behavior, not implementation.** Use accessible names and roles, not CSS classes or IDs.

**Visual regression testing catches what assertions miss.** Use tools like Percy, Chromatic, or Playwright's screenshot comparison.

---

## Exercise

**Automate Login Flow:**

Create a Playwright test for a login flow:

1. Navigate to login page
2. Fill email and password
3. Click login button
4. Verify redirect to dashboard
5. Verify user name displayed
6. Test invalid credentials (negative case)

**Bonus:**
- Add Page Object Model
- Handle loading states
- Take screenshots on failure
- Run on multiple browsers

---

## Next Steps

- Master [API Automation Architecture](03-api-automation-architecture.md)
- Learn [Test Framework Design Patterns](04-framework-design-patterns.md)
- Implement [Page Object Model](05-page-object-model.md)
- Practice [Flaky Test Prevention](07-flaky-test-prevention.md)
