# QA vs QC vs QE

## Overview

Quality Assurance (QA), Quality Control (QC), and Quality Engineering (QE) are distinct but related disciplines. Understanding the differences is essential for effective communication and role clarity.

## Definitions

### Quality Assurance (QA)
Process-oriented approach focusing on preventing defects through process improvement and standards.

**Focus:** Are we building the product correctly?

**Activities:**
- Establishing quality standards
- Process audits
- Training and documentation
- Best practices definition
- Compliance verification

**Example:**
Implementing code review processes, defining coding standards, establishing test automation guidelines.

### Quality Control (QC)
Product-oriented approach focusing on detecting defects in the finished product.

**Focus:** Did we build the product correctly?

**Activities:**
- Testing and inspection
- Defect identification
- Product measurements
- Acceptance criteria validation
- Test execution

**Example:**
Running test suites against a build, inspecting hardware for defects, validating requirements are met.

### Quality Engineering (QE)
Engineering-oriented approach focusing on building quality into the product throughout the lifecycle.

**Focus:** How do we ensure quality at every step?

**Activities:**
- Testability design
- Test automation architecture
- Quality metrics and analytics
- Continuous improvement
- Cross-functional collaboration

**Example:**
Designing APIs with testability in mind, building observability into systems, creating automated quality gates in CI/CD.

## Comparison Matrix

| Aspect | QA | QC | QE |
|--------|----|----|-----|
| **Orientation** | Process | Product | Engineering |
| **Approach** | Preventive | Detective | Proactive |
| **Responsibility** | Everyone | QC team | Engineering teams |
| **When** | Throughout lifecycle | During/after development | Throughout lifecycle |
| **Output** | Standards, processes | Defect reports, metrics | Systems, automation, insights |
| **Goal** | Prevent defects | Find defects | Build quality in |
| **Mindset** | Compliance | Inspection | Innovation |

## Real-World Scenario

Consider building a payment processing feature:

### QA Perspective
- Define code review checklist for payment code
- Establish security testing requirements
- Create deployment process standards
- Document test coverage requirements

### QC Perspective
- Execute functional tests on payment flow
- Verify transaction amounts are correct
- Test error handling scenarios
- Validate against acceptance criteria

### QE Perspective
- Design payment API for testability (idempotency, test modes)
- Build automated test suite for payment scenarios
- Create monitoring and alerting for payment failures
- Analyze historical defect patterns to prevent recurrence

## Historical Context

### Traditional Model (Pre-2000s)
QA and QC were separate:
- QA: Process team, often separate from development
- QC: Test team, worked after development

This created silos and "throw it over the wall" mentality.

### Modern Model (2010s+)
QE integrates quality throughout:
- Developers own quality
- QE enables and accelerates
- Automation enables continuous testing
- Quality is everyone's responsibility

## Why This Matters

### Communication
Using the correct term shows you understand your role:
- "We need better QA" might mean processes
- "We need better QC" might mean more testing
- "We need better QE" might mean building quality in

### Job Descriptions
Companies use these terms differently:
- "QA Engineer" at one company might be pure testing
- "QA Engineer" at another might be SDET-level automation
- "QE" explicitly signals engineering focus

### Career Focus
Understanding these distinctions helps you:
- Target the right roles
- Develop appropriate skills
- Set correct expectations

## Common Misconceptions

### "QA just tests"
Reality: QA includes process improvement, standards, and prevention. Testing is only one aspect.

### "QC and testing are the same"
Reality: Testing is a QC activity, but QC also includes inspections, measurements, and validation.

### "QE replaces QA/QC"
Reality: QE incorporates elements of both but adds engineering rigor and automation.

### "Only the QA team is responsible for quality"
Reality: In modern organizations, quality is a shared responsibility. QA/QC/QE enables and guides, but everyone contributes.

## Industry Usage

### Software Companies
Increasingly use "QE" or "SDET" to emphasize engineering.

**Example titles:**
- Software Quality Engineer
- QE Engineer
- SDET (Software Development Engineer in Test)

### Manufacturing/Hardware
Still commonly use "QA" and "QC" distinctly.

**Example titles:**
- QA Engineer (process focus)
- QC Inspector (product focus)
- Quality Engineer (both)

### Consulting/Compliance
Heavy "QA" usage due to audit and process focus.

**Example titles:**
- QA Analyst
- Quality Assurance Specialist
- Compliance QA Engineer

## Practical Application

### What Should You Call Yourself?

**Call yourself "QA Engineer" if:**
- You do manual and automated testing
- You work on process improvement
- You're in a traditional organization

**Call yourself "QE" or "SDET" if:**
- You write code daily
- You build test infrastructure
- You're in a modern tech company

**Call yourself "QC" if:**
- You primarily execute tests
- You inspect products
- You're in manufacturing/hardware

### What Should Your Team Be Called?

Match your organizational culture and expectations. If you're building automation and influencing architecture, "Quality Engineering" signals that. If you're focused on test execution, "QA" or "QC" is fine.

## What Senior Engineers Know

**Titles are inconsistent across companies.** A "QA Engineer" at Google is vastly different from a "QA Engineer" at a small consultancy. Focus on responsibilities, not titles.

**The distinction matters for career positioning.** If you want a high-paying SDET role, emphasize "engineering" in your work and framing.

**Quality is everyone's job, but someone must lead it.** Regardless of what you call the role, someone needs to own quality strategy, enable testing, and drive improvements.

**The best organizations blur these lines.** Rigid separation between QA/QC/QE creates silos. The best teams integrate all three perspectives.

## Exercise

For each scenario, identify whether it's primarily QA, QC, or QE:

1. Running automated regression tests in CI/CD
2. Establishing a new code review process
3. Manually testing a new feature before release
4. Designing an API to support test data injection
5. Auditing adherence to security testing standards
6. Building a custom test framework for microservices
7. Inspecting manufactured circuit boards for solder defects
8. Creating a dashboard to track quality metrics over time

**Answers:**
1. QC (product testing)
2. QA (process improvement)
3. QC (product testing)
4. QE (engineering for testability)
5. QA (process audit)
6. QE (engineering test infrastructure)
7. QC (product inspection)
8. QE (engineering analytics)

Note: Some scenarios blend categories. The distinction isn't always clear-cut.

## Next Steps

- Understand [Verification vs Validation](02-verification-vs-validation.md)
- Learn about [Test Levels and Pyramids](03-test-levels-and-pyramids.md)
