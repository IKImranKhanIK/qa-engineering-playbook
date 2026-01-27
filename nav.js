// Shared navigation for all pages
function renderNavigation() {
    return `
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="index.html" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 0.5rem;">
                    <span class="logo">QA</span>
                    <span class="brand-text">Engineering Playbook</span>
                </a>
            </div>
            <div class="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="modules.html" class="nav-link">Modules</a>
                <a href="learning-paths.html" class="nav-link">Paths</a>
                <a href="playground.html" class="nav-link">Playground</a>
                <a href="templates.html" class="nav-link">Templates</a>
                <a href="labs.html" class="nav-link">Labs</a>
                <a href="resources.html" class="nav-link">Resources</a>
                <a href="glossary.html" class="nav-link">Glossary</a>
                <a href="progress.html" class="nav-link">Progress</a>
            </div>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
                <span class="theme-icon">🌙</span>
            </button>
        </div>
    </nav>
    `;
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    // Inject navigation
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = renderNavigation();
    }

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Theme toggle
    setupThemeToggle();
});

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

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
    if (iconElement) {
        iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}
