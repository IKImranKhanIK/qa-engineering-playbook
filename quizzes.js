// Quiz questions for each module
const quizzes = {
    0: { // Introduction to QA Engineering
        title: "Introduction to QA Engineering Quiz",
        questions: [
            {
                question: "What is the primary difference between QA and Testing?",
                options: [
                    "QA finds bugs, Testing prevents defects",
                    "QA prevents defects, Testing finds bugs",
                    "They are exactly the same",
                    "QA is only for hardware, Testing is for software"
                ],
                correct: 1,
                explanation: "QA (Quality Assurance) focuses on preventing defects through process improvement, while Testing focuses on finding bugs in the product."
            },
            {
                question: "Which of these is NOT a core QA responsibility?",
                options: [
                    "Validation",
                    "Risk Management",
                    "Writing production code",
                    "Process Improvement"
                ],
                correct: 2,
                explanation: "QA engineers focus on testing, validation, and quality processes - not writing production code."
            },
            {
                question: "What percentage reduction in customer-reported defects can mature QE organizations achieve?",
                options: [
                    "10-20%",
                    "30-40%",
                    "60-90%",
                    "100%"
                ],
                correct: 2,
                explanation: "Mature QE organizations can reduce customer-reported defects by 60-90% through proactive quality practices."
            },
            {
                question: "Which skill is NOT typically required for QA engineers?",
                options: [
                    "Programming",
                    "Risk assessment",
                    "Graphic design",
                    "Problem decomposition"
                ],
                correct: 2,
                explanation: "While technical skills like programming and analytical skills are essential, graphic design is not a typical QA requirement."
            },
            {
                question: "What does SDET stand for?",
                options: [
                    "Software Development Engineer in Testing",
                    "System Design and Engineering Test",
                    "Standard Development Engineering Tool",
                    "Software Development Engineering Team"
                ],
                correct: 0,
                explanation: "SDET stands for Software Development Engineer in Testing - a role with stronger coding focus."
            }
        ]
    },
    1: { // QA Foundations
        title: "QA Foundations Quiz",
        questions: [
            {
                question: "What is the difference between Verification and Validation?",
                options: [
                    "Verification: Are we building the right product? Validation: Are we building it right?",
                    "Verification: Are we building it right? Validation: Are we building the right product?",
                    "They mean the same thing",
                    "Verification is for software, Validation is for hardware"
                ],
                correct: 1,
                explanation: "Verification checks if we're building the product right (correct implementation). Validation checks if we're building the right product (meets requirements)."
            },
            {
                question: "In the Test Pyramid, which tests should be most numerous?",
                options: [
                    "E2E (UI) Tests",
                    "Integration Tests",
                    "Unit Tests",
                    "Manual Tests"
                ],
                correct: 2,
                explanation: "Unit tests should form the base/largest portion of the test pyramid as they're fastest and most reliable."
            },
            {
                question: "What does 'Severity' measure in a bug report?",
                options: [
                    "When the bug should be fixed",
                    "The impact of the bug on the system",
                    "How many users are affected",
                    "The cost to fix the bug"
                ],
                correct: 1,
                explanation: "Severity measures the technical impact on the system, while Priority indicates when it should be fixed."
            },
            {
                question: "Which test design technique involves testing with valid and invalid inputs?",
                options: [
                    "Boundary Value Analysis",
                    "Equivalence Partitioning",
                    "Decision Table Testing",
                    "State Transition Testing"
                ],
                correct: 1,
                explanation: "Equivalence Partitioning divides inputs into valid and invalid partitions to reduce test cases."
            },
            {
                question: "What is traceability in QA?",
                options: [
                    "Tracking bugs to developers",
                    "Mapping test cases to requirements",
                    "Following code changes",
                    "Monitoring test execution time"
                ],
                correct: 1,
                explanation: "Traceability ensures every requirement has corresponding test coverage and vice versa."
            }
        ]
    },
    2: { // Software QA
        title: "Software QA Quiz",
        questions: [
            {
                question: "What is the main advantage of API testing over UI testing?",
                options: [
                    "API tests are more user-friendly",
                    "API tests are faster and more stable",
                    "API tests require no programming",
                    "API tests cover visual bugs"
                ],
                correct: 1,
                explanation: "API tests are faster, more stable, and less prone to flakiness compared to UI tests. They test business logic directly without the UI layer."
            },
            {
                question: "In microservices testing, what is contract testing?",
                options: [
                    "Testing legal agreements between teams",
                    "Testing the agreement between service provider and consumer",
                    "Testing service performance contracts",
                    "Testing database constraints"
                ],
                correct: 1,
                explanation: "Contract testing validates that the service provider's API matches what the consumer expects, preventing integration issues."
            },
            {
                question: "What does CI/CD stand for?",
                options: [
                    "Code Integration / Code Deployment",
                    "Continuous Improvement / Continuous Development",
                    "Continuous Integration / Continuous Deployment",
                    "Central Integration / Central Distribution"
                ],
                correct: 2,
                explanation: "CI/CD stands for Continuous Integration and Continuous Deployment/Delivery, automating the software release process."
            },
            {
                question: "What is exploratory testing?",
                options: [
                    "Testing without any planning",
                    "Simultaneous learning, test design, and test execution",
                    "Testing only new features",
                    "Automated testing"
                ],
                correct: 1,
                explanation: "Exploratory testing is an approach where testers simultaneously learn about the application, design tests, and execute them."
            },
            {
                question: "Why is test data management important?",
                options: [
                    "To ensure consistent, realistic test scenarios and avoid production data leaks",
                    "To reduce storage costs",
                    "To make tests run faster",
                    "To avoid writing documentation"
                ],
                correct: 0,
                explanation: "Test data management ensures consistent test environments, realistic scenarios, and prevents sensitive production data from being used in testing."
            }
        ]
    },
    3: { // Test Automation
        title: "Test Automation Quiz",
        questions: [
            {
                question: "What is the automation testing pyramid's key principle?",
                options: [
                    "More UI tests than unit tests",
                    "More unit tests at the base, fewer UI tests at the top",
                    "Equal distribution of all test types",
                    "Only automated UI tests matter"
                ],
                correct: 1,
                explanation: "The test pyramid recommends having many fast unit tests at the base, fewer integration tests in the middle, and minimal UI tests at the top."
            },
            {
                question: "What is the Page Object Model (POM)?",
                options: [
                    "A design pattern that creates object repositories for web UI elements",
                    "A performance optimization model",
                    "A database testing pattern",
                    "A security testing framework"
                ],
                correct: 0,
                explanation: "Page Object Model is a design pattern where each web page is represented as a class, improving test maintainability and reducing code duplication."
            },
            {
                question: "What causes flaky tests?",
                options: [
                    "Test code errors only",
                    "Timing issues, race conditions, and dependencies on external systems",
                    "Incorrect assertions",
                    "Missing test data"
                ],
                correct: 1,
                explanation: "Flaky tests are usually caused by timing issues, race conditions, network dependencies, or non-deterministic behavior."
            },
            {
                question: "When should you NOT automate a test?",
                options: [
                    "When it runs frequently",
                    "When it's stable and unlikely to change",
                    "When it's a one-time test or changes constantly",
                    "When it finds bugs"
                ],
                correct: 2,
                explanation: "Automating tests that are one-time only or change frequently doesn't provide good ROI. Focus automation on stable, repeatable tests."
            },
            {
                question: "What is the purpose of CI/CD integration for test automation?",
                options: [
                    "To make tests run slower",
                    "To provide fast feedback on code changes",
                    "To replace manual testing entirely",
                    "To reduce test coverage"
                ],
                correct: 1,
                explanation: "Integrating tests with CI/CD provides rapid feedback on code quality, catching issues early before they reach production."
            }
        ]
    },
    4: { // Performance & Reliability
        title: "Performance & Reliability Quiz",
        questions: [
            {
                question: "What is the difference between load testing and stress testing?",
                options: [
                    "No difference, they're the same",
                    "Load tests expected load, stress tests beyond capacity to find breaking point",
                    "Load tests hardware, stress tests software",
                    "Stress testing is faster than load testing"
                ],
                correct: 1,
                explanation: "Load testing validates performance under expected conditions, while stress testing pushes the system beyond normal capacity to find its breaking point."
            },
            {
                question: "What does SLO stand for?",
                options: [
                    "System Load Objective",
                    "Service Level Objective",
                    "Security Level Operation",
                    "Standard Logging Output"
                ],
                correct: 1,
                explanation: "SLO stands for Service Level Objective - a target value for a service's reliability measured by SLIs (Service Level Indicators)."
            },
            {
                question: "What is observability in QA context?",
                options: [
                    "Visual testing only",
                    "Ability to understand system internal state from external outputs (logs, metrics, traces)",
                    "Watching tests run",
                    "UI monitoring"
                ],
                correct: 1,
                explanation: "Observability is the ability to understand a system's internal state by examining its outputs: logs, metrics, and distributed traces."
            },
            {
                question: "What is soak testing?",
                options: [
                    "Testing under water",
                    "Testing system stability under sustained load for extended period",
                    "Testing data absorption",
                    "Security penetration testing"
                ],
                correct: 1,
                explanation: "Soak testing (endurance testing) runs the system under normal load for an extended period to detect memory leaks and degradation over time."
            },
            {
                question: "Which metric measures the percentage of time a service is operational?",
                options: [
                    "MTTR (Mean Time To Recovery)",
                    "MTBF (Mean Time Between Failures)",
                    "Uptime/Availability",
                    "Response Time"
                ],
                correct: 2,
                explanation: "Uptime/Availability measures the percentage of time a service is operational and accessible. Common targets are 99.9% or 99.99%."
            }
        ]
    },
    5: { // Security & Privacy
        title: "Security & Privacy Quiz",
        questions: [
            {
                question: "What is the OWASP Top 10?",
                options: [
                    "Top 10 testing tools",
                    "Top 10 most critical web application security risks",
                    "Top 10 QA engineers",
                    "Top 10 programming languages"
                ],
                correct: 1,
                explanation: "OWASP Top 10 is a standard awareness document representing the most critical web application security risks."
            },
            {
                question: "What is SQL injection?",
                options: [
                    "A database optimization technique",
                    "A security vulnerability where malicious SQL code is inserted into queries",
                    "A legitimate SQL command",
                    "A database backup method"
                ],
                correct: 1,
                explanation: "SQL injection is a code injection technique where attackers insert malicious SQL statements into input fields to manipulate or access the database."
            },
            {
                question: "What does GDPR stand for?",
                options: [
                    "General Data Protection Regulation",
                    "Global Database Privacy Rules",
                    "Government Data Processing Requirements",
                    "General Development Practice Regulation"
                ],
                correct: 0,
                explanation: "GDPR stands for General Data Protection Regulation - EU legislation protecting personal data and privacy."
            },
            {
                question: "What is authentication vs authorization?",
                options: [
                    "They are the same thing",
                    "Authentication verifies identity, authorization verifies permissions",
                    "Authorization verifies identity, authentication verifies permissions",
                    "Both verify passwords only"
                ],
                correct: 1,
                explanation: "Authentication verifies who you are (identity), while authorization verifies what you're allowed to do (permissions)."
            },
            {
                question: "What is XSS (Cross-Site Scripting)?",
                options: [
                    "A CSS framework",
                    "A security vulnerability where attackers inject malicious scripts into web pages",
                    "A JavaScript library",
                    "A testing tool"
                ],
                correct: 1,
                explanation: "XSS is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users."
            }
        ]
    },
    6: { // Mobile QA
        title: "Mobile QA Quiz",
        questions: [
            {
                question: "What is the recommended cold start time for mobile apps?",
                options: [
                    "< 5 seconds",
                    "< 2 seconds",
                    "< 1 second",
                    "< 500ms"
                ],
                correct: 1,
                explanation: "Mobile apps should have a cold start time of less than 2 seconds for good user experience."
            },
            {
                question: "Which framework is native to iOS for automation?",
                options: [
                    "Espresso",
                    "XCUITest",
                    "Appium",
                    "Detox"
                ],
                correct: 1,
                explanation: "XCUITest is Apple's native framework for iOS test automation."
            },
            {
                question: "What does IP54 rating indicate?",
                options: [
                    "Dust-tight and water-resistant",
                    "Dust-protected and splash-resistant",
                    "Waterproof and dustproof",
                    "No protection"
                ],
                correct: 1,
                explanation: "IP54 means protected against dust (5) and splashing water (4)."
            },
            {
                question: "What is the target frame rate for smooth mobile animations?",
                options: [
                    "30 FPS",
                    "60 FPS",
                    "120 FPS",
                    "24 FPS"
                ],
                correct: 1,
                explanation: "60 FPS (16.67ms per frame) is the target for smooth mobile UI animations."
            },
            {
                question: "Which OWASP Mobile vulnerability involves storing sensitive data insecurely?",
                options: [
                    "M1: Improper Platform Usage",
                    "M2: Insecure Data Storage",
                    "M3: Insecure Communication",
                    "M4: Insecure Authentication"
                ],
                correct: 1,
                explanation: "M2: Insecure Data Storage addresses improper storage of sensitive information on mobile devices."
            }
        ]
    },
    7: { // Hardware QA
        title: "Hardware QA Quiz",
        questions: [
            {
                question: "What does EVT stand for in hardware development?",
                options: [
                    "Electronic Validation Test",
                    "Engineering Verification Test",
                    "External Verification Tool",
                    "Equipment Validation Tracking"
                ],
                correct: 1,
                explanation: "EVT (Engineering Verification Test) is the first phase of hardware validation, focusing on proving the design works."
            },
            {
                question: "What is the difference between DVT and PVT?",
                options: [
                    "No difference",
                    "DVT validates design, PVT validates production process",
                    "DVT is for software, PVT is for hardware",
                    "PVT comes before DVT"
                ],
                correct: 1,
                explanation: "DVT (Design Verification Test) validates the design is ready for manufacturing. PVT (Production Verification Test) validates the manufacturing process."
            },
            {
                question: "What environmental tests are typically performed on hardware?",
                options: [
                    "Only temperature testing",
                    "Temperature, humidity, vibration, drop, and ingress protection",
                    "Software compatibility only",
                    "Color testing"
                ],
                correct: 1,
                explanation: "Environmental testing includes temperature extremes, humidity, vibration, drop/shock, and ingress protection (dust/water) tests."
            },
            {
                question: "What is the 8D problem-solving process?",
                options: [
                    "A hardware design method",
                    "A structured 8-step approach to root cause analysis and corrective action",
                    "An 8-day testing cycle",
                    "A software debugging technique"
                ],
                correct: 1,
                explanation: "8D is an 8-discipline problem-solving methodology used for identifying, correcting, and eliminating recurring problems."
            },
            {
                question: "What is MTBF in reliability testing?",
                options: [
                    "Maximum Time Before Failure",
                    "Mean Time Between Failures",
                    "Minimum Test Baseline Frequency",
                    "Manufacturing Test Batch Frequency"
                ],
                correct: 1,
                explanation: "MTBF (Mean Time Between Failures) is a reliability metric measuring the average time between system failures."
            }
        ]
    },
    8: { // Systems Integration
        title: "Systems Integration Quiz",
        questions: [
            {
                question: "What is the main challenge in testing IoT systems?",
                options: [
                    "Testing only the mobile app",
                    "Coordinating tests across device, firmware, app, and cloud backend",
                    "Testing is not needed for IoT",
                    "Only hardware testing matters"
                ],
                correct: 1,
                explanation: "IoT systems require coordinated testing across multiple layers: device hardware, firmware, mobile/web apps, and cloud services."
            },
            {
                question: "What is a compatibility matrix?",
                options: [
                    "A mathematical formula",
                    "A grid showing which versions of components work together",
                    "A testing tool",
                    "A hardware specification"
                ],
                correct: 1,
                explanation: "A compatibility matrix documents which versions of different components (firmware, software, hardware) are compatible with each other."
            },
            {
                question: "What is OTA update testing?",
                options: [
                    "Over-The-Air firmware/software update testing",
                    "Optical Testing Analysis",
                    "Operational Test Automation",
                    "Offline Test Application"
                ],
                correct: 0,
                explanation: "OTA (Over-The-Air) testing validates that firmware and software updates can be delivered and installed remotely without issues."
            },
            {
                question: "What is interoperability testing?",
                options: [
                    "Testing internal operations",
                    "Testing how systems work together with other systems/standards",
                    "Testing individual components only",
                    "Performance testing"
                ],
                correct: 1,
                explanation: "Interoperability testing validates that a system can work effectively with other systems, following common standards and protocols."
            },
            {
                question: "Why is field issue analysis important?",
                options: [
                    "To blame customers",
                    "To understand real-world failures and improve product quality",
                    "It's not important",
                    "Only for marketing data"
                ],
                correct: 1,
                explanation: "Field issue analysis helps identify real-world failure patterns that may not appear in lab testing, driving quality improvements."
            }
        ]
    },
    9: { // Release Quality
        title: "Release Quality Quiz",
        questions: [
            {
                question: "What is a Go/No-Go decision?",
                options: [
                    "Deciding which tests to automate",
                    "Decision on whether software is ready for release based on quality criteria",
                    "Choosing team members",
                    "Database migration decision"
                ],
                correct: 1,
                explanation: "Go/No-Go is a decision point where stakeholders determine if the software meets quality criteria for release."
            },
            {
                question: "What factors influence bug priority during triage?",
                options: [
                    "Only severity",
                    "Severity, business impact, customer visibility, and release timeline",
                    "Only customer complaints",
                    "Developer preference"
                ],
                correct: 1,
                explanation: "Bug priority considers severity, business impact, how many/which customers are affected, and release schedules."
            },
            {
                question: "Which metric is most useful for predicting release quality?",
                options: [
                    "Number of lines of code",
                    "Defect density and trend in escape rate",
                    "Number of meetings held",
                    "Team size"
                ],
                correct: 1,
                explanation: "Defect density (defects per unit) and escape rate trends are strong indicators of release quality and testing effectiveness."
            },
            {
                question: "What should post-release monitoring track?",
                options: [
                    "Only crash reports",
                    "Crashes, performance metrics, user feedback, and business metrics",
                    "Developer activity",
                    "Marketing campaigns"
                ],
                correct: 1,
                explanation: "Post-release monitoring should track technical metrics (crashes, performance), user feedback, and business impact metrics."
            },
            {
                question: "What is technical debt in QA context?",
                options: [
                    "Money owed by the QA team",
                    "Shortcuts and deferred quality work that accumulate and slow future development",
                    "Database storage costs",
                    "Cloud computing costs"
                ],
                correct: 1,
                explanation: "Technical debt includes skipped tests, outdated test frameworks, and quality shortcuts that make future changes harder and riskier."
            }
        ]
    },
    10: { // Career & Interviews
        title: "Career & Interviews Quiz",
        questions: [
            {
                question: "What should a QA engineer's resume highlight?",
                options: [
                    "Only manual testing experience",
                    "Testing skills, automation experience, tools, and measurable impact",
                    "Personal hobbies only",
                    "Desired salary"
                ],
                correct: 1,
                explanation: "A strong QA resume showcases technical skills, automation expertise, tools/frameworks used, and quantifiable achievements."
            },
            {
                question: "What is a common QA interview question?",
                options: [
                    "What's your favorite color?",
                    "How would you test a [product]? Explain your test strategy.",
                    "Can you juggle?",
                    "How fast can you type?"
                ],
                correct: 1,
                explanation: "Interviewers commonly ask candidates to design test strategies for real or hypothetical products to assess their thinking process."
            },
            {
                question: "What technical skills are most valuable for career growth?",
                options: [
                    "Only SQL knowledge",
                    "Programming, automation frameworks, CI/CD, and cloud platforms",
                    "Microsoft Excel only",
                    "No technical skills needed"
                ],
                correct: 1,
                explanation: "Modern QA careers benefit from programming skills, test automation, CI/CD knowledge, and familiarity with cloud platforms."
            },
            {
                question: "How do you advance from QA Engineer to Senior QA Engineer?",
                options: [
                    "Just wait for time to pass",
                    "Demonstrate technical leadership, mentoring, and broader system understanding",
                    "Change companies frequently",
                    "Avoid automation"
                ],
                correct: 1,
                explanation: "Advancing requires demonstrating technical expertise, mentoring others, understanding systems broadly, and driving quality improvements."
            },
            {
                question: "What should you do if asked a question you don't know in an interview?",
                options: [
                    "Make up an answer",
                    "Say 'I don't know' honestly, then explain how you would find the answer",
                    "Stay silent",
                    "Leave the interview"
                ],
                correct: 1,
                explanation: "Honesty is valued. Admit when you don't know something, then demonstrate your problem-solving approach to learn it."
            }
        ]
    }
};

// Quiz state management
let quizProgress = JSON.parse(localStorage.getItem('qaPlaybookQuizProgress') || '{}');

function saveQuizProgress(moduleId, score, total) {
    quizProgress[moduleId] = {
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString()
    };
    localStorage.setItem('qaPlaybookQuizProgress', JSON.stringify(quizProgress));
}

function getQuizProgress(moduleId) {
    return quizProgress[moduleId] || null;
}
