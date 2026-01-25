# Bug Triage Process

## Overview

Bug triage is the process of evaluating, prioritizing, and assigning bugs to ensure critical issues are fixed first and resources are allocated efficiently.

## Triage Meeting Structure

**Frequency:** Daily for active releases, weekly for maintenance

**Attendees:** QA Lead, Engineering Lead, Product Manager

**Duration:** 30-45 minutes

**Agenda:**
1. Review new bugs (5-10 min)
2. Re-evaluate existing bugs (10-15 min)
3. Assign P0/P1 bugs (10-15 min)
4. Review blockers (5-10 min)

## Bug Priority Framework

| Priority | SLA to Fix | Criteria | Examples |
|----------|------------|----------|----------|
| P0 | 24 hours | System down, data loss, security breach | Database corruption, login broken for all users |
| P1 | 1 week | Major feature broken, affects >50% users | Payment processing fails, crash on launch |
| P2 | 2-4 weeks | Minor feature broken, affects <50% users | Feature works but slow, UI glitch |
| P3 | Backlog | Cosmetic, nice-to-have | Typo, color inconsistency |
| P4 | Won't fix | Out of scope or obsolete | Request for unsupported feature |

## Triage Decision Tree

```
New Bug Reported
│
├─ Can users complete core workflows? ────────No──► P0 (Fix immediately)
│                                      └─Yes
├─ Does it affect revenue/security? ─────────Yes──► P1 (Fix this sprint)
│                                      └─No
├─ Does it affect >50% of users? ────────────Yes──► P2 (Fix next sprint)
│                                      └─No
└─ Cosmetic or edge case? ───────────────────Yes──► P3/P4 (Backlog)
```

## Triage Checklist

For each bug:
- [ ] Reproduce the issue
- [ ] Assign severity (P0-P4)
- [ ] Assign to owner
- [ ] Estimate effort (S/M/L)
- [ ] Add to milestone
- [ ] Tag affected components
- [ ] Notify stakeholders if P0/P1

## Automated Triage Rules

```javascript
const autoTriage = (bug) => {
  // Auto-assign P0 if keywords present
  if (bug.title.match(/(crash|down|login.*fail|data.*loss)/i)) {
    bug.priority = 'P0';
    bug.assignee = ON_CALL_ENGINEER;
    notifySlack(`🚨 P0 Bug: ${bug.title}`);
  }

  // Auto-assign to component owner
  if (bug.component === 'Authentication') {
    bug.assignee = 'auth-team@example.com';
  }

  // Auto-close duplicates
  const duplicates = await findDuplicates(bug);
  if (duplicates.length > 0) {
    bug.status = 'Duplicate';
    bug.linkedIssues = duplicates;
  }

  return bug;
};
```

## Summary

Effective bug triage requires:
- Clear priority definitions
- Consistent SLAs
- Quick initial assessment
- Regular re-evaluation
- Transparent communication

Triage prevents critical bugs from slipping through and ensures efficient use of engineering time.
