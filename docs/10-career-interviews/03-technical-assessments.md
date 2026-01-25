# Technical Assessments

## Overview

Technical assessments evaluate your hands-on QA skills through coding, test case writing, or problem-solving exercises.

## Assessment Types

### 1. Take-Home Assignment

**Duration:** 2-4 hours

**Common Tasks:**
- Write automation tests for a sample app
- Create test plan for a feature
- Find and report bugs in a demo application

**Example:**
```
Task: Write automated tests for this TODO app

Requirements:
- Use Playwright or Selenium
- Cover 5 core user flows
- Include at least 1 API test
- Provide README with setup instructions

Deliverable: GitHub repository with test code
Deadline: 48 hours
```

### 2. Live Coding Session

**Duration:** 45-60 min

**Example Problems:**

**Problem 1: Write a test for user registration**
```javascript
test('User registration with valid data', async ({ page }) => {
  await page.goto('https://example.com/register');

  await page.fill('#username', 'testuser123');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'SecurePass123!');
  await page.fill('#confirmPassword', 'SecurePass123!');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('.welcome-message')).toContainText('Welcome, testuser123');
});
```

**Problem 2: API Testing**
```javascript
test('GET /users returns user list', async ({ request }) => {
  const response = await request.get('https://api.example.com/users');

  expect(response.status()).toBe(200);

  const users = await response.json();
  expect(users).toBeInstanceOf(Array);
  expect(users.length).toBeGreaterThan(0);
  expect(users[0]).toHaveProperty('id');
  expect(users[0]).toHaveProperty('email');
});
```

### 3. Test Case Writing

**Task:** Write test cases for a shopping cart

**Expected Output:**
```
Feature: Shopping Cart

Scenario: Add item to cart
  Given user is on product page
  When user clicks "Add to Cart"
  Then item appears in cart
  And cart count increases by 1

Scenario: Remove item from cart
  Given user has item in cart
  When user clicks "Remove"
  Then item is removed from cart
  And cart count decreases by 1

Scenario: Cart persists across sessions
  Given user adds item to cart
  When user logs out and logs back in
  Then cart still contains the item
```

### 4. Bug Report Writing

**Task:** Test this login page and report bugs

**Example Bug Report:**
```
Bug ID: BUG-001
Title: Login fails with SQL error when username contains single quote
Severity: Critical
Priority: High

Steps to Reproduce:
1. Navigate to /login
2. Enter username: test'user
3. Enter password: any_password
4. Click "Login"

Expected: Error message "Invalid username or password"
Actual: 500 Internal Server Error, SQL syntax error displayed

Environment: Chrome 120, Windows 11
Screenshot: attached
```

## Assessment Best Practices

### Do's
✅ **Read instructions carefully**
✅ **Ask clarifying questions**
✅ **Comment your code**
✅ **Handle edge cases**
✅ **Include setup instructions**
✅ **Test your own code before submitting**

### Don'ts
❌ **Don't rush** - Quality > Speed
❌ **Don't copy-paste** without understanding
❌ **Don't ignore error handling**
❌ **Don't submit without testing**
❌ **Don't be afraid to ask questions**

## Common Assessment Mistakes

1. **Not reading requirements fully**
2. **Over-engineering the solution**
3. **Poor code organization**
4. **No error handling**
5. **Missing edge cases**
6. **No documentation**

## Evaluation Criteria

Interviewers typically assess:
- **Code quality** (readability, structure)
- **Test coverage** (happy path + edge cases)
- **Problem-solving approach**
- **Attention to detail**
- **Communication** (comments, documentation)

## Summary

Technical assessments test:
- Coding ability
- Testing mindset
- Problem-solving skills
- Communication

Treat assessments like real work: be thorough, ask questions, and deliver quality.
