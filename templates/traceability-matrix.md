# Requirements Traceability Matrix

**Project:** [Project Name]
**Version:** [Version Number]
**Date:** YYYY-MM-DD
**Prepared By:** [Your Name]

---

## Purpose

This Requirements Traceability Matrix (RTM) links business requirements to test cases, ensuring complete test coverage and enabling impact analysis when requirements change.

---

## Coverage Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Requirements | [X] | 100% |
| Requirements with Test Cases | [X] | [X]% |
| Requirements without Test Cases | [X] | [X]% |
| Total Test Cases | [X] | - |
| Test Cases Passed | [X] | [X]% |
| Test Cases Failed | [X] | [X]% |
| Test Cases Not Executed | [X] | [X]% |

**Overall Coverage:** [X]% of requirements have associated test cases

---

## Traceability Matrix

| Req ID | Requirement Description | Priority | Test Case ID(s) | Test Case Description | Test Status | Execution Date | Tester | Comments |
|--------|------------------------|----------|----------------|----------------------|-------------|----------------|--------|----------|
| REQ-001 | User can log in with email and password | High | TC-001, TC-002, TC-003 | Valid login, Invalid password, Account locked | Pass, Pass, Pass | 2025-11-01 | J. Smith | |
| REQ-002 | Password must be 8-20 characters | High | TC-004, TC-005 | Min/max length validation, Special char validation | Pass, Pass | 2025-11-01 | J. Smith | |
| REQ-003 | User can reset password via email | High | TC-006, TC-007, TC-008 | Request reset, Click link, Set new password | Pass, Fail, Not Run | 2025-11-02 | A. Chen | BUG-123 |
| REQ-004 | User can update profile information | Medium | TC-009, TC-010 | Edit profile, Upload avatar | Pass, Pass | 2025-11-02 | A. Chen | |
| REQ-005 | User receives email verification on signup | Medium | TC-011 | Email verification flow | Pass | 2025-11-03 | J. Smith | |
| REQ-006 | Admin can view user list | Medium | TC-012, TC-013 | View users, Search users | Not Run, Not Run | - | - | Deferred to Sprint 3 |
| REQ-007 | System supports 1000 concurrent users | High | TC-014 | Load test 1000 users | Not Run | - | - | Scheduled for 11/15 |

---

## Uncovered Requirements

Requirements without associated test cases:

| Req ID | Requirement Description | Priority | Reason Not Tested | Action |
|--------|------------------------|----------|-------------------|--------|
| REQ-020 | UI refreshed with new branding | Low | Visual review sufficient | Design approval obtained |
| REQ-035 | Help documentation updated | Low | Manual review only | Tech writer validated |
| REQ-042 | Feature not implemented | Medium | Moved to next sprint | Add to Sprint 3 backlog |

---

## Failed Test Cases

Test cases that failed and associated defects:

| Test Case ID | Requirement ID | Description | Defect ID | Severity | Status |
|--------------|----------------|-------------|-----------|----------|--------|
| TC-007 | REQ-003 | Password reset link click | BUG-123 | High | In Progress |
| TC-018 | REQ-009 | Search pagination | BUG-124 | Medium | Fixed, pending verification |

---

## Test Case to Requirement Mapping

Alternative view: Test cases with their requirements

| Test Case ID | Test Case Description | Requirement ID(s) | Priority | Status |
|--------------|----------------------|-------------------|----------|--------|
| TC-001 | Valid user login | REQ-001 | High | Pass |
| TC-002 | Invalid password | REQ-001 | High | Pass |
| TC-003 | Locked account | REQ-001 | High | Pass |
| TC-004 | Password min/max length | REQ-002 | High | Pass |
| TC-005 | Password special characters | REQ-002 | High | Pass |
| TC-006 | Request password reset | REQ-003 | High | Pass |
| TC-007 | Click reset link | REQ-003 | High | Fail |
| TC-008 | Set new password | REQ-003 | High | Not Run |

---

## Bidirectional Traceability

### Forward Traceability: Business Need → Requirement → Test

| Business Need | Epic | User Story | Requirement | Test Case |
|--------------|------|-----------|-------------|-----------|
| BN-001: Improve user retention | EPIC-001: Auth improvements | US-001: Password reset | REQ-003: Email reset | TC-006, TC-007, TC-008 |
| BN-002: Reduce support load | EPIC-002: Self-service | US-002: Profile edit | REQ-004: Update profile | TC-009, TC-010 |

### Backward Traceability: Test → Requirement → Business Need

| Test Case | Requirement | User Story | Business Justification |
|-----------|-------------|-----------|------------------------|
| TC-006 | REQ-003 | US-001 | 30% of support tickets are password resets |
| TC-009 | REQ-004 | US-002 | Users frequently contact support to update info |

---

## Multi-Level Traceability Example

```
Business Objective: Increase user engagement by 20%
    ↓
Epic-001: Improve authentication experience
    ↓
User Story US-001: As a user, I want to reset my password easily
    ↓
Requirement REQ-003: System shall send password reset email within 5 minutes
    ↓
Design Spec DS-003: Email template with reset link valid for 24 hours
    ↓
Test Cases:
    - TC-006: Verify reset email sent within 5 minutes
    - TC-007: Verify reset link works
    - TC-008: Verify link expires after 24 hours
    ↓
Test Results: TC-006 Pass, TC-007 Fail (BUG-123), TC-008 Not Run
    ↓
Verification: Requirement partially validated, blocker exists
```

---

## Coverage by Priority

| Priority | Total Reqs | Tested | Coverage % | Pass Rate |
|----------|-----------|--------|------------|-----------|
| High | 12 | 12 | 100% | 92% |
| Medium | 8 | 7 | 88% | 100% |
| Low | 5 | 2 | 40% | 100% |
| **Total** | **25** | **21** | **84%** | **95%** |

---

## Coverage by Module

| Module | Total Reqs | Tested | Coverage % | Pass Rate |
|--------|-----------|--------|------------|-----------|
| Authentication | 8 | 8 | 100% | 88% |
| User Profile | 5 | 5 | 100% | 100% |
| Search | 6 | 4 | 67% | 100% |
| Admin | 6 | 4 | 67% | 100% |

---

## Impact Analysis Template

Use this section when requirements change:

### Change Request: [CR-XXX]

**Changed Requirement:** REQ-XXX
**Change Description:** [What changed]
**Change Date:** YYYY-MM-DD

**Impact Analysis:**

| Impacted Test Case | Current Status | Action Required | Estimated Effort |
|-------------------|----------------|-----------------|------------------|
| TC-XXX | Pass | Update test steps | 1 hour |
| TC-YYY | Pass | Re-execute only | 0.5 hours |
| New TC required | - | Create new test | 2 hours |

**Total Impact:** 3.5 hours
**Regression Scope:** 8 test cases
**Risk Level:** Medium

---

## Defect Traceability

Link defects back to requirements:

| Defect ID | Description | Requirement ID | Test Case ID | Severity | Root Cause |
|-----------|-------------|----------------|--------------|----------|------------|
| BUG-123 | Reset link 404 error | REQ-003 | TC-007 | High | URL routing bug |
| BUG-124 | Pagination skips pages | REQ-009 | TC-018 | Medium | Off-by-one error |

---

## Automation Coverage

Track which test cases are automated:

| Requirement ID | Test Case ID | Automated? | Automation Framework | CI/CD Integrated |
|----------------|--------------|------------|---------------------|------------------|
| REQ-001 | TC-001 | Yes | Selenium | Yes |
| REQ-001 | TC-002 | Yes | Selenium | Yes |
| REQ-001 | TC-003 | No | - | No |
| REQ-002 | TC-004 | Yes | Jest | Yes |
| REQ-003 | TC-006 | Partial | Postman | Yes |

**Automation Summary:**
- Total test cases: 25
- Automated: 18 (72%)
- Manual: 7 (28%)

---

## Change History

Track how requirements evolve:

| Requirement ID | Version | Change Date | Change Description | Impacted Tests |
|----------------|---------|-------------|-------------------|----------------|
| REQ-003 | 1.0 | 2025-10-01 | Initial version | TC-006 |
| REQ-003 | 1.1 | 2025-10-15 | Added 5-minute SLA | TC-006 updated |
| REQ-003 | 2.0 | 2025-11-01 | Changed to 2-minute SLA | TC-006, new TC-006a |

---

## Sign-Off

### Test Coverage Review

| Reviewer | Role | Approval | Date | Comments |
|----------|------|----------|------|----------|
| [Name] | QA Lead | ☐ Approved ☐ Rejected | | |
| [Name] | Product Owner | ☐ Approved ☐ Rejected | | |
| [Name] | Engineering Manager | ☐ Approved ☐ Rejected | | |

### Uncovered Requirements Justification

For requirements intentionally not tested, stakeholder approval:

| Requirement ID | Reason Not Tested | Approved By | Date |
|----------------|-------------------|-------------|------|
| REQ-020 | Visual review sufficient | Product Owner | 2025-11-01 |
| REQ-035 | Documentation only | Tech Lead | 2025-11-01 |

---

## Notes and Assumptions

- Test execution ongoing, 60% complete as of [DATE]
- Performance testing scheduled for [DATE]
- UAT planned for [DATE RANGE]
- Automation coverage goal: 80% by end of quarter

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-01 | [Name] | Initial RTM |
| 1.1 | 2025-11-01 | [Name] | Updated with test results |
| 1.2 | 2025-11-05 | [Name] | Added defect traceability |

---

## Simplified Template (Small Projects)

For smaller projects, use this condensed format:

| Requirement | Test Case(s) | Status | Notes |
|-------------|-------------|--------|-------|
| User login | TC-001, TC-002 | Pass | |
| Password validation | TC-003 | Pass | |
| Password reset | TC-004, TC-005 | Fail | BUG-123 |
| Profile edit | TC-006 | Pass | |

**Coverage:** 4/4 requirements = 100%
**Pass Rate:** 3/4 test groups = 75%
