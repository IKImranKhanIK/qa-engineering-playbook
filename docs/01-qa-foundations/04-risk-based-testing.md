# Risk-Based Testing

## Overview

Risk-based testing prioritizes testing efforts based on the probability and impact of potential failures. It ensures critical areas receive appropriate coverage even under time constraints.

## Core Concept

You cannot test everything. Risk-based testing answers: **What should we test first and most thoroughly?**

## Risk Components

### Risk = Probability × Impact

**Probability (Likelihood):**
How likely is this to fail?
- Complexity of code
- Newness of feature
- Historical defect data
- Technology maturity
- Team experience

**Impact (Severity):**
How bad would failure be?
- User impact
- Business impact
- Security implications
- Regulatory consequences
- Data loss potential

### Risk Matrix

```
         Impact →
         Low    Medium    High
      ┌──────┬─────────┬──────────┐
High  │  M   │    H    │    H     │
  ↓   ├──────┼─────────┼──────────┤
Med   │  L   │    M    │    H     │
  ↓   ├──────┼─────────┼──────────┤
Low   │  L   │    L    │    M     │
      └──────┴─────────┴──────────┘
Probability

H = High Risk (test thoroughly)
M = Medium Risk (test adequately)
L = Low Risk (minimal testing acceptable)
```

## Risk Assessment Process

### Step 1: Identify Risk Areas

List all features, modules, or components:
- User authentication
- Payment processing
- Data export
- Profile settings
- Email notifications
- Admin dashboard

### Step 2: Assess Probability

For each area, rate likelihood of failure (1-5):

**5 - Very High:**
- New code, complex algorithm
- Unfamiliar technology
- High historical bug rate
- No automated tests

**4 - High:**
- Significant changes
- Multiple dependencies
- Moderate complexity

**3 - Medium:**
- Some changes
- Established patterns
- Average complexity

**2 - Low:**
- Minor changes
- Well-tested patterns
- Simple logic

**1 - Very Low:**
- No changes
- Proven stable
- Simple and isolated

### Step 3: Assess Impact

For each area, rate impact of failure (1-5):

**5 - Critical:**
- Data loss or corruption
- Security breach
- Financial loss
- Regulatory violation
- Complete service outage

**4 - High:**
- Major functionality broken
- Significant user impact
- Reputation damage
- Revenue impact

**3 - Medium:**
- Partial functionality affected
- Workaround available
- Limited user impact

**2 - Low:**
- Minor inconvenience
- Cosmetic issues
- Edge case scenarios

**1 - Very Low:**
- Trivial impact
- Rarely used feature
- Easy to fix if found

### Step 4: Calculate Risk Score

Risk Score = Probability × Impact

| Feature | Probability | Impact | Risk Score | Priority |
|---------|-------------|--------|------------|----------|
| Payment processing | 3 | 5 | 15 | High |
| User authentication | 2 | 5 | 10 | High |
| Profile settings | 4 | 2 | 8 | Medium |
| Email notifications | 3 | 2 | 6 | Medium |
| Admin dashboard | 2 | 3 | 6 | Medium |
| Data export | 1 | 4 | 4 | Low |

### Step 5: Allocate Testing Effort

**High Risk (12-25):**
- Comprehensive test coverage
- Multiple test levels
- Automated and manual testing
- Security/performance testing
- Code review mandatory

**Medium Risk (6-11):**
- Adequate test coverage
- Focus on critical paths
- Automated tests for core scenarios
- Standard code review

**Low Risk (1-5):**
- Basic test coverage
- Smoke testing
- Automated unit tests
- Light code review

## Real-World Example: E-Commerce Release

### Feature List

1. New payment gateway integration
2. Product recommendation algorithm
3. Updated footer links
4. Improved search ranking
5. Guest checkout
6. Admin reporting dashboard

### Risk Assessment

| Feature | Prob | Impact | Risk | Effort Allocation |
|---------|------|--------|------|-------------------|
| New payment gateway | 4 | 5 | 20 | 40% |
| Guest checkout | 3 | 4 | 12 | 25% |
| Search ranking | 4 | 3 | 12 | 20% |
| Recommendations | 2 | 3 | 6 | 10% |
| Admin reporting | 2 | 2 | 4 | 4% |
| Footer links | 1 | 1 | 1 | 1% |

### Testing Strategy

**Payment Gateway (High Risk):**
- Integration tests with sandbox
- End-to-end checkout flows
- Error handling scenarios
- Security review
- Load testing
- Manual exploratory testing
- Rollback plan

**Guest Checkout (High Risk):**
- Full user journey testing
- Edge cases (abandoned carts, errors)
- Cross-browser testing
- Performance testing
- Data validation

**Search Ranking (Medium Risk):**
- Automated regression tests
- Sample queries validation
- Performance benchmarks
- A/B test if possible

**Recommendations (Medium Risk):**
- Algorithm unit tests
- Sample validation
- Monitor in production

**Admin Reporting (Low Risk):**
- Basic smoke test
- Sample report validation

**Footer Links (Low Risk):**
- Visual check
- Link validation

## Dynamic Risk Assessment

Risk changes throughout the project:

### Initial Assessment
Based on requirements and design

### Mid-Development Update
- Complexity higher than expected? Increase probability
- Feature scope reduced? Reduce impact
- Dependencies discovered? Adjust accordingly

### Pre-Release Update
- Found bugs in area? Increase probability
- Added automated tests? Decrease probability
- Performance concerns? Increase impact

### Post-Release Monitoring
- Production issues? Update for next release
- Stable in production? Lower future risk

## Risk Factors to Consider

### Technical Risk Factors

**High Probability:**
- New technology or framework
- Complex algorithms
- High code churn
- Many dependencies
- Performance-sensitive code
- Concurrency/threading
- Distributed systems

**Low Probability:**
- Mature, stable code
- Simple CRUD operations
- Well-understood patterns
- Few dependencies
- High test coverage

### Business Risk Factors

**High Impact:**
- Payment processing
- User data handling
- Legal/compliance requirements
- Core product functionality
- High-traffic features
- Revenue-generating features

**Low Impact:**
- Internal tools
- Admin features (limited users)
- Experimental features
- Deprecated functionality
- Cosmetic changes

### Risk Mitigation Strategies

**High Risk, High Impact:**
- Feature flags for gradual rollout
- Extra monitoring and alerting
- Rollback plan ready
- On-call engineer assigned
- Canary deployments

**High Probability, Low Impact:**
- Automated tests
- Monitoring
- Accept some bugs
- Fix quickly in production

**Low Probability, High Impact:**
- Disaster recovery plan
- Incident response prepared
- Monitor closely
- Security review

**Low Probability, Low Impact:**
- Minimal testing
- Fix if found
- May accept bugs

## Common Mistakes

### Testing Everything Equally
**Problem:** Spend too much time on low-risk areas, insufficient time on high-risk

**Fix:** Use risk matrix to guide effort allocation explicitly

### Ignoring Historical Data
**Problem:** Treat all new features as equal risk

**Fix:** Review past defect patterns. Components with high bug history are higher risk.

### Static Risk Assessment
**Problem:** Risk assigned once at planning, never updated

**Fix:** Revisit risk as you learn more during development and testing

### Skipping Low-Risk Testing Entirely
**Problem:** Assume low-risk means no risk

**Fix:** Low-risk still needs basic validation. Don't skip entirely.

### Only Technical Risk
**Problem:** Focus solely on code complexity, ignore business impact

**Fix:** Balance technical and business risk. Simple code processing payments is high risk.

## Risk-Based Test Design

### High-Risk Feature Testing

**Payment Processing Test Coverage:**

**Positive Scenarios:**
- Successful credit card payment
- Successful PayPal payment
- Successful debit card payment

**Negative Scenarios:**
- Declined card
- Expired card
- Insufficient funds
- Invalid card number
- Network timeout
- Gateway unavailable

**Boundary Scenarios:**
- Minimum purchase amount
- Maximum purchase amount
- Special characters in name
- International cards

**Security Scenarios:**
- SQL injection attempts
- XSS attempts
- CSRF protection
- PCI compliance validation

### Low-Risk Feature Testing

**Footer Links Test Coverage:**

**Positive Scenarios:**
- Links navigate correctly

**Negative Scenarios:**
- (Maybe none needed)

**Boundary Scenarios:**
- (Probably none)

## Communicating Risk

### To Management
"We have limited time. If we focus testing on payment processing and checkout (70% of our effort), we'll cover the highest business risk areas. The footer updates are low risk and will get minimal testing."

### To Development Team
"Payment gateway integration is high risk due to complexity and business impact. Let's add comprehensive logging, error handling, and test coverage there."

### To Stakeholders
"We recommend phased rollout for the new payment system (high risk). The footer changes can go to all users immediately (low risk)."

## What Senior Engineers Know

**Perfect testing is impossible.** Risk-based testing acknowledges this and makes deliberate choices about trade-offs.

**Risk assessment is subjective but valuable.** Two engineers might score risks differently. The process of thinking through risk is what matters.

**Risk changes.** A feature that's high risk on day one becomes low risk after six months of stability. Reassess regularly.

**Ship with known low-severity bugs.** If you've tested high-risk areas thoroughly and have only low-risk bugs remaining, ship it. Don't delay launch for trivial issues.

**Data beats intuition.** Use production metrics, defect history, and customer feedback to inform risk assessment, not just gut feeling.

## Exercise

Assess risk for these scenarios and prioritize testing effort:

**Scenario: Banking App Update**

Features in release:
1. New bill pay functionality
2. Updated logo and colors
3. Improved transaction search
4. Biometric login option
5. Help documentation updates

For each feature:
- Estimate Probability (1-5)
- Estimate Impact (1-5)
- Calculate Risk Score
- Prioritize testing effort

**Sample Answer:**

1. Bill pay: P=4, I=5, Risk=20 (45% effort) - New feature, financial impact
2. Biometric login: P=3, I=4, Risk=12 (25% effort) - Security critical, new tech
3. Transaction search: P=3, I=3, Risk=9 (20% effort) - Core feature, changes
4. Logo/colors: P=1, I=1, Risk=1 (5% effort) - Low complexity, low impact
5. Help docs: P=1, I=1, Risk=1 (5% effort) - Non-functional, low impact

## Next Steps

- Learn about [Test Design Techniques](05-test-design-techniques.md)
- Explore [Severity vs Priority](06-severity-vs-priority.md)
- Apply risk-based thinking to [Traceability and Requirements Coverage](07-traceability-requirements-coverage.md)
