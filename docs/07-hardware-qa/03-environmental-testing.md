# Environmental Testing

## Overview

Environmental testing validates that hardware products function correctly under various environmental conditions they'll encounter in real-world use: temperature extremes, humidity, vibration, drops, water exposure, and more. These tests expose design weaknesses before customers do.

## Why Environmental Testing Matters

### Real-World Failures

**Case 1: Smartphone Battery Fires (2016)**
- Issue: Batteries overheated and caught fire
- Root cause: Inadequate thermal testing
- Impact: Global recall, $5 billion cost, brand damage
- **Lesson:** Temperature testing is not optional

**Case 2: Smart Watch Water Damage**
- Issue: Claimed IP67, failed in swimming pool
- Root cause: Tested only static pressure, not dynamic (swimming)
- Impact: Warranty claims, customer dissatisfaction
- **Lesson:** Test conditions must match actual use

**Case 3: Automotive Sensor Failure**
- Issue: Sensors failed in cold weather
- Root cause: Only tested at room temperature
- Impact: Vehicle safety recalls
- **Lesson:** Test across full operating range

---

## Temperature Testing

### Operating Temperature Range

**Standard Ranges:**

| Environment | Range | Examples |
|-------------|-------|----------|
| **Indoor consumer** | 0°C to 40°C | Laptops, desktops, smart speakers |
| **Portable consumer** | -10°C to 60°C | Smartphones, wearables, cameras |
| **Automotive** | -40°C to 85°C | Car electronics, sensors |
| **Industrial** | -40°C to 70°C | Factory equipment, outdoor sensors |
| **Military** | -55°C to 125°C | Defense equipment |

### Test Methods

**1. High Temperature Operating Test**

```
Test: Wireless Earbuds

Temperature: 60°C (max operating temp)
Duration: 4 hours continuous use
Sample Size: 10 units
Test Sequence:
1. Pre-condition at 25°C, verify functionality
2. Place in temperature chamber
3. Ramp to 60°C over 30 minutes
4. Soak for 30 minutes at 60°C
5. Play audio continuously for 4 hours
6. Monitor: Audio quality, battery discharge, surface temperature
7. Remove, cool to 25°C
8. Re-test all functions

Pass Criteria:
- Audio quality: No distortion
- Battery: Still operational
- Surface temp: < 45°C (safe to touch)
- No physical damage

Results:
- 9/10: Pass
- 1/10: Fail (audio cut out after 3 hours)
Root Cause: Amplifier IC thermal shutdown at 58°C
Action: Add heat sink to amplifier
```

**2. Low Temperature Operating Test**

```
Test: Smart Thermostat

Temperature: -10°C (min operating temp)
Duration: 8 hours
Sample Size: 5 units

Test Sequence:
1. Place units in cold chamber
2. Ramp to -10°C
3. Power on units
4. Test touchscreen response
5. Test WiFi connectivity
6. Test temperature sensor accuracy
7. Leave running overnight

Pass Criteria:
- Display readable
- Touchscreen responsive (< 200ms)
- WiFi maintains connection
- Temperature reading accuracy: ±0.5°F
- No condensation

Results: 5/5 Pass ✅
```

**3. Temperature Cycling**

```
Test: Smart Watch

Profile: -20°C to 60°C cycling
Dwell Time: 2 hours at each extreme
Ramp Rate: 5°C/minute
Number of Cycles: 10 cycles

Test Sequence:
1. Start at 25°C
2. Ramp to -20°C (5°C/min)
3. Hold at -20°C for 2 hours
4. Ramp to 60°C (5°C/min)
5. Hold at 60°C for 2 hours
6. Repeat 10 times
7. Return to 25°C
8. Functional test

Purpose: Stress from thermal expansion/contraction
Common Failures:
- Solder joint cracks
- Display delamination
- Gasket seal leaks
- Battery connection loss

Results:
- Pre-test: 10/10 functional
- Post-test: 9/10 functional
- 1 failure: Display flicker (solder joint crack)
```

**4. Thermal Shock**

```
Test: Ruggedized Tablet

Hot Chamber: 70°C
Cold Chamber: -30°C
Transfer Time: < 30 seconds
Dwell Time: 30 minutes each
Cycles: 20

Purpose: Extreme thermal stress (more aggressive than cycling)

Results:
- 3/5 failures: Screen adhesive failed
- Root cause: Adhesive not rated for thermal shock
- Action: Switch to aerospace-grade adhesive
```

### Storage Temperature Testing

```
Non-Operating Temperature Test

Storage Range: -40°C to 70°C
Duration: 7 days at each extreme

Test:
1. Power off devices
2. Store at -40°C for 7 days
3. Return to room temp for 24 hours
4. Functional test
5. Store at 70°C for 7 days
6. Return to room temp for 24 hours
7. Functional test

Pass Criteria: Device fully functional after both extremes

Common Failures:
- Battery capacity loss
- LCD damage
- Adhesive degradation
- Plastic warping
```

---

## Humidity Testing

### Humidity Tests

**1. Constant Temperature/Humidity**

```
Test: Fitness Tracker

Conditions: 85°C / 85% RH (85/85 test)
Duration: 168 hours (1 week)
Sample Size: 10 units

Purpose: Accelerated corrosion, moisture ingress

Test Sequence:
1. Pre-test functional verification
2. Place in humidity chamber
3. Power on, run for full duration
4. Visual inspection daily
5. Post-test functional verification

Expected Failures:
- Corrosion on exposed metal
- PCB trace corrosion
- Connector corrosion
- Battery swelling

Results:
- 8/10: Pass
- 2/10: Fail (corrosion on USB connector)
- Action: Apply conformal coating to connectors
```

**2. Temperature/Humidity Cycling**

```
Test: Smart Home Hub

Profile:
- Low: 10°C / 30% RH
- High: 50°C / 90% RH
- Cycle Time: 24 hours
- Cycles: 10

Purpose: Simulate seasonal changes

Results:
- Condensation observed inside enclosure (Cycle 3)
- Root cause: Poor ventilation design
- Action: Add vent holes with membrane filter
```

### Moisture Resistance

**Damp Heat Test:**

```
Test: Outdoor Camera

Conditions: 40°C / 93% RH
Duration: 21 days (504 hours)
Standard: IEC 60068-2-78

Purpose: Long-term moisture resistance

Post-Test Measurements:
- Insulation resistance: > 100 MΩ (Pass: > 10 MΩ)
- No visible corrosion
- All functions operational
- No moisture inside enclosure

Result: ✅ Pass
```

---

## Ingress Protection (IP) Testing

### IP Rating System

```
IP X Y
   │ │
   │ └─ Protection against water (0-9)
   └─── Protection against solid objects (0-6)

Common Ratings:
- IP54: Dust protected, splash resistant
- IP67: Dust tight, immersion up to 1m for 30 min
- IP68: Dust tight, continuous immersion beyond 1m
```

### Water Resistance Testing

**IP67 Test:**

```
Test: Smart Watch

Requirements:
- 1 meter depth
- 30 minutes duration
- Fresh water
- Room temperature

Test Setup:
1. Verify device fully functional before test
2. Submerge in clear water tank
3. Depth: 1.0 meter (measured from top of device)
4. Duration: 30 minutes exactly
5. Remove, wipe dry
6. Visual inspection for water ingress
7. Functional test all features

Pass Criteria:
- No water ingress visible
- All functions operational
- Microphone/speaker work normally

Results (6 units):
- 5/6: Pass ✅
- 1/6: Fail (water in SIM tray)
- Root cause: Gasket not seated properly
- Action: Improve assembly process, add verification step
```

**IP68 Test (Higher Rating):**

```
Test: Rugged Phone

Requirements:
- 1.5 meters depth
- 30 minutes minimum
- Manufacturer defines exact conditions

Test:
1. 1.5m depth for 30 minutes
2. 3.0m depth for 30 minutes (stress test)
3. Repeat 10 times

Results:
- 1.5m: 10/10 Pass
- 3.0m: 9/10 Pass (1 fail - screen fogging)
```

**Dynamic Water Test (Swimming):**

```
Test: Waterproof Earbuds

Static pressure is not enough!
Test must simulate actual swimming:

Test:
1. Wear earbuds
2. Swim 30 minutes (freestyle stroke)
3. Dive to 2m depth repeatedly
4. Check for water ingress

Why dynamic test matters:
- Movement creates pressure variations
- Ears create seal/unseal cycles
- Splashing hits from all angles

Results:
- Static test: 10/10 Pass
- Swimming test: 7/10 Pass (3 had water ingress)
- Root cause: Seal design inadequate for dynamic pressure
```

### Dust Testing

**IP6X Test:**

```
Test: Outdoor IoT Sensor

Requirements:
- Complete dust protection
- No dust ingress after 8 hours in dust chamber
- Negative pressure inside test chamber

Test Setup:
1. Place device in dust chamber
2. Fill chamber with talcum powder
3. Create negative pressure (8 kPa)
4. Run for 8 hours
5. Open device, inspect for dust

Pass Criteria: No dust inside enclosure

Results:
- Test 1: Fail (dust found near button gasket)
- Root cause: Button gasket insufficient
- Action: Add labyrinth seal, retest
- Test 2: Pass ✅
```

---

## Mechanical Testing

### Drop Testing

**Standard Drop Test:**

```
Test: Smartphone

Height: 1.5 meters (5 feet)
Surface: Concrete
Orientations: 6 (face, back, 4 edges)
Drops per orientation: 3 drops
Total: 18 drops per unit
Sample size: 5 units

Test Setup:
1. Mark unit for identification
2. Pre-test functional verification
3. Drop from exact height onto marked spot on concrete
4. Inspect for damage
5. Functional test
6. Repeat for all orientations

Pass Criteria:
- Screen intact (no cracks)
- All functions operational
- Cosmetic damage acceptable
- Cracks in plastic housing acceptable if not affecting function

Results:
- Face down: 5/5 Pass (Gorilla Glass held up)
- Back down: 5/5 Pass
- Edge drops: 3/5 Pass (2 units had cracked screens)
- Overall: Fail (< 95% pass rate required)

Action:
- Add reinforcement to corner areas
- Increase screen adhesive
- Retest with 10 units: 10/10 Pass ✅
```

**Tumble Test:**

```
Test: Smartwatch

Purpose: Simulate repeated drops (e.g., thrown in bag)

Test:
1. Place 3 units in tumble drum
2. Rotate drum: 60 RPM
3. Duration: 30 minutes
4. Equivalent to ~100 drops from ~30cm

Results:
- Cosmetic: Scuffs and scratches (expected)
- Functional: 3/3 Pass
- Screen: No cracks
```

### Vibration Testing

**Random Vibration:**

```
Test: Car Dash Camera

Profile: Automotive vibration spectrum
Frequency Range: 10 Hz to 2000 Hz
PSD Level: 0.04 g²/Hz
Duration: 2 hours per axis (X, Y, Z)
Total: 6 hours

Purpose: Simulate vibration from vehicle operation

Monitoring During Test:
- Device remains functional
- No mechanical resonance
- Camera image stable (no blur)

Common Failures:
- Lens focus shift
- Connector loosening
- PCB component cracking
- Battery contact loss

Results:
- X-axis: Pass
- Y-axis: Pass
- Z-axis: Fail (SD card ejected)
- Root cause: Card slot latch vibrated open
- Action: Redesign latch with stronger spring
```

**Sinusoidal Vibration:**

```
Test: Industrial Sensor

Sweep: 10 Hz to 500 Hz
Amplitude: 2g
Sweep Rate: 1 octave/minute
Duration: 20 minutes per axis

Purpose: Find resonant frequencies

Results:
- Resonance found at 180 Hz (PCB flexing)
- Action: Add PCB stiffener, move resonance above 500 Hz
```

### Mechanical Shock

```
Test: Ruggedized Tablet

Shock Level: 50g
Duration: 11 milliseconds (half-sine pulse)
Direction: 6 orientations (+/- X, Y, Z)
Shocks per orientation: 3
Total: 18 shocks

Purpose: Simulate handling drops and impacts

Pass Criteria:
- No permanent deformation
- All functions operational
- No loose components

Results: 5/5 Pass ✅
```

---

## Altitude Testing

```
Test: Aviation Headset

Low Pressure: 12,000 feet equivalent (4,572 m)
Duration: 2 hours

Purpose: Verify operation at altitude

Test Sequence:
1. Place in altitude chamber
2. Reduce pressure to simulate 12,000 feet
3. Verify audio quality
4. Verify microphone
5. Check for outgassing (materials releasing gas)
6. Return to normal pressure

Results:
- Audio: Pass
- Microphone: Pass
- Battery: Expanded slightly (expected, returned to normal)
```

---

## Accelerated Life Testing (ALT)

### Purpose
Compress years of use into weeks/months of testing.

### Acceleration Factors

**Temperature Acceleration:**

```
Arrhenius Equation:
AF = exp[(Ea/k) × (1/T_use - 1/T_test)]

Where:
- Ea = Activation energy (eV)
- k = Boltzmann constant
- T = Temperature (Kelvin)

Example:
Normal use: 25°C (298K)
Test temp: 60°C (333K)
Ea: 0.7 eV (typical for electronics)

AF = exp[(0.7/0.0000862) × (1/298 - 1/333)]
AF ≈ 7.2

1,000 hours at 60°C = 7,200 hours at 25°C
```

**ALT Test Plan:**

```
Product: Smart Speaker
Target Life: 5 years (43,800 hours)

Test Conditions:
- Temperature: 60°C
- Humidity: 85% RH
- Power on continuously
- Play audio 16 hours/day
- WiFi connected

Acceleration Factor: 8x
Test Duration: 5,475 hours (228 days)
Sample Size: 30 units

Acceptance Criteria:
- < 3 failures for 90% confidence, 90% reliability

Results after 5,475 hours:
- 28/30 still functional
- 2 failures:
  - Unit 12: WiFi module failed (solder joint)
  - Unit 23: Speaker distortion (voice coil degraded)

Conclusion:
- Weibull analysis shows 92% reliability at 5 years
- ✅ Meets target
```

---

## Salt Spray Testing

```
Test: Outdoor Security Camera

Standard: ASTM B117
Solution: 5% NaCl (salt water)
Temperature: 35°C
Duration: 48 hours

Test Setup:
1. Spray salt solution continuously
2. Exposure to salt fog
3. After test: Rinse, dry, inspect

Inspection:
- Corrosion on metal surfaces
- Paint/coating integrity
- Gasket degradation

Results:
- Minor surface rust on mounting bracket
- No corrosion on electronics
- Gaskets intact
- Pass: Meets outdoor use requirements ✅
```

---

## UV and Sunlight Exposure

```
Test: Outdoor Smart Lock

UV Exposure: 340nm UV-A
Irradiance: 0.89 W/m²
Temperature: 60°C
Cycle: 8 hours UV + 4 hours condensation
Duration: 1,000 hours (equivalent to ~1 year outdoors)

Inspection:
- Plastic housing for fading/yellowing
- Rubber gaskets for cracking
- Touchscreen for degradation

Results:
- Housing: Slight fading (acceptable)
- Gaskets: No cracks
- Touchscreen: Fully functional
- Pass ✅
```

---

## Test Standards and Certifications

### Common Standards

| Standard | Applies To | Description |
|----------|-----------|-------------|
| **IEC 60068** | Electronics | Environmental testing methods |
| **MIL-STD-810** | Military/Rugged | Extreme environmental conditions |
| **IP Code (IEC 60529)** | All products | Ingress protection rating |
| **ASTM Standards** | Various | Material and product testing |
| **ISO 9001** | Quality Management | QMS requirements |

### Certification Bodies

- **UL (Underwriters Laboratories)**: Safety certification
- **FCC**: Radio emissions (US)
- **CE**: European conformity
- **IP Rating**: Water/dust protection
- **MIL-STD**: Military specifications

---

## Best Practices

### 1. Test Conditions Must Match Real Use

```
❌ Bad: Test smartphone at room temperature only
User Reality: Phone in hot car (60°C), cold pocket (-10°C)

✅ Good: Test across full expected range
```

### 2. Sample Size Matters

```
❌ Bad: Test 1 unit, declare pass
Reality: Sample variation means 1 unit proves nothing

✅ Good: Test 5-10 units minimum for confidence
```

### 3. Document Everything

```
Test Report Must Include:
- Test conditions (temp, humidity, etc.)
- Duration
- Sample size and serial numbers
- Pass/fail criteria
- Actual results
- Photos of failures
- Root cause analysis
- Corrective actions
```

### 4. Test Early and Often

```
Prototype stage: Identify major issues
EVT: Comprehensive environmental testing
DVT: Revalidate with production-like units
PVT: Verify no regression
```

---

## What Senior Engineers Know

**Environmental testing finds 80% of field failures.** Don't skip it.

**One test is not enough.** Temperature + humidity + vibration together creates different failures than each alone.

**Test to destruction.** Know where your product breaks. It tells you safety margin.

**IP ratings are minimum tests.** Real-world conditions are often harsher. Add margin.

**Failures are valuable.** Each failure teaches you where to strengthen the design.

---

## Exercise

**Design Environmental Test Plan:**

Product: Outdoor WiFi Camera
- Temperature range: -20°C to 50°C operating
- Weatherproof (IP66 required)
- Wall-mounted, vibration from wind
- Sunlight exposure
- Expected life: 3 years outdoors

**Your Task:**

1. Define all environmental tests needed
2. Specify test conditions and duration
3. Define pass/fail criteria
4. Estimate total test time
5. Identify likely failure modes

**Deliverable:** Complete environmental test plan

---

## Next Steps

- Master [Power and Battery Testing](04-power-battery-testing.md)
- Study [Failure Analysis](07-failure-analysis.md)
- Learn [8D and CAPA Process](08-8d-capa-process.md)
- Review [Manufacturing Quality Lifecycle](02-manufacturing-quality-lifecycle.md)
