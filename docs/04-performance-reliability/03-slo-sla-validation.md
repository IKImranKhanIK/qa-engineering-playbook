# SLO / SLA Validation

## Overview

Service Level Objectives (SLOs) transform vague promises like "our service is reliable" into measurable targets like "99.9% of requests complete within 200ms." For QA engineers, SLOs define what to test and when the system is "good enough." Service Level Agreements (SLAs) are contractual commitments with customers, making validation even more critical.

**The SLI/SLO/SLA Hierarchy:**
- **SLI** (Service Level Indicator): What you measure (latency, error rate, availability)
- **SLO** (Service Level Objective): Target value for SLI (internal goal, no legal consequence)
- **SLA** (Service Level Agreement): Contractual promise to customers (legal/financial consequence if missed)

---

## Understanding SLIs, SLOs, and SLAs

### Service Level Indicators (SLIs)

**What is an SLI?**
A quantitative measurement of service behavior from the user's perspective.

```
Good SLIs (User-Centric):
✅ "Percentage of HTTP requests completed within 200ms"
✅ "Percentage of API requests that return successfully (non-5xx)"
✅ "Percentage of page loads that complete within 3 seconds"

Bad SLIs (System-Centric):
❌ "CPU usage is below 70%" (users don't care about CPU)
❌ "All servers are running" (servers up ≠ users happy)
❌ "No errors in logs" (too vague, not measurable)

SLI Formula:
SLI = (Good Events / Total Events) × 100%

Example:
Total requests: 1,000,000
Successful requests (<200ms, non-5xx): 998,500
SLI = (998,500 / 1,000,000) × 100% = 99.85%
```

**Common SLI Types:**

```
1. Availability:
   - Percentage of requests that succeed (non-5xx HTTP status)
   - Formula: (Success Requests / Total Requests) × 100%
   - Example: 99.9% availability = 999,000 successful out of 1M requests

2. Latency:
   - Percentage of requests faster than threshold
   - Formula: (Requests < Threshold / Total Requests) × 100%
   - Example: 95% of requests < 200ms

3. Quality (Correctness):
   - Percentage of requests with correct results
   - Formula: (Correct Responses / Total Requests) × 100%
   - Example: 99.99% of payments processed correctly

4. Throughput:
   - Requests or events processed per second
   - Formula: Total Requests / Time Period
   - Example: 10,000 requests/second capacity

5. Durability:
   - Percentage of data retained without loss
   - Formula: (Data Retained / Data Stored) × 100%
   - Example: 99.999999999% durability (11 nines, AWS S3 standard)
```

### Service Level Objectives (SLOs)

**What is an SLO?**
An internal target for an SLI. It defines "good enough" reliability.

```
SLO Structure:
<SLI> <comparator> <target> over <time window>

Examples:
✅ "95% of HTTP requests complete within 200ms over the last 30 days"
✅ "99.9% of API requests succeed (non-5xx) over the last week"
✅ "99% of page loads complete within 3 seconds over the last 24 hours"

Components:
1. SLI: What you're measuring (latency, error rate, etc.)
2. Target: The threshold (99.9%, 200ms, etc.)
3. Time Window: Rolling period (30 days, 7 days, 24 hours)

Why time windows matter:
- Shorter window (24h): Faster feedback, more sensitive to short outages
- Longer window (30d): Smooths out short blips, reflects long-term reliability
```

**Setting Realistic SLOs:**

```
How to Choose SLO Targets:

1. Start with User Expectations:
   - What latency do users tolerate? (UX research, surveys)
   - What error rate is acceptable? (1 in 1,000 requests failing = 0.1%)

2. Measure Current Performance (Baseline):
   - Current p95 latency: 180ms
   - Current error rate: 0.05%
   - Don't set SLO tighter than current performance without improvements

3. Factor in Cost vs Reliability:
   - 99% availability = 7.2 hours/month downtime
   - 99.9% = 43 minutes/month
   - 99.99% = 4.3 minutes/month
   - 99.999% = 26 seconds/month (very expensive to achieve)

   Rule of thumb: Each additional "9" costs 10x more

4. Set Achievable but Challenging SLOs:
   - Too loose: No pressure to improve, users unhappy
   - Too tight: Always failing, team demoralized, no room for changes

Example Decision Process:

Current State:
- p95 latency: 180ms
- Error rate: 0.05%
- Availability: 99.95%

User Expectations:
- Users accept up to 500ms latency
- Users tolerate occasional errors (<1%)

Proposed SLOs:
- Latency: 95% of requests < 300ms (buffer above current 180ms)
- Error Rate: <0.1% (2x current, allows for growth)
- Availability: 99.9% (slightly tighter than current 99.95%)

Reasoning:
- Latency SLO has headroom (current 180ms < target 300ms)
- Error budget allows for deployments, experiments
- Availability target aligns with industry standard (three nines)
```

### Service Level Agreements (SLAs)

**What is an SLA?**
A contractual commitment to customers with financial or legal consequences if missed.

```
SLA = SLO + Consequences

Example SLA:
"We guarantee 99.9% monthly uptime. If we fail to meet this, you will receive:
  - 10% credit: 99.0% - 99.9% uptime
  - 25% credit: 95.0% - 99.0% uptime
  - 50% credit: < 95.0% uptime"

Key Differences:

SLO (Internal):
- Target: 99.95% availability
- Consequence: Internal alerts, team reviews, postmortems
- Buffer: 0.05% between SLO and SLA

SLA (External):
- Target: 99.9% availability
- Consequence: Financial credits, legal liability
- Customer-facing commitment

Why SLA < SLO:
Having SLO stricter than SLA creates buffer to catch issues before they affect customers
Example:
  SLA: 99.9% (customer promise)
  SLO: 99.95% (internal target)
  Buffer: 0.05% (margin to react before SLA breach)
```

---

## Error Budgets

### What is an Error Budget?

```
Error Budget = 100% - SLO

If SLO is 99.9% availability:
Error Budget = 100% - 99.9% = 0.1%

Over 30 days:
Total time: 30 days × 24 hours × 60 minutes = 43,200 minutes
Allowed downtime: 43,200 × 0.001 = 43.2 minutes

Error Budget = Time allowed for failures

Benefits:
1. Balances innovation vs reliability
2. Quantifies risk (how much risk budget left?)
3. Drives prioritization (features vs bug fixes)
```

**Error Budget Policy:**

```
Policy Framework:

When Error Budget > 50%:
→ Focus on velocity (ship features, experiments, refactoring)
→ Acceptable to take risks (new deployments, traffic experiments)
→ QA can relax testing rigor slightly

When Error Budget 20-50%:
→ Balanced approach (continue shipping, monitor closely)
→ Increase monitoring and alerting
→ QA maintains standard testing rigor

When Error Budget < 20%:
→ Freeze feature work, focus on reliability
→ Stop risky changes (no major refactors, migrations)
→ QA increases testing rigor (more soak tests, chaos testing)
→ Prioritize bug fixes and toil reduction

When Error Budget Exhausted (< 0%):
→ Full freeze (only critical bug fixes)
→ Incident response mode
→ All hands on stability
→ Postmortem and action items before resuming features

Example:

Month 1:
- SLO: 99.9% (error budget: 43.2 min)
- Actual: 99.95% (21.6 min downtime)
- Remaining budget: 21.6 min (50%)
→ Status: Green, continue normal operations

Month 2:
- Remaining budget from start: 43.2 min
- Incident 1: 15 min outage
- Incident 2: 20 min degradation
- Total consumed: 35 min
- Remaining: 8.2 min (19% of budget)
→ Status: Yellow, freeze feature releases, focus on stability

Month 3:
- Remaining budget: 43.2 min (fresh month)
- Slow burn: 0.1% error rate over 30 days = 43 min
- Remaining: 0.2 min (0.5% of budget)
→ Status: Red, full freeze, incident response
```

**Tracking Error Budget:**

```prometheus
# Prometheus query: Error budget consumption

# SLO: 99.9% availability
# Error budget: 0.1% = 43.2 minutes per 30 days

# Calculate current error rate
sum(rate(http_requests_total{status_code=~"5.."}[30d]))
/
sum(rate(http_requests_total[30d]))

# Error budget remaining (percentage)
(1 - (
  sum(rate(http_requests_total{status_code=~"5.."}[30d]))
  /
  sum(rate(http_requests_total[30d]))
)) - 0.999  # SLO target

# Error budget remaining (minutes out of 43.2)
(
  (1 - (
    sum(rate(http_requests_total{status_code=~"5.."}[30d]))
    /
    sum(rate(http_requests_total[30d]))
  )) - 0.999
) * 43200  # 30 days in minutes
```

---

## Defining SLOs for Testing

### 1. API Service SLOs

```
Service: E-commerce API

SLO 1: Availability
- SLI: Percentage of requests returning non-5xx status codes
- Target: 99.9%
- Time Window: 30 days rolling
- Measurement:
  Good events: HTTP 200, 201, 400, 404 (2xx, 4xx)
  Bad events: HTTP 500, 502, 503, 504 (5xx)

PromQL:
  sum(rate(http_requests_total{status_code!~"5.."}[30d]))
  /
  sum(rate(http_requests_total[30d]))

SLO 2: Latency
- SLI: Percentage of requests completing within 500ms
- Target: 95%
- Time Window: 7 days rolling
- Measurement:
  Good events: Requests with duration < 500ms
  Bad events: Requests with duration >= 500ms

PromQL:
  sum(rate(http_request_duration_seconds_bucket{le="0.5"}[7d]))
  /
  sum(rate(http_request_duration_seconds_count[7d]))

SLO 3: Success Rate (Correctness)
- SLI: Percentage of orders processed successfully
- Target: 99.99%
- Time Window: 30 days rolling
- Measurement:
  Good events: Orders with status = 'completed'
  Bad events: Orders with status = 'failed' or 'error'

PromQL:
  sum(rate(orders_total{status="completed"}[30d]))
  /
  sum(rate(orders_total[30d]))
```

### 2. Web Application SLOs

```
Service: E-commerce Website

SLO 1: Page Load Time
- SLI: Percentage of page loads completing within 3 seconds
- Target: 90%
- Time Window: 24 hours rolling
- Measurement:
  Good events: Page loads with LCP (Largest Contentful Paint) < 3s
  Bad events: Page loads with LCP >= 3s

Measurement Method:
  - Real User Monitoring (RUM)
  - Collect client-side metrics (Navigation Timing API)
  - Send to backend for aggregation

JavaScript:
  const lcp = performance.getEntriesByType('largest-contentful-paint')[0].renderTime;
  if (lcp) {
    fetch('/api/metrics/rum', {
      method: 'POST',
      body: JSON.stringify({
        metric: 'lcp',
        value: lcp,
        page: window.location.pathname,
      }),
    });
  }

SLO 2: Availability (User-Perceived)
- SLI: Percentage of user sessions without errors
- Target: 99%
- Time Window: 7 days rolling
- Measurement:
  Good events: Sessions with zero JavaScript errors
  Bad events: Sessions with >=1 JavaScript error

SLO 3: Search Functionality
- SLI: Percentage of searches returning results within 1 second
- Target: 95%
- Time Window: 24 hours rolling
```

---

## Testing SLOs

### 1. Load Testing for SLO Validation

```javascript
// k6 script: Validate latency SLO (95% of requests < 500ms)

import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Custom metrics
const sloViolations = new Counter('slo_violations');
const requestLatency = new Trend('request_latency');

export const options = {
  stages: [
    { duration: '5m', target: 1000 },  // Ramp to normal load
    { duration: '30m', target: 1000 }, // Sustain for SLO measurement
  ],
  thresholds: {
    // SLO: 95% of requests < 500ms
    'request_latency': ['p(95)<500'],
    // SLO: 99.9% availability
    'http_req_failed': ['rate<0.001'],
  },
};

export default function () {
  const response = http.get('https://api.example.com/api/products');

  // Record latency
  requestLatency.add(response.timings.duration);

  // Check if request violates SLO
  const withinSLO = response.timings.duration < 500 && response.status < 500;

  if (!withinSLO) {
    sloViolations.add(1);
  }

  check(response, {
    'status is 2xx or 4xx': (r) => r.status < 500,
    'latency < 500ms': (r) => r.timings.duration < 500,
  });
}

// Teardown: Calculate SLO compliance
export function handleSummary(data) {
  const totalRequests = data.metrics.http_reqs.values.count;
  const failedRequests = data.metrics.http_req_failed.values.rate * totalRequests;
  const successfulRequests = totalRequests - failedRequests;

  const availability = (successfulRequests / totalRequests) * 100;

  const p95Latency = data.metrics.request_latency.values['p(95)'];
  const latencySLO = p95Latency < 500;

  console.log(`
    SLO Validation Results:
    =======================
    Total Requests: ${totalRequests}
    Availability: ${availability.toFixed(2)}% (Target: 99.9%)
    p95 Latency: ${p95Latency.toFixed(0)}ms (Target: <500ms)

    Availability SLO: ${availability >= 99.9 ? 'PASS ✅' : 'FAIL ❌'}
    Latency SLO: ${latencySLO ? 'PASS ✅' : 'FAIL ❌'}
  `);

  return {
    'stdout': JSON.stringify(data, null, 2),
  };
}
```

### 2. Continuous SLO Monitoring (Synthetic Tests)

```javascript
// Run synthetic test every 5 minutes to validate SLO

const cron = require('node-cron');
const fetch = require('node-fetch');
const promClient = require('prom-client');

// Prometheus metrics
const sloComplianceGauge = new promClient.Gauge({
  name: 'slo_compliance',
  help: 'Whether SLO is being met (1 = yes, 0 = no)',
  labelNames: ['slo_type'],
});

const syntheticTestDuration = new promClient.Histogram({
  name: 'synthetic_test_duration_seconds',
  help: 'Duration of synthetic test',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running synthetic SLO validation...');

  const endpoints = [
    'https://api.example.com/api/products',
    'https://api.example.com/api/cart',
    'https://api.example.com/api/orders',
  ];

  for (const endpoint of endpoints) {
    const start = Date.now();

    try {
      const response = await fetch(endpoint, { timeout: 5000 });
      const duration = (Date.now() - start) / 1000;

      syntheticTestDuration.labels(endpoint).observe(duration);

      // Check SLO compliance
      const latencySLO = duration < 0.5; // 500ms
      const availabilitySLO = response.status < 500;

      if (latencySLO && availabilitySLO) {
        sloComplianceGauge.labels('availability').set(1);
        sloComplianceGauge.labels('latency').set(1);
      } else {
        if (!availabilitySLO) {
          sloComplianceGauge.labels('availability').set(0);
          console.error(`❌ Availability SLO violated: ${endpoint} returned ${response.status}`);
        }
        if (!latencySLO) {
          sloComplianceGauge.labels('latency').set(0);
          console.error(`❌ Latency SLO violated: ${endpoint} took ${duration}s`);
        }
      }
    } catch (error) {
      console.error(`❌ Synthetic test failed for ${endpoint}:`, error.message);
      sloComplianceGauge.labels('availability').set(0);
    }
  }
});

// Expose metrics for Prometheus scraping
const express = require('express');
const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(9091, () => {
  console.log('Synthetic test metrics exposed on :9091/metrics');
});
```

### 3. SLO Dashboards (Grafana)

```yaml
# Grafana dashboard panel configuration

panels:
  - title: "Availability SLO (99.9%)"
    targets:
      # Current availability (30-day rolling)
      - expr: |
          100 - (
            sum(rate(http_requests_total{status_code=~"5.."}[30d]))
            /
            sum(rate(http_requests_total[30d]))
          ) * 100
    type: stat
    fieldConfig:
      thresholds:
        - value: 99.9
          color: green
        - value: 99.0
          color: yellow
        - value: 0
          color: red

  - title: "Error Budget Remaining (Minutes)"
    targets:
      # Minutes remaining out of 43.2 (0.1% of 30 days)
      - expr: |
          (
            (1 - (
              sum(rate(http_requests_total{status_code=~"5.."}[30d]))
              /
              sum(rate(http_requests_total[30d]))
            )) - 0.999
          ) * 43200
    type: gauge
    fieldConfig:
      max: 43.2
      thresholds:
        - value: 21.6  # 50% budget
          color: green
        - value: 8.64  # 20% budget
          color: yellow
        - value: 0
          color: red

  - title: "Latency SLO (p95 < 500ms)"
    targets:
      # p95 latency (7-day rolling)
      - expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(http_request_duration_seconds_bucket[7d]))
          ) * 1000
    type: graph
    fieldConfig:
      thresholds:
        - value: 500
          color: red
      marks:
        - value: 500
          label: "SLO Threshold"

  - title: "SLO Compliance Over Time"
    targets:
      # Percentage of time SLO was met (1 = 100%, 0 = 0%)
      - expr: |
          avg_over_time(
            (
              histogram_quantile(0.95,
                rate(http_request_duration_seconds_bucket[5m])
              ) < 0.5
            )[30d:5m]
          ) * 100
    type: graph
    yAxisLabel: "% of Time in SLO"
```

---

## SLO Alerting

### Alert on SLO Burn Rate

```yaml
# Prometheus alerting rules

groups:
  - name: slo_alerts
    interval: 1m
    rules:
      # Fast burn: Error budget consumed in 1 hour → Alert immediately
      - alert: SLOFastBurn
        expr: |
          (
            sum(rate(http_requests_total{status_code=~"5.."}[1h]))
            /
            sum(rate(http_requests_total[1h]))
          ) > 0.014  # 14x error budget burn rate
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "SLO burning too fast (1 hour window)"
          description: "Error budget will be exhausted in 1 hour at current rate"

      # Slow burn: Error budget consumed in 6 hours → Alert after 30 min
      - alert: SLOSlowBurn
        expr: |
          (
            sum(rate(http_requests_total{status_code=~"5.."}[6h]))
            /
            sum(rate(http_requests_total[6h]))
          ) > 0.002  # 2x error budget burn rate
        for: 30m
        labels:
          severity: warning
        annotations:
          summary: "SLO burning slowly (6 hour window)"
          description: "Error budget will be exhausted in 6 hours at current rate"

      # Latency SLO violation
      - alert: LatencySLOViolation
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
          ) > 0.5  # 500ms
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Latency SLO violated (p95 > 500ms)"
          description: "p95 latency: {{ $value | humanize }}ms (threshold: 500ms)"

Burn Rate Calculation:
Error budget: 0.1% (99.9% SLO)
Monthly budget: 43.2 minutes

Fast burn (1 hour):
  If consumed in 1 hour → 43.2 / 1 = 43.2x burn rate
  Alert threshold: 14x burn rate (conservative)
  Error rate: 0.1% × 14 = 1.4% error rate

Slow burn (6 hours):
  If consumed in 6 hours → 43.2 / 6 = 7.2x burn rate
  Alert threshold: 2x burn rate
  Error rate: 0.1% × 2 = 0.2% error rate
```

---

## Best Practices

### 1. User-Centric SLIs

```
❌ Bad: "Server CPU < 70%"
   - Users don't care about CPU
   - Could have high CPU but users happy (batch jobs)
   - Could have low CPU but users unhappy (network issues)

✅ Good: "95% of page loads complete within 3 seconds"
   - Directly impacts user experience
   - Measurable from user's perspective
   - Correlates with business metrics (conversion rate)
```

### 2. Achievable SLOs

```
❌ Bad: "100% availability"
   - Impossible to achieve (even 5-nines is hard)
   - No room for deployments, experiments, failures
   - Sets unrealistic expectations

✅ Good: "99.9% availability"
   - Achievable with good engineering
   - Allows for planned maintenance, deployments
   - Aligns with error budget philosophy
```

### 3. Multiple SLOs for Different Aspects

```
Service needs multiple SLOs to cover different dimensions:

✅ Availability: "99.9% of requests succeed"
✅ Latency: "95% of requests < 500ms"
✅ Correctness: "99.99% of payments processed correctly"
✅ Freshness: "90% of data updated within 5 minutes"

Don't rely on a single SLO—services have multiple quality dimensions
```

### 4. Different SLOs for Different Endpoints

```
Critical endpoints (checkout, payment):
  - Availability: 99.99%
  - Latency: p95 < 200ms

Standard endpoints (product catalog):
  - Availability: 99.9%
  - Latency: p95 < 500ms

Non-critical endpoints (analytics, reporting):
  - Availability: 99%
  - Latency: p95 < 2s

Not all features are equally important—prioritize reliability for critical paths
```

---

## What Senior Engineers Know

**SLOs drive prioritization.** Without SLOs, you can't decide if a 5ms latency improvement is worth 2 weeks of engineering time.

**Error budgets are powerful.** They turn reliability into a quantifiable resource that balances feature velocity with stability.

**SLAs should be looser than SLOs.** Always have buffer to catch issues before they breach customer commitments.

**Perfect reliability is not the goal.** 100% uptime costs infinite money and prevents all changes. Optimize for "good enough."

**SLOs evolve.** Start with achievable targets, tighten as systems improve. Review quarterly.

**Measure from the user's perspective.** Server metrics (CPU, memory) don't predict user happiness. Latency and errors do.

---

## Exercise

**Define and Validate SLOs:**

You are the QA lead for a SaaS e-commerce platform with 1 million monthly users.

**System Components:**
1. API Gateway
2. Product Catalog Service
3. Cart Service
4. Payment Service
5. Order Service

**Your Tasks:**

1. **Define SLOs:**
   - Choose appropriate SLIs (availability, latency, correctness)
   - Set realistic targets based on industry standards
   - Define time windows (24h, 7d, 30d)
   - Calculate error budgets

2. **Instrument Metrics:**
   - Add Prometheus metrics for SLI measurement
   - Create PromQL queries for SLO compliance
   - Build Grafana dashboards

3. **Write Tests:**
   - Load test to validate latency SLO
   - Synthetic tests for continuous monitoring
   - Chaos test to validate error budget policy

4. **Set Up Alerting:**
   - Define burn rate alerts (fast and slow)
   - Configure alert thresholds
   - Test alert delivery (Slack, PagerDuty)

5. **Error Budget Policy:**
   - Write policy for different budget levels (>50%, 20-50%, <20%, exhausted)
   - Define freeze criteria
   - Create communication plan

**Deliverable:** Complete SLO documentation, metrics implementation, test suite, and error budget policy.

---

## Next Steps

- Learn [Incident Learning](04-incident-learning.md) for post-mortems
- Study [Reliability Metrics](05-reliability-metrics.md) for deeper SRE practices
- Master [Capacity Planning](06-capacity-planning.md) for scaling
- Explore [Load Testing](01-load-stress-soak-testing.md) for validation
