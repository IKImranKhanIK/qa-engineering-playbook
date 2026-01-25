# Lab: Environmental Testing Planning

**Difficulty:** Advanced
**Duration:** 3 hours
**Category:** Hardware

## Objectives

- Design comprehensive environmental test plan
- Understand testing standards (MIL-STD, IEC)
- Create test specifications
- Define pass/fail criteria
- Plan test resources and schedule

## Prerequisites

- Completed [Environmental Testing lesson](../../docs/07-hardware-qa/03-environmental-testing.md)
- Understanding of hardware validation phases

## Scenario

Design environmental test plan for: **Rugged Outdoor GPS Tracker**

**Target Use Case:**
- Outdoor activities (hiking, camping, cycling)
- Asset tracking (vehicles, cargo)
- 5-year product lifespan expected
- Global distribution (all climates)

**Product Specs:**
- IP67 rated
- Operating temp: -20°C to +60°C
- Storage temp: -40°C to +80°C
- 10,000mAh battery
- GPS + Cellular connectivity
- Shock/vibration resistant
- Dimensions: 120 x 80 x 25mm
- Weight: 200g

## Part 1: Temperature Testing (60 minutes)

### Exercise 1.1: Temperature Cycle Test

**Design test specification:**

**Test Standard:** IEC 60068-2-14 (Temperature cycling)

**Test Parameters to Define:**
- Temperature range
- Cycle duration
- Number of cycles
- Dwell time at each temperature
- Transition rate (°C/min)
- Device state during test (on/off/standby)

**Example Specification:**
```
Test: Temperature Cycling
Standard: IEC 60068-2-14, Test Na

Profile:
- Low temp: -30°C
- High temp: +70°C
- Ramp rate: 10°C/min
- Dwell time: 2 hours each extreme
- Cycles: 100 cycles
- Device state: On, GPS active

Mid-test checks (every 25 cycles):
- Visual inspection
- Function test
- GPS acquisition time
- Battery capacity check

Final verification:
- Full functional test
- Battery capacity (must be >80% of nominal)
- GPS accuracy
- Cellular connectivity
- Housing integrity
```

**Task:** Create full specification including equipment needed.

### Exercise 1.2: Thermal Shock Test

**Scenario:** Rapid temperature changes (e.g., device in hot car moved to freezer)

Design test:
- Temperature extremes
- Transfer time between zones
- Number of cycles
- What to measure

## Part 2: Humidity Testing (45 minutes)

### Exercise 2.1: Humidity Cycle Test

**Test Standard:** IEC 60068-2-30

**Design Parameters:**
- Humidity range (e.g., 20% to 95% RH)
- Temperature during test
- Cycle profile
- Number of cycles
- Condensation allowed/not allowed

**Define:**
- Pre-conditioning steps
- Test chamber requirements
- Measurement points
- Acceptance criteria

### Exercise 2.2: Combined Temperature-Humidity Test

**HASS (Highly Accelerated Stress Screen)**

Create profile that combines:
- Temperature cycling: -20°C to +60°C
- Humidity: 80-95% RH
- Duration: 24 hours
- Device operating vs dormant

## Part 3: Mechanical Testing (60 minutes)

### Exercise 3.1: Drop Test Specification

**Test Standard:** MIL-STD-810H, Method 516.8

**Design test:**

**Sample Specification:**
```
Test: Free Fall Drop Test

Drop height: 1.5 meters (5 feet)
Target surface: Concrete over steel plate
Number of drops: 26 (all faces, edges, corners)
Device state: Operating (GPS tracking active)

Drop sequence:
- 6 face drops (each side)
- 12 edge drops
- 8 corner drops

Inspection after each drop:
- Visual damage assessment
- Functional verification

Final acceptance:
- No cracks in housing
- All functions operational
- Water resistance maintained (IP67 verification)
- GPS accuracy within spec
```

**Task:** Create complete drop test procedure.

### Exercise 3.2: Vibration Test

**Test Standard:** MIL-STD-810H, Method 514.8

**Define:**
- Frequency range
- Amplitude or acceleration
- Duration per axis
- Random vs sinusoidal
- Device mounting method

**Transportation Simulation:**
```
Test: Transportation Vibration

Profile: Random vibration per MIL-STD-810H
Frequency range: 20-2000 Hz
PSD (Power Spectral Density): 0.04 g²/Hz
RMS acceleration: 1.5g
Duration: 1 hour per axis (X, Y, Z)
Total: 3 hours

Device state: Off (simulating shipping)

Acceptance:
- No loose components (rattle test)
- All functions operational
- No cosmetic damage
```

## Part 4: Environmental Combinations (45 minutes)

### Exercise 4.1: Altitude + Temperature Test

**Scenario:** Device used at high altitude (mountains)

**Test Parameters:**
- Altitude: 4000 meters (13,000 feet)
- Pressure: ~60 kPa
- Temperature: -20°C
- Duration: 8 hours
- Device state: Operating

**Effects to Test:**
- Battery performance at low pressure
- GPS performance
- Display integrity (no bubbles in screen)
- Housing integrity

### Exercise 4.2: Dust + Vibration Test

**IP6X Dust Test + Vibration:**

1. Subject device to dust chamber (talcum powder)
2. While under vibration
3. Verify no dust ingress
4. Check seal integrity

## Part 5: Salt Spray & Corrosion (30 minutes)

### Exercise 5.1: Salt Spray Test

**Test Standard:** ASTM B117

**For corrosion resistance:**

**Specification:**
```
Test: Salt Spray (Salt Fog)

Solution: 5% NaCl
Temperature: 35°C ±2°C
Spray rate: 1-2 ml/80cm²/hr
Duration: 48 hours continuous

Pre-test:
- Document all exposed metal
- Photograph device

Post-test:
- Visual inspection for corrosion
- Function verification
- Disassemble and inspect internal areas

Acceptance:
- No visible corrosion on critical areas
- All functions operational
- Connector integrity maintained
```

## Deliverables

Create comprehensive Environmental Test Plan:

### 1. Test Matrix

| Test Category | Test Type | Standard | Sample Size | Duration | Priority |
|---------------|-----------|----------|-------------|----------|----------|
| Temperature | Cycling | IEC 60068-2-14 | 5 units | 10 days | High |
| Temperature | Shock | IEC 60068-2-14 | 3 units | 2 days | High |
| Humidity | Steady state | IEC 60068-2-78 | 3 units | 7 days | High |
| Mechanical | Drop | MIL-STD-810H | 10 units | 1 day | Critical |
| Mechanical | Vibration | MIL-STD-810H | 5 units | 1 day | High |
| Altitude | Low pressure | IEC 60068-2-13 | 3 units | 1 day | Medium |
| Corrosion | Salt spray | ASTM B117 | 5 units | 3 days | High |
| Water | IP67 ingress | IEC 60529 | 5 units | 1 day | Critical |

### 2. Test Specifications

Detailed specs for each test including:
- Test setup diagrams
- Equipment requirements
- Step-by-step procedures
- Data collection templates
- Pass/fail criteria

### 3. Resource Plan

- Test equipment needed (chambers, shakers, etc.)
- Lab requirements
- Test engineer hours
- Sample quantities
- Total budget estimate

### 4. Schedule

- Test sequence (which tests run first)
- Dependencies
- Parallel vs sequential testing
- Total timeline

## Bonus Challenges

1. **Accelerated Life Testing (ALT)**
   - Design tests to simulate 5-year life in weeks
   - Calculate acceleration factors

2. **HALT (Highly Accelerated Life Testing)**
   - Design destruct limits test
   - Find operating margins

3. **IP Rating Verification**
   - Create full IP67 test procedure
   - Include all IEC 60529 requirements

4. **Certification Test Planning**
   - Research FCC/CE requirements
   - Plan EMI/EMC testing
   - RoHS compliance verification

## Evaluation Criteria

- Completeness of test coverage
- Appropriate test standards selected
- Realistic resource estimates
- Clear acceptance criteria
- Prioritization rationale

## Next Steps

- Study environmental testing standards
- Visit environmental testing lab
- Observe actual environmental tests
- Learn about test equipment operation
- Understand failure analysis from environmental stress
