# Incident Learning

## Overview

Incidents happen. Servers crash, databases fail, deployments go wrong, and third-party APIs timeout. What separates mature engineering teams from chaotic ones is how they respond to and learn from incidents. As a QA engineer, you play a critical role in incident prevention (through testing), incident response (validation and debugging), and incident learning (turning failures into test cases).

**The goal of incident response:** Not to assign blame, but to learn and prevent recurrence.

---

## Incident Lifecycle

```
Detection → Response → Resolution → Recovery → Learning
    │          │            │            │          │
    │          │            │            │          │
    ▼          ▼            ▼            ▼          ▼
 Alert     Triage      Fix/Rollback   Verify   Postmortem
 Fired     Assemble    Deploy         SLOs     Action Items
          Incident     Mitigation     Met      Test Cases
          Team
```

### Incident Severity Levels

```
SEV-1 (Critical):
- Complete service outage affecting all users
- Data loss or corruption
- Security breach
- Financial impact immediate and severe
- Response: Immediate, all-hands, 24/7 until resolved
- Examples:
  * Payment processing down (can't take orders)
  * Database deleted or corrupted
  * Authentication system completely broken

SEV-2 (Major):
- Partial service degradation affecting significant percentage of users
- Core feature unavailable
- Significant performance degradation
- Response: Within 30 minutes, dedicated team, business hours
- Examples:
  * Search functionality down (users can't find products)
  * High error rate (10% of requests failing)
  * p95 latency 10x normal (5s instead of 500ms)

SEV-3 (Minor):
- Limited impact on small subset of users
- Non-critical feature unavailable
- Workaround available
- Response: Within 4 hours, assigned engineer, normal business hours
- Examples:
  * Recommendation engine down (users can still browse/buy)
  * Export feature broken (manual export available)
  * Specific browser has UI glitch

SEV-4 (Cosmetic):
- No user impact or minimal cosmetic issue
- Response: Next sprint, prioritized with other work
- Examples:
  * UI alignment issue
  * Typo in help text
  * Minor analytics dashboard bug
```

---

## QA's Role During Incidents

### 1. Detection (Before Official Incident Declared)

```
QA's Monitoring Responsibilities:

Automated Test Failures:
- Synthetic tests failing in production → Early signal
- CI/CD smoke tests failing after deployment → Rollback signal
- Canary tests showing elevated errors → Stop rollout

Example:
10:45 AM - Synthetic test alerts:
  ❌ Checkout flow test failed (timeout after 5s)
  ❌ Payment processing test failed (500 Internal Server Error)
  ✅ Product browsing test passed

Action: Notify on-call engineer immediately, potential SEV-2
```

### 2. Response (During Active Incident)

```
QA's Response Duties:

1. Validate Scope:
   - Which features are affected?
   - Which user segments? (All users? Specific region? Mobile only?)
   - Which environments? (Production? Staging also broken?)

2. Test Mitigations:
   - Engineer proposes rollback → QA validates rollback in staging first
   - Engineer proposes hotfix → QA tests fix in staging
   - Engineer proposes feature flag disable → QA confirms workaround

3. Monitor Recovery:
   - Run automated test suite against production
   - Check SLO compliance (error rate, latency returning to normal)
   - Validate user flows end-to-end

Example Incident Response:

11:00 AM - Incident declared (SEV-2: Payment processing down)
11:05 AM - QA validates scope:
  - Tested: Credit card payments failing (100% error rate)
  - Tested: PayPal payments working ✅
  - Tested: Product browsing/cart working ✅
  - Conclusion: Only credit card processor affected

11:15 AM - Engineer proposes rollback to previous deployment
11:18 AM - QA validates rollback in staging:
  - ✅ Credit card payment test passed
  - ✅ All other flows working
  - Recommendation: Proceed with rollback

11:25 AM - Rollback deployed to production
11:28 AM - QA validates production:
  - ✅ Credit card payment working
  - ✅ Error rate dropped from 15% to 0.1%
  - ✅ p95 latency returned to 250ms (was 5s)

11:30 AM - Incident resolved
```

### 3. Recovery (Post-Resolution Validation)

```
QA Recovery Checklist:

□ Run full regression test suite (automated)
□ Manual exploratory testing of affected areas
□ Check SLO compliance (back within error budget?)
□ Monitor for 2 hours post-resolution (ensure no relapse)
□ Validate data integrity (no corruption during incident)
□ Check customer support tickets (any residual impact?)

Recovery Validation Report:

Incident: SEV-2 Payment Processing Outage
Resolution Time: 11:30 AM
Recovery Validation: 11:30 AM - 1:30 PM

Automated Tests:
✅ 450/450 regression tests passed
✅ Payment integration tests: 50/50 passed
✅ End-to-end checkout flows: 15/15 passed

Manual Testing:
✅ Credit card payments (Visa, Mastercard, Amex): Working
✅ International payments (EUR, GBP): Working
✅ Refund processing: Working
✅ Subscription renewals: Working

SLO Compliance:
✅ Error rate: 0.08% (target: <0.1%)
✅ p95 latency: 245ms (target: <500ms)
✅ Availability: 99.92% (today)

Data Integrity:
✅ No duplicate charges detected
✅ All failed transactions during outage marked as "failed"
✅ No orphaned orders

Recommendation: Incident fully resolved, safe to resume normal operations
```

---

## Blameless Postmortems

### What is a Blameless Postmortem?

```
Blameless Culture:
- Focus on "what happened" not "who did it"
- Assume everyone acted with best intentions
- Humans don't cause failures, systems do
- Goal: Learn and improve, not punish

❌ Blaming:
"The incident happened because Sarah deployed without running tests"
→ Result: Sarah feels bad, hides future mistakes, team doesn't learn

✅ Blameless:
"The incident happened because deployment pipeline didn't enforce test gates"
→ Result: Fix the process (add automated gate), prevent recurrence

Key Principle: Bad outcomes ≠ bad people
```

### Postmortem Template

```markdown
# Postmortem: Payment Processing Outage

**Incident ID:** INC-2025-0042
**Date:** 2025-01-24
**Duration:** 45 minutes (11:00 AM - 11:45 AM)
**Severity:** SEV-2
**Impact:** 15% of checkout attempts failed (~1,200 customers affected)
**Authors:** Engineering Team + QA Lead
**Reviewed by:** CTO, VP Engineering, Product Manager

---

## Summary

On January 24, 2025, at 11:00 AM PST, our payment processing system experienced an outage affecting credit card payments. The issue was caused by a database migration that added a non-nullable column without a default value, causing all payment insertions to fail. The incident lasted 45 minutes and affected approximately 1,200 customers attempting checkout.

---

## Timeline (All times PST)

**10:30 AM** - Database migration deployed to production (change: add `fraud_score` column to `payments` table)

**10:45 AM** - First payment failure logged (no alert triggered, below threshold)

**11:00 AM** - Synthetic test failure alert fired: "Checkout flow test failed"
- On-call engineer (Mike) paged
- QA engineer (Sarah) notified

**11:05 AM** - Incident declared SEV-2
- Error rate jumped to 15% (threshold: 1%)
- Payment service returning HTTP 500

**11:08 AM** - Initial investigation
- Logs show: `SQL error: column "fraud_score" cannot be null`
- Database migration identified as likely cause

**11:15 AM** - Rollback decision made
- Rolled back database migration (dropped `fraud_score` column)

**11:20 AM** - Rollback complete, errors stopped

**11:25 AM** - Validation in progress
- QA running regression tests
- Error rate dropped to 0.1%

**11:30 AM** - Incident resolved
- All tests passing
- SLOs restored

**11:30 AM - 1:30 PM** - Recovery monitoring
- No further issues detected

**1:45 PM** - Incident postmortem meeting scheduled

---

## Root Cause Analysis

### Immediate Cause
Database migration added a non-nullable column (`fraud_score`) to the `payments` table without providing a default value. When application code attempted to insert payment records without specifying `fraud_score`, the database rejected the insertion, causing all payment processing to fail.

### Contributing Factors

1. **Insufficient testing of database migration:**
   - Migration tested in staging with synthetic test data
   - Staging database schema was already out of sync with production (had `fraud_score` column from previous test)
   - Migration appeared to work in staging but failed in production

2. **Missing rollback plan:**
   - Migration script had no automated rollback
   - Manual rollback required (took 15 minutes to execute)

3. **Delayed detection:**
   - First failures at 10:45 AM, alert at 11:00 AM (15-minute delay)
   - Alerting threshold too high (5% error rate to trigger)
   - Low traffic at 10:45 AM kept error rate below threshold

4. **Application not defensive:**
   - Application assumed all columns were optional or had defaults
   - No validation of database schema before deployment
   - No circuit breaker to fail gracefully when database errors occurred

### Root Cause (5 Whys)

**Why did payments fail?**
→ Database rejected INSERT statements for missing `fraud_score` column

**Why was the column missing from INSERT statements?**
→ Application code was not updated to include `fraud_score`

**Why wasn't application code updated?**
→ Migration was deployed before application code change

**Why was deployment order incorrect?**
→ No deployment orchestration enforcing order (schema first, then code)

**Why was there no orchestration?**
→ Deployment process relies on manual steps, easy to miss order

**Root Cause:** Lack of automated deployment orchestration for database schema changes

---

## Impact

**User Impact:**
- 1,200 customers unable to complete checkout (15% of checkout attempts during outage)
- Estimated lost revenue: $45,000 (based on average order value of $37.50)
- Increased support tickets: 87 complaints about payment failures

**Business Impact:**
- Error budget consumed: 18 minutes (out of 43.2 minutes monthly budget for 99.9% SLO)
- Remaining error budget: 25.2 minutes (58% of monthly budget)

**SLO Impact:**
- Availability: 99.95% → 99.89% (daily)
- p95 latency: 250ms → 380ms (during incident, spiked due to retries)

**Customer Communications:**
- Status page updated at 11:10 AM
- Email sent to affected customers at 2:00 PM with apology and $10 credit

---

## What Went Well

✅ **Fast detection:**
- Synthetic tests caught the issue within 15 minutes
- Alerting system paged on-call immediately

✅ **Clear communication:**
- Status page updated promptly
- Internal Slack channel kept stakeholders informed
- Customer support briefed on issue and workaround

✅ **Effective rollback:**
- Team identified root cause quickly (8 minutes)
- Rollback executed cleanly (no complications)

✅ **No data loss:**
- Failed payments correctly marked as "failed"
- No duplicate charges or orphaned orders

---

## What Went Wrong

❌ **Testing gap:**
- Database migration not tested with production-like schema
- Staging environment schema drift (not identical to production)

❌ **Manual deployment process:**
- No automated enforcement of deployment order
- Easy to deploy schema change without corresponding code

❌ **High alert threshold:**
- 5% error rate threshold delayed detection
- Should have alerted at 1% or even lower for critical path

❌ **No circuit breaker:**
- Application continued attempting payments even when 100% were failing
- Should fail fast and show user-friendly error message

---

## Action Items

**Immediate (within 1 week):**

1. **[P0] Lower alerting threshold for payment errors**
   - Owner: SRE team
   - Change threshold from 5% to 0.5% error rate
   - Add alert for "zero successful payments in 5 minutes"
   - Due: 2025-01-27

2. **[P0] Add database schema validation tests**
   - Owner: QA team (Sarah)
   - Create automated test that compares staging and production schemas
   - Run before every deployment
   - Alert if schemas diverge
   - Due: 2025-01-28

3. **[P0] Document and enforce deployment order**
   - Owner: DevOps team (Mike)
   - Create runbook for database schema changes
   - Require: Schema deployed → validated → code deployed
   - Due: 2025-01-29

**Short-term (within 1 month):**

4. **[P1] Implement automated deployment orchestration**
   - Owner: Platform team
   - Tool: Liquibase or Flyway for database migrations
   - Automated: Detect schema changes, enforce deployment order
   - Due: 2025-02-15

5. **[P1] Add circuit breaker to payment service**
   - Owner: Backend team
   - Fail fast when database errors exceed threshold
   - Show user-friendly error message ("Payment system temporarily unavailable, please try again in a few minutes")
   - Due: 2025-02-20

6. **[P1] Reset staging environment to match production**
   - Owner: DevOps team
   - Schedule: Weekly refresh from production snapshot (anonymized data)
   - Ensure schema parity
   - Due: 2025-02-28

**Long-term (within 3 months):**

7. **[P2] Implement canary deployments for database migrations**
   - Owner: Platform team
   - Deploy migration to 5% of traffic first
   - Monitor for errors before full rollout
   - Due: 2025-04-15

8. **[P2] Add comprehensive database integration tests**
   - Owner: QA team
   - Test all INSERT, UPDATE, DELETE operations
   - Validate schema constraints (NOT NULL, UNIQUE, FOREIGN KEY)
   - Run against production-like schema
   - Due: 2025-04-30

---

## Lessons Learned

**Technical:**
- Schema changes are high-risk and require extra validation
- Staging environments must mirror production exactly
- Circuit breakers prevent cascading failures

**Process:**
- Manual deployment steps are error-prone
- Testing in staging doesn't guarantee production success
- Alert thresholds should be sensitive for critical paths

**Cultural:**
- Blameless postmortems build trust
- Every incident is a learning opportunity
- Systems fail, not people

---

## Metrics

**Detection Time:** 15 minutes (first failure → alert)
**Diagnosis Time:** 8 minutes (alert → root cause identified)
**Mitigation Time:** 15 minutes (root cause → rollback complete)
**Recovery Time:** 7 minutes (rollback → validation complete)
**Total Duration:** 45 minutes (first failure → incident resolved)

**MTTR (Mean Time To Recovery):** 30 minutes (alert → resolution)

---

## Supporting Materials

- [Incident Slack Thread](https://slack.com/archives/...)
- [Grafana Dashboard (Incident Window)](https://grafana.com/...)
- [Error Logs (Loki)](https://loki.com/...)
- [Database Migration Script](https://github.com/.../migration-v2.1.sql)
- [Rollback Script](https://github.com/.../rollback-v2.1.sql)

---

## Approvals

- Engineering Lead: ✅ Approved
- QA Lead: ✅ Approved
- Product Manager: ✅ Approved
- CTO: ✅ Approved

**Next Review:** 2025-02-24 (verify action items completed)
```

---

## Turning Incidents into Test Cases

### Example: Payment Outage → Test Cases

```javascript
// Test case 1: Database schema validation
describe('Database Schema Validation', () => {
  it('should validate payments table has all required columns', async () => {
    const requiredColumns = [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'user_id', type: 'uuid', nullable: false },
      { name: 'amount', type: 'decimal', nullable: false },
      { name: 'currency', type: 'varchar', nullable: false },
      { name: 'status', type: 'varchar', nullable: false },
      { name: 'fraud_score', type: 'integer', nullable: true, default: 0 },
      { name: 'created_at', type: 'timestamp', nullable: false },
    ];

    const actualSchema = await db.getTableSchema('payments');

    for (const column of requiredColumns) {
      const actualColumn = actualSchema.find(c => c.name === column.name);

      expect(actualColumn).toBeDefined();
      expect(actualColumn.type).toBe(column.type);
      expect(actualColumn.nullable).toBe(column.nullable);

      if (column.default !== undefined) {
        expect(actualColumn.default).toBe(column.default);
      }
    }
  });
});

// Test case 2: Payment insertion with missing optional columns
describe('Payment Processing', () => {
  it('should successfully insert payment without fraud_score', async () => {
    const payment = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      amount: 99.99,
      currency: 'USD',
      status: 'pending',
      // fraud_score intentionally omitted (should use default)
    };

    const result = await paymentService.createPayment(payment);

    expect(result.id).toBeDefined();
    expect(result.fraud_score).toBe(0); // Should default to 0
    expect(result.status).toBe('pending');
  });

  it('should fail gracefully when database is unavailable', async () => {
    // Simulate database connection failure
    await db.disconnect();

    const payment = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      amount: 99.99,
      currency: 'USD',
      status: 'pending',
    };

    await expect(paymentService.createPayment(payment)).rejects.toThrow();

    // Reconnect for other tests
    await db.connect();
  });
});

// Test case 3: Circuit breaker for database failures
describe('Payment Circuit Breaker', () => {
  it('should open circuit after 5 consecutive failures', async () => {
    // Simulate database errors
    jest.spyOn(db, 'query').mockRejectedValue(new Error('Database unavailable'));

    // Make 5 payment attempts (should fail)
    for (let i = 0; i < 5; i++) {
      await expect(paymentService.createPayment({...})).rejects.toThrow();
    }

    // Circuit should be open now
    const circuitState = paymentService.getCircuitState();
    expect(circuitState).toBe('OPEN');

    // 6th attempt should fail fast (not hit database)
    const start = Date.now();
    await expect(paymentService.createPayment({...})).rejects.toThrow('Circuit breaker open');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10); // Should fail immediately (<10ms)
  });
});

// Test case 4: Deployment order validation
describe('Deployment Order Validation', () => {
  it('should prevent code deployment without schema migration', async () => {
    // Check application code version
    const appVersion = require('../package.json').version;

    // Check database schema version
    const schemaVersion = await db.query('SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1');

    // Application code should not be ahead of schema
    // Example: App v2.1.0 requires schema v2.1.0 or higher
    const requiredSchemaVersion = getRequiredSchemaVersion(appVersion);

    expect(schemaVersion.rows[0].version).toBeGreaterThanOrEqual(requiredSchemaVersion);
  });
});
```

---

## Chaos Engineering for Incident Prevention

### What is Chaos Engineering?

```
Chaos Engineering: Intentionally injecting failures to test system resilience

Goal: Find weaknesses before they cause real incidents

Principles:
1. Define steady state (SLOs)
2. Hypothesize that steady state continues during experiment
3. Inject realistic failures (server crash, network partition, latency spike)
4. Observe: Does system maintain steady state?
5. Learn and fix weaknesses

Example Experiments:
- Kill random service instance → Does auto-scaling recover?
- Introduce 500ms latency to database → Do timeouts work correctly?
- Disconnect payment API → Does circuit breaker activate?
- Fill disk to 100% → Does alerting fire? Does service degrade gracefully?
```

### Chaos Experiments for QA

```javascript
// Chaos experiment: Database latency injection
describe('Chaos: Database Latency', () => {
  beforeAll(async () => {
    // Inject 500ms latency to all database queries
    await chaosMiddleware.injectLatency('postgres', 500);
  });

  afterAll(async () => {
    // Remove latency injection
    await chaosMiddleware.removeLatency('postgres');
  });

  it('should complete checkout within SLO despite database latency', async () => {
    const start = Date.now();

    const response = await request(app)
      .post('/api/checkout')
      .send(checkoutPayload)
      .expect(201);

    const duration = Date.now() - start;

    // Even with 500ms database latency, total request should be < 2s (SLO)
    expect(duration).toBeLessThan(2000);
    expect(response.body.orderId).toBeDefined();
  });

  it('should not cascade database latency to other services', async () => {
    // Make concurrent requests to different endpoints
    const promises = [
      request(app).get('/api/products'),
      request(app).get('/api/cart'),
      request(app).post('/api/checkout').send(checkoutPayload),
    ];

    const results = await Promise.all(promises);

    // Product and cart endpoints should not be affected by database latency
    // (they use caching or different database)
    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);
  });
});

// Chaos experiment: Service instance failure
describe('Chaos: Instance Failure', () => {
  it('should recover from payment service instance crash', async () => {
    // Kill one of three payment service instances
    await chaosMiddleware.killInstance('payment-service', 0);

    // Give load balancer time to detect failure (5 seconds)
    await sleep(5000);

    // Make 100 payment requests (should be routed to healthy instances)
    const results = await Promise.all(
      Array(100).fill().map(() =>
        request(app).post('/api/payments').send(paymentPayload)
      )
    );

    const successRate = results.filter(r => r.status === 201).length / 100;

    // Success rate should be >99% (some requests may fail during detection window)
    expect(successRate).toBeGreaterThan(0.99);

    // Restart killed instance
    await chaosMiddleware.startInstance('payment-service', 0);
  });
});

// Chaos experiment: Network partition
describe('Chaos: Network Partition', () => {
  it('should handle network partition between services gracefully', async () => {
    // Block network traffic between API gateway and inventory service
    await chaosMiddleware.blockNetwork('api-gateway', 'inventory-service');

    // Attempt checkout (requires inventory check)
    const response = await request(app)
      .post('/api/checkout')
      .send(checkoutPayload);

    // Should fail gracefully with clear error message
    // (not timeout, not 500 error, but 503 Service Unavailable)
    expect(response.status).toBe(503);
    expect(response.body.error).toContain('Inventory service unavailable');
    expect(response.body.retry_after).toBeDefined(); // Client knows to retry

    // Restore network
    await chaosMiddleware.unblockNetwork('api-gateway', 'inventory-service');
  });
});
```

---

## Best Practices

### 1. Blameless Culture is Critical

```
❌ "Who broke production?"
✅ "What systemic issues allowed this to reach production?"

❌ "Sarah deployed without testing"
✅ "Deployment pipeline lacked automated test gates"

Result: Psychological safety → Engineers report issues early → Faster learning
```

### 2. Action Items Must Be Specific and Owned

```
❌ "Improve testing" (vague, no owner)
✅ "Add database schema validation test (Owner: QA team, Due: Jan 28)"

❌ "Better monitoring" (vague)
✅ "Lower payment error alert threshold from 5% to 0.5% (Owner: SRE, Due: Jan 27)"
```

### 3. Follow Up on Action Items

```
Postmortem without follow-up = wasted effort

Track action items:
- Weekly review in team meeting
- Create Jira tickets with due dates
- Mark as blocking for next deployment
- Review in next postmortem (were previous items completed?)
```

### 4. Every Incident Gets a Postmortem (Even Small Ones)

```
SEV-1: Mandatory, full team, detailed document
SEV-2: Mandatory, core team, structured document
SEV-3: Recommended, async document (smaller scope)
SEV-4: Optional, but encouraged (5 Whys in Slack thread)

Why write postmortems for SEV-3/4:
- Practice blameless culture
- Small incidents reveal systemic issues
- Build institutional knowledge
```

---

## What Senior Engineers Know

**Every incident is a gift.** It reveals a weakness you didn't know existed. Fix it, and the system is stronger.

**Blameless culture is hard but worth it.** It requires trust, leadership buy-in, and consistent practice.

**The best incident response is prevention.** Every postmortem should produce test cases that prevent recurrence.

**MTTR > MTBF.** Mean Time To Recovery matters more than Mean Time Between Failures. Failures are inevitable; fast recovery is not.

**Action items without follow-through are worthless.** Track, prioritize, and complete them.

**Chaos engineering finds issues before customers do.** Better to break things intentionally in test than accidentally in production.

---

## Exercise

**Conduct Incident Response Simulation:**

Your team manages a SaaS e-commerce platform. Simulate an incident and practice response.

**Scenario:**
At 2:00 PM on a Friday, alerting fires:
- "Error rate: 25% (threshold: 1%)"
- "p95 latency: 8s (threshold: 500ms)"
- Affected endpoint: POST /api/orders

**Your Tasks:**

1. **Detection and Triage (15 minutes):**
   - Declare incident severity
   - Assemble incident team
   - Validate scope (which features affected?)

2. **Investigation (30 minutes):**
   - Review logs, metrics, traces
   - Identify root cause
   - Propose mitigation options

3. **Resolution (15 minutes):**
   - Execute mitigation (rollback, hotfix, or disable feature)
   - Validate fix in staging first
   - Deploy to production

4. **Recovery (30 minutes):**
   - Run regression tests
   - Monitor SLO compliance
   - Validate full recovery

5. **Postmortem (2 hours):**
   - Write blameless postmortem using template
   - Conduct 5 Whys root cause analysis
   - Define action items with owners and due dates

6. **Prevention (ongoing):**
   - Write test cases to prevent recurrence
   - Implement chaos experiment
   - Update runbooks

**Deliverable:** Complete postmortem document, test cases, chaos experiment, and runbook updates.

---

## Next Steps

- Learn [Reliability Metrics](05-reliability-metrics.md) for measuring system health
- Study [Capacity Planning](06-capacity-planning.md) to prevent overload incidents
- Master [Performance Bottleneck Analysis](07-performance-bottleneck-analysis.md)
- Review [Observability for QA](02-observability-for-qa.md) for debugging
