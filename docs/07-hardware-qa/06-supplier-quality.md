# Supplier Quality Management

## Overview

Your product quality depends heavily on supplier quality. A component defect from a supplier can cause massive recalls, production line shutdowns, and customer returns. Supplier quality management is about preventing these issues through qualification, monitoring, and continuous improvement.

**Reality check:** At scale, 60-80% of your product's cost comes from suppliers. Their quality issues become your quality issues.

---

## The Supplier Quality Lifecycle

```
Supplier Selection → Qualification → Onboarding → Monitoring → Development → Exit
       │                  │              │            │             │          │
       │                  │              │            │             │          │
   RFQ/RFI           PPAP/FAI        Production    Scorecards    Improvement   EOL
   Assessment        Approval         Ramp-up       Audits         Plans      Plan
```

---

## Phase 1: Supplier Selection and Assessment

### Initial Assessment Criteria

**Technical Capability:**

```
Checklist for Supplier RFQ Assessment:

Technical:
□ Manufacturing process capability (Cpk > 1.33)
□ Equipment and tooling adequate
□ Engineering support available
□ Testing and inspection capabilities
□ Quality certifications (ISO 9001, IATF 16949, etc.)

Quality Management:
□ Quality manual and procedures documented
□ Calibration system in place
□ Corrective action process (CAPA)
□ Statistical Process Control (SPC) used
□ Traceability system

Business:
□ Financial stability (credit rating)
□ Production capacity matches volume needs
□ Lead times acceptable
□ Pricing competitive
□ Location and logistics

Risk Factors:
□ Single source of supply? (High risk)
□ Critical component? (Requires backup)
□ Regulatory requirements? (Medical, automotive)
□ Previous performance data available?
```

**Risk-Based Supplier Classification:**

```
Supplier Risk Matrix:

Impact on Product:
High │ Critical Supplier     │ Strategic Supplier
     │ (Intensive oversight) │ (Partnership)
     │                       │
Low  │ Standard Supplier     │ Non-Critical Supplier
     │ (Routine monitoring)  │ (Minimal oversight)
     └───────────────────────┴──────────────────────
         Low                     High
              Spend/Volume

Critical Supplier Example:
- Battery cells for electric vehicle
- Display panels for smartphones
- Medical-grade sensors

Actions:
- Quarterly audits
- Dedicated quality engineer
- Dual sourcing required
- 100% incoming inspection
```

---

## Phase 2: Supplier Qualification

### New Supplier Qualification Process

**Step 1: Desktop Assessment**

Review supplier documentation:
- Quality manual
- Process flow diagrams
- ISO 9001 certificate (verify at registrar)
- Customer references
- Capability data (Cpk studies)

**Step 2: On-Site Audit**

```
Supplier Audit Checklist:

1. Management Commitment (Score: 0-10)
   □ Quality policy displayed and understood by workers
   □ Management reviews quality metrics monthly
   □ Resources allocated to quality improvement
   □ Customer complaints tracked and acted upon
   Score: _____/10

2. Process Control (Score: 0-10)
   □ Work instructions available at workstations
   □ Process parameters monitored and recorded
   □ Statistical Process Control (SPC) charts used
   □ Operators trained and certified
   □ Non-conforming material segregated
   Score: _____/10

3. Inspection and Testing (Score: 0-10)
   □ Incoming inspection performed
   □ In-process inspection defined
   □ Final inspection 100% for critical features
   □ Test equipment calibrated (valid certificates)
   □ Inspection records maintained
   Score: _____/10

4. Calibration System (Score: 0-10)
   □ All gages identified with unique ID
   □ Calibration schedule maintained
   □ Calibration stickers on all equipment
   □ Traceable to national standards
   □ Out-of-tolerance procedure in place
   Score: _____/10

5. Corrective Action (Score: 0-10)
   □ Root cause analysis performed (5 Whys, Fishbone)
   □ Corrective actions tracked to closure
   □ Effectiveness verified
   □ Preventive actions identified
   □ Documentation complete
   Score: _____/10

Total Score: _____/50

Scoring:
45-50: Approved (low risk)
35-44: Approved with improvements required
25-34: Conditional approval with strict monitoring
< 25: Not approved
```

**Example Audit Finding:**

```
Finding: #2025-042
Area: Calibration System
Severity: Major Non-Conformance

Observation:
- 3 of 12 micrometers on production floor past calibration due date
- No evidence of out-of-tolerance investigation for expired gages
- Calibration stickers missing from 2 torque wrenches

Impact:
- Measurements from expired gages may be invalid
- Products measured with these gages may be non-conforming
- Risk of shipping defective parts

Supplier Response Required:
1. Immediate: Quarantine all parts measured with expired gages
2. Within 7 days: Calibrate all expired equipment
3. Within 30 days: Implement calibration alert system
4. Within 30 days: Train technicians on calibration procedures

Supplier Response (Due: 2025-02-15):
[Awaiting corrective action plan]

Verification:
□ Review CAR (Corrective Action Request)
□ Re-audit calibration system in 60 days
□ Verify effectiveness of improvements
```

**Step 3: Sample Validation**

Request samples for testing:

```
Sample Validation Test Plan:

Supplier: Acme Electronics
Part: Capacitor C1206, 10μF, 25V
Sample Quantity: 100 pieces
Sample Type: Production-representative

Tests:
1. Dimensional Inspection (n=30)
   - Length: 3.2mm ± 0.2mm
   - Width: 1.6mm ± 0.2mm
   - Height: 1.6mm ± 0.2mm
   Accept: All measurements within spec

2. Electrical Testing (n=100)
   - Capacitance: 10μF ± 20% (8-12 μF)
   - ESR: < 100 mΩ at 100kHz
   - Leakage: < 3 μA at 25V
   Accept: 100% pass, Cpk > 1.33

3. Reliability Testing (n=30)
   - Temperature cycling: -40°C to 85°C, 500 cycles
   - Humidity: 85% RH, 85°C, 1,000 hours
   Accept: < 1 failure (96.7% reliability)

4. Cross-section Analysis (n=5, destructive)
   - Solder wettability
   - No voids or delamination
   - Metallization thickness

Results:
Date: 2025-01-22
Overall: ✅ PASS

Dimensional: 30/30 pass ✅
Electrical: 100/100 pass, Cpk = 1.52 ✅
Reliability: 0 failures ✅
Cross-section: No defects found ✅

Conclusion: Supplier approved for production
```

---

## Phase 3: PPAP (Production Part Approval Process)

### What is PPAP?

**PPAP** is an automotive industry requirement (IATF 16949) that suppliers must submit comprehensive documentation proving their process can consistently produce conforming parts.

**When PPAP is Required:**
- New part or product
- Correction of a discrepancy
- Engineering change to design
- Change in manufacturing process
- Change in supplier or location
- Tooling change or modification
- After process inactivity (12+ months)

### PPAP Submission Levels

```
Level 1: Part Submission Warrant (PSW) only
        - For low-risk, non-critical parts

Level 2: PSW + Product samples + supporting data (at supplier)
        - Most common for standard parts

Level 3: PSW + Product samples + complete supporting data
        - Required for critical/safety parts
        - Most comprehensive

Level 4: PSW + Product samples + supporting data + customer-specific
        - Customer representative witnesses verification

Level 5: PSW + Product samples + supporting data + verification at supplier
        - Customer conducts verification at supplier site
```

### PPAP Level 3 Submission Checklist

```
PPAP Package for: DC-DC Converter Module

1. Design Records ✅
   - Engineering drawings (Rev C)
   - Material specifications
   - Performance specifications
   - ECO history

2. Engineering Change Documents ✅
   - ECO #2024-156: Changed capacitor C5 to higher temp rating

3. Customer Engineering Approval ✅
   - Drawing approved by customer: 2024-12-15

4. Design FMEA ✅
   - Completed, RPN < 100 for all failure modes
   - 24 failure modes identified and mitigated

5. Process Flow Diagram ✅
   - 12 process steps documented
   - Critical parameters identified

6. Process FMEA ✅
   - Completed, all high-risk operations have controls
   - SPC charts for critical parameters

7. Control Plan ✅
   - Incoming, in-process, and outgoing inspection defined
   - Sample sizes, frequencies, methods specified

8. Measurement System Analysis (MSA) ✅
   - Gauge R&R for critical dimensions
   - Gage R&R < 10% for all gages

9. Dimensional Results ✅
   - 100% inspection of first production run (300 units)
   - All dimensions within specification
   - Cpk > 1.67 for all critical features

10. Material/Performance Test Results ✅
    - Electrical testing: 100% pass
    - Temperature cycling: 0 failures in 30 samples
    - Humidity test: 0 failures in 30 samples
    - Drop test: 0 failures in 10 samples

11. Initial Process Study ✅
    - Output voltage: Cpk = 1.82
    - Efficiency: Cpk = 2.01
    - Ripple voltage: Cpk = 1.55

12. Qualified Laboratory Documentation ✅
    - ISO 17025 certificate for test lab
    - Scope includes required tests

13. Appearance Approval Report (AAR) ✅
    - Golden sample approved by customer
    - Color, texture, finish documented

14. Sample Production Parts ✅
    - 20 parts submitted from production run
    - Part numbers match drawings

15. Master Sample ✅
    - Master sample retained by supplier
    - Labeled and stored in controlled area

16. Checking Aids ✅
    - Go/No-Go gages for critical dimensions
    - Functional test fixture

17. Customer-Specific Requirements ✅
    - Lead-free solder (RoHS compliant)
    - ESD handling procedures
    - Traceability to lot/date code

18. Part Submission Warrant (PSW) ✅
    - Signed by supplier quality manager
    - Date: 2025-01-20

PPAP Status: ✅ APPROVED
Approved by: [Customer Quality Engineer]
Date: 2025-01-22
Effective Date: 2025-02-01

Production Authorization: Approved for full production
```

### First Article Inspection (FAI)

For non-automotive industries, FAI is similar to PPAP but less comprehensive:

```
First Article Inspection Report

Part: Aluminum Housing
Drawing: MFG-456-REV B
Supplier: Precision Machining Inc.

Inspection Method: 100% dimensional inspection of first article

Serial Number: FA-2025-001
Inspector: J. Smith
Date: 2025-01-20

Dimensional Results:
Characteristic           | Specification      | Measured  | Status
─────────────────────────┼───────────────────┼───────────┼────────
Overall Length           | 120.0 ± 0.2 mm    | 119.95 mm | ✅ Pass
Overall Width            | 80.0 ± 0.2 mm     | 80.08 mm  | ✅ Pass
Overall Height           | 30.0 ± 0.1 mm     | 29.97 mm  | ✅ Pass
Hole Diameter (4 places) | Ø6.0 +0.1/-0.0 mm | 6.04 mm   | ✅ Pass
Surface Finish           | Ra 1.6 μm max     | Ra 1.2 μm | ✅ Pass
Anodize Thickness        | 10-20 μm          | 15 μm     | ✅ Pass

Material Verification:
Certificate of Conformance: ✅ Received
Material: 6061-T6 Aluminum (verified)
Heat Treatment: T6 (hardness 95 HB, spec: 90-100 HB) ✅

Visual Inspection:
□ No scratches or dents
□ Anodize color uniform (black)
□ No machining burrs
□ Holes deburred

Result: ✅ APPROVED

Signature: _________________  Date: 2025-01-20

Production authorization: Proceed with production run
```

---

## Phase 4: Incoming Quality Control (IQC)

### IQC Inspection Levels

**Sampling Plans (based on MIL-STD-105E / ANSI/ASQ Z1.4):**

```
Acceptance Quality Limit (AQL) Sampling:

AQL Levels for Different Defect Types:
- Critical defects (safety): AQL 0% (zero tolerance)
- Major defects (function): AQL 1.0%
- Minor defects (cosmetic): AQL 2.5%

Example: Lot size = 1,000 units, AQL = 1.0% (Major defects)

Inspection Level II (Normal):
Sample size (n) = 80 units
Accept (Ac) = 2 defects
Reject (Re) = 3 defects

Procedure:
1. Randomly select 80 units from lot
2. Inspect each unit
3. Count defects
4. If defects ≤ 2: Accept lot
   If defects ≥ 3: Reject lot
```

**Reduced vs Tightened Inspection:**

```
Start: Normal Inspection
   │
   ├─ 10 consecutive lots accepted → Switch to Reduced Inspection
   │  (Sample size smaller, save cost)
   │
   └─ 2 of 5 lots rejected → Switch to Tightened Inspection
      (Lower acceptance number, more strict)

Example:
Normal:    n=80, Ac=2, Re=3
Reduced:   n=32, Ac=1, Re=2  (75% fewer samples)
Tightened: n=80, Ac=1, Re=2  (stricter acceptance)
```

### IQC Test Procedures

**Example 1: Electronic Component Inspection**

```
Component: Resistor, 1kΩ ±1%, 0805 package
Supplier: ABC Electronics
Lot: R1K-2025-012
Lot Qty: 10,000 pcs
AQL: 1.0% (Major defects)

Sample Size: 125 pcs (per AQL table)
Accept: 3 defects
Reject: 4 defects

Tests:
1. Visual Inspection (n=125)
   □ Package dimensions correct
   □ Markings legible
   □ No visible damage
   Defects found: 0 ✅

2. Resistance Measurement (n=125)
   Specification: 1,000Ω ± 1% (990-1010Ω)

   Measurements:
   Mean: 999.2Ω
   Std Dev: 3.1Ω
   Range: 993Ω - 1006Ω

   Results:
   - All 125 units within spec ✅
   - Cpk = 1.16 (marginal, monitor)

3. Solderability Test (n=10, destructive)
   Solder dip test: 245°C, 5 seconds

   Results:
   - 10/10 units: >95% wetting ✅

Overall Result:
Defects: 0/125 (0%)
Decision: ✅ ACCEPT LOT

Inspector: M. Johnson
Date: 2025-01-22

Note: Cpk = 1.16 is below preferred 1.33.
Action: Request process improvement from supplier.
```

**Example 2: Mechanical Part Inspection**

```
Component: Injection Molded Plastic Housing
Supplier: Plastics Inc.
Lot: PLH-2025-045
Lot Qty: 5,000 pcs
AQL: 1.5% (Major), 4.0% (Minor)

Sample Size: 200 pcs

Tests:
1. Dimensional Inspection (n=30)
   Critical dimensions measured:

   Wall thickness: 2.0 ± 0.2 mm
   Results: 1.85 - 2.12 mm
   Status: 1 unit out of spec (1.78 mm) ⚠️

   Boss diameter: Ø8.0 +0.2/-0.0 mm
   Results: 8.02 - 8.18 mm
   Status: All pass ✅

   Dimensional defects: 1/30 = 3.3%

2. Visual Inspection (n=200)
   □ Flash/burrs: 3 units ⚠️
   □ Sink marks: 2 units ⚠️
   □ Scratches: 5 units (minor) ⚠️
   □ Color mismatch: 0 units ✅

   Major defects: 5/200 = 2.5%
   Minor defects: 5/200 = 2.5%

3. Functional Test (n=50)
   Snap-fit assembly test
   Results: 50/50 pass ✅

Decision Matrix:
Major defects: 5 found, Accept ≤ 5, Reject ≥ 6
Decision for Major: ✅ ACCEPT (borderline)

Minor defects: 5 found, Accept ≤ 10, Reject ≥ 11
Decision for Minor: ✅ ACCEPT

Overall: ✅ ACCEPT WITH NOTIFICATION

Actions:
1. Accept lot for production use
2. Issue Supplier Corrective Action Request (SCAR)
3. Request root cause analysis for wall thickness and flash defects
4. Next lot: Tightened inspection (n=200, Ac=3, Re=4)

Inspector: K. Lee
Date: 2025-01-23
```

### Skip Lot Inspection

For established suppliers with good track record:

```
Skip Lot Criteria:

Requirements (ALL must be met):
✅ Supplier approved for 6+ months
✅ 20+ consecutive lots accepted
✅ No customer complaints in past 3 months
✅ Cpk > 1.67 for critical parameters
✅ Supplier has ISO 9001 certification

Skip Lot Schedule:
Inspect 1 out of every 5 lots (20% inspection rate)

Example:
Lot 1: Inspect ✅
Lot 2: Skip
Lot 3: Skip
Lot 4: Skip
Lot 5: Skip
Lot 6: Inspect ✅
...

If ANY lot fails inspection:
→ Return to 100% lot inspection
→ Requires 10 consecutive passes to resume skip lot
```

---

## Phase 5: Supplier Performance Monitoring

### Supplier Scorecard

Track supplier performance with monthly scorecards:

```
Supplier Scorecard: ABC Electronics
Month: January 2025

1. Quality (40% weight)
   Metric: PPM (Parts Per Million defects)

   Delivered: 250,000 parts
   Rejected: 75 parts
   PPM: (75 / 250,000) × 1,000,000 = 300 PPM

   Target: < 100 PPM
   Score: 60/100 (300 PPM vs 100 target) ⚠️

2. Delivery (30% weight)
   Metric: On-Time Delivery (OTD)

   Total shipments: 24
   On-time: 21
   Late: 3
   OTD: (21/24) × 100% = 87.5%

   Target: > 95%
   Score: 70/100 ⚠️

3. Responsiveness (20% weight)
   Metric: Time to respond to CARs

   CARs issued: 2
   Response time: 4 days, 3 days (avg: 3.5 days)

   Target: < 5 days
   Score: 90/100 ✅

4. Cost (10% weight)
   Metric: Price competitiveness

   Price vs market: +2% (slightly higher)

   Target: Within ±5%
   Score: 85/100 ✅

Overall Score:
(60 × 0.4) + (70 × 0.3) + (90 × 0.2) + (85 × 0.1) = 71.5/100

Rating: ⚠️ NEEDS IMPROVEMENT

Tier Classification:
90-100: Preferred Supplier (Green)
70-89:  Approved Supplier (Yellow) ← Current
50-69:  Conditional Supplier (Orange)
< 50:   Unacceptable (Red - Exit strategy)

Actions Required:
1. Schedule improvement meeting with supplier
2. Request corrective action plan for quality issues
3. Discuss capacity planning for delivery improvements
4. Re-evaluate in 30 days
```

### Defect Tracking (PPM Trending)

```
PPM Trend Chart:

1000 PPM │                     ╱╲
         │                    ╱  ╲
 750 PPM │                   ╱    ╲
         │                  ╱      ╲
 500 PPM │      ╱╲         ╱        ╲
         │     ╱  ╲       ╱          ╲
 250 PPM │    ╱    ╲─────╱            ╲───────
         │   ╱
   0 PPM └──┴────┴────┴────┴────┴────┴────┴────
          Oct  Nov  Dec  Jan  Feb  Mar  Apr  May

Target: <100 PPM (shown as dashed line)

Observations:
- Spike in December (850 PPM) - Root cause: Process change
- January still elevated (300 PPM)
- Trend improving but not at target

Action: Maintain tightened inspection until 3 consecutive months <100 PPM
```

### Corrective Action Requests (CAR)

```
Supplier Corrective Action Request (SCAR)

SCAR #: 2025-008
Date Issued: 2025-01-25
Issued to: ABC Electronics
Issued by: Quality Engineering

Problem Description:
Lot PLH-2025-045 (Plastic housings) received with excessive flash
and dimensional issues. 5 of 200 samples (2.5%) had major defects:
- 3 units with flash >0.5mm on parting line
- 2 units with wall thickness below specification (1.78mm vs 2.0±0.2mm)

Impact:
- Production line delayed 2 hours for sorting
- Potential assembly issues with thin walls
- Customer aesthetic concerns with flash

Supplier Response Required (Due: 2025-02-08):

1. Immediate Containment (within 24 hours):
   □ Quarantine remaining inventory
   □ 100% sort and rework if possible
   □ Ship only conforming parts

2. Root Cause Analysis (within 7 days):
   □ Use 5 Whys or Fishbone diagram
   □ Identify root cause for flash defects
   □ Identify root cause for dimensional issues

3. Corrective Action (within 14 days):
   □ Implement permanent corrective actions
   □ Verify actions with trial run (300 pcs)
   □ Submit PPAP for re-approval if process changed

4. Preventive Action (within 14 days):
   □ Identify similar risks in other processes
   □ Implement preventive measures
   □ Update control plan and FMEA

5. Verification (within 30 days):
   □ Submit 3 consecutive lots for verification
   □ Demonstrate Cpk > 1.33 for critical dimensions
   □ Close SCAR with effectiveness verification

────────────────────────────────────────────────

Supplier Response (Received: 2025-02-01):

1. Immediate Containment: ✅ Complete
   - Remaining 4,800 units quarantined
   - 100% visual inspection performed
   - 123 additional units with flash found and reworked
   - 4,677 conforming units released to customer

2. Root Cause Analysis:

   5 Whys - Flash Defects:
   Why flash present? → Mold not closing fully
   Why not closing? → Hydraulic pressure low
   Why low pressure? → Pressure sensor out of calibration
   Why out of calibration? → Missed scheduled calibration
   Why missed? → Calibration schedule not followed

   Root Cause: Calibration management system inadequate

   5 Whys - Dimensional Issues:
   Why wall thin? → Insufficient material injected
   Why insufficient? → Injection time too short
   Why too short? → Operator adjusted cycle time for productivity
   Why operator changed? → No lock-out on process parameters
   Why no lock-out? → Process control inadequate

   Root Cause: Process parameters not locked by engineering

3. Corrective Actions: ✅ Implemented
   - Recalibrated hydraulic pressure sensor
   - Implemented automated calibration tracking system
   - Locked all injection molding process parameters (requires engineering approval to change)
   - Retrained operators on process control procedures
   - Added SPC chart for wall thickness (hourly measurement)

4. Preventive Actions: ✅ Implemented
   - Reviewed all 15 injection molding machines for calibration status
   - Found 3 additional machines with expired calibrations (recalibrated)
   - Implemented email alerts 2 weeks before calibration due
   - Updated work instructions with "DO NOT ADJUST" warnings
   - Added parameter lock-out to 12 other molding machines

5. Verification:
   - Trial run: 300 pcs produced on 2025-02-05
   - 100% inspection results:
     * Flash defects: 0/300 (0%) ✅
     * Wall thickness: Cpk = 1.58 (all within spec) ✅

   Next 3 lots submitted for verification:
   - Lot 046: 0 defects ✅
   - Lot 047: 0 defects ✅
   - Lot 048: 0 defects ✅

Customer Verification:
Inspector: K. Lee
Verification Date: 2025-02-15
Status: ✅ Effectiveness verified

SCAR Status: ✅ CLOSED
Closed by: Quality Manager
Close Date: 2025-02-15

Follow-up: Return to normal inspection after 5 more lots
```

---

## Phase 6: Supplier Development

### Continuous Improvement Programs

**Supplier Quality Improvement Projects:**

```
Improvement Project: Reduce Solder Defects

Supplier: PCB Assembly Inc.
Current State:
- Solder defects: 1,200 PPM (1.2%)
- Rework rate: 8%
- Cost of quality: $45,000/year

Target State:
- Solder defects: < 100 PPM (0.01%)
- Rework rate: < 1%
- Cost savings: $40,000/year

Timeline: 6 months

Phase 1: Analysis (Month 1)
Activities:
□ Conduct Gemba walk (observe production floor)
□ Collect defect data (Pareto analysis)
□ Identify top 3 defect types
□ Perform root cause analysis

Results:
Top Defects:
1. Cold solder joints: 45% of defects
2. Insufficient solder: 30% of defects
3. Bridging: 15% of defects

Root Causes:
1. Reflow oven temperature profile not optimized
2. Stencil aperture design incorrect
3. Operator training inadequate

Phase 2: Pilot (Months 2-3)
Activities:
□ Optimize reflow temperature profile (DOE)
□ Redesign stencil with engineering
□ Conduct operator training (IPC-A-610)

Trial Results:
- Solder defects: 450 PPM (62% reduction) ✅
- Rework rate: 3% (60% reduction) ✅

Phase 3: Implementation (Months 4-5)
Activities:
□ Roll out new reflow profile to all lines
□ Replace all stencils (4 production lines)
□ Certify all operators to IPC-A-610
□ Update work instructions and control plan

Phase 4: Verification (Month 6)
Measure results over 30 days:
- Solder defects: 85 PPM (93% reduction) ✅✅
- Rework rate: 0.8% (90% reduction) ✅✅
- Cost savings: $42,000/year ✅

Project Status: ✅ SUCCESS

Lessons Learned:
- Temperature profiling is critical for solder quality
- Stencil design often overlooked but high impact
- Operator training must include hands-on practice

Recognize Supplier:
□ Supplier Excellence Award
□ Preferred supplier status
□ Increased business (20% volume increase)
```

---

## Phase 7: Supplier Audits

### Audit Types and Frequency

```
Audit Schedule by Supplier Tier:

Critical Suppliers:
- Initial audit: Before approval
- Follow-up audit: 6 months after approval
- Recurring: Annual (minimum)
- Special audit: After significant issue

Approved Suppliers:
- Initial audit: Before approval
- Recurring: Every 2 years
- Special audit: If performance drops

Low-Risk Suppliers:
- Initial audit: Desktop review only
- Recurring: Every 3 years or as needed
```

### Audit Process

```
Supplier Audit Plan

Supplier: XYZ Manufacturing
Location: Shenzhen, China
Audit Date: 2025-03-10 to 2025-03-12
Audit Type: Surveillance (annual)
Audit Team:
- Lead Auditor: Sarah Chen (Quality Director)
- Technical Expert: Mike Wang (Process Engineer)
- Translator: Local contractor

Scope:
- Quality Management System (ISO 9001)
- Manufacturing processes for products A, B, C
- Incoming inspection and testing
- Calibration system
- Corrective action effectiveness

Day 1: Opening Meeting and Documentation Review
08:00-09:00  Opening meeting with management
09:00-12:00  Review quality manual, procedures, records
12:00-13:00  Lunch
13:00-17:00  Review supplier scorecard, SCAR history

Day 2: Production Floor Audit
08:00-10:00  Incoming inspection area
10:00-12:00  SMT line (product A)
12:00-13:00  Lunch
13:00-15:00  Final assembly (product B)
15:00-17:00  Testing and calibration lab

Day 3: Findings and Closing
08:00-10:00  Complete observations
10:00-12:00  Prepare audit report
12:00-13:00  Lunch
13:00-15:00  Closing meeting with management
15:00-17:00  Travel to airport

Audit Findings:

Major Non-Conformances (3):
1. Calibration records missing for 5 torque wrenches
   Requirement: ISO 9001, 7.1.5.1
   Evidence: Torque wrenches in use without valid calibration
   Impact: Measurements may be invalid

2. Corrective action effectiveness not verified
   Requirement: ISO 9001, 10.2.1
   Evidence: SCAR 2024-034 closed without verification
   Impact: Defect may recur

3. Obsolete work instruction in use
   Requirement: ISO 9001, 7.5.3
   Evidence: Work instruction WI-045 Rev A in use (current is Rev C)
   Impact: Operators following incorrect procedure

Minor Non-Conformances (7):
1. Operator training records incomplete
2. SPC chart not posted at workstation
3. First-in-first-out (FIFO) not followed for components
4. Calibration sticker damaged on micrometer
5. Non-conforming material not clearly marked
6. Quality policy not displayed in assembly area
7. Management review minutes incomplete

Observations (Opportunities for Improvement):
1. Consider automated optical inspection (AOI) to reduce defects
2. Update quality manual to reflect current org chart
3. Implement visual management for work-in-process

Positive Findings:
□ Clean and organized production floor
□ Operators well-trained and engaged
□ Strong management commitment to quality
□ Excellent housekeeping in all areas

Overall Assessment:
Current Status: Approved Supplier
Action Required: Corrective action plan due in 14 days
Follow-up: Desktop review of CAR in 30 days
Next Audit: 12 months (conditional on CAR closure)

Supplier must address all major non-conformances within 30 days.
Failure to close major NCs may result in supplier disqualification.
```

---

## Component Traceability

### Why Traceability Matters

**Real-world example:**

```
Scenario: Battery Recall

Product: Smartphone (Model X)
Issue: Battery swelling reports from field
Units affected: Unknown

Without Traceability:
→ Recall ALL 2 million units sold
→ Cost: $150 million
→ Brand damage severe

With Traceability:
Date codes tracked:
- Battery supplier: Lot B2024-W42
- Manufacturing date: Oct 15-17, 2024
- Serial numbers: SN 4201500 - 4203899

→ Recall only 2,400 units (0.12%)
→ Cost: $180,000
→ Targeted communication to affected customers

Savings: $149.82 million + preserved brand reputation
```

### Implementing Traceability

```
Traceability System Design:

Level 1: Lot-Level Traceability (Basic)
- Track supplier lot number for each component
- Record which lots used in which production runs
- Suitable for: Low-risk consumer products

Example:
Production Run: PR-2025-025
Date: 2025-01-22
Components:
- Resistor R1: Lot R1K-2025-012
- Capacitor C1: Lot C10U-2025-008
- PCB: Lot PCB-2025-045

Level 2: Batch-Level Traceability (Medium)
- Track components to specific production batches
- Each batch has unique ID
- Suitable for: Medical devices, automotive

Example:
Batch: BN-2025-0122-A
Quantity: 500 units
Serial Range: SN 122000 - 122499
Components:
- Battery: Lot BAT-2025-W03, cells 1-500
- Display: Lot DSP-2025-012, panels 2001-2500
- PCB: Batch PCB-A-0122 (specific sub-batch)

Level 3: Unit-Level Traceability (Highest)
- Every component tracked to individual serial number
- Complete genealogy for each unit
- Suitable for: Aerospace, implantable medical devices

Example:
Product Serial: MED-2025-123456
Components:
- Circuit board: PCB-SN-445678
  - Microcontroller: IC-2024-W52-0012345
  - Memory: MEM-2025-W01-0067890
- Battery: BAT-SN-998877 (cell production date, manufacturer)
- Enclosure: ENC-2025-0115-023456 (injection molding machine #3, cavity #2)

Database Record:
{
  "product_sn": "MED-2025-123456",
  "assembly_date": "2025-01-22T14:32:00Z",
  "assembly_line": "Line 2",
  "operator": "OP-456",
  "pcb_sn": "PCB-SN-445678",
  "battery_sn": "BAT-SN-998877",
  "firmware_version": "v3.2.1",
  "test_results": {
    "functional": "PASS",
    "safety": "PASS",
    "calibration": "PASS"
  },
  "shipment": "SHIP-2025-0125-A",
  "customer": "Hospital Network ABC"
}

Traceability retained for: Device lifetime + 10 years (regulatory requirement)
```

---

## Managing Supplier Changes

### Change Notification Process

```
Supplier Change Notification (SCN)

From: ABC Electronics
To: [Customer Quality]
Date: 2025-01-20
SCN #: SCN-2025-003

Change Description:
Component: Ceramic capacitor C1206, 10μF, 25V
Part Number: CAP-C1206-10UF-25V
Change Type: Manufacturing location change

Current:
- Manufacturing site: Dongguan, China
- ISO 9001 certified: Yes

Proposed:
- Manufacturing site: Suzhou, China
- ISO 9001 certified: Yes

Reason for Change:
- Dongguan facility reaching capacity
- Suzhou facility has newer equipment
- Cost reduction (10% lower manufacturing cost)

Impact Assessment:
Form: ✅ No change (same dimensions)
Fit: ✅ No change (same footprint)
Function: ✅ No change (same electrical specs)
Reliability: ⚠️ To be verified (new facility)

Customer Approval Process:
□ Customer reviews change
□ Customer requests validation samples
□ Supplier provides samples from new facility
□ Customer performs qualification testing
□ Customer approves or rejects change

Validation Plan:
1. Submit 200 samples from Suzhou facility
2. Customer performs:
   - Dimensional inspection (30 pcs)
   - Electrical testing (100 pcs)
   - Reliability testing (30 pcs): 500 cycles temp, 1000 hrs humidity
3. Expected completion: 8 weeks

Production Timeline:
- Last production at Dongguan: 2025-04-30
- First production at Suzhou: 2025-05-15 (pending customer approval)

Customer Response Required by: 2025-02-10

──────────────────────────────────────

Customer Response (Date: 2025-02-05):

Decision: ✅ CONDITIONAL APPROVAL

Conditions:
1. Supplier must submit PPAP Level 3 for new facility
2. First 10 lots from Suzhou require 100% incoming inspection
3. Supplier must demonstrate Cpk > 1.67 for critical parameters
4. Customer reserves right to audit Suzhou facility

Approved by: Quality Director
Effective date: Upon successful PPAP approval

Next Steps:
□ Supplier submits PPAP package
□ Customer reviews and approves PPAP
□ Production transition begins
```

---

## Supplier Exit Strategy

### When to Exit a Supplier

```
Exit Decision Criteria:

Mandatory Exit (Immediate):
□ Fraud or data falsification discovered
□ Loss of required certifications (ISO 9001, etc.)
□ Bankruptcy or financial failure
□ Safety incident causing injury
□ Regulatory violation (FDA warning letter, etc.)
□ Failure to contain critical quality issue

Performance-Based Exit:
□ Scorecard below 50 for 3 consecutive months
□ Multiple SCARs with ineffective corrective actions
□ PPM consistently above 1000 despite improvement efforts
□ Delivery performance below 80%
□ Unwilling to implement required improvements
□ Better supplier available (cost, quality, technology)
```

### Exit Process

```
Supplier Exit Plan

Supplier: XYZ Components
Exit Reason: Persistent quality issues (PPM >1500 for 6 months)
Exit Type: Planned transition
Timeline: 6 months

Phase 1: Decision (Month 1)
□ Document exit rationale
□ Get management approval
□ Identify replacement supplier(s)
□ Assess impact on production

Phase 2: Qualification (Months 2-4)
□ Qualify alternate supplier(s)
□ Conduct supplier audit
□ Validate samples
□ Approve PPAP
□ Dual-source during transition

Phase 3: Transition (Months 5-6)
□ Ramp up new supplier volume
□ Ramp down exiting supplier
□ Monitor quality of both suppliers
□ Update BOMs and procedures

Week-by-Week Transition:
Week 1-4:  Exiting 100%, New 0%
Week 5-8:  Exiting 75%, New 25%
Week 9-12: Exiting 50%, New 50%
Week 13-16: Exiting 25%, New 75%
Week 17+:   Exiting 0%, New 100%

Phase 4: Closure (Month 6)
□ Return supplier tooling and materials
□ Settle final payments
□ Archive supplier records (7 years retention)
□ Update approved supplier list
□ Communicate change to stakeholders

Risk Mitigation:
- Maintain 8 weeks safety stock during transition
- Overlap suppliers for 2 months
- Increase incoming inspection during ramp-up
- Weekly quality meetings with new supplier
```

---

## Best Practices

### 1. Qualification is an Investment, Not a Cost

```
❌ Bad: Rush supplier approval to meet production schedule
Result: Quality issues in production cost 10x more

✅ Good: Thorough qualification process (4-6 weeks)
Result: Smooth production launch, fewer issues, lower total cost
```

### 2. Document Everything

```
If it's not documented, it didn't happen.

Required Documentation:
□ Supplier approval package
□ PPAP or FAI
□ Incoming inspection records
□ Supplier scorecards
□ Audit reports
□ SCAR history
□ Component traceability

Retention: 7-10 years (regulatory requirements)
```

### 3. Trust But Verify

```
❌ Bad: Accept supplier's Certificate of Conformance without testing
Result: Defective parts reach production, costly rework

✅ Good: Independent incoming inspection, even with CoC
Result: Catch defects before they enter production
```

### 4. Build Partnerships, Not Just Contracts

```
Supplier Relationships:

Transactional (Bad):
- Focused only on price
- Minimal communication
- Blame culture when issues arise

Partnership (Good):
- Share roadmaps and forecasts
- Collaborative improvement projects
- Jointly solve problems
- Recognize and reward performance
- Long-term commitments

Example:
Apple & Foxconn: 20+ year partnership
- Apple invests in Foxconn equipment
- Joint engineering teams
- Shared quality metrics
- Continuous innovation together
```

### 5. Diversify Critical Suppliers

```
Single-Source Risk:

Scenario: Sole supplier factory fire
Impact: Production shutdown for 3-6 months
Cost: Millions in lost revenue

Risk Mitigation:
□ Dual-source critical components (even at higher cost)
□ Qualify backup suppliers (keep warm)
□ Maintain safety stock (4-8 weeks)
□ Monitor supplier financial health
□ Have contingency plans

Cost-Benefit:
Dual sourcing cost premium: +5-10%
Risk mitigation value: Priceless (business continuity)
```

---

## What Senior Engineers Know

**Your product is only as good as your worst supplier.** Spend time on supplier quality, not just firefighting internal issues.

**PPM is a lagging indicator.** Leading indicators (Cpk, process control, training) predict future quality.

**Calibration matters more than you think.** Out-of-calibration gages mean you don't know what you're shipping.

**Relationships trump contracts.** Suppliers who trust you will solve problems faster.

**Traceability is insurance.** You don't need it until you desperately need it.

**Price is what you pay. Quality is what you get.** Cheap suppliers cost more in the long run.

---

## Exercise

**Create Supplier Quality Program:**

You are launching a new wearable fitness tracker:

**Key Components and Suppliers:**
1. PCB Assembly - ABC Electronics (China)
2. OLED Display - Display Corp (Korea)
3. Battery - PowerCells Inc (Taiwan)
4. Plastic Housing - Injection Molding Co (Vietnam)
5. Silicone Wristband - Silicone Solutions (USA)

**Volume:** 50,000 units/month
**Product Life:** 3 years
**Regulatory:** Consumer electronics (FCC, CE, RoHS)

**Your Tasks:**

1. **Classify Suppliers by Risk**
   - Which suppliers are critical? Why?
   - What inspection level for each?

2. **Design IQC Plan**
   - What to inspect for each component?
   - Sample sizes (use AQL tables)
   - Accept/reject criteria

3. **Create Scorecard Metrics**
   - What metrics for each supplier?
   - Weighting of metrics?
   - Performance targets?

4. **Traceability System**
   - What level of traceability needed?
   - How to implement?
   - Database schema?

5. **SCAR Process**
   - Write a sample SCAR for battery defect
   - Define response requirements
   - Verification plan

**Deliverable:** Complete supplier quality manual with procedures, forms, and metrics.

---

## Next Steps

- Study [Failure Analysis](07-failure-analysis.md) techniques
- Learn [8D & CAPA Process](08-8d-capa-process.md)
- Master [Measurement Uncertainty](09-measurement-uncertainty.md)
- Review [Manufacturing Quality Lifecycle](02-manufacturing-quality-lifecycle.md)
