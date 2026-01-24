# Authentication & Authorization Testing

## Authentication Testing

### Password Security

**Test: Password Strength Enforcement**
```javascript
describe('Password Policy', () => {
  it('should enforce minimum 8 characters', async () => {
    const response = await register({ password: 'short' });
    expect(response.status).toBe(400);
  });

  it('should require uppercase, lowercase, number, special char', async () => {
    const weakPasswords = ['alllowercase', 'ALLUPPERCASE', 'NoNumbers!', 'NoSpecial123'];
    
    for (const password of weakPasswords) {
      const response = await register({ password });
      expect(response.status).toBe(400);
    }
  });
});
```

### Session Management

**Test: Session Timeout**
```javascript
const { token } = await login('user@example.com', 'password');

// Wait 31 minutes (session timeout: 30 min)
await sleep(31 * 60 * 1000);

const response = await request(app)
  .get('/api/profile')
  .set('Authorization', `Bearer ${token}`)
  .expect(401);  // Session expired

expect(response.body.error).toContain('session expired');
```

**Test: Session Invalidation on Logout**
```javascript
const { token } = await login('user@example.com', 'password');

// Logout
await request(app).post('/api/logout').set('Authorization', `Bearer ${token}`);

// Try using old token
const response = await request(app)
  .get('/api/profile')
  .set('Authorization', `Bearer ${token}`)
  .expect(401);
```

### Multi-Factor Authentication (MFA)

**Test: MFA Required for Sensitive Actions**
```javascript
// Login with username/password only
const { token } = await login('user@example.com', 'password');

// Attempt sensitive action without MFA
const response = await request(app)
  .post('/api/account/delete')
  .set('Authorization', `Bearer ${token}`)
  .expect(403);

expect(response.body.error).toContain('MFA required');

// Complete MFA challenge
const mfaToken = await completeMFA(token, '123456');

// Now action should succeed
await request(app)
  .post('/api/account/delete')
  .set('Authorization', `Bearer ${mfaToken}`)
  .expect(200);
```

---

## Authorization Testing

### Role-Based Access Control (RBAC)

**Test: Admin-Only Endpoints**
```javascript
describe('RBAC', () => {
  it('should prevent regular users from accessing admin endpoints', async () => {
    const userToken = await loginAs('user', 'user-role');
    
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
    
    expect(response.body.error).toContain('admin privileges required');
  });

  it('should allow admins to access admin endpoints', async () => {
    const adminToken = await loginAs('admin', 'admin-role');
    
    await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
```

### Horizontal Privilege Escalation

**Test: Users Cannot Access Other Users' Resources**
```javascript
const alice = await loginAs('alice@example.com');
const bob = await loginAs('bob@example.com');

// Alice creates an order
const aliceOrder = await createOrder(alice.token, { product: 'Laptop' });

// Bob tries to access Alice's order
const response = await request(app)
  .get(`/api/orders/${aliceOrder.id}`)
  .set('Authorization', `Bearer ${bob.token}`)
  .expect(403);
```

### Vertical Privilege Escalation

**Test: Users Cannot Modify Their Own Roles**
```javascript
const userToken = await loginAs('user@example.com', 'user-role');

const response = await request(app)
  .patch('/api/users/me')
  .set('Authorization', `Bearer ${userToken}`)
  .send({ role: 'admin' })  // Attempt to elevate privileges
  .expect(403);

expect(response.body.error).toContain('cannot modify own role');
```

---

## OAuth 2.0 / OpenID Connect Testing

**Test: Invalid Redirect URI**
```javascript
// Attacker tries to use their own redirect_uri
const response = await request(app)
  .get('/oauth/authorize')
  .query({
    client_id: 'valid-client',
    redirect_uri: 'https://attacker.com/callback',  // Malicious redirect
    response_type: 'code',
  });

expect(response.status).toBe(400);
expect(response.body.error).toBe('invalid_request');
```

**Test: Authorization Code Replay**
```javascript
const authCode = await getAuthorizationCode();

// Exchange code for token (first time)
const token1 = await exchangeCodeForToken(authCode);
expect(token1).toBeDefined();

// Try reusing the same code (should fail)
await expect(exchangeCodeForToken(authCode)).rejects.toThrow('code already used');
```

---

## JWT Security Testing

**Test: Unsigned JWT Rejected**
```javascript
const unsignedToken = jwt.sign({ userId: 123 }, '', { algorithm: 'none' });

const response = await request(app)
  .get('/api/profile')
  .set('Authorization', `Bearer ${unsignedToken}`)
  .expect(401);
```

**Test: Expired JWT Rejected**
```javascript
const expiredToken = jwt.sign(
  { userId: 123, exp: Math.floor(Date.now() / 1000) - 3600 },  // Expired 1 hour ago
  secret
);

const response = await request(app)
  .get('/api/profile')
  .set('Authorization', `Bearer ${expiredToken}`)
  .expect(401);

expect(response.body.error).toContain('token expired');
```

**Test: JWT Algorithm Confusion**
```javascript
// Try to use HMAC with RSA public key (algorithm confusion attack)
const maliciousToken = jwt.sign({ userId: 123, role: 'admin' }, rsaPublicKey, { algorithm: 'HS256' });

const response = await request(app)
  .get('/api/admin/users')
  .set('Authorization', `Bearer ${maliciousToken}`)
  .expect(401);
```

---

## Best Practices

**1. Never trust client-side validation:**
```
❌ Client validates role, server trusts it
✅ Server always validates permissions
```

**2. Use secure session storage:**
```
✅ HttpOnly cookies (prevent XSS)
✅ Secure flag (HTTPS only)
✅ SameSite=Strict (prevent CSRF)
```

**3. Implement defense in depth:**
```
✅ Authentication (who you are)
✅ Authorization (what you can do)
✅ Rate limiting (prevent brute force)
✅ Logging (detect attacks)
```

---

## Exercise

**Build Auth Test Suite:**

Create comprehensive test suite covering:
1. Password policy enforcement
2. Session management
3. MFA flows
4. RBAC (3 roles: user, moderator, admin)
5. OAuth 2.0 flow
6. JWT security

**Deliverable:** 50+ auth/authz test cases.

---

## Next Steps

- Study [Privacy Test Cases (GDPR)](04-privacy-test-cases-gdpr.md)
- Learn [Security Automation](05-security-automation.md)
