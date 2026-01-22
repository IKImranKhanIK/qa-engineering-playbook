# Hardware Validation Plan

**Product:** [Product Name/Model]
**Validation Phase:** ☐ EVT ☐ DVT ☐ PVT ☐ MP
**Version:** [Version Number]
**Date:** YYYY-MM-DD
**Prepared By:** [Your Name]
**Reviewed By:** [Engineering Manager]

---

## Document Purpose

This Hardware Validation Plan defines the testing strategy, test cases, and acceptance criteria for [Product Name] during the [EVT/DVT/PVT] phase.

---

## Product Overview

**Product Description:**
[Brief description of the product, its purpose, and key features]

**Target Market:**
[Consumer / Industrial / Medical / Automotive / etc.]

**Key Specifications:**
- Dimensions: [L × W × H mm]
- Weight: [grams]
- Power: [voltage, current, battery]
- Operating Temperature: [min to max °C]
- Materials: [primary materials]
- Key Components: [MCU, sensors, etc.]

---

## Validation Phase Overview

### EVT (Engineering Validation Test)
**Focus:** Design verification, proof of concept
**Goals:**
- Validate core functionality
- Identify major design flaws
- Verify component selection
- Test basic reliability

**Sample Size:** 5-10 units (hand-built prototypes)

### DVT (Design Validation Test)
**Focus:** Design refinement, pre-production readiness
**Goals:**
- Validate complete feature set
- Environmental testing
- Reliability testing
- Manufacturing process validation
- Regulatory pre-testing

**Sample Size:** 20-50 units (prototype tooling)

### PVT (Production Validation Test)
**Focus:** Production readiness, mass manufacturing validation
**Goals:**
- Validate production tooling
- Manufacturing yield analysis
- Supplier quality validation
- Final regulatory testing
- Packaging and shipping validation

**Sample Size:** 100-500 units (production tooling)

### MP (Mass Production)
**Focus:** Ongoing quality monitoring
**Goals:**
- Production line quality control
- Statistical process control
- Continuous improvement
- Field failure analysis

**Sample Size:** Sampling from production batches

---

## Test Plan Summary

| Test Category | EVT | DVT | PVT | Acceptance Criteria |
|---------------|-----|-----|-----|---------------------|
| Functional | ✓ | ✓ | ✓ | 100% pass |
| Electrical | ✓ | ✓ | ✓ | Within spec ±5% |
| Mechanical | ✓ | ✓ | ✓ | No structural failures |
| Environmental | Partial | ✓ | ✓ | No failures at rated conditions |
| Reliability | Basic | ✓ | ✓ | MTBF >10,000 hours |
| Safety | ✓ | ✓ | ✓ | Pass regulatory standards |
| EMC/EMI | - | ✓ | ✓ | Pass FCC/CE requirements |
| Manufacturing | - | Partial | ✓ | Yield >95% |

---

## Functional Testing

### Core Functionality

| Test ID | Test Description | Procedure | Acceptance Criteria | Priority |
|---------|------------------|-----------|---------------------|----------|
| FUNC-001 | Power on/off | 1. Connect power<br>2. Press power button<br>3. Verify LED indicator | Device powers on within 2s, LED illuminates | P1 |
| FUNC-002 | Bluetooth pairing | 1. Enable pairing mode<br>2. Connect from mobile app<br>3. Verify connection | Pairs within 30s, maintains connection | P1 |
| FUNC-003 | Button functionality | Test all buttons (power, volume, mode) | Each button responds correctly, tactile feedback present | P1 |
| FUNC-004 | LED indicators | Test all LED states (power, battery, status) | LEDs display correct colors and patterns | P2 |
| FUNC-005 | Audio output | Play test tones at various volumes | Clear audio, no distortion, volume control works | P1 |
| FUNC-006 | Battery charging | 1. Connect charger<br>2. Monitor charge cycle<br>3. Verify full charge | Charges to 100% in <3 hours, LED indicates charging status | P1 |

### Feature Validation

| Feature | Test Cases | Pass Criteria |
|---------|------------|---------------|
| Wireless connectivity | FUNC-002, FUNC-010, FUNC-011 | Stable connection at 10m range |
| Audio quality | FUNC-005, FUNC-012, FUNC-013 | THD <1%, SNR >80dB |
| Battery life | FUNC-006, FUNC-020 | >8 hours continuous use |
| User interface | FUNC-003, FUNC-004, FUNC-014 | Intuitive, responsive, clear feedback |

---

## Electrical Testing

| Test ID | Parameter | Test Condition | Min | Typ | Max | Unit | Priority |
|---------|-----------|----------------|-----|-----|-----|------|----------|
| ELEC-001 | Input Voltage | Operating | 4.5 | 5.0 | 5.5 | V | P1 |
| ELEC-002 | Input Current | Idle | - | 50 | 100 | mA | P2 |
| ELEC-003 | Input Current | Active | - | 200 | 300 | mA | P1 |
| ELEC-004 | Battery Voltage | Full charge | 4.15 | 4.2 | 4.25 | V | P1 |
| ELEC-005 | Battery Voltage | Cutoff | 3.0 | 3.2 | 3.4 | V | P1 |
| ELEC-006 | Charge Current | Fast charge | - | 1000 | 1100 | mA | P2 |
| ELEC-007 | Power Consumption | Sleep mode | - | 5 | 10 | µA | P2 |

**Test Equipment Required:**
- Digital multimeter (accuracy ±0.1%)
- Power supply (0-6V, 2A)
- Electronic load
- Oscilloscope
- Battery simulator

---

## Mechanical Testing

### Structural Integrity

| Test ID | Test Description | Method | Sample Size | Acceptance Criteria |
|---------|------------------|--------|-------------|---------------------|
| MECH-001 | Drop test | Drop from 1.5m onto concrete, 6 orientations | 5 units | No functional failure, cosmetic damage acceptable |
| MECH-002 | Compression test | Apply 50N force to enclosure | 3 units | No permanent deformation, device functional |
| MECH-003 | Button life test | Actuate buttons 100,000 cycles | 3 units | Buttons functional, tactile feel maintained |
| MECH-004 | Connector durability | Insert/remove cable 10,000 cycles | 3 units | Connector functional, no looseness |
| MECH-005 | Vibration test | Random vibration per IEC 60068-2-64 | 3 units | No functional failure, no loose parts |

### Dimensional Verification

| Dimension | Nominal | Tolerance | Verification Method |
|-----------|---------|-----------|---------------------|
| Length | 120.0 mm | ±0.5 mm | Caliper measurement |
| Width | 60.0 mm | ±0.5 mm | Caliper measurement |
| Height | 15.0 mm | ±0.3 mm | Caliper measurement |
| Weight | 85 g | ±5 g | Precision scale |
| Button travel | 0.6 mm | ±0.1 mm | Micrometer |

---

## Environmental Testing

| Test ID | Test Condition | Standard | Duration | Sample Size | Acceptance |
|---------|----------------|----------|----------|-------------|------------|
| ENV-001 | Operating temperature | 0°C to 40°C | 4 hours each | 3 units | Functional at all temps |
| ENV-002 | Storage temperature | -20°C to 60°C | 24 hours each | 3 units | No damage, functional after |
| ENV-003 | Temperature cycling | -10°C to 50°C, 10 cycles | Per IEC 60068-2-14 | 3 units | No failures |
| ENV-004 | Humidity | 85% RH, 40°C | 96 hours | 3 units | Functional, no corrosion |
| ENV-005 | Thermal shock | -10°C to 50°C rapid transition | 20 cycles | 3 units | No failures |
| ENV-006 | Altitude | Simulated 3000m altitude | 24 hours | 2 units | Functional |
| ENV-007 | Water resistance | IPX4 splash test | Per IEC 60529 | 3 units | No water ingress |

**Test Equipment Required:**
- Environmental chamber (-40°C to +85°C)
- Humidity chamber (10-95% RH)
- Altitude simulation chamber
- Water spray apparatus

---

## Reliability Testing

### Accelerated Life Testing

| Test ID | Test Type | Condition | Duration | Sample Size | Target |
|---------|-----------|-----------|----------|-------------|--------|
| REL-001 | HALT (Highly Accelerated Life Test) | Temperature, vibration, voltage stress | Until failure | 5 units | Identify weak points |
| REL-002 | Burn-in | 60°C, continuous operation | 168 hours | 10 units | <1% failure rate |
| REL-003 | Battery life | Continuous discharge/charge cycles | 500 cycles | 5 batteries | >80% capacity retained |
| REL-004 | Power cycling | On/off 10,000 cycles | - | 3 units | No failures |
| REL-005 | Wireless endurance | Continuous BT connection | 1000 hours | 3 units | Stable connection |

### Failure Analysis

**MTBF Target:** 10,000 hours
**Method:** Weibull analysis of failure data
**Sample Size:** Minimum 30 units for statistical validity

**Failure Modes to Track:**
- Component failures
- Connector failures
- Battery degradation
- Software crashes
- Mechanical wear

---

## Safety Testing

| Test ID | Standard | Test Description | Acceptance |
|---------|----------|------------------|------------|
| SAFE-001 | UL 60950-1 | Electrical safety | Pass certification |
| SAFE-002 | IEC 62368-1 | Audio/video equipment safety | Pass certification |
| SAFE-003 | Battery safety | UN 38.3 battery transport | Pass all tests |
| SAFE-004 | Flammability | UL 94 V-0 | Enclosure material V-0 rated |
| SAFE-005 | Electrical shock | Touch current <0.5mA | Pass |
| SAFE-006 | Over-temperature | Thermal cutoff test | Cutoff <75°C |

**Regulatory Approvals Required:**
- [ ] FCC (United States)
- [ ] CE (Europe)
- [ ] IC (Canada)
- [ ] RoHS Compliance
- [ ] REACH Compliance
- [ ] Battery certifications (UL, UN 38.3)

---

## EMC/EMI Testing

| Test ID | Standard | Test Description | Limit |
|---------|----------|------------------|-------|
| EMI-001 | FCC Part 15 Class B | Conducted emissions | <See standard> |
| EMI-002 | FCC Part 15 Class B | Radiated emissions | <See standard> |
| EMI-003 | CISPR 32 | Radiated emissions (EU) | <See standard> |
| EMI-004 | IEC 61000-4-2 | ESD immunity | ±4kV contact, ±8kV air |
| EMI-005 | IEC 61000-4-3 | Radiated immunity | 10 V/m |
| EMI-006 | IEC 61000-4-4 | EFT immunity | ±2kV |

**Test Lab:** [Name of accredited test laboratory]
**Scheduled Dates:** [DVT: DATE, PVT: DATE]

---

## Manufacturing Validation (PVT Focus)

### Process Capability

| Process | Metric | Target | Measurement Method |
|---------|--------|--------|--------------------|
| PCB Assembly | Defect rate | <0.1% | AOI + X-ray inspection |
| Enclosure molding | First pass yield | >98% | Visual + dimensional inspection |
| Final assembly | Cycle time | <2 minutes/unit | Time study |
| Functional test | Yield | >99% | Automated test results |
| Packaging | Damage rate | <0.1% | Ship test |

### First Article Inspection

Conduct full dimensional and functional inspection on first production units:
- [ ] Dimensional measurements (100% of critical dimensions)
- [ ] Material verification (XRF analysis)
- [ ] Component verification (BOM match)
- [ ] Functional test (all test cases)
- [ ] Cosmetic inspection (appearance standards)

### Statistical Process Control

Implement SPC for:
- Critical dimensions (Cpk >1.33)
- Electrical parameters (Cpk >1.33)
- Functional test results
- Cosmetic defect rates

---

## Test Execution

### Sample Selection

**EVT:** Hand-pick best samples, document deviations
**DVT:** Random selection from build
**PVT:** Random sampling plan per ANSI/ASQ Z1.4 (AQL 1.0)

### Test Sequence

1. Incoming inspection
2. Functional testing
3. Electrical testing
4. Mechanical testing
5. Environmental testing (destructive)
6. Reliability testing (destructive)
7. Safety/EMC testing (send to lab)

### Data Collection

**For Each Test:**
- Test ID
- Sample ID
- Test date/time
- Operator
- Equipment used
- Results (pass/fail + measurements)
- Observations/notes
- Photos of failures

**Database:** [Test data management system]

---

## Failure Management

### Failure Reporting

**When a test fails:**
1. Stop testing immediately
2. Document failure mode
3. Take photos/videos
4. Preserve failed unit
5. Create failure report (use 8D template)
6. Notify engineering team
7. Determine if testing should continue

### Root Cause Analysis

Use 8D methodology for all failures:
- D1: Form team
- D2: Describe problem
- D3: Containment action
- D4: Root cause analysis
- D5: Corrective action
- D6: Implement corrective action
- D7: Prevent recurrence
- D8: Recognize team

### Re-Test Requirements

After design changes:
- Minor change: Repeat affected tests only
- Major change: Repeat full test plan
- Critical safety change: Full re-certification

---

## Pass/Fail Criteria

### Phase Exit Criteria

**EVT Exit:**
- [ ] All P1 functional tests pass
- [ ] Basic electrical parameters within spec
- [ ] No critical safety issues
- [ ] Design risks identified and documented

**DVT Exit:**
- [ ] 100% functional test pass
- [ ] All electrical/mechanical specs met
- [ ] Environmental testing complete, 100% pass
- [ ] Reliability targets demonstrated
- [ ] Safety pre-testing complete
- [ ] Design frozen

**PVT Exit:**
- [ ] Production yield >95%
- [ ] All certifications obtained
- [ ] Supplier quality validated
- [ ] Packaging validated
- [ ] Manufacturing process capable (Cpk >1.33)
- [ ] Ready for mass production

---

## Test Schedule

| Milestone | Start Date | End Date | Owner |
|-----------|----------|----------|-------|
| Sample build | [DATE] | [DATE] | Mfg |
| Incoming inspection | [DATE] | [DATE] | QA |
| Functional testing | [DATE] | [DATE] | QA |
| Electrical testing | [DATE] | [DATE] | QA |
| Mechanical testing | [DATE] | [DATE] | QA |
| Environmental testing | [DATE] | [DATE] | Test Lab |
| Reliability testing | [DATE] | [DATE] | QA |
| Safety/EMC testing | [DATE] | [DATE] | Cert Lab |
| Data analysis | [DATE] | [DATE] | QA Lead |
| Final report | [DATE] | [DATE] | QA Lead |
| Design review | [DATE] | [DATE] | Engineering |

---

## Resources

### Team

| Role | Name | Responsibility |
|------|------|----------------|
| QA Lead | [Name] | Plan ownership, reporting |
| QA Engineer | [Name] | Test execution, data collection |
| Electrical Engineer | [Name] | Electrical test support |
| Mechanical Engineer | [Name] | Mechanical test support |
| Reliability Engineer | [Name] | Reliability testing, analysis |

### Equipment

| Equipment | Model | Location | Calibration Due |
|-----------|-------|----------|-----------------|
| Environmental chamber | [Model] | Lab A | [DATE] |
| Power supply | [Model] | Lab B | [DATE] |
| Oscilloscope | [Model] | Lab B | [DATE] |
| Drop test rig | [Model] | Lab C | [DATE] |

### Test Facilities

**Internal:**
- Electrical test lab
- Mechanical test lab

**External:**
- [Lab Name] - Environmental testing
- [Lab Name] - EMC/Safety testing

---

## Deliverables

### Test Reports

- [ ] Functional Test Report
- [ ] Electrical Test Report
- [ ] Mechanical Test Report
- [ ] Environmental Test Report
- [ ] Reliability Test Report
- [ ] Safety/EMC Test Reports
- [ ] Final Validation Report

### Supporting Documents

- [ ] Test Data (raw measurements)
- [ ] Failure Reports (if any)
- [ ] Photos/Videos
- [ ] Certification Documents
- [ ] Lessons Learned

---

## Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Engineering Manager | | | |
| Product Manager | | | |
| Regulatory Manager | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial plan |
