# Lab: Performance Testing

**Difficulty:** Intermediate
**Duration:** 4 hours
**Category:** Software

## Objectives

By the end of this lab, you will:
- Set up and run load tests using k6
- Analyze performance metrics
- Identify performance bottlenecks
- Create performance test scenarios
- Generate performance reports

## Prerequisites

- Basic understanding of HTTP and APIs
- Completed [Load, Stress, and Soak Testing lesson](../../docs/04-performance-reliability/01-load-stress-soak-testing.md)
- Command line familiarity

## Setup

### Install k6

**macOS:**
```bash
brew install k6
```

**Windows (Chocolatey):**
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

### Test API

We'll use: https://jsonplaceholder.typicode.com

## Part 1: Basic Load Test (60 minutes)

### Exercise 1.1: Simple GET Request

Create `simple-load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // 10 virtual users
  duration: '30s', // test duration
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

**Run the test:**
```bash
k6 run simple-load-test.js
```

**Analyze the output:**
- What's the average response time?
- What's the p95 response time?
- How many requests per second?
- Any failed requests?

### Exercise 1.2: Staged Load Test

Create `staged-load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts/1');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

**Run and document:**
- At what point does performance degrade?
- Do all thresholds pass?

## Part 2: Stress Testing (60 minutes)

### Exercise 2.1: Find Breaking Point

Create `stress-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 300 },  // Ramp to 300 users
    { duration: '5m', target: 300 },  // Stay at 300 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds
}
```

**Document:**
- At what user count does performance degrade?
- What metrics start failing first?

## Part 3: Real-World Scenarios (90 minutes)

### Exercise 3.1: Mixed API Testing

Create `mixed-scenario.js`:

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
    'http_req_duration{type:list}': ['p(95)<400'],
    'http_req_duration{type:detail}': ['p(95)<600'],
    'http_req_duration{type:create}': ['p(95)<800'],
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
  group('Browse Posts', function () {
    const res = http.get(`${BASE_URL}/posts`, {
      tags: { type: 'list' },
    });
    check(res, { 'status is 200': (r) => r.status === 200 });
  });

  sleep(1);

  group('View Post Detail', function () {
    const postId = Math.floor(Math.random() * 100) + 1;
    const res = http.get(`${BASE_URL}/posts/${postId}`, {
      tags: { type: 'detail' },
    });
    check(res, { 'status is 200': (r) => r.status === 200 });
  });

  sleep(2);

  group('Create Post', function () {
    const payload = JSON.stringify({
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1,
    });

    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { type: 'create' },
    };

    const res = http.post(`${BASE_URL}/posts`, payload, params);
    check(res, {
      'status is 201': (r) => r.status === 201,
      'post created': (r) => r.json('id') != undefined,
    });
  });

  sleep(1);
}
```

### Exercise 3.2: Data-Driven Testing

Create `data-test.js`:

```javascript
import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

const testData = new SharedArray('users', function () {
  return [
    { userId: 1, name: 'User 1' },
    { userId: 2, name: 'User 2' },
    { userId: 3, name: 'User 3' },
  ];
});

export const options = {
  vus: 10,
  duration: '1m',
};

export default function () {
  const user = testData[__VU % testData.length];

  const res = http.get(`https://jsonplaceholder.typicode.com/users/${user.userId}/posts`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has posts': (r) => JSON.parse(r.body).length > 0,
  });
}
```

## Part 4: Advanced Metrics (30 minutes)

### Exercise 4.1: Custom Metrics

Create `custom-metrics.js`:

```javascript
import http from 'k6/http';
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';

const myTrend = new Trend('api_response_time');
const myCounter = new Counter('api_calls');
const myRate = new Rate('api_success_rate');
const myGauge = new Gauge('api_payload_size');

export const options = {
  vus: 20,
  duration: '2m',
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  myTrend.add(res.timings.duration);
  myCounter.add(1);
  myRate.add(res.status === 200);
  myGauge.add(res.body.length);
}
```

**Analyze:**
- What custom metrics are useful for your tests?
- How can you track business-specific metrics?

## Deliverables

Create a performance test report including:

1. **Test Summary**
   - Test scenarios executed
   - Load patterns tested
   - Duration of tests

2. **Performance Metrics**
   - Average response time
   - p95 and p99 response times
   - Requests per second
   - Error rate

3. **Findings**
   - Performance bottlenecks identified
   - Breaking points
   - Threshold violations

4. **Recommendations**
   - Performance improvements needed
   - Optimal load capacity
   - Areas for further testing

## Bonus Challenges

1. **Soak Testing:**
   - Run a test for 24 hours at moderate load
   - Monitor for memory leaks or degradation

2. **Spike Testing:**
   - Sudden increase from 10 to 500 users
   - How does the system handle it?

3. **HTML Report:**
   - Install: `npm install -g k6-html-reporter`
   - Generate HTML reports from k6 JSON output

4. **Grafana Integration:**
   - Set up Grafana + InfluxDB
   - Visualize k6 metrics in real-time

## Next Steps

- Test your own applications
- Integrate k6 into CI/CD pipeline
- Learn about distributed load testing
- Explore k6 Cloud for advanced features
