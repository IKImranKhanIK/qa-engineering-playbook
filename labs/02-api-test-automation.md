# API Test Automation Lab

## Overview

**Duration:** 3 hours
**Difficulty:** Intermediate
**Category:** Test Automation

Build automated API tests using Postman and Newman. You'll learn to test REST APIs, validate responses, chain requests, and run tests in CI/CD.

## Learning Objectives

- Create API test collections in Postman
- Write assertions for API responses
- Chain API requests using variables
- Run tests from command line with Newman
- Generate test reports

## Prerequisites

- **Postman** installed ([Download here](https://www.postman.com/downloads/))
- **Node.js** installed (for Newman)
- Basic understanding of HTTP methods (GET, POST, PUT, DELETE)
- Basic JSON knowledge

## Lab Setup

We'll use the **Restful Booker API** - a free API for testing:

```
Base URL: https://restful-booker.herokuapp.com
Documentation: https://restful-booker.herokuapp.com/apidoc/index.html
```

### Install Newman

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

## Part 1: Postman Collection Setup (20 minutes)

### Task 1.1: Create New Collection

1. Open Postman
2. Click "New Collection"
3. Name it: "Restful Booker API Tests"
4. Add description: "Automated tests for booking API"

### Task 1.2: Set Collection Variables

Click on your collection → Variables tab

| Variable | Initial Value | Type |
|----------|--------------|------|
| baseUrl | https://restful-booker.herokuapp.com | default |
| token | | default |
| bookingId | | default |

These variables will be used across all requests.

## Part 2: Authentication Testing (30 minutes)

### Task 2.1: Create Auth Request

**Request Details:**
```
Method: POST
URL: {{baseUrl}}/auth
Body (JSON):
{
    "username": "admin",
    "password": "password123"
}
```

### Task 2.2: Add Test Assertions

Click on "Tests" tab and add:

```javascript
// Test 1: Status code is 200
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test 2: Response has token
pm.test("Response contains token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
});

// Test 3: Token is not empty
pm.test("Token is not empty", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.not.be.empty;
});

// Save token to collection variable
var jsonData = pm.response.json();
pm.collectionVariables.set("token", jsonData.token);
console.log("Token saved:", jsonData.token);
```

### Task 2.3: Test Invalid Credentials

**Create another request:**
```
Method: POST
URL: {{baseUrl}}/auth
Body (JSON):
{
    "username": "invalid",
    "password": "wrongpassword"
}
```

**Tests:**
```javascript
pm.test("Status code is 200 even with bad credentials", function () {
    pm.response.to.have.status(200);
});

pm.test("Response indicates bad credentials", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.reason).to.equal("Bad credentials");
});
```

## Part 3: CRUD Operations Testing (60 minutes)

### Task 3.1: CREATE - Create New Booking

**Request:**
```
Method: POST
URL: {{baseUrl}}/booking
Headers:
  Content-Type: application/json
Body:
{
    "firstname": "John",
    "lastname": "Doe",
    "totalprice": 150,
    "depositpaid": true,
    "bookingdates": {
        "checkin": "2024-01-01",
        "checkout": "2024-01-05"
    },
    "additionalneeds": "Breakfast"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Booking created with correct data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.booking.firstname).to.equal("John");
    pm.expect(jsonData.booking.lastname).to.equal("Doe");
    pm.expect(jsonData.booking.totalprice).to.equal(150);
    pm.expect(jsonData.booking.depositpaid).to.be.true;
});

pm.test("Booking ID is returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('bookingid');

    // Save bookingId for later use
    pm.collectionVariables.set("bookingId", jsonData.bookingid);
    console.log("Saved bookingId:", jsonData.bookingid);
});

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

### Task 3.2: READ - Get Booking by ID

**Request:**
```
Method: GET
URL: {{baseUrl}}/booking/{{bookingId}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Booking data matches created booking", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.firstname).to.equal("John");
    pm.expect(jsonData.lastname).to.equal("Doe");
});

pm.test("Response has all required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.all.keys(
        'firstname', 'lastname', 'totalprice',
        'depositpaid', 'bookingdates', 'additionalneeds'
    );
});
```

### Task 3.3: UPDATE - Update Booking

**Request:**
```
Method: PUT
URL: {{baseUrl}}/booking/{{bookingId}}
Headers:
  Content-Type: application/json
  Cookie: token={{token}}
  Accept: application/json
Body:
{
    "firstname": "Jane",
    "lastname": "Smith",
    "totalprice": 200,
    "depositpaid": false,
    "bookingdates": {
        "checkin": "2024-02-01",
        "checkout": "2024-02-10"
    },
    "additionalneeds": "Lunch"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Booking updated successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.firstname).to.equal("Jane");
    pm.expect(jsonData.lastname).to.equal("Smith");
    pm.expect(jsonData.totalprice).to.equal(200);
    pm.expect(jsonData.depositpaid).to.be.false;
});
```

### Task 3.4: DELETE - Delete Booking

**Request:**
```
Method: DELETE
URL: {{baseUrl}}/booking/{{bookingId}}
Headers:
  Cookie: token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 201 (Created)", function () {
    pm.response.to.have.status(201);
});
```

**Verify Deletion:**

Create a follow-up GET request to verify:

```
Method: GET
URL: {{baseUrl}}/booking/{{bookingId}}
```

```javascript
pm.test("Booking no longer exists", function () {
    pm.response.to.have.status(404);
});
```

## Part 4: Advanced Testing (30 minutes)

### Task 4.1: Data-Driven Testing

Create a CSV file (`bookings.csv`):

```csv
firstname,lastname,totalprice,depositpaid
Alice,Johnson,100,true
Bob,Williams,200,false
Charlie,Brown,150,true
```

**In Postman:**
1. Click on collection → Run
2. Select "Data file" → Choose CSV
3. Run tests with multiple data sets

### Task 4.2: Schema Validation

Add JSON schema validation:

```javascript
pm.test("Response matches schema", function () {
    var schema = {
        "type": "object",
        "required": ["firstname", "lastname", "totalprice", "depositpaid", "bookingdates"],
        "properties": {
            "firstname": { "type": "string" },
            "lastname": { "type": "string" },
            "totalprice": { "type": "number" },
            "depositpaid": { "type": "boolean" },
            "bookingdates": {
                "type": "object",
                "required": ["checkin", "checkout"],
                "properties": {
                    "checkin": { "type": "string" },
                    "checkout": { "type": "string" }
                }
            }
        }
    };

    pm.response.to.have.jsonSchema(schema);
});
```

### Task 4.3: Dynamic Variables

Test with dynamic data:

```javascript
// Pre-request Script
pm.collectionVariables.set("randomFirstName", pm.variables.replaceIn('{{$randomFirstName}}'));
pm.collectionVariables.set("randomLastName", pm.variables.replaceIn('{{$randomLastName}}'));
pm.collectionVariables.set("randomPrice", Math.floor(Math.random() * 500) + 50);
```

**Then use in body:**
```json
{
    "firstname": "{{randomFirstName}}",
    "lastname": "{{randomLastName}}",
    "totalprice": {{randomPrice}}
}
```

## Part 5: Newman CLI Integration (20 minutes)

### Task 5.1: Export Collection

1. In Postman, click collection → Export
2. Choose "Collection v2.1"
3. Save as `restful-booker.json`

### Task 5.2: Run with Newman

```bash
# Basic run
newman run restful-booker.json

# With environment
newman run restful-booker.json -e environment.json

# With HTML report
newman run restful-booker.json -r htmlextra --reporter-htmlextra-export report.html

# With custom timeout
newman run restful-booker.json --timeout-request 10000

# Run specific folder
newman run restful-booker.json --folder "CRUD Tests"
```

### Task 5.3: Create npm Script

Create `package.json`:

```json
{
  "name": "api-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "newman run restful-booker.json -r htmlextra --reporter-htmlextra-export reports/test-report.html",
    "test:ci": "newman run restful-booker.json --reporters cli,junit --reporter-junit-export results.xml"
  },
  "devDependencies": {
    "newman": "^6.0.0",
    "newman-reporter-htmlextra": "^1.23.0"
  }
}
```

Run tests:
```bash
npm test
```

## Part 6: CI/CD Integration (20 minutes)

### Task 6.1: GitHub Actions Workflow

Create `.github/workflows/api-tests.yml`:

```yaml
name: API Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Newman
      run: |
        npm install -g newman
        npm install -g newman-reporter-htmlextra

    - name: Run API Tests
      run: newman run restful-booker.json -r htmlextra,cli --reporter-htmlextra-export test-report.html

    - name: Upload Test Report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-report
        path: test-report.html
```

## Deliverables

### Checklist

- [ ] Complete Postman collection with all CRUD operations
- [ ] All tests passing (authentication, create, read, update, delete)
- [ ] Schema validation implemented
- [ ] Newman CLI execution successful
- [ ] HTML report generated
- [ ] CI/CD workflow created

### Export Your Work

1. Export collection
2. Export environment (if used)
3. Save Newman HTML report
4. Screenshot of all tests passing

## Bonus Challenges

1. **Performance Testing:**
   - Add assertions for response times
   - Test API with concurrent requests
   - Implement rate limit testing

2. **Security Testing:**
   - Test without authentication token
   - Try SQL injection in parameters
   - Test with expired token
   - Test for XSS in response

3. **Contract Testing:**
   - Validate API responses against OpenAPI spec
   - Use Postman's contract testing features

4. **Mock Server:**
   - Create a mock server in Postman
   - Test against mock for development

## Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://github.com/postmanlabs/newman)
- [Chai Assertion Library](https://www.chaijs.com/api/bdd/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
