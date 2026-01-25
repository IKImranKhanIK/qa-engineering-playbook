# Lab: Hardware Validation Exercise

**Difficulty:** Intermediate
**Duration:** 2 hours
**Category:** Hardware

## Objectives

- Create an EVT validation plan for a smart device
- Design hardware test cases
- Understand hardware validation phases
- Practice risk-based hardware testing

## Prerequisites

- Completed [EVT/DVT/PVT Explained lesson](../../docs/07-hardware-qa/01-evt-dvt-pvt-explained.md)
- Basic understanding of hardware concepts

## Scenario

You are the QA Lead for a new **Smart Fitness Watch** about to enter EVT phase.

**Product Specifications:**
- 1.4" AMOLED display, 454x454 resolution
- Heart rate sensor (optical)
- SpO2 sensor
- Accelerometer + Gyroscope
- GPS + GLONASS
- Bluetooth 5.0
- 300mAh battery (claimed 7 days battery life)
- 5 ATM water resistance
- Wireless charging
- Weight: 42g
- Operating temp: -10°C to 45°C

## Part 1: EVT Test Planning (45 minutes)

### Exercise 1.1: Identify Critical Components

List all critical components and their test priorities:

| Component | Risk | Test Priority | Rationale |
|-----------|------|---------------|-----------|
| Battery | High | 1 | Safety + Customer satisfaction |
| Heart rate sensor | High | 1 | Core feature accuracy |
| Water resistance | High | 1 | Can cause device failure |
| Display | Medium | 2 | User experience |
| GPS | Medium | 2 | Core feature |
| Bluetooth | Medium | 2 | Connectivity critical |
| ... | | | |

**Task:** Complete this table with at least 10 components.

### Exercise 1.2: Create EVT Test Matrix

Design test matrix for critical functions:

| Test Category | Test Description | Pass Criteria | Tools Needed |
|--------------|------------------|---------------|--------------|
| Power | Battery capacity verification | ≥300mAh ±5% | Battery analyzer |
| Power | Charging time | <2.5 hours | Timer, power meter |
| Power | Battery life (typical use) | ≥5 days | Usage simulator |
| Sensors | Heart rate accuracy | ±5 BPM vs reference | Medical-grade HR monitor |
| Environmental | Water resistance (static) | No ingress @ 5ATM/30min | Pressure chamber |
| ... | | | |

**Task:** Create at least 20 test cases across all categories.

## Part 2: Test Case Design (45 minutes)

### Exercise 2.1: Detailed Test Case - Heart Rate Accuracy

**TC-HW-001: Heart Rate Accuracy Validation**

**Objective:** Verify heart rate sensor accuracy against reference device

**Preconditions:**
- Device fully charged
- Reference device calibrated
- Test subjects with varying heart rates available
- Room temperature 22°C ±2°C

**Test Equipment:**
- Medical-grade pulse oximeter (reference)
- Stop watch
- Test data logging sheet

**Test Procedure:**
1. Attach fitness watch to subject's left wrist
2. Attach reference device to subject's right wrist (index finger)
3. Wait 2 minutes for stabilization
4. Record readings simultaneously every 30 seconds for 10 minutes
5. Subject at rest
6. Repeat with subject after light exercise (100-120 BPM)
7. Repeat with subject after intense exercise (140-160 BPM)

**Acceptance Criteria:**
- 95% of readings within ±5 BPM of reference
- No false readings (e.g., 0 BPM, 300 BPM)
- Readings stable (not fluctuating wildly)

**Sample Size:** 10 subjects minimum

**Document results template:**

| Subject | Fitness Watch BPM | Reference BPM | Delta | Pass/Fail |
|---------|------------------|---------------|-------|-----------|
| 1 (Rest) | | | | |
| 1 (Light) | | | | |
| 1 (Intense) | | | | |

### Exercise 2.2: Battery Life Test Case

**TC-HW-002: Battery Life Under Typical Usage**

Create a detailed test case that includes:
- Typical usage profile (define what typical means)
- Test setup and conditions
- Measurement methodology
- Pass/fail criteria
- Test duration
- Data collection method

**Hint:** Consider real-world usage patterns:
- 8 hours sleep mode (HR monitoring on)
- 2 hours active use (display on, GPS tracking)
- 14 hours standby (notifications enabled)

## Part 3: Environmental Testing (30 minutes)

### Exercise 3.1: Temperature Test Plan

Design tests for temperature extremes:

**Test Scenarios:**
1. Cold start: -10°C
2. Hot start: +45°C
3. Operating across temp range
4. Thermal shock: -10°C → +45°C

**For each scenario, define:**
- Test duration
- Device state (on/off/charging)
- Functions to verify
- Acceptance criteria

### Exercise 3.2: Water Resistance Test

**IP68 + 5ATM Rating Verification**

Design test procedure:
- Static pressure test (5 ATM = 50 meters)
- Duration: 30 minutes minimum
- Pre-test inspection
- Post-test inspection
- Function verification

**What to check after test:**
- Visual inspection for water ingress
- All functions operational
- Display clarity
- Button functionality
- Wireless charging still works

## Part 4: Risk Analysis (30 minutes)

### Exercise 4.1: FMEA (Failure Mode Effects Analysis)

Create FMEA for top 5 risks:

| Component | Failure Mode | Effect | Severity (1-10) | Likelihood (1-10) | Detection (1-10) | RPN | Mitigation |
|-----------|--------------|--------|-----------------|-------------------|------------------|-----|------------|
| Battery | Swelling | Device damage, injury | 10 | 3 | 2 | 60 | Strict vendor qual, charging protection |
| HR Sensor | Inaccurate readings | Wrong health data | 8 | 4 | 5 | 160 | Multi-point calibration |
| Water seal | Ingress failure | Device failure | 9 | 4 | 3 | 108 | Multiple seal tests, aging tests |

**RPN = Severity × Likelihood × Detection**

**Task:** Complete FMEA for at least 5 components.

### Exercise 4.2: Test Prioritization

Based on your FMEA:
1. Rank tests by risk (highest RPN first)
2. Allocate test resources
3. Define which tests are mandatory vs nice-to-have

## Deliverables

Create an EVT Test Plan document including:

1. **Executive Summary**
   - Product overview
   - Test objectives
   - Key risks

2. **Test Scope**
   - In scope / Out of scope
   - Test phases (EVT focus)
   - Resource requirements

3. **Test Cases**
   - All test cases designed (minimum 20)
   - Detailed procedures for top 5 critical tests
   - Acceptance criteria

4. **Risk Assessment**
   - FMEA table
   - Risk mitigation strategies
   - Test prioritization

5. **Schedule**
   - Test timeline (Gantt chart)
   - Dependencies
   - Resource allocation

## Bonus Challenges

1. **Design DVT Test Plan**
   - What changes from EVT to DVT?
   - Additional tests needed
   - Reliability testing focus

2. **Supplier Qualification**
   - Create battery supplier qualification checklist
   - Define acceptance criteria for components

3. **Certification Planning**
   - What certifications are needed? (FCC, CE, RoHS)
   - What tests are required for certification?

4. **Manufacturing Test Strategy**
   - What tests run on every unit in production?
   - How to balance coverage vs takt time?

## Evaluation Criteria

Your plan will be evaluated on:
- Completeness (all critical areas covered)
- Risk-based prioritization
- Test case clarity and detail
- Realistic acceptance criteria
- Practical feasibility

## Next Steps

- Study real hardware test plans
- Learn about test equipment (oscilloscopes, spectrum analyzers)
- Visit hardware testing labs
- Practice with actual hardware testing
