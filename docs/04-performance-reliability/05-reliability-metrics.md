# Reliability Metrics

## Overview

You can't improve what you don't measure. Reliability metrics quantify system health and guide engineering decisions. For QA engineers, understanding and validating these metrics is critical for ensuring production quality. This lesson covers the Four Golden Signals (Google SRE), availability metrics (the "nines"), MTBF/MTTR, and how to test these metrics.

---

## The Four Golden Signals (Google SRE)

### 1. Latency
**Time it takes to service a request**

```prometheus
# p50 (median) latency
histogram_quantile(0.50,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# p95 latency (95% of requests faster than this)
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# p99 latency (99% of requests faster than this)
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# p99.9 latency (tail latency)
histogram_quantile(0.999,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

**Why percentiles matter more than averages:**
- Average: 100ms (looks good!)
- p50: 80ms (half of users see this)
- p95: 250ms (still acceptable)
- p99: 3s (1% of users have bad experience)
- p99.9: 15s (worst case unacceptable)

**Testing latency SLOs:**
```javascript
// k6 latency validation test
import { check } from 'k6';

export default function() {
  const res = http.get('https://api.example.com/');
  
  check(res, {
    'latency p95 < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### 2. Traffic
**Demand on your system (requests per second)**

```prometheus
# Request rate (requests per second)
sum(rate(http_requests_total[5m]))

# Request rate by endpoint
sum by (endpoint) (rate(http_requests_total[5m]))

# Request rate by status code
sum by (status_code) (rate(http_requests_total[5m]))
```

**Capacity testing for traffic:**
```
Normal traffic: 1,000 req/s
Peak traffic: 10,000 req/s
Capacity limit: 15,000 req/s (before degradation)

Test: Gradually increase load to find breaking point
```

### 3. Errors
**Rate of requests that fail**

```prometheus
# Error rate (percentage)
sum(rate(http_requests_total{status_code=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m])) * 100

# Error count per minute
sum(rate(http_requests_total{status_code=~"5.."}[1m])) * 60
```

**Testing error budgets:**
```
SLO: 99.9% availability (error budget: 0.1%)
Monthly requests: 100 million
Allowed errors: 100,000

Load test results:
- Total requests: 1 million
- Errors: 500 (0.05% error rate)
- Verdict: Within error budget ✅
```

### 4. Saturation
**How "full" your service is**

```prometheus
# CPU saturation
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory saturation
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk saturation
(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100

# Connection pool saturation
db_connection_pool_active / db_connection_pool_max * 100
```

**Saturation triggers performance degradation:**
- CPU >80% → Requests queue, latency increases
- Memory >90% → Garbage collection pressure, slowdowns
- Disk >95% → Write failures, crashes
- Connection pool 100% → New requests timeout

---

## Availability Metrics

### The "Nines" of Availability

```
Availability  |  Downtime/Year  |  Downtime/Month  |  Downtime/Week
─────────────────────────────────────────────────────────────────────
90% (1 nine)  |  36.5 days      |  3 days          |  16.8 hours
99% (2 nines) |  3.65 days      |  7.2 hours       |  1.68 hours
99.9% (3 nines)|  8.76 hours    |  43.8 minutes    |  10.1 minutes
99.95%        |  4.38 hours     |  21.9 minutes    |  5.04 minutes
99.99% (4 nines)| 52.6 minutes  |  4.38 minutes    |  1.01 minutes
99.999% (5 nines)| 5.26 minutes |  26.3 seconds    |  6.05 seconds
```

**Cost vs Availability:**
Each additional "9" costs ~10x more to achieve.

**Calculating availability:**
```
Availability = (Total Time - Downtime) / Total Time × 100%

Example (30 days):
Total time: 30 days = 43,200 minutes
Downtime: 45 minutes (one incident)
Availability = (43,200 - 45) / 43,200 × 100% = 99.896%
```

### Testing Availability

```javascript
// Uptime monitoring test (run every minute)
const { chromium } = require('playwright');

async function checkUptime() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const response = await page.goto('https://example.com/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    if (response.status() >= 500) {
      recordDowntime();
      alert('Service down (HTTP 5xx)');
    } else {
      recordUptime();
    }
  } catch (error) {
    recordDowntime();
    alert(`Service unreachable: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Run every 1 minute
setInterval(checkUptime, 60000);
```

---

## MTBF and MTTR

### Mean Time Between Failures (MTBF)

```
MTBF = Total Operating Time / Number of Failures

Example:
System ran for 720 hours (30 days)
Experienced 3 failures

MTBF = 720 hours / 3 failures = 240 hours

Interpretation: On average, 240 hours between failures
```

### Mean Time To Recovery (MTTR)

```
MTTR = Total Downtime / Number of Failures

Example:
Incident 1: 30 minutes downtime
Incident 2: 15 minutes downtime
Incident 3: 45 minutes downtime
Total: 90 minutes, 3 incidents

MTTR = 90 minutes / 3 = 30 minutes

Interpretation: Average time to recover from failure
```

**MTTR Components:**
- **MTTD** (Mean Time To Detect): How long until we know there's an issue
- **MTTI** (Mean Time To Investigate): How long to find root cause
- **MTTF** (Mean Time To Fix): How long to deploy fix
- **MTTV** (Mean Time To Verify): How long to confirm resolution

```
Example Incident Timeline:

10:00 AM - Incident occurs (users affected)
10:15 AM - Alert fires (MTTD = 15 minutes) ⚠️ Delayed detection
10:30 AM - Root cause found (MTTI = 15 minutes) ✅ Good
10:45 AM - Fix deployed (MTTF = 15 minutes) ✅ Good
11:00 AM - Recovery verified (MTTV = 15 minutes)

MTTR = 60 minutes total

Improvement opportunities:
- MTTD too high (15 min) → Better alerting
- Other phases acceptable
```

---

## Testing Reliability Metrics

### Load Test with Reliability Validation

```javascript
// k6 script: Measure all four golden signals

import http from 'k6/http';
import { Counter, Trend, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Counter('errors');
const requestLatency = new Trend('request_latency');
const activeVUs = new Gauge('active_vus');

export const options = {
  stages: [
    { duration: '10m', target: 1000 },  // Ramp to normal load
    { duration: '20m', target: 1000 },  // Sustain
  ],
  thresholds: {
    // Latency: p95 < 500ms
    'request_latency': ['p(95)<500'],
    
    // Errors: < 0.1%
    'errors': ['rate<0.001'],
    
    // Throughput: > 500 req/s
    'http_reqs': ['rate>500'],
  },
};

export default function() {
  activeVUs.add(__VU);  // Track active virtual users
  
  const res = http.get('https://api.example.com/');
  
  requestLatency.add(res.timings.duration);
  
  if (res.status >= 500) {
    errorRate.add(1);
  }
}
```

### Chaos Testing for MTTR

```javascript
// Test: How quickly do we recover from failure?

describe('MTTR Validation', () => {
  it('should recover from instance failure within 5 minutes', async () => {
    const startTime = Date.now();
    
    // 1. Inject failure: Kill primary database instance
    await chaosMiddleware.killInstance('postgres-primary');
    console.log('MTTD starts now (time to detect failure)...');
    
    // 2. Wait for alert to fire
    const alertFired = await waitForAlert('database_down', { timeout: 120000 });
    const mttd = Date.now() - startTime;
    console.log(`MTTD (Mean Time To Detect): ${mttd}ms`);
    expect(mttd).toBeLessThan(60000); // Should detect within 1 minute
    
    // 3. Wait for automated failover to replica
    const failoverStartTime = Date.now();
    await waitForDatabaseHealthy({ timeout: 300000 });
    const mttr = Date.now() - startTime;
    
    console.log(`MTTR (Mean Time To Recovery): ${mttr}ms`);
    expect(mttr).toBeLessThan(300000); // Should recover within 5 minutes
    
    // 4. Verify service restored
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.database).toBe('healthy');
    
    // Cleanup: Restart primary instance
    await chaosMiddleware.startInstance('postgres-primary');
  });
});
```

---

## Best Practices

**1. Monitor what users care about:** Latency and errors, not CPU.

**2. Use percentiles, not averages:** p95, p99 reveal real user pain.

**3. Set realistic SLOs:** 99.9% is achievable, 99.99% is expensive, 100% is impossible.

**4. Reduce MTTR, not just MTBF:** Fast recovery matters more than never failing.

**5. Track trends over time:** Single data point is noise, trend is signal.

---

## Exercise

**Build Reliability Dashboard:**

1. Instrument application with Prometheus metrics
2. Create Grafana dashboard with:
   - Four Golden Signals (latency, traffic, errors, saturation)
   - Availability percentage (30-day rolling)
   - MTTR tracking
3. Run load test and validate metrics
4. Inject failure and measure MTTR

**Deliverable:** Working dashboard with real metrics.

---

## Next Steps

- Study [Capacity Planning](06-capacity-planning.md)
- Master [Performance Bottleneck Analysis](07-performance-bottleneck-analysis.md)
- Review [Observability for QA](02-observability-for-qa.md)
