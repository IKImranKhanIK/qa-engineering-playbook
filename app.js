// Data structure for modules
// Version: 2.1 - Fixed table parsing and enhanced visuals
const modules = [
    {
        id: 0,
        title: "Introduction to QA Engineering",
        description: "Learn what QA engineering is, career paths, and how to use this playbook effectively.",
        lessons: 4,
        duration: "2-3 hours",
        tags: ["Beginner", "Career", "Overview"],
        lessons_list: [
            { title: "What is QA Engineering", file: "docs/00-introduction/01-what-is-qa-engineering.md" },
            { title: "Software vs Hardware vs Systems QA", file: "docs/00-introduction/02-software-hardware-systems-qa.md" },
            { title: "QA Career Paths", file: "docs/00-introduction/03-qa-career-paths.md" },
            { title: "How to Use This Playbook", file: "docs/00-introduction/04-how-to-use-this-playbook.md" }
        ]
    },
    {
        id: 1,
        title: "QA Foundations",
        description: "Core principles and concepts that underpin all quality engineering work.",
        lessons: 7,
        duration: "8-10 hours",
        tags: ["Fundamentals", "Theory", "Essential"],
        lessons_list: [
            { title: "QA vs QC vs QE", file: "docs/01-qa-foundations/01-qa-vs-qc-vs-qe.md" },
            { title: "Verification vs Validation", file: "docs/01-qa-foundations/02-verification-vs-validation.md" },
            { title: "Test Levels and Test Pyramids", file: "docs/01-qa-foundations/03-test-levels-and-pyramids.md" },
            { title: "Risk-Based Testing", file: "docs/01-qa-foundations/04-risk-based-testing.md" },
            { title: "Test Design Techniques", file: "docs/01-qa-foundations/05-test-design-techniques.md" },
            { title: "Severity vs Priority", file: "docs/01-qa-foundations/06-severity-vs-priority.md" },
            { title: "Traceability and Requirements Coverage", file: "docs/01-qa-foundations/07-traceability-requirements-coverage.md" }
        ]
    },
    {
        id: 2,
        title: "Software QA",
        description: "Comprehensive guide to testing web, mobile, API, and database applications.",
        lessons: 8,
        duration: "12-15 hours",
        tags: ["Software", "API", "Database"],
        lessons_list: [
            { title: "Web Testing Strategies", file: "docs/02-software-qa/01-web-testing-strategies.md" },
            { title: "API Testing", file: "docs/02-software-qa/02-api-testing.md" },
            { title: "Database Testing", file: "docs/02-software-qa/03-database-testing.md" },
            { title: "Microservices Testing", file: "docs/02-software-qa/04-microservices-testing.md" },
            { title: "CI/CD Quality Gates", file: "docs/02-software-qa/05-cicd-quality-gates.md" },
            { title: "Exploratory Testing", file: "docs/02-software-qa/06-exploratory-testing.md" },
            { title: "Regression Strategy", file: "docs/02-software-qa/07-regression-strategy.md" },
            { title: "Test Data Management", file: "docs/02-software-qa/08-test-data-management.md" }
        ]
    },
    {
        id: 3,
        title: "Test Automation",
        description: "Build scalable test automation frameworks and integrate with CI/CD pipelines.",
        lessons: 8,
        duration: "15-20 hours",
        tags: ["Automation", "SDET", "Frameworks"],
        lessons_list: [
            { title: "Automation Strategy", file: "docs/03-test-automation/01-automation-strategy.md" },
            { title: "UI Automation Principles", file: "docs/03-test-automation/02-ui-automation-principles.md" },
            { title: "API Automation Architecture", file: "docs/03-test-automation/03-api-automation-architecture.md" },
            { title: "Framework Design Patterns", file: "docs/03-test-automation/04-framework-design-patterns.md" },
            { title: "Page Object Model", file: "docs/03-test-automation/05-page-object-model.md" },
            { title: "Flaky Test Prevention", file: "docs/03-test-automation/07-flaky-test-prevention.md" },
            { title: "CI/CD Integration", file: "docs/03-test-automation/08-cicd-integration.md" },
            { title: "Reporting & Analytics", file: "docs/03-test-automation/09-reporting-analytics.md" }
        ]
    },
    {
        id: 4,
        title: "Performance & Reliability",
        description: "Master load testing, observability, and reliability engineering for QA.",
        lessons: 7,
        duration: "10-12 hours",
        tags: ["Performance", "SRE", "Observability"],
        lessons_list: [
            { title: "Load, Stress, and Soak Testing", file: "docs/04-performance-reliability/01-load-stress-soak-testing.md" },
            { title: "Observability for QA", file: "docs/04-performance-reliability/02-observability-for-qa.md" },
            { title: "SLO / SLA Validation", file: "docs/04-performance-reliability/03-slo-sla-validation.md" },
            { title: "Incident Learning", file: "docs/04-performance-reliability/04-incident-learning.md" },
            { title: "Reliability Metrics", file: "docs/04-performance-reliability/05-reliability-metrics.md" },
            { title: "Capacity Planning", file: "docs/04-performance-reliability/06-capacity-planning.md" },
            { title: "Performance Bottleneck Analysis", file: "docs/04-performance-reliability/07-performance-bottleneck-analysis.md" }
        ]
    },
    {
        id: 5,
        title: "Security & Privacy",
        description: "QA's role in security testing, OWASP validation, and privacy compliance.",
        lessons: 6,
        duration: "8-10 hours",
        tags: ["Security", "Privacy", "Compliance"],
        lessons_list: [
            { title: "QA's Role in Security", file: "docs/05-security-privacy/01-qa-role-in-security.md" },
            { title: "OWASP Top 10 Testing", file: "docs/05-security-privacy/02-owasp-top-10-testing.md" },
            { title: "Authentication & Authorization Testing", file: "docs/05-security-privacy/03-authentication-authorization-testing.md" },
            { title: "Privacy Test Cases (GDPR)", file: "docs/05-security-privacy/04-privacy-test-cases-gdpr.md" },
            { title: "Security Automation", file: "docs/05-security-privacy/05-security-automation.md" },
            { title: "Penetration Testing Basics", file: "docs/05-security-privacy/06-penetration-testing-basics.md" }
        ]
    },
    {
        id: 6,
        title: "Mobile QA",
        description: "iOS and Android testing strategies, device fragmentation, and app store readiness.",
        lessons: 7,
        duration: "10-12 hours",
        tags: ["Mobile", "iOS", "Android"],
        lessons_list: [
            { title: "iOS / Android Test Strategies", file: "docs/06-mobile-qa/01-ios-android-strategies.md" },
            { title: "Device Fragmentation", file: "docs/06-mobile-qa/02-device-fragmentation.md" },
            { title: "App Store Readiness", file: "docs/06-mobile-qa/03-app-store-readiness.md" },
            { title: "Network & Offline Testing", file: "docs/06-mobile-qa/04-network-offline-testing.md" },
            { title: "Mobile Automation", file: "docs/06-mobile-qa/05-mobile-automation.md" },
            { title: "Performance on Mobile", file: "docs/06-mobile-qa/06-performance-mobile.md" },
            { title: "Mobile Security Testing", file: "docs/06-mobile-qa/07-mobile-security.md" }
        ]
    },
    {
        id: 7,
        title: "Hardware QA",
        description: "EVT/DVT/PVT validation, environmental testing, and manufacturing quality.",
        lessons: 9,
        duration: "12-15 hours",
        tags: ["Hardware", "EVT/DVT/PVT", "Manufacturing"],
        lessons_list: [
            { title: "EVT/DVT/PVT Explained", file: "docs/07-hardware-qa/01-evt-dvt-pvt-explained.md" },
            { title: "Manufacturing Quality Lifecycle", file: "docs/07-hardware-qa/02-manufacturing-quality-lifecycle.md" },
            { title: "Environmental Testing", file: "docs/07-hardware-qa/03-environmental-testing.md" },
            { title: "Power & Battery Testing", file: "docs/07-hardware-qa/04-power-battery-testing.md" },
            { title: "Firmware Validation", file: "docs/07-hardware-qa/05-firmware-validation.md" },
            { title: "Supplier Quality Management", file: "docs/07-hardware-qa/06-supplier-quality.md" },
            { title: "Failure Analysis", file: "docs/07-hardware-qa/07-failure-analysis.md" },
            { title: "8D CAPA Process", file: "docs/07-hardware-qa/08-8d-capa-process.md" },
            { title: "Measurement & Uncertainty", file: "docs/07-hardware-qa/09-measurement-uncertainty.md" }
        ]
    },
    {
        id: 8,
        title: "Systems Integration",
        description: "Testing complex systems where hardware, firmware, software, and cloud converge.",
        lessons: 7,
        duration: "10-12 hours",
        tags: ["Systems", "Integration", "IoT"],
        lessons_list: [
            { title: "Device + App + Backend Testing", file: "docs/08-systems-integration/01-device-app-backend-testing.md" },
            { title: "Compatibility Matrices", file: "docs/08-systems-integration/02-compatibility-matrices.md" },
            { title: "Firmware ↔ Software Versioning", file: "docs/08-systems-integration/03-firmware-software-versioning.md" },
            { title: "Interoperability Testing", file: "docs/08-systems-integration/04-interoperability-testing.md" },
            { title: "Field Issue Analysis", file: "docs/08-systems-integration/05-field-issue-analysis.md" },
            { title: "OTA Update Testing", file: "docs/08-systems-integration/06-ota-update-testing.md" },
            { title: "End-to-End System Validation", file: "docs/08-systems-integration/07-end-to-end-system-validation.md" }
        ]
    },
    {
        id: 9,
        title: "Release Quality",
        description: "Go/No-Go decisions, bug triage, release readiness, and quality metrics.",
        lessons: 6,
        duration: "8-10 hours",
        tags: ["Release", "Metrics", "Management"],
        lessons_list: [
            { title: "Go / No-Go Criteria", file: "docs/09-release-quality/01-go-no-go-criteria.md" },
            { title: "Bug Triage Process", file: "docs/09-release-quality/02-bug-triage-process.md" },
            { title: "Release Readiness Reviews", file: "docs/09-release-quality/03-release-readiness-reviews.md" },
            { title: "Quality Metrics That Matter", file: "docs/09-release-quality/04-quality-metrics-that-matter.md" },
            { title: "Defect Prediction", file: "docs/09-release-quality/05-defect-prediction.md" },
            { title: "Post-Release Monitoring", file: "docs/09-release-quality/06-post-release-monitoring.md" }
        ]
    },
    {
        id: 10,
        title: "Career & Interviews",
        description: "Interview preparation, resume tips, and career advancement strategies.",
        lessons: 5,
        duration: "6-8 hours",
        tags: ["Career", "Interview", "Growth"],
        lessons_list: [
            { title: "Interview Preparation", file: "docs/10-career-interviews/01-interview-preparation.md" },
            { title: "Common QA Interview Questions", file: "docs/10-career-interviews/02-common-interview-questions.md" },
            { title: "Technical Assessments", file: "docs/10-career-interviews/03-technical-assessments.md" },
            { title: "Resume & Portfolio", file: "docs/10-career-interviews/04-resume-portfolio.md" },
            { title: "Career Advancement", file: "docs/10-career-interviews/05-career-advancement.md" }
        ]
    }
];

// Templates data
const templates = [
    {
        title: "Test Plan",
        description: "Comprehensive test plan template with all sections",
        icon: "📋",
        file: "templates/test-plan.md"
    },
    {
        title: "Test Case",
        description: "Detailed test case template with multiple formats",
        icon: "✅",
        file: "templates/test-case.md"
    },
    {
        title: "Bug Report",
        description: "Production-ready bug report template",
        icon: "🐛",
        file: "templates/bug-report.md"
    },
    {
        title: "Risk Assessment",
        description: "Risk assessment matrix and analysis template",
        icon: "⚠️",
        file: "templates/risk-assessment.md"
    },
    {
        title: "Traceability Matrix",
        description: "Requirements traceability matrix template",
        icon: "🔗",
        file: "templates/traceability-matrix.md"
    },
    {
        title: "Release Readiness",
        description: "Go/No-Go release readiness review template",
        icon: "🚀",
        file: "templates/release-readiness.md"
    },
    {
        title: "Hardware Validation Plan",
        description: "EVT/DVT/PVT validation plan template",
        icon: "🔧",
        file: "templates/hardware-validation-plan.md"
    },
    {
        title: "8D Root Cause Analysis",
        description: "8D methodology for root cause analysis and CAPA",
        icon: "🔍",
        file: "templates/8d-root-cause-analysis.md"
    }
];

// Labs data
const labs = [
    {
        title: "Web Application Testing",
        description: "Test a sample e-commerce application for functional bugs",
        difficulty: "beginner",
        duration: "2 hours",
        category: "software"
    },
    {
        title: "API Test Automation",
        description: "Build automated tests for a REST API using Postman/Newman",
        difficulty: "intermediate",
        duration: "3 hours",
        category: "automation"
    },
    {
        title: "Performance Testing Lab",
        description: "Load test a web application and analyze bottlenecks",
        difficulty: "intermediate",
        duration: "4 hours",
        category: "software"
    },
    {
        title: "Security Testing Exercise",
        description: "Test for OWASP Top 10 vulnerabilities in a vulnerable app",
        difficulty: "advanced",
        duration: "4 hours",
        category: "software"
    },
    {
        title: "Mobile Testing Scenarios",
        description: "Test mobile app across different devices and OS versions",
        difficulty: "intermediate",
        duration: "3 hours",
        category: "software"
    },
    {
        title: "Hardware Validation Exercise",
        description: "Paper-based EVT validation exercise for a smart device",
        difficulty: "intermediate",
        duration: "2 hours",
        category: "hardware"
    },
    {
        title: "Environmental Testing Planning",
        description: "Design environmental test plan for consumer electronics",
        difficulty: "advanced",
        duration: "3 hours",
        category: "hardware"
    },
    {
        title: "Root Cause Analysis (8D)",
        description: "Conduct 8D analysis on a sample hardware failure",
        difficulty: "intermediate",
        duration: "2 hours",
        category: "hardware"
    },
    {
        title: "System Integration Testing",
        description: "Test IoT device integration with mobile app and cloud",
        difficulty: "advanced",
        duration: "4 hours",
        category: "systems"
    },
    {
        title: "CI/CD Pipeline Integration",
        description: "Add automated tests to a CI/CD pipeline",
        difficulty: "intermediate",
        duration: "3 hours",
        category: "automation"
    }
];

// Initialize progress from localStorage
let progress = JSON.parse(localStorage.getItem('qaPlaybookProgress')) || {
    modules: {},
    lessons: {},
    labs: {}
};

// Load modules on page load
document.addEventListener('DOMContentLoaded', () => {
    loadModules();
    loadTemplates();
    loadLabs();
    setupNavigation();
    setupSearch();
    setupModal();
    setupThemeToggle();
    updateProgressDisplay();
});

function loadModules() {
    const grid = document.getElementById('modulesGrid');
    modules.forEach((module, index) => {
        const completed = progress.modules[module.id] || 0;
        const progressPercent = (completed / module.lessons) * 100;

        const card = document.createElement('div');
        card.className = 'module-card';
        card.onclick = () => showModule(module);

        card.innerHTML = `
            <div class="module-header">
                <div class="module-number">${index.toString().padStart(2, '0')}</div>
                <div class="module-info">
                    <h3>${module.title}</h3>
                    <div class="module-meta">${module.lessons} lessons • ${module.duration}</div>
                </div>
            </div>
            <p class="module-description">${module.description}</p>
            <div class="module-lessons">
                <span>📚 ${completed} / ${module.lessons} lessons completed</span>
            </div>
            <div class="module-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
            <div class="module-tags">
                ${module.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        grid.appendChild(card);
    });
}

function loadTemplates() {
    const grid = document.getElementById('templatesGrid');
    templates.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card';

        card.innerHTML = `
            <div class="template-icon">${template.icon}</div>
            <h3>${template.title}</h3>
            <p>${template.description}</p>
            <div class="template-actions">
                <button class="btn btn-outline btn-small" onclick="viewTemplate('${template.file}')">View</button>
                <button class="btn btn-primary btn-small" onclick="downloadTemplate('${template.file}')">Download</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function loadLabs() {
    const grid = document.getElementById('labsGrid');
    labs.forEach(lab => {
        const card = document.createElement('div');
        card.className = 'lab-card';
        card.onclick = () => showLab(lab);

        card.innerHTML = `
            <span class="lab-difficulty difficulty-${lab.difficulty}">${lab.difficulty}</span>
            <h3>${lab.title}</h3>
            <p>${lab.description}</p>
            <div class="lab-meta">
                <span>⏱️ ${lab.duration}</span>
                <span>📁 ${lab.category}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

function setupNavigation() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const target = link.getAttribute('href').slice(1);
            if (target === 'progress') {
                document.getElementById('progress').style.display = 'block';
                scrollToSection('progress');
            } else {
                document.getElementById('progress').style.display = 'none';
                scrollToSection(target);
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterContent(query);
    });
}

function filterContent(query) {
    if (!query) {
        document.querySelectorAll('.module-card, .template-card, .lab-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }

    document.querySelectorAll('.module-card, .template-card, .lab-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
}

function setupModal() {
    const modal = document.getElementById('contentModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function showModule(module) {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h1>${module.title}</h1>
        <p>${module.description}</p>
        <h3>Lessons (${module.lessons})</h3>
        <ul style="list-style: none; padding: 0;">
            ${module.lessons_list.map((lesson, i) => {
                // Handle both string and object lesson formats
                const isObject = lesson && typeof lesson === 'object' && !Array.isArray(lesson);
                const lessonTitle = isObject ? lesson.title : lesson;
                const lessonFile = isObject && lesson.file ? lesson.file : null;
                const lessonKey = `${module.id}-${i}`;
                const isCompleted = progress.lessons[lessonKey];

                return `
                    <li style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                        <span style="cursor: ${lessonFile ? 'pointer' : 'default'}; flex: 1; ${lessonFile ? 'color: #3b82f6; text-decoration: underline;' : ''}"
                              ${lessonFile ? `onclick="showLesson('${lessonFile}', '${encodeURIComponent(lessonTitle)}', ${module.id}, ${i})"` : ''}>
                            ${i + 1}. ${lessonTitle} ${isCompleted ? '✅' : ''}
                        </span>
                        ${lessonFile ? `
                            <button class="btn btn-outline btn-small" onclick="markLessonComplete(${module.id}, ${i})">
                                ${isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                        ` : ''}
                    </li>
                `;
            }).join('')}
        </ul>
        <div style="margin-top: 2rem;">
            <p><strong>Duration:</strong> ${module.duration}</p>
            <p><strong>Tags:</strong> ${module.tags.join(', ')}</p>
        </div>
    `;

    modal.style.display = 'block';
}

async function showLesson(file, encodedTitle, moduleId, lessonId) {
    const title = decodeURIComponent(encodedTitle);
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`File not found: ${file}`);
        }
        const content = await response.text();

        const modal = document.getElementById('contentModal');
        const modalBody = document.getElementById('modalBody');

        const lessonKey = `${moduleId}-${lessonId}`;
        const isCompleted = progress.lessons[lessonKey];

        // Convert markdown to HTML
        modalBody.innerHTML = `
            <div class="reading-progress"></div>
            <div class="lesson-nav">
                <button class="btn btn-outline btn-small" onclick="showModule(modules.find(m => m.id === ${moduleId}))">
                    ← Back to Module
                </button>
                <button class="btn btn-primary btn-small" onclick="markLessonComplete(${moduleId}, ${lessonId})">
                    ${isCompleted ? '✅ Completed' : 'Mark as Complete'}
                </button>
            </div>
            ${convertMarkdownToHTML(content)}
        `;

        modal.style.display = 'block';

        // Add reading progress tracker
        addReadingProgress();

        // Scroll to top
        modalBody.scrollTop = 0;

    } catch (error) {
        console.error('Error loading lesson:', error);
        alert('Failed to load lesson content. File: ' + file + '\nError: ' + error.message);
    }
}

function addReadingProgress() {
    const modalBody = document.getElementById('modalBody');
    const progressBar = modalBody.querySelector('.reading-progress');

    if (!progressBar) return;

    modalBody.addEventListener('scroll', () => {
        const scrollTop = modalBody.scrollTop;
        const scrollHeight = modalBody.scrollHeight - modalBody.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

function markLessonComplete(moduleId, lessonId) {
    const lessonKey = `${moduleId}-${lessonId}`;
    progress.lessons[lessonKey] = true;

    // Update module progress
    const module = modules.find(m => m.id === moduleId);
    const completedLessons = Object.keys(progress.lessons).filter(key =>
        key.startsWith(`${moduleId}-`) && progress.lessons[key]
    ).length;

    progress.modules[moduleId] = completedLessons;

    saveProgress();

    // Refresh display
    document.getElementById('modulesGrid').innerHTML = '';
    loadModules();
    showModule(module);
    updateProgressDisplay();
}

function showLab(lab) {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h1>${lab.title}</h1>
        <span class="lab-difficulty difficulty-${lab.difficulty}" style="margin: 1rem 0; display: inline-block;">${lab.difficulty}</span>
        <p>${lab.description}</p>
        <h3>Details</h3>
        <p><strong>Duration:</strong> ${lab.duration}</p>
        <p><strong>Category:</strong> ${lab.category}</p>
        <p><strong>Prerequisites:</strong> Complete relevant module lessons first</p>
        <div style="margin-top: 2rem;">
            <button class="btn btn-primary" onclick="markLabComplete('${lab.title}')">
                ${progress.labs[lab.title] ? '✅ Completed' : 'Mark as Complete'}
            </button>
        </div>
    `;

    modal.style.display = 'block';
}

function markLabComplete(labTitle) {
    progress.labs[labTitle] = true;
    saveProgress();
    updateProgressDisplay();
    showLab(labs.find(l => l.title === labTitle));
}

async function viewTemplate(file) {
    try {
        const response = await fetch(file);
        const content = await response.text();

        const modal = document.getElementById('contentModal');
        const modalBody = document.getElementById('modalBody');

        // Simple markdown-to-HTML conversion
        modalBody.innerHTML = convertMarkdownToHTML(content);
        modal.style.display = 'block';
    } catch (error) {
        alert('Template file not found. Please ensure templates are in the correct location.');
    }
}

function convertMarkdownToHTML(markdown) {
    // Enhanced markdown conversion with visual elements
    let html = markdown;

    // IMPORTANT: Parse tables FIRST before other processing
    html = parseMarkdownTables(html);

    // Code blocks with language tags (```language ... ```) - must be before inline code
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const langName = lang || 'code';
        return `<pre data-lang="${langName}"><code class="language-${langName}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
        return `<figure style="text-align: center; margin: 2rem 0;">
                    <img src="${url}" alt="${alt}" title="${alt}" />
                    ${alt ? `<figcaption style="margin-top: 0.5rem; color: var(--gray); font-style: italic;">${alt}</figcaption>` : ''}
                </figure>`;
    });

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Special boxes: > **Note:** becomes an info box
    html = html.replace(/> \*\*Note:\*\* (.+)/gi, '<div class="info-box"><strong>Note:</strong> $1</div>');
    html = html.replace(/> \*\*Tip:\*\* (.+)/gi, '<div class="tip-box"><strong>Tip:</strong> $1</div>');
    html = html.replace(/> \*\*Warning:\*\* (.+)/gi, '<div class="warning-box"><strong>Warning:</strong> $1</div>');

    // Blockquotes (general) - after special boxes
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // Headers with icons
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Ordered lists (1. item)
    html = html.replace(/^\d+\.\s+(.+)$/gim, '<oli>$1</oli>');
    html = html.replace(/(<oli>.*<\/oli>\n?)+/g, (match) => {
        const items = match.replace(/<\/?oli>/g, '').split('\n').filter(i => i.trim());
        return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
    });

    // Unordered lists (- or *)
    html = html.replace(/^[\*\-]\s+(.+)$/gim, '<uli>$1</uli>');
    html = html.replace(/(<uli>.*<\/uli>\n?)+/g, (match) => {
        const items = match.replace(/<\/?uli>/g, '').split('\n').filter(i => i.trim());
        return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    });

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr style="margin: 2rem 0; border: none; border-top: 2px solid var(--gray-light);">');

    // Line breaks - preserve double newlines as paragraph breaks
    html = html.split('\n\n').map(para => {
        // Don't wrap if it's already a block element
        if (para.match(/^<(h[1-6]|pre|ul|ol|blockquote|table|div|hr|figure)/)) {
            return para;
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // Clean up
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<br>\s*<br>/g, '<br>');

    return html;
}

function parseMarkdownTables(markdown) {
    const lines = markdown.split('\n');
    let result = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Check if this line starts a table (contains |)
        if (line.trim().match(/^\|(.+)\|$/)) {
            // Collect all consecutive table lines
            let tableLines = [];
            while (i < lines.length && lines[i].trim().match(/^\|(.+)\|$/)) {
                tableLines.push(lines[i]);
                i++;
            }

            // Convert table to HTML
            if (tableLines.length >= 2) {
                result.push(convertTableToHTML(tableLines));
            } else {
                result.push(...tableLines);
            }
        } else {
            result.push(line);
            i++;
        }
    }

    return result.join('\n');
}

function convertTableToHTML(tableLines) {
    if (tableLines.length < 2) return tableLines.join('\n');

    let html = '\n<table>\n';

    // Parse header row (first line)
    const headerLine = tableLines[0].trim();
    const headerCells = headerLine
        .slice(1, -1)  // Remove leading and trailing |
        .split('|')
        .map(cell => cell.trim());

    html += '<thead>\n<tr>\n';
    headerCells.forEach(cell => {
        html += `  <th>${cell}</th>\n`;
    });
    html += '</tr>\n</thead>\n';

    // Skip separator line (second line with dashes)
    // Parse data rows (remaining lines)
    if (tableLines.length > 2) {
        html += '<tbody>\n';
        for (let i = 2; i < tableLines.length; i++) {
            const dataLine = tableLines[i].trim();
            const dataCells = dataLine
                .slice(1, -1)  // Remove leading and trailing |
                .split('|')
                .map(cell => cell.trim());

            html += '<tr>\n';
            dataCells.forEach(cell => {
                html += `  <td>${cell}</td>\n`;
            });
            html += '</tr>\n';
        }
        html += '</tbody>\n';
    }

    html += '</table>\n';
    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function downloadTemplate(file) {
    window.open(file, '_blank');
}

function saveProgress() {
    localStorage.setItem('qaPlaybookProgress', JSON.stringify(progress));
}

function updateProgressDisplay() {
    const totalModules = modules.length;
    const completedModules = Object.values(progress.modules).filter(count => count > 0).length;
    const modulePercent = (completedModules / totalModules) * 100;

    const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0);
    const completedLessons = Object.values(progress.lessons).filter(Boolean).length;
    const lessonPercent = (completedLessons / totalLessons) * 100;

    const totalLabs = labs.length;
    const completedLabs = Object.values(progress.labs).filter(Boolean).length;
    const labPercent = (completedLabs / totalLabs) * 100;

    document.getElementById('moduleProgress').style.width = `${modulePercent}%`;
    document.getElementById('completedModules').textContent = completedModules;

    document.getElementById('lessonProgress').style.width = `${lessonPercent}%`;
    document.getElementById('completedLessons').textContent = completedLessons;

    document.getElementById('labProgress').style.width = `${labPercent}%`;
    document.getElementById('completedLabs').textContent = completedLabs;
}

function scrollToModules() {
    scrollToSection('modules');
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewProgress() {
    document.getElementById('progress').style.display = 'block';
    scrollToSection('progress');

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('a[href="#progress"]').classList.add('active');
}

function startPath(pathName) {
    alert(`Starting ${pathName} learning path! Navigate to the Modules section to begin.`);
    scrollToModules();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, iconElement) {
    iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
}
