# Web Application Testing Lab

## Overview

**Duration:** 2 hours
**Difficulty:** Beginner
**Category:** Software Testing

In this lab, you'll practice manual testing techniques on a sample e-commerce application. You'll learn to identify functional bugs, document them properly, and think like a QA engineer.

## Learning Objectives

By the end of this lab, you will be able to:
- Create comprehensive test scenarios for web applications
- Identify common functional bugs
- Document bugs with proper severity and priority
- Use browser developer tools for testing
- Test user workflows end-to-end

## Prerequisites

- Web browser (Chrome, Firefox, or Edge recommended)
- Basic understanding of web applications
- Access to browser developer tools

## Lab Setup

For this lab, we'll use publicly available demo e-commerce sites:

**Option 1:** The Internet (Herokuapp)
```
https://the-internet.herokuapp.com/
```

**Option 2:** Automation Practice
```
http://automationpractice.com/
```

**Option 3:** DemoQA Book Store
```
https://demoqa.com/books
```

## Part 1: Exploratory Testing (30 minutes)

### Task 1.1: User Registration Flow

Test the user registration process:

**Test Scenarios:**
1. Register with valid credentials
2. Register with existing email
3. Register with weak password
4. Register with missing required fields
5. Test password visibility toggle
6. Test form validation messages

**What to Look For:**
- Are error messages clear and helpful?
- Does the password strength indicator work?
- Are XSS attacks possible in input fields?
- Is email validation working correctly?

**Document Your Findings:**

| Test Case | Expected Result | Actual Result | Bug? | Severity |
|-----------|----------------|---------------|------|----------|
| Register with valid data | Success message shown | | | |
| Register with existing email | Error: "Email already exists" | | | |
| Password less than 8 chars | Error message shown | | | |

### Task 1.2: Login Flow

Test the authentication system:

**Test Scenarios:**
1. Login with valid credentials
2. Login with invalid password
3. Login with non-existent user
4. Test "Remember Me" functionality
5. Test "Forgot Password" flow
6. Test session timeout

**Security Testing:**
- Try SQL injection: `' OR '1'='1`
- Check if password is masked in network tab
- Verify HTTPS is enforced
- Check for brute force protection

### Task 1.3: Product Search & Browse

**Test Scenarios:**
1. Search with valid product name
2. Search with partial name
3. Search with special characters
4. Test category filters
5. Test price sorting (low to high, high to low)
6. Test pagination

**Edge Cases:**
- What happens with empty search?
- What about very long search queries (100+ characters)?
- Can you search for SQL/XSS payloads?

## Part 2: Checkout Flow Testing (45 minutes)

### Task 2.1: Shopping Cart

**Test Scenarios:**

1. **Add to Cart:**
   - Add single item
   - Add multiple items
   - Add same item twice (quantity should increase)
   - Add out-of-stock items

2. **Update Cart:**
   - Increase quantity
   - Decrease quantity
   - Set quantity to 0
   - Set quantity to negative number
   - Set quantity to very large number (9999)

3. **Remove from Cart:**
   - Remove single item
   - Remove all items
   - Remove item and use browser back button

**Bug Hunting Tips:**
- Does the total price update correctly?
- What happens when you refresh the page?
- Is the cart preserved after logout/login?

### Task 2.2: Checkout Process

**Test the Complete Flow:**

```
1. Add items to cart
2. Proceed to checkout
3. Enter shipping address
4. Select shipping method
5. Enter payment information
6. Review order
7. Confirm order
```

**Test Each Step:**

**Shipping Address:**
- Valid address
- Missing required fields
- Invalid ZIP/postal code
- Special characters in address
- Very long address

**Payment:**
- Valid credit card (use test cards if available)
- Expired credit card
- Invalid CVV
- Missing fields

**Order Confirmation:**
- Verify order summary is correct
- Check email confirmation (if applicable)
- Verify order appears in order history

## Part 3: Cross-Browser & Responsive Testing (30 minutes)

### Task 3.1: Browser Compatibility

Test the application in at least 2 different browsers:

**Browsers to Test:**
- Chrome
- Firefox
- Safari
- Edge

**What to Check:**
- Layout consistency
- Form functionality
- Button click handlers
- Image loading
- Console errors (F12 → Console)

### Task 3.2: Responsive Design

Test on different viewport sizes:

**Using Browser DevTools:**

1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Test these resolutions:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

**What to Test:**
- Navigation menu (hamburger menu on mobile?)
- Product grid layout
- Forms are usable
- Images scale properly
- No horizontal scrolling

## Part 4: Performance & Network Analysis (15 minutes)

### Task 4.1: Network Analysis

**Using Browser DevTools Network Tab:**

1. Open DevTools → Network tab
2. Reload the page
3. Analyze:
   - Total page load time
   - Number of requests
   - Total page size
   - Slowest resource

**Questions to Answer:**
- Are images optimized?
- Are there any failed requests (404, 500)?
- Are resources cached properly?
- Is compression enabled (gzip)?

### Task 4.2: Console Errors

**Check Console for Errors:**

1. Open DevTools → Console
2. Look for:
   - JavaScript errors (red)
   - Warnings (yellow)
   - Network errors

**Document any errors found:**

```
Error: Cannot read property 'value' of null
Location: checkout.js:142
Impact: Checkout button doesn't work
```

## Deliverables

Create a bug report for the top 3 bugs you found:

### Bug Report Template

```markdown
# Bug Report

## Bug #1: [Short Description]

**Severity:** Critical / Major / Minor
**Priority:** High / Medium / Low

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- URL: https://example.com/checkout

**Steps to Reproduce:**
1. Go to checkout page
2. Enter shipping address
3. Click "Continue"
4. Error appears

**Expected Result:**
Should proceed to payment page

**Actual Result:**
"Internal Server Error" appears

**Screenshots:**
[Attach screenshot]

**Additional Info:**
- Console error: "TypeError: Cannot read property..."
- Occurs 100% of the time
- Workaround: Use different browser
```

## Bonus Challenges

If you finish early, try these advanced tests:

1. **Accessibility Testing:**
   - Navigate using keyboard only (Tab, Enter, Escape)
   - Test with screen reader
   - Check color contrast (use browser extension)

2. **Security Testing:**
   - Try path traversal: `../../etc/passwd`
   - Test for clickjacking (can you iframe the site?)
   - Check if sensitive data is in URLs

3. **Localization:**
   - Change browser language
   - Test number formatting
   - Test date formatting
   - Check for untranslated strings

## Summary

**What You Learned:**
- Systematic approach to web application testing
- How to identify and document bugs
- Using browser DevTools for testing
- Testing different user flows
- Cross-browser and responsive testing

**Next Steps:**
- Practice on other demo sites
- Learn about test automation
- Study OWASP Top 10 vulnerabilities
- Practice writing test cases before testing

## Resources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
