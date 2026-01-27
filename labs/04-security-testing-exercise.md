# Security Testing Exercise

## Overview

**Duration:** 4 hours
**Difficulty:** Advanced
**Category:** Security Testing

Practice identifying OWASP Top 10 vulnerabilities using intentionally vulnerable web applications. Learn security testing techniques and tools.

## Learning Objectives

- Identify common web vulnerabilities
- Use security testing tools (OWASP ZAP, Burp Suite)
- Test for injection attacks
- Validate authentication and authorization
- Document security findings

## Prerequisites

- **OWASP ZAP** or **Burp Suite Community Edition**
- Basic understanding of web security
- HTTP/HTTPS knowledge
- Browser developer tools

## Test Applications

We'll use intentionally vulnerable applications:

**OWASP Juice Shop:**
```bash
docker run -p 3000:3000 bkimminich/juice-shop
```
Visit: http://localhost:3000

**DVWA (Damn Vulnerable Web Application):**
```bash
docker run -p 80:80 vulnerables/web-dvwa
```

## Part 1: SQL Injection (45 minutes)

### What is SQL Injection?

Attackers insert malicious SQL code into input fields to manipulate database queries.

### Test Scenarios

**1. Login Bypass:**
```sql
Username: admin' OR '1'='1
Password: anything
```

**2. Extract Data:**
```sql
' UNION SELECT username, password FROM users--
```

**3. Boolean-Based Blind SQLi:**
```sql
1' AND 1=1--   (returns data)
1' AND 1=2--   (returns nothing)
```

### Exercise Tasks

- [ ] Test login forms for SQL injection
- [ ] Test search fields
- [ ] Try extracting user data
- [ ] Document all vulnerable endpoints
- [ ] Propose fixes (parameterized queries)

## Part 2: Cross-Site Scripting (XSS) (45 minutes)

### XSS Types

**Reflected XSS:**
```html
<script>alert('XSS')</script>
```

**Stored XSS:**
```html
<img src=x onerror="alert('XSS')">
```

**DOM-Based XSS:**
```javascript
<script>document.write(window.location.hash.substring(1))</script>
```

### Test Scenarios

1. Comment fields
2. User profile fields
3. Search parameters in URL
4. File upload (SVG with embedded script)

### Payloads to Try

```html
<script>alert(document.cookie)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
"><script>alert(String.fromCharCode(88,83,83))</script>
```

## Part 3: Broken Authentication (30 minutes)

### Test Cases

**Weak Password Policy:**
- Try password: "123456"
- Try password: "password"
- Test account lockout

**Session Management:**
- Check if session timeout exists
- Try session fixation
- Test "remember me" functionality
- Check if logout invalidates session

**Password Reset:**
- Test if token expires
- Try reusing reset token
- Check if token is predictable

## Part 4: Security Testing with OWASP ZAP (60 minutes)

### Setup

1. Start OWASP ZAP
2. Configure browser to use ZAP proxy (localhost:8080)
3. Navigate to target application

### Automated Scan

1. Click "Automated Scan"
2. Enter URL: http://localhost:3000
3. Click "Attack"
4. Wait for scan to complete
5. Review alerts

### Manual Testing

**Spider the Application:**
- Right-click URL → Attack → Spider
- Discover all pages

**Active Scan:**
- Right-click site → Active Scan
- ZAP will test for vulnerabilities

**Fuzzing:**
- Right-click parameter → Fuzz
- Add payloads from FuzzDB
- Run fuzzer

### Analyzing Results

**High Alerts:**
- SQL Injection
- XSS
- Command Injection

**Medium Alerts:**
- Missing security headers
- Weak SSL/TLS

**Low Alerts:**
- Information disclosure
- Cookie security

## Part 5: Authorization Testing (30 minutes)

### Horizontal Privilege Escalation

**Test:**
```
1. Login as user1
2. Get user1's profile: GET /api/users/123
3. Try accessing user2: GET /api/users/456
```

**Expected:** Access denied
**Vulnerable:** You can see user2's data

### Vertical Privilege Escalation

**Test:**
```
1. Login as regular user
2. Try admin endpoints: GET /api/admin/users
```

**Expected:** 403 Forbidden
**Vulnerable:** 200 OK with admin data

### Insecure Direct Object References (IDOR)

**Test sequential IDs:**
```
/invoice/1001
/invoice/1002
/invoice/1003
```

Can you access other users' invoices?

## Part 6: Security Headers (15 minutes)

### Check Security Headers

Using browser DevTools (Network tab):

**Required Headers:**
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
```

### Test for Missing Headers

```bash
curl -I https://example.com
```

## Deliverables

### Security Test Report

Create a report with:

**1. Executive Summary**
- Critical findings
- Risk level
- Immediate actions needed

**2. Vulnerability Details**

For each vulnerability:
```markdown
## Vulnerability: SQL Injection in Login Form

**Severity:** Critical
**CVSS Score:** 9.8

**Description:**
The login form is vulnerable to SQL injection attacks.

**Steps to Reproduce:**
1. Navigate to /login
2. Enter: admin' OR '1'='1
3. Click Login
4. Gain unauthorized access

**Evidence:**
[Screenshot]

**Impact:**
- Unauthorized access to all user accounts
- Potential data breach
- Database manipulation possible

**Remediation:**
- Use parameterized queries
- Implement input validation
- Apply principle of least privilege to DB user

**References:**
- OWASP: https://owasp.org/www-community/attacks/SQL_Injection
- CWE-89: https://cwe.mitre.org/data/definitions/89.html
```

**3. Risk Matrix**

| Vulnerability | Severity | Likelihood | Risk |
|--------------|----------|------------|------|
| SQL Injection | Critical | High | Critical |
| XSS | High | Medium | High |
| Missing CSP | Medium | High | Medium |

**4. Remediation Plan**

Priority-ordered list of fixes.

## Bonus Challenges

1. **Command Injection:**
   - Test file upload with shell commands
   - Try path traversal: `../../etc/passwd`

2. **XML External Entity (XXE):**
   - Test XML endpoints
   - Try to read /etc/passwd

3. **Server-Side Request Forgery (SSRF):**
   - Try to make server access internal resources

4. **Sensitive Data Exposure:**
   - Check for hardcoded credentials in JS
   - Look for API keys in source code

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ZAP User Guide](https://www.zaproxy.org/docs/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackerOne Hacktivity](https://hackerone.com/hacktivity)
