# Traceability and Requirements Coverage

## Overview

Traceability links requirements to test cases, ensuring complete coverage and enabling impact analysis. It answers: "Did we test everything?" and "What breaks if this changes?"

## Core Concepts

### Requirements Traceability
The ability to trace a requirement through all phases:
- Business need → Requirement → Design → Code → Test → Validation

### Traceability Matrix
Document linking requirements to test cases, showing coverage.

### Bidirectional Traceability
- **Forward:** Requirement → Test cases
- **Backward:** Test case → Requirement

## Why Traceability Matters

### Ensure Coverage
Identify untested requirements before release.

### Impact Analysis
Understand what to retest when requirements change.

### Regulatory Compliance
Demonstrate testing completeness for audits (FDA, ISO, etc.).

### Communication
Show stakeholders that requirements are validated.

### Maintenance
Understand why tests exist, making them easier to update.

## Requirements Coverage

### Coverage Formula

```
Coverage % = (Requirements with tests / Total requirements) × 100
```

### Example

**Total Requirements:** 50
**Requirements with test cases:** 45
**Requirements without tests:** 5
**Coverage:** 90%

**Uncovered requirements should be:**
- Intentionally not tested (documented why)
- Scheduled for testing
- Removed if obsolete

## Creating a Traceability Matrix

### Basic Structure

| Requirement ID | Requirement Description | Test Case ID | Test Case Description | Status |
|----------------|-------------------------|--------------|----------------------|--------|
| REQ-001 | User can log in | TC-001, TC-002 | Login happy path, invalid creds | Pass |
| REQ-002 | Password must be 8+ chars | TC-003 | Password validation | Pass |
| REQ-003 | User can reset password | TC-004, TC-005 | Password reset flow, expired token | Fail |

### Extended Matrix

Add columns for:
- Test execution date
- Tester name
- Build version
- Comments/notes
- Risk level
- Automation status

### Multi-Level Traceability

```
Business Need → Epic → User Story → Requirement → Test Case → Test Result

Example:
BN-001: Improve user retention
  ↓
EPIC-001: User authentication improvements
  ↓
US-001: As a user, I want to reset my password
  ↓
REQ-001: System shall send password reset email within 5 minutes
  ↓
TC-001: Verify reset email sent within 5 minutes
  ↓
Result: Pass
```

## Traceability in Practice

### Example: E-Commerce Checkout

**Requirements:**

**REQ-101:** User can view cart contents
**REQ-102:** User can modify cart quantities
**REQ-103:** User can remove items from cart
**REQ-104:** User can apply discount code
**REQ-105:** Cart total updates automatically
**REQ-106:** User can proceed to checkout

**Test Cases:**

**TC-101:** View cart with multiple items
**TC-102:** View empty cart
**TC-103:** Increase item quantity
**TC-104:** Decrease item quantity
**TC-105:** Change quantity to zero
**TC-106:** Remove item via delete button
**TC-107:** Apply valid discount code
**TC-108:** Apply invalid discount code
**TC-109:** Apply expired discount code
**TC-110:** Verify total recalculates on quantity change
**TC-111:** Verify total recalculates with discount
**TC-112:** Proceed to checkout with items
**TC-113:** Proceed to checkout with empty cart (negative)

**Traceability Matrix:**

| Requirement | Test Cases | Coverage |
|-------------|------------|----------|
| REQ-101 | TC-101, TC-102 | ✓ |
| REQ-102 | TC-103, TC-104, TC-105 | ✓ |
| REQ-103 | TC-106 | ✓ |
| REQ-104 | TC-107, TC-108, TC-109 | ✓ |
| REQ-105 | TC-110, TC-111 | ✓ |
| REQ-106 | TC-112, TC-113 | ✓ |

**Coverage:** 6/6 requirements = 100%

## Impact Analysis Using Traceability

### Scenario: Requirement Change

**Change:** REQ-104 updated: "User can apply up to 3 discount codes simultaneously"

**Impact Analysis:**
1. Check traceability matrix
2. Find affected test cases: TC-107, TC-108, TC-109
3. Add new test cases:
   - TC-114: Apply multiple valid codes
   - TC-115: Apply >3 codes (negative)
   - TC-116: Verify discount stacking logic
4. Update TC-111: Multiple discounts in total calculation

**Regression Scope:**
- Must retest: TC-107 through TC-116
- Should retest: TC-110, TC-111 (total calculation changed)
- Optional: All other checkout tests (sanity)

### Scenario: Defect Found

**Defect:** Cart total doesn't update when discount is applied

**Root Cause Analysis:**
1. Check which requirement is failing: REQ-105
2. Check which test should have caught it: TC-111
3. Analysis: TC-111 exists but wasn't executed in this build
4. Fix process: Execute missing test, update execution tracking

## Tools and Techniques

### Spreadsheet Method
**Pros:** Simple, flexible, version control with Git
**Cons:** Manual maintenance, no automated validation
**Best For:** Small projects, regulated industries requiring audit trail

### Test Management Tools
**Examples:** TestRail, Zephyr, qTest, PractiTest

**Features:**
- Link requirements to tests
- Coverage reports
- Impact analysis
- Test execution tracking

**Best For:** Medium to large teams, complex projects

### Requirements Management Tools
**Examples:** Jira, Azure DevOps, Doors

**Features:**
- Requirements versioning
- Bidirectional traceability
- Change impact analysis
- Approval workflows

**Best For:** Large organizations, regulated industries

### Automated Traceability
Link requirements to tests in code:

```python
@requirement("REQ-101")
@requirement("REQ-105")
def test_cart_total_updates():
    cart.add_item("Widget", quantity=2, price=10.00)
    assert cart.total == 20.00
    cart.update_quantity("Widget", 3)
    assert cart.total == 30.00
```

**Benefits:**
- Always current
- Generates coverage reports automatically
- Enforces requirement linking

**Tools:** pytest markers, JUnit tags, custom frameworks

## Coverage Analysis

### Coverage Gaps

**Scenario:** 45 of 50 requirements covered

**Analysis:**
1. Identify the 5 uncovered requirements
2. Categorize reason:
   - Not yet implemented
   - Testing not needed (UI only, documented)
   - Testing planned but not executed
   - Testing forgotten

**Actions:**
- Forgotten → Create tests immediately
- Not implemented → Add to backlog
- Not needed → Document rationale
- Planned → Track and execute

### Over-Coverage

**Scenario:** Requirement has 20 test cases

**Analysis:**
- Is this intentional (high-risk area)?
- Are tests redundant?
- Can tests be consolidated?

**Actions:**
- Keep all tests if justified by risk
- Remove redundant tests
- Refactor overlapping tests

## Requirements Quality Impact

### Testable Requirements

**Good:** "System shall send password reset email within 5 minutes of request"
- Clear: what happens
- Measurable: 5 minutes
- Verifiable: can test

**Bad:** "System shall handle password reset efficiently"
- Vague: what is "efficiently"?
- Not measurable
- Cannot verify

### Traceability Highlights Poor Requirements

If you struggle to write test cases for a requirement:
- Requirement is ambiguous
- Requirement is incomplete
- Requirement is not testable

**Action:** Feed back to requirements author for clarification.

## Reporting Traceability

### Coverage Report

**Summary:**
- Total requirements: 120
- Requirements covered: 115 (96%)
- Requirements not covered: 5 (4%)

**Uncovered Requirements:**
- REQ-045: UI-only change, visual review sufficient
- REQ-078: Not implemented in this release
- REQ-092: Testing in progress
- REQ-103: Deprecated, to be removed
- REQ-118: New requirement, test cases in development

**Action Items:**
- Complete testing for REQ-092 and REQ-118 before release
- Remove REQ-103 from requirements
- Document REQ-045 rationale

### Impact Report (Requirement Change)

**Requirement Changed:** REQ-025

**Impact:**
- Affected test cases: TC-050, TC-051, TC-052, TC-089
- Estimated rework: 4 hours
- Regression scope: 12 test cases
- Risk: Medium (core functionality)

**Recommendation:** Update tests and execute full regression before release.

## Compliance and Regulation

### FDA (Medical Devices)
Requires traceability from user needs through verification and validation.

**Required:**
- Design input → Design output → Verification
- User needs → Validation testing

### ISO 26262 (Automotive)
Requires safety requirements traced through design, implementation, testing.

### DO-178C (Aviation Software)
Strict traceability from high-level requirements to low-level requirements to source code to tests.

### Traceability for Audit

**Auditor Questions:**
- "How do you know this requirement was tested?"
- "What happens if this requirement changes?"
- "Show me all tests for this safety-critical requirement."

**Answer:** Traceability matrix demonstrating coverage and impact analysis capability.

## Common Mistakes

### Traceability as Checkbox Exercise
**Problem:** Create matrix once, never update

**Fix:** Keep matrix current, review in every sprint/release

### Too Granular
**Problem:** Link every test step to every requirement detail

**Fix:** Trace at appropriate level (user story to test case, not step-by-step)

### No Bidirectional Trace
**Problem:** Can find tests for requirement, but can't find requirement for test

**Fix:** Ensure every test links back to requirement

### Manual Maintenance at Scale
**Problem:** Matrix becomes unmaintainable

**Fix:** Use tools or automated tagging for projects >50 requirements

## What Senior Engineers Know

**Traceability is insurance.** Seems like overhead until you need it. When a critical requirement changes or an audit happens, you'll be glad it exists.

**Requirements change constantly.** Traceability helps you keep up. Without it, you're guessing what to retest.

**Perfect traceability is expensive.** Balance rigor with pragmatism. Safety-critical systems need strict traceability. Internal tools may not.

**Gaps in coverage are normal.** 100% is not always necessary. Consciously decide what not to test and document why.

**Automated traceability scales better.** Spreadsheets work for 50 requirements. Tools or code-based tracing needed for 500+.

## Exercise

**Scenario: Library Management System**

**Requirements:**
1. User can search books by title
2. User can search books by author
3. User can search books by ISBN
4. User can check out available books
5. User cannot check out books that are unavailable
6. User can return books
7. System sends reminder email 3 days before due date

**Create:**
1. List of test cases covering these requirements
2. Traceability matrix linking requirements to tests
3. Identify coverage percentage
4. For requirement #4 change ("User can check out up to 5 books"), perform impact analysis

**Sample Answer:**

**Test Cases:**
- TC-01: Search by title returns correct results
- TC-02: Search by author returns correct results
- TC-03: Search by ISBN returns correct book
- TC-04: Checkout available book succeeds
- TC-05: Checkout unavailable book fails with error
- TC-06: Return checked-out book succeeds
- TC-07: Reminder email sent 3 days before due date
- TC-08: Reminder email not sent if book returned early

**Traceability Matrix:**

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| 1. Search by title | TC-01 | ✓ |
| 2. Search by author | TC-02 | ✓ |
| 3. Search by ISBN | TC-03 | ✓ |
| 4. Checkout available | TC-04 | ✓ |
| 5. Cannot checkout unavailable | TC-05 | ✓ |
| 6. Return books | TC-06 | ✓ |
| 7. Reminder email | TC-07, TC-08 | ✓ |

**Coverage:** 7/7 = 100%

**Impact Analysis for Req #4 Change:**
- Affected tests: TC-04
- New tests needed:
  - TC-09: Checkout 5 books succeeds
  - TC-10: Checkout 6th book fails with limit error
  - TC-11: Return book and checkout another succeeds
- Regression scope: All checkout and return tests (TC-04, TC-05, TC-06, TC-09, TC-10, TC-11)

## Next Steps

- Apply traceability concepts to [Software QA](../02-software-qa/)
- Use [templates/traceability-matrix.md](../../templates/traceability-matrix.md) for your projects
- Learn about [Release Quality](../09-release-quality/) which relies on coverage analysis
