# API Testing

## Overview

API testing validates the functionality, reliability, performance, and security of application programming interfaces. It's critical in modern software where frontend and backend are decoupled and multiple services communicate via APIs.

## Why API Testing Matters

### Business Impact
- APIs are the backbone of modern applications
- Frontend issues often stem from API problems
- API bugs affect multiple clients (web, mobile, partners)
- Early API testing catches issues before UI development

### Technical Advantages
- Faster than UI testing (no browser overhead)
- More stable (no UI flakiness)
- Earlier in development cycle
- Better test coverage for business logic

## Types of APIs

### REST APIs
- HTTP-based, resource-oriented
- Standard methods: GET, POST, PUT, PATCH, DELETE
- Stateless communication
- JSON or XML responses

### GraphQL APIs
- Query language for APIs
- Client specifies exact data needed
- Single endpoint
- Strongly typed schema

### SOAP APIs
- XML-based protocol
- Strict contracts (WSDL)
- Enterprise systems
- Legacy integration

### gRPC
- Protocol buffers
- HTTP/2 based
- High performance
- Microservices communication

## What to Test in APIs

### Functional Testing

**Request Validation:**
- Correct HTTP method accepted
- Required parameters enforced
- Optional parameters handled
- Invalid parameters rejected
- Malformed requests handled gracefully

**Response Validation:**
- Correct HTTP status code
- Response body structure matches spec
- Data types correct
- Required fields present
- Data accuracy and completeness

**Business Logic:**
- Calculations correct
- Workflows execute properly
- State transitions valid
- Business rules enforced

### Example: E-commerce API

**Endpoint:** `POST /api/orders`

**Test Cases:**
```
1. Valid Order Creation
   Input: Valid product, quantity, user
   Expected: 201 Created, order ID returned

2. Invalid Product
   Input: Non-existent product ID
   Expected: 404 Not Found, error message

3. Out of Stock
   Input: Product with 0 inventory
   Expected: 409 Conflict, "Out of stock" message

4. Insufficient Funds
   Input: Order total exceeds user balance
   Expected: 402 Payment Required, error details

5. Missing Required Field
   Input: Order without product_id
   Expected: 400 Bad Request, validation error
```

### Non-Functional Testing

**Performance:**
- Response time under load
- Throughput (requests/second)
- Resource utilization

**Security:**
- Authentication required
- Authorization enforced
- Input sanitization
- No sensitive data in responses
- HTTPS enforced

**Reliability:**
- Error handling
- Timeout behavior
- Retry logic
- Circuit breaker patterns

## HTTP Status Codes

### Success Codes (2xx)
- **200 OK** - Request succeeded
- **201 Created** - Resource created
- **202 Accepted** - Request accepted for processing
- **204 No Content** - Success but no response body

### Client Error Codes (4xx)
- **400 Bad Request** - Invalid request format
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Authenticated but not authorized
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Request conflicts with current state
- **422 Unprocessable Entity** - Validation failed
- **429 Too Many Requests** - Rate limit exceeded

### Server Error Codes (5xx)
- **500 Internal Server Error** - Server-side error
- **502 Bad Gateway** - Upstream service error
- **503 Service Unavailable** - Service temporarily down
- **504 Gateway Timeout** - Upstream service timeout

## API Testing Tools

### Manual Testing
**Postman**
- GUI-based API client
- Collection organization
- Environment variables
- Test scripts (JavaScript)
- Automation via Newman

**cURL**
- Command-line HTTP client
- Scriptable
- Available everywhere
- Great for quick tests

### Automated Testing

**REST Assured (Java)**
```java
given()
    .contentType(ContentType.JSON)
    .body(orderRequest)
.when()
    .post("/api/orders")
.then()
    .statusCode(201)
    .body("id", notNullValue())
    .body("status", equalTo("pending"));
```

**Requests + pytest (Python)**
```python
def test_create_order():
    response = requests.post(
        f"{BASE_URL}/api/orders",
        json={"product_id": 123, "quantity": 2},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 201
    assert "id" in response.json()
    assert response.json()["status"] == "pending"
```

**SuperTest (Node.js)**
```javascript
describe('POST /api/orders', () => {
  it('should create order successfully', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ product_id: 123, quantity: 2 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('pending');
  });
});
```

## Contract Testing

### What is Contract Testing?

Validates that API provider and consumer agree on the API contract.

**Problem:**
- Provider changes API
- Consumer breaks
- Discovered late

**Solution:**
- Provider publishes contract
- Consumer tests against contract
- Provider validates it doesn't break contract

### Tools

**Pact**
- Consumer-driven contracts
- Provider verification
- Multi-language support

**Spring Cloud Contract**
- Producer-driven
- Java/Spring ecosystem
- Generates tests from contracts

### Example Contract (Pact)

**Consumer Side:**
```javascript
const { Pact } = require('@pact-foundation/pact');

describe('Order API Contract', () => {
  const provider = new Pact({
    consumer: 'OrderWebApp',
    provider: 'OrderAPI'
  });

  it('creates an order', async () => {
    await provider.addInteraction({
      state: 'product exists',
      uponReceiving: 'a request to create order',
      withRequest: {
        method: 'POST',
        path: '/api/orders',
        body: { product_id: 123, quantity: 2 }
      },
      willRespondWith: {
        status: 201,
        body: { id: 456, status: 'pending' }
      }
    });

    // Test consumer code
    const order = await createOrder(123, 2);
    expect(order.id).toBe(456);
  });
});
```

**Provider Side:**
```javascript
// Provider verifies it can fulfill consumer contracts
const { Verifier } = require('@pact-foundation/pact');

describe('Pact Verification', () => {
  it('validates the provider', () => {
    return new Verifier({
      provider: 'OrderAPI',
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: ['./pacts/OrderWebApp-OrderAPI.json']
    }).verifyProvider();
  });
});
```

## Authentication Testing

### API Key
```bash
curl -H "X-API-Key: abc123" https://api.example.com/users
```

**Test Cases:**
- Valid key → Success
- Invalid key → 401
- Missing key → 401
- Expired key → 401

### Bearer Token (JWT)
```bash
curl -H "Authorization: Bearer eyJhbGc..." https://api.example.com/users
```

**Test Cases:**
- Valid token → Success
- Invalid token → 401
- Expired token → 401
- Malformed token → 401
- Token for wrong user → 403

### OAuth 2.0
```bash
# Get token
curl -X POST https://api.example.com/oauth/token \
  -d "grant_type=client_credentials" \
  -d "client_id=xxx" \
  -d "client_secret=yyy"

# Use token
curl -H "Authorization: Bearer {token}" https://api.example.com/resource
```

**Test Cases:**
- Full OAuth flow
- Token refresh
- Invalid credentials
- Scope validation

## Response Validation

### Schema Validation

**JSON Schema Example:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "created_at": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "name", "email"]
}
```

**Validation in Tests:**
```python
import jsonschema

def test_user_response_schema():
    response = requests.get(f"{BASE_URL}/api/users/1")

    schema = load_schema("user_schema.json")
    jsonschema.validate(response.json(), schema)
    # Raises exception if validation fails
```

### Data Validation

**Check Relationships:**
```python
def test_order_contains_valid_product():
    order = get_order(123)
    product = get_product(order["product_id"])

    assert product is not None
    assert product["price"] == order["unit_price"]
```

**Check Calculations:**
```python
def test_order_total_calculation():
    order = get_order(123)

    expected_total = (
        order["subtotal"] +
        order["tax"] -
        order["discount"]
    )

    assert order["total"] == expected_total
```

## Pagination Testing

### Offset-Based Pagination
```
GET /api/users?offset=20&limit=10
```

**Test Cases:**
- First page (offset=0)
- Middle page
- Last page
- Beyond last page (empty results)
- Invalid offset (negative)
- Invalid limit (too large, negative)

### Cursor-Based Pagination
```
GET /api/users?cursor=abc123&limit=10
```

**Test Cases:**
- First page (no cursor)
- Following pages using next_cursor
- Invalid cursor
- Expired cursor

### Test All Pages
```python
def test_pagination_coverage():
    all_users = []
    cursor = None

    while True:
        params = {"limit": 10}
        if cursor:
            params["cursor"] = cursor

        response = requests.get(f"{BASE_URL}/api/users", params=params)
        data = response.json()

        all_users.extend(data["users"])

        if not data.get("next_cursor"):
            break
        cursor = data["next_cursor"]

    assert len(all_users) > 0
    # Verify no duplicates
    assert len(all_users) == len(set(u["id"] for u in all_users))
```

## Error Handling Testing

### Standard Error Format

**Good Error Response:**
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Test Error Scenarios

**Validation Errors:**
```python
def test_invalid_email_format():
    response = requests.post(
        f"{BASE_URL}/api/users",
        json={"email": "not-an-email", "name": "Test"}
    )

    assert response.status_code == 400
    assert "error" in response.json()
    assert "email" in response.json()["error"]["details"][0]["field"]
```

**Resource Not Found:**
```python
def test_user_not_found():
    response = requests.get(f"{BASE_URL}/api/users/99999")

    assert response.status_code == 404
    assert "error" in response.json()
```

**Rate Limiting:**
```python
def test_rate_limit():
    # Make many requests
    responses = [
        requests.get(f"{BASE_URL}/api/users")
        for _ in range(100)
    ]

    # At least one should be rate limited
    rate_limited = [r for r in responses if r.status_code == 429]
    assert len(rate_limited) > 0

    # Check Retry-After header
    assert "Retry-After" in rate_limited[0].headers
```

## Performance Testing

### Response Time
```python
import time

def test_api_response_time():
    start = time.time()
    response = requests.get(f"{BASE_URL}/api/users")
    duration = time.time() - start

    assert response.status_code == 200
    assert duration < 0.5  # Must respond within 500ms
```

### Load Testing
```python
import concurrent.futures

def test_concurrent_requests():
    def make_request():
        return requests.get(f"{BASE_URL}/api/users")

    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(make_request) for _ in range(100)]
        responses = [f.result() for f in futures]

    # All requests should succeed
    assert all(r.status_code == 200 for r in responses)

    # Calculate average response time
    times = [r.elapsed.total_seconds() for r in responses]
    avg_time = sum(times) / len(times)
    assert avg_time < 1.0  # Average under 1 second
```

## Common Mistakes

### Testing Implementation, Not Contract
**Wrong:** Test internal database structure
**Right:** Test API response matches documented contract

### Not Testing Error Cases
**Wrong:** Only test happy path
**Right:** Test validation errors, auth failures, edge cases

### Hardcoded Test Data
**Wrong:** Assume user ID 1 exists
**Right:** Create test data, use it, clean up

### No Assertions on Response Body
**Wrong:** Only check status code
**Right:** Validate response structure and data

### Ignoring Response Headers
**Wrong:** Only check body
**Right:** Validate Content-Type, Cache-Control, CORS headers

## What Senior Engineers Know

**APIs are contracts.** Breaking changes affect all consumers. Version APIs properly and deprecate gracefully.

**Status codes matter.** Use correct HTTP status codes. 200 with `{"error": "..."}` in body is wrong.

**API tests are fast.** They should run in seconds, not minutes. If slow, you're doing integration testing, not API testing.

**Test at the right level.** Don't test business logic through APIs. Test business logic in unit tests, test API contracts in API tests.

**Documentation and tests should match.** If API docs say 404 for missing resource, test must verify that. Docs lie less when tests enforce them.

## Exercise

**Scenario: User Management API**

You have a REST API with these endpoints:
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users` - List users (paginated)

**Design test cases for:**
1. Create user (positive and negative cases)
2. Authentication/authorization
3. Pagination
4. Update user (partial vs full)
5. Delete user (including cascade effects)

**Include:**
- HTTP methods
- Request bodies
- Expected status codes
- Response validation

## Next Steps

- Learn [Database Testing](03-database-testing.md)
- Explore [Microservices Testing](04-microservices-testing.md)
- Master [CI/CD Quality Gates](05-cicd-quality-gates.md)
- Practice with [API Testing Lab](../../labs/automation/api-testing-lab.md)
