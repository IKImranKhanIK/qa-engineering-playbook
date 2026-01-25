# Common QA Interview Questions

Comprehensive collection of interview questions with sample answers and what interviewers are looking for.

## How to Use This Guide

- **Read the question** and formulate your own answer first
- **Review the sample answer** for structure and key points
- **Adapt to your experience** - use your own examples
- **Practice out loud** - don't just read silently
- **Focus on principles** over memorization

---

## Foundation Questions

### 1. What is the difference between QA and QC?

**What they're looking for:** Understanding of quality concepts, ability to articulate differences clearly.

**Sample Answer:**
"QA (Quality Assurance) is process-oriented and focuses on preventing defects through establishing quality standards, processes, and best practices. It's proactive. QC (Quality Control) is product-oriented and focuses on detecting defects through inspection and testing. It's reactive.

For example, QA would be establishing a code review process to catch issues early, while QC would be running tests on a build to find bugs. In my previous role, I did both - I helped define our testing standards (QA) and executed test plans to validate builds (QC)."

**Follow-up questions you might get:**
- "What is Quality Engineering then?"
- "Which is more important?"

---

### 2. What is the difference between verification and validation?

**What they're looking for:** Understanding of core testing concepts.

**Sample Answer:**
"Verification asks 'Are we building the product right?' - confirming we're meeting specifications. Validation asks 'Are we building the right product?' - confirming it meets user needs.

For example, verification would check that a password field enforces 8-character minimum as specified. Validation would confirm users can actually log in successfully and the feature solves their authentication needs.

Verification happens throughout development (reviews, inspections), while validation typically happens during testing with real usage scenarios."

---

### 3. Explain the test pyramid.

**What they're looking for:** Understanding of test strategy, ability to explain concepts visually.

**Sample Answer:**
"The test pyramid is a visual guide for test automation distribution. The base is unit tests (70% - fast, cheap, abundant), middle is integration tests (20% - moderate speed and cost), and top is E2E/UI tests (10% - slow, expensive, brittle).

The shape indicates you should have many unit tests because they're fast and stable, fewer integration tests, and minimal E2E tests for critical paths only. The anti-pattern is the ice cream cone - heavy on slow E2E tests, light on unit tests - which makes test suites slow and unmaintainable.

In my last project, we started with too many E2E tests. I refactored by pushing tests down the pyramid - converting E2E tests to API tests where possible, which reduced execution time from 2 hours to 20 minutes."

---

## Testing Strategy Questions

### 4. How would you test a login page?

**What they're looking for:** Test case design thinking, comprehensive coverage, prioritization.

**Sample Answer:**
"I'd approach this systematically:

**Functional Testing:**
- Valid credentials → successful login
- Invalid username → error message
- Invalid password → error message
- Empty fields → validation errors
- SQL injection attempts → rejected
- XSS attempts → sanitized

**Non-Functional:**
- Response time < 2 seconds
- Password masked in UI
- HTTPS enforced
- Session management secure
- Accessibility (screen reader, keyboard navigation)

**Integration:**
- Database authentication works
- Session stored correctly
- Redirect to correct page
- Remember me functionality
- Password reset flow

**Edge Cases:**
- Account lockout after failed attempts
- Case sensitivity
- Special characters in credentials
- Concurrent login attempts
- Login from multiple devices

**Priority:** I'd test valid/invalid credentials and security basics first (SQL injection, XSS), then edge cases, then non-functional aspects."

---

### 5. How do you decide what to automate?

**What they're looking for:** Strategic thinking, ROI understanding, practical experience.

**Sample Answer:**
"I use several criteria:

**Good Automation Candidates:**
- Repetitive tests (regression)
- Stable features (not changing frequently)
- Time-consuming manual tests
- Tests run on multiple environments/browsers
- High business value / risk
- Deterministic (same input = same output)

**Poor Automation Candidates:**
- Exploratory testing
- Tests requiring human judgment (UX, visual)
- Frequently changing features
- One-time tests
- Tests that are harder to automate than execute manually

**ROI Calculation:**
If a test takes 30 minutes manually, runs 10 times per sprint, that's 5 hours. If automation takes 2 hours to write and 5 minutes to run, you break even after 2 sprints.

In my previous role, we automated our smoke test suite (30 critical paths) which ran on every deployment. That saved our team about 40 hours per week and paid for itself immediately."

---

## Automation Questions

### 6. What automation tools have you used?

**What they're looking for:** Hands-on experience, tool knowledge, ability to compare tools.

**Sample Answer:**
"I've worked primarily with Selenium WebDriver for UI automation and pytest for test framework. For API testing, I use Postman for exploratory work and REST Assured for automated tests.

**Selenium:** Great for cross-browser testing, mature ecosystem. Challenges are flaky tests if not using good practices like explicit waits.

**Playwright:** Recently adopted for its built-in waiting, better reliability, and faster execution compared to Selenium.

**pytest:** Excellent fixture system, parametrization, and plugin ecosystem. Used it for unit, integration, and E2E tests.

I've also used Jenkins for CI/CD, integrated our tests to run on every PR and deployment. Currently learning Cypress for modern web apps.

I choose tools based on team skillset, application tech stack, and maintenance overhead. For a new project, I'd evaluate based on these factors rather than defaulting to what I know."

---

### 7. How do you handle flaky tests?

**What they're looking for:** Problem-solving approach, understanding of root causes, practical experience.

**Sample Answer:**
"Flaky tests are tests that pass/fail inconsistently. They erode confidence in automation, so I treat them as critical bugs.

**Common Causes:**
- Timing issues (use explicit waits, not sleep)
- Test interdependence (ensure isolation)
- Shared state (clean up properly)
- External dependencies (use mocks for unit tests)
- Asynchronous operations (wait for conditions, not fixed time)
- Test data conflicts (use unique data per test)

**My Approach:**
1. **Reproduce:** Run test 50-100 times to confirm flakiness
2. **Investigate:** Check logs, screenshots, video recordings
3. **Fix:** Address root cause (usually timing or state)
4. **Verify:** Re-run 100 times to confirm stable
5. **If unfixable:** Delete or mark as manual test

**Example:** We had a checkout test failing 20% of the time. Investigation showed payment API occasionally took >5 seconds, but test waited only 3 seconds. Fixed by implementing dynamic wait for API response with 10 second timeout. Test has been 100% stable for 6 months.

**Prevention:** Code review for hardcoded waits, test isolation, proper teardown, avoiding shared test data."

---

## Bug/Defect Questions

### 8. What makes a good bug report?

**What they're looking for:** Communication skills, attention to detail, understanding of bug life cycle.

**Sample Answer:**
"A good bug report allows developers to reproduce and fix the issue quickly. Key elements:

**Essential:**
1. **Clear title:** Concise, specific (not just 'button broken')
2. **Steps to reproduce:** Detailed, numbered steps
3. **Expected vs actual result:** What should happen vs what happens
4. **Environment:** Browser, OS, version, test data
5. **Severity/Priority:** Impact and urgency
6. **Attachments:** Screenshots, logs, videos

**Good Example:**
```
Title: Checkout fails with error 500 when applying discount code

Steps:
1. Add item to cart
2. Proceed to checkout
3. Enter discount code 'SAVE20'
4. Click 'Apply'

Expected: Discount applied, total reduced by 20%
Actual: Error 500, checkout broken

Environment: Chrome 118, Windows 11, Prod
Severity: High (checkout broken)
Priority: P1 (revenue impact)
Attachments: screenshot-error.png, console-log.txt
```

**What NOT to do:**
- Vague descriptions ('something is wrong')
- No reproduction steps
- Missing environment details
- Emotional language ('this is terrible')
- Multiple bugs in one report

In my experience, well-written bugs get fixed 2-3x faster because developers don't need to ask for clarification."

---

### 9. How do you prioritize bugs?

**What they're looking for:** Decision-making ability, understanding of severity vs priority, business awareness.

**Sample Answer:**
"I distinguish between severity (technical impact) and priority (business urgency):

**Severity Levels:**
- Critical: Data loss, security breach, system crash
- High: Major function broken
- Medium: Minor function broken, workaround exists
- Low: Cosmetic issues

**Priority Levels:**
- P1: Fix immediately (blocks release, revenue impact)
- P2: Fix before release
- P3: Fix in next sprint
- P4: Backlog

**Examples of Mismatch:**
- **Low severity, high priority:** Logo typo before investor demo
- **High severity, low priority:** Admin panel crashes (2 users, they have workaround)

**My Approach:**
1. Assess technical severity
2. Collaborate with product on business priority
3. Consider: user impact, revenue impact, compliance, customer commitments
4. Document decision and rationale
5. Re-evaluate as context changes

**Real Example:** Found a high severity bug (payment processing error) affecting 5% of transactions. Product made it P1 immediately due to revenue impact. Fixed within 4 hours with hotfix."

---

## Scenario-Based Questions

### 10. You found a critical bug 1 day before release. What do you do?

**What they're looking for:** Judgment, communication, stakeholder management, pressure handling.

**Sample Answer:**
"This requires quick assessment and clear communication:

**Immediate Actions:**
1. **Verify the bug:** Ensure it's reproducible and actually critical
2. **Assess impact:** Who's affected? How bad is it?
3. **Document clearly:** Detailed bug report with evidence
4. **Escalate immediately:** Notify QA lead, dev lead, product owner

**Communication:**
'Found critical bug: [brief description]. Impact: [users affected, business impact]. Reproduction: [steps]. Evidence: [screenshots/logs]. Recommend: [delay release or hotfix plan].'

**Decision Factors:**
- Workaround available?
- Percentage of users affected?
- Revenue impact?
- Can we hotfix quickly?
- Risk of delaying release?

**Possible Outcomes:**
- **Delay release:** If no workaround, high impact
- **Release with known issue:** If workaround exists, low impact, document and monitor
- **Hotfix immediately after:** Release as planned, fix and patch within hours

**Real Example:** Day before release, found payments failing for users with saved cards (30% of users). Recommended delay. Team fixed overnight, released 1 day late. Better than launching broken payments.

**What NOT to do:**
- Stay silent hoping it won't matter
- Blame others
- Make the decision alone (not your call on release)
- Be unclear in communication"

---

### 11. The development team says a bug you reported is 'working as designed.' How do you respond?

**What they're looking for:** Conflict resolution, technical understanding, collaboration skills.

**Sample Answer:**
"This is common and requires professional handling:

**My Approach:**
1. **Understand their perspective:** Ask them to explain the design rationale
2. **Check requirements:** Review original specs together
3. **Consider user impact:** 'Design intent aside, does this behavior make sense for users?'
4. **Involve product owner:** They decide if current design meets user needs

**Possible Outcomes:**
- **I'm wrong:** Design is correct, I misunderstood. Close bug, update my understanding.
- **Design is poor:** Spec says one thing, but UX is bad. Convert to improvement request.
- **Spec is unclear:** Ambiguous requirement. Get clarification, update documentation.

**Real Example:**
Reported bug: 'Search returns zero results when query has typo.'
Developer: 'That's how exact matching works, as designed.'
My response: 'Understood on technical behavior. However, users expect fuzzy matching like Google. Can we discuss with product if exact matching meets user needs?'
Result: Product agreed fuzzy matching was better UX. Became feature request for next sprint.

**Professional Communication:**
- Use objective language
- Focus on user impact, not being 'right'
- Collaborate, don't argue
- Document the conversation
- Accept when you're wrong

**What NOT to do:**
- Insist you're right without evidence
- Go over developer's head immediately
- Reopen bug without new information
- Take it personally"

---

## Technical Deep-Dive Questions

### 12. Explain how you would set up a test automation framework from scratch.

**What they're looking for:** Architecture thinking, best practices knowledge, practical experience.

**Sample Answer:**
"I'd follow these steps:

**1. Requirements Gathering:**
- What are we testing? (Web UI, APIs, mobile, all?)
- Who will maintain it? (skill levels)
- What's our tech stack?
- CI/CD integration needed?

**2. Tool Selection:**
- **Language:** Match team skills (Python, Java, JavaScript)
- **Framework:** pytest/JUnit/Jest based on language
- **UI tool:** Selenium/Playwright/Cypress
- **Reporting:** Allure, pytest-html, or built-in

**3. Framework Structure:**
```
test-automation/
├── tests/
│   ├── api/
│   ├── ui/
│   └── integration/
├── pages/          # Page objects for UI
├── utils/          # Helper functions
├── config/         # Environment configs
├── data/           # Test data
├── reports/        # Test results
└── requirements.txt / package.json
```

**4. Core Components:**
- **Base test class:** Setup/teardown, logging
- **Page objects:** Encapsulate UI interactions
- **API client:** Reusable API calls
- **Config management:** Environment switching
- **Test data:** Fixtures, factories
- **Reporting:** Clear, actionable reports

**5. Best Practices:**
- Independent tests (can run in any order)
- Clear naming conventions
- Retry logic for flaky infrastructure
- Parallel execution capability
- Environment-agnostic

**6. CI/CD Integration:**
- Run on every PR
- Run full suite nightly
- Report results to Slack/email
- Block merges on failures

**Real Example:**
Built framework for e-commerce site. Started with 10 critical path tests, grew to 500 over 6 months. Execution time kept under 30 minutes via parallelization. Caught 40+ bugs before production in first quarter."

---

### 13. How would you test a REST API?

**What they're looking for:** API testing knowledge, HTTP understanding, thoroughness.

**Sample Answer:**
"I'd test multiple aspects:

**Functional Testing:**
- **HTTP Methods:** Verify GET, POST, PUT, DELETE work as expected
- **Status Codes:** 200 success, 404 not found, 400 bad request, 500 server error
- **Response Body:** Structure, data types, required fields
- **Request Validation:** Required params enforced, optional params handled
- **Business Logic:** Calculations, workflows, state transitions

**Example Test Cases for POST /api/users:**
```
1. Valid user creation → 201 Created, user ID returned
2. Duplicate email → 409 Conflict
3. Missing required field → 400 Bad Request
4. Invalid email format → 400 Bad Request
5. SQL injection attempt → Rejected safely
```

**Non-Functional:**
- **Performance:** Response time < 500ms
- **Security:** Authentication required, authorization enforced
- **Error Handling:** Clear error messages, no stack traces exposed
- **Rate Limiting:** Enforced at specified threshold

**Integration:**
- **Database:** Data persisted correctly
- **Other APIs:** Dependent services called
- **Events:** Messages published to queue

**Tools:**
- **Manual:** Postman for exploration
- **Automation:** REST Assured (Java), Requests + pytest (Python)
- **Contract Testing:** Pact for API contracts
- **Performance:** JMeter or k6 for load testing

**Real Example:**
Testing payment API, I found it returned 200 even when payment failed (error in response body). Reported as bug - should return 402 or 400. Fixed to use proper status codes, improved error handling for clients."

---

## Behavioral Questions

### 14. Tell me about a time you found a critical bug that no one else caught.

**What they're looking for:** Impact, initiative, problem-solving, communication.

**Sample Answer (STAR format):**

**Situation:**
Working on e-commerce checkout redesign, week before launch. Team completed functional testing, considered it done.

**Task:**
During final exploratory testing session, decided to test edge cases not covered in test plan.

**Action:**
Tested checkout with saved payment method plus new discount code feature. Found that applying discount caused payment to fail with cryptic error. Issue wasn't in test plan because it required combination of two features.

Immediately:
1. Reproduced 10/10 times to confirm
2. Checked impact: Affected 30% of users (those with saved cards)
3. Wrote detailed bug report with reproduction steps, logs, and customer impact
4. Escalated to team lead with recommendation to delay launch

**Result:**
Team delayed launch by 2 days to fix. Root cause was discount calculation bug in payment processor integration. Fix verified, launched successfully. Received recognition for thoroughness and potentially saving company from major production issue.

**Lesson:** Always test feature combinations and edge cases, not just happy paths."

---

### 15. Describe a disagreement you had with a developer. How did you handle it?

**What they're looking for:** Conflict resolution, professionalism, collaboration, communication skills.

**Sample Answer:**

**Situation:**
Reported bug: Form submission button disabled indefinitely if API call times out.

Developer response: 'Users should retry if it fails. Not a bug.'

**Task:**
Resolve disagreement professionally while ensuring good user experience.

**Action:**
1. **Understood their perspective:** Asked about implementation challenges
2. **Presented user perspective:** Showed that users don't know to refresh, leads to support tickets
3. **Brought data:** Found 15 support tickets in past month about 'stuck' forms
4. **Proposed solution:** Enable button after timeout with error message, allowing retry
5. **Involved product owner:** Got their perspective on UX expectations

**Discussion:**
Developer's concern: Allowing retry could cause duplicate submissions.
My response: We can disable button during call, re-enable on timeout, add duplicate prevention logic.
Product owner: Agreed with UX improvement, prioritized for next sprint.

**Result:**
Became enhancement rather than bug. Implemented with duplicate prevention. Support tickets dropped to zero in following month.

**Lesson:**
- Focus on user impact and data, not being 'right'
- Understand technical constraints
- Propose solutions, not just problems
- Involve right stakeholders
- Professional, collaborative approach"

---

## Rapid-Fire Short Questions

### 16. What's the difference between smoke and sanity testing?

**Answer:**
"**Smoke testing** is a broad, shallow test of major functionality to verify build is stable enough for detailed testing. Think 'does it turn on?'

**Sanity testing** is narrow and deep, verifying specific functionality after a fix or change. Think 'did the fix actually work?'

Example: After deployment, smoke test checks login, search, checkout all work at basic level. After fixing search bug, sanity test deeply validates all search scenarios work correctly."

---

### 17. What is regression testing?

**Answer:**
"Regression testing verifies that new changes haven't broken existing functionality. You re-run tests for unchanged features to ensure they still work.

Essential because code is interconnected - fixing one thing can break another. Usually automated for efficiency.

Example: After adding a new payment method, run all existing checkout tests to ensure previous payment methods still work."

---

### 18. What's the difference between functional and non-functional testing?

**Answer:**
"**Functional testing** validates what the system does - features and behaviors. Tests against requirements.

**Non-functional testing** validates how the system performs - quality attributes like performance, security, usability, reliability.

Examples:
- Functional: Login with valid credentials succeeds
- Non-functional: Login response time < 2 seconds"

---

### 19. What is exploratory testing?

**Answer:**
"Exploratory testing is simultaneous test design and execution, where the tester uses their knowledge and creativity to find bugs without pre-written test cases.

Not random - it's guided by tester experience, risk areas, and what you learn as you test.

I use it to supplement scripted tests, especially for:
- New features without complete specs
- Finding edge cases
- Usability issues
- After automation to find what scripts miss

Usually time-boxed (e.g., 90-minute session with specific charter like 'explore payment errors')."

---

### 20. How do you stay current with QA trends?

**Answer:**
"Multiple ways:

**Learning:**
- Follow QA blogs (Ministry of Testing, Martin Fowler)
- Listen to podcasts (Test Guild, AB Testing)
- Take courses (Udemy, Coursera, Test Automation University)

**Community:**
- Attend meetups and conferences (SeleniumConf, Agile Testing Days)
- Participate in forums (Reddit r/QualityAssurance, Stack Overflow)
- Follow QA thought leaders on Twitter/LinkedIn

**Practice:**
- Try new tools and frameworks
- Contribute to open source
- Personal projects

**At Work:**
- Lunch-and-learn sessions
- Share learnings with team
- Experiment during hack days

Recently learned Playwright, currently exploring AI-assisted testing. Share what I learn via internal tech talks."

---

## Questions TO ASK The Interviewer

Always prepare questions. Shows interest and helps you evaluate the company.

### About the Role
- "What does a typical day look like for this role?"
- "What are the biggest challenges the QA team faces currently?"
- "How is QA integrated into the development process?"
- "What's the balance between manual and automated testing?"
- "What tools and technologies does the team use?"

### About the Team
- "How large is the QA team? How is it structured?"
- "Who would I be working with most closely?"
- "How does the team handle disagreements or conflicts?"
- "What's the team's approach to professional development?"

### About the Company
- "How does the company prioritize quality?"
- "What's the deployment frequency?"
- "How are outages or production issues handled?"
- "What's the company's approach to tech debt?"

### About Growth
- "What does success look like in this role?"
- "What are typical career paths for someone in this position?"
- "How does the company support learning and development?"
- "Are there opportunities to work on different technologies or projects?"

### Red Flags to Listen For
- "We don't really have time for testing"
- "QA is just about finding bugs"
- "We'll build automation eventually"
- "Developers don't write tests"
- Vague answers about processes
- No clear career growth path

---

## Interview Preparation Checklist

### Before Interview
- [ ] Research company and products
- [ ] Review job description thoroughly
- [ ] Prepare STAR stories (5-7 examples)
- [ ] Practice common questions out loud
- [ ] Prepare questions to ask
- [ ] Review your resume (know every detail)
- [ ] Test technology (video, audio) for remote interview
- [ ] Prepare environment (quiet, professional background)

### During Interview
- [ ] Join 5 minutes early
- [ ] Professional appearance
- [ ] Take notes
- [ ] Ask clarifying questions
- [ ] Use STAR format for behavioral questions
- [ ] Be honest about what you don't know
- [ ] Show enthusiasm
- [ ] Ask your prepared questions

### After Interview
- [ ] Send thank you email within 24 hours
- [ ] Reflect on what went well and what to improve
- [ ] Follow up if you don't hear back in stated timeframe
- [ ] If rejected, ask for feedback

---

## Next Steps

- Complete [Technical Assessments](03-technical-assessments.md) practice
- Build your [Portfolio](04-building-portfolio.md)
- Plan your [Career Advancement](05-career-advancement.md)
- Practice these questions with a friend or mentor
- Record yourself answering - listen for filler words, clarity
- Join interview prep groups for mock interviews
