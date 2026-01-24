# Observability for QA

## Overview

Observability is the ability to understand what's happening inside your system by examining its external outputs. For QA engineers, observability transforms "the test failed" into "the test failed because the database query took 8 seconds due to a missing index on the orders table." Without observability, you're debugging blind.

**The Three Pillars of Observability:**
1. **Logs** - Discrete events (errors, warnings, info)
2. **Metrics** - Numerical measurements over time (CPU, latency, requests/sec)
3. **Traces** - Request flows through distributed systems

---

## Why Observability Matters for QA

### Traditional Monitoring vs Observability

```
Traditional Monitoring (Known Unknowns):
- "Is the server up?" → Ping check
- "Is CPU high?" → Threshold alert
- "Are requests failing?" → Error count

Limitation: Only answers questions you thought to ask

Observability (Unknown Unknowns):
- "Why did this specific request take 10 seconds?"
- "Which service in the chain is slow?"
- "What changed between this deployment and the last?"

Capability: Explore and debug novel failures you didn't anticipate
```

### QA Use Cases for Observability

```
1. Test Debugging:
   - Performance test shows high latency → Query traces to find slow service
   - Integration test fails intermittently → Check logs for error patterns
   - Load test causes errors → Correlate metrics (CPU, memory) with error spikes

2. Validation:
   - Verify SLO compliance → Query metrics (p95 latency, error rate)
   - Validate fix deployment → Compare metrics before/after
   - Confirm feature flag works → Check logs for flag evaluation

3. Root Cause Analysis:
   - Production incident → Trace request path, examine logs, review metrics
   - Performance regression → Compare metrics across deployments
   - Cascading failure → Trace dependencies to identify origin

4. Shift-Left Testing:
   - Run tests in staging with observability → Catch issues before production
   - Validate observability instrumentation → Ensure logs/metrics/traces present
   - Test alerting → Verify alerts fire correctly
```

---

## The Three Pillars in Detail

### 1. Logs

**What are logs?**
Discrete events recorded by applications (errors, warnings, info, debug).

**Structured Logging (JSON):**

```javascript
// ❌ Unstructured log (hard to query)
console.log('User login failed for test@example.com');

// ✅ Structured log (easy to query, filter, aggregate)
logger.info({
  event: 'user_login_failed',
  user_email: 'test@example.com',
  ip_address: '192.168.1.100',
  reason: 'invalid_password',
  timestamp: '2025-01-24T10:30:00Z',
  request_id: 'req_abc123',
  user_agent: 'Mozilla/5.0...',
});

// Output:
{
  "level": "info",
  "event": "user_login_failed",
  "user_email": "test@example.com",
  "ip_address": "192.168.1.100",
  "reason": "invalid_password",
  "timestamp": "2025-01-24T10:30:00Z",
  "request_id": "req_abc123",
  "user_agent": "Mozilla/5.0...",
  "service": "auth-service",
  "version": "v2.3.1"
}
```

**Log Levels:**

```
TRACE: Very detailed (function entry/exit)
DEBUG: Developer information (variable values)
INFO:  General informational (user logged in, order placed)
WARN:  Something unexpected but not an error (deprecated API used, retry after failure)
ERROR: Error occurred but service continues (database connection failed, external API timeout)
FATAL: Critical failure, service cannot continue (out of memory, config missing)

Production: INFO, WARN, ERROR, FATAL only (too much DEBUG drowns signals)
Staging: DEBUG, INFO, WARN, ERROR, FATAL (helps with debugging)
Development: All levels including TRACE
```

**Effective Logging for QA:**

```javascript
// ❌ Bad: Not enough context
logger.error('Database error');

// ✅ Good: Rich context for debugging
logger.error({
  event: 'database_query_failed',
  error_message: err.message,
  error_stack: err.stack,
  query: 'SELECT * FROM orders WHERE user_id = ?',
  query_params: [userId],
  query_duration_ms: 8500,
  database: 'postgres-primary',
  connection_pool_size: 20,
  connection_pool_available: 0, // Ah! Pool exhausted
  request_id: requestId,
  user_id: userId,
  endpoint: '/api/orders',
});

// This log tells the full story:
// - What failed: database query
// - Why: connection pool exhausted (0 available)
// - Context: query took 8.5s, which query, which user
// - Correlation: request_id to trace entire request
```

**Querying Logs (Loki/LogQL Example):**

```logql
# Find all ERROR logs in the last hour
{service="api-service"} |= "ERROR" | json

# Find database errors specifically
{service="api-service"}
  | json
  | event="database_query_failed"

# Find slow queries (>5 seconds)
{service="api-service"}
  | json
  | query_duration_ms > 5000

# Find errors for a specific user
{service="api-service"}
  | json
  | user_id="12345"
  | level="error"

# Count errors by reason
sum by (reason) (
  count_over_time(
    {service="api-service"}
    | json
    | level="error" [5m]
  )
)
```

---

### 2. Metrics

**What are metrics?**
Numerical measurements collected over time (counters, gauges, histograms).

**Metric Types:**

```
Counter: Monotonically increasing value (total requests, total errors)
  - Example: http_requests_total{method="GET", status="200"} = 15,234
  - Use: Count events (requests, errors, messages processed)

Gauge: Value that can go up or down (CPU usage, memory, queue size)
  - Example: memory_usage_bytes = 4,294,967,296
  - Use: Current state (active connections, queue depth, temperature)

Histogram: Distribution of values (request duration bucketed)
  - Example: http_request_duration_seconds_bucket{le="0.1"} = 8523
  - Use: Latency percentiles (p50, p95, p99)

Summary: Similar to histogram but calculates quantiles on client side
  - Example: http_request_duration_seconds{quantile="0.95"} = 0.234
  - Use: Pre-calculated percentiles
```

**Instrumenting Application (Prometheus Client):**

```javascript
// Node.js with prom-client
const promClient = require('prom-client');

// Counter: Total HTTP requests
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Histogram: Request duration
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5], // Latency buckets
});

// Gauge: Active connections
const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

// Express middleware to record metrics
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds

    // Increment request counter
    httpRequestsTotal.labels(req.method, req.route?.path || 'unknown', res.statusCode).inc();

    // Record request duration
    httpRequestDuration.labels(req.method, req.route?.path || 'unknown', res.statusCode).observe(duration);
  });

  next();
});

// Endpoint to expose metrics for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Business metrics
const ordersPlaced = new promClient.Counter({
  name: 'orders_placed_total',
  help: 'Total number of orders placed',
  labelNames: ['payment_method', 'status'],
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await createOrder(req.body);

    // Record business metric
    ordersPlaced.labels(order.paymentMethod, 'success').inc();

    res.status(201).json(order);
  } catch (err) {
    ordersPlaced.labels(req.body.paymentMethod, 'failed').inc();
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

**Querying Metrics (PromQL):**

```promql
# Current request rate (requests per second)
rate(http_requests_total[5m])

# Request rate by status code
sum by (status_code) (rate(http_requests_total[5m]))

# Error rate (5xx errors)
sum(rate(http_requests_total{status_code=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))

# p95 latency
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# p99 latency by route
histogram_quantile(0.99,
  sum by (route, le) (rate(http_request_duration_seconds_bucket[5m]))
)

# Requests per minute
rate(http_requests_total[1m]) * 60

# Apdex score (Application Performance Index)
# (satisfied + tolerating/2) / total
# satisfied: <0.5s, tolerating: 0.5-2s, frustrated: >2s
(
  sum(rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
  + sum(rate(http_request_duration_seconds_bucket{le="2"}[5m])) / 2
) / sum(rate(http_request_duration_seconds_count[5m]))
```

**Grafana Dashboard Example:**

```yaml
# Dashboard panel for request rate
panels:
  - title: "Request Rate (req/s)"
    targets:
      - expr: sum(rate(http_requests_total[5m]))
    type: graph

  - title: "Error Rate (%)"
    targets:
      - expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m])) * 100
    type: graph
    alert:
      condition: avg() > 1  # Alert if error rate > 1%

  - title: "p95 Latency"
    targets:
      - expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
          )
    type: graph
    alert:
      condition: avg() > 1  # Alert if p95 > 1s

  - title: "Active Connections"
    targets:
      - expr: active_connections
    type: gauge
```

---

### 3. Distributed Tracing

**What is tracing?**
Following a single request as it flows through multiple services in a distributed system.

**Trace Anatomy:**

```
Trace: End-to-end request journey (e.g., user checkout flow)
  ├─ Span: Single operation within the trace (e.g., "query database")
  │   ├─ Span ID: Unique identifier
  │   ├─ Parent Span ID: Links to calling span
  │   ├─ Start time: When operation started
  │   ├─ Duration: How long it took
  │   ├─ Tags: Metadata (service name, operation, HTTP status)
  │   └─ Logs: Events within the span (errors, warnings)

Example Trace:

Trace ID: abc123 (Total: 2.3s)
│
├─ Span 1: HTTP GET /api/checkout (2.3s) [API Gateway]
│   │
│   ├─ Span 2: auth.validateToken() (0.05s) [Auth Service]
│   │
│   ├─ Span 3: cart.getItems() (0.8s) [Cart Service]
│   │   └─ Span 4: SELECT * FROM cart_items (0.75s) [Database]
│   │       └─ Tags: {query: "SELECT...", db: "postgres"}
│   │
│   ├─ Span 5: inventory.checkAvailability() (0.3s) [Inventory Service]
│   │
│   ├─ Span 6: payment.processCharge() (1.1s) [Payment Service]
│   │   ├─ Span 7: stripe.createCharge() (1.0s) [External API]
│   │   │   └─ Tags: {amount: 99.99, currency: "USD"}
│   │
│   └─ Span 8: orders.create() (0.05s) [Order Service]

Analysis:
- Total duration: 2.3s
- Slowest span: Span 7 (Stripe API, 1.0s) - 43% of total time
- Second slowest: Span 4 (Database query, 0.75s) - 33% of total time
- Optimization target: Stripe API call (can we cache? async process?)
```

**Instrumenting with OpenTelemetry (Node.js):**

```javascript
// Initialize OpenTelemetry
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Create tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'checkout-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.2.3',
  }),
});

// Configure exporter (send traces to Jaeger)
const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});

provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
provider.register();

// Auto-instrument HTTP and Express
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// Manual instrumentation for custom operations
const opentelemetry = require('@opentelemetry/api');
const tracer = opentelemetry.trace.getTracer('checkout-service');

app.post('/api/checkout', async (req, res) => {
  // Create custom span
  const span = tracer.startSpan('checkout.process');

  try {
    // Add attributes (tags) to span
    span.setAttribute('user.id', req.user.id);
    span.setAttribute('cart.items', req.body.items.length);
    span.setAttribute('cart.total', req.body.total);

    // Child span: Validate cart
    const validateSpan = tracer.startSpan('checkout.validateCart', {
      parent: span,
    });
    const validCart = await validateCart(req.body.cartId);
    validateSpan.setAttribute('cart.valid', validCart);
    validateSpan.end();

    if (!validCart) {
      span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: 'Invalid cart' });
      span.end();
      return res.status(400).json({ error: 'Invalid cart' });
    }

    // Child span: Process payment
    const paymentSpan = tracer.startSpan('checkout.processPayment', {
      parent: span,
    });

    try {
      const payment = await processPayment(req.body.paymentMethod, req.body.total);
      paymentSpan.setAttribute('payment.id', payment.id);
      paymentSpan.setAttribute('payment.status', payment.status);
      paymentSpan.end();
    } catch (paymentError) {
      // Record error in span
      paymentSpan.recordException(paymentError);
      paymentSpan.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
      paymentSpan.end();
      throw paymentError;
    }

    // Child span: Create order
    const orderSpan = tracer.startSpan('checkout.createOrder', {
      parent: span,
    });
    const order = await createOrder(req.user.id, req.body.cartId);
    orderSpan.setAttribute('order.id', order.id);
    orderSpan.end();

    span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
    span.end();

    res.status(201).json(order);
  } catch (error) {
    // Record exception in span
    span.recordException(error);
    span.setStatus({
      code: opentelemetry.SpanStatusCode.ERROR,
      message: error.message
    });
    span.end();

    res.status(500).json({ error: 'Checkout failed' });
  }
});
```

**Querying Traces (Jaeger UI):**

```
1. Search by Service:
   - Service: checkout-service
   - Operation: POST /api/checkout
   - Duration: > 2s (find slow requests)

2. Search by Tags:
   - http.status_code = 500 (find errors)
   - user.id = 12345 (find requests for specific user)
   - payment.status = failed (find failed payments)

3. Trace Comparison:
   - Compare slow trace (3s) vs fast trace (0.5s)
   - Identify which span is slower (database? external API?)

4. Dependency Graph:
   - Visualize service dependencies
   - Identify chatty services (too many calls)
```

---

## Setting Up Observability Stack

### Prometheus + Grafana + Loki + Tempo (Docker Compose)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Prometheus: Metrics collection
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  # Grafana: Visualization
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml
    depends_on:
      - prometheus
      - loki
      - tempo

  # Loki: Log aggregation
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
      - loki-data:/loki

  # Tempo: Distributed tracing
  tempo:
    image: grafana/tempo:latest
    ports:
      - "3200:3200"   # Tempo
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    volumes:
      - ./tempo-config.yml:/etc/tempo.yaml
      - tempo-data:/tmp/tempo
    command: ["-config.file=/etc/tempo.yaml"]

  # Promtail: Log shipping (sends logs to Loki)
  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

  # Node Exporter: System metrics
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

volumes:
  prometheus-data:
  grafana-data:
  loki-data:
  tempo-data:
```

**Prometheus Configuration:**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Scrape Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Scrape Node Exporter (system metrics)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Scrape your application
  - job_name: 'api-service'
    static_configs:
      - targets: ['api-service:3000']  # Your app exposes /metrics
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'api-service'
```

**Grafana Data Sources:**

```yaml
# grafana-datasources.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100

  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
```

---

## Using Observability in QA Workflows

### 1. Performance Test Validation

```
Scenario: Running k6 load test

Before Test:
1. Open Grafana dashboard
2. Create dashboard with panels:
   - Request rate (req/s)
   - Error rate (%)
   - p95 latency
   - CPU usage
   - Memory usage
   - Database connections

During Test:
3. Start k6 load test (ramp to 2,000 users)
4. Watch Grafana dashboard in real-time
5. Observe correlations:
   - Request rate increases → CPU usage increases
   - At 1,500 users → p95 latency spikes from 200ms to 2s
   - At 1,800 users → Error rate jumps from 0% to 5%
   - Database connections maxed out (200/200)

After Test:
6. Query Prometheus:
   - What was peak request rate? 1,850 req/s
   - What was peak error rate? 5.2%
   - What was max p95 latency? 2.8s

7. Query traces in Jaeger:
   - Find slow requests (>2s)
   - Identify bottleneck: database query (1.8s out of 2.8s total)

8. Query logs in Loki:
   - Find database connection errors
   - Log: "connection pool exhausted, waiting for available connection"

Conclusion:
Bottleneck is database connection pool (200 connections max)
Fix: Increase pool size to 500 connections
Re-test to validate
```

### 2. Integration Test Debugging

```
Scenario: Integration test fails intermittently (flaky test)

1. Add trace ID to test:
   const traceId = generateTraceId();
   const response = await fetch('/api/checkout', {
     headers: {
       'X-Trace-Id': traceId,  // Pass trace ID
     },
   });

2. When test fails, query by trace ID:
   - Jaeger: Search for trace ID
   - View full request flow

3. Examine trace:
   Trace shows:
   - Checkout took 5.2s total
   - Payment service call took 4.8s (timeout at 5s)
   - Payment service shows retry (3 attempts)
   - Third attempt succeeded, but total >5s, test timed out

4. Query logs for trace ID:
   - Loki: {service="payment-service"} | json | trace_id="abc123"
   - Logs show: "Stripe API timeout, retrying..."

Root Cause:
- External API (Stripe) slow/timing out
- Service retries correctly but exceeds test timeout

Fix:
- Increase test timeout from 5s to 10s (account for retries)
- Or mock external API in integration tests
```

### 3. Production Incident Response

```
Scenario: Production alerts fire (error rate >5%)

1. Grafana alert notification (Slack):
   "🔥 Error rate: 8.2% (threshold: 1%) - api-service"

2. Open Grafana dashboard:
   - Error rate spiked at 10:45 AM
   - Deployment happened at 10:43 AM (correlation!)
   - p95 latency normal (200ms)
   - CPU/memory normal

3. Query logs (Loki):
   {service="api-service"} | json | level="error" | __timestamp__ >= 10:45

   Logs show:
   {
     "event": "database_query_failed",
     "error": "column 'created_at_timestamp' does not exist",
     "query": "SELECT * FROM orders WHERE created_at_timestamp > ?"
   }

4. Query traces (Jaeger):
   - Find traces with errors (http.status_code=500)
   - Trace shows error in database query span

Root Cause:
- Deployment at 10:43 renamed database column (created_at → created_at_timestamp)
- Application code not updated to match

Fix:
- Rollback deployment immediately
- Update application code to use correct column name
- Add database migration test to prevent recurrence
```

---

## Best Practices

### 1. Correlation IDs

```javascript
// Generate correlation ID for every request
const correlationId = require('uuid').v4();

// Add to all logs, metrics, traces
logger.info({
  correlation_id: correlationId,
  event: 'request_received',
  ...
});

// Pass to downstream services
const response = await fetch('https://other-service/api/foo', {
  headers: {
    'X-Correlation-ID': correlationId,
  },
});

// Benefits:
// - Trace request across all services
// - Query logs by correlation ID (see entire journey)
// - Link logs, metrics, traces together
```

### 2. Structured Logging

```javascript
// ❌ Bad: Unstructured
console.log('User login failed');

// ✅ Good: Structured with context
logger.error({
  event: 'user_login_failed',
  user_id: userId,
  ip_address: req.ip,
  reason: 'invalid_password',
  attempt_count: 3,
  correlation_id: correlationId,
  timestamp: new Date().toISOString(),
});
```

### 3. High-Cardinality Tags

```javascript
// ❌ Bad: User ID as metric label (millions of users = millions of time series)
httpRequestsTotal.labels(req.method, req.route, req.user.id).inc();

// ✅ Good: Use low-cardinality labels (method, route, status)
httpRequestsTotal.labels(req.method, req.route, res.statusCode).inc();

// Put high-cardinality data in logs/traces, not metrics
logger.info({
  event: 'http_request',
  user_id: req.user.id,  // OK in logs
  correlation_id: correlationId,
});
```

### 4. Sampling for High Volume

```javascript
// Trace 100% in staging, 1% in production (high volume)
const samplingRate = process.env.NODE_ENV === 'production' ? 0.01 : 1.0;

const provider = new NodeTracerProvider({
  sampler: new TraceIdRatioBasedSampler(samplingRate),
});

// Always trace errors (even if not sampled)
const span = tracer.startSpan('operation');
if (error) {
  span.recordException(error);
  span.setStatus({ code: SpanStatusCode.ERROR });
  // Force sampling for errors
  span.setAttribute('sampling.priority', 1);
}
span.end();
```

---

## What Senior Engineers Know

**Observability is not optional for modern systems.** If you can't see it, you can't debug it.

**Logs alone are not enough.** You need metrics (what's broken?) and traces (where's it broken?).

**Instrument before you need it.** Adding observability during an outage is too late.

**Correlation is key.** Logs + metrics + traces together tell the full story.

**Sample intelligently.** Trace 100% in dev, 1-10% in production, but always trace errors.

**Dashboards save time.** A good dashboard shows the problem in 10 seconds vs 10 minutes of ad-hoc queries.

---

## Exercise

**Build Observability for Test Automation:**

You have an e-commerce API with 5 microservices:
1. API Gateway
2. Auth Service
3. Product Catalog
4. Cart Service
5. Order Service

**Your Tasks:**

1. **Instrument Services:**
   - Add Prometheus metrics (request rate, latency, errors)
   - Add structured logging (JSON, correlation IDs)
   - Add distributed tracing (OpenTelemetry)

2. **Set Up Observability Stack:**
   - Deploy Prometheus, Grafana, Loki, Tempo (Docker Compose)
   - Configure scraping and data sources

3. **Create Dashboards:**
   - Request rate by service
   - Error rate by service
   - p95 latency by endpoint
   - Service dependency graph (from traces)

4. **Run Load Test:**
   - Use k6 to load test checkout flow
   - Monitor dashboard during test
   - Identify bottleneck using traces

5. **Debug Failure:**
   - Inject failure (database timeout)
   - Use observability to identify root cause
   - Time how long it takes to debug with vs without observability

**Deliverable:** Fully instrumented services, observability stack, dashboards, and debugging report.

---

## Next Steps

- Learn [SLO/SLA Validation](03-slo-sla-validation.md) to define reliability targets
- Study [Incident Learning](04-incident-learning.md) for post-mortems
- Master [Reliability Metrics](05-reliability-metrics.md) for SRE practices
- Explore [Performance Bottleneck Analysis](07-performance-bottleneck-analysis.md)
