# Performance Testing Lab

## Overview

**Duration:** 4 hours
**Difficulty:** Intermediate
**Category:** Performance Testing

Learn to conduct load testing using k6, analyze performance bottlenecks, and generate comprehensive performance reports.

## Learning Objectives

- Install and configure k6 load testing tool
- Write load test scripts
- Simulate different load patterns (ramp-up, spike, soak)
- Analyze performance metrics
- Identify bottlenecks
- Generate performance reports

## Prerequisites

- **k6** installed ([Installation guide](https://k6.io/docs/getting-started/installation/))
- Basic JavaScript knowledge
- Understanding of HTTP
- Terminal/command line access

## Lab Setup

### Install k6

**macOS:**
```bash
brew install k6
```

**Windows:**
```bash
choco install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Verify installation:**
```bash
k6 version
```

### Test Target

We'll use: **https://test.k6.io** (k6's official test site)

## Part 1: Basic Load Test (45 minutes)

### Task 1.1: Simple GET Request Test

Create `test1-basic.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  // Make HTTP GET request
  const response = http.get('https://test.k6.io');

  // Validate response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'page contains welcome': (r) => r.body.includes('Welcome'),
  });

  // Think time (simulate user reading page)
  sleep(1);
}
```

**Run the test:**
```bash
k6 run test1-basic.js
```

**Analyze Output:**
- http_req_duration: Average response time
- http_req_failed: Request failure rate
- iterations: Number of test iterations
- data_received: Total data downloaded

### Task 1.2: Add Virtual Users (VUs)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,           // 10 virtual users
  duration: '30s',   // Run for 30 seconds
};

export default function () {
  const response = http.get('https://test.k6.io');

  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

**Run:**
```bash
k6 run test1-basic.js
```

**Questions to Answer:**
- What's the average response time?
- How many requests per second (RPS)?
- What's the failure rate?
- How does this compare to 1 VU?

## Part 2: Load Patterns (60 minutes)

### Task 2.1: Ramp-Up Test

Create `test2-rampup.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 VUs in 30s
    { duration: '1m', target: 20 },   // Stay at 20 VUs for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],    // < 1% failure rate
  },
};

export default function () {
  const response = http.get('https://test.k6.io');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 1000,
  });

  sleep(Math.random() * 3);  // Random think time 0-3s
}
```

**Run and observe:**
```bash
k6 run test2-rampup.js
```

### Task 2.2: Spike Test

Create `test3-spike.js`:

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Normal load
    { duration: '10s', target: 100 },  // Sudden spike
    { duration: '30s', target: 100 },  // Sustained spike
    { duration: '10s', target: 10 },   // Back to normal
  ],
};

export default function () {
  const response = http.get('https://test.k6.io');

  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}
```

**Analyze:**
- Does the system handle the spike?
- Do response times degrade?
- Are there any errors during spike?

### Task 2.3: Soak Test (Endurance)

Create `test4-soak.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp to 50 VUs
    { duration: '10m', target: 50 },   // Stay at 50 for 10 minutes
    { duration: '2m', target: 0 },     // Ramp down
  ],
};

export default function () {
  const response = http.get('https://test.k6.io');

  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(2);
}
```

**What to Look For:**
- Memory leaks (increasing response times over time)
- Resource exhaustion
- Degrading performance

## Part 3: Complex User Scenarios (60 minutes)

### Task 3.1: Multi-Step User Journey

Create `test5-journey.js`:

```javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '1m',
};

export default function () {
  // Group 1: Homepage
  group('Homepage', function () {
    const homepage = http.get('https://test.k6.io');
    check(homepage, {
      'homepage loaded': (r) => r.status === 200,
    });
    sleep(1);
  });

  // Group 2: Login
  group('Login', function () {
    const loginPayload = JSON.stringify({
      username: 'test@test.com',
      password: 'password123',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const loginRes = http.post('https://test.k6.io/login', loginPayload, params);
    check(loginRes, {
      'login successful': (r) => r.status === 200,
    });
    sleep(2);
  });

  // Group 3: Browse Products
  group('Browse Products', function () {
    const products = http.get('https://test.k6.io/products');
    check(products, {
      'products loaded': (r) => r.status === 200,
      'has products': (r) => r.json().length > 0,
    });
    sleep(3);
  });
}
```

**Run:**
```bash
k6 run test5-journey.js
```

### Task 3.2: Data Parameterization

Create `test6-data.js`:

```javascript
import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

// Load test data
const testData = new SharedArray('users', function () {
  return [
    { username: 'user1@test.com', password: 'pass1' },
    { username: 'user2@test.com', password: 'pass2' },
    { username: 'user3@test.com', password: 'pass3' },
  ];
});

export const options = {
  vus: 3,
  iterations: 9,
};

export default function () {
  // Get user data for this VU
  const user = testData[__VU % testData.length];

  const payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  const response = http.post('https://test.k6.io/login', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'login success': (r) => r.status === 200,
  });
}
```

## Part 4: Advanced Metrics & Thresholds (45 minutes)

### Task 4.1: Custom Metrics

Create `test7-metrics.js`:

```javascript
import http from 'k6/http';
import { Trend, Rate, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const loginDuration = new Trend('login_duration');
const loginSuccessRate = new Rate('login_success_rate');
const loginAttempts = new Counter('login_attempts');
const currentUsers = new Gauge('current_users');

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'login_duration': ['p(95)<1000'],
    'login_success_rate': ['rate>0.95'],
  },
};

export default function () {
  loginAttempts.add(1);
  currentUsers.add(__VU);

  const startTime = Date.now();
  const response = http.post('https://test.k6.io/login', {
    username: 'test',
    password: 'test',
  });
  const duration = Date.now() - startTime;

  loginDuration.add(duration);
  loginSuccessRate.add(response.status === 200);

  currentUsers.add(-__VU);
}
```

### Task 4.2: Performance Budgets

```javascript
export const options = {
  thresholds: {
    // HTTP errors should be less than 1%
    'http_req_failed': ['rate<0.01'],

    // 90% of requests should be below 400ms
    'http_req_duration': ['p(90)<400'],

    // 95% of requests should be below 800ms
    'http_req_duration': ['p(95)<800'],

    // 99% of requests should be below 2000ms
    'http_req_duration': ['p(99)<2000'],

    // Throughput should be at least 100 RPS
    'http_reqs': ['rate>100'],
  },
};
```

## Part 5: Results Analysis (30 minutes)

### Task 5.1: Generate JSON Report

```bash
k6 run --out json=results.json test2-rampup.js
```

### Task 5.2: Analyze with jq

```bash
# Average response time
jq '.metrics.http_req_duration.values.avg' results.json

# 95th percentile
jq '.metrics.http_req_duration.values["p(95)"]' results.json

# Total requests
jq '.metrics.http_reqs.values.count' results.json
```

### Task 5.3: HTML Dashboard

Create `test8-dashboard.js`:

```javascript
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 20,
  duration: '1m',
};

export default function() {
  http.get('https://test.k6.io');
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
```

**Run:**
```bash
k6 run test8-dashboard.js
```

Open `summary.html` in browser.

## Part 6: Real-World Scenario (30 minutes)

### Task 6.1: E-Commerce Checkout Load Test

Create `ecommerce-load-test.js`:

```javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    'group_duration{group:::01_Homepage}': ['p(95)<1000'],
    'group_duration{group:::02_ProductPage}': ['p(95)<1500'],
    'group_duration{group:::03_AddToCart}': ['p(95)<800'],
    'group_duration{group:::04_Checkout}': ['p(95)<2000'],
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
  let response;

  group('01_Homepage', function () {
    response = http.get('https://test.k6.io');
    check(response, { 'homepage OK': (r) => r.status === 200 });
    sleep(2);
  });

  group('02_ProductPage', function () {
    response = http.get('https://test.k6.io/products/1');
    check(response, { 'product page OK': (r) => r.status === 200 });
    sleep(3);
  });

  group('03_AddToCart', function () {
    response = http.post('https://test.k6.io/cart', {
      productId: 1,
      quantity: 1,
    });
    check(response, { 'added to cart': (r) => r.status === 200 });
    sleep(1);
  });

  group('04_Checkout', function () {
    response = http.post('https://test.k6.io/checkout', {
      cardNumber: '4111111111111111',
      cvv: '123',
    });
    check(response, { 'checkout OK': (r) => r.status === 200 });
    sleep(1);
  });
}
```

## Deliverables

### Performance Test Report

Create a report with:

1. **Test Objective**
   - What was tested?
   - What load pattern?

2. **Test Configuration**
   - Number of VUs
   - Duration
   - Ramp-up strategy

3. **Results Summary**
   - Average response time
   - 95th percentile
   - Maximum response time
   - Throughput (RPS)
   - Error rate

4. **Performance Against SLAs**
   - Did it meet performance budgets?
   - Which thresholds passed/failed?

5. **Bottlenecks Identified**
   - Slowest endpoints
   - When did degradation occur?

6. **Recommendations**
   - What needs optimization?
   - Suggested load capacity

## Bonus Challenges

1. **Database Load Testing:**
   - Write tests that stress database operations
   - Monitor DB query times

2. **WebSocket Testing:**
   - Test WebSocket connections with k6
   - Simulate real-time chat load

3. **Distributed Load Testing:**
   - Run k6 on multiple machines
   - Aggregate results

4. **CI/CD Integration:**
   - Add k6 tests to GitHub Actions
   - Fail builds if thresholds not met

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [k6 Examples](https://github.com/grafana/k6/tree/master/examples)
- [Performance Testing Guidance](https://k6.io/docs/test-types/load-testing/)
- [Grafana k6 Cloud](https://k6.io/cloud/)
