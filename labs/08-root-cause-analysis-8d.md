# Root Cause Analysis (8D) Lab

## Overview

**Duration:** 2 hours
**Difficulty:** Intermediate
**Category:** Quality Management

Practice the 8D (Eight Disciplines) problem-solving methodology used in manufacturing and hardware QA to address recurring defects.

## Learning Objectives

- Apply 8D methodology to real problems
- Conduct root cause analysis using 5 Whys and Fishbone diagrams
- Develop corrective and preventive actions (CAPA)
- Create effective 8D reports

## Scenario

**Problem:**
Customer returns show 5% of smart thermostats have WiFi connectivity failures after 30 days of use.

**Impact:**
- 500 units returned in last month
- Cost: $50/unit to process
- Customer satisfaction declining
- Potential recall risk

## The 8 Disciplines

### D0: Plan (10 min)

**Prepare for the 8D process:**
- [ ] Define the problem
- [ ] Assess urgency
- [ ] Allocate resources

**Problem Statement:**
```
5% of Model TH-2000 smart thermostats experience WiFi connectivity
failure after 30 days of field use, resulting in 500 returns/month
and declining customer satisfaction.
```

### D1: Form the Team (15 min)

**Identify team members:**
- Quality Engineer (Lead)
- Hardware Engineer
- Firmware Engineer
- Manufacturing Engineer
- Customer Support Rep
- Supplier Quality Engineer

**Roles & Responsibilities:**

| Name | Role | Responsibility |
|------|------|----------------|
| | QE Lead | Drive 8D process |
| | HW Engineer | Analyze circuit design |
| | FW Engineer | Check firmware issues |
| | Mfg Engineer | Review assembly process |

### D2: Describe the Problem (20 min)

**Use 5W2H:**
- **What:** WiFi connectivity failure
- **When:** After 30 days of use
- **Where:** Field (customer homes)
- **Who:** 5% of units sold
- **Why:** Unknown (to be determined)
- **How:** Connection drops, won't reconnect
- **How Many:** ~500 units/month

**Problem Description Checklist:**
- [ ] Quantify the issue (5%)
- [ ] When did it start? (3 months ago)
- [ ] Trend analysis (increasing)
- [ ] Affected lot codes?
- [ ] Geographic pattern?

### D3: Interim Containment Action (20 min)

**Immediate actions to protect customers:**

**Action 1:** Hold shipments from suspect lots
```
Lot codes: 2024W01 through 2024W12
Quantity held: 2,000 units
Cost impact: $200K inventory hold
```

**Action 2:** Enhanced incoming inspection
```
Test: WiFi stress test (48 hours)
Sample: 100% of production
Duration: Until root cause fixed
```

**Action 3:** Field upgrade firmware
```
OTA update: Version 2.1.5
Feature: Improved WiFi recovery logic
Rollout: 95% of field units
```

**Deliverable:** Document all containment actions with dates and owners.

### D4: Root Cause Analysis (30 min)

**5 Whys Analysis:**

```
Problem: WiFi connectivity fails after 30 days

Why? → WiFi module stops responding
  Why? → Module overheats during operation
    Why? → Inadequate thermal dissipation
      Why? → Heat sink contact area insufficient
        Why? → Design didn't account for extended operation thermal load

ROOT CAUSE: Heat sink design inadequate for 24/7 operation
```

**Fishbone Diagram:**

Create diagram with 6 categories:
- **Man:** Assembly training
- **Machine:** Soldering equipment
- **Method:** Assembly procedure
- **Material:** WiFi module quality
- **Measurement:** Thermal testing
- **Environment:** Operating temperature

**Verification:**
- [ ] Recreate failure in lab
- [ ] Confirm root cause with testing
- [ ] Review design calculations
- [ ] Check if containment stops failures

### D5: Permanent Corrective Actions (20 min)

**Solutions identified:**

**Solution 1:** Redesign heat sink
```
Change: Increase contact area by 40%
Cost: $0.50/unit
Lead time: 6 weeks
Effectiveness: Reduces temp by 15°C
```

**Solution 2:** Improve thermal paste
```
Change: Switch to higher conductivity paste
Cost: $0.10/unit
Lead time: 2 weeks
Effectiveness: Reduces temp by 5°C
```

**Solution 3:** Firmware power management
```
Change: Reduce WiFi TX power when not needed
Cost: $0
Lead time: 1 week
Effectiveness: Reduces heat generation by 20%
```

**Selected Solution:** Combination of all three

**Deliverable:** Cost-benefit analysis of each solution.

### D6: Implement & Validate PCA (15 min)

**Implementation Plan:**

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Design new heat sink | HW Eng | Week 2 | |
| Source new paste | Procurement | Week 1 | |
| Update firmware | FW Eng | Week 1 | |
| Build validation units | Mfg | Week 4 | |
| Run thermal testing | QE | Week 5 | |
| Field trial (100 units) | PM | Week 8 | |

**Validation Testing:**
```
Test: 1000-hour thermal cycling
Temp: -10°C to 60°C
Cycles: 200
Sample: 30 units with new design
Success criteria: 0 failures
```

### D7: Prevent Recurrence (10 min)

**Systemic Changes:**

1. **Update Design Guidelines:**
   - Add thermal analysis checklist
   - Mandate thermal simulation for all WiFi products

2. **Improve Design Review:**
   - Add thermal expert to design reviews
   - Require thermal testing at EVT phase

3. **Enhance FMEA:**
   - Add "Extended operation thermal stress" as failure mode
   - Update FMEA template

4. **Training:**
   - Train design team on thermal management
   - Share case study in quarterly meeting

**Deliverable:** List all process improvements.

### D8: Recognize the Team (5 min)

**Celebrate Success:**
- Team appreciation email
- Recognition in monthly meeting
- Document lessons learned
- Share with organization

## Deliverables

### Complete 8D Report

Create a professional 8D report:

```markdown
# 8D Report: WiFi Connectivity Failure - TH-2000

Report ID: 8D-2024-001
Date Opened: 2024-01-15
Date Closed: 2024-03-01
Team Lead: Jane Smith

---

## D0: Plan
[Your content]

## D1: Team
[Team roster]

## D2: Problem Description
[5W2H analysis]

## D3: Interim Containment
[Actions taken]

## D4: Root Cause
[5 Whys, Fishbone, Verification]

## D5: Permanent Corrective Actions
[Solutions with cost/benefit]

## D6: Implementation & Validation
[Results of validation testing]

## D7: Prevent Recurrence
[Process changes]

## D8: Team Recognition
[How team was recognized]

---

## Attachments
- Fishbone diagram
- Test data
- Before/after thermal images
- Cost analysis
```

## Resources

- [8D Problem Solving Guide](https://asq.org/quality-resources/eight-disciplines-8d)
- [Root Cause Analysis Tools](https://www.isixsigma.com/tools-templates/)
- [FMEA Handbook](https://www.aiag.org/quality/automotive-core-tools/fmea)
