# QA's Role in Security

## Overview

Security is everyone's responsibility, but QA has a unique role: validating that security controls actually work. This lesson covers security testing fundamentals, threat modeling, and shift-left security practices.

---

## Security Testing Types

```
1. Static Application Security Testing (SAST)
   - Analyzes source code for vulnerabilities
   - Runs during development/CI
   - Examples: SonarQube, Semgrep

2. Dynamic Application Security Testing (DAST)  
   - Tests running application
   - Simulates attacks
   - Examples: OWASP ZAP, Burp Suite

3. Interactive Application Security Testing (IAST)
   - Combines SAST + DAST
   - Runtime code analysis
   - Examples: Contrast Security, Checkmarx

4. Software Composition Analysis (SCA)
   - Scans dependencies for vulnerabilities
   - Examples: Snyk, npm audit, Dependabot

5. Penetration Testing (Pentest)
   - Manual security testing by experts
   - Simulates real attacks
   - Annual or before major releases
```

---

## Threat Modeling

```
STRIDE Framework:

S - Spoofing (impersonating users/systems)
T - Tampering (modifying data)
R - Repudiation (denying actions)
I - Information Disclosure (data leaks)
D - Denial of Service (unavailability)
E - Elevation of Privilege (gaining admin access)

Example Threat Model:

Feature: User Login

Threats:
- Spoofing: Attacker brute-forces password
  → Mitigation: Rate limiting, account lockout
  → Test: Verify lockout after 5 failed attempts

- Information Disclosure: Password visible in logs
  → Mitigation: Never log sensitive data
  → Test: Grep logs for password patterns

- Elevation of Privilege: SQL injection in login form
  → Mitigation: Parameterized queries
  → Test: Attempt SQL injection payloads
```

---

## Shift-Left Security

```
Traditional:
Development → QA → Security Review → Production
(Security found late, expensive to fix)

Shift-Left:
Security → Development → QA (with security tests) → Production
(Security integrated early, cheaper to fix)

QA's Shift-Left Activities:
✅ Security test cases in test plan
✅ SAST/DAST in CI/CD pipeline
✅ Dependency scanning automated
✅ Security regression tests
✅ Threat modeling in design phase
```

---

## Security Test Checklist

```
Authentication:
□ Password strength enforced (min 8 chars, complexity)
□ Account lockout after failed attempts
□ Session timeout configured (30 min)
□ Passwords hashed with bcrypt/Argon2
□ MFA available for sensitive accounts

Authorization:
□ Role-Based Access Control (RBAC) enforced
□ Users can't access other users' data
□ Admin functions require admin role
□ API endpoints validate permissions

Data Protection:
□ HTTPS enforced (no HTTP)
□ Sensitive data encrypted at rest
□ PII not logged
□ Database credentials not hardcoded

Input Validation:
□ All user input validated/sanitized
□ File uploads restricted by type/size
□ XSS protection (escape output)
□ SQL injection prevention (parameterized queries)

Error Handling:
□ Error messages don't leak sensitive info
□ Stack traces disabled in production
□ Generic error pages for users

Logging:
□ Security events logged (login, logout, failed attempts)
□ Logs retained for compliance period
□ Sensitive data not logged (passwords, tokens)
```

---

## Testing Example: Broken Access Control

```javascript
// Test: Users should not access other users' data
describe('Access Control', () => {
  it('should prevent users from accessing other users orders', async () => {
    // User A logs in
    const userA = await loginAs('userA@example.com', 'password');
    const userAOrders = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userA.token}`)
      .expect(200);

    // User B logs in
    const userB = await loginAs('userB@example.com', 'password');

    // User B attempts to access User A's order
    const userAOrderId = userAOrders.body[0].id;
    
    const response = await request(app)
      .get(`/api/orders/${userAOrderId}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .expect(403); // Forbidden

    expect(response.body.error).toContain('Access denied');
  });
});
```

---

## Collaborating with Security Teams

```
QA ↔ Security Team Partnership:

1. Threat Modeling Sessions:
   - QA provides use cases
   - Security identifies threats
   - QA writes test cases for mitigations

2. Pentesting:
   - Security team performs manual pentest
   - QA triages findings
   - QA writes regression tests for fixes

3. Vulnerability Management:
   - Security team finds vulnerability (SAST/DAST)
   - QA validates fix
   - QA adds test to prevent regression

4. Security Champions Program:
   - QA engineer designated as security champion
   - Attends security training
   - Evangelizes security testing in team
```

---

## Best Practices

**1. Security is not a phase, it's continuous:**
```
❌ "We'll do security testing before release"
✅ "Security tests run in every CI build"
```

**2. Automate repetitive security checks:**
```
✅ SAST in PR checks (SonarQube)
✅ Dependency scanning daily (Snyk)
✅ DAST in staging deployment (OWASP ZAP)
```

**3. Assume breach mentality:**
```
Test: "If attacker bypasses login, what can they access?"
Principle of least privilege
Defense in depth
```

---

## Exercise

**Create Security Test Plan:**

For an e-commerce application, create:
1. Threat model (STRIDE)
2. Security test cases (authentication, authorization, data protection)
3. CI/CD integration plan (SAST, DAST, SCA)

**Deliverable:** Security test plan document.

---

## Next Steps

- Study [OWASP Top 10 Testing](02-owasp-top-10-testing.md)
- Learn [Authentication & Authorization Testing](03-authentication-authorization-testing.md)
