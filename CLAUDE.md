# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the QA Engineering Playbook - a comprehensive web application for learning quality engineering from beginner to senior level. It covers software QA, hardware QA, test automation, and systems integration.

## Project Structure

```
qa-engineering-playbook/
├── index.html          # Main web application
├── styles.css          # Styling and responsive design
├── app.js              # JavaScript for interactivity
├── docs/               # Markdown lesson content (10 modules)
├── templates/          # 8 production-ready QA templates
├── labs/               # Hands-on exercises
├── examples/           # Sample test suites and reports
└── tools/              # Automation starters and CI/CD configs
```

## Running the Application

### Local Development

1. **Simple HTTP Server (Python):**
   ```bash
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000

2. **Using Node.js:**
   ```bash
   npx http-server .
   ```

3. **Using VS Code:**
   Install "Live Server" extension and click "Go Live"

4. **Direct File Open:**
   Simply open `index.html` in a browser (file:// protocol)

### Deploy to Production

**GitHub Pages:**
```bash
git add .
git commit -m "Update playbook"
git push origin main
```
Enable GitHub Pages in repository settings pointing to main branch.

**Netlify/Vercel:**
- Connect repository
- No build command needed (static site)
- Publish directory: `.` (root)

## Architecture

### Frontend Stack
- **HTML5**: Semantic markup, accessibility
- **CSS3**: Modern responsive design, CSS Grid, Flexbox
- **Vanilla JavaScript**: No frameworks, fast and simple
- **LocalStorage**: Progress tracking persistence

### Key Features
- **Responsive Design**: Works on mobile, tablet, desktop
- **Progress Tracking**: Marks lessons and labs complete, persists locally
- **Search**: Real-time content filtering
- **Modal Content Display**: View lessons and templates in overlay
- **Learning Paths**: Guided curriculum for different roles

### Data Structure

Content is defined in `app.js`:
- `modules[]`: 10 QA modules with lessons and metadata
- `templates[]`: 8 template files with descriptions
- `labs[]`: 10+ hands-on exercises

Progress stored in localStorage:
```javascript
{
  modules: { moduleId: completedLessonsCount },
  lessons: { "moduleId-lessonId": true },
  labs: { labTitle: true }
}
```

## Making Changes

### Adding a New Module

Edit `app.js` and add to `modules` array:
```javascript
{
    id: 11,
    title: "New Module Name",
    description: "Description here",
    lessons: 5,
    duration: "8-10 hours",
    tags: ["Tag1", "Tag2"],
    lessons_list: [
        "Lesson 1 Name",
        "Lesson 2 Name",
        // ...
    ]
}
```

### Adding a Template

1. Create markdown file in `templates/`
2. Add entry to `templates` array in `app.js`:
```javascript
{
    title: "Template Name",
    description: "What it's for",
    icon: "📋",
    file: "templates/your-template.md"
}
```

### Adding a Lab

Add to `labs` array in `app.js`:
```javascript
{
    title: "Lab Name",
    description: "What you'll do",
    difficulty: "beginner|intermediate|advanced",
    duration: "2 hours",
    category: "software|hardware|automation|systems"
}
```

### Styling Changes

All styles in `styles.css`:
- CSS variables in `:root` for theming
- Mobile-first responsive design
- Breakpoint at 768px for mobile

## Content Management

### Markdown Content Location

- **Modules**: `docs/XX-module-name/`
- **Templates**: `templates/`
- **Labs**: `labs/` (future implementation)
- **Examples**: `examples/`

### Linking Markdown Files

To display markdown content in the webapp, use the `viewTemplate()` or similar function pattern. The app reads markdown files and converts them to HTML for display.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- No external dependencies (except Google Fonts)
- Minimal JavaScript
- Fast initial load
- localStorage for persistence

## Future Enhancements

- [ ] Full markdown parsing (integrate marked.js)
- [ ] Export progress as PDF
- [ ] Quiz/assessment system
- [ ] Completion certificates
- [ ] Dark mode toggle
- [ ] Code syntax highlighting
- [ ] Video embeds for lessons
