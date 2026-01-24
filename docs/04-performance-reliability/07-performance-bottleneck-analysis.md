# Performance Bottleneck Analysis

## Overview

When performance tests fail, you need to find the bottleneck. Is it CPU? Memory? Database? Network? This lesson covers systematic approaches to identifying and fixing performance issues through profiling, analysis, and optimization.

---

## The Bottleneck Hierarchy

```
1. Database (most common)
   - Slow queries (missing indexes, N+1 queries)
   - Connection pool exhaustion
   - Lock contention

2. Application Code
   - Inefficient algorithms (O(n²) instead of O(n))
   - Memory leaks
   - Blocking I/O

3. External Dependencies
   - Third-party API timeouts
   - Network latency
   - DNS resolution

4. Infrastructure
   - CPU saturation
   - Memory pressure
   - Disk I/O
   - Network bandwidth
```

---

## Top-Down Analysis Approach

```
Step 1: Identify Symptom
- High latency? Error rate? Low throughput?

Step 2: Check Application Metrics
- Response time by endpoint
- Error logs
- Request traces

Step 3: Check Infrastructure
- CPU, memory, disk, network
- Database connections
- Cache hit rate

Step 4: Drill Down
- Profile slow endpoints
- Analyze slow queries
- Examine traces

Step 5: Fix and Verify
- Implement fix
- Re-test
- Measure improvement
```

---

## Common Bottlenecks

### 1. Database N+1 Query Problem

```javascript
// ❌ Bad: N+1 queries (1 + 100 = 101 queries)
async function getOrdersWithItems() {
  const orders = await db.query('SELECT * FROM orders LIMIT 100');
  
  for (const order of orders) {
    order.items = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
  }
  
  return orders;
}

// Result: 101 database queries, 5 seconds total

// ✅ Good: Single query with JOIN (1 query)
async function getOrdersWithItems() {
  const results = await db.query(`
    SELECT 
      o.*, 
      json_agg(oi.*) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    LIMIT 100
  `);
  
  return results;
}

// Result: 1 database query, 50ms total (100x faster!)
```

### 2. Missing Database Index

```sql
-- Slow query (100ms)
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 12345;

-- Query plan shows: Seq Scan (full table scan)
-- Rows: 10,000,000
-- Time: 1,250 ms

-- Add index
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Re-run query (now 2ms)
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 12345;

-- Query plan shows: Index Scan using idx_orders_user_id
-- Rows: 150
-- Time: 2.5 ms

-- 500x faster!
```

### 3. Memory Leak

```javascript
// ❌ Memory leak: Event listeners not removed
class DataProcessor {
  constructor() {
    this.cache = new Map();
    
    // Event listener never removed
    eventEmitter.on('data', (data) => {
      this.cache.set(data.id, data); // Cache grows indefinitely
    });
  }
}

// After 24 hours: Memory usage 8 GB → 16 GB → 32 GB → OOM crash

// ✅ Fix: Limit cache size
class DataProcessor {
  constructor() {
    this.cache = new LRU({ max: 10000 }); // Least Recently Used cache with limit
    
    this.listener = (data) => {
      this.cache.set(data.id, data);
    };
    
    eventEmitter.on('data', this.listener);
  }
  
  destroy() {
    eventEmitter.off('data', this.listener); // Clean up
  }
}
```

### 4. Inefficient Algorithm

```javascript
// ❌ O(n²) - Nested loops
function findDuplicates(array) {
  const duplicates = [];
  
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        duplicates.push(array[i]);
      }
    }
  }
  
  return duplicates;
}

// With 10,000 items: 100 million comparisons, 5 seconds

// ✅ O(n) - Hash set
function findDuplicates(array) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}

// With 10,000 items: 10,000 operations, 5ms (1000x faster!)
```

---

## Profiling Tools

### Node.js Profiling

```bash
# CPU profiling
node --prof app.js

# Run load test
k6 run load-test.js

# Process profiling data
node --prof-process isolate-*.log > profile.txt

# Analyze profile.txt (shows which functions consuming most CPU)
```

### Flame Graphs

```bash
# Generate flame graph (Linux)
perf record -F 99 -p $(pgrep -f node) -g -- sleep 30
perf script > out.perf
stackcollapse-perf.pl out.perf > out.folded
flamegraph.pl out.folded > flamegraph.svg

# View flamegraph.svg in browser
# Wide bars = CPU hotspots (optimize these)
```

### Database Query Analysis

```sql
-- Enable slow query log (PostgreSQL)
ALTER SYSTEM SET log_min_duration_statement = 100; -- Log queries > 100ms
SELECT pg_reload_conf();

-- View slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Example result:
-- query: SELECT * FROM orders WHERE status = 'pending'
-- calls: 50,000
-- mean_time: 450ms
-- Action: Add index on status column
```

---

## Real-World Case Study

### Problem: API Latency Increased 10x

```
Symptoms:
- p95 latency: 250ms → 2,500ms
- Error rate: 0.1% → 5%
- Started after deployment at 10:00 AM

Step 1: Check Recent Changes
- Deployment: Added "related products" feature
- Code review: New endpoint /api/products/:id/related

Step 2: Profile Slow Endpoint
Trace shows:
- Total: 2,500ms
  ├─ Database query: 2,400ms ⚠️
  └─ Application logic: 100ms

Step 3: Analyze Database Query
EXPLAIN ANALYZE SELECT * FROM products 
WHERE category_id IN (
  SELECT category_id FROM products WHERE id = 123
)
AND id != 123
LIMIT 10;

-- Seq Scan on products (cost=0..150000) (actual time=2450ms)
-- Missing index on category_id

Step 4: Fix
CREATE INDEX idx_products_category_id ON products(category_id);

Step 5: Verify
-- Re-run query: 15ms (167x faster!)
-- p95 latency: 2,500ms → 180ms ✅
-- Error rate: 5% → 0.1% ✅
```

---

## Best Practices

**1. Measure before optimizing:**
```
❌ "I think this is slow, let me optimize"
✅ "Profile shows 80% time in database, optimize queries first"
```

**2. Optimize the biggest bottleneck first:**
```
If database is 80% of latency, optimizing application code (20%) won't help much.
```

**3. Verify improvements:**
```
Before fix: p95 = 2,500ms
After fix: p95 = 180ms
Improvement: 93% reduction ✅
```

---

## Exercise

**Debug Performance Regression:**

Scenario: After deployment, checkout API is 5x slower.

Tasks:
1. Use distributed tracing to identify slow component
2. Profile database queries
3. Identify root cause
4. Implement fix
5. Validate with load test

**Deliverable:** Root cause analysis report with fix validation.

---

## Next Steps

- Review [Load Testing](01-load-stress-soak-testing.md)
- Study [Observability](02-observability-for-qa.md)
- Explore other modules
