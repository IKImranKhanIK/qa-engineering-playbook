# Exploratory Testing

## Overview

Exploratory testing is simultaneous learning, test design, and test execution. Unlike scripted testing where test cases are written beforehand, exploratory testing relies on the tester's creativity, intuition, and domain knowledge to uncover defects that automated tests miss.

## Scripted vs Exploratory Testing

### Scripted Testing

```
Plan → Design Test Cases → Execute → Report

Test Case #1:
1. Navigate to login page
2. Enter valid username
3. Enter valid password
4. Click login button
5. Verify user dashboard displays

Expected: User logged in successfully
```

**Characteristics:**
- Predetermined steps
- Repeatable
- Easy to automate
- Finds known issues
- Less creative

### Exploratory Testing

```
Learn → Design → Execute → Learn (continuous loop)

Session: "Explore login functionality"
- Try special characters in username
- Test extremely long passwords
- Check behavior with spaces
- Try SQL injection payloads
- Test concurrent logins
- Observe error messages
```

**Characteristics:**
- Adaptive approach
- Investigative
- Requires skill and experience
- Finds unknown issues
- Creative and insightful

**Both are necessary.** Scripted for regression, exploratory for discovery.

---

## When to Use Exploratory Testing

### Ideal Scenarios

**1. New Features**
- You haven't written test cases yet
- Requirements are still evolving
- Need to understand functionality quickly

**2. Time-Constrained Testing**
- Production hotfix needs immediate verification
- Last-minute changes before release
- Quick smoke test of build

**3. Finding Edge Cases**
- Automated tests passed but you suspect issues
- Complex user workflows
- Integration points between features

**4. Risk Assessment**
- Evaluate security vulnerabilities
- Test disaster recovery
- Assess usability issues

**5. Learning Phase**
- New team member exploring system
- Understanding legacy codebase
- Evaluating third-party components

### When NOT to Use Exploratory Testing

- Regulated environments requiring documented test cases (medical devices, aerospace)
- Testing standard CRUD operations (automate these)
- Regression testing stable features (use automation)
- When objective metrics required (use scripted tests with coverage)

---

## Exploratory Testing Techniques

### 1. Session-Based Test Management (SBTM)

**Structure:**

```
Charter: What to explore
Mission: Specific goal
Duration: Time-boxed (usually 60-90 minutes)
Setup: Preconditions
Test Notes: Observations during testing
Bugs: Issues found
Questions: Open questions
```

**Example Charter:**

```markdown
# Exploratory Testing Charter

**Feature:** E-commerce Checkout Flow

**Mission:** Explore payment processing for edge cases and error handling

**Duration:** 90 minutes

**Setup:**
- Test account with saved payment methods
- Test credit cards (valid, expired, declined)
- Empty cart, full cart scenarios

**Areas to Explore:**
1. Invalid credit card numbers
2. Expired cards
3. International addresses
4. Special characters in billing info
5. Network interruptions during payment
6. Multiple simultaneous checkouts
7. Browser back button during checkout
8. Session timeout scenarios

**Risks:**
- Payment processing failures
- Data loss
- Security vulnerabilities
- Poor error messages

**Test Notes:**
[Document observations here]

**Bugs Found:**
[List bugs with IDs]

**Questions:**
[Unanswered questions for product team]
```

### 2. Tours (James Whittaker's Approach)

Explore the application like different types of users on "tours."

**The Guidebook Tour:**
- Follow user manual/documentation
- Test all documented features
- Verify screenshots match actual UI
- Check if documentation is accurate

**The Money Tour:**
- Test features that make money
- E-commerce: Checkout, payments
- SaaS: Sign-up, subscription
- Ads: Click-through, conversions

**The Landmark Tour:**
- Test prominent, well-known features
- Homepage
- Core functionality
- Most-used features

**The Intellectual Tour:**
- Ask "What if?" questions
- Test complex scenarios
- Challenge assumptions
- Think like an attacker

**The Back Alley Tour:**
- Test rarely used features
- Hidden functionality
- Edge menus
- Admin panels

**The FedEx Tour:**
- Follow data through the system
- Create order → Process → Ship → Deliver
- Track data transformations
- Verify data integrity

**The Obsessive-Compulsive Tour:**
- Repeat same action many times
- Click button 100 times
- Submit form repeatedly
- Test pagination through 1000 pages

### 3. Heuristic Test Strategy Model (HEURISTICS)

**SFDIPOT (San Francisco Depot)**

- **S**tructure: Test architecture, code, system design
- **F**unction: Test features, operations, capabilities
- **D**ata: Test input, output, states
- **I**nterfaces: Test APIs, UI, integrations
- **P**latform: Test OS, browser, device
- **O**perations: Test deployment, config, maintenance
- **T**ime: Test timing, sequence, concurrency

**Example: Testing a Search Feature**

```
Structure:
- How is search implemented? (Database? Elasticsearch?)
- What's the indexing strategy?
- How are results ranked?

Function:
- Does search return relevant results?
- Does autocomplete work?
- Can users filter/sort results?

Data:
- Empty search query
- Special characters (@, #, *, %)
- SQL injection attempts
- Very long search terms (>1000 chars)
- Unicode characters (emojis, Chinese, Arabic)

Interfaces:
- Search from homepage vs in-app
- Mobile vs desktop
- API vs UI search

Platform:
- Different browsers (Chrome, Safari, Firefox)
- Mobile devices (iOS, Android)
- Screen readers (accessibility)

Operations:
- Search while indexing in progress
- Search during high load
- Search after database failover

Time:
- Search timeout behavior
- Concurrent searches from same user
- Search history persistence
```

### 4. Personas

Test as different user types.

**Personas for E-Commerce:**

**Alice the Novice:**
- First-time user, unfamiliar with site
- Makes mistakes, needs guidance
- Reads instructions carefully
- Tests: Onboarding, help text, error messages

**Bob the Power User:**
- Knows keyboard shortcuts
- Uses advanced features
- Tries to optimize workflow
- Tests: Performance, bulk operations, shortcuts

**Charlie the Malicious User:**
- Tries to break the system
- Exploits vulnerabilities
- Bypasses validations
- Tests: Security, injection attacks, tampering

**Dana the Accessibility User:**
- Uses screen reader
- Keyboard-only navigation
- High-contrast mode
- Tests: ARIA labels, tab order, focus indicators

**Eve the International User:**
- Non-English language
- Different locale (date/currency formats)
- International shipping address
- Tests: i18n, localization, timezone handling

### 5. Boundary Testing

Explore boundaries of acceptable input.

**Example: Age Field**

```
Valid: 18-120

Test Cases:
- Minimum: 18
- Just below minimum: 17 (invalid)
- Just above minimum: 19
- Maximum: 120
- Just above maximum: 121 (invalid)
- Just below maximum: 119
- Zero: 0 (invalid)
- Negative: -1 (invalid)
- Decimal: 18.5
- Very large: 999999
- Non-numeric: "abc"
- Special chars: "18@#$"
- Empty: ""
- Null
```

### 6. State Transition Testing

Explore different system states and transitions.

**Example: Order States**

```
States: Pending → Paid → Shipped → Delivered → Completed

Test Transitions:
✅ Valid:
- Pending → Paid (payment successful)
- Paid → Shipped (order dispatched)
- Shipped → Delivered (package arrived)
- Delivered → Completed (user confirmed)

❌ Invalid:
- Pending → Shipped (skip payment?)
- Shipped → Pending (reverse?)
- Completed → Pending (impossible?)
- Delivered → Paid (backwards?)

🤔 Edge Cases:
- Pending → Cancelled (user cancels)
- Paid → Refunded (user returns)
- Shipped → Lost (package lost)
- Multiple rapid state changes
- Concurrent state updates
```

---

## Exploratory Testing Process

### 1. Prepare

**Understand the Feature:**
- Read requirements/user stories
- Review design documents
- Check related bug reports
- Talk to developers

**Gather Tools:**
- Browser DevTools
- Proxy (Burp, Fiddler)
- SQL client (for database inspection)
- Postman (for API testing)
- Screen reader (for accessibility)
- Note-taking tool

**Set Up Environment:**
- Test account with various permissions
- Test data (users, products, etc.)
- Multiple browsers/devices
- Network throttling tools

### 2. Charter

**Write a Clear Charter:**

```
Feature: User Profile Settings
Area: Security settings
Goal: Find vulnerabilities in password change flow
Time: 60 minutes
Approach: Security-focused testing
```

### 3. Explore

**Think Aloud:**
- Narrate what you're doing
- Document observations
- Note surprising behavior
- Record questions

**Be Curious:**
- "What if I...?"
- "Why does it...?"
- "How does it handle...?"

**Follow Your Nose:**
- If something seems odd, investigate
- Don't stick rigidly to charter
- Pursue interesting bugs

### 4. Document

**During Session:**
- Take notes (bugs, observations, questions)
- Screenshots/videos of issues
- Browser console errors
- Network requests (DevTools)

**After Session:**
- Write bug reports
- Update charter with findings
- Note areas for future exploration
- Share insights with team

---

## Exploratory Testing Example

### Charter: Explore File Upload Functionality

**Duration:** 90 minutes
**Goal:** Find edge cases and security issues in file upload

**Test Ideas:**

#### 1. File Types
```
✅ Test valid types (PDF, JPG, PNG)
❌ Test invalid types (EXE, SH, BAT)
🤔 Test edge cases:
   - No extension (file.txt → file)
   - Double extension (file.jpg.exe)
   - Case sensitivity (FILE.JPG, file.JpG)
   - Mime type mismatch (EXE renamed to JPG)
```

#### 2. File Sizes
```
Assuming 10MB limit:
- 1 byte file
- 10 MB (exactly at limit)
- 10 MB + 1 byte (just over limit)
- 100 MB (way over limit)
- 0 byte file (empty)
- 5 GB (extremely large)
```

#### 3. File Content
```
- Valid image
- Corrupted image
- Image with embedded malware
- HTML file disguised as image
- SVG with JavaScript
- Zip bomb
```

#### 4. File Names
```
- Very long name (>255 chars)
- Special characters (../../etc/passwd)
- Unicode characters (日本語.jpg)
- Spaces and symbols (#, %, &, @)
- SQL injection ('; DROP TABLE--.jpg)
- XSS (<script>alert('XSS')</script>.jpg)
```

#### 5. Upload Process
```
- Upload while offline (then reconnect)
- Cancel mid-upload
- Upload same file twice
- Upload multiple files simultaneously
- Close browser during upload
- Upload from different devices concurrently
```

#### 6. Server Response
```
- What happens on successful upload?
- Error messages clear and helpful?
- Partial upload handling
- Duplicate file handling
- Storage limit reached
```

**Findings:**

```markdown
## Bugs Found:

BUG-001: File upload accepts .exe files despite restrictions
- Severity: High
- Steps: Rename malicious.exe to malicious.jpg, upload succeeds
- Expected: File should be rejected based on actual file type, not extension

BUG-002: No file size validation on client side
- Severity: Medium
- Steps: Select 5GB file, upload button enabled, wastes bandwidth
- Expected: Client-side validation should prevent upload attempt

BUG-003: Path traversal in filename
- Severity: Critical
- Steps: Upload file named ../../etc/passwd.jpg
- Actual: File saved outside uploads directory
- Expected: Filename should be sanitized

## Questions:

- What is the maximum number of files a user can upload?
- Are uploaded files scanned for viruses?
- How long are uploaded files retained?
- What happens if storage is full?
```

---

## Tools for Exploratory Testing

### Browser DevTools

**Console:**
- JavaScript errors
- Network errors
- Custom logging

**Network Tab:**
- API requests/responses
- Response times
- Failed requests
- Headers

**Application Tab:**
- LocalStorage
- SessionStorage
- Cookies
- Cache

### Testing Tools

**Proxy Tools:**
- **Burp Suite**: Intercept and modify requests
- **Fiddler**: HTTP debugging proxy
- **Charles Proxy**: HTTP proxy / monitor

**Screen Recording:**
- **Loom**: Quick screen recordings
- **OBS Studio**: Advanced recording
- **QuickTime (Mac)**: Built-in screen recorder

**Note-Taking:**
- **Obsidian**: Markdown notes with linking
- **Notion**: Collaborative documentation
- **OneNote**: Microsoft's note-taking app

**Bug Tracking:**
- **Jira**: Industry standard
- **GitHub Issues**: For open source
- **Linear**: Modern issue tracker

---

## Pair Exploratory Testing

**Why Pair?**
- Two perspectives find more bugs
- Knowledge sharing
- Reduces bias
- More fun and engaging

**Roles:**

**Driver:**
- Controls keyboard/mouse
- Executes tests
- Narrates actions

**Navigator:**
- Observes and thinks
- Suggests test ideas
- Documents findings
- Asks questions

**Switch roles every 15-30 minutes.**

**Example Session:**

```
Navigator: "What happens if we submit the form with no data?"

Driver: *Clicks submit* "We get a generic error message"

Navigator: "Interesting. Try filling just one field. Does it validate each field individually or all at once?"

Driver: *Tests* "It validates all at once. The error doesn't tell us which fields are required though."

Navigator: "That's a usability issue. Let me note that down. Now try putting HTML tags in the name field..."
```

---

## Measuring Exploratory Testing

### Session Report

```markdown
## Exploratory Testing Session Report

**Tester:** Jane Doe
**Date:** 2025-01-22
**Duration:** 90 minutes
**Charter:** Explore checkout flow for edge cases

**Test Coverage:**
- Payment processing: 30 minutes
- Shipping options: 20 minutes
- Discount codes: 25 minutes
- Order summary: 15 minutes

**Findings:**
- Bugs found: 4 (2 high, 2 medium)
- Questions raised: 3
- Test ideas for future: 5

**Bugs:**
1. BUG-456: Discount code applies twice if clicked rapidly
2. BUG-457: Free shipping displays negative price with coupon
3. BUG-458: Order summary doesn't update after address change
4. BUG-459: Payment fails silently with no error message

**Test Ideas:**
- Test checkout with items from multiple sellers
- Test with international credit cards
- Test checkout during high load
- Test saved payment methods
- Test guest checkout flow

**Metrics:**
- Test coverage: 60% of charter completed
- Bug density: 4 bugs / 90 minutes
- Severity: 50% high priority
```

---

## Common Exploratory Testing Mistakes

### Mistake 1: No Structure or Focus
**Problem:** Aimless clicking, miss important areas

**Fix:** Use charters, time-box sessions, focus on risks

### Mistake 2: Not Documenting Findings
**Problem:** Forget bugs, can't reproduce, no evidence

**Fix:** Take notes during testing, screenshots, screen recordings

### Mistake 3: Testing Only Happy Paths
**Problem:** Miss edge cases and error handling

**Fix:** Be deliberately destructive, test invalid inputs, break things

### Mistake 4: Not Learning from Bugs
**Problem:** Find same bug type repeatedly

**Fix:** Create bug patterns, share with team, update test approach

### Mistake 5: Ignoring Context
**Problem:** Test irrelevant scenarios

**Fix:** Understand business priorities, user workflows, risk areas

---

## What Senior Engineers Know

**Exploratory testing is a skill.** Junior testers find obvious bugs. Senior testers find subtle, critical bugs through experience and intuition.

**Automate the boring stuff, explore the interesting stuff.** Don't explore standard login/logout repeatedly. Explore complex workflows, integrations, and edge cases.

**Document everything.** If you don't write it down, it didn't happen. Bug reports, observations, questions - all valuable.

**Know when to stop.** Exploratory testing can go on forever. Use charters and time-boxes to maintain focus.

**Security bugs often found through exploration.** Automated tests check expected behavior. Exploratory tests try to break security, find injection points, bypass auth.

---

## Exercise

**Exploratory Testing Session:**

Choose a public website (or your own project) and conduct a 60-minute exploratory testing session.

**Charter:**
```
Feature: [Choose a feature, e.g., search, login, checkout]
Goal: Find bugs and edge cases
Duration: 60 minutes
Approach: [Choose a technique, e.g., Obsessive-Compulsive Tour]
```

**Deliverable:**

1. Session report documenting:
   - What you tested
   - Bugs found (with severity)
   - Questions for development team
   - Test ideas for future sessions

2. At least 3 bug reports with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or screen recording
   - Severity and priority

---

## Next Steps

- Master [Regression Strategy](07-regression-strategy.md) for stable releases
- Learn [Test Data Management](08-test-data-management.md) for realistic testing
- Practice [API Testing](02-api-testing.md) for backend exploration
- Study [Web Testing Strategies](01-web-testing-strategies.md) for UI exploration
