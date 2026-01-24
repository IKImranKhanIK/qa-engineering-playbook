# Load, Stress, and Soak Testing

## Overview

Performance testing answers critical questions: Can your system handle expected traffic? What happens when traffic spikes? Will it stay stable over days or weeks? Load testing validates normal conditions, stress testing finds breaking points, and soak testing uncovers long-term stability issues like memory leaks.

**Reality check:** Your system works fine in development with 1 user. What about 10,000 concurrent users? What about 100,000?

---

## Types of Performance Tests

```
Performance Test Types:

                    Load
   Normal ──────────┼──────────► Time
   Load      Sustained Load

                    Stress
   Normal ──────────╱╲──────────► Time
   Load        Spike/Peak

                    Soak
   Normal ──────────────────────► Time
   Load      Hours/Days/Weeks

                    Spike
   Normal ───────╱╲╱╲───────────► Time
   Load      Rapid Changes
```

### 1. Load Testing

**Purpose:** Validate system behavior under expected and peak traffic

```
Load Test Scenario: E-commerce Site

Normal Traffic: 1,000 concurrent users
Peak Traffic (Black Friday): 10,000 concurrent users

Test Plan:
1. Ramp-up: 0 → 1,000 users over 5 minutes
2. Sustain: 1,000 users for 30 minutes
3. Peak: Ramp to 10,000 users over 5 minutes
4. Sustain peak: 10,000 users for 15 minutes
5. Ramp-down: 10,000 → 0 users over 5 minutes

Total duration: 60 minutes

Success Criteria:
- Response time (p95): < 500ms under normal load
- Response time (p95): < 2s under peak load
- Error rate: < 0.1%
- Throughput: ≥ 500 requests/second at peak
```

### 2. Stress Testing

**Purpose:** Find the breaking point—where does the system start failing?

```
Stress Test Scenario: API Service

Start: 100 concurrent users
Increment: Add 100 users every 2 minutes
Stop: When error rate > 5% or response time > 10s

Example Results:
Users    Throughput   Avg Latency   Error Rate
────────────────────────────────────────────────
100      450 req/s    120ms         0%
500      2,100 req/s  180ms         0%
1,000    3,800 req/s  350ms         0.1%
2,000    5,200 req/s  980ms         0.5%
3,000    5,500 req/s  2,100ms       1.2% ⚠️
4,000    5,400 req/s  4,800ms       3.8% ⚠️
5,000    4,200 req/s  12,000ms      8.5% ❌ BREAKING POINT

Conclusion:
- Breaking point: ~4,000-5,000 concurrent users
- Bottleneck identified: Database connection pool (max 200 connections)
- Recommendation: Increase connection pool or optimize queries
```

### 3. Soak Testing (Endurance Testing)

**Purpose:** Uncover issues that only appear after extended operation

```
Soak Test Scenario: Microservice

Load: 500 concurrent users (normal traffic)
Duration: 72 hours (3 days)
Test: Continuous requests every 1-2 seconds

Common Issues Discovered:
1. Memory Leaks
   - Memory usage: 512MB → 4GB over 48 hours
   - Cause: Object references not released
   - Result: Out of Memory error after 52 hours

2. Resource Exhaustion
   - File handles: 1,024 → 65,535 (limit) over 24 hours
   - Cause: Database connections not properly closed
   - Result: "Too many open files" error

3. Log File Growth
   - Disk usage: 10GB → 500GB over 48 hours
   - Cause: Excessive debug logging in production
   - Result: Disk full, service crash

4. Connection Pool Exhaustion
   - Connections gradually increase, never released
   - Result: Requests timeout after 36 hours

Success Criteria:
- Memory usage stable (< 10% growth over 72 hours)
- CPU usage stable (< 5% growth)
- Response time stable (p95 < 500ms for entire duration)
- No errors or restarts
```

### 4. Spike Testing

**Purpose:** Test system behavior during sudden traffic spikes

```
Spike Test Scenario: News Website (Breaking News Event)

Normal: 1,000 users
Spike: 50,000 users (50x increase)
Duration: Spike for 5 minutes, return to normal

Timeline:
00:00-10:00  │ 1,000 users (baseline)
10:00-10:30  │ Spike to 50,000 users (rapid increase)
10:30-15:00  │ Maintain 50,000 users
15:00-15:30  │ Return to 1,000 users (rapid decrease)
15:30-20:00  │ 1,000 users (recovery observation)

Observations:
- Can system handle sudden 50x load increase?
- Does auto-scaling respond fast enough?
- How long to recover after spike ends?
- Are there cascading failures (circuit breakers work)?

Example Results:
✅ Auto-scaling triggered within 2 minutes
✅ System handled spike (error rate: 2.5%, acceptable)
✅ Response time degraded gracefully (500ms → 3s)
❌ Recovery slow: 10 minutes to return to baseline
❌ Database connection pool exhausted (caused 5-minute outage)

Corrective Actions:
- Implement connection pool warmup/cooldown
- Tune auto-scaling to pre-scale based on CloudWatch alarms
- Add circuit breakers to prevent cascade failures
```

---

## Performance Testing with k6

### Why k6?

- Modern, JavaScript-based performance testing tool
- Developer-friendly scripting
- Built-in metrics and reporting
- Cloud and local execution
- Excellent for CI/CD integration

### Installing k6

```bash
# macOS
brew install k6

# Windows (via Chocolatey)
choco install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Verify installation
k6 version
```

### Basic Load Test Script

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 },  // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users for 5 minutes
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'http_req_failed': ['rate<0.01'],   // Error rate must be less than 1%
  },
};

export default function () {
  // GET request to homepage
  const homeResponse = http.get('https://example.com/');

  // Check response
  check(homeResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'page contains title': (r) => r.body.includes('<title>'),
  });

  sleep(1); // Think time: user pauses for 1 second

  // POST request to API
  const payload = JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const apiResponse = http.post('https://example.com/api/users', payload, params);

  check(apiResponse, {
    'API status is 201': (r) => r.status === 201,
    'API response has id': (r) => JSON.parse(r.body).id !== undefined,
  });

  sleep(2); // User waits 2 seconds before next action
}
```

**Run the test:**

```bash
k6 run load-test.js
```

**Output:**

```
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: load-test.js
     output: -

  scenarios: (100.00%) 1 scenario, 200 max VUs, 18m30s max duration
           * default: Up to 200 looping VUs for 16m0s over 5 stages

     ✓ status is 200
     ✓ response time < 500ms
     ✓ page contains title
     ✓ API status is 201
     ✓ API response has id

     checks.........................: 100.00% ✓ 50000      ✗ 0
     data_received..................: 2.1 GB  2.2 MB/s
     data_sent......................: 150 MB  157 kB/s
     http_req_blocked...............: avg=1.2ms    min=1µs   med=3µs    max=250ms  p(90)=5µs    p(95)=7µs
     http_req_connecting............: avg=580µs    min=0s    med=0s     max=120ms  p(90)=0s     p(95)=0s
     http_req_duration..............: avg=235ms    min=50ms  med=210ms  max=2.1s   p(90)=380ms  p(95)=450ms
       { expected_response:true }...: avg=235ms    min=50ms  med=210ms  max=2.1s   p(90)=380ms  p(95)=450ms
     http_req_failed................: 0.00%   ✓ 0          ✗ 100000
     http_req_receiving.............: avg=125µs    min=20µs  med=95µs   max=50ms   p(90)=200µs  p(95)=350µs
     http_req_sending...............: avg=45µs     min=5µs   med=25µs   max=10ms   p(90)=80µs   p(95)=150µs
     http_req_tls_handshaking.......: avg=0s       min=0s    med=0s     max=0s     p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=235ms    min=49ms  med=209ms  max=2.1s   p(90)=379ms  p(95)=449ms
     http_reqs......................: 100000  104.17 req/s
     iteration_duration.............: avg=3.47s    min=3.1s  med=3.42s  max=5.8s   p(90)=3.85s  p(95)=4.1s
     iterations.....................: 50000   52.08/s
     vus............................: 200     min=0        max=200
     vus_max........................: 200     min=200      max=200

running (16m00.0s), 000/200 VUs, 50000 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  16m0s
```

### Realistic E-commerce Load Test

```javascript
// ecommerce-load-test.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '5m', target: 500 },   // Normal traffic
    { duration: '2m', target: 2000 },  // Spike (Black Friday simulation)
    { duration: '5m', target: 2000 },  // Sustained peak
    { duration: '2m', target: 500 },   // Back to normal
    { duration: '5m', target: 500 },   // Sustained normal
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000', 'p(99)<5000'], // 95th: 2s, 99th: 5s
    'errors': ['rate<0.05'], // Error rate < 5%
    'checks': ['rate>0.95'], // 95% of checks must pass
  },
};

const BASE_URL = 'https://api.example.com';

// Simulate user browsing and purchasing
export default function () {
  let authToken = '';

  // 1. User visits homepage
  group('Homepage', function () {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'homepage status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    sleep(1);
  });

  // 2. User searches for products
  group('Product Search', function () {
    const res = http.get(`${BASE_URL}/api/products?search=laptop&limit=20`);
    check(res, {
      'search status 200': (r) => r.status === 200,
      'search has results': (r) => JSON.parse(r.body).results.length > 0,
    }) || errorRate.add(1);
    sleep(2); // User reviews search results
  });

  // 3. User views product detail
  group('Product Detail', function () {
    const productId = Math.floor(Math.random() * 1000) + 1;
    const res = http.get(`${BASE_URL}/api/products/${productId}`);
    check(res, {
      'product detail status 200': (r) => r.status === 200,
      'product has price': (r) => JSON.parse(r.body).price !== undefined,
    }) || errorRate.add(1);
    sleep(3); // User reads product description
  });

  // 4. User logs in (30% of users)
  if (Math.random() < 0.3) {
    group('Login', function () {
      const loginPayload = JSON.stringify({
        email: `user${__VU}@example.com`,
        password: 'password123',
      });

      const loginParams = {
        headers: { 'Content-Type': 'application/json' },
      };

      const res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, loginParams);

      const loginSuccess = check(res, {
        'login status 200': (r) => r.status === 200,
        'login has token': (r) => JSON.parse(r.body).token !== undefined,
      });

      if (loginSuccess) {
        authToken = JSON.parse(res.body).token;
      } else {
        errorRate.add(1);
      }

      sleep(1);
    });

    // 5. Logged-in user adds to cart
    if (authToken) {
      group('Add to Cart', function () {
        const cartPayload = JSON.stringify({
          productId: Math.floor(Math.random() * 1000) + 1,
          quantity: Math.floor(Math.random() * 3) + 1,
        });

        const cartParams = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        };

        const res = http.post(`${BASE_URL}/api/cart/items`, cartPayload, cartParams);
        check(res, {
          'add to cart status 201': (r) => r.status === 201,
        }) || errorRate.add(1);

        sleep(2);
      });

      // 6. User proceeds to checkout (10% of logged-in users)
      if (Math.random() < 0.1) {
        group('Checkout', function () {
          // View cart
          const cartRes = http.get(`${BASE_URL}/api/cart`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
          });
          check(cartRes, {
            'cart status 200': (r) => r.status === 200,
          }) || errorRate.add(1);

          sleep(3);

          // Place order
          const orderPayload = JSON.stringify({
            shippingAddress: '123 Main St, City, State 12345',
            paymentMethod: 'credit_card',
          });

          const orderParams = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          };

          const orderRes = http.post(`${BASE_URL}/api/orders`, orderPayload, orderParams);
          check(orderRes, {
            'order status 201': (r) => r.status === 201,
            'order has confirmation': (r) => JSON.parse(r.body).orderId !== undefined,
          }) || errorRate.add(1);

          sleep(1);
        });
      }
    }
  }

  sleep(Math.random() * 3 + 1); // Random think time between 1-4 seconds
}
```

---

## Stress Testing Example

```javascript
// stress-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 500 },    // Warm up
    { duration: '5m', target: 500 },    // Stay at 500
    { duration: '2m', target: 1000 },   // Increase to 1000
    { duration: '5m', target: 1000 },   // Stay at 1000
    { duration: '2m', target: 2000 },   // Increase to 2000
    { duration: '5m', target: 2000 },   // Stay at 2000
    { duration: '2m', target: 5000 },   // STRESS: Jump to 5000
    { duration: '5m', target: 5000 },   // Stay at 5000 (beyond capacity)
    { duration: '5m', target: 0 },      // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<3000'], // Alert if p95 > 3s
    'http_req_failed': ['rate<0.1'],     // Alert if errors > 10%
  },
};

export default function () {
  const res = http.get('https://api.example.com/api/heavy-operation');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

**Analyze stress test results:**

```
Expected Outcome:
- At 500-1000 users: System performs well
- At 2000 users: Latency increases, still functional
- At 5000 users: Breaking point reached
  - Error rate spikes (timeouts, 500 errors)
  - Latency becomes unacceptable (>10s)
  - Some requests fail completely

Identify bottleneck:
1. Check CPU usage → 90%+ (CPU-bound)
2. Check memory → 85%+ (memory pressure)
3. Check database → Connection pool exhausted
4. Check network → Bandwidth saturated

Action: Scale horizontally (more instances) or vertically (bigger instances)
```

---

## Soak Testing Example

```javascript
// soak-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 200 },     // Ramp up
    { duration: '72h', target: 200 },    // Soak for 72 hours
    { duration: '5m', target: 0 },       // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'], // Consistent performance over 72 hours
  },
};

export default function () {
  const res = http.get('https://api.example.com/api/status');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(5); // 5 seconds between requests (realistic user behavior)
}
```

**What to monitor during soak test:**

```
Metrics to Watch (Dashboard):

1. Memory Usage:
   - Should remain flat or grow very slowly
   - Watch for steady upward trend (memory leak indicator)

2. CPU Usage:
   - Should be consistent (within 5% variation)
   - Spikes may indicate garbage collection pressure

3. Response Time:
   - Should remain stable (p95, p99 consistent)
   - Gradual increase indicates resource exhaustion

4. Error Rate:
   - Should remain near zero
   - Sudden spike indicates failure

5. Database Connections:
   - Should be stable (not growing over time)
   - Indicates connection pool working correctly

6. Disk I/O:
   - Watch log file growth
   - Check database disk usage

7. Thread Count:
   - Should be stable (not creating threads indefinitely)

Red Flags:
❌ Memory usage: 1GB → 8GB over 48 hours (leak)
❌ Open file handles: 500 → 65,000 over 24 hours (not closing files)
❌ Response time: 200ms → 2s over 24 hours (degradation)
❌ Crashed after 52 hours (out of memory)
```

---

## Analyzing Performance Test Results

### Key Metrics to Analyze

```
1. Response Time (Latency):
   - Average: Not very useful (skewed by outliers)
   - p50 (median): 50% of requests faster than this
   - p95: 95% of requests faster than this ← Important
   - p99: 99% of requests faster than this ← Critical for SLOs
   - p99.9: 99.9% of requests faster than this ← Tail latency

   Example:
   Avg: 200ms (looks good)
   p50: 150ms (half of users see this)
   p95: 450ms (acceptable)
   p99: 2.5s  ⚠️ (1% of users have bad experience)
   p99.9: 8s  ❌ (worst case unacceptable)

2. Throughput:
   - Requests per second (RPS)
   - Transactions per second (TPS)

   Example:
   Target: 1,000 RPS
   Achieved: 950 RPS ✅
   Above 2,000 users: drops to 600 RPS ❌ (bottleneck)

3. Error Rate:
   - Percentage of failed requests
   - HTTP 4xx (client errors) vs 5xx (server errors)

   Acceptable: <0.1% for normal load
   Warning: >1% indicates issues
   Critical: >5% indicates serious problems

4. Resource Utilization:
   - CPU: Should be <70% under normal load
   - Memory: Should be stable (not growing)
   - Network: Check bandwidth utilization
   - Disk I/O: Watch for disk saturation

5. Concurrent Users vs Active Users:
   - Concurrent: Users online at same time
   - Active: Users making requests at same moment
   - Example: 10,000 concurrent, 500 active (users pause between actions)
```

### Interpreting Results

```
Example Test Results:

Load Test Report: E-commerce API
Date: 2025-01-24
Duration: 60 minutes
Peak VUs: 2,000

Metrics:
─────────────────────────────────────────────────────────
Response Time:
  p50: 180ms  ✅ (target: <200ms)
  p95: 720ms  ⚠️  (target: <500ms, MISSED)
  p99: 2.1s   ❌ (target: <1s, MISSED)

Throughput:
  Average: 850 req/s  ✅ (target: >500 req/s)
  Peak: 1,200 req/s   ✅

Error Rate:
  Overall: 0.08%  ✅ (target: <0.1%)
  At peak: 0.3%   ⚠️  (target: <0.1%, MISSED)

Resource Utilization:
  CPU: 78%       ⚠️  (target: <70%)
  Memory: 6.2GB  ✅ (stable, no leak)
  Database connections: 180/200  ⚠️  (near limit)

Verdict: ⚠️  CONDITIONAL PASS

Issues Identified:
1. p95 and p99 latency exceed targets (720ms, 2.1s)
2. Error rate spikes during peak load (0.3%)
3. Database connection pool near exhaustion (180/200)
4. CPU usage high (78%, may become bottleneck at higher load)

Recommendations:
1. Optimize slow database queries (identified 5 queries >500ms)
2. Increase database connection pool (200 → 300)
3. Implement query caching for frequently accessed data
4. Consider horizontal scaling (add more app servers)
5. Re-test after optimization

Expected Improvement:
- p95: 720ms → 400ms (45% reduction)
- p99: 2.1s → 800ms (62% reduction)
- Error rate at peak: 0.3% → <0.1%
```

---

## Best Practices

### 1. Model Realistic User Behavior

```
❌ Bad: Hammering a single endpoint at maximum speed

export default function () {
  http.get('https://api.example.com/api/products');
  // No sleep, unrealistic
}

✅ Good: Simulating realistic user journeys with think time

export default function () {
  // User browses homepage
  http.get('https://example.com/');
  sleep(2); // User reads content

  // User searches
  http.get('https://example.com/search?q=laptop');
  sleep(3); // User reviews results

  // User views product
  http.get('https://example.com/products/123');
  sleep(5); // User reads details

  // Not every user buys (only 10%)
  if (Math.random() < 0.1) {
    http.post('https://example.com/cart/add', { productId: 123 });
  }
}
```

### 2. Use Meaningful Test Data

```
❌ Bad: Same user for all virtual users

const user = { email: 'test@example.com', password: 'test123' };

✅ Good: Unique data per virtual user

const user = {
  email: `user${__VU}_${__ITER}@example.com`,  // Unique per VU and iteration
  password: 'password123',
};
```

### 3. Ramp Up Gradually

```
❌ Bad: Jump from 0 to 5,000 users instantly

export const options = {
  vus: 5000,
  duration: '10m',
};

✅ Good: Gradual ramp-up to allow system to warm up

export const options = {
  stages: [
    { duration: '5m', target: 500 },   // Warm up
    { duration: '5m', target: 2000 },  // Ramp up
    { duration: '10m', target: 5000 }, // Reach peak gradually
    { duration: '10m', target: 5000 }, // Sustain
  ],
};
```

### 4. Set Realistic Thresholds

```
✅ Define thresholds based on business requirements

export const options = {
  thresholds: {
    // 95% of requests must complete in 2s (based on user research)
    'http_req_duration': ['p(95)<2000'],

    // Error budget: 0.1% (99.9% success rate)
    'http_req_failed': ['rate<0.001'],

    // Minimum throughput: 500 req/s
    'http_reqs{scenario:main}': ['rate>500'],
  },
};
```

### 5. Test in Production-Like Environment

```
Environment Checklist:

✅ Same infrastructure (AWS, GCP, Azure)
✅ Same instance types and sizes
✅ Same database (PostgreSQL, MySQL, MongoDB)
✅ Same caching layer (Redis, Memcached)
✅ Same data volume (production-like dataset)
✅ Same network configuration
✅ Same external integrations (third-party APIs)

⚠️ Avoid testing in:
- Developer laptops
- Shared staging environments with limited resources
- Environments with synthetic/minimal data
```

---

## What Senior Engineers Know

**Performance testing is not a one-time activity.** Every major release should be performance tested.

**Don't test on production (usually).** But your test environment should match production as closely as possible.

**Percentiles matter more than averages.** p95 and p99 represent real user pain, averages hide it.

**Bottlenecks move.** Fix the database, now the app server is the bottleneck. Fix that, now it's the network. Keep iterating.

**Soak tests find the issues that only appear in production.** Memory leaks, connection pool exhaustion, log file growth.

**Load test early and often.** Finding bottlenecks in production is 10x more expensive than in staging.

---

## Exercise

**Design and Execute Performance Test:**

You are testing an e-commerce API for Black Friday.

**Requirements:**
- Normal traffic: 500 concurrent users
- Black Friday peak: 5,000 concurrent users (10x)
- Response time SLO: p95 < 1s
- Availability SLO: 99.9% (error rate < 0.1%)

**User Journey:**
1. Browse homepage (20% of traffic)
2. Search for products (30% of traffic)
3. View product details (40% of traffic)
4. Add to cart (8% of traffic)
5. Checkout (2% of traffic)

**Your Tasks:**

1. **Design Load Test:**
   - Write k6 script simulating realistic user journeys
   - Include proper ramp-up/ramp-down
   - Set appropriate thresholds

2. **Design Stress Test:**
   - Find the breaking point (incrementally increase load)
   - Identify bottleneck (CPU, memory, database, network)

3. **Design Soak Test:**
   - Run at normal load for 24 hours
   - Monitor for memory leaks, resource exhaustion

4. **Analyze Results:**
   - What was the breaking point?
   - Which bottleneck appeared first?
   - Did the system meet SLOs under peak load?

5. **Optimization Plan:**
   - What would you optimize first?
   - Expected improvement?
   - Re-test validation plan?

**Deliverable:** Complete performance test suite with scripts, results analysis, and optimization recommendations.

---

## Next Steps

- Learn [Observability for QA](02-observability-for-qa.md) to monitor systems during performance tests
- Study [SLO/SLA Validation](03-slo-sla-validation.md) to define performance targets
- Master [Performance Bottleneck Analysis](07-performance-bottleneck-analysis.md) for optimization
- Explore [Capacity Planning](06-capacity-planning.md) for future growth
