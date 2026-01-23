# Test Reporting and Analytics

## Overview

Test reports and analytics transform raw test results into actionable insights. Good reporting helps teams understand quality trends, identify problem areas, and make data-driven decisions about releases.

## Why Reporting Matters

### The Problem Without Good Reporting

```
Test run output:
✅ 1,234 passed
❌ 23 failed
⏭  12 skipped

Questions that can't be answered:
- Which features are most fragile?
- Are things getting better or worse?
- Should we release?
- What's our test coverage?
- Why did tests fail?
```

### With Good Reporting

```
Dashboard shows:
- Test pass rate: 98.2% (up from 95% last week)
- Flaky test rate: 1.1% (down from 3%)
- Most failed test: "checkout flow" (12 failures this week)
- Coverage: 82% (target: 80%)
- Recommendation: ✅ Safe to release
```

---

## Essential Test Metrics

### 1. Pass Rate

```
Pass Rate = (Passed Tests / Total Tests) × 100%

Example:
1,234 passed / 1,269 total = 97.2%

Target: > 98% for stable suites
```

**Tracking:**

```javascript
// Calculate pass rate
const passRate = (results) => {
  const passed = results.filter(r => r.status === 'passed').length;
  const total = results.length;
  return (passed / total * 100).toFixed(1);
};

console.log(`Pass rate: ${passRate(testResults)}%`);
```

### 2. Flakiness Rate

```
Flakiness Rate = (Flaky Tests / Total Tests) × 100%

Flaky test = Passes sometimes, fails sometimes (without code changes)

Target: < 1%
```

**Detecting flaky tests:**

```javascript
class FlakinessTracker {
  constructor() {
    this.results = new Map(); // testName -> [pass, fail, pass]
  }

  record(testName, status) {
    if (!this.results.has(testName)) {
      this.results.set(testName, []);
    }
    this.results.get(testName).push(status);
  }

  getFlakyTests() {
    const flaky = [];

    for (const [testName, results] of this.results) {
      const hasPasses = results.includes('passed');
      const hasFailures = results.includes('failed');

      if (hasPasses && hasFailures) {
        const failureRate = results.filter(r => r === 'failed').length / results.length;
        flaky.push({ testName, failureRate: (failureRate * 100).toFixed(1) + '%' });
      }
    }

    return flaky;
  }
}
```

### 3. Test Execution Time

```
Total Time: How long does full suite take?
Average Time: Average per test

Targets:
- Unit tests: < 5 minutes
- API tests: < 15 minutes
- E2E tests: < 30 minutes
```

**Tracking slowest tests:**

```javascript
const slowestTests = results
  .sort((a, b) => b.duration - a.duration)
  .slice(0, 10);

console.log('Slowest tests:');
slowestTests.forEach(test => {
  console.log(`- ${test.name}: ${test.duration}ms`);
});
```

### 4. Test Coverage

```
Code Coverage = (Lines Executed / Total Lines) × 100%

Targets:
- Critical code: 90%+
- Overall: 80%+
- New code: 80%+
```

**Example with Jest:**

```bash
jest --coverage --coverageReporters=json-summary

# Read coverage
COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
echo "Coverage: $COVERAGE%"
```

### 5. Defect Escape Rate

```
Defect Escape Rate = (Bugs in Prod / Total Bugs) × 100%

Target: < 5%

Example:
5 bugs found in production
95 bugs found in testing
Escape rate: 5/100 = 5%
```

### 6. Mean Time to Detect (MTTD)

```
MTTD = Average time from bug introduction to detection

Lower is better

Example:
Bug introduced: Monday 9 AM
Bug detected by tests: Monday 11 AM
MTTD: 2 hours
```

---

## Playwright Built-in Reporting

### HTML Reporter (Default)

```javascript
// playwright.config.js
module.exports = {
  reporter: [['html', { open: 'never' }]],
};
```

```bash
npx playwright test
npx playwright show-report
```

**Features:**
- Interactive test results
- Screenshots and videos
- Trace files
- Filtering and search

### JSON Reporter

```javascript
// playwright.config.js
module.exports = {
  reporter: [['json', { outputFile: 'test-results.json' }]],
};
```

**Parse JSON results:**

```javascript
const fs = require('fs');

const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));

const summary = {
  total: results.suites.reduce((sum, s) => sum + s.specs.length, 0),
  passed: 0,
  failed: 0,
  skipped: 0,
  duration: results.stats.duration
};

results.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    if (spec.ok) summary.passed++;
    else if (spec.tests[0].status === 'skipped') summary.skipped++;
    else summary.failed++;
  });
});

console.log(summary);
```

### JUnit Reporter (for CI/CD)

```javascript
// playwright.config.js
module.exports = {
  reporter: [['junit', { outputFile: 'results.xml' }]],
};
```

**Benefits:**
- Jenkins/GitLab CI integration
- Standard format
- Test history tracking

---

## Custom Reporters

### Simple Console Reporter

```javascript
// reporters/console-reporter.js
class ConsoleReporter {
  onBegin(config, suite) {
    console.log(`Starting test run with ${suite.allTests().length} tests`);
  }

  onTestEnd(test, result) {
    const status = result.status === 'passed' ? '✅' : '❌';
    const duration = result.duration;
    console.log(`${status} ${test.title} (${duration}ms)`);
  }

  onEnd(result) {
    console.log(`\nTests ${result.status}ed!`);
    console.log(`Total: ${result.stats.total}`);
    console.log(`Passed: ${result.stats.expected}`);
    console.log(`Failed: ${result.stats.unexpected}`);
    console.log(`Flaky: ${result.stats.flaky}`);
    console.log(`Duration: ${result.duration}ms`);
  }
}

module.exports = ConsoleReporter;
```

### Slack Reporter

```javascript
// reporters/slack-reporter.js
const axios = require('axios');

class SlackReporter {
  constructor(options) {
    this.webhookUrl = options.webhookUrl;
  }

  async onEnd(result) {
    const passRate = ((result.stats.expected / result.stats.total) * 100).toFixed(1);
    const status = result.status === 'passed' ? '✅' : '❌';
    const color = result.status === 'passed' ? 'good' : 'danger';

    const message = {
      text: `${status} Test Run ${result.status}`,
      attachments: [{
        color: color,
        fields: [
          { title: 'Total Tests', value: result.stats.total, short: true },
          { title: 'Passed', value: result.stats.expected, short: true },
          { title: 'Failed', value: result.stats.unexpected, short: true },
          { title: 'Flaky', value: result.stats.flaky, short: true },
          { title: 'Pass Rate', value: `${passRate}%`, short: true },
          { title: 'Duration', value: `${Math.round(result.duration / 1000)}s`, short: true }
        ]
      }]
    };

    await axios.post(this.webhookUrl, message);
  }
}

module.exports = SlackReporter;
```

**Usage:**

```javascript
// playwright.config.js
const SlackReporter = require('./reporters/slack-reporter');

module.exports = {
  reporter: [
    ['html'],
    [SlackReporter, { webhookUrl: process.env.SLACK_WEBHOOK }]
  ],
};
```

---

## Test Dashboards

### Metrics to Display

**Overview Dashboard:**
```
┌─────────────────────────────────────────┐
│          Test Suite Health              │
├─────────────────────────────────────────┤
│ Pass Rate:      98.2% ▲ +1.5%          │
│ Flaky Rate:     1.1%  ▼ -1.9%          │
│ Total Tests:    1,269                   │
│ Duration:       24m 15s                 │
│                                         │
│ ✅ Safe to Deploy                       │
└─────────────────────────────────────────┘

Recent Failures:
1. checkout_flow_test     (3 failures)
2. search_autocomplete    (2 failures)
3. user_login_oauth       (1 failure)

Test Execution Trend (7 days):
Mon Tue Wed Thu Fri Sat Sun
 24m 23m 25m 22m 24m 23m 24m
```

**Coverage Dashboard:**
```
┌─────────────────────────────────────────┐
│         Code Coverage                   │
├─────────────────────────────────────────┤
│ Overall:    82% ██████████░░░░          │
│ Target:     80%                         │
│ Status:     ✅ Above target             │
│                                         │
│ By Module:                              │
│ - Auth:     95% ██████████████░         │
│ - Payment:  88% ████████████░░░         │
│ - Cart:     79% ███████████░░░░ ⚠️      │
│ - Admin:    45% ██████░░░░░░░░░ ❌      │
└─────────────────────────────────────────┘
```

### Grafana Dashboard

**Example Prometheus metrics:**

```javascript
// metrics.js
const { Counter, Histogram, Gauge, register } = require('prom-client');

const testCounter = new Counter({
  name: 'tests_total',
  help: 'Total number of tests',
  labelNames: ['status', 'suite']
});

const testDuration = new Histogram({
  name: 'test_duration_seconds',
  help: 'Test execution duration',
  labelNames: ['test_name']
});

const flakyTests = new Gauge({
  name: 'flaky_tests_count',
  help: 'Number of flaky tests'
});

// Record metrics
function recordTestResult(test, result) {
  testCounter.inc({ status: result.status, suite: test.suite });
  testDuration.observe({ test_name: test.name }, result.duration / 1000);

  if (result.retry > 0) {
    flakyTests.inc();
  }
}

// Expose metrics
const express = require('express');
const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(9090);
```

**Grafana Queries:**

```promql
# Test pass rate
(sum(rate(tests_total{status="passed"}[5m])) /
 sum(rate(tests_total[5m]))) * 100

# Average test duration
avg(test_duration_seconds)

# Flaky test count over time
sum(flaky_tests_count)
```

---

## Test Result Archiving

### Store Historical Data

```javascript
// archive-results.js
const fs = require('fs');
const path = require('path');

function archiveResults(results) {
  const timestamp = new Date().toISOString();
  const filename = `results-${timestamp}.json`;
  const archivePath = path.join('archive', filename);

  // Create archive directory
  if (!fs.existsSync('archive')) {
    fs.mkdirSync('archive');
  }

  // Save results
  fs.writeFileSync(archivePath, JSON.stringify(results, null, 2));

  console.log(`Results archived: ${archivePath}`);
}
```

### Trend Analysis

```javascript
// analyze-trends.js
const fs = require('fs');
const path = require('path');

function analyzeTrends() {
  const archiveDir = 'archive';
  const files = fs.readdirSync(archiveDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(archiveDir, f));

  const trends = files.map(file => {
    const results = JSON.parse(fs.readFileSync(file, 'utf8'));
    const passed = results.filter(r => r.status === 'passed').length;
    const total = results.length;

    return {
      date: path.basename(file, '.json').replace('results-', ''),
      passRate: (passed / total * 100).toFixed(1),
      total: total,
      duration: results.reduce((sum, r) => sum + r.duration, 0)
    };
  });

  // Print trend
  console.log('Test Pass Rate Trend:');
  trends.slice(-7).forEach(t => {
    console.log(`${t.date}: ${t.passRate}%`);
  });

  // Detect improvement or degradation
  const recent = trends.slice(-3);
  const avg = recent.reduce((sum, t) => sum + parseFloat(t.passRate), 0) / recent.length;
  const older = trends.slice(-6, -3);
  const oldAvg = older.reduce((sum, t) => sum + parseFloat(t.passRate), 0) / older.length;

  if (avg > oldAvg) {
    console.log(`\n✅ Improving! (${avg.toFixed(1)}% vs ${oldAvg.toFixed(1)}%)`);
  } else {
    console.log(`\n⚠️  Degrading (${avg.toFixed(1)}% vs ${oldAvg.toFixed(1)}%)`);
  }
}
```

---

## CI/CD Integration

### GitHub Actions Summary

```yaml
# .github/workflows/test.yml
jobs:
  test:
    steps:
      - run: npm test

      - name: Generate test summary
        if: always()
        run: |
          echo "## Test Results" >> $GITHUB_STEP_SUMMARY
          echo "- Total: $(jq '.stats.total' test-results.json)" >> $GITHUB_STEP_SUMMARY
          echo "- Passed: $(jq '.stats.expected' test-results.json)" >> $GITHUB_STEP_SUMMARY
          echo "- Failed: $(jq '.stats.unexpected' test-results.json)" >> $GITHUB_STEP_SUMMARY

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const results = require('./test-results.json');
            const summary = `## Test Results
            - ✅ Passed: ${results.stats.expected}
            - ❌ Failed: ${results.stats.unexpected}
            - ⏭ Skipped: ${results.stats.skipped}
            - Pass Rate: ${(results.stats.expected / results.stats.total * 100).toFixed(1)}%
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

### Test Badge

```markdown
<!-- README.md -->
![Tests](https://github.com/username/repo/workflows/Tests/badge.svg)

<!-- Or with shields.io -->
![Test Coverage](https://img.shields.io/badge/coverage-82%25-brightgreen)
![Pass Rate](https://img.shields.io/badge/pass%20rate-98%25-brightgreen)
```

---

## Failure Analysis

### Categorize Failures

```javascript
function categorizeFailures(results) {
  const categories = {
    timeout: [],
    assertion: [],
    network: [],
    selector: [],
    other: []
  };

  results.filter(r => r.status === 'failed').forEach(test => {
    const error = test.error.message;

    if (error.includes('Timeout')) {
      categories.timeout.push(test.name);
    } else if (error.includes('expect')) {
      categories.assertion.push(test.name);
    } else if (error.includes('net::ERR')) {
      categories.network.push(test.name);
    } else if (error.includes('locator')) {
      categories.selector.push(test.name);
    } else {
      categories.other.push(test.name);
    }
  });

  return categories;
}

// Report
const categories = categorizeFailures(results);

console.log('Failure Analysis:');
console.log(`- Timeout errors: ${categories.timeout.length}`);
console.log(`- Assertion failures: ${categories.assertion.length}`);
console.log(`- Network errors: ${categories.network.length}`);
console.log(`- Selector errors: ${categories.selector.length}`);
```

### Root Cause Distribution

```javascript
// Identify most common failure reasons
function getMostCommonFailures(results) {
  const errorCounts = new Map();

  results
    .filter(r => r.status === 'failed')
    .forEach(test => {
      const errorType = test.error.message.split('\n')[0]; // First line
      errorCounts.set(errorType, (errorCounts.get(errorType) || 0) + 1);
    });

  return Array.from(errorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

const topFailures = getMostCommonFailures(results);

console.log('Top 5 Failure Reasons:');
topFailures.forEach(([error, count]) => {
  console.log(`${count}x: ${error}`);
});
```

---

## Best Practices

### 1. Report Context, Not Just Numbers

```javascript
// ❌ Bad: Just numbers
console.log('Tests passed: 1234');

// ✅ Good: Context
console.log(`Tests passed: 1234/1269 (97.2%)
Pass rate improved by 2.1% since last week
3 tests remain flaky (down from 8)
Recommendation: ✅ Safe to deploy`);
```

### 2. Make Reports Actionable

```javascript
// ❌ Bad: Just list failures
console.log('Failed tests: checkout_test, login_test');

// ✅ Good: Actionable information
console.log(`Failed tests:
1. checkout_test (failed 12 times this week)
   - Root cause: Timeout waiting for payment API
   - Action: Increase timeout or mock API
   - Owner: @john

2. login_test (failed 3 times this week)
   - Root cause: Flaky selector
   - Action: Use data-testid instead of CSS class
   - Owner: @sarah`);
```

### 3. Track Trends, Not Just Snapshots

```javascript
// Show improvement/degradation
console.log(`Pass Rate:
Today:      98.2%
Last week:  96.1% (+2.1% improvement ✅)
Last month: 93.5% (+4.7% improvement ✅)
Trend: Improving 📈`);
```

### 4. Visualize Data

```javascript
// ASCII chart for trends
function renderTrend(values) {
  const max = Math.max(...values);
  const normalized = values.map(v => Math.round((v / max) * 10));

  return normalized.map(v => '█'.repeat(v)).join('\n');
}

console.log('Pass Rate Trend (7 days):');
console.log(renderTrend([95, 96, 94, 97, 98, 97, 98]));
// Output:
// ██████████
// ██████████
// █████████
// ██████████
// ██████████
// ██████████
// ██████████
```

---

## What Senior Engineers Know

**Metrics without action are vanity.** Track what matters, act on the data.

**Trends matter more than snapshots.** One bad day is okay. Declining trend is a problem.

**Automate reporting.** If humans have to generate reports, it won't happen consistently.

**Make failures obvious.** Slack notification > Email > Dashboard buried in tool

**Celebrate improvements.** Team morale matters. Show progress.

---

## Exercise

**Build Test Dashboard:**

Create a dashboard that shows:

1. **Current Status:**
   - Pass rate
   - Flaky test count
   - Total tests
   - Duration

2. **Trends (7 days):**
   - Pass rate over time
   - Duration over time

3. **Top Issues:**
   - Most failed tests
   - Slowest tests
   - Flaky tests

4. **Recommendation:**
   - "✅ Safe to deploy" or "❌ Fix issues first"

**Deliverable:** HTML dashboard or JSON API

---

## Next Steps

- Review [Automation Strategy](01-automation-strategy.md)
- Master [Flaky Test Prevention](07-flaky-test-prevention.md)
- Implement [CI/CD Integration](08-cicd-integration.md)
- Study [Framework Design Patterns](04-framework-design-patterns.md)
