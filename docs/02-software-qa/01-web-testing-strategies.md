# Web Testing Strategies

## Overview

Web testing encompasses the verification and validation of web applications across multiple dimensions: functionality, usability, performance, security, and compatibility. Modern web applications are complex, involving frontend, backend, APIs, databases, and third-party integrations.

## Why Web Testing is Unique

### Web vs Desktop Applications

| Aspect | Web Application | Desktop Application |
|--------|-----------------|---------------------|
| **Platform** | Browser-based, OS-independent | OS-specific installation |
| **Updates** | Instant, server-side | Requires client installation |
| **Compatibility** | Multiple browsers, versions | Single OS version |
| **Network** | Always requires connectivity | Can work offline |
| **Security** | Vulnerable to web attacks (XSS, CSRF) | Different threat model |
| **Performance** | Network latency matters | Local resources only |

### Modern Web Complexity

**Traditional Web (2000s):**
- Server-rendered HTML
- Page reloads for every action
- Simple JavaScript
- Limited interactivity

**Modern Web (2020s):**
- Single Page Applications (SPAs)
- Real-time updates (WebSockets)
- Complex state management
- Progressive Web Apps (PWAs)
- Microservices backends
- API-driven architecture

## Comprehensive Web Testing Checklist

### 1. Functional Testing

**Core Functionality:**
- ✅ User registration and login
- ✅ Forms submission and validation
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search functionality
- ✅ Filtering and sorting
- ✅ Pagination
- ✅ File upload/download
- ✅ Shopping cart/checkout (e-commerce)
- ✅ Payment processing

**Navigation:**
- ✅ All links work correctly
- ✅ Breadcrumbs accurate
- ✅ Back/forward browser buttons
- ✅ Internal site search
- ✅ Menu navigation
- ✅ Footer links

**Error Handling:**
- ✅ 404 pages for invalid URLs
- ✅ Form validation messages
- ✅ Network error handling
- ✅ API failure graceful degradation
- ✅ Session timeout handling

---

### 2. UI/UX Testing

**Visual Consistency:**
- Colors match design system
- Fonts consistent across pages
- Spacing and alignment correct
- Images render properly
- Icons display correctly

**Responsive Design:**
```
Test Breakpoints:
- Mobile: 320px, 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px
```

**Usability Checklist:**
- ✅ Clear call-to-action buttons
- ✅ Intuitive navigation
- ✅ Readable font sizes (min 14px for body text)
- ✅ Sufficient color contrast (WCAG AA: 4.5:1)
- ✅ Loading indicators for async actions
- ✅ Helpful error messages
- ✅ Consistent terminology

**Example: Form Usability Test**

```javascript
// Good: Clear labels, helpful validation
<form>
  <label for="email">Email Address</label>
  <input
    id="email"
    type="email"
    required
    aria-describedby="email-help"
  />
  <span id="email-help" class="help-text">
    We'll never share your email
  </span>
  <span class="error" role="alert">
    Please enter a valid email address
  </span>
</form>

// Bad: No labels, vague errors
<form>
  <input type="text" placeholder="Email" />
  <span>Invalid input</span>
</form>
```

---

### 3. Cross-Browser Testing

**Browser Matrix:**

| Browser | Versions | Market Share | Priority |
|---------|----------|--------------|----------|
| Chrome | Latest, Latest-1 | ~65% | Critical |
| Safari | Latest, Latest-1 | ~19% | Critical |
| Edge | Latest | ~4% | High |
| Firefox | Latest | ~3% | Medium |
| Samsung Internet | Latest | ~3% | Medium |
| Opera | Latest | ~2% | Low |
| IE 11 | End of life (2022) | ~0% | None |

**Testing Strategy:**

**Critical Browsers (Chrome, Safari):**
- Test every major release
- All functionality must work
- Performance benchmarks required

**High Priority (Edge):**
- Test major releases
- Core functionality must work
- UI can have minor differences

**Medium Priority (Firefox, Samsung):**
- Test quarterly
- Major features must work
- Known issues acceptable if documented

**Browser-Specific Issues:**

```javascript
// Chrome vs Safari Date Input
// Chrome: Native date picker
<input type="date" />

// Safari (iOS): Different picker
// Solution: Use a library (e.g., Flatpickr) for consistency

// Firefox: CSS differences
.button {
  /* Firefox needs this for flex children */
  min-width: 0;
}

// Safari: Viewport height on mobile
.hero {
  /* Safari mobile viewport height includes address bar */
  height: 100vh; /* Wrong on Safari */
  height: calc(100vh - 100px); /* Better */
  /* Or use dvh (dynamic viewport height) */
  height: 100dvh; /* Modern solution */
}
```

**Testing Tools:**
- **BrowserStack**: Cloud-based real device testing
- **Sauce Labs**: Automated cross-browser testing
- **LambdaTest**: Live interactive testing
- **Playwright**: Automated testing across browsers
- **Can I Use**: Check browser feature support

---

### 4. Performance Testing

**Key Metrics:**

```
Core Web Vitals (Google's metrics):

1. LCP (Largest Contentful Paint)
   Target: < 2.5 seconds
   Measures: Loading performance

2. FID (First Input Delay)
   Target: < 100 milliseconds
   Measures: Interactivity

3. CLS (Cumulative Layout Shift)
   Target: < 0.1
   Measures: Visual stability
```

**Performance Budget:**

| Asset Type | Budget | Current | Status |
|------------|--------|---------|--------|
| JavaScript | 300 KB | 285 KB | ✅ Pass |
| CSS | 50 KB | 48 KB | ✅ Pass |
| Images | 500 KB | 620 KB | ❌ Over |
| Fonts | 100 KB | 75 KB | ✅ Pass |
| Total | 950 KB | 1028 KB | ❌ Over |

**Performance Testing Tools:**

**Lighthouse (Chrome DevTools):**
```bash
# Run Lighthouse CLI
npm install -g lighthouse
lighthouse https://example.com --view
```

**WebPageTest:**
```
Settings:
- Test Location: Dulles, VA (US)
- Browser: Chrome
- Connection: Cable (5 Mbps)
- Number of Tests: 3 (median result)
```

**Performance Testing Checklist:**

- ✅ Page load time < 3 seconds (3G)
- ✅ Time to Interactive < 5 seconds
- ✅ Images optimized (WebP, lazy loading)
- ✅ JavaScript code-split and minified
- ✅ CSS critical path optimized
- ✅ Fonts optimized (WOFF2, font-display: swap)
- ✅ CDN used for static assets
- ✅ Gzip/Brotli compression enabled
- ✅ Browser caching configured
- ✅ No render-blocking resources

**Example: Lazy Loading Images**

```html
<!-- Native lazy loading -->
<img
  src="hero.jpg"
  alt="Hero image"
  loading="lazy"
  width="800"
  height="600"
/>

<!-- Responsive images with lazy loading -->
<img
  srcset="
    small.jpg 300w,
    medium.jpg 768w,
    large.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 768px"
  src="medium.jpg"
  alt="Responsive image"
  loading="lazy"
/>
```

---

### 5. Security Testing

**OWASP Top 10 Web Vulnerabilities:**

#### 1. Injection (SQL, XSS, Command)

**SQL Injection:**
```javascript
// Vulnerable code (Node.js)
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.query(query); // NEVER do this!

// Secure: Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]); // Safe
```

**XSS (Cross-Site Scripting):**
```javascript
// Vulnerable: Directly inserting user input
document.getElementById('greeting').innerHTML = userInput; // DANGEROUS!

// Secure: Escape or use textContent
document.getElementById('greeting').textContent = userInput; // Safe
```

**Testing XSS:**
```javascript
// Test payloads
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">
<svg onload="alert('XSS')">
```

#### 2. Broken Authentication

**Test Cases:**
- ✅ Password strength requirements enforced
- ✅ Account lockout after failed attempts
- ✅ Session timeout implemented
- ✅ Secure password reset flow
- ✅ Multi-factor authentication available
- ✅ Session tokens regenerated after login
- ✅ Credentials not exposed in URLs

```javascript
// Secure session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    maxAge: 3600000,   // 1 hour
    sameSite: 'strict' // CSRF protection
  }
}));
```

#### 3. Sensitive Data Exposure

**Test:**
- ✅ HTTPS everywhere (no mixed content)
- ✅ Passwords never sent in plain text
- ✅ API keys not in client-side code
- ✅ No sensitive data in localStorage
- ✅ Credit card data follows PCI-DSS
- ✅ Personal data encrypted at rest

#### 4. XML External Entities (XXE)

**Test:** Upload XML files with external entity references

```xml
<!-- XXE attack payload -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<foo>&xxe;</foo>
```

#### 5. Broken Access Control

**Test Cases:**
- ✅ Users can't access other users' data
- ✅ URL tampering doesn't expose unauthorized content
- ✅ API endpoints check authorization
- ✅ Admin functions require admin role
- ✅ Direct object references validated

```javascript
// Vulnerable: No authorization check
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);
  res.json(user); // Anyone can access any user!
});

// Secure: Check authorization
app.get('/api/users/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = getUserById(req.params.id);
  res.json(user);
});
```

#### 6. Security Misconfiguration

**Test:**
- ✅ Default credentials changed
- ✅ Error messages don't leak info
- ✅ Directory listing disabled
- ✅ Unnecessary services disabled
- ✅ Security headers configured
- ✅ CORS properly configured

**Security Headers:**
```javascript
// Express.js with Helmet
const helmet = require('helmet');
app.use(helmet());

// Manual configuration
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

#### 7. Cross-Site Request Forgery (CSRF)

**Test:** Submit forms without CSRF token

```javascript
// Protection with CSRF token
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', (req, res) => {
  // CSRF token automatically validated
  // Process form...
});
```

```html
<!-- Include CSRF token in forms -->
<form method="POST" action="/submit">
  <input type="hidden" name="_csrf" value="{{ csrfToken }}">
  <!-- Other fields -->
  <button type="submit">Submit</button>
</form>
```

**Security Testing Tools:**
- **OWASP ZAP**: Automated security scanner
- **Burp Suite**: Manual penetration testing
- **Snyk**: Dependency vulnerability scanning
- **npm audit**: Node.js dependency scanning
- **Security Headers**: Check HTTP security headers

---

### 6. Accessibility Testing (A11y)

**WCAG 2.1 Levels:**
- **Level A**: Basic accessibility (minimum)
- **Level AA**: Recommended for most sites
- **Level AAA**: Enhanced accessibility

**Key Principles (POUR):**

1. **Perceivable**: Users can perceive content
2. **Operable**: Users can operate interface
3. **Understandable**: Users can understand content
4. **Robust**: Content works across technologies

**Accessibility Checklist:**

**Semantic HTML:**
```html
<!-- Good: Semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>
<footer>
  <p>&copy; 2025 Company</p>
</footer>

<!-- Bad: Generic divs -->
<div class="header">
  <div class="nav">
    <div><a href="/">Home</a></div>
  </div>
</div>
```

**ARIA Attributes:**
```html
<!-- Screen reader announcements -->
<button
  aria-label="Close dialog"
  aria-pressed="false"
  aria-expanded="false"
>
  <span aria-hidden="true">&times;</span>
</button>

<!-- Live regions for dynamic content -->
<div role="alert" aria-live="assertive">
  Form submitted successfully!
</div>

<div role="status" aria-live="polite">
  Loading results...
</div>
```

**Keyboard Navigation:**
- ✅ All interactive elements focusable with Tab
- ✅ Focus indicators visible
- ✅ Logical tab order
- ✅ Skip to main content link
- ✅ Esc closes modals/dropdowns
- ✅ Arrow keys navigate menus
- ✅ Enter/Space activate buttons

**Color Contrast:**
```
WCAG AA Requirements:
- Normal text (< 24px): 4.5:1
- Large text (≥ 24px or ≥ 19px bold): 3:1
- UI components: 3:1

WCAG AAA Requirements:
- Normal text: 7:1
- Large text: 4.5:1
```

**Testing Tools:**
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Includes accessibility audit
- **NVDA/JAWS**: Screen reader testing
- **Color Contrast Analyzer**: Check color ratios

**Automated Test Example:**
```javascript
// Using axe-core with Playwright
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('https://example.com');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

### 7. Compatibility Testing

**Device Testing:**

**Mobile Devices:**
- iPhone 14 Pro (iOS 17)
- iPhone SE (iOS 16)
- Samsung Galaxy S23 (Android 13)
- Google Pixel 7 (Android 13)
- iPad Pro (iPadOS 17)

**Desktop:**
- Windows 11
- macOS Sonoma
- Ubuntu Linux

**Screen Resolutions:**
- 1920×1080 (Full HD)
- 1366×768 (Common laptop)
- 2560×1440 (2K)
- 3840×2160 (4K)

**Orientation Testing:**
- Portrait mode
- Landscape mode
- Rotation handling

**Network Testing:**
```
Connection Types:
- WiFi (Fast)
- 4G (5 Mbps)
- 3G (1.5 Mbps)
- Slow 3G (500 Kbps)
- Offline (PWA)
```

**Chrome DevTools Network Throttling:**
```javascript
// Programmatic throttling with Puppeteer
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Emulate Slow 3G
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 500 * 1024 / 8,
    uploadThroughput: 500 * 1024 / 8,
    latency: 400
  });

  await page.goto('https://example.com');
  await browser.close();
})();
```

---

### 8. API Testing (Backend for Web)

**REST API Testing:**

```javascript
// Example: Testing user registration API
const request = require('supertest');
const app = require('../app');

describe('POST /api/register', () => {
  it('should register a new user with valid data', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).not.toHaveProperty('password'); // Never return password
  });

  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'invalid-email',
        password: 'SecurePass123!',
        name: 'Test User'
      })
      .expect(400);

    expect(res.body.error).toContain('valid email');
  });

  it('should reject weak password', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: '123',
        name: 'Test User'
      })
      .expect(400);

    expect(res.body.error).toContain('password');
  });
});
```

---

## Web Testing Strategy

### Test Pyramid for Web Applications

```
         /\
        /E2E\         10% - Critical user journeys
       /______\
      /        \
     /Integration\    30% - API, component integration
    /____________\
   /              \
  /  Unit Tests    \  60% - Business logic, utilities
 /__________________\
```

**Unit Tests (60%):**
- JavaScript utility functions
- React components (isolated)
- Validators, formatters
- Business logic

**Integration Tests (30%):**
- API endpoints
- Database operations
- Component interactions
- State management

**E2E Tests (10%):**
- Critical user flows (login, checkout, etc.)
- Cross-browser smoke tests
- Visual regression tests

### Test Prioritization

**Priority 1 (Must Test):**
- Login/Authentication
- Payment processing
- Data submission (forms)
- Core business functionality
- Security vulnerabilities

**Priority 2 (Should Test):**
- Navigation
- Search
- Filtering/sorting
- User profile
- Error handling

**Priority 3 (Nice to Test):**
- Marketing pages
- Footer links
- Help documentation
- Non-critical features

---

## Web Testing Tools Comparison

| Tool | Type | Best For | Language |
|------|------|----------|----------|
| **Selenium** | Browser automation | Cross-browser testing | Multiple |
| **Cypress** | E2E testing | Modern SPAs, dev experience | JavaScript |
| **Playwright** | Browser automation | Modern web, parallel testing | JavaScript, Python, Java |
| **Puppeteer** | Headless Chrome | Chrome-specific automation | JavaScript |
| **TestCafe** | E2E testing | No WebDriver, easy setup | JavaScript |
| **WebdriverIO** | Browser automation | Flexible, extensible | JavaScript |
| **Jest** | Unit/Integration | React apps | JavaScript |
| **Postman** | API testing | REST APIs, manual testing | GUI + JavaScript |
| **k6** | Performance | Load testing | JavaScript |

---

## Common Web Testing Mistakes

### Mistake 1: Not Testing on Real Devices
**Problem:** Emulators don't catch all issues

**Fix:** Use real devices or cloud services (BrowserStack, Sauce Labs)

### Mistake 2: Testing Only in Chrome
**Problem:** Safari and mobile browsers behave differently

**Fix:** Test in all major browsers, especially Safari for iOS

### Mistake 3: Ignoring Performance
**Problem:** Site works but loads slowly, users leave

**Fix:** Set performance budgets, monitor Core Web Vitals

### Mistake 4: Not Testing Offline
**Problem:** Users lose work when internet drops

**Fix:** Implement service workers, test offline functionality

### Mistake 5: Skipping Accessibility
**Problem:** Site unusable for people with disabilities

**Fix:** Use automated tools, test with keyboard only, use screen reader

---

## What Senior Engineers Know

**Test in production.** Use feature flags and monitor real user experience. Staging never catches everything.

**Performance matters more than features.** A slow site loses users. Amazon found 100ms delay = 1% revenue loss.

**Accessibility is not optional.** 15% of users have disabilities. Plus, it's often legally required.

**Real devices reveal surprises.** Safari on iPhone behaves differently than Chrome. Test on actual devices.

**Automate the boring stuff.** Regression tests, cross-browser checks. Spend human time on exploratory testing.

---

## Exercise

**Test a Real Website:**

Choose a public website (or your own project) and complete:

1. **Functional Testing**: Test login, registration, and one core feature. Document 5 test cases.

2. **Performance Testing**: Run Lighthouse audit. Identify the 3 biggest performance issues.

3. **Security Testing**: Check security headers at [securityheaders.com](https://securityheaders.com). What's missing?

4. **Accessibility Testing**: Run axe DevTools. Fix at least 3 violations.

5. **Cross-Browser Testing**: Test in Chrome, Safari, and one mobile browser. Document differences.

**Deliverable:** Test report with findings, screenshots, and recommendations.

---

## Next Steps

- Practice [API Testing](02-api-testing.md) for backend verification
- Learn [Database Testing](03-database-testing.md) for data integrity
- Understand [Microservices Testing](04-microservices-testing.md) for distributed systems
- Master [CI/CD Quality Gates](05-cicd-quality-gates.md) for automated checks
