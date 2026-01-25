# Post-Release Monitoring

## Overview

Post-release monitoring tracks application health after deployment, enabling quick detection and resolution of production issues.

## Key Metrics to Monitor

### 1. Error Rate

**Metric:** Errors per minute

**Threshold:** <10 errors/min

```javascript
const monitorErrorRate = () => {
  const query = `
    SELECT COUNT(*) / 60 AS errors_per_minute
    FROM logs
    WHERE level = 'ERROR'
    AND timestamp > NOW() - INTERVAL '1 minute'
  `;

  const errorRate = db.query(query);

  if (errorRate > 10) {
    alert('🚨 Error rate spike detected!');
    triggerRollback();
  }
};
```

### 2. Latency

**Metric:** P95 response time

**Threshold:** <200ms

```javascript
const monitorLatency = async () => {
  const metrics = await prometheus.query(`
    histogram_quantile(0.95,
      rate(http_request_duration_seconds_bucket[5m])
    )
  `);

  if (metrics.p95 > 0.2) { // >200ms
    alert('⚠️ Latency degradation detected');
  }
};
```

### 3. Crash Rate

**Metric:** Crashes per session

**Threshold:** <1%

```javascript
const monitorCrashes = async () => {
  const crashes = await getCrashCount('last_hour');
  const sessions = await getSessionCount('last_hour');

  const crashRate = (crashes / sessions) * 100;

  if (crashRate > 1) {
    alert('🚨 Crash rate above threshold!');
  }
};
```

### 4. Traffic Volume

**Metric:** Requests per second

**Purpose:** Detect anomalies (spikes or drops)

```javascript
const monitorTraffic = () => {
  const rps = getCurrentRPS();
  const baseline = getBaselineRPS('same_hour_last_week');

  const percentChange = ((rps - baseline) / baseline) * 100;

  if (Math.abs(percentChange) > 50) {
    alert(`Traffic anomaly: ${percentChange}% change from baseline`);
  }
};
```

## Monitoring Dashboard

```
Production Health Dashboard (Post-Deployment)

Release: v2.3.1
Deployed: 2026-01-24 09:00 UTC
Status: ✅ HEALTHY

Metrics (Last Hour):
├─ Error Rate: 3.2/min ✅ (threshold: <10)
├─ P95 Latency: 145ms ✅ (threshold: <200ms)
├─ Crash Rate: 0.3% ✅ (threshold: <1%)
├─ Traffic: 1,250 RPS ✅ (+5% from baseline)
└─ Apdex Score: 0.95 ✅ (threshold: >0.9)

Recent Alerts:
- None

Deployment Progress:
- Canary (1%): ✅ Healthy
- Stage 1 (10%): ✅ Healthy
- Stage 2 (50%): In Progress...
```

## Automated Rollback Triggers

```javascript
const autoRollbackRules = [
  {
    condition: 'errorRate > 50',
    action: 'IMMEDIATE_ROLLBACK',
    reason: 'Critical error rate spike'
  },
  {
    condition: 'crashRate > 5',
    action: 'IMMEDIATE_ROLLBACK',
    reason: 'Excessive crashes'
  },
  {
    condition: 'p95Latency > 500',
    action: 'PAUSE_ROLLOUT',
    reason: 'Latency degradation'
  }
];

const evaluateRollback = (metrics) => {
  for (const rule of autoRollbackRules) {
    if (eval(rule.condition)) {
      executeAction(rule.action, rule.reason);
    }
  }
};
```

## Summary

Post-release monitoring ensures:
- Early detection of production issues
- Automated rollback on critical failures
- Data-driven deployment decisions
- Quick incident response

Monitor aggressively for 24-48 hours post-deployment, then reduce to baseline monitoring.
