# Measurement Uncertainty

## Overview

Every measurement has uncertainty. When you measure a component as "10.00mm", it's not exactly 10.00mm—it might be 10.01mm or 9.99mm. Understanding measurement uncertainty is critical for quality decisions: Is the part conforming or not? Can your measurement system reliably detect defects?

**Reality:** If you can't measure it accurately, you can't control it.

---

## Why Measurement Uncertainty Matters

### Real-World Impact

```
Scenario: Battery Voltage Specification

Specification: 3.7V ± 0.1V (3.6V - 3.8V)

Test Equipment: Digital multimeter
Accuracy: ± 0.5% of reading
Reading: 3.61V

Question: Does the battery pass or fail?

Without considering uncertainty:
3.61V > 3.6V → ✅ PASS (incorrect decision)

With measurement uncertainty:
Measured value: 3.61V
Uncertainty: ± 0.5% × 3.61V = ± 0.018V

True value could be:
- Best case: 3.61V + 0.018V = 3.628V ✅
- Worst case: 3.61V - 0.018V = 3.592V ❌ (BELOW 3.6V)

Conclusion: Cannot guarantee conformance
Decision: REJECT or re-measure with better equipment

Cost of wrong decision:
- False accept (pass a bad part): Field failure, warranty claim ($100+)
- False reject (fail a good part): Scrap cost ($5)

Better equipment (± 0.1% accuracy):
Uncertainty: ± 0.0036V
True value: 3.61V ± 0.0036V = 3.6064V - 3.6136V
Decision: ✅ Confident PASS

ROI: $200 better meter prevents $10,000+ in warranty claims
```

---

## Sources of Measurement Uncertainty

### Measurement Error Components

```
Total Measurement Uncertainty = √(u₁² + u₂² + u₃² + ... + uₙ²)

Components:

1. Instrument Uncertainty (Calibration):
   - Accuracy of the measuring instrument
   - Example: DMM spec ± 0.5% of reading

2. Resolution Uncertainty:
   - Smallest increment the instrument can display
   - Example: Micrometer with 0.01mm resolution
   - Uncertainty: ± 0.005mm (half of resolution)

3. Repeatability (Precision):
   - Variation in repeated measurements
   - Same operator, same equipment, same conditions
   - Example: Measure 10 times, calculate standard deviation

4. Reproducibility:
   - Variation between different operators or equipment
   - Different person measuring same part
   - Different instruments measuring same part

5. Environmental Effects:
   - Temperature variation (thermal expansion)
   - Humidity (affects dimension of hygroscopic materials)
   - Vibration

6. Part Variation:
   - Actual variation in the part being measured
   - Surface roughness, geometry

7. Operator Skill:
   - Measurement technique
   - Reading parallax error
   - Clamping force variation

8. Reference Standard Uncertainty:
   - Uncertainty in the calibration standard itself
   - Traceable to national/international standards (NIST, ISO)
```

### Example: Micrometer Measurement Uncertainty Budget

```
Measurement: Shaft diameter
Nominal: 10.00 mm
Tolerance: ± 0.05 mm (9.95 mm - 10.05 mm)

Uncertainty Components:

1. Micrometer Calibration:
   - Certificate states: ± 0.002 mm (rectangular distribution)
   - Standard uncertainty: 0.002 / √3 = 0.0012 mm

2. Resolution:
   - Micrometer resolution: 0.01 mm
   - Standard uncertainty: 0.01 / √12 = 0.0029 mm
   (Note: √12 for digital instruments, √3 for analog)

3. Repeatability:
   - 10 measurements of same shaft
   - Readings: 10.01, 10.02, 10.01, 10.00, 10.01, 10.01, 10.02, 10.01, 10.01, 10.00 mm
   - Mean: 10.01 mm
   - Standard deviation: 0.0071 mm
   - Standard uncertainty: 0.0071 mm

4. Temperature Effect:
   - Lab temperature: 23°C ± 2°C (should be 20°C standard)
   - Thermal expansion coefficient (steel): 11 ppm/°C
   - Temperature range: ± 2°C
   - Expansion: 10 mm × 11 ppm/°C × 2°C = 0.00022 mm
   - Standard uncertainty: 0.00022 / √3 = 0.00013 mm

5. Operator Technique:
   - Clamping force variation
   - Estimated uncertainty: ± 0.003 mm (rectangular)
   - Standard uncertainty: 0.003 / √3 = 0.0017 mm

Combined Standard Uncertainty (uc):
uc = √(0.0012² + 0.0029² + 0.0071² + 0.00013² + 0.0017²)
uc = √(0.00000144 + 0.00000841 + 0.00005041 + 0.00000002 + 0.00000289)
uc = √0.00006317
uc = 0.0079 mm

Expanded Uncertainty (U):
U = k × uc (k = 2 for 95% confidence level)
U = 2 × 0.0079 mm = 0.016 mm

Measurement Result:
Diameter = 10.01 mm ± 0.016 mm (95% confidence)
True value: Between 9.994 mm and 10.026 mm

Decision:
Specification: 9.95 mm - 10.05 mm
Measured: 9.994 mm - 10.026 mm
Conclusion: ✅ Comfortably within specification
```

---

## Gauge R&R (Repeatability and Reproducibility)

### What is Gauge R&R?

**Gauge R&R** determines if your measurement system is capable of detecting part variation. It separates measurement system variation from actual part variation.

```
Total Observed Variation = Part Variation + Measurement System Variation

Measurement System Variation = Repeatability + Reproducibility

Repeatability: Variation from the measurement device (EV = Equipment Variation)
Reproducibility: Variation from different operators (AV = Appraiser Variation)

Goal: Measurement system variation should be small compared to part variation

Acceptance Criteria:
%GRR < 10%:   Excellent measurement system ✅
%GRR 10-30%:  Acceptable (may need improvement) ⚠️
%GRR > 30%:   Unacceptable (cannot reliably detect defects) ❌
```

### Conducting a Gauge R&R Study

**Study Design:**

```
ANOVA Gauge R&R (Most Common Method)

Setup:
- Parts: 10 (representative of production range)
- Operators: 3 (typical operators)
- Trials: 3 (each operator measures each part 3 times)
- Total measurements: 10 parts × 3 operators × 3 trials = 90 measurements

Requirements:
□ Parts should span the specification range (include high and low)
□ Parts should be representative of production (not specially selected)
□ Operators should be typical (not experts only)
□ Randomize measurement order (prevent bias)
□ Blind study (operators don't know part numbers)
```

**Example Gauge R&R Study:**

```
Product: Resistor, 1000Ω ± 5% (950Ω - 1050Ω)
Measurement: Resistance (Ω)
Equipment: Digital multimeter (4-wire measurement)
Standard: ISO 22514-7

Data Collection:

Part  Operator A          Operator B          Operator C
      T1    T2    T3      T1    T2    T3      T1    T2    T3
────────────────────────────────────────────────────────────
1     998   997   998     999   998   997     997   998   998
2     1005  1006  1005    1006  1005  1006    1004  1005  1005
3     975   976   975     976   975   975     974   975   976
4     1020  1021  1020    1021  1020  1021    1019  1020  1020
5     990   991   990     991   990   991     989   990   991
6     1035  1036  1035    1036  1035  1036    1034  1035  1035
7     960   961   960     961   960   960     959   960   961
8     1010  1011  1010    1011  1010  1010    1009  1010  1011
9     985   986   985     986   985   985     984   985   986
10    1045  1046  1045    1046  1045  1045    1044  1045  1046

Statistical Analysis:

1. Calculate Range (R) for each part-operator combination:
   Part 1, Operator A: R = 998 - 997 = 1Ω
   (Repeat for all combinations)

   Average Range (R̄):
   R̄ = 1.3Ω (average of all ranges)

2. Equipment Variation (EV) - Repeatability:
   EV = R̄ × K₁
   K₁ = 0.5908 (constant for 3 trials, from AIAG table)
   EV = 1.3 × 0.5908 = 0.77Ω

3. Appraiser Variation (AV) - Reproducibility:
   Calculate difference between operator averages:

   Operator A average: 1002.5Ω
   Operator B average: 1002.9Ω
   Operator C average: 1001.4Ω

   Range of operator averages: 1002.9 - 1001.4 = 1.5Ω

   AV = √((Range × K₂)² - (EV² / (n × r)))
   K₂ = 0.5231 (constant for 3 operators)
   n = 10 parts, r = 3 trials

   AV = √((1.5 × 0.5231)² - (0.77² / 30))
   AV = √(0.615² - 0.0197)
   AV = √(0.378 - 0.020)
   AV = 0.60Ω

4. Gauge R&R (GRR):
   GRR = √(EV² + AV²)
   GRR = √(0.77² + 0.60²)
   GRR = √(0.593 + 0.360)
   GRR = 0.98Ω

5. Part Variation (PV):
   Calculate range of part averages:
   Highest average: 1045.3Ω (Part 10)
   Lowest average: 975.3Ω (Part 3)
   Range: 70.0Ω

   PV = (Range of part averages) × K₃
   K₃ = 0.5231 (constant for 10 parts)
   PV = 70.0 × 0.5231 = 36.6Ω

6. Total Variation (TV):
   TV = √(GRR² + PV²)
   TV = √(0.98² + 36.6²)
   TV = √(0.96 + 1339.56)
   TV = 36.6Ω

7. Calculate %GRR:
   %GRR = (GRR / TV) × 100%
   %GRR = (0.98 / 36.6) × 100%
   %GRR = 2.7% ✅ EXCELLENT

   %GRR to Tolerance:
   Tolerance = 1050 - 950 = 100Ω
   %GRR = (GRR / Tolerance) × 100%
   %GRR = (0.98 / 100) × 100%
   %GRR = 0.98% ✅ EXCELLENT

   %EV = (EV / TV) × 100% = (0.77 / 36.6) × 100% = 2.1%
   %AV = (AV / TV) × 100% = (0.60 / 36.6) × 100% = 1.6%
   %PV = (PV / TV) × 100% = (36.6 / 36.6) × 100% = 100%

Results Summary:

Source            Variation   %Contribution
──────────────────────────────────────────
Equipment (EV)    0.77Ω       2.1%
Appraiser (AV)    0.60Ω       1.6%
Gauge R&R         0.98Ω       2.7% ✅
Part Variation    36.6Ω       100%
Total Variation   36.6Ω

Conclusion:
✅ Measurement system is EXCELLENT
✅ %GRR = 2.7% (target: <10%)
✅ Measurement system can reliably detect part variation
✅ Approved for production use

Number of Distinct Categories (NDC):
NDC = 1.41 × (PV / GRR)
NDC = 1.41 × (36.6 / 0.98)
NDC = 52.7 ≈ 53

Interpretation:
NDC > 5: Excellent (can distinguish many part categories) ✅
NDC = 2-5: Acceptable (limited resolution)
NDC < 2: Unacceptable (cannot distinguish parts)
```

### Poor Gauge R&R Example

```
Product: Plastic housing wall thickness
Specification: 2.0mm ± 0.2mm (1.8mm - 2.2mm)
Measurement: Ultrasonic thickness gauge

Gauge R&R Results:

Source            Variation   %Contribution
──────────────────────────────────────────
Equipment (EV)    0.15mm      45%
Appraiser (AV)    0.18mm      55%
Gauge R&R         0.23mm      82% ❌
Part Variation    0.12mm      18%
Total Variation   0.28mm

%GRR = 82% ❌ UNACCEPTABLE

Problems Identified:
1. High Equipment Variation (45%):
   - Ultrasonic gauge sensitivity to surface finish
   - Couplant (gel) thickness variation
   - Solution: Use contact probe instead of ultrasonic

2. High Appraiser Variation (55%):
   - Operators applying different pressure
   - Probe angle variation
   - Solution: Fixture to hold probe perpendicular to surface

3. Low Part Variation (18%):
   - Parts are very consistent (good!)
   - But measurement system variation exceeds part variation
   - Cannot reliably detect defects

Decision: ❌ Measurement system NOT APPROVED
Actions Required:
1. Improve measurement method (contact probe with fixture)
2. Operator training on technique
3. Re-run Gauge R&R study after improvements
```

---

## Test Uncertainty Ratio (TUR)

### What is TUR?

**TUR** (also called TAR - Test Accuracy Ratio) is the ratio of tolerance to measurement uncertainty.

```
TUR = Tolerance / Measurement Uncertainty

Acceptance Criteria:
TUR ≥ 4:1   Excellent (measurement uncertainty is 25% of tolerance) ✅
TUR = 3:1   Acceptable (measurement uncertainty is 33% of tolerance) ⚠️
TUR < 3:1   Inadequate (measurement uncertainty is >33% of tolerance) ❌

Common Standard: TUR 4:1 (ISO 14253-1, MIL-STD-45662)
```

### TUR Calculation Example

```
Specification: Shaft diameter = 25.00mm ± 0.05mm
Tolerance = ± 0.05mm = 0.10mm total

Measurement Equipment: Micrometer
Uncertainty: ± 0.008mm (from calibration certificate)

TUR Calculation:
TUR = Tolerance / Uncertainty
TUR = 0.10mm / 0.008mm
TUR = 12.5:1 ✅ EXCELLENT

Interpretation:
Measurement uncertainty (0.008mm) is 8% of tolerance (0.10mm)
Highly capable measurement system

────────────────────────────────────────────────────────

Counter-Example: Inadequate TUR

Specification: Battery voltage = 3.7V ± 0.05V
Tolerance = ± 0.05V = 0.10V total

Measurement Equipment: Budget multimeter
Uncertainty: ± 0.05V (from spec sheet)

TUR Calculation:
TUR = 0.10V / 0.05V
TUR = 2:1 ❌ INADEQUATE

Interpretation:
Measurement uncertainty (0.05V) is 50% of tolerance (0.10V)
High risk of false accept/reject decisions

Solution: Use precision multimeter
Upgraded Equipment: Bench multimeter
Uncertainty: ± 0.01V

New TUR = 0.10V / 0.01V = 10:1 ✅ EXCELLENT
```

### Guard Banding

When TUR < 4:1, use **guard banding** to reduce false accept risk.

```
Guard Banding Concept:

Specification: 10.0mm ± 0.1mm (9.9mm - 10.1mm)
Measurement uncertainty: ± 0.05mm
TUR = 0.2mm / 0.05mm = 4:1 (borderline)

Without Guard Banding:
Accept if measurement: 9.9mm ≤ measurement ≤ 10.1mm

Problem: Measurement near limits has high uncertainty
Example: Measured 9.92mm ± 0.05mm
True value could be 9.87mm (OUT OF SPEC) ❌

With Guard Banding:
Reduce accept limits by measurement uncertainty:

Accept limits:
Lower: 9.9mm + 0.05mm = 9.95mm
Upper: 10.1mm - 0.05mm = 10.05mm

Accept if: 9.95mm ≤ measurement ≤ 10.05mm

Example: Measured 9.92mm
Decision: REJECT (below 9.95mm guard band)
Benefit: Eliminates false accepts (passing bad parts)

Trade-off: Increases false rejects (failing good parts)
Cost: More scrap (but prevents field failures)

Guard Band Chart:

Spec LSL         Guard Band        Guard Band         Spec USL
  9.9              9.95               10.05              10.1
   │◄─── 0.05mm ───►│                  │◄─── 0.05mm ───►│
   │      REJECT     │      ACCEPT      │      REJECT     │
   └─────────────────┴──────────────────┴─────────────────┘

Measured values:
9.85mm → REJECT (below spec LSL) ❌
9.92mm → REJECT (in guard band) ⚠️
9.98mm → ACCEPT (within guard band) ✅
10.07mm → REJECT (in guard band) ⚠️
10.15mm → REJECT (above spec USL) ❌
```

---

## Calibration

### Why Calibrate?

```
Calibration: Comparison of a measurement instrument to a known reference standard

Purpose:
1. Verify accuracy (does it measure correctly?)
2. Establish traceability (linked to national/international standards)
3. Detect drift (has accuracy degraded over time?)
4. Document uncertainty (how accurate is it?)

Without calibration:
→ Measurements may be incorrect
→ Accept bad parts, reject good parts
→ Process out of control (false alarms or missed defects)
→ Regulatory non-compliance (FDA, ISO 9001, IATF 16949)
```

### Calibration Frequency

```
Factors Determining Calibration Interval:

1. Manufacturer Recommendation:
   - Typical: 12 months for most equipment
   - High precision: 6 months
   - Disposable (go/no-go gages): Not calibrated

2. Usage Frequency:
   - Daily use → 6-12 months
   - Weekly use → 12-24 months
   - Infrequent use → 24 months

3. Criticality:
   - Safety-critical measurements → 6 months (or more frequent)
   - Non-critical → 12-24 months

4. Drift History:
   - If equipment fails calibration (out of tolerance):
     → Shorten interval (12 months → 6 months)
   - If consistently passes with margin:
     → May extend interval (12 months → 18 months)

5. Environmental Conditions:
   - Harsh environment (temperature, humidity, vibration):
     → Shorten interval
   - Controlled lab environment:
     → Standard interval

Example Calibration Schedule:

Equipment                     Interval   Reason
─────────────────────────────────────────────────────────
Precision multimeter (daily)  6 months   High use, critical
Micrometer (production)       12 months  Standard
Torque wrench (assembly)      6 months   Safety-critical
Temperature chamber           12 months  Standard
Oscilloscope (R&D)            12 months  Standard
Weight scale (shipping)       12 months  Legal metrology
Calipers (inspection)         12 months  Standard
```

### Calibration Process

```
Calibration Procedure: Digital Multimeter

Equipment: Fluke 87V Digital Multimeter
Serial Number: 12345678
Due Date: 2025-01-15
Calibration Standard: Fluke 5520A Calibrator (NIST traceable)

Procedure:

1. Pre-Calibration Check:
   □ Visual inspection (no damage, clean)
   □ Battery check (replace if low)
   □ Zero adjustment
   □ Warm-up (30 minutes)

2. As-Found Data (before adjustment):
   Test DC voltage accuracy at 5 test points

   Applied    Measured    Error      Tolerance   Status
   (True)     (DUT)
   ───────────────────────────────────────────────────────
   1.000V     1.002V      +0.002V    ± 0.005V    ✅ Pass
   10.000V    10.008V     +0.008V    ± 0.050V    ✅ Pass
   100.000V   100.12V     +0.12V     ± 0.50V     ✅ Pass
   500.000V   500.8V      +0.8V      ± 2.5V      ✅ Pass
   1000.000V  1000.5V     +0.5V      ± 5.0V      ✅ Pass

   Result: All points within tolerance (no adjustment needed)

3. Adjustment (if required):
   Not required (all as-found values within tolerance)

4. As-Left Data (after adjustment):
   Same as as-found (no adjustment made)

5. Uncertainty Analysis:
   Combined standard uncertainty: ± 0.0025V (at 1V range)
   Expanded uncertainty (k=2): ± 0.005V (95% confidence)

Calibration Certificate:

┌────────────────────────────────────────────────────────┐
│             CALIBRATION CERTIFICATE                    │
├────────────────────────────────────────────────────────┤
│ Certificate Number: CAL-2025-00456                     │
│ Date: 2025-01-15                                       │
│                                                        │
│ Equipment: Fluke 87V Digital Multimeter                │
│ Serial Number: 12345678                                │
│ Manufacturer: Fluke Corporation                        │
│                                                        │
│ Calibrated Using:                                      │
│   Fluke 5520A Calibrator                               │
│   Serial: CAL-789012                                   │
│   Certificate: NIST-2024-12345 (exp: 2025-12-01)       │
│                                                        │
│ Environmental Conditions:                              │
│   Temperature: 23°C ± 2°C                              │
│   Humidity: 45% ± 10% RH                               │
│                                                        │
│ Calibration Results:                                   │
│   DC Voltage: ✅ PASS (as-found and as-left)           │
│   Uncertainty: ± 0.005V (k=2, 95% confidence)          │
│                                                        │
│ Next Calibration Due: 2026-01-15 (12 months)           │
│                                                        │
│ Calibration performed by:                              │
│   Technician: John Doe, Cert. #CAL-123                 │
│   Lab: Acme Calibration Services (ISO 17025 accredited)│
│                                                        │
│ Approved by: _______________  Date: _________          │
│              Quality Manager                           │
└────────────────────────────────────────────────────────┘

Calibration sticker applied to equipment:

    ┌──────────────────────┐
    │    CALIBRATED        │
    │                      │
    │  Date: 01/15/2025    │
    │  Due:  01/15/2026    │
    │  Cert: CAL-2025-00456│
    │                      │
    │  [QR Code]           │
    └──────────────────────┘
```

### Out-of-Tolerance Found

```
Scenario: Micrometer Found Out of Calibration

Equipment: Digital Micrometer, 0-25mm
Serial Number: MIC-00789
Calibration Due: 2025-01-15
Last Calibration: 2024-01-15

As-Found Data:

Applied (Gage Block)   Measured   Error    Tolerance   Status
─────────────────────────────────────────────────────────────
5.000mm                5.012mm    +0.012mm ± 0.002mm   ❌ FAIL
10.000mm               10.015mm   +0.015mm ± 0.002mm   ❌ FAIL
15.000mm               15.018mm   +0.018mm ± 0.002mm   ❌ FAIL
20.000mm               20.020mm   +0.020mm ± 0.002mm   ❌ FAIL

Finding: Micrometer reading consistently HIGH (positive bias)
Conclusion: OUT OF TOLERANCE ⚠️

Immediate Actions:

1. Quarantine Equipment:
   □ Tag as "OUT OF SERVICE - DO NOT USE"
   □ Remove from production floor
   □ Document finding (Out of Tolerance Report #OOT-2025-003)

2. Investigate Impact:
   □ Review all measurements made since last calibration
   □ Identify products measured with this micrometer
   □ Date range: 2024-01-15 to 2025-01-15 (12 months)

   Database query:
   SELECT * FROM measurements
   WHERE equipment_id = 'MIC-00789'
   AND measurement_date BETWEEN '2024-01-15' AND '2025-01-15'

   Results:
   - 2,450 measurements recorded
   - 12 products affected (shaft diameter measurements)
   - 850 units shipped to customers ⚠️

3. Risk Assessment:
   Worst case: All measurements biased +0.020mm

   Product: Shaft diameter
   Specification: 10.00mm ± 0.05mm (9.95mm - 10.05mm)

   Example recorded measurement: 10.02mm (assumed PASS)
   Actual dimension: 10.02mm - 0.020mm = 10.00mm ✅ Still conforming

   Analysis of all 2,450 measurements:
   - Worst case measured: 10.04mm
   - Actual (corrected): 10.04mm - 0.020mm = 10.02mm ✅
   - All parts still within specification

   Conclusion: ✅ No product impact (bias within tolerance margin)
   Decision: No recall required

4. Corrective Action:
   □ Adjust micrometer (re-zero)
   □ Re-calibrate (as-left data now within tolerance)
   □ Shorten calibration interval: 12 months → 6 months
   □ Investigate root cause of drift

5. Root Cause:
   Why did micrometer drift?
   - Visual inspection: Anvil surface shows wear marks
   - Hypothesis: Frequent use without cleaning (swarf buildup)
   - Anvil slightly deformed from over-tightening

   Preventive Action:
   - Train operators: Clean anvils before each measurement
   - Add monthly zero-check (between calibrations)
   - Replace worn micrometer (>50,000 measurements)

6. Documentation:
   □ Out of Tolerance Report filed
   □ Measurement database flagged (all measurements reviewed)
   □ CAPA opened (CAPA-2025-0078)
   □ Management notified
```

---

## Traceability to Standards

### Metrology Hierarchy

```
International Standards (SI Units)
         │
         │ (Traceability Chain)
         ▼
National Metrology Institutes (NIST, NPL, PTB)
         │
         │ (Accredited Calibration)
         ▼
ISO 17025 Accredited Calibration Labs
         │
         │ (Calibration Certificates)
         ▼
Working Standards (In-House Reference Standards)
         │
         │ (Daily Use)
         ▼
Production Test Equipment
         │
         │ (Measurements)
         ▼
Product (Manufactured Parts)

Example:

NIST maintains primary voltage standard (Josephson voltage standard)
    → Uncertainty: ± 0.01 ppm (parts per million)
    ↓
Accredited cal lab uses NIST-traceable reference (Fluke 5520A)
    → Uncertainty: ± 3 ppm
    ↓
Customer's bench multimeter (Fluke 87V) calibrated by lab
    → Uncertainty: ± 50 ppm
    ↓
Product voltage measured with calibrated multimeter
    → Measurement includes all accumulated uncertainty

Traceability Documentation:
□ Calibration certificate from ISO 17025 lab
□ Certificate references NIST-traceable standards
□ Uncertainty budget includes all contributors
□ Calibration interval maintained
```

---

## Measurement System Analysis (MSA) Best Practices

### MSA Planning

```
MSA Plan Checklist:

Before Starting:
□ Define measurement characteristic (what are we measuring?)
□ Define specification/tolerance (accept/reject limits)
□ Select appropriate measurement equipment
□ Verify equipment is calibrated and in tolerance
□ Train operators on measurement procedure
□ Prepare test parts (representative of production)

Study Design:
□ Gauge R&R or other MSA method selected
□ Sample size adequate (typically 10 parts, 3 operators, 3 trials)
□ Randomization plan (prevent bias)
□ Data collection form prepared
□ Statistical analysis software ready (Minitab, Excel)

During Study:
□ Blind study (operators don't know part numbers or previous readings)
□ Parts measured in random order
□ Consistent measurement technique (documented procedure)
□ Environmental conditions controlled (temp, humidity)
□ Record all data (no discarding outliers without justification)

After Study:
□ Analyze data (calculate %GRR, TUR, etc.)
□ Interpret results (is measurement system acceptable?)
□ Document findings (MSA report)
□ Approve or reject measurement system
□ Implement improvements if needed (re-study after changes)

Frequency:
- New measurement system: Before production use
- Process change: Re-validate MSA
- Equipment change: Re-validate MSA
- Periodic: Annual review (even if no changes)
```

### Common MSA Mistakes

```
❌ Mistake 1: Using Special Parts
Using hand-selected "good" parts instead of representative production parts
Result: MSA shows excellent results, but doesn't reflect reality

✅ Correct: Use random production parts spanning spec range

────────────────────────────────────────────────────────

❌ Mistake 2: Using Expert Operators Only
Selecting the best operators for the study
Result: MSA underestimates operator variation

✅ Correct: Use typical operators (including less experienced)

────────────────────────────────────────────────────────

❌ Mistake 3: Not Blinding the Study
Operators know part numbers or see previous measurements
Result: Bias in measurements (operators try to match previous)

✅ Correct: Blind study (parts labeled A-J, randomized order)

────────────────────────────────────────────────────────

❌ Mistake 4: Insufficient Sample Size
Using only 3-5 parts to save time
Result: Not enough data to reliably estimate variation

✅ Correct: Minimum 10 parts (preferably spanning full spec range)

────────────────────────────────────────────────────────

❌ Mistake 5: Accepting Borderline Results
%GRR = 28% (just below 30% limit)
Decision: "Good enough, approve it"
Result: High risk of measurement errors in production

✅ Correct: Investigate and improve (target %GRR <10% for critical measurements)

────────────────────────────────────────────────────────

❌ Mistake 6: Ignoring Environmental Effects
Running MSA in controlled lab, using equipment in factory floor
Result: MSA underestimates uncertainty (temp/humidity variation in factory)

✅ Correct: Run MSA in production environment or account for environmental variation

────────────────────────────────────────────────────────

❌ Mistake 7: Not Updating MSA After Changes
Equipment repaired or replaced, but MSA not re-run
Result: Assumed capability may no longer be valid

✅ Correct: Re-validate MSA whenever measurement system changes
```

---

## What Senior Engineers Know

**Measurement uncertainty is always present.** You can reduce it, but never eliminate it.

**Good measurement systems cost money, but bad measurements cost more.** Invest in proper equipment and calibration.

**Gauge R&R is not a one-time activity.** Re-validate when equipment changes, processes change, or annually.

**Calibration stickers are not optional.** They're proof your measurement system is under control (and auditors will check).

**Out-of-tolerance findings are learning opportunities.** Investigate thoroughly, don't just recalibrate and forget.

**Guard banding prevents shipping defects.** Accept the higher scrap rate to avoid field failures.

---

## Exercise

**Perform Measurement System Analysis:**

Your company manufactures precision springs for automotive applications.

**Specification:** Free length = 50.0mm ± 0.5mm (49.5mm - 50.5mm)

**Measurement Equipment:** Digital caliper
- Resolution: 0.01mm
- Manufacturer spec: ± 0.02mm accuracy
- Calibration certificate: ± 0.015mm uncertainty (k=2, 95% confidence)

**Your Tasks:**

1. **Calculate TUR**
   - What is the Test Uncertainty Ratio?
   - Is the equipment suitable?

2. **Design Gauge R&R Study**
   - How many parts, operators, trials?
   - How to randomize the study?
   - Create data collection form

3. **Simulate Data Collection**
   - Generate realistic measurement data (or use real parts if available)
   - Include some operator and equipment variation

4. **Analyze Results**
   - Calculate %GRR
   - Determine if measurement system is acceptable
   - Calculate NDC (Number of Distinct Categories)

5. **Measurement Uncertainty Budget**
   - List all uncertainty contributors
   - Calculate combined uncertainty
   - Compare to tolerance

6. **Improvement Plan**
   - If %GRR > 10%, what improvements would you make?
   - Better equipment? Better fixturing? Operator training?
   - Cost-benefit analysis

**Deliverable:** Complete MSA report with data, analysis, and recommendations.

---

## Next Steps

- Study [Failure Analysis](07-failure-analysis.md) for root cause investigation
- Learn [8D & CAPA Process](08-8d-capa-process.md) for problem solving
- Review [Supplier Quality](06-supplier-quality.md) for component measurement requirements
- Master [Manufacturing Quality Lifecycle](02-manufacturing-quality-lifecycle.md)
