# Hardware Validation Exercise

## Overview

**Duration:** 2 hours
**Difficulty:** Intermediate
**Category:** Hardware Testing

Paper-based exercise for planning EVT (Engineering Validation Test) for a smart device. Learn hardware QA methodologies without physical equipment.

## Learning Objectives

- Understand EVT/DVT/PVT phases
- Create hardware test plans
- Design environmental test scenarios
- Plan failure analysis procedures
- Document hardware validation requirements

## Scenario

**Product:** Smart Fitness Tracker

**Specifications:**
- OLED display (1.4 inch)
- Heart rate sensor
- Accelerometer & Gyroscope
- Bluetooth 5.0
- IP68 water resistance
- 7-day battery life
- Operating temp: -10°C to 45°C

## Part 1: EVT Test Plan Creation (40 minutes)

### Functional Testing

Create test cases for:

**Display:**
- [ ] Brightness levels (5 settings)
- [ ] Touch response time < 100ms
- [ ] Viewability in sunlight
- [ ] Dead pixels: 0 acceptable

**Sensors:**
- [ ] Heart rate accuracy ± 3%
- [ ] Step counting accuracy ± 5%
- [ ] Sleep detection works
- [ ] Calibration procedure

**Connectivity:**
- [ ] Pairing with smartphone
- [ ] Connection range ≥ 10m
- [ ] Data sync accuracy
- [ ] Firmware update OTA

**Battery:**
- [ ] Charge time < 2 hours
- [ ] Runtime ≥ 7 days typical use
- [ ] Battery not exceeding 45°C while charging
- [ ] Low battery warning at 10%

### Test Plan Template

```markdown
# EVT Test Plan: Smart Fitness Tracker

## 1. Test Objectives
- Validate core functionality
- Identify design issues
- Verify sensor accuracy

## 2. Test Scope
IN SCOPE:
- All features
- Basic environmental tests
- Safety tests

OUT OF SCOPE:
- Mass production reliability
- Long-term wear testing

## 3. Test Schedule
Week 1: Functional testing
Week 2: Environmental testing
Week 3: Safety & compliance

## 4. Resources
- 10 EVT units
- Environmental chamber
- Test equipment (oscilloscope, multimeter)
- Test fixtures

## 5. Entry/Exit Criteria
ENTRY:
- 10 EVT units received
- Test specs approved
- Equipment calibrated

EXIT:
- All tests executed
- No critical defects
- Report published
```

## Part 2: Environmental Testing Plan (30 minutes)

### Temperature Testing

**Cold Temperature:**
```
Test: -10°C operation
Duration: 4 hours
Sample size: 3 units
Success criteria: All functions work
```

**Hot Temperature:**
```
Test: 45°C operation
Duration: 4 hours
Sample size: 3 units
Success criteria: No performance degradation
```

**Thermal Shock:**
```
Cycles: 50 cycles
Profile: -10°C (30min) → 45°C (30min)
Success: No cracks, No function failure
```

### Water Resistance (IP68)

**Test Procedure:**
1. Inspect unit for damage
2. Submerge in 1.5m water
3. Keep for 30 minutes
4. Remove and dry
5. Power on and test all functions
6. Open unit to check for water ingress

**Acceptance:** No water inside, all functions work

### Drop Testing

**Test Setup:**
- Drop height: 1.2m
- Surface: Concrete
- Orientations: 6 faces
- Samples: 3 units

**Pass Criteria:**
- Display intact
- All functions work
- No cosmetic cracks

### Vibration Testing

**Profile:**
```
Frequency: 10-500 Hz
Amplitude: 1mm
Duration: 2 hours
Axes: X, Y, Z
```

## Part 3: Safety & Compliance Testing (25 minutes)

### Electrical Safety

**Tests Required:**
- [ ] Ground continuity < 0.1Ω
- [ ] Insulation resistance > 5MΩ
- [ ] Dielectric strength 1000V AC
- [ ] Leakage current < 0.5mA
- [ ] Overcharge protection

### EMC/EMI Testing

**Emissions:**
- FCC Part 15 Class B
- CE EN 55032

**Immunity:**
- ESD: ± 8kV contact, ± 15kV air
- EFT: ± 2kV
- Surge: ± 2kV

### Battery Safety (UN38.3)

**Required Tests:**
- Altitude simulation
- Thermal test
- Vibration
- Shock
- External short circuit
- Impact/crush
- Overcharge
- Forced discharge

## Part 4: Failure Analysis Planning (25 minutes)

### Failure Documentation

**When a Failure Occurs:**

1. **Immediate Actions:**
   - Stop test
   - Photo/video evidence
   - Don't disassemble yet
   - Log failure conditions

2. **Failure Report Template:**
```markdown
# Failure Report #001

Date: 2024-01-15
Test: Temperature Cycling
Unit ID: EVT-003
Cycle: 27 of 50

SYMPTOM:
Display not turning on after cycle 27

OBSERVATIONS:
- Unit was at -10°C when failure noticed
- Last worked at end of cycle 26
- No physical damage visible
- Battery voltage: 3.7V (normal)

HYPOTHESIS:
- Cold solder joint on display connector
- Display component failure
- Flex cable damage

NEXT STEPS:
- X-ray inspection
- Disassemble for visual inspection
- Test display in standalone setup
```

3. **Root Cause Analysis:**
   - Why did it fail?
   - When did it fail?
   - What was different?
   - Can we reproduce it?

### Failure Categorization

| Category | Severity | Action |
|----------|----------|--------|
| Design flaw | Critical | Redesign |
| Component defect | Major | Change supplier |
| Assembly issue | Major | Fix process |
| Test setup error | Minor | Fix procedure |

## Part 5: Measurement Plan (20 minutes)

### Key Measurements

**Heart Rate Sensor Accuracy:**
```
Setup:
- Reference: Medical-grade pulse oximeter
- Subjects: 10 people
- Conditions: Rest, Walking, Running
- Duration: 5 minutes each

Data Collection:
- Sample every 5 seconds
- Record DUT reading
- Record reference reading
- Calculate error percentage

Acceptance:
- Mean error < 3%
- Max error < 5%
```

**Battery Life:**
```
Test Protocol:
1. Fully charge device
2. Enable all sensors
3. Set display to medium brightness
4. Sync every 15 minutes
5. Record voltage every hour
6. Test until shutdown

Expected Result: ≥ 168 hours (7 days)
```

### Measurement Uncertainty

Document uncertainty for each measurement:

```
Heart Rate Measurement:
- Sensor accuracy: ± 2%
- Reference device: ± 1%
- Human variation: ± 3%
- Combined uncertainty: ± 3.7%
```

## Deliverables

### Complete EVT Test Plan Document

Include:

1. **Cover Page**
   - Product name
   - Revision
   - Date
   - Approvers

2. **Test Matrix**

| Test Category | Test Name | Quantity | Pass Criteria | Status |
|--------------|-----------|----------|---------------|--------|
| Functional | Display brightness | 3 | 5 levels work | |
| Environmental | Cold temp | 3 | Works at -10°C | |
| Safety | Ground continuity | 5 | < 0.1Ω | |

3. **Risk Assessment**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Display failure in cold | Medium | High | Extra temp margin |
| Water ingress | Low | Critical | Improved seals |

4. **Schedule with Milestones**

5. **Resource Requirements**

6. **Test Data Sheets** (blank templates)

## Bonus Challenges

1. **Create DVT Plan:**
   - What changes from EVT?
   - More samples?
   - Longer duration tests?

2. **Design DOE:**
   - Test battery life vs features
   - Optimize for user scenarios

3. **Reliability Testing:**
   - HALT/HASS testing plan
   - MTBF calculation

## Resources

- [IPC-9701: Performance Test Methods](https://www.ipc.org/)
- [MIL-STD-810: Environmental Engineering](https://quicksearch.dla.mil/qsDocDetails.aspx?ident_number=35978)
- [IEC 60068: Environmental Testing](https://webstore.iec.ch/publication/12681)
- [UN38.3: Battery Testing](https://www.un.org/en/)
