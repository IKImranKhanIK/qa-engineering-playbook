# Lab: Root Cause Analysis (8D)

**Difficulty:** Intermediate
**Duration:** 2 hours
**Category:** Hardware

## Objectives

- Practice 8D problem-solving methodology
- Conduct root cause analysis
- Develop corrective and preventive actions
- Create 8D report

## Prerequisites

- Completed [8D CAPA Process lesson](../../docs/07-hardware-qa/08-8d-capa-process.md)
- Basic understanding of problem-solving techniques

## Scenario

**Problem Reported:**

Your company manufactures **Smart Door Locks**. You've received 47 customer complaints in the past month about:

"**Lock fails to unlock via smartphone app - battery drains within 2 days instead of advertised 6 months**"

**Product Details:**
- Product: SmartLock Pro v2.3
- Release date: 3 months ago
- Units sold: 15,000
- Complaint rate: 0.31% (47/15,000)
- Firmware version: 2.3.1
- Hardware revision: RevB

**Additional Context:**
- Previous version (v2.2) had no such issues
- Complaints started 2 weeks after launch
- Affects random units (no clear pattern by serial number)
- Customer locations: Various (no geographic concentration)

## Part 1: D0 - Prepare (15 minutes)

### Exercise 1.1: Problem Recognition

**Task:** Document the problem statement

Complete this template:
```
Problem Description:
- What: [The observed problem]
- When: [When did it start occurring]
- Where: [Product version, customer segment]
- How many: [Frequency/occurrence rate]
- Impact: [Customer impact, business impact]

Is 8D appropriate?
☐ Yes - Problem is recurring and significant
☐ No - Simple fix available

Justification:
[Why 8D is or isn't needed]
```

### Exercise 1.2: Assess Urgency

**Create urgency matrix:**

| Factor | Score (1-5) | Notes |
|--------|-------------|-------|
| Safety risk | | |
| Customer impact | | |
| Volume affected | | |
| Warranty cost | | |
| Brand reputation | | |
| Total Score | | |

**Urgency level:** Critical (>20) / High (15-20) / Medium (10-14) / Low (<10)

## Part 2: D1 - Establish the Team (10 minutes)

### Exercise 2.1: Build Cross-Functional Team

**Select team members:**

| Role | Name | Responsibility | Expertise Needed |
|------|------|----------------|------------------|
| Team Leader | [You] | Facilitate 8D process | Problem solving |
| Design Engineer | | | Lock mechanism, electronics |
| Firmware Engineer | | | App connectivity, power management |
| QA Engineer | | | Testing, validation |
| Field Service | | | Customer data, failure modes |
| Manufacturing | | | Assembly process changes |
| Supplier Quality | | | Battery supplier issues |

**Task:** Define clear roles and meeting schedule.

## Part 3: D2 - Describe the Problem (20 minutes)

### Exercise 3.1: 5W2H Analysis

**Complete the 5W2H:**

| Question | Answer |
|----------|--------|
| **What** is the problem? | Lock fails to unlock; battery drains in 2 days |
| **When** did it start? | |
| **When** does it occur? | |
| **Where** is it observed? | |
| **Where** in the process? | |
| **Who** discovered it? | |
| **Who** is affected? | |
| **How** was it detected? | |
| **How many** affected? | |

### Exercise 3.2: Is/Is Not Analysis

| Dimension | IS (Problem observed) | IS NOT (Problem not observed) | Distinction | Clues |
|-----------|----------------------|-------------------------------|-------------|-------|
| **What** | SmartLock Pro v2.3 | SmartLock Pro v2.2 | Version change | Firmware or hardware change |
| **Where (Product)** | RevB hardware | RevA hardware | Hardware revision | Component change |
| **Where (Location)** | | | | |
| **When (Time)** | After 2 weeks of use | During first week | Time-based | Degradation over time |
| **Extent** | ~0.3% of units | 99.7% of units | Random occurrence | Manufacturing variability? |

**Task:** Complete this table and identify clues.

## Part 4: D3 - Containment Action (15 minutes)

### Exercise 4.1: Immediate Containment

**Design containment actions:**

**Short-term (Immediate):**
1. Action:
   - Example: Issue firmware update v2.3.2 to reduce polling frequency
   - Responsibility:
   - Timeline:
   - Verification:

2. Action:
   - Example: Send replacement batteries to affected customers
   - Responsibility:
   - Timeline:
   - Verification:

**Field Actions:**
- Stop shipment of current stock? Yes/No
- Recall required? Yes/No
- Customer notification plan:

**Verification Plan:**
- How will you verify containment is effective?
- Metrics to track:

## Part 5: D4 - Root Cause Analysis (30 minutes)

### Exercise 5.1: 5 Whys

**Start with symptom:** Battery drains in 2 days

| Why # | Question | Answer | Evidence |
|-------|----------|--------|----------|
| Why 1 | Why does battery drain so fast? | Device is consuming more power than expected | Power profiling data shows 10x normal consumption |
| Why 2 | Why is power consumption high? | Bluetooth module stays active continuously | Log analysis shows no sleep mode |
| Why 3 | Why doesn't BLE module sleep? | Firmware watchdog keeps waking it up | Code review findings |
| Why 4 | Why does watchdog trigger? | Timeout value set too aggressively in v2.3.1 | Git diff shows change |
| Why 5 | Why was timeout changed? | To improve responsiveness, but caused unintended effect | Developer interview |

**Root Cause:** Firmware change in v2.3.1 set BLE watchdog timeout too low

### Exercise 5.2: Fishbone Diagram

Create Ishikawa (Fishbone) diagram for potential causes:

Categories to explore:
- **Man** (People): Training, procedures, mistakes
- **Machine** (Equipment): Assembly equipment, test equipment
- **Material** (Components): Battery, BLE module, firmware
- **Method** (Process): Design process, testing process
- **Measurement**: Testing criteria, specifications
- **Environment**: Temperature, humidity during assembly

**Task:** Draw fishbone and identify top 3 potential root causes.

### Exercise 5.3: Verify Root Cause

**Design experiment to verify root cause:**

**Hypothesis:** Changing BLE watchdog timeout from 5s → 500ms caused high power draw

**Test Plan:**
1. Take affected unit
2. Flash with v2.3.0 firmware (timeout=5s)
3. Measure battery life: Should be ~6 months
4. Flash with v2.3.1 firmware (timeout=500ms)
5. Measure battery life: Should be ~2 days

**Expected Results:**
- If hypothesis is correct: Clear difference in battery life
- If hypothesis is wrong: No significant difference

## Part 6: D5 - Permanent Corrective Actions (20 minutes)

### Exercise 6.1: Develop Solutions

**Brainstorm corrective actions:**

| Solution Option | Pros | Cons | Feasibility | Cost | Timeline |
|----------------|------|------|-------------|------|----------|
| 1. Revert timeout to 5s | Quick, proven | Slower response | High | Low | 1 week |
| 2. Adaptive timeout algorithm | Optimal power & responsiveness | Complex to implement | Medium | Medium | 4 weeks |
| 3. Hardware fix (better battery) | Masks root cause | Doesn't fix actual issue | Low | High | 12 weeks |

**Select best option with justification:**

**Chosen Solution:**

**Implementation Plan:**
- Design changes needed:
- Testing required:
- Approvals needed:
- Timeline:

### Exercise 6.2: Preventive Actions

**Prevent recurrence:**

1. **Process Changes:**
   - Add power consumption test to firmware validation
   - Require power profiling for all firmware changes
   - Update firmware review checklist

2. **Design Changes:**
   - Implement automated power monitoring in CI/CD
   - Add battery life test to release criteria

3. **Training:**
   - Train firmware team on power optimization
   - Share lessons learned company-wide

## Part 7: D6 - Verify Effectiveness (10 minutes)

### Exercise 7.1: Validation Plan

**How will you verify the fix works?**

**Validation Tests:**
1. **Lab Testing:**
   - Units: 20 devices with fixed firmware
   - Duration: 4 weeks accelerated life test
   - Criteria: Battery life >6 months (simulated)

2. **Beta Testing:**
   - Units: 100 customer volunteers
   - Duration: 4 weeks field test
   - Data collection: Battery % via app telemetry

3. **Production Monitoring:**
   - Monitor complaint rate for 3 months
   - Target: <0.05% complaint rate

**Success Criteria:**
- [ ] Zero battery drain complaints in beta group
- [ ] Lab tests show >6 month battery life
- [ ] Production complaint rate <0.05%

## Part 8: D7 - Prevent Recurrence (10 minutes)

### Exercise 8.1: Systemic Improvements

**Update processes to prevent similar issues:**

1. **Design Process:**
   - [ ] Add power budget review to design checklist
   - [ ] Require power profiling for firmware changes
   - [ ] Update design FMEA to include power consumption risks

2. **Validation Process:**
   - [ ] Add battery life test to EVT checklist
   - [ ] Extend soak test duration from 24h to 72h
   - [ ] Implement automated power monitoring

3. **Documentation:**
   - [ ] Update firmware coding standards
   - [ ] Create power optimization guide
   - [ ] Document lessons learned

4. **Training:**
   - [ ] Power management training for firmware team
   - [ ] 8D process training for QA team

## Part 9: D8 - Congratulate the Team (5 minutes)

### Exercise 9.1: Team Recognition

**Document:**
- Key contributors and their contributions
- Lessons learned
- Process improvements implemented
- Time/cost saved

**Celebrate:**
- Share success story company-wide
- Recognize team in company meeting
- Document for future reference

## Deliverables

Create complete **8D Report** including:

1. **Cover Page:**
   - Problem title
   - 8D number
   - Team members
   - Dates (open/closed)

2. **All 8 Disciplines documented:**
   - D0-D8 with complete details
   - Evidence and data
   - Actions and owners
   - Timelines

3. **Appendices:**
   - Test data
   - Analysis diagrams (Fishbone, etc.)
   - Verification results
   - Process updates implemented

## Evaluation Criteria

- Thoroughness of root cause analysis
- Quality of corrective actions
- Effectiveness of preventive measures
- Completeness of documentation
- Team collaboration demonstrated

## Bonus Challenges

1. **Cost Analysis:**
   - Calculate total cost of quality issue
   - ROI of corrective actions

2. **Customer Communication:**
   - Draft customer notification letter
   - FAQ for customer support

3. **Supplier Involvement:**
   - If battery supplier was involved, how would you handle?

4. **Regulatory Reporting:**
   - If this were medical device, what reporting needed?

## Next Steps

- Practice 8D on real problems
- Lead 8D team in your organization
- Train others on 8D methodology
- Build 8D templates and tools
