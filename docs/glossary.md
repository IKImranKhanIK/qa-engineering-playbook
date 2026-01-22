# QA Engineering Glossary

Comprehensive reference of quality engineering terms, acronyms, and concepts.

---

## A

**Acceptance Criteria**
Conditions that a feature must meet to be accepted by stakeholders or end users.

**Acceptance Testing**
Formal testing to determine whether a system satisfies acceptance criteria. Also known as User Acceptance Testing (UAT).

**Actual Result**
The actual behavior or outcome observed during test execution.

**Ad-Hoc Testing**
Informal testing without preparation, documentation, or expected results. Often used to find defects quickly.

**Agile Testing**
Testing approach integrated into Agile development methodology, emphasizing collaboration, continuous feedback, and incremental testing.

**API (Application Programming Interface)**
Interface that allows software components to communicate. Common types: REST, GraphQL, SOAP, gRPC.

**AQL (Acceptable Quality Limit)**
Maximum number of defects acceptable in a sample during inspection.

**Assertion**
Statement in automated tests that validates expected vs actual results. Tests fail if assertion is false.

**Automated Testing**
Execution of tests using automation tools without manual intervention.

---

## B

**Black-Box Testing**
Testing without knowledge of internal code structure. Focus on inputs and outputs.

**Blocker**
Critical defect that prevents testing or blocks entire functionality.

**Boundary Value Analysis (BVA)**
Test design technique testing values at boundaries of input domains.

**Bug**
Defect, error, or flaw causing incorrect or unexpected results. Also called defect or issue.

**Bug Life Cycle**
Stages a bug goes through: New → Assigned → Fixed → Verified → Closed.

**Build**
Compiled version of software ready for testing.

**Burn-In Testing**
Running system under high load for extended period to identify early failures.

---

## C

**CAPA (Corrective and Preventive Action)**
Process to eliminate root causes of defects and prevent recurrence.

**CI/CD (Continuous Integration/Continuous Deployment)**
Practice of automatically building, testing, and deploying code changes.

**Code Coverage**
Percentage of code executed during testing. Types: Line, Branch, Statement, Function coverage.

**Compatibility Testing**
Verifying software works across different environments, browsers, devices, or OS versions.

**Concurrency Testing**
Testing system behavior when multiple users/processes access simultaneously.

**Contract Testing**
Validating that service providers and consumers agree on API contracts.

**Cpk (Process Capability Index)**
Statistical measure of manufacturing process capability. Target: Cpk > 1.33.

**Critical Bug**
Severity level indicating system crash, data loss, or security breach.

---

## D

**Data-Driven Testing**
Test approach using external data sources (CSV, DB, Excel) to drive test inputs.

**Defect**
Deviation from expected behavior. Also called bug, issue, or fault.

**Defect Density**
Number of defects per lines of code or function points.

**Defect Leakage**
Defects found in production that should have been caught in testing.

**DVT (Design Validation Test)**
Hardware validation phase verifying complete design meets requirements. Follows EVT, precedes PVT.

---

## E

**E2E Testing (End-to-End)**
Testing complete workflows from start to finish, simulating real user scenarios.

**EMC (Electromagnetic Compatibility)**
Device's ability to function properly in electromagnetic environment without causing interference.

**Entry Criteria**
Conditions that must be met before testing can begin.

**Equivalence Partitioning**
Test design technique dividing inputs into equivalent classes, testing one value per class.

**Error**
Human action producing incorrect result. Leads to faults in code.

**EVT (Engineering Validation Test)**
First hardware validation phase proving concept works and validating component selection.

**Exit Criteria**
Conditions that must be met before testing can be considered complete.

**Expected Result**
Predicted outcome of test execution based on requirements.

**Exploratory Testing**
Simultaneous test design and execution, guided by tester's knowledge and intuition.

---

## F

**Fail Fast**
Principle of stopping execution immediately upon detecting error.

**Failure**
Inability of system to perform required function within specified limits.

**Failure Mode**
Way in which something might fail. Used in FMEA analysis.

**False Negative**
Test incorrectly indicates no defect when defect exists.

**False Positive**
Test incorrectly indicates defect when system is correct.

**Fault**
Incorrect step, process, or data definition in code. Results from error.

**FCC (Federal Communications Commission)**
US agency regulating electromagnetic emissions. Devices must pass FCC certification.

**Flaky Test**
Test that passes and fails intermittently without code changes. Often due to timing, state, or environmental issues.

**FMEA (Failure Mode and Effects Analysis)**
Systematic method for identifying potential failures and their impacts.

**Functional Testing**
Verifying system performs its specified functions correctly.

---

## G

**Globalization Testing**
Verifying software works for users worldwide, including localization and internationalization.

**Go/No-Go Decision**
Decision point determining whether to proceed with release based on quality criteria.

**Gray-Box Testing**
Testing with partial knowledge of internal structure. Combines black-box and white-box.

**GraphQL**
Query language for APIs allowing clients to request exactly the data needed.

---

## H

**HALT (Highly Accelerated Life Test)**
Stress testing to identify design weaknesses by applying extreme conditions.

**Happy Path**
Test scenario following expected flow without errors or exceptions.

**Hardware QA**
Quality validation of physical products through EVT/DVT/PVT phases.

**Heuristic**
Experience-based technique for problem solving, learning, or discovery.

---

## I

**Impact Analysis**
Assessing potential consequences of changes to determine testing scope.

**Integration Testing**
Testing interactions between integrated components or systems.

**IoT (Internet of Things)**
Network of physical devices connected and exchanging data.

**ISTQB (International Software Testing Qualifications Board)**
Organization providing software testing certifications.

---

## J

**Jenkins**
Popular open-source automation server for CI/CD.

**Jira**
Issue tracking and project management tool commonly used for bug tracking.

**JUnit**
Unit testing framework for Java. Similar frameworks: pytest (Python), Jest (JavaScript).

---

## K

**Keyword-Driven Testing**
Test automation approach using keywords to represent actions.

---

## L

**Load Testing**
Testing system behavior under expected load conditions.

**Localization Testing (L10N)**
Verifying software adaptation for specific region/language.

---

## M

**Manual Testing**
Testing performed by humans without automation tools.

**Mean Time Between Failures (MTBF)**
Average time between system failures. Higher is better.

**Microservices**
Architectural style structuring application as collection of loosely coupled services.

**Mock**
Simulated object mimicking real object behavior for testing. Used to isolate component under test.

**Monkey Testing**
Random testing without specific test cases, simulating unpredictable user behavior.

**MTTR (Mean Time To Repair)**
Average time required to repair failed system.

---

## N

**Negative Testing**
Testing with invalid inputs to verify system handles errors gracefully.

**Non-Functional Testing**
Testing quality attributes: performance, security, usability, reliability.

---

## O

**OTA (Over-The-Air)**
Wireless distribution of firmware/software updates.

**OWASP (Open Web Application Security Project)**
Organization focused on web application security. Famous for OWASP Top 10 vulnerabilities.

---

## P

**Pairwise Testing**
Combinatorial testing technique ensuring all pairs of parameters are covered.

**Pass Rate**
Percentage of test cases that pass. Pass Rate = (Passed / Total) × 100%.

**Penetration Testing**
Authorized simulated attack on system to identify security vulnerabilities.

**Performance Testing**
Testing system responsiveness, throughput, and stability under workload.

**Positive Testing**
Testing with valid inputs to verify expected functionality.

**Postman**
Popular tool for API development and testing.

**PVT (Production Validation Test)**
Final hardware validation phase verifying manufacturing process produces quality products.

**Pytest**
Testing framework for Python.

---

## Q

**QA (Quality Assurance)**
Process-oriented approach preventing defects through process improvement.

**QC (Quality Control)**
Product-oriented approach detecting defects through inspection.

**QE (Quality Engineering)**
Engineering-oriented approach building quality throughout product lifecycle.

---

## R

**Regression Testing**
Re-testing to ensure changes haven't broken existing functionality.

**Release Candidate**
Version potentially ready for production release, pending final validation.

**Requirements Traceability Matrix (RTM)**
Document linking requirements to test cases showing coverage.

**REST (Representational State Transfer)**
Architectural style for designing networked applications. RESTful APIs use HTTP methods.

**Risk-Based Testing**
Prioritizing testing based on probability and impact of failures.

**Root Cause Analysis**
Process of identifying fundamental cause of defect. Methods: 5 Whys, Fishbone Diagram.

---

## S

**Sanity Testing**
Quick, narrow testing verifying specific functionality works after changes.

**SDET (Software Development Engineer in Test)**
Engineer focused on building test frameworks and automation infrastructure.

**Selenium**
Popular framework for automating web browser testing.

**Severity**
Technical impact of defect. Levels: Critical, High, Medium, Low.

**Shift-Left Testing**
Moving testing earlier in development cycle.

**Smoke Testing**
Preliminary testing verifying critical functions work before detailed testing.

**SOAP (Simple Object Access Protocol)**
XML-based protocol for exchanging structured information.

**Soak Testing**
Running system under load for extended period to identify memory leaks and performance degradation.

**SPC (Statistical Process Control)**
Using statistical methods to monitor and control manufacturing processes.

**Spike Testing**
Testing system response to sudden, extreme load increases.

**Sprint**
Time-boxed iteration in Agile development (typically 1-4 weeks).

**SQL Injection**
Security vulnerability where attacker injects malicious SQL code.

**Stakeholder**
Person with interest or concern in project outcome.

**State Transition Testing**
Test design technique based on system states and transitions between them.

**Static Testing**
Testing without executing code. Includes reviews, inspections, walkthroughs.

**Stress Testing**
Testing system behavior under extreme conditions beyond normal capacity.

**Stub**
Minimal implementation of interface used during testing as placeholder.

**System Testing**
Testing complete integrated system against requirements.

---

## T

**TDD (Test-Driven Development)**
Development approach writing tests before code.

**Test Automation Framework**
Set of guidelines, tools, and practices for automated testing.

**Test Case**
Specific conditions, steps, and expected results for testing particular aspect.

**Test Coverage**
Degree to which testing exercises system. Types: requirement, code, functional coverage.

**Test Data**
Data used as input for tests.

**Test Environment**
Hardware, software, and network configuration where testing is performed.

**Test Harness**
Collection of software and test data configured for testing system in specific environment.

**Test Plan**
Document describing scope, approach, resources, and schedule for testing.

**Test Suite**
Collection of test cases grouped for execution.

**Testability**
Degree to which system supports testing. Good testability enables easier, more effective testing.

**Traceability**
Ability to link requirements through design, code, and tests.

---

## U

**UAT (User Acceptance Testing)**
Final testing phase where actual users validate system meets needs.

**UI (User Interface)**
Visual elements users interact with.

**Unit Testing**
Testing individual components in isolation.

**UX (User Experience)**
Overall experience user has with product.

---

## V

**Validation**
Confirming product meets user needs. "Are we building the right product?"

**Verification**
Confirming product meets specifications. "Are we building the product right?"

**Version Control**
System tracking changes to code over time. Examples: Git, SVN.

---

## W

**Waterfall**
Sequential development methodology with distinct phases.

**White-Box Testing**
Testing with knowledge of internal code structure. Also called structural testing.

**WSDL (Web Services Description Language)**
XML format describing SOAP web services.

---

## X

**XSS (Cross-Site Scripting)**
Security vulnerability where attacker injects malicious scripts into web pages.

**XPath**
Query language for selecting elements in XML documents. Used in Selenium for web element location.

---

## Z

**Zero-Day**
Vulnerability unknown to vendor, with no patch available.

---

## Numbers

**2FA (Two-Factor Authentication)**
Security process requiring two authentication methods.

**4xx Errors**
HTTP status codes indicating client errors (400-499).

**5xx Errors**
HTTP status codes indicating server errors (500-599).

**8D**
Eight Disciplines problem-solving methodology for root cause analysis.

**95th Percentile (p95)**
Value below which 95% of observations fall. Common performance metric.

**99th Percentile (p99)**
Value below which 99% of observations fall. Used for measuring worst-case performance.

---

## Acronyms Quick Reference

- **API**: Application Programming Interface
- **CI/CD**: Continuous Integration/Continuous Deployment
- **DVT**: Design Validation Test
- **E2E**: End-to-End
- **EVT**: Engineering Validation Test
- **FMEA**: Failure Mode and Effects Analysis
- **HTTP**: Hypertext Transfer Protocol
- **JSON**: JavaScript Object Notation
- **PVT**: Production Validation Test
- **QA**: Quality Assurance
- **QC**: Quality Control
- **QE**: Quality Engineering
- **REST**: Representational State Transfer
- **RTM**: Requirements Traceability Matrix
- **SDET**: Software Development Engineer in Test
- **SOAP**: Simple Object Access Protocol
- **SQL**: Structured Query Language
- **TDD**: Test-Driven Development
- **UAT**: User Acceptance Testing
- **UI**: User Interface
- **URL**: Uniform Resource Locator
- **UX**: User Experience
- **XML**: Extensible Markup Language

---

**Note:** This glossary is continuously updated. For term suggestions or corrections, please contribute to the repository.
