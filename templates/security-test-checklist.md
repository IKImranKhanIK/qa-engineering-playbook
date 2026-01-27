# Security Testing Checklist

## Application Information
- **Application Name**:
- **Version**:
- **Environment**:
- **Test Date**:
- **Security Tester**:
- **OWASP Top 10 Year**: 2021

---

## OWASP Top 10 - 2021

### A01:2021 – Broken Access Control
- [ ] Test for missing authorization checks
- [ ] Attempt to access other users' data
- [ ] Test elevation of privilege
- [ ] Test for IDOR (Insecure Direct Object Reference)
- [ ] Verify CORS policy implementation
- [ ] Test forced browsing to restricted pages
- [ ] Test API access control

### A02:2021 – Cryptographic Failures
- [ ] Verify HTTPS/TLS is enforced
- [ ] Test for weak encryption algorithms
- [ ] Check for hardcoded secrets/keys
- [ ] Verify password storage (bcrypt, Argon2)
- [ ] Test for sensitive data in transit
- [ ] Check for sensitive data in logs
- [ ] Verify encryption of PII/sensitive data at rest

### A03:2021 – Injection
- [ ] Test SQL injection in all input fields
- [ ] Test NoSQL injection
- [ ] Test LDAP injection
- [ ] Test OS command injection
- [ ] Test XML injection
- [ ] Test template injection
- [ ] Verify input sanitization/validation
- [ ] Test prepared statements usage

### A04:2021 – Insecure Design
- [ ] Review threat modeling
- [ ] Test security controls in design
- [ ] Verify secure development lifecycle
- [ ] Test for missing rate limiting
- [ ] Check for business logic flaws
- [ ] Test for missing security headers

### A05:2021 – Security Misconfiguration
- [ ] Check for default credentials
- [ ] Verify error handling doesn't leak info
- [ ] Test for directory listing
- [ ] Check for unnecessary features enabled
- [ ] Verify security headers (CSP, X-Frame-Options)
- [ ] Test for exposed admin interfaces
- [ ] Check for outdated software versions
- [ ] Verify secure cloud storage configs

### A06:2021 – Vulnerable and Outdated Components
- [ ] Run dependency vulnerability scan
- [ ] Check for CVEs in dependencies
- [ ] Verify all components are up-to-date
- [ ] Test for known vulnerable libraries
- [ ] Review npm/pip/maven security advisories
- [ ] Verify component integrity

### A07:2021 – Identification and Authentication Failures
- [ ] Test for weak password policy
- [ ] Test session fixation
- [ ] Test for session timeout
- [ ] Verify multi-factor authentication (MFA)
- [ ] Test credential stuffing protection
- [ ] Test password reset flow
- [ ] Verify brute force protection
- [ ] Test session invalidation on logout
- [ ] Check for JWT vulnerabilities

### A08:2021 – Software and Data Integrity Failures
- [ ] Test for unsigned code/artifacts
- [ ] Verify CI/CD pipeline security
- [ ] Test for auto-update vulnerabilities
- [ ] Check for unsafe deserialization
- [ ] Verify digital signatures
- [ ] Test dependency confusion attacks

### A09:2021 – Security Logging and Monitoring Failures
- [ ] Verify login attempts are logged
- [ ] Test that security events are logged
- [ ] Check log integrity
- [ ] Verify sensitive data not in logs
- [ ] Test alerting mechanisms
- [ ] Verify audit trail completeness

### A10:2021 – Server-Side Request Forgery (SSRF)
- [ ] Test for SSRF in URL parameters
- [ ] Test for SSRF in file uploads
- [ ] Verify input URL validation
- [ ] Test for internal network access
- [ ] Check DNS rebinding protection

---

## Authentication & Session Management

- [ ] Test password complexity requirements
- [ ] Test password reset mechanism
- [ ] Verify account lockout policy
- [ ] Test remember me functionality
- [ ] Test logout from all devices
- [ ] Verify session token randomness
- [ ] Test session token in URL
- [ ] Test concurrent session handling
- [ ] Verify secure cookie flags (HttpOnly, Secure, SameSite)

## Authorization

- [ ] Test horizontal privilege escalation
- [ ] Test vertical privilege escalation
- [ ] Verify role-based access control
- [ ] Test permission inheritance
- [ ] Test API endpoint authorization
- [ ] Verify file access permissions

## Input Validation

- [ ] Test XSS (Reflected, Stored, DOM-based)
- [ ] Test CSRF protection
- [ ] Test file upload validation
- [ ] Test file type restrictions
- [ ] Test file size limits
- [ ] Verify content-type validation
- [ ] Test HTML/JavaScript injection

## Data Protection

- [ ] Test for sensitive data exposure
- [ ] Verify PII is encrypted
- [ ] Test for credit card data handling (PCI DSS)
- [ ] Check for sensitive data caching
- [ ] Test autocomplete on sensitive fields
- [ ] Verify data retention policies

## Network Security

- [ ] Verify TLS version (TLS 1.2+)
- [ ] Test SSL/TLS certificate validity
- [ ] Check for mixed content (HTTP/HTTPS)
- [ ] Test for clickjacking protection
- [ ] Verify Content Security Policy
- [ ] Test HSTS headers

## Mobile Security (if applicable)

- [ ] Test for insecure data storage
- [ ] Test for code obfuscation
- [ ] Verify certificate pinning
- [ ] Test for rooted/jailbroken device detection
- [ ] Check for hardcoded credentials
- [ ] Test deep link vulnerabilities

## API Security

- [ ] Test API authentication
- [ ] Verify API rate limiting
- [ ] Test for mass assignment
- [ ] Check API versioning security
- [ ] Test GraphQL query depth limiting
- [ ] Verify API input validation

---

## Tools Used

- [ ] OWASP ZAP
- [ ] Burp Suite
- [ ] Nikto
- [ ] SQLMap
- [ ] Nmap
- [ ] Dependency-Check
- [ ] SonarQube
- [ ] Other: ___________

---

## Critical Vulnerabilities Found

| ID | Vulnerability | Severity | CVSS Score | Status |
|----|--------------|----------|------------|--------|
| 1 |  | Critical/High/Medium/Low |  | Open/Fixed |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## Risk Summary

- **Critical**: ___ issues
- **High**: ___ issues
- **Medium**: ___ issues
- **Low**: ___ issues
- **Info**: ___ issues

## Recommendations

1.
2.
3.

---

**Test Completion Date**:
**Security Sign-off**:
**Next Security Review Date**:
