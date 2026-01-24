# OWASP Top 10 Testing

Testing for the most critical web application security risks. Each vulnerability includes test cases and code examples.

## 1. Broken Access Control

**Test: Insecure Direct Object Reference (IDOR)**
```javascript
// Attempt to access other users' resources by changing IDs
const response = await request(app)
  .get('/api/users/999/profile')  // Try accessing user 999's profile
  .set('Authorization', 'Bearer <user-123-token>')
  .expect(403);  // Should be Forbidden
```

## 2. Cryptographic Failures

**Test: Sensitive Data Transmitted Over HTTP**
```bash
# Check for HTTP instead of HTTPS
curl -I http://example.com/login
# Should redirect to HTTPS or refuse connection
```

**Test: Weak Password Hashing**
```javascript
// Verify bcrypt/Argon2 used, not MD5/SHA1
const hashedPassword = await hashPassword('password123');
expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/);  // bcrypt format
```

## 3. Injection (SQL, NoSQL, Command)

**Test: SQL Injection**
```javascript
const maliciousInput = "' OR '1'='1";
const response = await request(app)
  .post('/api/login')
  .send({ username: maliciousInput, password: 'anything' });

expect(response.status).not.toBe(200);  // Should not bypass authentication
```

**Test: Command Injection**
```javascript
const maliciousFilename = "; rm -rf /";
const response = await request(app)
  .post('/api/convert')
  .send({ filename: maliciousFilename });

expect(response.status).toBe(400);  // Should reject malicious input
```

## 4. Insecure Design

**Test: Business Logic Flaws**
```javascript
// Test: Can user apply discount twice?
await applyDiscount('SAVE20');
const secondAttempt = await applyDiscount('SAVE20');
expect(secondAttempt.error).toContain('already applied');
```

## 5. Security Misconfiguration

**Test: Default Credentials Still Active**
```javascript
const response = await request(app)
  .post('/api/login')
  .send({ username: 'admin', password: 'admin' });

expect(response.status).toBe(401);  // Should not work
```

**Test: Directory Listing Enabled**
```bash
curl http://example.com/.git/
# Should return 404 or 403, not file listing
```

## 6. Vulnerable and Outdated Components

**Test: Dependency Vulnerabilities**
```bash
# Run dependency scanner
npm audit
snyk test

# Fail build if high/critical vulnerabilities found
```

## 7. Identification and Authentication Failures

**Test: Weak Password Policy**
```javascript
const response = await request(app)
  .post('/api/register')
  .send({ email: 'test@example.com', password: '123' });

expect(response.status).toBe(400);
expect(response.body.error).toContain('password too weak');
```

**Test: No Account Lockout**
```javascript
// Attempt 10 failed logins
for (let i = 0; i < 10; i++) {
  await request(app).post('/api/login').send({ username: 'user', password: 'wrong' });
}

// 11th attempt should be locked out
const response = await request(app)
  .post('/api/login')
  .send({ username: 'user', password: 'wrong' });

expect(response.status).toBe(429);  // Too Many Requests
expect(response.body.error).toContain('account locked');
```

## 8. Software and Data Integrity Failures

**Test: Unsigned Code/Updates**
```javascript
// Verify digital signature of updates
const update = await fetchUpdate();
expect(update.signature).toBeDefined();
expect(await verifySignature(update)).toBe(true);
```

## 9. Security Logging and Monitoring Failures

**Test: Security Events Not Logged**
```javascript
await attemptFailedLogin('admin', 'wrongpassword');

const logs = await readSecurityLogs();
expect(logs).toContainEqual(
  expect.objectContaining({
    event: 'failed_login',
    username: 'admin',
  })
);
```

## 10. Server-Side Request Forgery (SSRF)

**Test: SSRF via URL Parameter**
```javascript
// Attempt to access internal services
const maliciousUrl = 'http://169.254.169.254/latest/meta-data/';
const response = await request(app)
  .post('/api/fetch-url')
  .send({ url: maliciousUrl });

expect(response.status).toBe(400);  // Should block internal IPs
```

---

## Automated OWASP Testing with ZAP

```bash
# Run OWASP ZAP automated scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://example.com \
  -r zap-report.html

# Integrate into CI/CD
- name: OWASP ZAP Scan
  run: |
    docker run -t owasp/zap2docker-stable zap-baseline.py \
      -t ${{ env.APP_URL }} \
      -r zap-report.html
    
    # Fail build if high-risk vulnerabilities found
    if grep -q "HIGH" zap-report.html; then
      exit 1
    fi
```

---

## Exercise

Create automated tests for all OWASP Top 10 vulnerabilities for your application.

**Deliverable:** Test suite with 30+ security test cases.

---

## Next Steps

- Learn [Authentication & Authorization Testing](03-authentication-authorization-testing.md)
- Study [Security Automation](05-security-automation.md)
