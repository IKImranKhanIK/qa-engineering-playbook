# Severity vs Priority

## Overview

Severity and priority are distinct dimensions for classifying defects. Confusing them leads to miscommunication and poor resource allocation.

## Definitions

### Severity
**Question:** How bad is the technical impact?

**Focus:** Functional impact on the system

**Determined by:** Technical assessment

**Examples:**
- Critical: Data loss, security breach, system crash
- High: Major function broken
- Medium: Minor function broken, workaround exists
- Low: Cosmetic issue, typo

### Priority
**Question:** How soon must this be fixed?

**Focus:** Business urgency

**Determined by:** Business stakeholders, product owners

**Examples:**
- P1: Fix immediately, blocks release
- P2: Fix before release
- P3: Fix in next sprint
- P4: Fix eventually or never

## Key Distinction

**Severity = Technical impact**
**Priority = Business urgency**

These are independent dimensions. A bug can be:
- High severity, low priority
- Low severity, high priority
- High severity, high priority
- Low severity, low priority

## Severity Levels

### Critical (S1)
**Impact:** System unusable, data loss, security breach

**Examples:**
- Application crashes on launch
- Database corruption
- User passwords exposed
- Payment processing completely broken
- Data privacy violation

**Characteristics:**
- Affects all or most users
- No workaround
- Prevents primary function

### High (S2)
**Impact:** Major functionality broken

**Examples:**
- Search returns no results
- Cannot upload files
- Reports show incorrect data
- Email notifications not sending
- Login fails for certain user types

**Characteristics:**
- Affects many users
- Workaround may exist but difficult
- Breaks important feature

### Medium (S3)
**Impact:** Minor functionality broken or degraded

**Examples:**
- Pagination broken, but scrolling works
- Error message unclear
- Feature slower than expected
- Minor calculation error with rare inputs
- Edge case fails

**Characteristics:**
- Affects some users or rare scenarios
- Workaround exists and reasonable
- Degraded but functional

### Low (S4)
**Impact:** Cosmetic or trivial

**Examples:**
- Button slightly misaligned
- Typo in help text
- Inconsistent spacing
- Color mismatch from design
- Icon missing from one screen

**Characteristics:**
- Minimal user impact
- Aesthetic or minor quality issue
- Does not affect functionality

## Priority Levels

### P1 (Immediate)
**Urgency:** Drop everything, fix now

**Examples:**
- Production outage
- Security breach
- Data loss in progress
- CEO demo tomorrow
- Blocking all testing

**Timeframe:** Hours

### P2 (High)
**Urgency:** Fix before release

**Examples:**
- Blocks major feature
- Regulatory requirement
- Customer commitment
- Release blocker

**Timeframe:** Days

### P3 (Medium)
**Urgency:** Fix in upcoming sprint

**Examples:**
- Improves user experience
- Reduces support burden
- Addresses frequent complaint
- Competitive parity

**Timeframe:** Weeks

### P4 (Low)
**Urgency:** Fix when convenient or never

**Examples:**
- Minor improvement
- Rarely encountered
- Affects deprecated feature
- Nice to have

**Timeframe:** Months or never

## Severity vs Priority Matrix

```
            Priority
           P1    P2    P3    P4
         ┌─────┬─────┬─────┬─────┐
    S1   │ Yes │ Yes │ No  │ No  │
         ├─────┼─────┼─────┼─────┤
Severity S2│ Yes │Maybe│ Yes │Maybe│
         ├─────┼─────┼─────┼─────┤
    S3   │Maybe│ Yes │ Yes │ Yes │
         ├─────┼─────┼─────┼─────┤
    S4   │Maybe│Maybe│Maybe│ Yes │
         └─────┴─────┴─────┴─────┘

Yes = Common, expected combination
Maybe = Possible, context-dependent
No = Unusual, questionable combination
```

## Real-World Examples

### High Severity, Low Priority

**Bug:** Admin dashboard crashes when viewing reports

**Severity:** S1 (Critical) - Complete feature failure

**Priority:** P4 (Low) - Only affects 2 internal users, they use spreadsheets instead

**Rationale:** Technically severe, but business impact is minimal. Fix when convenient.

### Low Severity, High Priority

**Bug:** Company logo slightly misaligned on homepage

**Severity:** S4 (Low) - Cosmetic issue

**Priority:** P1 (Immediate) - CEO noticed before board meeting tomorrow

**Rationale:** Trivial technical issue, but high business visibility.

### High Severity, High Priority

**Bug:** Payment processing returns errors for all transactions

**Severity:** S1 (Critical) - Core functionality broken

**Priority:** P1 (Immediate) - Losing revenue every minute

**Rationale:** Both technically and commercially critical. All hands on deck.

### Low Severity, Low Priority

**Bug:** Tooltip has minor typo in rarely used admin feature

**Severity:** S4 (Low) - Cosmetic

**Priority:** P4 (Low) - Few users, minimal impact

**Rationale:** Fix if someone has time, otherwise ignore.

## Who Decides?

### Severity: QA Engineer
Based on technical assessment:
- System behavior
- Impact scope
- Technical consequences
- Workaround availability

### Priority: Product Owner / Business Stakeholder
Based on business context:
- User impact
- Business value
- Contractual obligations
- Market timing
- Resource availability

### Collaborative Discussion

Sometimes requires negotiation:

**QA:** "This is S2 severity, major function is broken."

**Product:** "Agreed, but only 1% of users use this feature, and we have a workaround documented. I'm setting P3."

**QA:** "Understood. I'll document the workaround in the bug."

## Impact on Workflow

### Bug Triage Meeting

**Agenda:**
1. Review new bugs
2. Confirm severity (technical assessment)
3. Assign priority (business decision)
4. Assign owner
5. Set target fix version

**Example Discussion:**

**Bug:** Export to Excel produces corrupted file

**QA:** "I classified this as S2. Export completely fails, but export to CSV works."

**Product:** "How many users export to Excel vs CSV?"

**Data Analyst:** "70% use Excel, 30% CSV."

**Product:** "P2 then. Fix before next release. Excel is widely used."

### Sprint Planning

**P1 bugs:** Interrupt current sprint, fix immediately

**P2 bugs:** Must include in sprint if release planned

**P3 bugs:** Backlog, prioritize against features

**P4 bugs:** Tech debt, fix when slow

## Common Mistakes

### Treating Severity and Priority as the Same

**Symptom:** Every S1 bug is P1, every S4 is P4

**Problem:** Ignores business context

**Fix:** Independently assess technical impact and business urgency

### "Everything is Critical"

**Symptom:** Developers complain all bugs marked critical

**Problem:** Severity inflation, loses meaning

**Fix:** Use clear criteria, educate on proper classification

### QA Sets Priority

**Symptom:** QA marks bugs P1 without consulting product

**Problem:** QA doesn't have business context for urgency decisions

**Fix:** QA suggests priority, product owner decides

### Ignoring Low Priority Bugs

**Symptom:** P4 bugs accumulate indefinitely

**Problem:** Eventually causes quality degradation

**Fix:** Dedicate % of sprint to tech debt, close stale bugs

## Severity Assessment Criteria

### Data Loss or Corruption
Automatically S1, regardless of scope

### Security Vulnerability
S1 if exploitable in production, S2 if theoretical

### Percentage of Users Affected
- >50%: S1-S2
- 10-50%: S2-S3
- <10%: S3-S4

### Workaround Availability
- No workaround: Increase severity
- Easy workaround: Decrease severity
- Workaround requires expert knowledge: No change

### Functional Impact
- Core feature: S1-S2
- Secondary feature: S2-S3
- Nice-to-have feature: S3-S4

## Priority Assessment Criteria

### Revenue Impact
Directly losing money → P1

### User Impact
- All users blocked: P1
- Some users blocked: P2
- Users inconvenienced: P3
- Minimal impact: P4

### Contractual Obligations
Customer SLA at risk → P1

### Regulatory Compliance
Legal requirement → P1

### Release Timeline
- Blocks release: P1
- Should be in release: P2
- Can wait for next release: P3
- No timeline: P4

### Marketing/PR
Public visibility → Increase priority

## Communicating Severity and Priority

### In Bug Reports

**Clear:**
"Severity: S2 - Checkout fails for guest users (workaround: create account)
Priority: P1 - 30% of our customers are guest users, fix before Friday's release"

**Unclear:**
"Severity: Critical - THIS MUST BE FIXED NOW!!!"

### To Stakeholders

**To Engineering:**
"We have 3 S1 bugs and 5 S2 bugs. All P1/P2 must be fixed for release."

**To Management:**
"Release blocked by 2 P1 bugs. Estimated fix time: 8 hours. Can release tomorrow."

**To Customers:**
"We're aware of the checkout issue (P1, S2). Fix deploying in 2 hours. Workaround: use saved payment method."

## What Senior Engineers Know

**Priority changes, severity doesn't.** A bug's technical impact is fixed, but business urgency evolves. Reassess priority regularly.

**Context matters more than rules.** A typo in a customer-facing error message might be S4 normally, but S2 if the error fires constantly in production.

**"Won't fix" is okay for low priority bugs.** Not every bug deserves fixing. Close P4 bugs that won't realistically be addressed.

**The fight isn't worth it.** If product wants to ship with a known S2 bug and accepts the risk, document it and move on. They own the decision.

**Severity without context is useless.** "Critical bug" means nothing without explaining impact, scope, and workarounds.

## Exercise

Classify severity and priority for each scenario:

**Scenario 1:**
Mobile app crashes when user tries to change profile picture. Affects all users. Crash occurs 100% of the time. No workaround.

**Scenario 2:**
Admin report shows incorrect totals due to timezone calculation error. Affects 5 admin users. They can export raw data and calculate in Excel.

**Scenario 3:**
Typo in footer copyright year shows "2024" instead of "2025". CEO noticed and wants it fixed before investor meeting tomorrow.

**Scenario 4:**
Rare edge case: If user has exactly 0 items in cart and clicks checkout, gets error instead of helpful message. Happens <1% of time.

**Scenario 5:**
Production API experiencing 10% error rate due to database connection pool exhaustion. Users see intermittent failures.

**Answers:**

1. **S1/P1** - Critical severity (app crash, no workaround), immediate priority (all users affected)

2. **S3/P3** - Medium severity (incorrect data but workaround exists), medium priority (few users, not urgent)

3. **S4/P1** - Low severity (cosmetic), immediate priority (CEO visibility, deadline)

4. **S4/P4** - Low severity (rare edge case, minor issue), low priority (minimal impact)

5. **S1/P1** - Critical severity (production errors, data processing issues), immediate priority (active user impact)

## Next Steps

- Learn [Traceability and Requirements Coverage](07-traceability-requirements-coverage.md)
- Apply severity/priority to [Release Quality](../09-release-quality/)
