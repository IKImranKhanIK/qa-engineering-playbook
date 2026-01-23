# API Automation Architecture

## Overview

API automation tests verify backend functionality directly without going through the UI. API tests are faster, more reliable, and provide better coverage than UI tests. A well-designed API automation framework is the foundation of an effective testing strategy.

## Why API Testing is Essential

### The Problem with UI-Only Testing

```
UI Test: Complete checkout flow (3 minutes)
- Navigate to product page
- Add to cart
- Go to checkout
- Fill shipping info
- Fill payment info
- Submit order
- Verify confirmation

API Test: Same validation (10 seconds)
POST /api/orders
{
  "userId": 123,
  "items": [{"productId": 456, "quantity": 2}],
  "payment": {...}
}

Verify: Response 201, order created
```

**API tests are:**
- ✅ **30x faster** than UI tests
- ✅ **More reliable** (no UI flakiness)
- ✅ **Better coverage** (can test edge cases easily)
- ✅ **Easier to maintain** (APIs change less than UIs)

### When to Use API vs UI Tests

**Use API Tests For:**
- CRUD operations
- Business logic validation
- Error handling
- Edge cases
- Integration testing
- Performance testing

**Use UI Tests For:**
- Critical user journeys
- Visual validation
- User experience
- Cross-browser compatibility

---

## REST API Testing

### HTTP Methods

| Method | Purpose | Idempotent? | Safe? |
|--------|---------|-------------|-------|
| **GET** | Retrieve data | Yes | Yes |
| **POST** | Create resource | No | No |
| **PUT** | Update/replace resource | Yes | No |
| **PATCH** | Partial update | No* | No |
| **DELETE** | Delete resource | Yes | No |

### Status Codes to Test

**Success (2xx):**
- 200 OK: Successful GET, PUT, PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE

**Client Errors (4xx):**
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing/invalid auth
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource doesn't exist
- 422 Unprocessable Entity: Validation failed

**Server Errors (5xx):**
- 500 Internal Server Error: Server crash
- 503 Service Unavailable: Server overloaded

### API Test Structure (Arrange-Act-Assert)

```javascript
// tests/api/users.test.js
const request = require('supertest');
const app = require('../../app');

describe('Users API', () => {
  describe('POST /api/users', () => {
    it('should create user with valid data', async () => {
      // ARRANGE: Prepare test data
      const newUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePass123!'
      };

      // ACT: Make API request
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      // ASSERT: Verify response
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body).not.toHaveProperty('password'); // Password should not be returned

      // ASSERT: Verify in database
      const user = await db.users.findOne({ email: newUser.email });
      expect(user).toBeDefined();
      expect(user.name).toBe(newUser.name);
    });

    it('should return 400 for invalid email', async () => {
      const invalidUser = {
        email: 'not-an-email',
        name: 'Test User',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    it('should return 409 for duplicate email', async () => {
      // Create user first
      const user = {
        email: 'duplicate@example.com',
        name: 'First User',
        password: 'Pass123!'
      };
      await request(app).post('/api/users').send(user);

      // Attempt duplicate
      const response = await request(app)
        .post('/api/users')
        .send(user)
        .expect(409);

      expect(response.body.error).toContain('already exists');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      // Setup: Create test user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: 'gettest@example.com',
          name: 'Get Test',
          password: 'Pass123!'
        });

      const userId = createResponse.body.id;

      // Test: Get user
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe('gettest@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      expect(response.body.error).toContain('not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user with valid data', async () => {
      // Setup: Create user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: 'updatetest@example.com',
          name: 'Original Name',
          password: 'Pass123!'
        });

      const userId = createResponse.body.id;

      // Update user
      const updateData = { name: 'Updated Name' };
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.email).toBe('updatetest@example.com'); // Unchanged
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      // Setup: Create user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: 'deletetest@example.com',
          name: 'Delete Test',
          password: 'Pass123!'
        });

      const userId = createResponse.body.id;

      // Delete user
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);

      // Verify deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });
});
```

---

## API Client Pattern

### Problem: Duplicated API Calls

```javascript
// Bad: API calls scattered across tests
test('test 1', async () => {
  await request(app).post('/api/users').send({...});
});

test('test 2', async () => {
  await request(app).post('/api/users').send({...});
});

test('test 3', async () => {
  await request(app).post('/api/users').send({...});
});
```

### Solution: API Client Class

```javascript
// api/users-api.js
class UsersAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = request(baseURL);
  }

  async createUser(userData) {
    const response = await this.client
      .post('/api/users')
      .send(userData);
    return response;
  }

  async getUserById(userId) {
    const response = await this.client
      .get(`/api/users/${userId}`);
    return response;
  }

  async updateUser(userId, updateData) {
    const response = await this.client
      .put(`/api/users/${userId}`)
      .send(updateData);
    return response;
  }

  async deleteUser(userId) {
    const response = await this.client
      .delete(`/api/users/${userId}`);
    return response;
  }

  async listUsers(query = {}) {
    const response = await this.client
      .get('/api/users')
      .query(query);
    return response;
  }
}

module.exports = UsersAPI;
```

**Usage in Tests:**

```javascript
const UsersAPI = require('../api/users-api');

describe('Users API Tests', () => {
  let usersAPI;

  beforeAll(() => {
    usersAPI = new UsersAPI('http://localhost:3000');
  });

  it('should create and retrieve user', async () => {
    // Create user
    const createResponse = await usersAPI.createUser({
      email: 'test@example.com',
      name: 'Test User',
      password: 'Pass123!'
    });

    expect(createResponse.status).toBe(201);
    const userId = createResponse.body.id;

    // Retrieve user
    const getResponse = await usersAPI.getUserById(userId);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.email).toBe('test@example.com');
  });
});
```

---

## Authentication Testing

### Bearer Token Authentication

```javascript
class AuthenticatedAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  async login(email, password) {
    const response = await request(this.baseURL)
      .post('/api/login')
      .send({ email, password });

    this.token = response.body.token;
    return response;
  }

  async get(endpoint) {
    return request(this.baseURL)
      .get(endpoint)
      .set('Authorization', `Bearer ${this.token}`);
  }

  async post(endpoint, data) {
    return request(this.baseURL)
      .post(endpoint)
      .set('Authorization', `Bearer ${this.token}`)
      .send(data);
  }
}

// Usage
const api = new AuthenticatedAPI('http://localhost:3000');
await api.login('user@example.com', 'password');
const response = await api.get('/api/profile');
```

### API Key Authentication

```javascript
class APIKeyClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async get(endpoint) {
    return request(this.baseURL)
      .get(endpoint)
      .set('X-API-Key', this.apiKey);
  }
}

// Usage
const api = new APIKeyClient('http://localhost:3000', process.env.API_KEY);
const response = await api.get('/api/data');
```

### OAuth 2.0 Testing

```javascript
class OAuth2Client {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.accessToken = null;
  }

  async getAccessToken() {
    const response = await request(this.baseURL)
      .post('/oauth/token')
      .send({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

    this.accessToken = response.body.access_token;
    return this.accessToken;
  }

  async makeAuthenticatedRequest(endpoint) {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    return request(this.baseURL)
      .get(endpoint)
      .set('Authorization', `Bearer ${this.accessToken}`);
  }
}
```

---

## Testing Different API Types

### REST API (JSON)

```javascript
describe('REST API', () => {
  it('should create order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .send({
        userId: 123,
        items: [
          { productId: 456, quantity: 2, price: 29.99 }
        ],
        total: 59.98
      })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      userId: 123,
      total: 59.98,
      status: 'pending'
    });
  });
});
```

### GraphQL API

```javascript
describe('GraphQL API', () => {
  it('should query user with orders', async () => {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
          orders {
            id
            total
            status
          }
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({
        query,
        variables: { id: '123' }
      })
      .expect(200);

    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.name).toBe('Test User');
    expect(response.body.data.user.orders).toBeInstanceOf(Array);
  });

  it('should handle GraphQL errors', async () => {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({
        query,
        variables: { id: 'invalid' }
      })
      .expect(200); // GraphQL returns 200 even for errors

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('not found');
  });
});
```

### SOAP API (XML)

```javascript
const axios = require('axios');
const xml2js = require('xml2js');

describe('SOAP API', () => {
  it('should call SOAP service', async () => {
    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetUser xmlns="http://example.com/">
            <UserId>123</UserId>
          </GetUser>
        </soap:Body>
      </soap:Envelope>
    `;

    const response = await axios.post(
      'http://localhost:8000/soap',
      soapRequest,
      {
        headers: {
          'Content-Type': 'text/xml',
          'SOAPAction': 'http://example.com/GetUser'
        }
      }
    );

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    expect(result['soap:Envelope']['soap:Body'][0].GetUserResponse).toBeDefined();
  });
});
```

---

## API Test Data Management

### Test Data Builder

```javascript
// builders/user-builder.js
class UserBuilder {
  constructor() {
    this.user = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'DefaultPass123!',
      role: 'user'
    };
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  withRole(role) {
    this.user.role = role;
    return this;
  }

  asAdmin() {
    this.user.role = 'admin';
    return this;
  }

  build() {
    return this.user;
  }

  async create(api) {
    const response = await api.createUser(this.user);
    return response.body;
  }
}

// Usage in tests
it('should allow admin to delete users', async () => {
  const admin = await new UserBuilder()
    .withEmail('admin@test.com')
    .asAdmin()
    .create(usersAPI);

  const regularUser = await new UserBuilder().create(usersAPI);

  // Admin can delete regular user
  const response = await usersAPI.deleteUser(regularUser.id, admin.token);
  expect(response.status).toBe(204);
});
```

### Fixtures

```javascript
// fixtures/test-data.js
module.exports = {
  validUser: {
    email: 'valid@example.com',
    name: 'Valid User',
    password: 'ValidPass123!'
  },

  invalidEmails: [
    'notanemail',
    '@example.com',
    'user@',
    'user@domain',
    'user name@example.com'
  ],

  weakPasswords: [
    '123',
    'password',
    'abc',
    '12345678'
  ],

  validOrder: {
    userId: 1,
    items: [
      { productId: 101, quantity: 2, price: 29.99 },
      { productId: 102, quantity: 1, price: 49.99 }
    ],
    total: 109.97
  }
};

// Usage
const fixtures = require('./fixtures/test-data');

it('should reject invalid emails', async () => {
  for (const email of fixtures.invalidEmails) {
    const response = await usersAPI.createUser({
      ...fixtures.validUser,
      email
    });
    expect(response.status).toBe(400);
  }
});
```

---

## Response Validation

### Schema Validation (JSON Schema)

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const userSchema = {
  type: 'object',
  required: ['id', 'email', 'name', 'createdAt'],
  properties: {
    id: { type: 'integer' },
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 1 },
    role: { type: 'string', enum: ['user', 'admin'] },
    createdAt: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false
};

const validate = ajv.compile(userSchema);

it('should return user matching schema', async () => {
  const response = await usersAPI.getUserById(1);
  const valid = validate(response.body);

  if (!valid) {
    console.log(validate.errors);
  }

  expect(valid).toBe(true);
});
```

### Contract Testing (Pact)

```javascript
// consumer-test.js
const { Pact } = require('@pact-foundation/pact');
const { like, regex } = require('@pact-foundation/pact').Matchers;

describe('User API Contract', () => {
  const provider = new Pact({
    consumer: 'WebApp',
    provider: 'UserService',
    port: 8080
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('should get user by id', async () => {
    await provider.addInteraction({
      state: 'user 123 exists',
      uponReceiving: 'a request for user 123',
      withRequest: {
        method: 'GET',
        path: '/api/users/123'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: 123,
          email: like('user@example.com'),
          name: like('Test User'),
          createdAt: regex(/^\d{4}-\d{2}-\d{2}/, '2025-01-01')
        }
      }
    });

    const response = await request('http://localhost:8080')
      .get('/api/users/123');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(123);
  });
});
```

---

## Error Handling Tests

```javascript
describe('Error Handling', () => {
  it('should handle 400 Bad Request', async () => {
    const response = await usersAPI.createUser({
      // Missing required field
      name: 'Test User'
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('email is required');
  });

  it('should handle 401 Unauthorized', async () => {
    const response = await request(app)
      .get('/api/profile')
      // No auth token
      .expect(401);

    expect(response.body.error).toContain('authentication required');
  });

  it('should handle 403 Forbidden', async () => {
    const regularUser = await createTestUser({ role: 'user' });

    const response = await request(app)
      .delete('/api/users/999')
      .set('Authorization', `Bearer ${regularUser.token}`)
      .expect(403);

    expect(response.body.error).toContain('insufficient permissions');
  });

  it('should handle 404 Not Found', async () => {
    const response = await usersAPI.getUserById(99999);
    expect(response.status).toBe(404);
    expect(response.body.error).toContain('not found');
  });

  it('should handle 422 Validation Error', async () => {
    const response = await usersAPI.createUser({
      email: 'invalid-email',
      name: 'Test',
      password: 'weak'
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        field: 'email',
        message: expect.stringContaining('invalid')
      })
    );
  });

  it('should handle 500 Internal Server Error', async () => {
    // Trigger server error (mock database failure)
    jest.spyOn(db, 'query').mockRejectedValue(new Error('DB Connection failed'));

    const response = await usersAPI.listUsers();
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('internal server error');
  });

  it('should handle 503 Service Unavailable', async () => {
    // Simulate service down
    const response = await request('http://localhost:9999')
      .get('/api/users')
      .catch(err => err);

    expect(response.code).toBe('ECONNREFUSED');
  });
});
```

---

## Performance Testing APIs

### Response Time Testing

```javascript
describe('API Performance', () => {
  it('should respond within 200ms', async () => {
    const start = Date.now();

    await usersAPI.getUserById(1);

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });

  it('should handle concurrent requests', async () => {
    const requests = Array.from({ length: 100 }, (_, i) =>
      usersAPI.getUserById(i + 1)
    );

    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    // All requests succeed
    expect(responses.every(r => r.status === 200)).toBe(true);

    // Completes within 5 seconds
    expect(duration).toBeLessThan(5000);
  });
});
```

---

## Best Practices

### 1. Test at the Right Level

```javascript
// ❌ Bad: Testing validation through API
it('should validate email format', async () => {
  const response = await usersAPI.createUser({ email: 'invalid' });
  expect(response.status).toBe(400);
});

// ✅ Good: Test validation in unit test, test API behavior in API test
// Unit test
expect(validateEmail('invalid')).toBe(false);

// API test
it('should return 400 for invalid input', async () => {
  const response = await usersAPI.createUser({ email: 'invalid' });
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error');
});
```

### 2. Clean Up Test Data

```javascript
describe('Users API', () => {
  const createdUsers = [];

  afterEach(async () => {
    // Clean up created users
    for (const userId of createdUsers) {
      await usersAPI.deleteUser(userId);
    }
    createdUsers.length = 0;
  });

  it('should create user', async () => {
    const response = await usersAPI.createUser({...});
    createdUsers.push(response.body.id);
  });
});
```

### 3. Use Meaningful Test Names

```javascript
// ❌ Bad
it('test 1', () => {});
it('should work', () => {});

// ✅ Good
it('should return 201 when creating user with valid data', () => {});
it('should return 400 when email is invalid', () => {});
it('should return 409 when email already exists', () => {});
```

---

## What Senior Engineers Know

**API tests are the sweet spot.** Faster than UI, more realistic than unit tests. Invest heavily here.

**Test contracts, not implementations.** API contracts (request/response) matter. Internal implementation doesn't.

**Authentication is the hardest part.** Spend time building reusable auth helpers. It pays off.

**Don't test vendor APIs.** Mock external services. Only test YOUR code.

**Schema validation catches regressions.** Use JSON Schema or similar. It catches breaking changes early.

---

## Exercise

**Build API Test Suite:**

Create automated tests for a REST API with endpoints:
- POST /api/users (create user)
- GET /api/users/:id (get user)
- PUT /api/users/:id (update user)
- DELETE /api/users/:id (delete user)
- POST /api/login (authenticate)

**Requirements:**
1. Test happy paths (200/201)
2. Test error cases (400, 404, 409)
3. Test authentication
4. Use API client pattern
5. Clean up test data

---

## Next Steps

- Master [Framework Design Patterns](04-framework-design-patterns.md)
- Learn [Page Object Model](05-page-object-model.md)
- Practice [Flaky Test Prevention](07-flaky-test-prevention.md)
- Integrate with [CI/CD](08-cicd-integration.md)
