# Test Levels and Test Pyramids

## Overview

Test levels define where and how testing occurs in the system architecture. The test pyramid guides how much testing to apply at each level for optimal cost, speed, and coverage.

## Test Levels

### Unit Testing
**Scope:** Individual functions, methods, or classes in isolation

**Who:** Developers

**When:** During development, before code review

**Tools:** JUnit, pytest, Jest, Mocha, xUnit frameworks

**Characteristics:**
- Fastest execution (milliseconds)
- Isolates dependencies with mocks/stubs
- Highest code coverage potential
- Cheapest to create and maintain
- Runs locally and in CI

**Example:**
Testing a function that calculates sales tax:
```python
def test_calculate_tax():
    assert calculate_tax(100, 0.08) == 8.0
    assert calculate_tax(0, 0.08) == 0.0
    assert calculate_tax(100, 0) == 0.0
```

**What It Catches:**
- Logic errors
- Edge cases in algorithms
- Incorrect calculations
- Null/undefined handling

**What It Misses:**
- Integration problems
- Configuration issues
- Database query errors
- UI rendering problems

### Integration Testing
**Scope:** Interaction between components, modules, or services

**Who:** Developers and QA engineers

**When:** After unit tests pass, before system testing

**Tools:** pytest with fixtures, Testcontainers, Spring Test, API testing tools

**Characteristics:**
- Moderate execution speed (seconds)
- Tests real integrations (databases, message queues, APIs)
- Requires test data and environment setup
- More complex than unit tests
- Can run in CI with service containers

**Example:**
Testing user service integration with database:
```python
def test_user_creation_persists():
    user = create_user("test@example.com", "password123")
    retrieved = get_user_by_email("test@example.com")
    assert user.id == retrieved.id
    assert user.email == retrieved.email
```

**What It Catches:**
- API contract mismatches
- Database schema issues
- Service communication failures
- Data serialization problems
- Authentication/authorization flows

**What It Misses:**
- Full end-to-end user workflows
- UI interactions
- Performance at scale
- Cross-browser issues

### System Testing
**Scope:** Complete, integrated system as a whole

**Who:** QA engineers

**When:** After integration testing, before UAT

**Tools:** Selenium, Playwright, Cypress, Postman collections, JMeter

**Characteristics:**
- Slower execution (minutes to hours)
- Tests complete functionality end-to-end
- Requires full environment
- Tests business workflows
- May include non-functional testing (performance, security)

**Example:**
Testing e-commerce checkout:
1. User logs in
2. Searches for product
3. Adds to cart
4. Proceeds to checkout
5. Enters payment information
6. Confirms order
7. Receives confirmation email

**What It Catches:**
- Complete workflow failures
- Cross-module integration issues
- Configuration problems
- Environment-specific bugs
- Business logic errors

**What It Misses:**
- Real user behavior patterns
- Production-specific issues
- Scale and performance under real load
- User satisfaction

### Acceptance Testing (UAT)
**Scope:** Validation against business requirements and user needs

**Who:** Business stakeholders, end users, QA

**When:** After system testing, before production release

**Tools:** Manual testing, exploratory testing, TestRail, Jira

**Characteristics:**
- Validates business value
- Real or realistic user scenarios
- May include alpha/beta testing
- Go/no-go decision point
- Focuses on usability and business fit

**Example:**
Business users validating a new reporting feature:
- Can they generate the reports they need?
- Is the data accurate and timely?
- Is the UI intuitive for their workflow?
- Does it meet the original business requirement?

**What It Catches:**
- Requirements misinterpretation
- Usability issues
- Business logic gaps
- Missing functionality

**What It Misses:**
- Rare edge cases
- Performance at extreme scale
- Security vulnerabilities
- Code quality issues

## The Test Pyramid

### Classic Test Pyramid (Mike Cohn)

```
        /\
       /  \      E2E Tests (UI)
      /----\
     /      \    Integration Tests
    /--------\
   /          \  Unit Tests
  /____________\
```

### Proportion Guidelines

**70% Unit Tests**
- Fast, cheap, abundant
- High code coverage
- Isolate business logic

**20% Integration Tests**
- Validate component interactions
- Test critical integration points
- Balance coverage and speed

**10% End-to-End Tests**
- Validate critical user paths
- Smoke tests for deployments
- High-value scenarios only

### Why This Shape?

**Bottom (Unit Tests):**
- Fastest feedback
- Cheapest to create and maintain
- Most stable (fewer dependencies)
- Best for TDD

**Middle (Integration Tests):**
- Balance of speed and realism
- Catch integration bugs early
- Validate contracts between services

**Top (E2E Tests):**
- Slowest and most brittle
- Expensive to maintain
- Essential for confidence in critical flows
- Should be selective, not comprehensive

## Anti-Pattern: Ice Cream Cone

```
  ____________
  \          /  Manual Testing
   \        /
    \------/    E2E Automated Tests
     \----/
      \  /      Integration Tests
       \/       Unit Tests
```

### Problems
- Heavy reliance on slow, brittle E2E tests
- Manual testing becomes bottleneck
- Long feedback loops
- High maintenance cost
- Flaky tests erode confidence

### Common Causes
- "We need to test what users do" (true, but not ONLY that way)
- Legacy codebase not designed for testing
- GUI-first testing approach
- Lack of unit testing culture

## Modern Variations

### Testing Trophy (Kent C. Dodds)

```
      /\
     /  \     E2E
    /    \
   /------\   Integration
  /        \  (largest layer)
 /----------\
/    Unit    \ Static Analysis
```

**Philosophy:** Integration tests provide best ROI for web applications

**Rationale:**
- Unit tests can give false confidence (mocks vs reality)
- Integration tests catch more real bugs
- E2E still needed but minimized
- Static analysis (TypeScript, linters) catches low-level errors

**Best For:** Web applications, especially React/Vue/Angular

### Testing Honeycomb (Spotify)

Emphasizes integrated tests over pure unit tests for microservices.

**Philosophy:** Microservices change unit/integration boundary

**Key Points:**
- Service-level tests are the new "unit"
- Contract testing replaces some integration tests
- Reduced reliance on E2E
- Focus on deployment confidence

## Applying Test Levels

### Web Application Example

**Unit Tests:**
- Form validation logic
- Date formatting utilities
- Calculation functions
- State management reducers

**Integration Tests:**
- API endpoints with database
- Authentication flow
- File upload processing
- Payment processing

**System Tests:**
- User registration to dashboard
- Complete checkout flow
- Search and filter functionality
- Admin workflows

**Acceptance Tests:**
- Beta user feedback
- Stakeholder demos
- Business scenario validation

### Microservices Example

**Unit Tests:**
- Service business logic
- Data transformation
- Input validation

**Contract Tests:**
- API contracts between services
- Message format validation
- Schema compatibility

**Integration Tests:**
- Service with database
- Service with message queue
- Service with external API

**E2E Tests:**
- Critical user journeys across services
- Deployment smoke tests

## Choosing Test Level for a Scenario

### Decision Flow

**Can it be tested as a pure function?**
→ Yes: Unit test

**Does it require external systems (DB, API)?**
→ Yes: Integration test

**Does it span multiple services/modules?**
→ Yes: System test

**Does it require user validation?**
→ Yes: Acceptance test

### Example: Password Reset Feature

**Unit Tests:**
- Password strength validation
- Token generation logic
- Email template rendering

**Integration Tests:**
- Password reset request saves to database
- Email service sends reset email
- Token validation against database

**System Tests:**
- User requests reset → receives email → clicks link → sets new password → logs in

**Acceptance Tests:**
- Business stakeholders verify email content is appropriate
- Users confirm reset flow is intuitive

## Common Mistakes

### Too Many E2E Tests
**Symptom:** Test suite takes hours, frequently fails, hard to debug

**Fix:** Push tests down the pyramid. If you can test it with an integration test, do that instead.

### No Integration Tests
**Symptom:** Unit tests pass but production fails with integration issues

**Fix:** Add integration tests for critical paths. Don't jump straight from unit to E2E.

### Testing Implementation, Not Behavior
**Symptom:** Tests break with every refactor

**Fix:** Test public interfaces and behaviors, not internal implementation details.

### Not Running Tests Frequently
**Symptom:** Tests fail in CI after working locally

**Fix:** Run all test levels in CI. Run fast tests (unit, integration) pre-commit.

## Test Level Performance Targets

| Level | Target Speed | Acceptable Failure Rate |
|-------|-------------|------------------------|
| Unit | < 100ms | < 0.1% |
| Integration | < 5s | < 1% |
| System | < 5min | < 5% |
| E2E | < 30min | < 10% |

Higher levels inherently have more instability due to dependencies.

## What Senior Engineers Know

**The pyramid is a guideline, not a law.** Context matters. A legacy GUI app might have an inverted pyramid temporarily while you build unit testing culture.

**Speed matters more than you think.** A test suite that takes an hour won't get run. Optimize for fast feedback loops.

**The pyramid evolves with architecture.** Microservices shift the balance. Serverless changes it again. Adapt your strategy.

**Integration tests catch the most valuable bugs.** Unit tests catch logic errors. E2E tests catch user experience issues. But integration tests catch the contract violations and miscommunications between teams.

**Not everything needs all levels.** A simple CRUD endpoint doesn't need E2E tests. A critical payment flow needs all levels.

## Exercise

For each scenario, identify the appropriate test level(s):

1. Validating a tax calculation algorithm with various inputs
2. Testing that a user can complete a purchase end-to-end
3. Verifying an API endpoint correctly saves data to the database
4. Checking that two microservices communicate correctly
5. Confirming business stakeholders are satisfied with a new report
6. Testing error handling when a database connection fails
7. Validating a front-end form submission calls the correct API

**Answers:**
1. Unit test (pure logic)
2. System/E2E test (complete workflow)
3. Integration test (API + database)
4. Integration/contract test (service-to-service)
5. Acceptance test (business validation)
6. Integration test (service with dependency)
7. Integration test (UI + API)

## Next Steps

- Learn about [Risk-Based Testing](04-risk-based-testing.md)
- Explore [Test Design Techniques](05-test-design-techniques.md)
