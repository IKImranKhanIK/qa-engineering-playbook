# Test Case Template

## Test Case Information

**Test Case ID:** TC-[XXX]
**Test Case Name:** [Descriptive name of what is being tested]
**Created By:** [Your Name]
**Created Date:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Version:** 1.0

---

## Test Details

**Module/Feature:** [Feature or module being tested]
**Requirement ID:** [REQ-XXX] (link to requirement)
**Priority:** [High / Medium / Low]
**Test Type:** [Functional / Integration / System / Regression / etc.]
**Test Level:** [Unit / Integration / System / Acceptance]

---

## Test Objective

Brief description of what this test validates and why it's important.

---

## Preconditions

List all setup requirements before test execution:
- User account exists with specific permissions
- Test data available in database
- Application deployed to test environment
- Browser cache cleared
- Specific configuration enabled

---

## Test Data

| Data Element | Value | Notes |
|--------------|-------|-------|
| Username | testuser@example.com | Valid user account |
| Password | Test@1234 | Meets password policy |
| Product ID | PRD-12345 | Active product in catalog |
| Discount Code | SAVE20 | 20% off, valid until [DATE] |

---

## Test Steps

| Step # | Action | Expected Result |
|--------|--------|-----------------|
| 1 | Navigate to https://app.example.com/login | Login page displays |
| 2 | Enter username: testuser@example.com | Username field populated |
| 3 | Enter password: Test@1234 | Password field shows masked characters |
| 4 | Click "Login" button | - Loading indicator appears<br>- User redirected to dashboard<br>- Welcome message displays "Hello, Test User" |
| 5 | Click on "Profile" in navigation | Profile page loads with user details |
| 6 | Click "Logout" button | - User logged out<br>- Redirected to login page<br>- Session cleared |

---

## Expected Result (Overall)

User can successfully log in, navigate to profile, and log out. All session data is properly managed.

---

## Actual Result

[To be filled during execution]

---

## Test Status

**Status:** [Not Executed / Pass / Fail / Blocked / Skipped]
**Executed By:** [Tester Name]
**Execution Date:** YYYY-MM-DD
**Build/Version Tested:** [Version number]
**Environment:** [Staging / QA / Production]

---

## Defects Found

| Defect ID | Severity | Description | Status |
|-----------|----------|-------------|--------|
| BUG-123 | Medium | Welcome message not displaying | Open |
| | | | |

---

## Attachments

- Screenshots: [links]
- Logs: [links]
- Screen recordings: [links]
- Test data files: [links]

---

## Notes/Comments

Any additional observations, issues, or context about the test execution.

---

## Postconditions

Cleanup actions required after test:
- Delete test user account
- Remove test data from database
- Reset configuration to default

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial version |
| | | | |

---

## Alternative Format: Simplified Test Case

For simpler test cases, use this condensed format:

**TC-XXX: [Test Case Name]**

**Requirement:** REQ-XXX
**Priority:** High
**Type:** Functional

**Precondition:** User logged in as admin

**Steps:**
1. Go to Users > Add User
2. Enter: Name="John Doe", Email="john@example.com", Role="Editor"
3. Click "Save"

**Expected:** User created successfully, confirmation message shown, user appears in user list

**Actual:** [Fill during execution]

**Status:** [Pass/Fail]
**Date:** YYYY-MM-DD
**Tester:** [Name]

---

## Example: Complete Test Case

**Test Case ID:** TC-042
**Test Case Name:** Verify user can apply discount code at checkout
**Created By:** Jane Smith
**Created Date:** 2025-10-15
**Version:** 1.0

**Module:** E-Commerce Checkout
**Requirement ID:** REQ-301
**Priority:** High
**Test Type:** Functional

### Objective
Validate that users can successfully apply a valid discount code during checkout and see the correct discounted total.

### Preconditions
- User is logged in
- User has items in cart (total >$50)
- Valid discount code "SAVE20" exists (20% off, no minimum)
- Code is active and not expired

### Test Data
- Username: buyer@example.com
- Password: Buyer@123
- Cart items: 2x Widget ($30 each) = $60
- Discount code: SAVE20
- Expected discount: $12 (20% of $60)
- Expected total: $48

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login with buyer@example.com / Buyer@123 | Dashboard displays |
| 2 | Navigate to Cart | Cart shows 2 Widgets, subtotal $60 |
| 3 | Click "Proceed to Checkout" | Checkout page loads |
| 4 | Locate "Discount Code" field | Field visible and enabled |
| 5 | Enter "SAVE20" in discount code field | Code entered in field |
| 6 | Click "Apply" button | - Success message: "Discount applied!"<br>- Discount line appears: "-$12.00 (SAVE20)"<br>- Total updates to $48.00 |
| 7 | Complete checkout | Order confirmation shows final total $48.00 |

### Expected Result
Discount code applies successfully, showing $12 discount and final total of $48.

### Test Status
**Status:** Pass
**Executed By:** Jane Smith
**Execution Date:** 2025-10-20
**Build:** v2.3.1
**Environment:** Staging

### Notes
Tested across Chrome, Firefox, and Safari - all passed.
