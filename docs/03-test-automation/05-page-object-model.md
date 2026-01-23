# Page Object Model (POM)

## Overview

Page Object Model is a design pattern that creates an object repository for web elements. Instead of scattering locators throughout tests, POM encapsulates page structure in dedicated classes, making tests more maintainable and readable.

## The Problem: Tests Without POM

```javascript
// Test 1
test('login test 1', async ({ page }) => {
  await page.fill('#email', 'user@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await expect(page.locator('.dashboard-title')).toBeVisible();
});

// Test 2
test('login test 2', async ({ page }) => {
  await page.fill('#email', 'admin@test.com');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page.locator('.dashboard-title')).toBeVisible();
});

// Test 3
test('login test 3', async ({ page }) => {
  await page.fill('#email', 'invalid@test.com');
  await page.fill('#password', 'wrong');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error-message')).toBeVisible();
});
```

**Problems:**
- ❌ Locators duplicated across tests (`#email`, `#password`, etc.)
- ❌ If UI changes (e.g., `#email` becomes `input[name="email"]`), must update all tests
- ❌ Tests are hard to read (too much technical detail)
- ❌ No reusability

**What happens when UI changes?**
```
Designer changes #email → input[name="email"]
Result: 50 tests break
Fix: Update locator in 50 places 😱
```

---

## The Solution: Page Object Model

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators defined once
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
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

**Tests using POM:**

```javascript
const LoginPage = require('../pages/LoginPage');

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user@test.com', 'password');

  await expect(page).toHaveURL('/dashboard');
});

test('failed login shows error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('invalid@test.com', 'wrong');

  expect(await loginPage.isErrorVisible()).toBe(true);
  expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
});
```

**Benefits:**
- ✅ Locators defined once, used everywhere
- ✅ UI change? Update one file, all tests work
- ✅ Tests are readable (business language, not technical)
- ✅ Reusable across tests

---

## POM Best Practices

### 1. One Page Object Per Page

```
pages/
├── LoginPage.js
├── DashboardPage.js
├── ProfilePage.js
├── CheckoutPage.js
├── CartPage.js
└── ConfirmationPage.js
```

Each page in your application gets its own Page Object.

### 2. Locators as Properties

```javascript
class ProfilePage {
  constructor(page) {
    this.page = page;

    // ✅ Good: Locators as properties
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.saveButton = page.getByRole('button', { name: 'Save' });

    // ❌ Bad: Inline locators in methods
    // async updateName(name) {
    //   await page.locator('#name').fill(name);
    // }
  }

  async updateName(name) {
    await this.nameInput.fill(name); // ✅ Uses property
  }
}
```

### 3. Methods Return Values or Page Objects

```javascript
class LoginPage {
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    // Return next page object
    return new DashboardPage(this.page);
  }

  async getErrorMessage() {
    // Return value
    return await this.errorMessage.textContent();
  }
}

// Usage: Chaining page navigations
test('user flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const dashboardPage = await loginPage.login('user@test.com', 'password');
  const profilePage = await dashboardPage.navigateToProfile();
  await profilePage.updateName('New Name');

  expect(await profilePage.getSuccessMessage()).toBe('Profile updated');
});
```

### 4. No Assertions in Page Objects

```javascript
// ❌ Bad: Assertions in page object
class LoginPage {
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    // ❌ Don't assert in page objects!
    expect(this.page.url()).toContain('/dashboard');
  }
}

// ✅ Good: Assertions in tests
class LoginPage {
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    // No assertions
  }
}

test('login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@test.com', 'password');

  // ✅ Assertions in test
  await expect(page).toHaveURL('/dashboard');
});
```

**Why?** Page Objects represent actions, Tests represent verification.

### 5. Meaningful Method Names

```javascript
// ❌ Bad: Technical names
class CheckoutPage {
  async clickButton1() {}
  async fillForm() {}
  async submitData() {}
}

// ✅ Good: Business domain names
class CheckoutPage {
  async fillShippingAddress(address) {}
  async selectPaymentMethod(method) {}
  async agreeToTerms() {}
  async placeOrder() {}
}
```

---

## Advanced POM Patterns

### 1. Base Page Class

```javascript
// pages/BasePage.js
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async reload() {
    await this.page.reload();
  }
}

module.exports = BasePage;
```

**Inherit from BasePage:**

```javascript
// pages/LoginPage.js
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### 2. Page Components (Reusable Elements)

```javascript
// components/NavigationBar.js
class NavigationBar {
  constructor(page) {
    this.page = page;

    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.cartCount = page.locator('.cart-count');
  }

  async navigateToHome() {
    await this.homeLink.click();
  }

  async navigateToProfile() {
    await this.profileLink.click();
  }

  async navigateToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async getCartItemCount() {
    return parseInt(await this.cartCount.textContent());
  }
}

module.exports = NavigationBar;
```

**Use components in pages:**

```javascript
const NavigationBar = require('../components/NavigationBar');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Include navigation component
    this.navbar = new NavigationBar(page);

    this.welcomeMessage = page.locator('.welcome');
    this.statsPanel = page.locator('.stats-panel');
  }

  async getWelcomeMessage() {
    return await this.welcomeMessage.textContent();
  }

  // Delegate to navbar component
  async goToProfile() {
    await this.navbar.navigateToProfile();
    return new ProfilePage(this.page);
  }
}
```

### 3. Page Factory (Playwright Fixtures)

```javascript
// fixtures/page-fixtures.js
const { test as base } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ProfilePage = require('../pages/ProfilePage');

exports.test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

exports.expect = base.expect;
```

**Usage:**

```javascript
const { test, expect } = require('../fixtures/page-fixtures');

test('user can update profile', async ({ loginPage, profilePage }) => {
  // Pages automatically injected!
  await loginPage.goto();
  await loginPage.login('user@test.com', 'password');

  await profilePage.goto();
  await profilePage.updateName('New Name');

  expect(await profilePage.getSuccessMessage()).toBe('Profile updated');
});
```

---

## Real-World Example: E-commerce Checkout

### Page Objects

```javascript
// pages/ProductPage.js
class ProductPage extends BasePage {
  constructor(page) {
    super(page);

    this.productTitle = page.locator('h1.product-title');
    this.productPrice = page.locator('.product-price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.quantityInput = page.locator('input[name="quantity"]');
    this.successNotification = page.locator('.notification-success');
  }

  async goto(productId) {
    await super.goto(`/products/${productId}`);
  }

  async getProductName() {
    return await this.productTitle.textContent();
  }

  async getPrice() {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText.replace('$', ''));
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.successNotification.waitFor();
  }
}

// pages/CartPage.js
class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.cartItems = page.locator('.cart-item');
    this.checkoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
    this.subtotalAmount = page.locator('.subtotal-amount');
    this.emptyCartMessage = page.locator('.empty-cart');
  }

  async goto() {
    await super.goto('/cart');
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async getSubtotal() {
    const text = await this.subtotalAmount.textContent();
    return parseFloat(text.replace('$', ''));
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    return new CheckoutPage(this.page);
  }

  async isEmpty() {
    return await this.emptyCartMessage.isVisible();
  }
}

// pages/CheckoutPage.js
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.addressInput = page.locator('#address');
    this.cityInput = page.locator('#city');
    this.zipCodeInput = page.locator('#zipCode');

    this.cardNumberInput = page.locator('#cardNumber');
    this.cvvInput = page.locator('#cvv');
    this.expiryInput = page.locator('#expiry');

    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async fillShippingInfo(shippingData) {
    await this.firstNameInput.fill(shippingData.firstName);
    await this.lastNameInput.fill(shippingData.lastName);
    await this.addressInput.fill(shippingData.address);
    await this.cityInput.fill(shippingData.city);
    await this.zipCodeInput.fill(shippingData.zipCode);
  }

  async fillPaymentInfo(paymentData) {
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cvvInput.fill(paymentData.cvv);
    await this.expiryInput.fill(paymentData.expiry);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    return new OrderConfirmationPage(this.page);
  }
}

// pages/OrderConfirmationPage.js
class OrderConfirmationPage extends BasePage {
  constructor(page) {
    super(page);

    this.orderNumber = page.locator('.order-number');
    this.successMessage = page.locator('.success-message');
    this.orderSummary = page.locator('.order-summary');
  }

  async getOrderNumber() {
    const text = await this.orderNumber.textContent();
    return text.replace('Order #', '').trim();
  }

  async getSuccessMessage() {
    return await this.successMessage.textContent();
  }

  async isOrderConfirmed() {
    return await this.successMessage.isVisible();
  }
}
```

### Complete Test Using POM

```javascript
const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const testData = require('../fixtures/test-data');

test('complete checkout flow', async ({ page }) => {
  // Step 1: Add product to cart
  const productPage = new ProductPage(page);
  await productPage.goto(101);
  await productPage.setQuantity(2);
  await productPage.addToCart();

  // Step 2: Verify cart
  const cartPage = new CartPage(page);
  await cartPage.goto();
  expect(await cartPage.getItemCount()).toBe(1);
  expect(await cartPage.getSubtotal()).toBeGreaterThan(0);

  // Step 3: Proceed to checkout
  const checkoutPage = await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingInfo(testData.shipping);
  await checkoutPage.fillPaymentInfo(testData.payment);

  // Step 4: Place order
  const confirmationPage = await checkoutPage.placeOrder();

  // Step 5: Verify order confirmation
  expect(await confirmationPage.isOrderConfirmed()).toBe(true);
  const orderNumber = await confirmationPage.getOrderNumber();
  expect(orderNumber).toMatch(/^ORD-\d+$/);
});
```

**Look how readable this test is!** It reads like a user story, not technical code.

---

## POM Anti-Patterns

### 1. Fat Page Objects

```javascript
// ❌ Bad: Page object does too much
class ProductPage {
  // 50 methods...
  async addToCart() {}
  async addToWishlist() {}
  async shareOnFacebook() {}
  async shareOnTwitter() {}
  async writeReview() {}
  async uploadPhoto() {}
  async compareProducts() {}
  // ... 43 more methods
}

// ✅ Good: Split into logical components
class ProductPage {
  constructor(page) {
    this.page = page;
    this.reviews = new ReviewsComponent(page);
    this.socialSharing = new SocialSharingComponent(page);
    this.comparison = new ComparisonComponent(page);
  }

  async addToCart() {}
  async addToWishlist() {}
  // Core product actions only
}
```

### 2. Logic in Page Objects

```javascript
// ❌ Bad: Business logic in page object
class CheckoutPage {
  async fillShippingInfo(data) {
    // ❌ Validation logic
    if (!data.zipCode || data.zipCode.length !== 5) {
      throw new Error('Invalid zip code');
    }

    // ❌ Business logic
    const shippingCost = data.city === 'New York' ? 5.99 : 9.99;

    await this.zipCodeInput.fill(data.zipCode);
  }
}

// ✅ Good: Page object only interacts with UI
class CheckoutPage {
  async fillShippingInfo(data) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.zipCodeInput.fill(data.zipCode);
    // Just UI interactions, no logic
  }
}
```

### 3. Returning Raw Locators

```javascript
// ❌ Bad: Exposing locators
class ProductPage {
  getAddToCartButton() {
    return this.page.locator('button.add-to-cart'); // Exposes locator
  }
}

// Usage: Test manipulates locator directly
const button = productPage.getAddToCartButton();
await button.click(); // Test knows about locator

// ✅ Good: Hide implementation
class ProductPage {
  async addToCart() {
    await this.addToCartButton.click(); // Encapsulated
  }
}

// Usage: Test uses method
await productPage.addToCart(); // Test doesn't know about locator
```

---

## When NOT to Use POM

**Don't use POM if:**

1. **Very simple application** (< 5 pages, few tests)
   - Overhead not worth it

2. **Rapidly changing prototype**
   - UI changes daily, POM becomes maintenance burden

3. **API-only testing**
   - Use API clients instead

4. **One-off exploratory test**
   - Writing POM slower than writing direct test

**Use POM when:**

- Application has > 5 pages
- Multiple tests use same pages
- UI is relatively stable
- Team size > 2
- Long-term maintenance expected

---

## What Senior Engineers Know

**POM is not perfect.** It adds abstraction layer. Balance between maintainability and simplicity.

**Start without POM, refactor when needed.** Write a few tests, see duplication, then create page objects.

**POM works best for stable UIs.** If UI changes daily, POM becomes a burden. Consider alternatives (component testing, API testing).

**Page Objects should be thin.** If page object has 50+ methods, you're doing too much. Split into components.

**Tests still break when UI changes.** POM makes fixes faster (one place), but doesn't eliminate breakage.

---

## Exercise

**Create Page Objects for Gmail:**

Build page objects for Gmail's key flows:

1. **LoginPage**
   - login(email, password)
   - getErrorMessage()

2. **InboxPage**
   - composeEmail()
   - openEmail(subject)
   - getEmailCount()

3. **ComposeEmailPage**
   - fillRecipient(email)
   - fillSubject(subject)
   - fillBody(text)
   - send()

4. **Write test:**
   - Login → Compose email → Send → Verify in Sent folder

---

## Next Steps

- Master [Test Data Management](../02-software-qa/08-test-data-management.md)
- Learn [Flaky Test Prevention](07-flaky-test-prevention.md)
- Practice [CI/CD Integration](08-cicd-integration.md)
- Study [Framework Design Patterns](04-framework-design-patterns.md)
