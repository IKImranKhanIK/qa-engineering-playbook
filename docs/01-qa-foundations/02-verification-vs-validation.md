# Verification vs Validation

## Overview

Verification and validation are complementary quality activities often confused. Both are essential, but they answer different questions and occur at different points in development.

## Core Definitions

### Verification
**Question:** Are we building the product right?

**Focus:** Conformance to specifications

**Method:** Reviews, inspections, walkthroughs, analysis

**Timing:** Throughout development

**No Customer Interaction Required**

### Validation
**Question:** Are we building the right product?

**Focus:** Meeting user needs and expectations

**Method:** Testing with real or simulated usage

**Timing:** Primarily after implementation

**Requires Customer/User Context**

## The Classic Distinction

**Verification:** Did we implement the feature according to the specification?

**Validation:** Does the feature actually solve the user's problem?

### Example: Login Feature

**Specification says:**
"Password must be minimum 8 characters with at least one number"

**Verification checks:**
- Code enforces 8 character minimum? Yes/No
- Code requires at least one number? Yes/No
- Error message displays correctly? Yes/No

**Validation checks:**
- Can users actually log in successfully?
- Is the password policy too strict or too lenient for security needs?
- Does the error message help users fix their password?
- Is the login experience acceptable to end users?

## Verification Activities

### Static Testing
Examination without executing code:
- Code reviews
- Architecture reviews
- Design walkthroughs
- Specification reviews
- Static analysis tools

### Inspection Methods
- Requirements traceability checks
- Compliance audits
- Standards verification
- Documentation reviews
- Peer reviews

### Example Verification Scenarios

**API Design Review:**
Verify the API specification includes all required endpoints, proper HTTP methods, error codes, and follows REST conventions.

**Database Schema Review:**
Verify tables include proper indexes, foreign keys, constraints, and normalization according to design document.

**Test Plan Review:**
Verify test plan covers all requirements, includes proper test levels, and aligns with test strategy.

## Validation Activities

### Dynamic Testing
Execution-based validation:
- Unit testing
- Integration testing
- System testing
- User acceptance testing
- Performance testing

### User-Centric Methods
- Usability testing
- Beta testing
- A/B testing
- Field trials
- Customer feedback sessions

### Example Validation Scenarios

**E-commerce Checkout:**
Validate users can complete purchases end-to-end, payment processing works correctly, and confirmation emails arrive.

**Search Functionality:**
Validate search returns relevant results, handles typos gracefully, and performs adequately with large datasets.

**Mobile App Navigation:**
Validate users can find features intuitively, navigation flows make sense, and common tasks are efficient.

## Why Both Matter

### Verification Alone is Insufficient

You can perfectly implement a badly specified feature:
- Feature works exactly as specified
- Specification was wrong for user needs
- Users can't or won't use the feature

**Example:**
A password reset link specified to expire in 5 minutes. Implementation is perfect (verified), but users can't complete reset in time (validation failure).

### Validation Alone is Insufficient

You can have the right idea but implement it incorrectly:
- Users want the feature
- Feature concept is validated
- Implementation has critical bugs

**Example:**
Users want dark mode. Concept validated with surveys. Implementation crashes on theme switch (verification failure).

## Timing and Cost

### Verification
**When:** Early and throughout

**Cost of Finding Issues:** Low to medium
- Requirements issue found in review: Very cheap
- Design flaw found in code review: Cheap
- Implementation error found in static analysis: Medium

**Prevention Value:** High - prevents building wrong solution

### Validation
**When:** During and after implementation

**Cost of Finding Issues:** Medium to high
- Issue found in development testing: Medium
- Issue found in UAT: High
- Issue found in production: Very high

**Prevention Value:** High - prevents shipping wrong solution

### Optimal Strategy
**Early Verification + Continuous Validation = Lowest Total Cost**

## Real-World Scenario: Mobile Payment App

### Verification Activities

**Requirements Review:**
- Check spec includes all payment methods
- Verify security requirements are specified
- Ensure error handling is defined
- Confirm compliance requirements listed

**Design Review:**
- Verify architecture supports PCI compliance
- Check encryption methods specified
- Validate database schema matches requirements
- Ensure API contracts are complete

**Code Review:**
- Verify payment logic matches specification
- Check error handling implemented as designed
- Validate security controls are in place
- Ensure logging follows standards

### Validation Activities

**Unit Testing:**
- Validate payment calculation logic
- Verify error handling behavior
- Test edge cases

**Integration Testing:**
- Validate app communicates with payment gateway
- Verify transaction flow end-to-end
- Test error scenarios with real API

**System Testing:**
- Validate complete user workflows
- Verify performance under load
- Test security controls effectiveness

**User Acceptance Testing:**
- Validate users can complete payments easily
- Verify payment methods meet user needs
- Test on real user devices and networks

## Common Mistakes

### Skipping Verification
"We'll catch it in testing"

**Problem:** Expensive to find design flaws late. Testing confirms implementation, not whether implementation matches intent.

**Impact:** Rework, delays, frustration.

### Skipping Validation
"It matches the spec, ship it"

**Problem:** Spec might be wrong. Feature might not work in real usage.

**Impact:** Customer dissatisfaction, returns, bad reviews.

### Confusing the Two
"We verified it in testing"

**Problem:** Testing is validation, not verification. Misusing terms causes confusion about what was actually done.

**Impact:** False confidence, gaps in coverage.

## V-Model Illustration

```
Requirements ←→ Acceptance Testing
     ↓                   ↑
  Design    ←→  System Testing
     ↓                   ↑
Architecture ←→ Integration Testing
     ↓                   ↑
  Coding    ←→  Unit Testing

Left side: Verification activities (reviews, inspections)
Right side: Validation activities (testing)
```

Each level of specification is verified during creation and validated through corresponding testing.

## Industry Standards

### IEEE Definition
- **Verification:** "The process of evaluating a system or component to determine whether the products of a given development phase satisfy the conditions imposed at the start of that phase."
- **Validation:** "The process of evaluating a system or component during or at the end of the development process to determine whether it satisfies specified requirements."

### FDA (Medical Devices)
- **Verification:** "Confirmation by examination and provision of objective evidence that specified requirements have been fulfilled."
- **Validation:** "Confirmation by examination and provision of objective evidence that the particular requirements for a specific intended use can be consistently fulfilled."

## What Senior Engineers Know

**Verification catches what was missed in specifications.** Requirements are never perfect. Reviews find gaps, ambiguities, and contradictions before they become code.

**Validation catches what specifications got wrong.** Users don't always know what they want until they see it. Testing reveals whether the specified solution actually works.

**Both require discipline.** Pressure to ship often leads to skipping verification ("just start coding") or validation ("it works on my machine"). Both shortcuts create technical debt.

**Automated verification is possible.** Static analysis, linting, contract testing, and architecture fitness functions enable continuous verification.

**Validation can shift left.** Unit tests, integration tests, and continuous delivery enable validating earlier and more frequently.

## Verification vs Validation in Different Contexts

### Software QA
- Verification: Code reviews, static analysis, design reviews
- Validation: Test automation, manual testing, UAT

### Hardware QA
- Verification: Design reviews, CAD simulations, tolerance analysis
- Validation: EVT, DVT, PVT testing, environmental tests

### Systems QA
- Verification: Interface specifications, integration design reviews
- Validation: End-to-end testing, field trials, soak tests

## Exercise

For each scenario, identify whether it's verification or validation:

1. Reviewing an API specification for completeness
2. Running automated tests against a new build
3. Checking code coverage metrics against team standards
4. Users testing a beta version of mobile app
5. Architect reviewing database design against requirements
6. Load testing a web application with 10,000 concurrent users
7. Inspecting source code for security vulnerabilities
8. Customers trying a new feature in production

**Answers:**
1. Verification (reviewing specification)
2. Validation (executing tests)
3. Verification (checking against standards)
4. Validation (user testing)
5. Verification (design review)
6. Validation (performance testing)
7. Verification (code inspection)
8. Validation (real usage)

## Practical Application

### In Test Planning
Include both:
- Verification activities: Requirements reviews, design walkthroughs, code reviews
- Validation activities: Test execution across all levels

### In Bug Reports
Clarify the failure type:
- Verification failure: "Code doesn't match specification"
- Validation failure: "Feature doesn't meet user needs"
- Both: "Specification was unclear AND implementation is wrong"

### In Status Reports
Report both:
- Verification: "All design reviews complete, 3 issues found and resolved"
- Validation: "75% test cases passed, 2 high-priority failures"

## Next Steps

- Learn about [Test Levels and Pyramids](03-test-levels-and-pyramids.md)
- Explore [Risk-Based Testing](04-risk-based-testing.md)
