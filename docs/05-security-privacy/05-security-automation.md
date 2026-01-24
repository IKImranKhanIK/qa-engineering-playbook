# Security Automation

## CI/CD Security Integration

### SAST (Static Application Security Testing)

```yaml
# GitHub Actions: SonarQube scan
name: Security Scan

on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
      
      - name: Check Quality Gate
        run: |
          # Fail build if quality gate fails
          STATUS=$(curl -s -u $SONAR_TOKEN: "$SONAR_HOST_URL/api/qualitygates/project_status?projectKey=my-project" | jq -r .projectStatus.status)
          if [ "$STATUS" != "OK" ]; then
            echo "Quality gate failed: $STATUS"
            exit 1
          fi
```

---

## Dependency Scanning

```yaml
# Snyk security scan
- name: Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    command: test
    args: --severity-threshold=high  # Fail on high/critical

# npm audit
- name: npm Audit
  run: npm audit --audit-level=high
```

---

## DAST (Dynamic Application Security Testing)

```yaml
# OWASP ZAP baseline scan
- name: Deploy to Staging
  run: |
    # Deploy app to staging
    deploy_to_staging.sh

- name: OWASP ZAP Scan
  run: |
    docker run -t owasp/zap2docker-stable zap-baseline.py \
      -t https://staging.example.com \
      -r zap-report.html \
      -J zap-report.json
    
    # Parse results
    RISK=$(jq '.site[0].alerts | map(select(.riskcode >= 2)) | length' zap-report.json)
    if [ "$RISK" -gt 0 ]; then
      echo "Found $RISK medium/high risk vulnerabilities"
      exit 1
    fi
```

---

## Secret Scanning

```yaml
# GitGuardian secret detection
- name: GitGuardian Scan
  uses: GitGuardian/ggshield-action@v1
  env:
    GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
    GITHUB_PUSH_BEFORE_SHA: ${{ github.event.before }}
    GITHUB_PUSH_BASE_SHA: ${{ github.event.base }}
    GITHUB_DEFAULT_BRANCH: ${{ github.event.repository.default_branch }}
    GITHUB_PULL_BASE_SHA: ${{ github.event.pull_request.base.sha }}
```

---

## License Compliance

```bash
# Check for forbidden licenses
npm install -g license-checker

license-checker --onlyAllow "MIT;Apache-2.0;BSD-3-Clause" --production
```

---

## Security Regression Tests

```javascript
// Automated security tests in test suite
describe('Security Regression Tests', () => {
  it('should prevent SQL injection (CVE-2024-XXXX)', async () => {
    const maliciousInput = "' OR '1'='1";
    const response = await request(app)
      .get(`/api/search?q=${maliciousInput}`)
      .expect(400);
  });

  it('should prevent XSS (CVE-2024-YYYY)', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await request(app)
      .post('/api/comments')
      .send({ text: xssPayload });
    
    const comment = await getComment(response.body.id);
    expect(comment.text).not.toContain('<script>');
    expect(comment.text).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
  });
});
```

---

## Security Monitoring

```yaml
# Continuous security monitoring
- name: Trivy Container Scan
  run: |
    docker build -t myapp:latest .
    trivy image --severity HIGH,CRITICAL --exit-code 1 myapp:latest
```

---

## Best Practices

**1. Shift-left security:**
```
✅ SAST in every PR
✅ Dependency scan daily
✅ DAST in staging deployment
```

**2. Fail fast:**
```
✅ Block PR if critical vulnerabilities found
✅ Prevent deployment with known CVEs
```

**3. Automated fixes:**
```
✅ Dependabot auto-update dependencies
✅ Automated security patches
```

---

## Exercise

Integrate security tools into CI/CD:
1. Add SAST (SonarQube/Semgrep)
2. Add DAST (OWASP ZAP)
3. Add dependency scanning (Snyk)
4. Add secret scanning
5. Create security regression test suite

**Deliverable:** Security-enabled CI/CD pipeline.
