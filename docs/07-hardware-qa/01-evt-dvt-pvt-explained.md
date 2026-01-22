# EVT, DVT, PVT Explained

## Overview

EVT (Engineering Validation Test), DVT (Design Validation Test), and PVT (Production Validation Test) are the three major validation phases in hardware product development. Each phase has distinct goals, sample characteristics, and validation focus.

## The Three Phases

```
Concept → EVT → DVT → PVT → Mass Production
         (Prototype) (Pre-Prod) (Prod Ready)
```

### Phase Progression

| Aspect | EVT | DVT | PVT |
|--------|-----|-----|-----|
| **Purpose** | Prove concept works | Validate final design | Validate manufacturing |
| **Samples** | 5-20 hand-built | 50-200 prototype tooling | 500-2000 production tooling |
| **Design** | May have deviations | Frozen or near-frozen | Frozen |
| **Testing Focus** | Core functionality | Comprehensive validation | Manufacturing quality |
| **Defect Response** | Design iterations expected | Design changes costly | Design changes avoided |
| **Duration** | 2-4 weeks | 4-8 weeks | 4-6 weeks |

---

## EVT: Engineering Validation Test

### Purpose
Prove the engineering concept works and validate core technical specifications.

### Key Questions
- Does the design work fundamentally?
- Can we meet key technical specifications?
- Are components appropriate?
- What are the major design risks?

### Sample Characteristics
**Quantity:** 5-20 units
**Build Method:** Hand-assembled by engineers, prototype PCBs, 3D-printed or CNC'd enclosures
**Quality:** May have cosmetic imperfections, deviations from final design
**Cost:** Very expensive per unit ($1000s-$10000s)

### Testing Focus

**Must Validate:**
- Core functionality works (can it do what it's supposed to do?)
- Key electrical parameters within range
- Major mechanical fit and function
- Critical safety requirements
- Proof of concept for new technologies

**Can Defer:**
- Full environmental testing
- Long-term reliability
- Manufacturing process validation
- Cosmetic finish
- Complete feature set

### Example EVT Tests: Smart Watch

**Core Functionality:**
- Heart rate sensor reads accurately
- Display shows content
- Bluetooth pairs with phone
- Charges via wireless charger
- Basic water resistance (will improve in DVT)

**Electrical:**
- Current draw in acceptable range
- Battery lasts >4 hours (target 8 hours final)
- No critical thermal issues

**Mechanical:**
- Watch band attaches securely
- Buttons have tactile feedback
- Screen is readable

**Deviations Acceptable:**
- Hand-soldered PCB vs production SMT
- 3D-printed case vs injection molded
- Battery life lower than target
- Cosmetic finish not final

### EVT Exit Criteria

☑ Core functionality demonstrated
☑ No showstopper technical issues
☑ Key components validated
☑ Major design risks identified and mitigated
☑ Design iterations completed
☑ Ready to freeze design for DVT

### Common EVT Findings

**Typical Issues Found:**
- Component doesn't perform as expected (change supplier/part)
- Thermal hot spots (improve heat dissipation)
- Battery life insufficient (optimize firmware)
- Mechanical interference (adjust CAD)
- Feature not feasible (scope change)

**Design Iteration:**
EVT often results in:
- Component changes (different sensors, MCU, battery)
- Mechanical redesigns (enclosure, button placement)
- Firmware architecture changes
- Feature scope adjustments

---

## DVT: Design Validation Test

### Purpose
Validate the complete, finalized design meets all requirements and is ready for mass production.

### Key Questions
- Does the design meet all specifications?
- Will it survive expected use conditions?
- Is it reliable enough for production?
- Can it pass regulatory certifications?
- Is the design manufacturable?

### Sample Characteristics
**Quantity:** 50-200 units
**Build Method:** Prototype tooling (soft tools), closer to production process
**Quality:** Should be very close to final product
**Cost:** Expensive per unit ($100s-$1000s), tooling investment significant

### Testing Focus

**Must Validate:**
- 100% of product requirements
- Full environmental testing
- Reliability and life testing
- Regulatory pre-certification
- Manufacturing process capability
- Complete feature set
- User experience

**Complete Test Coverage:**
- Functional testing (all features)
- Electrical testing (all parameters, all conditions)
- Mechanical testing (drop, vibration, durability)
- Environmental testing (temperature, humidity, altitude)
- Reliability testing (HALT, burn-in, life testing)
- Safety testing (electrical safety, flammability)
- EMC testing (FCC, CE pre-testing)
- User acceptance testing

### Example DVT Tests: Smart Watch

**Functional:**
- All features working (health tracking, notifications, apps)
- Accuracy validation (heart rate, steps, GPS)
- User scenarios (exercise, sleep, daily wear)

**Environmental:**
- Operating temp: -10°C to +45°C
- Storage temp: -20°C to +60°C
- Humidity: 95% RH at 40°C
- Water resistance: IP68 validated
- Altitude: Simulated 3000m

**Reliability:**
- Button life: 100,000 actuations
- Band life: 10,000 flex cycles
- Charge cycles: 500 cycles to 80% capacity
- Drop test: 1.5m onto concrete, 26 orientations
- Sweat resistance: 96 hours in artificial sweat

**Regulatory:**
- FCC Part 15 (radiated/conducted emissions)
- IEC 62368-1 (safety)
- Bluetooth SIG certification
- Battery certifications (UL, UN 38.3)

**Manufacturing:**
- First article inspection
- Process capability study (preliminary)
- Supplier qualification

### DVT Exit Criteria

☑ All requirements validated
☑ Environmental testing passed
☑ Reliability targets met
☑ Safety/regulatory testing passed (pre-cert)
☑ No critical or high-severity open issues
☑ Design frozen (no more changes)
☑ Manufacturing process validated
☑ Supplier quality confirmed
☑ Ready for production tooling

### Design Freeze

After DVT, design must be frozen because:
- Production tooling is expensive (hard tools cost $50K-$500K+)
- Changes require re-tooling (time and cost)
- Regulatory certifications based on this design
- Manufacturing processes tuned to this design

**Acceptable changes post-DVT:**
- Minor firmware updates
- Component substitutions (same form/fit/function)
- Process improvements (doesn't change product)

**Changes requiring re-validation:**
- Component spec changes
- Mechanical changes
- Electrical schematic changes
- Firmware functionality changes

---

## PVT: Production Validation Test

### Purpose
Validate that production manufacturing process produces acceptable quality products consistently.

### Key Questions
- Can manufacturing build this at required volume?
- Is the production yield acceptable?
- Do production units meet specifications?
- Are suppliers delivering quality components?
- Is the process capable and stable?

### Sample Characteristics
**Quantity:** 500-2000 units
**Build Method:** Production tooling, production line, actual suppliers
**Quality:** Should be identical to mass production
**Cost:** Near-production cost

### Testing Focus

**Manufacturing Validation:**
- First article inspection (FAI)
- Process capability analysis (Cpk)
- Statistical process control (SPC)
- Yield analysis
- Defect Pareto analysis
- Cycle time validation
- Line balancing

**Product Validation:**
- Sample testing from production line
- Functional testing (automated test fixture)
- Electrical testing (per sampling plan)
- Mechanical inspection (CMM, optical)
- Final system test

**Quality Systems:**
- Incoming quality control (IQC)
- In-process quality control (IPQC)
- Final quality control (FQC)
- Outgoing quality control (OQC)

### Example PVT Tests: Smart Watch

**Manufacturing:**
- Line yield >95%
- Cycle time <2 minutes per unit
- First-pass yield for functional test >98%
- Cpk >1.33 for critical dimensions
- Defect rate <0.5% at final QC

**Sampling Testing:**
(Per ANSI/ASQ Z1.4, AQL 1.0)
- Sample 80 units from first batch of 1000
- Full functional test on samples
- Electrical parameter validation
- Dimensional inspection
- Visual/cosmetic inspection

**Supplier Validation:**
- Incoming inspection of components
- Certificate of conformance from suppliers
- PPAP (Production Part Approval Process) for critical components
- Supplier quality audits

**Final Certification:**
- Submit production units for final FCC/CE testing
- Obtain final certifications based on production samples
- Validate packaging meets drop/compression standards

### PVT Exit Criteria

☑ Manufacturing yield >95%
☑ Process capability demonstrated (Cpk >1.33)
☑ All production units meet specifications
☑ Supplier quality validated
☑ Final certifications obtained
☑ Quality control processes in place
☑ Production line stable and capable
☑ Ready for mass production

### Transitioning to Mass Production

**Pilot Run:**
- Build 5,000-10,000 units
- Monitor yield and quality
- Fine-tune processes
- Validate packaging and logistics

**Ramp Up:**
- Gradual increase to target volume
- Continuous monitoring
- Supplier capacity validation
- Quality metrics tracking

---

## Phase Comparison Table

| Activity | EVT | DVT | PVT | MP |
|----------|-----|-----|-----|-----|
| Core functionality | ✓✓✓ | ✓✓✓ | ✓ | ✓ |
| Full feature set | Partial | ✓✓✓ | ✓✓ | ✓✓ |
| Environmental testing | Basic | ✓✓✓ | Sample | Sample |
| Reliability testing | No | ✓✓✓ | Sample | Monitor |
| Safety/EMC testing | No | ✓✓✓ (pre) | ✓✓✓ (final) | - |
| Manufacturing validation | No | Partial | ✓✓✓ | Ongoing |
| Supplier qualification | No | Started | ✓✓✓ | Monitor |
| Design changes | Expected | Minimal | Avoid | Frozen |
| Sample cost | $$$$$ | $$$$ | $$ | $ |
| Sample quantity | 5-20 | 50-200 | 500-2000 | Full volume |

✓✓✓ = Primary focus, ✓✓ = Important, ✓ = As needed

---

## Real-World Timeline: Consumer IoT Device

**Total Development:** 12-18 months from concept to production

| Phase | Duration | Parallel Activities |
|-------|----------|-------------------|
| Concept/Design | 2-3 months | Industrial design, electrical schematic, firmware architecture |
| EVT | 1 month | Testing, design iterations |
| Design Refinement | 1-2 months | Incorporate EVT learnings, freeze design |
| DVT | 2 months | Comprehensive testing, certification prep |
| Tooling | 2-3 months | Production tooling manufacture (during/after DVT) |
| PVT | 1-2 months | Manufacturing validation |
| Pilot Production | 1 month | Limited production run |
| MP Ramp | Ongoing | Scale to full volume |

**Critical Path:**
Production tooling is usually on critical path. Tooling takes 2-3 months, so it often starts during DVT once design is mostly frozen.

---

## Cost Implications

### Sample Costs (Example Product)

| Phase | Units | Cost/Unit | Total Sample Cost | Tooling Cost |
|-------|-------|-----------|-------------------|--------------|
| EVT | 10 | $5,000 | $50,000 | $10,000 (proto) |
| DVT | 100 | $1,000 | $100,000 | $50,000 (soft) |
| PVT | 1,000 | $100 | $100,000 | $200,000 (hard) |
| MP | 100,000 | $50 | - | - |

### Design Change Costs

**During EVT:** Low
- Change component: $1K (new samples)
- Redesign PCB: $5K (new layout + fab)

**During DVT:** Medium-High
- Change component: $10K (re-test all)
- Redesign PCB: $25K (re-layout, re-fab, re-test)

**During PVT:** Very High
- Change component: $50K (re-tooling, re-cert)
- Redesign PCB: $100K+ (tooling, re-certification, delay)

**After MP:** Extremely High
- May require product recall
- Customer trust damage
- Potential liability

**Lesson:** Find issues early. Cost increases 10x per phase.

---

## Common Mistakes

### Skipping Phases
**Problem:** Jump from EVT to PVT to save time/money
**Result:** Design issues found in production, expensive rework

### Insufficient EVT Testing
**Problem:** Declare success after basic functionality test
**Result:** Fundamental design flaws found in DVT

### Making Changes During PVT
**Problem:** "Just one small change" after design freeze
**Result:** Re-validation delays, potential certification issues

### Inadequate Sample Size
**Problem:** Test 2 DVT units "to save money"
**Result:** Don't catch statistical issues, insufficient data

### Not Freezing Design
**Problem:** Continue tweaking design through PVT
**Result:** Never achieve stable production, quality issues

---

## What Senior Engineers Know

**EVT is for learning, DVT is for validation, PVT is for production.** Don't try to accomplish all goals in one phase.

**The phases overlap in calendar time.** While EVT units are being tested, DVT design work is happening. While DVT is running, production tooling is being quoted.

**You can't skip physics.** Environmental testing takes time. Reliability testing takes time. Accelerated tests help, but some things require real-world duration.

**Good EVT saves money in DVT.** Thorough EVT testing and iteration prevents discovering fundamental issues in DVT when changes are expensive.

**Design freeze is sacred.** After DVT, resist the temptation to "improve" the design. Ship what's validated, improve in next version.

**Manufacturing is part of the product.** A product that can't be manufactured reliably at scale is not a finished design.

---

## Exercise

**Scenario:** You're developing wireless earbuds

For each issue, identify which phase it should be caught in and why:

1. Bluetooth range only 3 meters (spec is 10 meters)
2. Earbud doesn't fit comfortably in ears
3. Manufacturing yield is 60% due to difficult assembly
4. Battery life is 3 hours (target: 5 hours)
5. Charging case lid plastic cracks after 100 open/close cycles
6. FCC emissions exceed limits
7. Earbuds pair inconsistently after firmware update

**Answers:**

1. **EVT** - Core functionality, fundamental design issue
2. **EVT** - Core usability, ergonomics must be validated early
3. **PVT** - Manufacturing process issue, found during production validation
4. **EVT** - Key spec, should be validated early and optimized
5. **DVT** - Reliability/life testing catches this
6. **DVT** - Regulatory pre-testing happens in DVT
7. **Depends** - If in development: DVT. If post-production: Field issue requiring 8D

---

## Next Steps

- Learn about the [Manufacturing Quality Lifecycle](02-manufacturing-quality-lifecycle.md)
- Dive into [Environmental Testing](03-environmental-testing.md)
- Understand [Failure Analysis](07-failure-analysis.md) methods
- Study the [8D and CAPA Process](08-8d-capa-process.md) for handling defects
