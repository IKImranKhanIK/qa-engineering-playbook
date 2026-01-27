# API Testing Checklist

## Project Information
- **API Name**:
- **Version**:
- **Environment**:
- **Base URL**:
- **Tester**:
- **Date**:

---

## Authentication & Authorization

- [ ] Test authentication mechanisms (API keys, OAuth, JWT)
- [ ] Verify token expiration and renewal
- [ ] Test unauthorized access attempts
- [ ] Validate role-based access control (RBAC)
- [ ] Test API key rotation
- [ ] Verify CORS policies
- [ ] Test with expired/invalid tokens

## Request Validation

- [ ] Test all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- [ ] Validate required vs optional parameters
- [ ] Test with missing required fields
- [ ] Test with invalid data types
- [ ] Test with boundary values
- [ ] Test with null/empty values
- [ ] Test with special characters
- [ ] Verify input length limits
- [ ] Test SQL injection attempts
- [ ] Test XSS injection attempts

## Response Validation

- [ ] Verify correct HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Validate response schema/structure
- [ ] Check response headers
- [ ] Verify content-type headers
- [ ] Test response data accuracy
- [ ] Validate JSON/XML format
- [ ] Check for sensitive data leakage in responses
- [ ] Verify pagination metadata
- [ ] Test response encoding (UTF-8)

## Error Handling

- [ ] Test with malformed requests
- [ ] Verify error message clarity
- [ ] Check that errors don't expose sensitive info
- [ ] Test rate limiting responses
- [ ] Validate timeout handling
- [ ] Test server error scenarios (500, 503)
- [ ] Verify error response format consistency

## Performance Testing

- [ ] Test response time under normal load
- [ ] Verify response time SLA compliance
- [ ] Test with large payloads
- [ ] Test pagination performance
- [ ] Verify concurrent request handling
- [ ] Test caching mechanisms
- [ ] Monitor database query performance

## Data Integrity

- [ ] Test CRUD operations completeness
- [ ] Verify data persistence
- [ ] Test transaction rollback scenarios
- [ ] Validate data relationships
- [ ] Test data validation rules
- [ ] Verify duplicate prevention
- [ ] Test data type conversions

## Edge Cases

- [ ] Test with maximum payload size
- [ ] Test with minimum valid values
- [ ] Test timezone handling
- [ ] Test date format variations
- [ ] Test with different locales/languages
- [ ] Test with unicode characters
- [ ] Test API versioning

## Integration Testing

- [ ] Test dependencies on other APIs
- [ ] Verify third-party integrations
- [ ] Test database connectivity
- [ ] Validate message queue integration
- [ ] Test cache integration
- [ ] Verify logging functionality

## Security Testing

- [ ] Test for injection vulnerabilities
- [ ] Verify HTTPS enforcement
- [ ] Test encryption of sensitive data
- [ ] Validate input sanitization
- [ ] Test for broken authentication
- [ ] Check for security misconfiguration
- [ ] Verify no sensitive data in URLs
- [ ] Test API rate limiting

## Documentation

- [ ] Verify API documentation accuracy
- [ ] Test all documented endpoints
- [ ] Validate example requests/responses
- [ ] Check for undocumented endpoints
- [ ] Verify parameter descriptions
- [ ] Test code samples from documentation

## Negative Testing

- [ ] Test with unsupported HTTP methods
- [ ] Send requests with missing headers
- [ ] Test with invalid API versions
- [ ] Send oversized payloads
- [ ] Test with invalid content-type
- [ ] Send malformed JSON/XML

---

## Test Results Summary

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|------------|--------|--------|---------|-----------|
| Authentication |  |  |  |  | % |
| Request Validation |  |  |  |  | % |
| Response Validation |  |  |  |  | % |
| Error Handling |  |  |  |  | % |
| Performance |  |  |  |  | % |
| Security |  |  |  |  | % |
| **TOTAL** |  |  |  |  | **%** |

## Critical Issues Found

1.
2.
3.

## Notes & Observations

---

**Test Completion Date**:
**Sign-off**:
