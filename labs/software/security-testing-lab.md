# Lab: Security Testing Exercise

**Difficulty:** Advanced
**Duration:** 4 hours
**Category:** Software

## Objectives

- Test for OWASP Top 10 vulnerabilities
- Use security testing tools
- Identify common security flaws
- Write security test cases
- Practice responsible disclosure

## Prerequisites

- Completed [OWASP Top 10 Testing lesson](../../docs/05-security-privacy/02-owasp-top-10-testing.md)
- Basic web security knowledge
- HTTP/HTTPS understanding

## Setup

### Test Application

**Use:** OWASP Juice Shop (intentionally vulnerable application)

```bash
# Docker installation (recommended)
docker pull bkimminich/juice-shop
docker run -p 3000:3000 bkimminich/juice-shop

# Or npm installation
npm install -g juice-shop
juice-shop
```

Access at: http://localhost:3000

### Tools Needed

- OWASP ZAP (https://www.zaproxy.org/)
- Burp Suite Community Edition (https://portswigger.net/burp)
- Browser (Chrome/Firefox)

## Part 1: Vulnerability Discovery (90 minutes)

### Exercise 1.1: SQL Injection

**Task:** Find and exploit SQL injection vulnerability

**Test Steps:**
1. Navigate to login page
2. Try common SQL injection payloads:
   - `' OR '1'='1`
   - `admin'--`
   - `' OR 1=1--`

**Document:**
- Which payloads worked?
- What data was exposed?
- Impact assessment

### Exercise 1.2: XSS (Cross-Site Scripting)

**Task:** Inject JavaScript into the application

**Test Areas:**
- Search fields
- Comment sections
- User profile fields

**Payloads to try:**
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg/onload=alert('XSS')>
```

### Exercise 1.3: Broken Authentication

**Test Scenarios:**
- Weak password policy
- Session fixation
- Password reset flaws
- Remember me functionality

### Exercise 1.4: Sensitive Data Exposure

**Check for:**
- Passwords in URLs
- API keys in JavaScript
- Debug information in responses
- PII in error messages

## Part 2: Automated Scanning (60 minutes)

### Exercise 2.1: OWASP ZAP Scan

**Steps:**
1. Launch OWASP ZAP
2. Configure browser proxy to ZAP
3. Browse the application
4. Run automated scan
5. Review findings

**Document:**
- Number of vulnerabilities found
- Categorize by severity
- False positives identified

### Exercise 2.2: Burp Suite Scan

**Steps:**
1. Configure Burp Proxy
2. Spider the application
3. Run active scan (Community features)
4. Review results

**Compare:**
- ZAP vs Burp findings
- Which tool found more issues?

## Part 3: Manual Testing (90 minutes)

### Exercise 3.1: Access Control Testing

**Test Cases:**
- Can user A access user B's data?
- Can non-admin access admin functions?
- IDOR (Insecure Direct Object Reference)

**Example:**
```
GET /api/users/1/orders
Try changing to:
GET /api/users/2/orders
```

### Exercise 3.2: Business Logic Flaws

**Test:**
- Negative prices
- Quantity manipulation
- Discount code abuse
- Race conditions in payments

### Exercise 3.3: API Security

**Test:**
- Missing authentication
- Excessive data exposure
- Rate limiting
- Input validation

## Part 4: Reporting (30 minutes)

### Exercise 4.1: Security Bug Report

Create detailed security reports:

```markdown
# Security Vulnerability Report

**Vulnerability:** SQL Injection in Login Form
**Severity:** Critical
**CVSS Score:** 9.1

## Description
The login form is vulnerable to SQL injection, allowing unauthorized access.

## Steps to Reproduce
1. Navigate to /login
2. Enter username: admin'--
3. Enter any password
4. Click login

## Impact
- Full database access
- User credential theft
- Administrative access

## Proof of Concept
[Screenshot or video]

## Remediation
- Use parameterized queries
- Implement input validation
- Add WAF rules

## References
- OWASP A03:2021 - Injection
- CWE-89: SQL Injection
```

## Deliverables

1. **Vulnerability Report**
   - All vulnerabilities found
   - Severity ratings
   - Remediation steps

2. **Test Evidence**
   - Screenshots
   - Request/Response logs
   - Proof of concepts

3. **Tool Comparison**
   - ZAP vs Burp analysis
   - Manual vs automated findings

## Ethical Guidelines

⚠️ **IMPORTANT:**
- Only test authorized systems
- Never test production systems without permission
- Don't access/modify other users' data
- Don't perform DoS attacks
- Report vulnerabilities responsibly

## Bonus Challenges

1. Write security test automation using OWASP ZAP API
2. Create custom security test scenarios
3. Test mobile app security
4. Review source code for security issues

## Next Steps

- Study OWASP Top 10 in detail
- Learn about security headers
- Practice on other platforms (HackTheBox, TryHackMe)
- Get security certifications (CEH, OSCP)
