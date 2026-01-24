# Capacity Planning

## Overview

Capacity planning answers: "Will our system handle next month's traffic? Next year's?" It predicts future resource needs based on current usage and growth projections. For QA, this means testing scalability, validating auto-scaling, and ensuring the system can grow without performance degradation.

---

## Capacity vs Performance Testing

```
Performance Testing: Does system meet SLOs under current load?
Capacity Testing: What is maximum load before degradation?

Example:
Performance Test: 1,000 users, verify p95 < 500ms ✅
Capacity Test: Increase to 5,000 users, find breaking point
```

---

## Scalability Testing

### Horizontal Scaling (Scale Out)

```javascript
// Test: Validate horizontal scaling (add more instances)
describe('Horizontal Scaling', () => {
  it('should handle 10x traffic with auto-scaling', async () => {
    // Start with 2 instances
    await setInstanceCount(2);
    
    // Load test: 1,000 users
    const baseline = await loadTest({ users: 1000, duration: '5m' });
    expect(baseline.p95Latency).toBeLessThan(500);
    
    // Increase to 10,000 users (10x load)
    const scaleTest = await loadTest({ users: 10000, duration: '10m' });
    
    // Auto-scaling should have kicked in
    const instanceCount = await getInstanceCount();
    expect(instanceCount).toBeGreaterThan(10); // Should scale to ~20 instances
    
    // Performance should remain acceptable
    expect(scaleTest.p95Latency).toBeLessThan(1000); // Slightly higher, but acceptable
    expect(scaleTest.errorRate).toBeLessThan(0.01); // < 1% errors
  });
});
```

### Vertical Scaling (Scale Up)

```
Test: Compare instance sizes

Small instance (2 CPU, 4GB RAM):
- Max throughput: 500 req/s
- Cost: $50/month

Medium instance (4 CPU, 8GB RAM):
- Max throughput: 1,200 req/s
- Cost: $100/month

Large instance (8 CPU, 16GB RAM):
- Max throughput: 2,800 req/s
- Cost: $200/month

Cost efficiency: Medium instance best (12 req/s per dollar)
```

---

## Growth Modeling

```
Current State (January 2025):
- Daily active users: 100,000
- Peak requests/second: 2,000
- Average requests/second: 500

Growth Projection (Linear):
- Monthly growth: 10%
- In 6 months: 177,000 users
- Peak req/s: 3,540
- Average req/s: 885

Growth Projection (Exponential - viral product):
- Monthly growth: 30%
- In 6 months: 480,000 users
- Peak req/s: 9,600
- Average req/s: 2,400

Capacity Planning:
- Linear growth: Current capacity sufficient for 6 months
- Exponential growth: Need 5x capacity in 6 months
```

---

## Auto-Scaling Validation

```javascript
// Test auto-scaling policies
describe('Auto-Scaling', () => {
  it('should scale up when CPU > 70%', async () => {
    const initialCount = await getInstanceCount();
    
    // Generate CPU-intensive load
    await loadTest({
      users: 5000,
      duration: '10m',
      script: 'cpu-intensive.js',
    });
    
    // Wait for scaling (typically 2-5 minutes)
    await sleep(180000);
    
    const scaledCount = await getInstanceCount();
    expect(scaledCount).toBeGreaterThan(initialCount);
    
    // Verify CPU reduced after scaling
    const cpuUsage = await getAvgCPU();
    expect(cpuUsage).toBeLessThan(70);
  });
  
  it('should scale down when load decreases', async () => {
    const peakCount = await getInstanceCount();
    
    // Stop load test
    await stopLoadTest();
    
    // Wait for scale-down (typically 10-15 minutes, conservative)
    await sleep(900000);
    
    const normalCount = await getInstanceCount();
    expect(normalCount).toBeLessThan(peakCount);
  });
});
```

---

## Database Capacity Planning

```sql
-- Estimate database growth

-- Current state
SELECT 
  pg_size_pretty(pg_database_size('production')) as current_size;
-- Result: 50 GB

-- Growth rate (check historical data)
SELECT 
  date_trunc('month', created_at) as month,
  pg_size_pretty(sum(octet_length(data::text))) as growth
FROM orders
GROUP BY month
ORDER BY month DESC
LIMIT 12;

-- Monthly growth: ~2 GB/month
-- Projected size in 12 months: 50 + (2 × 12) = 74 GB

-- Connection pool capacity
SHOW max_connections; -- 200
SELECT count(*) FROM pg_stat_activity; -- Current: 45

-- Peak usage: 180/200 (90% utilized)
-- Recommendation: Increase to 300 connections before hitting limit
```

---

## Best Practices

**1. Test with realistic data volumes:**
```
❌ Test with 1,000 records
✅ Test with 10 million records (production-like)
```

**2. Account for traffic spikes:**
```
Normal: 1,000 req/s
Peak: 10,000 req/s (Black Friday)

Capacity target: 15,000 req/s (50% headroom)
```

**3. Monitor leading indicators:**
```
CPU trend: 50% → 60% → 70% over 3 months
Action: Scale proactively before hitting limit
```

---

## Exercise

**Plan capacity for 10x growth:**

Current: 100,000 users, 1,000 req/s
Target: 1,000,000 users, 10,000 req/s (12 months)

Tasks:
1. Calculate resource requirements (CPU, memory, database)
2. Test horizontal scaling (verify linear scalability)
3. Validate auto-scaling policies
4. Estimate costs

**Deliverable:** Capacity plan with cost projections.

---

## Next Steps

- Master [Performance Bottleneck Analysis](07-performance-bottleneck-analysis.md)
- Review [Load Testing](01-load-stress-soak-testing.md)
