# Risk Assessment Template

**Project/Release:** [Project Name]
**Version:** [Version Number]
**Assessment Date:** YYYY-MM-DD
**Prepared By:** [Your Name]
**Reviewed By:** [Reviewer Name(s)]

---

## Executive Summary

Brief overview of the risk assessment, highlighting the highest risks and recommended mitigation strategies.

**Key Findings:**
- Total risks identified: [X]
- High risks: [X]
- Medium risks: [X]
- Low risks: [X]

**Top 3 Risks:**
1. [Risk name] - [Risk score]
2. [Risk name] - [Risk score]
3. [Risk name] - [Risk score]

---

## Risk Assessment Criteria

### Probability Scale (1-5)

| Rating | Description | Likelihood |
|--------|-------------|------------|
| 5 | Very High | >80% chance of occurring |
| 4 | High | 60-80% chance |
| 3 | Medium | 40-60% chance |
| 2 | Low | 20-40% chance |
| 1 | Very Low | <20% chance |

### Impact Scale (1-5)

| Rating | Description | Consequences |
|--------|-------------|--------------|
| 5 | Critical | System failure, data loss, security breach, major revenue impact |
| 4 | High | Major functionality broken, significant user impact, reputation damage |
| 3 | Medium | Moderate functionality issues, workarounds available, some user impact |
| 2 | Low | Minor issues, minimal user impact, easy fixes |
| 1 | Very Low | Trivial impact, cosmetic issues only |

### Risk Score Calculation

**Risk Score = Probability × Impact**

| Score Range | Risk Level | Action Required |
|-------------|-----------|-----------------|
| 20-25 | Critical | Immediate mitigation required |
| 12-19 | High | Mitigation plan before release |
| 6-11 | Medium | Monitor and mitigate if possible |
| 1-5 | Low | Accept or minimal mitigation |

---

## Risk Register

| ID | Risk Area | Description | Prob | Impact | Score | Level | Mitigation Strategy | Owner | Status |
|----|-----------|-------------|------|--------|-------|-------|---------------------|-------|--------|
| R-001 | Payment | New payment gateway untested at scale | 4 | 5 | 20 | Critical | Load testing, phased rollout, fallback to old gateway | QA Lead | Open |
| R-002 | Auth | SSO integration complexity | 3 | 4 | 12 | High | Extra testing cycle, pilot with small user group | Dev Lead | Mitigated |
| R-003 | Data | Database migration errors | 2 | 5 | 10 | Medium | Backup before migration, rollback plan, dry run | DBA | Mitigated |
| R-004 | UI | Browser compatibility issues | 3 | 2 | 6 | Medium | Cross-browser testing, progressive enhancement | QA | Open |
| R-005 | Perf | Search performance degradation | 2 | 3 | 6 | Medium | Performance testing, caching strategy | Dev | Open |
| R-006 | Mobile | iOS 17 specific bugs | 2 | 2 | 4 | Low | Test on iOS 17 devices | QA | Closed |

---

## Detailed Risk Analysis

### R-001: Payment Gateway Integration

**Risk Category:** Technical, Business Critical

**Description:**
New Stripe payment gateway being integrated to replace legacy payment processor. High complexity, limited testing in production-like conditions.

**Probability:** 4 (High)
**Rationale:**
- New integration, never used in production
- Complex refund and chargeback flows
- Limited time to test at scale
- Historical issues with payment integrations

**Impact:** 5 (Critical)
**Rationale:**
- Direct revenue impact if payments fail
- Customer trust damage
- PCI compliance risk
- No immediate rollback if issues found in production

**Risk Score:** 20 (Critical)

**Current Controls:**
- Integration tests with Stripe sandbox
- Manual testing of happy paths
- Code review completed

**Gaps:**
- No load testing at expected production volume
- Edge cases (refunds, partial captures) minimally tested
- No chaos engineering (what if Stripe is down?)

**Mitigation Strategy:**
1. Conduct load testing: 1000 transactions/minute for 30 minutes
2. Implement circuit breaker pattern for Stripe API calls
3. Create fallback to old payment processor
4. Phased rollout: 10% → 50% → 100% of traffic over 1 week
5. Enhanced monitoring and alerting for payment failures
6. On-call engineer during rollout

**Mitigation Owner:** QA Lead (testing), Dev Lead (technical implementation)

**Timeline:** Complete by [DATE] before release

**Status:** Mitigation in progress

**Residual Risk:** After mitigation, risk score reduces to 8 (Medium) due to reduced probability (2)

---

### R-002: SSO Integration Complexity

**Risk Category:** Technical

**Description:**
Integrating Single Sign-On with corporate identity provider (Okta). Complex token handling and session management.

**Probability:** 3 (Medium)
**Rationale:**
- OAuth/SAML complexity
- Multiple user roles and permissions
- Token refresh logic challenging
- Cross-domain session management

**Impact:** 4 (High)
**Rationale:**
- All users authenticate via SSO
- Login failures block access entirely
- Security implications if incorrectly implemented
- Support burden if users locked out

**Risk Score:** 12 (High)

**Current Controls:**
- Security review completed
- Integration testing in dev environment
- Test accounts for each role type

**Gaps:**
- Limited testing with real Okta instance
- Token expiration scenarios not fully tested
- No testing of "remember me" functionality

**Mitigation Strategy:**
1. Pilot with 10 internal users for 1 week
2. Test all token expiration and refresh scenarios
3. Document troubleshooting guide for common issues
4. Implement detailed logging for auth failures
5. Create admin override for emergency access

**Mitigation Owner:** Dev Lead

**Timeline:** Pilot starting [DATE]

**Status:** Mitigated

**Residual Risk:** After pilot and fixes, risk score reduces to 6 (Medium)

---

## Risk Trend Analysis

### Risk Over Time

| Assessment Date | Critical | High | Medium | Low |
|----------------|----------|------|--------|-----|
| 2025-10-01 | 2 | 4 | 6 | 3 |
| 2025-10-15 | 1 | 3 | 6 | 4 |
| 2025-11-01 | 1 | 2 | 5 | 5 |

**Trend:** Risk decreasing as mitigation progresses. One critical risk remains (payment gateway).

---

## Risk Categories Summary

| Category | Count | Highest Risk Score |
|----------|-------|-------------------|
| Payment Processing | 1 | 20 (Critical) |
| Authentication | 1 | 12 (High) |
| Data Migration | 1 | 10 (Medium) |
| Performance | 1 | 6 (Medium) |
| Compatibility | 1 | 6 (Medium) |
| Mobile | 1 | 4 (Low) |

---

## Mitigation Plan Summary

| Risk ID | Mitigation Action | Owner | Due Date | Status |
|---------|-------------------|-------|----------|--------|
| R-001 | Load testing | QA Lead | 2025-11-10 | In Progress |
| R-001 | Phased rollout plan | Release Mgr | 2025-11-12 | Not Started |
| R-002 | Internal pilot | Dev Lead | 2025-11-05 | Complete |
| R-003 | Migration dry run | DBA | 2025-11-08 | Complete |
| R-004 | Cross-browser testing | QA | 2025-11-15 | In Progress |

---

## Recommendations

### Before Release
1. **Must Complete:**
   - Payment gateway load testing
   - Fallback mechanism for payment failures
   - Monitoring and alerting setup

2. **Should Complete:**
   - All medium-risk mitigations
   - Phased rollout plan documented

3. **Nice to Have:**
   - Chaos engineering for third-party dependencies
   - Automated rollback procedures

### Release Decision
**Recommendation:** Proceed with release ONLY if R-001 (payment gateway) mitigation is complete.

**Contingency:** If mitigation not complete by [DATE], defer payment gateway to next release and release without it.

---

## Risk Acceptance

For risks not mitigated, document acceptance:

**R-005: Search Performance**
- Accepted by: Product Owner
- Rationale: Performance degradation expected to be minimal (<10%) and acceptable trade-off for new features
- Monitoring plan: Track search response times post-release
- Review date: 2 weeks post-release

---

## Appendix

### Risk Identification Methods Used
- Historical defect analysis
- Team brainstorming session
- Code complexity analysis
- Dependency review
- Architecture review

### Stakeholders Consulted
- Engineering team
- Product management
- DevOps
- Customer support

### References
- [Link to previous risk assessments]
- [Link to defect tracking system]
- [Link to architecture diagrams]

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Engineering Manager | | | |
| Product Owner | | | |
| Release Manager | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial assessment |
| 1.1 | YYYY-MM-DD | [Name] | Updated after mitigation completion |
