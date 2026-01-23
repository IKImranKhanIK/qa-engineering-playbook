# Test Framework Design Patterns

## Overview

Design patterns are reusable solutions to common problems in test automation. Well-designed test frameworks use patterns to create maintainable, scalable, and readable test code.

## Why Patterns Matter

### Without Patterns

```javascript
// Messy test code (no patterns)
test('checkout flow', async () => {
  await page.goto('https://example.com');
  await page.click('#login-btn');
  await page.fill('#email', 'user@test.com');
  await page.fill('#password', 'pass123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.click('.cart-icon');
  await page.click('button.checkout');
  // ... 50 more lines
});
```

**Problems:**
- ❌ Hard to read
- ❌ Duplication across tests
- ❌ Breaks when UI changes
- ❌ Impossible to maintain

### With Patterns

```javascript
// Clean test code (with patterns)
test('checkout flow', async ({ page }) => {
  await loginPage.login('user@test.com', 'pass123');
  await dashboardPage.navigateToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.completeOrder(testData.order);
  expect(await confirmationPage.getOrderNumber()).toBeDefined();
});
```

**Benefits:**
- ✅ Readable
- ✅ Reusable
- ✅ Maintainable
- ✅ Resilient to changes

---

## Essential Design Patterns

### 1. Page Object Model (POM)

**Problem:** UI locators scattered across tests

**Solution:** Encapsulate page structure in objects

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}

module.exports = LoginPage;
```

**Usage:**

```javascript
// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  await expect(page).toHaveURL('/dashboard');
});

test('login shows error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('invalid@example.com', 'wrong');

  expect(await loginPage.isErrorVisible()).toBe(true);
  expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
});
```

---

### 2. Fluent Interface (Method Chaining)

**Problem:** Multiple method calls are verbose

**Solution:** Return `this` to enable chaining

```javascript
// pages/CheckoutPage.js
class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  fillShippingAddress(address) {
    this.page.fill('#address', address.street);
    this.page.fill('#city', address.city);
    this.page.fill('#zip', address.zip);
    return this; // Enable chaining
  }

  selectShippingMethod(method) {
    this.page.click(`[data-shipping="${method}"]`);
    return this; // Enable chaining
  }

  fillPaymentInfo(payment) {
    this.page.fill('#card-number', payment.cardNumber);
    this.page.fill('#cvv', payment.cvv);
    return this; // Enable chaining
  }

  async submit() {
    await this.page.click('button[type="submit"]');
    return this; // Enable chaining
  }
}

// Usage: Fluent chaining
await checkoutPage
  .fillShippingAddress(testData.address)
  .selectShippingMethod('express')
  .fillPaymentInfo(testData.payment)
  .submit();
```

---

### 3. Factory Pattern

**Problem:** Creating test data is repetitive

**Solution:** Use factories to generate objects

```javascript
// factories/UserFactory.js
class UserFactory {
  static create(overrides = {}) {
    return {
      email: `test-${Date.now()}@example.com`,
      password: 'DefaultPass123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      ...overrides
    };
  }

  static createAdmin(overrides = {}) {
    return this.create({
      role: 'admin',
      ...overrides
    });
  }

  static createMany(count, overrides = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createWithOrders(orderCount = 3) {
    const user = this.create();
    user.orders = OrderFactory.createMany(orderCount);
    return user;
  }
}

// Usage
const user = UserFactory.create();
const admin = UserFactory.createAdmin({ email: 'admin@test.com' });
const users = UserFactory.createMany(10);
```

---

### 4. Builder Pattern

**Problem:** Complex objects need flexible creation

**Solution:** Use builders for step-by-step construction

```javascript
// builders/OrderBuilder.js
class OrderBuilder {
  constructor() {
    this.order = {
      userId: null,
      items: [],
      shippingAddress: null,
      paymentMethod: null,
      total: 0
    };
  }

  forUser(userId) {
    this.order.userId = userId;
    return this;
  }

  addItem(productId, quantity, price) {
    this.order.items.push({ productId, quantity, price });
    this.calculateTotal();
    return this;
  }

  withShippingAddress(address) {
    this.order.shippingAddress = address;
    return this;
  }

  withPaymentMethod(method) {
    this.order.paymentMethod = method;
    return this;
  }

  calculateTotal() {
    this.order.total = this.order.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    return this;
  }

  build() {
    return this.order;
  }

  async create(api) {
    const response = await api.createOrder(this.order);
    return response.body;
  }
}

// Usage
const order = new OrderBuilder()
  .forUser(123)
  .addItem(456, 2, 29.99)
  .addItem(789, 1, 49.99)
  .withShippingAddress(testAddresses.default)
  .withPaymentMethod('credit_card')
  .build();

// Or create directly via API
const createdOrder = await new OrderBuilder()
  .forUser(123)
  .addItem(456, 2, 29.99)
  .create(ordersAPI);
```

---

### 5. Singleton Pattern

**Problem:** Need single shared instance (e.g., database connection, config)

**Solution:** Ensure only one instance exists

```javascript
// utils/DatabaseConnection.js
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.connection = null;
    DatabaseConnection.instance = this;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      });
    }
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  getConnection() {
    return this.connection;
  }
}

// Usage: Always returns same instance
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // true
```

---

### 6. Strategy Pattern

**Problem:** Different behaviors based on context

**Solution:** Encapsulate algorithms in separate classes

```javascript
// strategies/AuthStrategy.js
class BasicAuthStrategy {
  authenticate(request, credentials) {
    const token = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
    request.set('Authorization', `Basic ${token}`);
    return request;
  }
}

class BearerTokenStrategy {
  authenticate(request, credentials) {
    request.set('Authorization', `Bearer ${credentials.token}`);
    return request;
  }
}

class APIKeyStrategy {
  authenticate(request, credentials) {
    request.set('X-API-Key', credentials.apiKey);
    return request;
  }
}

// API Client using strategies
class APIClient {
  constructor(baseURL, authStrategy) {
    this.baseURL = baseURL;
    this.authStrategy = authStrategy;
  }

  async get(endpoint, credentials) {
    let request = axios.get(`${this.baseURL}${endpoint}`);
    request = this.authStrategy.authenticate(request, credentials);
    return await request;
  }
}

// Usage
const basicAuthClient = new APIClient('http://api.example.com', new BasicAuthStrategy());
const bearerClient = new APIClient('http://api.example.com', new BearerTokenStrategy());
const apiKeyClient = new APIClient('http://api.example.com', new APIKeyStrategy());
```

---

### 7. Command Pattern

**Problem:** Need to queue, log, or undo operations

**Solution:** Encapsulate actions as objects

```javascript
// commands/TestCommand.js
class Command {
  execute() {
    throw new Error('Execute must be implemented');
  }

  undo() {
    throw new Error('Undo must be implemented');
  }
}

class CreateUserCommand extends Command {
  constructor(api, userData) {
    super();
    this.api = api;
    this.userData = userData;
    this.createdUserId = null;
  }

  async execute() {
    const response = await this.api.createUser(this.userData);
    this.createdUserId = response.body.id;
    return response;
  }

  async undo() {
    if (this.createdUserId) {
      await this.api.deleteUser(this.createdUserId);
    }
  }
}

class UpdateUserCommand extends Command {
  constructor(api, userId, updateData) {
    super();
    this.api = api;
    this.userId = userId;
    this.updateData = updateData;
    this.previousData = null;
  }

  async execute() {
    // Save previous state
    const userResponse = await this.api.getUserById(this.userId);
    this.previousData = userResponse.body;

    // Execute update
    const response = await this.api.updateUser(this.userId, this.updateData);
    return response;
  }

  async undo() {
    if (this.previousData) {
      await this.api.updateUser(this.userId, this.previousData);
    }
  }
}

// Command invoker with undo capability
class CommandInvoker {
  constructor() {
    this.history = [];
  }

  async execute(command) {
    const result = await command.execute();
    this.history.push(command);
    return result;
  }

  async undoLast() {
    const command = this.history.pop();
    if (command) {
      await command.undo();
    }
  }

  async undoAll() {
    while (this.history.length > 0) {
      await this.undoLast();
    }
  }
}

// Usage
const invoker = new CommandInvoker();

test('user operations', async () => {
  const createCmd = new CreateUserCommand(api, { email: 'test@test.com' });
  await invoker.execute(createCmd);

  const updateCmd = new UpdateUserCommand(api, userId, { name: 'New Name' });
  await invoker.execute(updateCmd);

  // Undo all changes at end of test
  await invoker.undoAll();
});
```

---

### 8. Decorator Pattern

**Problem:** Need to add functionality without modifying existing classes

**Solution:** Wrap objects with decorators

```javascript
// decorators/APIClientDecorator.js
class APIClient {
  async get(url) {
    return await axios.get(url);
  }
}

class LoggingDecorator {
  constructor(client) {
    this.client = client;
  }

  async get(url) {
    console.log(`[API] GET ${url}`);
    const start = Date.now();
    const response = await this.client.get(url);
    const duration = Date.now() - start;
    console.log(`[API] GET ${url} completed in ${duration}ms`);
    return response;
  }
}

class RetryDecorator {
  constructor(client, maxRetries = 3) {
    this.client = client;
    this.maxRetries = maxRetries;
  }

  async get(url) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.client.get(url);
      } catch (error) {
        lastError = error;
        if (attempt < this.maxRetries) {
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class CachingDecorator {
  constructor(client) {
    this.client = client;
    this.cache = new Map();
  }

  async get(url) {
    if (this.cache.has(url)) {
      console.log(`[CACHE] Hit for ${url}`);
      return this.cache.get(url);
    }

    const response = await this.client.get(url);
    this.cache.set(url, response);
    return response;
  }

  clearCache() {
    this.cache.clear();
  }
}

// Usage: Stack decorators
let client = new APIClient();
client = new LoggingDecorator(client); // Add logging
client = new RetryDecorator(client, 3); // Add retries
client = new CachingDecorator(client); // Add caching

await client.get('/api/users'); // Logged, retried if fails, cached
```

---

## Test Organization Patterns

### 1. Arrange-Act-Assert (AAA)

```javascript
test('should update user name', async () => {
  // ARRANGE: Set up test data and preconditions
  const user = await UserFactory.create();
  const newName = 'Updated Name';

  // ACT: Perform the action being tested
  const response = await api.updateUser(user.id, { name: newName });

  // ASSERT: Verify the results
  expect(response.status).toBe(200);
  expect(response.body.name).toBe(newName);

  // Verify in database
  const updatedUser = await db.users.findById(user.id);
  expect(updatedUser.name).toBe(newName);
});
```

### 2. Given-When-Then (BDD)

```javascript
test('user can complete checkout', async () => {
  // GIVEN: User has items in cart
  const user = await UserFactory.createWithCartItems();
  await loginPage.login(user.email, user.password);

  // WHEN: User completes checkout
  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingInfo(testData.shipping);
  await checkoutPage.fillPaymentInfo(testData.payment);
  await checkoutPage.submit();

  // THEN: Order is confirmed
  await expect(confirmationPage.successMessage).toBeVisible();
  const orderNumber = await confirmationPage.getOrderNumber();
  expect(orderNumber).toMatch(/^ORD-\d+$/);
});
```

### 3. Test Fixtures

```javascript
// fixtures/test-setup.js
class TestSetup {
  static async setupLoginTest() {
    const user = await UserFactory.create();
    await db.users.insert(user);
    return { user };
  }

  static async setupCheckoutTest() {
    const user = await UserFactory.create();
    const products = await ProductFactory.createMany(3);
    const cart = await CartFactory.createWithProducts(user.id, products);

    await db.users.insert(user);
    await db.products.insertMany(products);
    await db.carts.insert(cart);

    return { user, products, cart };
  }

  static async cleanup(...resources) {
    for (const resource of resources) {
      if (resource.userId) await db.users.delete(resource.userId);
      if (resource.cartId) await db.carts.delete(resource.cartId);
    }
  }
}

// Usage
test('checkout flow', async () => {
  const { user, products, cart } = await TestSetup.setupCheckoutTest();

  // Test code...

  await TestSetup.cleanup(user, cart);
});
```

---

## Anti-Patterns to Avoid

### 1. God Object (Too Much Responsibility)

**Bad:**

```javascript
class TestHelper {
  // 50 methods doing everything
  createUser() {}
  deleteUser() {}
  createOrder() {}
  processPayment() {}
  sendEmail() {}
  validateForm() {}
  // ... 44 more methods
}
```

**Good:**

```javascript
class UserHelper {
  createUser() {}
  deleteUser() {}
}

class OrderHelper {
  createOrder() {}
  getOrder() {}
}

class PaymentHelper {
  processPayment() {}
  refundPayment() {}
}
```

### 2. Test Logic in Page Objects

**Bad:**

```javascript
class LoginPage {
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // ❌ Assertion in page object!
    expect(this.page.url()).toContain('/dashboard');
  }
}
```

**Good:**

```javascript
class LoginPage {
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Page objects do actions, tests do assertions
  }
}

// Assertion in test
test('login', async () => {
  await loginPage.login('user@test.com', 'pass');
  expect(page.url()).toContain('/dashboard'); // ✅
});
```

### 3. Tight Coupling

**Bad:**

```javascript
// Test directly creates database records
test('get user', async () => {
  await db.query('INSERT INTO users VALUES (1, "test@test.com")');
  // Now test is coupled to database structure
});
```

**Good:**

```javascript
// Test uses factory
test('get user', async () => {
  const user = await UserFactory.create();
  // Factory handles database structure
});
```

---

## Framework Structure Example

```
test-automation/
├── tests/
│   ├── ui/
│   │   ├── login.spec.js
│   │   ├── checkout.spec.js
│   │   └── profile.spec.js
│   └── api/
│       ├── users.spec.js
│       └── orders.spec.js
│
├── pages/               # Page Object Model
│   ├── LoginPage.js
│   ├── CheckoutPage.js
│   └── ProfilePage.js
│
├── api/                 # API Clients
│   ├── UsersAPI.js
│   └── OrdersAPI.js
│
├── factories/           # Factory Pattern
│   ├── UserFactory.js
│   └── OrderFactory.js
│
├── builders/            # Builder Pattern
│   ├── UserBuilder.js
│   └── OrderBuilder.js
│
├── utils/               # Utilities
│   ├── WaitHelpers.js
│   └── DateHelpers.js
│
├── fixtures/            # Test Data
│   ├── users.json
│   └── products.json
│
└── config/              # Configuration
    ├── test.config.js
    └── environments.js
```

---

## What Senior Engineers Know

**Patterns are guidelines, not rules.** Don't force patterns where they don't fit. Pragmatism > purity.

**Start simple, refactor when needed.** Don't over-engineer. Add patterns when you feel pain (duplication, complexity).

**Consistency beats perfection.** Pick patterns and use them consistently across the framework.

**Page Objects hide complexity.** Tests should read like user stories, not technical implementation.

**Factories make tests independent.** Each test gets fresh data, no dependencies between tests.

---

## Exercise

**Refactor Messy Test:**

Given this test:

```javascript
test('user flow', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.click('.profile-link');
  await page.fill('#name', 'New Name');
  await page.click('button.save');
  await page.waitForSelector('.success-message');
});
```

**Refactor using:**
1. Page Object Model
2. Test data factory
3. Arrange-Act-Assert structure

---

## Next Steps

- Implement [Page Object Model](05-page-object-model.md) in detail
- Master [Test Data Management](06-test-data-management.md)
- Learn [Flaky Test Prevention](07-flaky-test-prevention.md)
- Practice [CI/CD Integration](08-cicd-integration.md)
