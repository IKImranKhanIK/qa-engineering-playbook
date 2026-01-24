# Power and Battery Testing

## Overview

Power system testing validates electrical safety, power consumption, battery life, charging systems, and thermal management. Poor power design leads to short battery life, overheating, safety hazards, and regulatory failures.

## Why Power Testing Matters

### Real-World Incidents

**Samsung Galaxy Note 7 (2016)**
- Issue: Battery fires and explosions
- Root cause: Battery design flaw + inadequate testing
- Impact: 2.5 million devices recalled, $5+ billion loss
- **Lesson:** Battery testing is critical for safety

**Dell Laptop Recall (2006)**
- Issue: Batteries overheated and caught fire
- Root cause: Manufacturing defect in battery cells
- Impact: 4.1 million laptops recalled
- **Lesson:** Battery supplier quality must be validated

**Hoverboard Fires (2015)**
- Issue: Cheap lithium batteries exploded during charging
- Root cause: No battery management system, poor quality cells
- Impact: Multiple fires, FAA banned them on planes
- **Lesson:** Proper charging protection is non-negotiable

---

## Battery Fundamentals

### Battery Types

| Type | Voltage | Energy Density | Cycle Life | Cost | Use Case |
|------|---------|----------------|------------|------|----------|
| **Li-ion** | 3.6-3.7V | High (250 Wh/kg) | 500-1000 | High | Smartphones, laptops |
| **Li-Po** | 3.7V | Very High (300 Wh/kg) | 500-1000 | High | Thin devices, drones |
| **NiMH** | 1.2V | Medium (100 Wh/kg) | 500-1000 | Medium | Cameras, toys |
| **Alkaline** | 1.5V | Low (150 Wh/kg) | Single-use | Low | Remotes, flashlights |
| **Coin Cell (CR2032)** | 3V | Low | Single-use | Low | Watches, BIOS |

### Battery Specifications

```
Example: Smartphone Battery

Chemistry: Lithium-ion Polymer (Li-Po)
Nominal Voltage: 3.85V
Capacity: 3,000 mAh (11.55 Wh)
Max Charge Voltage: 4.4V
Min Discharge Voltage: 3.0V
Charge Rate: 1C (3A max)
Discharge Rate: 2C (6A max)
Operating Temp: 0°C to 45°C (charging)
                -20°C to 60°C (discharging)
Cycle Life: 500 cycles to 80% capacity
Safety: Built-in protection circuit
```

---

## Battery Capacity Testing

### Rated Capacity Verification

```
Test: Verify 3,000 mAh Capacity

Setup:
1. Fully charge battery to 4.4V
2. Rest for 1 hour
3. Discharge at constant current (0.2C = 600mA)
4. Cut-off at 3.0V
5. Measure total mAh discharged

Calculation:
Discharge time = Capacity / Current
Expected: 3,000 mAh / 600 mA = 5 hours

Results (5 batteries):
- Battery 1: 3,050 mAh (101.7%) ✅
- Battery 2: 2,980 mAh (99.3%) ✅
- Battery 3: 3,020 mAh (100.7%) ✅
- Battery 4: 2,750 mAh (91.7%) ❌ (Below 95% min)
- Battery 5: 3,100 mAh (103.3%) ✅

Conclusion: 4/5 pass (80% pass rate)
Action: Reject lot, investigate battery 4
```

### Capacity at Different Discharge Rates

```
Test: Capacity vs Discharge Rate

Battery: 3,000 mAh nominal

Discharge Rate | Measured Capacity | % of Nominal
--------------|-------------------|-------------
0.2C (600mA)  | 3,050 mAh        | 101.7%
0.5C (1.5A)   | 2,920 mAh        | 97.3%
1C (3A)       | 2,700 mAh        | 90.0%
2C (6A)       | 2,300 mAh        | 76.7%

Observation:
- Higher discharge rates reduce usable capacity
- This is normal Li-ion behavior
- Product design must account for actual discharge rate
```

---

## Battery Life Testing

### Typical Use Case Testing

```
Test: Smart Watch Battery Life

Target: 2 days (48 hours) typical use

Typical Use Profile:
- Display on: 5% of time (72 minutes/day)
- Heart rate monitoring: Continuous
- Step counting: Continuous
- Bluetooth connected: 100%
- GPS: 30 minutes/day
- Notifications: 50 per day
- Sleep tracking: 8 hours/night

Test Setup:
1. Fully charge watch
2. Run automated test script simulating usage
3. Measure time until shutdown (0% battery)
4. Repeat with 5 units

Automated Script:
- Wake display every 5 minutes for 10 seconds
- Simulate heart rate readings every 2 seconds
- Log steps every minute
- GPS on for 30 minutes
- Send test notifications

Results:
- Unit 1: 51.2 hours ✅
- Unit 2: 48.7 hours ✅
- Unit 3: 46.3 hours ⚠️ (Below target)
- Unit 4: 49.8 hours ✅
- Unit 5: 50.5 hours ✅

Average: 49.3 hours ✅
Pass: 4/5 units meet 48-hour target
```

### Battery Life Under Extreme Conditions

```
Test: Battery Life at Temperature Extremes

Condition 1: Cold (-10°C)
- Expected capacity reduction: ~30%
- Result: 33.6 hours (70% of nominal) ✅

Condition 2: Hot (45°C)
- Expected capacity reduction: ~10%
- Result: 44.1 hours (92% of nominal) ✅

Condition 3: High Brightness
- Display at 100% brightness (vs 50% typical)
- Result: 38.2 hours (79% of nominal) ✅
```

---

## Charging System Testing

### Charge Time Testing

```
Test: Wireless Earbuds Charging

Battery Capacity: 50 mAh per earbud
Charging Current: 50 mA (1C)
Expected Time: ~1 hour

Test:
1. Fully discharge earbuds to 0%
2. Place in charging case
3. Monitor voltage and current
4. Record time to full charge (4.2V, current < 5mA)

Results:
- Time to 80%: 35 minutes
- Time to 100%: 62 minutes ✅
- Charging profile: CC-CV (correct)

Charging Curve:
0-30 min: Constant current (50mA)
30-60 min: Constant voltage (4.2V), current tapers
60+ min: Trickle charge (< 5mA)
```

### Fast Charging Testing

```
Test: Smartphone Fast Charging (USB-C PD)

Standard Charging: 5V @ 2A = 10W
Fast Charging: 9V @ 2A = 18W

Test Protocol:
1. Discharge phone to 0%
2. Connect to fast charger
3. Monitor voltage, current, temperature every minute
4. Record time to 50%, 80%, 100%

Results:
Time to 50%: 28 minutes ✅ (Target: < 30 min)
Time to 80%: 52 minutes ✅
Time to 100%: 95 minutes ✅

Power Profile:
0-30 min: 18W (9V @ 2A)
30-50 min: 15W (9V @ 1.67A)
50-80 min: 10W (5V @ 2A)
80-100 min: 5W (5V @ 1A) - Slow trickle

Max Battery Temp: 38°C ✅ (Limit: 45°C)
```

### Charging Safety Testing

```
Test: Overcharge Protection

Test:
1. Fully charge battery to 4.4V
2. Continue charging (should auto-stop)
3. Monitor voltage, temperature
4. Verify protection circuit activates

Expected: Charging stops at 4.4V
Actual: Charging stopped at 4.39V ✅
Temperature: 32°C (safe) ✅

Test: Reverse Polarity Protection
Connect charger backwards
Result: No damage, no charging ✅
Protection circuit prevented reverse current
```

---

## Battery Safety Testing

### Overcharge Testing

```
Test: Battery Overcharge to Failure

WARNING: Dangerous test, requires safety precautions
- Blast chamber
- Fire suppression
- Safety goggles
- Remote monitoring

Test:
1. Charge battery beyond 4.4V max
2. Monitor temperature and voltage
3. Continue until failure or 5.0V

Results:
- 4.4V: Normal operation
- 4.5V: Temperature rising to 45°C
- 4.6V: Battery swelling observed
- 4.7V: Venting (gas release), temperature 85°C
- Test stopped (safety limit)

Conclusion:
- Protection circuit must prevent > 4.4V
- Secondary protection: Battery cell has internal vent
- Design validation: ✅ Multiple layers of protection
```

### Over-Discharge Testing

```
Test: Battery Over-Discharge

Test:
1. Discharge battery to 3.0V (normal cutoff)
2. Continue discharge to 2.5V
3. Monitor voltage and temperature
4. Attempt to recharge

Results:
- 3.0V to 2.5V: Battery voltage drops rapidly
- Temperature: Stable
- Recharge test: Failed ❌
- Battery damaged by over-discharge

Conclusion:
- Device must cut off at 3.0V minimum
- Over-discharge damages battery permanently
- Protection circuit validation critical
```

### Short Circuit Testing

```
Test: Battery Short Circuit Protection

Setup:
1. Place battery in blast chamber
2. Connect low-resistance wire across terminals (< 0.1Ω)
3. Monitor current, voltage, temperature
4. Safety: Remote monitoring, automatic cutoff

Results:
- Protection circuit activated < 100ms ✅
- Current limited to 6A (2C max) ✅
- No thermal runaway ✅
- Battery surface temp: 42°C ✅

Test with failed protection circuit (sample with disabled BMS):
- Current spiked to 30A
- Temperature reached 120°C in 15 seconds
- Battery vented (gas release)
- Test stopped for safety

Conclusion: Protection circuit essential for safety
```

### Nail Penetration Test

```
Test: UN 38.3 Nail Penetration

Purpose: Simulate internal short circuit from impact

Test:
1. Fully charge battery
2. Drive 3mm nail through battery at 0.1mm/s
3. Monitor for fire or explosion
4. Continue for 6 hours

Results:
- Nail penetration caused internal short
- Temperature rose to 65°C
- Smoke and venting occurred
- No fire or explosion ✅
- Battery destroyed but safe failure mode

Conclusion: Battery passes safety requirement
```

### Crush Test

```
Test: Battery Crush

Setup:
1. Place fully charged battery between two plates
2. Apply 13 kN force (equivalent to 1,300 kg)
3. Monitor temperature, voltage

Results:
- Battery deformed
- Internal short circuit occurred
- Venting (gas release)
- Temperature: 95°C
- No fire or explosion ✅

Pass: Battery failed safely
```

---

## Battery Cycle Life Testing

```
Test: 500 Cycle Life Test

Procedure:
1. Fully charge to 4.4V
2. Discharge to 3.0V at 1C
3. Rest 30 minutes
4. Repeat 500 times

Capacity Measurement:
- Cycle 0: 3,000 mAh (100%)
- Cycle 100: 2,940 mAh (98%)
- Cycle 200: 2,850 mAh (95%)
- Cycle 300: 2,760 mAh (92%)
- Cycle 400: 2,640 mAh (88%)
- Cycle 500: 2,520 mAh (84%)

Target: > 80% capacity after 500 cycles
Result: 84% ✅ Pass

Test Duration: ~1 month (with 30 min rest between cycles)
```

### Accelerated Cycle Life Testing

```
Test: High Temperature Cycling

Purpose: Accelerate aging to predict long-term capacity

Conditions:
- Temperature: 45°C (vs 25°C normal)
- Charge/discharge: 1C
- Depth of Discharge: 100% (0-100%)

Acceleration Factor: ~3x
(100 cycles at 45°C ≈ 300 cycles at 25°C)

Results after 100 cycles at 45°C:
- Capacity: 2,610 mAh (87%)
- Equivalent to ~300 cycles at 25°C
- Projection: 500-cycle capacity ~82% ✅
```

---

## Power Consumption Testing

### Active Mode Current

```
Test: Smart Speaker Power Consumption

Mode: Active (playing music)

Test Setup:
1. Connect ammeter in series with power supply
2. Play music at 50% volume
3. Measure current continuously for 1 hour
4. Calculate average power

Results:
- Voltage: 5.0V
- Current: 1.2A average
- Power: 6.0W
- Peak current: 1.8A (during bass notes)

Validation:
- Spec: < 7W typical ✅
- Thermal: Device temp 38°C ✅
```

### Standby Power

```
Test: Smart Thermostat Standby

Mode: Idle (display off, WiFi connected)

Results:
- Current: 45 mA
- Power: 5V × 0.045A = 0.225W
- Spec: < 0.5W ✅

Daily energy: 0.225W × 24h = 5.4 Wh
Annual energy: 5.4 Wh × 365 = 1.97 kWh
Annual cost: 1.97 kWh × $0.12 = $0.24/year
```

### Sleep Mode Current (Critical for Battery Life)

```
Test: Fitness Tracker Sleep Mode

Sleep Mode: Display off, heart rate monitor off

Target: < 1 mA (for multi-day battery life)

Test:
1. Fully charge device
2. Put in sleep mode
3. Measure current with high-precision ammeter
4. Monitor for 24 hours

Results:
- Average current: 0.85 mA ✅
- Battery capacity: 200 mAh
- Expected life: 200 mAh / 0.85 mA = 235 hours (9.8 days)

Current Distribution:
- RTC (real-time clock): 0.3 mA
- MCU (sleep mode): 0.2 mA
- Bluetooth (advertising): 0.2 mA
- Accelerometer (low power): 0.15 mA
Total: 0.85 mA ✅
```

---

## Power Supply Testing

### Input Voltage Range Testing

```
Test: Device operates across voltage range

Spec: 4.5V to 5.5V (USB power with tolerance)

Test:
- 4.5V: Device powers on, all functions work ✅
- 5.0V: Normal operation ✅
- 5.5V: Normal operation ✅
- 4.4V: Device shuts down (correct) ✅
- 5.6V: Overvoltage protection triggered (correct) ✅

Pass: Device operates within spec, protected outside spec
```

### Power Supply Ripple

```
Test: Ripple Tolerance

Test:
1. Apply 5V with intentional ripple (100 mV pk-pk)
2. Monitor device operation
3. Verify no audio/video interference

Results:
- Device operates normally
- No visible screen flicker
- No audible noise from speakers
- Pass ✅
```

---

## Thermal Testing for Power Systems

### Battery Temperature During Charging

```
Test: Thermal Management During Fast Charging

Setup:
1. Attach thermocouples to battery surface (4 locations)
2. Place in ambient temperature chamber (25°C)
3. Fast charge from 0% to 100%
4. Record temperatures every minute

Results:
Location        | Max Temp | Spec Limit
----------------|----------|------------
Center          | 42°C     | < 45°C ✅
Edge (near IC)  | 44°C     | < 45°C ✅
Connector area  | 38°C     | < 45°C ✅
Opposite corner | 39°C     | < 45°C ✅

Thermal Management:
- Charging slowed when battery reached 40°C
- Prevented overheating ✅
- Safe thermal design confirmed
```

### Power IC Thermal Testing

```
Test: Voltage Regulator Thermal Performance

Component: Buck converter (5V to 3.3V, 2A max)

Test:
1. Load output with 2A resistive load
2. Measure IC junction temperature
3. Verify within spec

Results:
- Ambient: 25°C
- IC surface temp: 72°C
- Junction temp (calculated): 85°C
- Max spec: 125°C ✅
- Margin: 40°C ✅

Thermal Management:
- Adequate copper pour for heat dissipation
- No additional heatsink needed
```

---

## Regulatory Testing

### USB-IF Compliance Testing

```
Test: USB-C Power Delivery Compliance

Requirements:
- Voltage accuracy: ±5%
- Current limit accuracy: ±5%
- Communication protocol: USB PD 3.0

Tests:
1. Voltage accuracy: 8.92V - 9.08V ✅
2. Current limiting: 1.90A - 2.10A ✅
3. PD negotiation: Successful ✅
4. Cable e-marker detected: ✅

Certification: USB-IF certified ✅
```

### Safety Certifications

**UL/IEC 60950 (Information Technology Equipment)**

```
Tests Required:
- Electrical strength (hipot test)
- Insulation resistance
- Leakage current
- Touch temperature
- Fire enclosure
- Abnormal operation
- Limited power source

Results: All tests passed ✅
Certificate: UL Listed
```

---

## Battery Management System (BMS) Validation

### BMS Functions to Test

```
1. Overcharge Protection
   - Cuts off charging at 4.4V ✅

2. Over-discharge Protection
   - Cuts off load at 3.0V ✅

3. Overcurrent Protection
   - Limits discharge to 2C (6A) ✅
   - Limits charge to 1C (3A) ✅

4. Short Circuit Protection
   - Activates < 100ms ✅

5. Temperature Monitoring
   - Cuts off charging above 45°C ✅
   - Cuts off discharging above 60°C ✅
   - Cuts off charging below 0°C ✅

6. Cell Balancing (multi-cell packs)
   - Balances cells within 50mV ✅
```

---

## Best Practices

### 1. Test at Temperature Extremes

```
❌ Bad: Test battery only at 25°C
Reality: Phones used in -10°C winter, 45°C summer

✅ Good: Test at -10°C, 25°C, 45°C
```

### 2. Use Actual Use Profiles

```
❌ Bad: Continuous discharge at 0.2C
Reality: Variable load (idle, active, burst)

✅ Good: Simulate real usage pattern with varying loads
```

### 3. Safety Testing is Not Optional

```
Every battery must pass:
- Overcharge test
- Short circuit test
- Crush/penetration test (samples)

One battery fire can end your company.
```

### 4. Monitor Battery Health Over Life

```
Track throughout product life:
- Capacity degradation
- Internal resistance increase
- Swelling
- Warranty returns related to battery
```

---

## What Senior Engineers Know

**Battery testing takes time.** Cycle life tests take months. Plan accordingly.

**Safety testing is destructive.** Budget for destroyed units. It's worth it.

**Temperature is battery's enemy.** Heat accelerates aging. Design for thermal management.

**Cheap batteries are expensive.** Warranty claims, fires, recalls cost 100x more than quality batteries.

**BMS is not optional.** Every lithium battery needs protection circuitry. Period.

---

## Exercise

**Design Battery Test Plan:**

Product: Wireless Headphones
- Battery: 600 mAh Li-Po
- Playback time: 30 hours claimed
- Charging: USB-C, 2 hours full charge
- Operating temp: 0°C to 40°C

**Your Task:**

1. Define capacity test procedure
2. Design typical use battery life test
3. Specify charging system tests
4. List safety tests required
5. Define acceptance criteria

**Deliverable:** Complete battery test plan

---

## Next Steps

- Master [Firmware Validation](05-firmware-validation.md)
- Study [Failure Analysis](07-failure-analysis.md) techniques
- Review [Environmental Testing](03-environmental-testing.md)
- Learn [Measurement and Uncertainty](09-measurement-uncertainty.md)
