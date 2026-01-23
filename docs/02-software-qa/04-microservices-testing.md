# Microservices Testing

## Overview

Microservices architecture breaks monolithic applications into small, independent services that communicate over networks. Testing microservices requires new strategies to handle distributed systems, inter-service communication, eventual consistency, and complex failure modes.

## Monolith vs Microservices

### Traditional Monolith

```
┌─────────────────────────────────┐
│       Monolithic Application     │
│                                  │
│  ┌──────────┐  ┌──────────┐    │
│  │   UI     │  │ Business  │    │
│  │  Layer   │─▶│  Logic    │    │
│  └──────────┘  └──────────┘    │
│                      │           │
│                      ▼           │
│              ┌──────────┐        │
│              │ Database │        │
│              └──────────┘        │
└─────────────────────────────────┘
        Single Deployment
```

**Testing:**
- Simple integration tests
- Single database to test
- No network calls in tests
- Easy to debug (single codebase)

### Microservices Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│  Order   │────▶│ Payment  │
│ Service  │     │ Service  │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     ▼                ▼                ▼
┌─────────┐     ┌─────────┐     ┌─────────┐
│ User DB │     │Order DB │     │Payment  │
└─────────┘     └─────────┘     │  DB     │
                                └─────────┘
```

**Testing Challenges:**
- Network communication can fail
- Services deployed independently
- Eventual consistency across services
- Distributed transactions complex
- Harder to debug (logs across services)

---

## Types of Microservices Tests

### Test Pyramid for Microservices

```
           /\
          /E2E\          5% - Full system tests
         /______\
        /        \
       / Contract \     15% - Inter-service contracts
      /____________\
     /              \
    /  Integration   \  30% - Service + dependencies
   /__________________\
  /                    \
 /    Unit Tests        \ 50% - Business logic
/__________________________\
```

---

## 1. Unit Tests (50%)

Test individual service logic in isolation.

**Example: Order Service Unit Test**

```javascript
// order-service.js
class OrderService {
  constructor(paymentClient, inventoryClient) {
    this.paymentClient = paymentClient;
    this.inventoryClient = inventoryClient;
  }

  async calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  validateOrder(order) {
    if (!order.items || order.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    for (const item of order.items) {
      if (item.quantity <= 0) {
        throw new Error('Item quantity must be positive');
      }
      if (item.price < 0) {
        throw new Error('Item price cannot be negative');
      }
    }

    return true;
  }
}

module.exports = OrderService;
```

```javascript
// order-service.test.js
const OrderService = require('./order-service');

describe('OrderService', () => {
  let orderService;

  beforeEach(() => {
    // No real dependencies - pure unit test
    orderService = new OrderService(null, null);
  });

  describe('calculateTotal', () => {
    it('should calculate total for single item', async () => {
      const items = [{ price: 10.00, quantity: 2 }];
      const total = await orderService.calculateTotal(items);
      expect(total).toBe(20.00);
    });

    it('should calculate total for multiple items', async () => {
      const items = [
        { price: 10.00, quantity: 2 },
        { price: 5.00, quantity: 3 }
      ];
      const total = await orderService.calculateTotal(items);
      expect(total).toBe(35.00);
    });

    it('should return 0 for empty items', async () => {
      const total = await orderService.calculateTotal([]);
      expect(total).toBe(0);
    });
  });

  describe('validateOrder', () => {
    it('should throw error for empty order', () => {
      const order = { items: [] };
      expect(() => orderService.validateOrder(order))
        .toThrow('Order must have at least one item');
    });

    it('should throw error for negative quantity', () => {
      const order = {
        items: [{ price: 10, quantity: -1 }]
      };
      expect(() => orderService.validateOrder(order))
        .toThrow('Item quantity must be positive');
    });

    it('should validate correct order', () => {
      const order = {
        items: [{ price: 10, quantity: 2 }]
      };
      expect(orderService.validateOrder(order)).toBe(true);
    });
  });
});
```

---

## 2. Integration Tests (30%)

Test service with its direct dependencies (database, cache, message queue).

**Example: Order Service with Database**

```javascript
// order-repository.test.js
const OrderRepository = require('./order-repository');
const { setupTestDatabase, cleanupTestDatabase } = require('./test-helpers');

describe('OrderRepository Integration Tests', () => {
  let db;
  let orderRepo;

  beforeAll(async () => {
    db = await setupTestDatabase();
    orderRepo = new OrderRepository(db);
  });

  afterAll(async () => {
    await cleanupTestDatabase(db);
  });

  beforeEach(async () => {
    await db.query('TRUNCATE TABLE orders, order_items');
  });

  it('should save order to database', async () => {
    const order = {
      userId: 1,
      items: [
        { productId: 101, quantity: 2, price: 10.00 },
        { productId: 102, quantity: 1, price: 25.00 }
      ],
      total: 45.00,
      status: 'pending'
    };

    const savedOrder = await orderRepo.save(order);

    expect(savedOrder.id).toBeDefined();
    expect(savedOrder.userId).toBe(1);
    expect(savedOrder.total).toBe(45.00);
    expect(savedOrder.status).toBe('pending');

    // Verify in database
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [savedOrder.id]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].user_id).toBe(1);

    // Verify order items
    const itemsResult = await db.query('SELECT * FROM order_items WHERE order_id = $1', [savedOrder.id]);
    expect(itemsResult.rows.length).toBe(2);
  });

  it('should retrieve order by id', async () => {
    // Setup: Insert test order
    const result = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
      [1, 50.00, 'completed']
    );
    const orderId = result.rows[0].id;

    // Test
    const order = await orderRepo.findById(orderId);

    expect(order).toBeDefined();
    expect(order.id).toBe(orderId);
    expect(order.userId).toBe(1);
    expect(order.total).toBe(50.00);
    expect(order.status).toBe('completed');
  });

  it('should update order status', async () => {
    // Setup
    const result = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
      [1, 30.00, 'pending']
    );
    const orderId = result.rows[0].id;

    // Test
    await orderRepo.updateStatus(orderId, 'shipped');

    // Verify
    const order = await orderRepo.findById(orderId);
    expect(order.status).toBe('shipped');
  });
});
```

**Testing with Message Queues (RabbitMQ/Kafka):**

```javascript
// order-events.test.js
const OrderEventPublisher = require('./order-event-publisher');
const { setupRabbitMQ, cleanupRabbitMQ } = require('./test-helpers');

describe('Order Event Publisher Integration Tests', () => {
  let rabbitMQ;
  let publisher;

  beforeAll(async () => {
    rabbitMQ = await setupRabbitMQ();
    publisher = new OrderEventPublisher(rabbitMQ);
  });

  afterAll(async () => {
    await cleanupRabbitMQ(rabbitMQ);
  });

  it('should publish order.created event', async () => {
    const order = {
      id: 123,
      userId: 1,
      total: 50.00,
      status: 'pending'
    };

    // Publish event
    await publisher.publishOrderCreated(order);

    // Consume event to verify
    const receivedEvent = await new Promise((resolve) => {
      rabbitMQ.consume('order.created', (msg) => {
        resolve(JSON.parse(msg.content.toString()));
      });
    });

    expect(receivedEvent.orderId).toBe(123);
    expect(receivedEvent.userId).toBe(1);
    expect(receivedEvent.total).toBe(50.00);
  });
});
```

---

## 3. Contract Tests (15%)

Test inter-service contracts to prevent breaking changes.

**Consumer-Driven Contract Testing (Pact):**

### Consumer Side (Order Service)

```javascript
// order-service-pact.test.js
const { Pact } = require('@pact-foundation/pact');
const { like, regex } = require('@pact-foundation/pact').Matchers;
const PaymentClient = require('./payment-client');

describe('Order Service -> Payment Service Contract', () => {
  const provider = new Pact({
    consumer: 'OrderService',
    provider: 'PaymentService',
    port: 8080,
    log: './logs/pact.log',
    dir: './pacts',
    logLevel: 'info'
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('process payment', () => {
    beforeEach(() => {
      const expectedRequest = {
        orderId: 123,
        amount: 50.00,
        currency: 'USD',
        method: 'credit_card'
      };

      const expectedResponse = {
        transactionId: like('txn_123abc'),
        status: 'success',
        amount: 50.00,
        timestamp: regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, '2025-01-01T12:00:00')
      };

      return provider.addInteraction({
        state: 'payment can be processed',
        uponReceiving: 'a request to process payment',
        withRequest: {
          method: 'POST',
          path: '/api/payments',
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedRequest
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });
    });

    it('should process payment successfully', async () => {
      const client = new PaymentClient('http://localhost:8080');

      const response = await client.processPayment({
        orderId: 123,
        amount: 50.00,
        currency: 'USD',
        method: 'credit_card'
      });

      expect(response.status).toBe('success');
      expect(response.amount).toBe(50.00);
      expect(response.transactionId).toBeDefined();
    });
  });

  describe('insufficient funds', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'payment fails due to insufficient funds',
        uponReceiving: 'a request to process payment with insufficient funds',
        withRequest: {
          method: 'POST',
          path: '/api/payments',
          body: {
            orderId: 124,
            amount: 1000.00,
            currency: 'USD',
            method: 'credit_card'
          }
        },
        willRespondWith: {
          status: 402,
          body: {
            error: 'insufficient_funds',
            message: 'Card has insufficient funds'
          }
        }
      });
    });

    it('should handle insufficient funds error', async () => {
      const client = new PaymentClient('http://localhost:8080');

      await expect(
        client.processPayment({
          orderId: 124,
          amount: 1000.00,
          currency: 'USD',
          method: 'credit_card'
        })
      ).rejects.toThrow('insufficient_funds');
    });
  });
});
```

### Provider Side (Payment Service)

```javascript
// payment-service-pact.test.js
const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const server = require('./server');

describe('Payment Service Contract Verification', () => {
  let app;

  beforeAll(async () => {
    app = await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should validate the expectations of OrderService', () => {
    return new Verifier({
      provider: 'PaymentService',
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [
        path.resolve(__dirname, '../pacts/orderservice-paymentservice.json')
      ],
      stateHandlers: {
        'payment can be processed': () => {
          // Setup: Ensure test data exists
          return Promise.resolve('Ready for payment processing');
        },
        'payment fails due to insufficient funds': () => {
          // Setup: Configure to return insufficient funds
          return Promise.resolve('Configured for insufficient funds');
        }
      }
    }).verifyProvider();
  });
});
```

**Benefits of Contract Testing:**
- ✅ Catches breaking API changes early
- ✅ Enables independent service development
- ✅ Documents service contracts
- ✅ Prevents integration failures

---

## 4. End-to-End Tests (5%)

Test complete user journeys across all services.

**Example: E2E Order Flow**

```javascript
// e2e/order-flow.test.js
const request = require('supertest');
const { setupE2EEnvironment, teardownE2EEnvironment } = require('./helpers');

describe('E2E: Complete Order Flow', () => {
  let environment;
  let authToken;

  beforeAll(async () => {
    // Start all services (user, order, payment, inventory)
    environment = await setupE2EEnvironment();
  });

  afterAll(async () => {
    await teardownE2EEnvironment(environment);
  });

  it('should complete full order lifecycle', async () => {
    // Step 1: User Registration
    const registerRes = await request(environment.userService)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
      .expect(201);

    const userId = registerRes.body.id;

    // Step 2: User Login
    const loginRes = await request(environment.userService)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
      .expect(200);

    authToken = loginRes.body.token;

    // Step 3: Check Product Inventory
    const inventoryRes = await request(environment.inventoryService)
      .get('/api/products/101')
      .expect(200);

    expect(inventoryRes.body.stock).toBeGreaterThan(0);
    const initialStock = inventoryRes.body.stock;

    // Step 4: Create Order
    const orderRes = await request(environment.orderService)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [
          { productId: 101, quantity: 2, price: 10.00 }
        ]
      })
      .expect(201);

    const orderId = orderRes.body.id;
    expect(orderRes.body.status).toBe('pending');
    expect(orderRes.body.total).toBe(20.00);

    // Step 5: Process Payment
    const paymentRes = await request(environment.paymentService)
      .post('/api/payments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        orderId: orderId,
        amount: 20.00,
        method: 'credit_card',
        cardNumber: '4111111111111111',
        cvv: '123',
        expiry: '12/26'
      })
      .expect(200);

    expect(paymentRes.body.status).toBe('success');

    // Step 6: Verify Order Status Updated
    const updatedOrderRes = await request(environment.orderService)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(updatedOrderRes.body.status).toBe('paid');

    // Step 7: Verify Inventory Reduced
    const updatedInventoryRes = await request(environment.inventoryService)
      .get('/api/products/101')
      .expect(200);

    expect(updatedInventoryRes.body.stock).toBe(initialStock - 2);

    // Step 8: Verify User Order History
    const orderHistoryRes = await request(environment.orderService)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(orderHistoryRes.body.orders).toHaveLength(1);
    expect(orderHistoryRes.body.orders[0].id).toBe(orderId);
  });
});
```

---

## Testing Microservices Challenges

### 1. Service Discovery

**Problem:** Services need to find each other dynamically.

**Test Strategy:**

```javascript
// Mock service registry
class MockServiceRegistry {
  constructor() {
    this.services = new Map();
  }

  register(serviceName, url) {
    this.services.set(serviceName, url);
  }

  discover(serviceName) {
    return this.services.get(serviceName);
  }
}

// Test
describe('Service Discovery', () => {
  it('should discover payment service', () => {
    const registry = new MockServiceRegistry();
    registry.register('payment-service', 'http://localhost:3001');

    const url = registry.discover('payment-service');

    expect(url).toBe('http://localhost:3001');
  });
});
```

### 2. Eventual Consistency

**Problem:** Data not immediately consistent across services.

**Test Strategy:**

```javascript
// Poll until consistent
async function waitForConsistency(checkFn, timeout = 5000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await checkFn()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  throw new Error('Consistency timeout');
}

// Test
it('should eventually sync order status', async () => {
  // Create order in order service
  const order = await orderService.createOrder({ userId: 1, total: 50 });

  // Wait for event propagation to analytics service
  await waitForConsistency(async () => {
    const analytics = await analyticsService.getOrderStats(1);
    return analytics.totalOrders === 1;
  });

  const analytics = await analyticsService.getOrderStats(1);
  expect(analytics.totalOrders).toBe(1);
  expect(analytics.totalSpent).toBe(50);
});
```

### 3. Network Failures

**Problem:** Services can't reach each other.

**Test Strategy:**

```javascript
// Test with network failures (using Toxiproxy or similar)
const Toxiproxy = require('toxiproxy-node-client');

describe('Network Resilience', () => {
  let proxy;

  beforeAll(async () => {
    proxy = new Toxiproxy('http://localhost:8474');
    await proxy.createProxy({
      name: 'payment-service',
      listen: '0.0.0.0:18001',
      upstream: 'localhost:3001'
    });
  });

  it('should handle payment service timeout', async () => {
    // Inject latency
    await proxy.addToxic('payment-service', {
      type: 'latency',
      attributes: { latency: 5000 }
    });

    // Order service should timeout gracefully
    const orderService = new OrderService('http://localhost:18001');

    await expect(
      orderService.createOrder({ userId: 1, total: 50 })
    ).rejects.toThrow('Payment service timeout');
  });

  it('should handle payment service connection refused', async () => {
    // Simulate service down
    await proxy.delete('payment-service');

    const orderService = new OrderService('http://localhost:18001');

    await expect(
      orderService.createOrder({ userId: 1, total: 50 })
    ).rejects.toThrow('Payment service unavailable');
  });
});
```

### 4. Distributed Transactions

**Problem:** Transactions span multiple services.

**Test Strategy: Saga Pattern**

```javascript
// Order Saga orchestrates distributed transaction
class OrderSaga {
  async execute(order) {
    let inventoryReserved = false;
    let paymentProcessed = false;

    try {
      // Step 1: Reserve inventory
      await inventoryService.reserve(order.items);
      inventoryReserved = true;

      // Step 2: Process payment
      await paymentService.charge(order.total);
      paymentProcessed = true;

      // Step 3: Confirm order
      await orderService.confirm(order.id);

      return { success: true };
    } catch (error) {
      // Compensating transactions (rollback)
      if (paymentProcessed) {
        await paymentService.refund(order.total);
      }
      if (inventoryReserved) {
        await inventoryService.release(order.items);
      }

      return { success: false, error };
    }
  }
}

// Test
describe('Order Saga', () => {
  it('should complete successful transaction', async () => {
    const saga = new OrderSaga();
    const order = { id: 1, items: [{ id: 101, qty: 2 }], total: 50 };

    const result = await saga.execute(order);

    expect(result.success).toBe(true);
    expect(await inventoryService.isReserved(order.items)).toBe(true);
    expect(await paymentService.isCharged(order.id)).toBe(true);
    expect(await orderService.isConfirmed(order.id)).toBe(true);
  });

  it('should rollback on payment failure', async () => {
    // Mock payment failure
    jest.spyOn(paymentService, 'charge').mockRejectedValue(new Error('Card declined'));

    const saga = new OrderSaga();
    const order = { id: 2, items: [{ id: 102, qty: 1 }], total: 30 };

    const result = await saga.execute(order);

    expect(result.success).toBe(false);
    // Verify rollback
    expect(await inventoryService.isReserved(order.items)).toBe(false);
    expect(await paymentService.isCharged(order.id)).toBe(false);
    expect(await orderService.isConfirmed(order.id)).toBe(false);
  });
});
```

---

## Microservices Testing Tools

| Tool | Purpose | Use Case |
|------|---------|----------|
| **Pact** | Contract testing | Consumer-driven contracts |
| **Testcontainers** | Integration testing | Real dependencies (DB, Redis, etc.) |
| **WireMock** | Service mocking | Stub external APIs |
| **Toxiproxy** | Chaos engineering | Network failures, latency |
| **Docker Compose** | Local environment | Run all services locally |
| **K6** | Load testing | Test under load |
| **OpenTracing** | Distributed tracing | Debug across services |

---

## Best Practices

### 1. Test Isolation

**Each service should be testable independently:**

```javascript
// Good: Mock external dependencies
class OrderService {
  constructor(paymentClient, inventoryClient) {
    this.paymentClient = paymentClient;
    this.inventoryClient = inventoryClient;
  }

  async createOrder(order) {
    // Can easily mock paymentClient and inventoryClient in tests
    const payment = await this.paymentClient.charge(order.total);
    const inventory = await this.inventoryClient.reserve(order.items);
    // ...
  }
}

// Test with mocks
test('createOrder', async () => {
  const mockPayment = { charge: jest.fn().mockResolvedValue({ success: true }) };
  const mockInventory = { reserve: jest.fn().mockResolvedValue({ success: true }) };

  const service = new OrderService(mockPayment, mockInventory);
  await service.createOrder({ total: 50, items: [] });

  expect(mockPayment.charge).toHaveBeenCalledWith(50);
});
```

### 2. Use Test Doubles

**Types:**
- **Stub**: Returns canned responses
- **Mock**: Verifies interactions
- **Fake**: Working implementation (e.g., in-memory database)
- **Spy**: Records calls

```javascript
// Stub: Simple canned response
const paymentStub = {
  charge: () => Promise.resolve({ success: true })
};

// Mock: Verify interactions
const paymentMock = {
  charge: jest.fn().mockResolvedValue({ success: true })
};

// Verify
expect(paymentMock.charge).toHaveBeenCalledTimes(1);
expect(paymentMock.charge).toHaveBeenCalledWith(50.00);
```

### 3. Test Data Management

**Use Testcontainers for real databases:**

```javascript
const { GenericContainer } = require('testcontainers');

describe('Database Integration Tests', () => {
  let postgresContainer;
  let db;

  beforeAll(async () => {
    postgresContainer = await new GenericContainer('postgres:14')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_PASSWORD', 'test')
      .start();

    const port = postgresContainer.getMappedPort(5432);
    db = await connectToDatabase(`postgres://postgres:test@localhost:${port}/test`);
  });

  afterAll(async () => {
    await db.close();
    await postgresContainer.stop();
  });

  // Tests use real PostgreSQL instance
});
```

### 4. Versioning APIs

**Test multiple API versions:**

```javascript
describe('API Versioning', () => {
  it('should support v1 API', async () => {
    const res = await request(app)
      .get('/api/v1/orders/123')
      .expect(200);

    expect(res.body).toHaveProperty('orderId');
  });

  it('should support v2 API with enhanced response', async () => {
    const res = await request(app)
      .get('/api/v2/orders/123')
      .expect(200);

    expect(res.body).toHaveProperty('orderId');
    expect(res.body).toHaveProperty('items');  // New in v2
    expect(res.body).toHaveProperty('tracking');  // New in v2
  });
});
```

---

## Common Mistakes

### Mistake 1: Testing Everything E2E
**Problem:** E2E tests slow, flaky, expensive

**Fix:** Follow test pyramid - most tests should be unit/integration

### Mistake 2: Not Testing Failure Modes
**Problem:** Tests only happy path, miss resilience issues

**Fix:** Test timeouts, retries, circuit breakers, fallbacks

### Mistake 3: Shared Test Database
**Problem:** Tests interfere with each other

**Fix:** Each test gets isolated database (Testcontainers)

### Mistake 4: Ignoring Contract Tests
**Problem:** Services break each other in production

**Fix:** Use Pact or similar for contract testing

---

## What Senior Engineers Know

**Microservices are a distributed system.** All distributed system problems apply: network failures, consistency, observability.

**Test for failure, not just success.** Services will fail. Test circuit breakers, retries, timeouts, fallbacks.

**Contract tests prevent breaking changes.** More valuable than E2E tests. Faster, cheaper, catch issues earlier.

**Observability is critical.** Logs across services, distributed tracing (Jaeger, Zipkin), metrics (Prometheus).

**Start with a monolith.** Don't build microservices until you have the scale and team to justify the complexity.

---

## Exercise

**Design Tests for an E-Commerce Microservices System:**

**Services:**
1. User Service (authentication)
2. Product Service (catalog)
3. Inventory Service (stock)
4. Order Service (orders)
5. Payment Service (payments)
6. Notification Service (emails)

**Your Task:**

1. Design unit tests for Order Service
2. Design integration tests for Order Service + Database
3. Design contract tests between Order and Payment services
4. Design E2E test for complete checkout flow
5. Design chaos test for payment service failure

**Deliverable:** Test plan with test cases for each level.

---

## Next Steps

- Master [CI/CD Quality Gates](05-cicd-quality-gates.md) for automated testing
- Learn [Exploratory Testing](06-exploratory-testing.md) for finding edge cases
- Study [Performance Testing](../04-performance-reliability/01-performance-testing-fundamentals.md) at scale
