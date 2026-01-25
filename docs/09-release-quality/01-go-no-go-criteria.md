# Go / No-Go Criteria

## Overview

Go/No-Go criteria are objective standards used to decide whether a release is ready for production. These criteria prevent shipping low-quality releases and provide clear guidelines for stakeholders.

## Core Go Criteria

### 1. Test Pass Rate

**Threshold:** ≥98% of automated tests passing

```javascript
const checkTestPassRate = async () => {
  const testResults = await ci.getLatestTestRun();

  const total = testResults.total;
  const passed = testResults.passed;
  const passRate = (passed / total) * 100;

  return {
    passRate,
    decision: passRate >= 98 ? 'GO' : 'NO-GO',
    details: {
      total,
      passed,
      failed: testResults.failed,
      skipped: testResults.skipped
    }
  };
};
```

### 2. Critical/Blocker Bugs

**Threshold:** Zero P0/P1 bugs

| Priority | Definition | Go Threshold |
|----------|------------|--------------|
| P0 - Blocker | System down, data loss | 0 bugs |
| P1 - Critical | Major feature broken | 0 bugs |
| P2 - High | Minor feature broken | ≤ 3 bugs |
| P3 - Medium | Cosmetic issues | ≤ 10 bugs |

```javascript
const checkBugs = async () => {
  const bugs = await jira.query('project = PROD AND status != Resolved');

  const p0Bugs = bugs.filter(b => b.priority === 'P0');
  const p1Bugs = bugs.filter(b => b.priority === 'P1');
  const p2Bugs = bugs.filter(b => b.priority === 'P2');

  const decision =
    p0Bugs.length === 0 &&
    p1Bugs.length === 0 &&
    p2Bugs.length <= 3 ? 'GO' : 'NO-GO';

  return { decision, p0: p0Bugs.length, p1: p1Bugs.length, p2: p2Bugs.length };
};
```

### 3. Code Coverage

**Threshold:** ≥80% for critical paths

```javascript
const checkCoverage = async () => {
  const coverage = await getCoverageReport();

  return {
    overall: coverage.overall,
    critical: coverage.criticalPaths, // Must be ≥80%
    decision: coverage.criticalPaths >= 80 ? 'GO' : 'NO-GO'
  };
};
```

### 4. Performance Benchmarks

**Thresholds:**
- API response time < 200ms (p95)
- Page load < 2s
- App launch < 3s

```javascript
const checkPerformance = async () => {
  const perf = await loadTestResults.getLatest();

  return {
    apiP95: perf.apiResponseTime.p95,
    pageLoad: perf.pageLoadTime.avg,
    appLaunch: perf.appLaunchTime.avg,
    decision:
      perf.apiResponseTime.p95 < 200 &&
      perf.pageLoadTime.avg < 2000 &&
      perf.appLaunchTime.avg < 3000 ? 'GO' : 'NO-GO'
  };
};
```

### 5. Security Scan

**Threshold:** No high/critical vulnerabilities

```javascript
const checkSecurity = async () => {
  const scan = await security.getLatestScan();

  const critical = scan.vulnerabilities.filter(v => v.severity === 'CRITICAL');
  const high = scan.vulnerabilities.filter(v => v.severity === 'HIGH');

  return {
    critical: critical.length,
    high: high.length,
    decision: critical.length === 0 && high.length === 0 ? 'GO' : 'NO-GO'
  };
};
```

## Go/No-Go Decision Matrix

```javascript
const releaseDecision = async () => {
  const checks = await Promise.all([
    checkTestPassRate(),
    checkBugs(),
    checkCoverage(),
    checkPerformance(),
    checkSecurity()
  ]);

  const allGo = checks.every(check => check.decision === 'GO');

  return {
    overallDecision: allGo ? 'GO' : 'NO-GO',
    checks,
    timestamp: new Date().toISOString(),
    approver: process.env.RELEASE_MANAGER
  };
};
```

## Example Go/No-Go Report

```
Release: v2.3.1
Date: 2026-01-24
Decision: NO-GO

Criteria Results:
✅ Test Pass Rate: 98.5% (GO)
❌ Critical Bugs: 1 P0 bug (NO-GO)
✅ Code Coverage: 85% (GO)
✅ Performance: All benchmarks met (GO)
✅ Security: No critical vulnerabilities (GO)

Blockers:
- P0-1234: Login fails for users with 2FA enabled

Action: Fix P0-1234, retest, and reconvene for go/no-go decision.
```

## Summary

Go/No-Go criteria provide:
- Objective release quality standards
- Clear communication to stakeholders
- Protection against shipping bad releases
- Data-driven decision making

Define criteria early, measure consistently, and enforce strictly.
