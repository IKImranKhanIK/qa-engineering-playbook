# Failure Analysis

## Overview

When hardware fails, finding the root cause is critical. Was it a design flaw? Manufacturing defect? Component failure? Environmental stress? Failure analysis combines detective work, engineering knowledge, and specialized testing to answer these questions and prevent recurrence.

**The cost of not doing failure analysis:**
- Recurring failures in production (costly rework)
- Field failures and warranty returns (reputation damage)
- Potential safety incidents (lawsuits, recalls)

---

## The Failure Analysis Process

```
Failure Detection → Containment → Analysis → Root Cause → Corrective Action → Verification
       │                │            │            │               │                │
       │                │            │            │               │                │
   Field or         Quarantine   Investigation   5 Whys       Implement         Validate
   Factory           Failed       & Testing      Fishbone      Solution          Fix
                     Units                       FTA
```

---

## Phase 1: Failure Detection and Documentation

### Document Everything Immediately

**Critical Information to Collect:**

```
Failure Report Template:

Failure ID: FR-2025-0156
Date Detected: 2025-01-24
Detected By: Production Inspector
Detection Point: Final Test

Product Information:
- Product: Smart Thermostat
- Model: ST-200
- Serial Number: ST200-2025-012456
- Manufacturing Date: 2025-01-22
- Production Line: Line 3
- Firmware Version: v2.1.3

Failure Description:
Device fails to power on. No display, no LED indicators, no response to buttons.

Conditions:
- Ambient temperature: 22°C
- Humidity: 45% RH
- Input voltage: 24VAC (correct)
- Previous test results: All passed until final functional test

Frequency:
- First occurrence this shift
- 3 similar failures this week (0.06% failure rate)

Visual Inspection:
- No visible damage to exterior
- No burning smell
- No discoloration
- PCB appears normal (no scorching, no damaged components)

Preliminary Test Results:
- Input voltage at device: 24VAC ✅
- Fuse: Intact ✅
- Power LED: Not illuminated ❌
- Main processor voltage: 0V ❌ (should be 3.3V)

Disposition: HOLD for failure analysis

Failed Unit Status:
□ Unit quarantined in ESD bag
□ Tagged with failure ID
□ Moved to failure analysis lab
□ Chain of custody documented

Reported By: J. Smith, QA Inspector
Priority: MEDIUM (affects production)
```

### Photographic Documentation

```
Photo Documentation Checklist:

Before Disassembly:
□ Overall product (6 views: front, back, top, bottom, left, right)
□ Serial number and markings
□ Connector orientations
□ Screw locations and types
□ Any visible damage (close-up)

During Disassembly:
□ Each disassembly step (for reassembly reference)
□ Internal components in situ
□ Cable routing and connections
□ Any anomalies discovered

After Disassembly:
□ Individual components (suspect parts)
□ PCB (top and bottom)
□ Close-ups of damage (50x-100x magnification if needed)

Note: Use ruler or scale in photos for size reference
Use consistent lighting and camera settings
Label each photo with failure ID
```

---

## Phase 2: Containment

### Immediate Actions

```
Containment Checklist:

Production Line:
□ Stop production if failure rate >1% (decision: Quality Manager)
□ Quarantine all units from same batch (Batch: BN-2025-0122-A)
□ Inspect quarantined units (sample size: 50 units)
  - Found: 2 additional failures (4% failure rate in batch)
□ Decision: HOLD entire batch (500 units)

Shipped Inventory:
□ Check if any units from affected batch shipped
  - Found: 0 units shipped ✅ (batch still in factory)
□ No customer notification needed (contained to factory)

Field Units:
□ Check if issue affects field population
  - Review failure database for similar symptoms
  - Found: 1 field return with same symptom (SN: ST200-2024-098234)
  - Retrieve field unit for analysis

Supplier:
□ Notify component suppliers (precautionary)
□ Request review of recent lots shipped

Risk Assessment:
Safety risk: LOW (no fire, shock, or injury hazard)
Customer impact: NONE (contained before shipment)
Production impact: MEDIUM (500 units on hold)
Financial impact: $15,000 (scrapped units if not repairable)

Decision: Proceed with failure analysis, resume production with enhanced testing
```

---

## Phase 3: Failure Analysis Techniques

### Visual Inspection

**Macro-Level Inspection (1x - 10x):**

```
Visual Inspection Checklist:

External:
□ Cracks, dents, or physical damage
□ Discoloration (heat damage)
□ Corrosion or contamination
□ Missing components
□ Loose screws or connectors

Internal:
□ PCB damage (cracks, delamination)
□ Component damage (cracked ICs, bulging capacitors)
□ Solder joint quality (cold joints, bridging, voids)
□ Burn marks or scorching
□ Residue (flux, contamination)
□ Mechanical stress (bent pins, damaged traces)

Example Finding:
Visual inspection of PCB reveals:
- U5 (voltage regulator IC) has discoloration around package
- Nearby capacitor C12 has slight bulge on top
- Solder joints on U5 appear normal
- No other anomalies

Conclusion: U5 (voltage regulator) suspected of thermal failure
```

**Micro-Level Inspection (10x - 100x):**

Use microscope or magnifying glass:

```
Microscope Inspection (50x magnification):

Component: U5 (LDO voltage regulator, 5V → 3.3V)

Observations:
- Die visible through transparent epoxy (cracked package)
- Bond wire appears disconnected from die pad
- Evidence of electrical overstress (EOS)
- Metallization damage on die surface

Photos:
[50x magnification photo showing cracked die and lifted bond wire]

Finding: Internal damage to voltage regulator IC
Likely cause: Electrical overstress (EOS) event
```

### Electrical Testing

**Non-Destructive Testing:**

```
Test Plan: Power Supply Failure Analysis

Equipment:
- Digital multimeter (DMM)
- Oscilloscope
- Function generator
- DC power supply

Tests:

1. Resistance Measurements (Power Off):
   Measure resistance across power rails

   VIN (24VAC input):
   - Between AC input pins: ∞ Ω (correct, no short)

   +5V Rail:
   - To Ground: 12 Ω (suspect, should be >10kΩ)
   - Conclusion: Short circuit on 5V rail ⚠️

   +3.3V Rail:
   - To Ground: ∞ Ω (open circuit, no power)
   - Conclusion: U5 (regulator) not providing output ⚠️

2. Component Isolation:
   Remove suspect components to isolate fault

   Action: Desolder U5 (voltage regulator)

   Re-measure +5V rail:
   - To Ground: >100kΩ ✅ (short circuit cleared)

   Conclusion: U5 was shorted internally

3. Component Testing (U5 removed from board):
   Measure resistance across U5 pins

   VIN to GND: 0.3 Ω ❌ (should be >10kΩ)
   VOUT to GND: 0.4 Ω ❌ (should be >10kΩ)

   Conclusion: U5 has internal short circuit (failed component)

4. Root Cause Investigation:
   Why did U5 fail?

   Check input voltage to U5:
   - Measured at AC/DC converter output: 5.8V ❌
   - Specification: 5.0V ± 0.25V (4.75V - 5.25V)
   - U5 absolute maximum rating: 5.5V

   Finding: Input overvoltage to U5 caused failure

   Next question: Why is AC/DC converter outputting 5.8V?
```

**Advanced Electrical Testing:**

```
Oscilloscope Analysis:

Test: AC Input Voltage Waveform

Setup:
- Probe 24VAC input transformer
- Time base: 10ms/div
- Voltage: 10V/div

Observations:
Normal waveform:
    │      ╱╲      ╱╲      ╱╲
 24V│     ╱  ╲    ╱  ╲    ╱  ╲
    │    ╱    ╲  ╱    ╲  ╱    ╲
  0V├────────────────────────────
    │   ╱      ╲╱      ╲╱      ╲
-24V│  ╱
    └─────────────────────────────→
     60Hz sine wave, 24Vrms

Failed unit waveform:
    │      ╱╲      ╱╲ ╱╲   ╱╲
 32V│     ╱  ╲    ╱  ╲  ╲ ╱  ╲  ← Spikes!
    │    ╱    ╲  ╱    ╲  ╲    ╲
  0V├────────────────────────────
    │   ╱      ╲╱      ╲  ╱    ╲
-24V│  ╱                ╲╱
    └─────────────────────────────→
     Distorted waveform with voltage spikes to 32V

Finding: Input voltage has transient spikes (overvoltage events)

Root Cause: Likely power line surge or inductive load switching
Failure Mechanism: Overvoltage spike → AC/DC converter overvoltage → U5 overstress → U5 failure
```

### Destructive Physical Analysis (DPA)

**Cross-Sectioning:**

```
Cross-Section Analysis: Solder Joint Failure

Sample: PCB with suspected cold solder joint
Component: J1 (power connector)
Failure: Intermittent connection

Procedure:
1. Cut PCB section containing suspect joint (1cm × 1cm)
2. Mount in epoxy resin
3. Grind and polish to reveal cross-section
4. Inspect under microscope (100x-500x)

Results:

Good Solder Joint:
    Component Lead
         │
         ▼
    ╔════════╗
    ║ Solder ║  ← Concave fillet
    ╚════╤═══╝  ← Good wetting
         │
    ─────┴─────  PCB pad
    ═══════════  PCB

Failed Solder Joint:
    Component Lead
         │
         ▼
    ╔═══╗        ← Insufficient solder
    ║   ║ ⚠️     ← Poor wetting
    ╚═══╩═══╝    ← Void present
         │  ○    ← Gap/crack
    ─────┴─────  PCB pad
    ═══════════  PCB

Findings:
- Solder wetting incomplete (60% coverage)
- Void present at interface (15% of joint area)
- Crack propagation from void
- Insufficient solder volume

Root Cause:
- Reflow temperature too low (peak: 225°C, spec: 245°C)
- Flux activity insufficient (oxidation not removed)

Corrective Action:
- Optimize reflow profile (increase peak to 245-250°C)
- Change flux type to more active formula
- Increase solder paste volume by 10%
```

**X-Ray Inspection:**

```
X-Ray Analysis: BGA (Ball Grid Array) Solder Joints

Component: U12 (processor, 256-pin BGA)
Failure: Device non-functional, suspected solder joint failure

X-Ray Image Analysis:

Good BGA Joint (cross):        Failed BGA Joint (cross):
      ───────                        ───────
      ║     ║                        ║     ║
    ══╬═══╬══  BGA ball              ══╬═ ╬══  BGA ball
      ●●●●●    Uniform solder          ● ●●●   Non-wet open
    ─────────  PCB pad               ─────────  PCB pad

X-Ray Findings:
- 12 of 256 balls show poor solder wetting
- Voids present in 8 balls (>30% void area)
- 2 balls appear to have non-wet open (no connection)

Location:
- Failed joints concentrated in center of BGA
- Indicates insufficient heat during reflow (center slower to heat)

Conclusion:
- Reflow profile inadequate for large BGA components
- Thermal mass of BGA prevents center from reaching proper temperature

Corrective Action:
- Extend time above liquidus (TAL) from 60s to 90s
- Increase peak temperature from 245°C to 250°C
- Add preheat soak to reduce thermal gradient
```

**Scanning Electron Microscope (SEM):**

```
SEM Analysis: Connector Contact Failure

Sample: Crimp connector (failed contact)
Failure: High resistance, intermittent connection

SEM Imaging (1000x magnification):

Observations:
- Contact surface shows corrosion deposits (white residue)
- Base metal (copper) visible through plating (gold)
- Plating thickness: 0.3 μm (specification: 1.0 μm minimum)
- Fretting wear marks visible

Energy Dispersive X-ray Spectroscopy (EDS):

Elemental Analysis of Corrosion:
- Oxygen: 42% (oxidation)
- Copper: 31% (base metal)
- Gold: 12% (plating, depleted)
- Carbon: 10% (contamination)
- Chlorine: 5% (salt contamination)

Finding: Gold plating too thin, allowing oxidation of copper base metal

Root Cause:
- Supplier used incorrect plating specification
- Gold flash (0.3 μm) instead of hard gold (1.0 μm)
- Combined with salt contamination (coastal environment)
- Resulted in corrosion and high contact resistance

Corrective Action:
- Change connector specification to 1.0 μm minimum gold plating
- Add incoming inspection for plating thickness (XRF measurement)
- Qualify alternate supplier with proper plating process
```

---

## Phase 4: Root Cause Analysis Tools

### 5 Whys

**Technique:** Ask "Why?" five times to drill down to root cause.

```
Failure: Smart thermostat not powering on (FR-2025-0156)

Why? (Level 1)
→ Voltage regulator U5 failed (shorted internally)

Why did U5 fail? (Level 2)
→ Input overvoltage to U5 (5.8V vs 5.0V spec)

Why was input voltage too high? (Level 3)
→ AC/DC converter output overvoltage

Why did AC/DC converter output overvoltage? (Level 4)
→ Voltage spikes on AC input (32V peaks on 24VAC line)

Why were there voltage spikes on AC input? (Level 5)
→ HVAC system contactor switching (inductive load switching creates spikes)

Root Cause:
Design did not account for inductive load switching transients common in HVAC installations

Corrective Action:
1. Add transient voltage suppressor (TVS) on AC input
2. Increase U5 voltage rating (use 6V rated LDO instead of 5.5V)
3. Add input filtering to AC/DC converter
4. Update design FMEA with this failure mode

Preventive Action:
- Add inductive load switching test to EVT test plan
- Simulate HVAC system environment in testing
- Review all designs for transient protection
```

**5 Whys Best Practices:**

```
✅ Do:
- Ask "Why?" until you reach a process or design root cause
- Verify each answer with data (don't assume)
- Involve cross-functional team (design, manufacturing, quality)
- Document the logic chain

❌ Don't:
- Stop at the first answer (too shallow)
- Blame people ("because Joe made a mistake")
- Accept "we don't know" (keep investigating)
- Skip verification (assumptions can mislead)

Example of going too shallow:

Why did the unit fail?
→ Because the component was defective

❌ STOP (this is not root cause, just symptom)

Continue:
Why was the component defective?
→ Because it was exposed to overvoltage
Why was it exposed to overvoltage?
→ Because there was no transient protection
Why was there no transient protection?
→ Because the design didn't consider inductive loads
Why didn't the design consider it?
→ Because the design FMEA didn't include this failure mode

✅ Root Cause: Design FMEA incomplete (process failure)
```

### Fishbone Diagram (Ishikawa Diagram)

**Technique:** Categorize potential causes into major categories.

```
Fishbone Diagram: Solder Joint Failures

                     Materials              Methods
                         │                      │
        Flux contaminated│    Old solder paste  │Reflow profile wrong
                 │       │           │          │       │    Operator not trained
                 ▼       │           ▼          │       ▼              │
        ─────────────────┴──────────────────────┴───────────────────┴──────►
                                                                         Solder
        ─────────────────┬──────────────────────┬───────────────────┬─ Joint
                 ▲       │           ▲          │       ▲           │  Failures
      Oven not calibrated│    Worn stencil      │      │      PCB finish oxidized
                         │                      │      │
                    Equipment              Environment

Categories:

1. Materials:
   - Solder paste expired (shelf life: 6 months)
   - Flux contaminated (absorbed moisture)
   - PCB finish oxidized (ENIG too old)

2. Methods:
   - Reflow profile not optimized for this product
   - Stencil printing parameters incorrect
   - Operators not trained on new equipment

3. Equipment:
   - Reflow oven temperature not calibrated (last cal: 18 months ago)
   - Stencil worn out (>50,000 prints, spec: 25,000)
   - Pick-and-place machine alignment off

4. Environment:
   - Humidity too high (65% RH, spec: <50%)
   - Temperature fluctuations in factory (18-28°C)
   - ESD controls inadequate

5. Measurement:
   - SPC not implemented (no process monitoring)
   - Visual inspection only (no AOI)
   - No incoming inspection of solder paste

Investigation Results:
Primary root causes identified:
1. ✅ Reflow oven not calibrated (18 months overdue)
   - Actual peak temp: 225°C (measured)
   - Target peak temp: 245°C
   - Underheat causing poor solder wetting

2. ✅ Solder paste expired
   - Date code: 2024-07 (8 months old)
   - Shelf life: 6 months
   - Flux activity degraded

3. ✅ Humidity high
   - Measured: 65% RH
   - Solder paste absorbing moisture
   - Causing voids and splattering

Corrective Actions:
1. Calibrate reflow oven immediately (done)
2. Discard old solder paste, implement FIFO inventory system
3. Install dehumidifier in assembly area (maintain <50% RH)
4. Implement monthly oven calibration checks
5. Add AOI (Automated Optical Inspection) after reflow
```

### Fault Tree Analysis (FTA)

**Technique:** Work backwards from failure to identify all possible causes (Boolean logic).

```
Fault Tree: Device Won't Power On

                          Device Won't Power On
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              No Power Input   Power Supply    Processor
                    │           Failure         Failed
         ┌──────────┼────────┐      │              │
         │          │        │      │              │
    No AC Input  Fuse    Connector  │         ┌────┴────┐
                 Blown   Failed     │         │         │
                    │               │      No Power  Bad Firmware
         ┌──────────┼────────┐      │         │
         │          │        │      │         │
    Overcurrent  Wire    Component  │    Regulator
                Break   Short       │     Failed
                                    │         │
                         ┌──────────┴─────┐   │
                         │                │   │
                    AC/DC Converter    Input  │
                       Failed          OVP    │
                                              │
                                    ┌─────────┴──────┐
                                    │                │
                                Overvoltage    Component
                                 Input          Defect

Logic Gates:
OR gate: Any one cause → failure
AND gate: All causes required → failure

Probability Analysis:

Event                          Probability    Impact
─────────────────────────────  ────────────   ──────
Overvoltage input              1 in 1,000     HIGH
Component defect (U5)          1 in 10,000    HIGH
Connector failure              1 in 50,000    MEDIUM
Fuse blown (protective)        1 in 5,000     LOW
Firmware corruption            1 in 100,000   LOW

Top Event Probability:
P(Device won't power on) ≈ 0.13% (1 in 770 units)

Observed failure rate: 0.06% (3 in 5,000)

Conclusion: Model overestimates, need better data on overvoltage events

Critical Paths (Highest Risk):
1. Overvoltage input → Regulator failure ⚠️ HIGH PRIORITY
2. Component defect → Regulator failure ⚠️ MEDIUM PRIORITY

Corrective Actions:
Focus on preventing overvoltage input:
- Add TVS diode (reduce overvoltage probability 100x)
- Upgrade regulator rating (reduce failure probability 10x)
```

### Pareto Analysis (80/20 Rule)

**Technique:** Identify the vital few causes that account for most failures.

```
Pareto Chart: Production Line Failures (January 2025)

Defect Type          Count   Percentage   Cumulative %
────────────────────────────────────────────────────────
Solder defects        245      42%          42%   ████████
Power supply failure   98      17%          59%   ███
Display issues         76      13%          72%   ██
Button malfunction     52       9%          81%   ██
Case damage            45       8%          89%   █
Firmware errors        32       5%          94%   █
Other                  35       6%         100%   █
────────────────────────────────────────────────────────
Total                 583     100%

Chart:
 300│                                           Cumulative %
    │                                          100%┐
 250│ ████                                         │
    │ ████                                     90% │
 200│ ████                                         │
    │ ████                                         ├─── 80% Line
 150│ ████                                     70% │
    │ ████                                         │
 100│ ████  ███                                50% │
    │ ████  ███  ██                               │
  50│ ████  ███  ██  ██  █  █  █             30% │
    │ ████  ███  ██  ██  █  █  █                 │
   0└─────┬─────┬───┬───┬──┬──┬──            10% ┘
       Solder Power Disp Btn Case FW Other

80/20 Analysis:
The top 3 defect types (solder, power, display) account for 72% of all failures.

Focus Resources:
Priority 1: Solder defects (42%) → Reflow optimization project
Priority 2: Power supply (17%) → Add transient protection
Priority 3: Display issues (13%) → Improve connector design

Expected Impact:
Fixing top 3 = reduce overall defect rate by ~70%

Return on Investment:
Resources: 3 engineers × 2 months
Cost: $60,000
Savings: $450,000/year (reduced scrap and rework)
ROI: 7.5x first year
```

---

## Phase 5: Corrective and Preventive Action (CAPA)

### Corrective Action Plan

```
CAPA Report: Smart Thermostat Power Failure

CAPA ID: CAPA-2025-0042
Date Opened: 2025-01-24
Problem: Voltage regulator U5 failure due to input overvoltage
Root Cause: Design lacks transient protection for inductive load switching

Immediate Corrective Actions (within 7 days):
□ Quarantine all affected units (500 units) - COMPLETE
□ Screen quarantined units with enhanced voltage stress test - COMPLETE
  - Result: 6 additional failures found (1.2% failure rate)
  - Disposition: 494 units released, 6 units scrapped

□ Add transient protection to production (interim fix) - COMPLETE
  - Installed external TVS diode module on assembly line
  - Verified effectiveness with surge testing (± 500V, 1μs pulse)
  - First 100 units tested: 0 failures ✅

Short-Term Corrective Actions (within 30 days):
□ Design permanent fix - IN PROGRESS
  - Redesign PCB with onboard TVS diode
  - Upgrade U5 to 6V rated part (was 5.5V)
  - Add input filter capacitor (220μF → 470μF)
  - ECO #2025-089 created

□ Validate design changes - PLANNED
  - Build 50 prototype units with new design
  - Test with inductive load switching (contactor, relay)
  - Environmental testing (temp, humidity, vibration)
  - Accelerated life test (500 hours at 60°C)

□ Update production process - PLANNED
  - Revise assembly work instructions
  - Train operators on new components
  - Update test fixtures for surge testing

Long-Term Preventive Actions (within 90 days):
□ Update design standards - PLANNED
  - Add transient protection requirements to design checklist
  - Create reference design for power input protection
  - Mandate surge testing for all AC-powered products

□ Update Design FMEA - PLANNED
  - Add failure mode: "Transient overvoltage on AC input"
  - Severity: 9 (device failure)
  - Occurrence: 5 (possible in field environment)
  - Detection: 3 (current tests don't catch it)
  - RPN: 135 (HIGH - requires action) ← Now addressed

□ Improve testing - PLANNED
  - Add IEC 61000-4-4 (EFT) and IEC 61000-4-5 (surge) to EVT
  - Purchase surge generator for production testing
  - Test 100% of units with surge test (added to final test)

□ Field retrofit program - PLANNED
  - Offer free upgrade to existing customers (estimated 2,500 units in field)
  - Partner with installation contractors for onsite upgrades
  - Customer communication: proactive outreach (not a recall)

Effectiveness Verification (90 days after implementation):
□ Monitor production failure rate (target: <0.01%)
□ Track field failure rate (target: <0.1% per year)
□ Review customer complaints (target: zero related to power)

Responsibility:
- Immediate actions: Production Manager (J. Smith)
- Design changes: Hardware Engineer (M. Johnson)
- Testing: Test Engineer (K. Lee)
- Overall: Quality Manager (S. Chen)

Status: IN PROGRESS
Target Close Date: 2025-04-24
Next Review: 2025-02-07 (weekly updates)
```

### Preventive Action

```
Preventive Actions - Lessons Learned

Problem: Transient overvoltage protection inadequate

Apply to Other Products:
□ Review all 6 AC-powered products in portfolio
  - Smart thermostat ST-200 ← Fixed
  - Smart plug SP-100 ⚠️ SAME ISSUE FOUND
  - Smart light switch SL-300 ✅ Already has TVS
  - Smart dimmer SD-400 ⚠️ SAME ISSUE FOUND
  - Smart fan controller FC-500 ✅ Already has TVS
  - Smart outlet SO-600 ⚠️ SAME ISSUE FOUND

□ Proactively fix products SP-100, SD-400, SO-600
  - ECO created for each product
  - Production transition scheduled
  - Prevent field failures before they occur

□ Update New Product Introduction (NPI) process
  - Add surge testing to EVT checklist (mandatory)
  - Require design review for power input protection
  - Create power supply design reference guide

Knowledge Sharing:
□ Present failure analysis at monthly engineering meeting
□ Add case study to internal knowledge base
□ Train new engineers on transient protection design
□ Share with industry peers (anonymized)

Cost-Benefit:
Cost of preventive action: $35,000 (engineering time + components)
Avoided cost: $500,000+ (potential recalls, warranty claims, reputation damage)

ROI: 14x
```

---

## Failure Modes Library

### Common Hardware Failure Modes

```
Failure Mode: Electrostatic Discharge (ESD) Damage

Symptoms:
- Intermittent or complete component failure
- Sudden failure after handling
- Latent failures (degraded performance, later failure)

Root Causes:
- Inadequate ESD controls during assembly
- No grounding wrist straps used
- Non-ESD packaging
- High humidity environment (reduces ESD risk, but inconsistent)

Detection:
- Visual: Microscopic damage to IC pins
- Electrical: Leakage current increased, voltage levels incorrect
- Thermal imaging: Hot spots on IC (leakage)

Prevention:
- ESD-safe workstations (grounded mats, wrist straps)
- ESD-safe packaging (bags, foam)
- Humidity control (40-60% RH)
- Training and audits

────────────────────────────────────────────────────────

Failure Mode: Electrolytic Capacitor Failure

Symptoms:
- Bulging or leaking capacitor
- Loss of capacitance (power supply ripple increases)
- Complete open or short circuit

Root Causes:
- End of life (dried out electrolyte)
- High temperature accelerates aging
- Reverse polarity (installation error)
- Overvoltage

Detection:
- Visual: Bulging top, leaking electrolyte
- Electrical: ESR (Equivalent Series Resistance) increased
- Capacitance measurement: Below specification

Prevention:
- Use high-temperature rated caps (105°C or 125°C)
- Derate voltage (use 25V cap for 12V rail)
- Improve cooling (reduce ambient temperature)
- Polymer caps for long life applications

────────────────────────────────────────────────────────

Failure Mode: Cold Solder Joint

Symptoms:
- Intermittent connection
- High resistance
- Electrical noise or signal integrity issues

Root Causes:
- Insufficient heat during soldering
- Contaminated surfaces (oxidation, oil)
- Movement during solidification
- Incorrect solder paste formulation

Detection:
- Visual: Dull, grainy appearance (not shiny)
- X-ray: Voids visible
- Cross-section: Poor wetting, incomplete fillet

Prevention:
- Optimize reflow profile (proper time above liquidus)
- Clean PCBs and components (remove oxidation)
- Prevent vibration during reflow
- Use correct solder paste for process

────────────────────────────────────────────────────────

Failure Mode: Connector Fretting Corrosion

Symptoms:
- Intermittent connection
- High contact resistance (voltage drop)
- Connection improves when reseated (temporarily)

Root Causes:
- Micro-motion between contact surfaces (vibration)
- Oxidation of contact surfaces
- Inadequate plating (gold flash vs hard gold)
- Contamination (salt, moisture)

Detection:
- Visual/SEM: Wear marks, corrosion products
- Electrical: Contact resistance measurement
- EDS: Elemental analysis shows oxidation

Prevention:
- Use hard gold plating (1.0 μm minimum, not flash)
- Increase normal force (spring tension)
- Sealed connectors for harsh environments
- Vibration isolation

────────────────────────────────────────────────────────

Failure Mode: Thermal Runaway (Li-ion Battery)

Symptoms:
- Battery overheating
- Venting, swelling
- Fire or explosion (extreme)

Root Causes:
- Internal short circuit
- Overcharging (voltage > 4.2V per cell)
- External heat source
- Physical damage (crush, puncture)

Detection:
- Temperature monitoring (BMS)
- Voltage monitoring (over/under voltage)
- Swelling (mechanical measurement)

Prevention:
- Robust BMS (Battery Management System)
- Thermal fuses and PTC devices
- Cell-level voltage balancing
- Mechanical protection (hard case, crush protection)
- Multiple layers of safety (redundancy)

────────────────────────────────────────────────────────

Failure Mode: Tin Whisker Growth

Symptoms:
- Intermittent short circuits
- Sudden failures (whisker bridges two conductors)

Root Causes:
- Compressive stress in tin plating
- Pure tin finish (not alloyed)
- High humidity environment

Detection:
- SEM imaging (whiskers 10-100 μm long)
- X-ray (for hidden whiskers)

Prevention:
- Use tin-lead solder finish (Sn-Pb, not pure Sn)
- Use matte tin (less stress than bright tin)
- Conformal coating (prevents bridging)
- Avoid pure tin in high-reliability applications
```

---

## Advanced Failure Analysis Tools

### Thermal Imaging

```
Thermal Imaging Analysis: Power Supply Overheating

Equipment: FLIR thermal camera
Resolution: 320 × 240 pixels
Temperature range: -20°C to 150°C
Accuracy: ±2°C

Test Setup:
1. Power on device under test (DUT)
2. Run device at 100% load
3. Capture thermal image after 30 minutes (thermal equilibrium)

Thermal Image Results:

Normal Operation:
Temp range: 35-55°C
Hot spots: Voltage regulator (55°C), processor (50°C)
Ambient: 25°C
Status: ✅ Within specification (max component temp: 85°C)

Failed Unit:
Temp range: 35-95°C ⚠️
Hot spots:
- U5 (voltage regulator): 95°C ⚠️ (18°C above normal)
- C12 (capacitor near U5): 78°C ⚠️ (elevated)
- PCB around U5: Discoloration visible

Finding: U5 running excessively hot (internal short or overload)

Action: Remove U5, measure power consumption
Result: U5 drawing 450mA (normal: 50mA) → Internal short confirmed

Root Cause: U5 damaged by previous overvoltage event, now failing
```

### Acoustic Emission Testing

```
Acoustic Analysis: Cracking Detection

Application: Detecting cracks in solder joints or PCB traces

Method:
- Attach piezoelectric sensor to PCB
- Thermal cycle device (-40°C to 85°C)
- Record acoustic emissions during cycling

Results:

Cycle 1-10: No emissions (baseline)
Cycle 11: Acoustic event detected at 68°C (heating phase)
Cycle 12-15: Events increasing in frequency
Cycle 16: Continuous emissions (crack propagating)

Conclusion: Solder joint cracking under thermal stress

Location: Triangulate using multiple sensors
- Sensor 1: Event at 14:32:45.123
- Sensor 2: Event at 14:32:45.127 (4ms delay)
- Sensor 3: Event at 14:32:45.131 (8ms delay)

Calculated location: Near connector J5 (large component with CTE mismatch)

Verification: X-ray imaging of J5 shows crack in solder joint ✅

Root Cause: CTE (Coefficient of Thermal Expansion) mismatch
- Component: CTE = 6 ppm/°C (ceramic)
- PCB: CTE = 18 ppm/°C (FR4)
- Stress accumulates with thermal cycling

Corrective Action:
- Use underfill epoxy (reduce stress)
- Redesign with flex circuit (absorb stress)
- Select components with matched CTE
```

---

## What Senior Engineers Know

**Failure analysis is not about assigning blame.** It's about learning and preventing recurrence.

**The first answer is rarely the root cause.** Keep asking "Why?" until you reach a process or design issue.

**Good documentation makes failure analysis 10x easier.** Photo everything, measure everything, record everything.

**Some failures are random, but most are predictable.** If it happened once, it will happen again unless you fix the root cause.

**Invest in failure analysis tools.** A $5,000 microscope can prevent a $500,000 recall.

**The field failure you haven't seen yet is the one that costs the most.** Proactive failure analysis in design prevents costly field issues.

---

## Exercise

**Conduct Failure Analysis:**

You receive a field return (warranty claim):

**Product:** Wireless earbuds
**Complaint:** Left earbud not charging
**Symptoms:**
- Right earbud charges normally (LED lights up)
- Left earbud does not light up when placed in charging case
- Left earbud battery appears dead (won't power on)
- Charging case indicates left earbud not present

**Your Tasks:**

1. **Create Failure Report**
   - What information do you need to collect?
   - What tests would you perform first (non-destructive)?

2. **Develop Test Plan**
   - Visual inspection checklist
   - Electrical tests (multimeter, scope)
   - When would you perform destructive testing?

3. **Perform Root Cause Analysis**
   - Use 5 Whys to drill down
   - Create a fishbone diagram with potential causes
   - Design experiments to verify root cause

4. **Design Corrective Action**
   - Immediate fix for this unit?
   - Design change to prevent recurrence?
   - How to verify effectiveness?

5. **Lessons Learned**
   - What design FMEA would have caught this?
   - What test would have caught this before shipment?
   - How to prevent in other products?

**Deliverable:** Complete failure analysis report with photos, test data, root cause, and CAPA plan.

---

## Next Steps

- Learn [8D & CAPA Process](08-8d-capa-process.md) for structured problem solving
- Study [Measurement Uncertainty](09-measurement-uncertainty.md) for accurate testing
- Review [Supplier Quality](06-supplier-quality.md) for managing component defects
- Master [Manufacturing Quality Lifecycle](02-manufacturing-quality-lifecycle.md)
