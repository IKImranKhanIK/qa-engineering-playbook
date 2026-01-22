# Test Design Techniques

## Overview

Test design techniques are systematic approaches to deriving test cases from requirements, specifications, or code. They ensure coverage while keeping test suites manageable.

## Why Test Design Techniques Matter

### Without Systematic Design
- Random test cases based on gut feeling
- Missed edge cases and scenarios
- Redundant tests
- Unclear coverage
- Hard to justify test completeness

### With Systematic Design
- Comprehensive, provable coverage
- Efficient test suites
- Clear traceability to requirements
- Defendable testing strategy
- Easier to identify gaps

## Classification

### Black-Box Techniques
Based on specifications without knowledge of internal structure.

### White-Box Techniques
Based on code structure and internal logic.

### Experience-Based Techniques
Based on tester knowledge and intuition.

## Black-Box Techniques

### Equivalence Partitioning

**Concept:** Divide input domain into equivalence classes where behavior should be identical. Test one value from each class.

**Example: Age Field**

Valid range: 18-65

**Equivalence Classes:**
1. Below minimum: age < 18
2. Valid range: 18 ≤ age ≤ 65
3. Above maximum: age > 65

**Test Cases:**
- 10 (invalid, too young)
- 30 (valid)
- 70 (invalid, too old)

**Why This Works:**
Testing 17, 16, 15, etc. is redundant. If 17 fails, 16 will likely fail the same way. One representative value per partition is sufficient.

**Advanced Example: Text Field**

Field accepts 1-50 characters, alphanumeric only

**Partitions:**
1. Empty string
2. 1-50 characters, valid (alphanumeric)
3. 1-50 characters, invalid (special characters)
4. Over 50 characters, valid
5. Over 50 characters, invalid

**Test Cases:**
- "" (empty)
- "User123" (valid, 7 chars)
- "User@Name" (invalid, special char)
- "A" * 75 (too long, valid chars)
- "A" * 75 + "@" (too long, invalid chars)

### Boundary Value Analysis (BVA)

**Concept:** Errors often occur at boundaries. Test values at and around boundaries.

**Example: Age Field (18-65)**

**Boundary Values:**
- Just below minimum: 17
- Minimum: 18
- Just above minimum: 19
- Just below maximum: 64
- Maximum: 65
- Just above maximum: 66

**Why This Works:**
Off-by-one errors are common. Testing 17, 18, 19 catches "<" vs "≤" bugs.

**Two-Variable Example: Rectangle**

Width: 1-100, Height: 1-100

**BVA Test Cases:**
- (1, 1) - both minimum
- (1, 100) - min width, max height
- (100, 1) - max width, min height
- (100, 100) - both maximum
- (0, 50) - invalid width
- (50, 0) - invalid height
- (101, 50) - invalid width
- (50, 101) - invalid height
- (50, 50) - nominal values

### Decision Tables

**Concept:** Map combinations of conditions to actions.

**Example: Shipping Cost Calculation**

Conditions:
- Order total ≥ $50? (Y/N)
- Premium member? (Y/N)
- Express shipping? (Y/N)

Actions:
- Free shipping
- $5 shipping
- $10 shipping
- $20 shipping

**Decision Table:**

| Test | Total≥50 | Premium | Express | Shipping Cost |
|------|----------|---------|---------|---------------|
| 1    | Y        | Y       | Y       | Free          |
| 2    | Y        | Y       | N       | Free          |
| 3    | Y        | N       | Y       | $10           |
| 4    | Y        | N       | N       | Free          |
| 5    | N        | Y       | Y       | $5            |
| 6    | N        | Y       | N       | Free          |
| 7    | N        | N       | Y       | $20           |
| 8    | N        | N       | N       | $10           |

**When to Use:**
- Complex business rules with multiple conditions
- Need to verify all combinations
- Documenting expected behavior

### State Transition Testing

**Concept:** System behavior changes based on state. Test state transitions and events.

**Example: User Account States**

**States:**
- Unverified
- Active
- Locked
- Suspended

**Transitions:**
```
Unverified --[email verified]--> Active
Active --[3 failed logins]--> Locked
Active --[admin action]--> Suspended
Locked --[password reset]--> Active
Suspended --[admin action]--> Active
```

**Test Cases:**
1. Create account → Unverified state
2. Verify email → Active state
3. 3 failed logins when Active → Locked state
4. Reset password when Locked → Active state
5. Admin suspends Active user → Suspended state
6. Admin activates Suspended user → Active state

**Invalid Transitions to Test:**
- Email verification from Active (should do nothing)
- Password reset from Unverified (should fail)
- Failed login from Locked (should stay Locked)

**When to Use:**
- Workflows with defined states
- Applications with user sessions
- Protocol implementations

### Use Case Testing

**Concept:** Derive tests from user scenarios and use cases.

**Example: Online Shopping**

**Use Case: Purchase Product**

**Main Flow:**
1. User searches for product
2. User views product details
3. User adds product to cart
4. User proceeds to checkout
5. User enters shipping information
6. User enters payment information
7. User confirms order
8. System processes payment
9. System sends confirmation email

**Alternate Flows:**
- 3a: Product out of stock → show notification
- 8a: Payment fails → show error, retry

**Test Cases:**
- Happy path: Complete purchase successfully
- Out of stock: Verify notification, cannot checkout
- Payment failure: Verify error, can retry
- Cart abandonment: Verify cart persists

**When to Use:**
- User-facing functionality
- Business workflows
- Acceptance testing

## White-Box Techniques

### Statement Coverage

**Concept:** Execute every statement at least once.

**Example:**
```python
def calculate_discount(price, is_member):
    discount = 0
    if is_member:
        discount = price * 0.1
    return price - discount
```

**Test Cases for Statement Coverage:**
1. `calculate_discount(100, True)` - executes all statements
2. `calculate_discount(100, False)` - skips discount calculation

Two tests achieve 100% statement coverage.

### Branch Coverage

**Concept:** Execute every branch (true/false) at least once.

**Example:**
```python
def classify_age(age):
    if age < 0:
        return "invalid"
    elif age < 18:
        return "minor"
    else:
        return "adult"
```

**Branches:**
- age < 0: True, False
- age < 18: True, False

**Test Cases for Branch Coverage:**
1. `classify_age(-5)` - first branch True
2. `classify_age(10)` - first branch False, second True
3. `classify_age(25)` - both branches False

Three tests achieve 100% branch coverage.

### Path Coverage

**Concept:** Execute every possible path through the code.

**Example:**
```python
def process(a, b):
    if a > 0:
        x = 1
    else:
        x = 2

    if b > 0:
        y = 3
    else:
        y = 4

    return x + y
```

**Paths:**
1. a > 0 (True), b > 0 (True): x=1, y=3, return 4
2. a > 0 (True), b > 0 (False): x=1, y=4, return 5
3. a > 0 (False), b > 0 (True): x=2, y=3, return 5
4. a > 0 (False), b > 0 (False): x=2, y=4, return 6

**Test Cases:**
1. `process(1, 1)` - path 1
2. `process(1, -1)` - path 2
3. `process(-1, 1)` - path 3
4. `process(-1, -1)` - path 4

**Challenge:** Path coverage grows exponentially with branches. Often impractical for complex code.

## Experience-Based Techniques

### Exploratory Testing

**Concept:** Simultaneous test design and execution guided by tester knowledge.

**Approach:**
- Time-boxed sessions (60-90 minutes)
- Charter defines mission
- Free-form investigation
- Document findings

**Example Charter:**
"Explore the checkout flow with focus on payment handling, looking for error handling issues."

**When to Use:**
- New features without complete specs
- Finding unusual bugs
- Usability assessment
- After structured testing

### Error Guessing

**Concept:** Anticipate errors based on experience.

**Common Error Types:**
- Null/empty values
- Division by zero
- Negative numbers where positive expected
- Special characters in text fields
- Whitespace handling
- Case sensitivity issues
- Concurrent access
- Network timeouts

**Example: Search Function**

**Error Guesses:**
- Empty search query
- Very long search query
- Special characters: `<script>`, `'; DROP TABLE`
- Unicode characters
- Only whitespace
- Searches returning zero results
- Searches returning thousands of results

**When to Use:**
- Supplement systematic techniques
- Time-constrained testing
- Areas with historical issues

## Combining Techniques

### Effective Test Design Strategy

**1. Start with Equivalence Partitioning**
Identify major input classes

**2. Add Boundary Value Analysis**
Test partition boundaries

**3. Use Decision Tables for Complex Logic**
Map business rules

**4. Add State Transition for Workflows**
Cover state-based behavior

**5. Ensure Code Coverage (White-Box)**
Fill gaps with branch/path testing

**6. Apply Experience-Based**
Find unusual bugs

### Example: Login Functionality

**Equivalence Partitioning:**
- Valid username/password
- Invalid username
- Invalid password
- Empty fields

**Boundary Value Analysis:**
- Username: min length, max length, over max
- Password: min length, max length, over max

**State Transition:**
- Not logged in → Logged in → Logged out
- Failed attempts → Account locked

**Decision Table:**
- Username valid × Password valid × Account status

**Error Guessing:**
- SQL injection attempts
- Case sensitivity
- Whitespace in credentials
- Concurrent logins
- Session expiration

## Common Mistakes

### Testing Every Combination
**Problem:** Combinatorial explosion creates unmanageable test suites

**Fix:** Use pairwise testing or risk-based reduction

### Only One Technique
**Problem:** Single technique misses certain bugs

**Fix:** Combine techniques for comprehensive coverage

### No Traceability
**Problem:** Can't explain why tests exist or what they cover

**Fix:** Document which requirement/technique each test covers

### Ignoring Negative Testing
**Problem:** Only test valid inputs

**Fix:** Invalid inputs often reveal bugs. Test both positive and negative cases.

## What Senior Engineers Know

**100% coverage is impossible and unnecessary.** Choose techniques based on risk. High-risk areas get comprehensive coverage. Low-risk areas get sampling.

**Techniques provide structure, not answers.** Decision tables help organize thinking, but you still need judgment about what matters.

**The best test design is invisible.** Good tests look obvious in retrospect. The technique is the scaffolding you remove after building the tests.

**Experience beats technique, eventually.** Beginners need techniques to ensure coverage. Experts internalize them and add intuition.

**Automation changes technique selection.** Manual testing favors fewer, high-value tests. Automation enables exhaustive boundary testing.

## Exercise

**Scenario: Password Validation**

Requirements:
- Must be 8-20 characters
- Must contain at least one uppercase letter
- Must contain at least one digit
- Cannot contain spaces

Design test cases using:
1. Equivalence Partitioning
2. Boundary Value Analysis
3. Decision Tables

**Sample Answer:**

**Equivalence Partitioning:**
1. Valid password: "Pass1234"
2. Too short: "Pas1"
3. Too long: "Password12345678901"
4. No uppercase: "password123"
5. No digit: "Password"
6. Contains space: "Pass word1"

**Boundary Value Analysis:**
- 7 chars: "Pass123" (just below min)
- 8 chars: "Pass1234" (minimum)
- 9 chars: "Pass12345" (just above min)
- 19 chars: "Pass12345678901234" (just below max)
- 20 chars: "Pass123456789012345" (maximum)
- 21 chars: "Pass1234567890123456" (just above max)

**Decision Table:**

| Length OK | Has Upper | Has Digit | No Space | Result |
|-----------|-----------|-----------|----------|--------|
| Y         | Y         | Y         | Y        | Valid  |
| N         | Y         | Y         | Y        | Invalid|
| Y         | N         | Y         | Y        | Invalid|
| Y         | Y         | N         | Y        | Invalid|
| Y         | Y         | Y         | N        | Invalid|

## Next Steps

- Apply these techniques to [Severity vs Priority](06-severity-vs-priority.md) classification
- Use them for [Traceability and Requirements Coverage](07-traceability-requirements-coverage.md)
