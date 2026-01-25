# Quality Metrics That Matter

## Overview

Quality metrics help teams understand release health, identify trends, and make data-driven decisions. Focus on metrics that drive action, not vanity metrics.

## Key Metrics

### 1. Defect Escape Rate

**Formula:** (Bugs found in production) / (Total bugs found) × 100

```javascript
const defectEscapeRate = (prodBugs, totalBugs) => {
  return (prodBugs / totalBugs) * 100;
};

// Example: 5 prod bugs out of 100 total = 5% escape rate
// Target: <5%
```

### 2. Mean Time to Detect (MTTD)

**Definition:** Average time from bug introduction to detection

**Target:** <24 hours for critical bugs

```javascript
const calculateMTTD = (bugs) => {
  const durations = bugs.map(bug =>
    bug.detectedAt - bug.introducedAt
  );
  return average(durations);
};
```

### 3. Mean Time to Resolve (MTTR)

**Definition:** Average time from bug detection to fix deployed

| Priority | Target MTTR |
|----------|-------------|
| P0 | <4 hours |
| P1 | <2 days |
| P2 | <1 week |
| P3 | <2 weeks |

### 4. Test Automation Coverage

**Formula:** (Automated tests) / (Total test cases) × 100

**Target:** ≥80% for critical paths

### 5. Flaky Test Rate

**Formula:** (Flaky test runs) / (Total test runs) × 100

**Target:** <2%

```javascript
const flakyTestRate = (testRuns) => {
  const flaky = testRuns.filter(run =>
    run.status === 'passed' && run.previousStatus === 'failed' &&
    run.codeUnchanged
  );
  return (flaky.length / testRuns.length) * 100;
};
```

### 6. Code Coverage

**Target:** ≥80% overall, ≥90% for critical paths

```
Overall Coverage: 85%
├─ Backend API: 92%
├─ Frontend: 78%
├─ Mobile App: 81%
└─ Firmware: 70% ⚠️
```

### 7. Customer-Reported Bugs

**Metric:** Bugs per 1,000 users per month

**Target:** <5 bugs per 1,000 users

## Metrics Dashboard

```javascript
const qualityDashboard = {
  sprint: 'Sprint 42',
  defectEscapeRate: 3.2, // ✅ Target: <5%
  mttd: '18 hours', // ✅ Target: <24h
  mttr: {
    p0: '2 hours', // ✅
    p1: '1.5 days', // ✅
    p2: '5 days' // ✅
  },
  automationCoverage: 85, // ✅
  flakyTestRate: 1.5, // ✅
  codeCoverage: 87, // ✅
  customerBugs: 3.8 // ✅ per 1k users
};
```

## Leading vs Lagging Indicators

**Leading Indicators** (predict future quality):
- Code review turnaround time
- Test automation coverage
- Flaky test rate

**Lagging Indicators** (measure past quality):
- Defect escape rate
- Customer-reported bugs
- Production incidents

## Summary

Track metrics that:
- Drive action and improvement
- Align with business goals
- Are measurable and actionable
- Provide early warning signals

Review metrics weekly, trend monthly, and adjust targets quarterly.
