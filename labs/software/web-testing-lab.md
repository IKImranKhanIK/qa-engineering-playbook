# Lab: Web Application Testing

**Difficulty:** Beginner
**Duration:** 2 hours
**Category:** Software

## Objectives

By the end of this lab, you will:
- Perform functional testing on a web application
- Create test cases for common user flows
- Identify and report bugs
- Practice exploratory testing
- Use browser DevTools for debugging

## Prerequisites

- Basic understanding of web applications
- Completed [Web Testing Strategies lesson](../../docs/02-software-qa/01-web-testing-strategies.md)
- Web browser (Chrome recommended)

## Setup

### Test Application

We'll test the **TodoMVC** application: https://todomvc.com/examples/react/

This is a simple todo list application that demonstrates common web functionality.

### Tools Needed

- Modern web browser (Chrome/Firefox/Edge)
- Browser DevTools
- Text editor for notes

## Part 1: Exploratory Testing (30 minutes)

### Exercise 1.1: Application Discovery

**Task:** Explore the application and document all features

1. Navigate to https://todomvc.com/examples/react/
2. Interact with the application
3. Document:
   - All input fields and buttons
   - All visible features
   - Any keyboard shortcuts (check the footer)

**Expected Features:**
- Add new todo
- Mark todo as complete
- Delete todo
- Filter by status (All, Active, Completed)
- Clear completed todos
- Edit existing todo

### Exercise 1.2: Identify Test Scenarios

**Task:** Create a list of test scenarios

Document at least 10 test scenarios, such as:
- Add a new todo with valid text
- Add a todo with empty text
- Mark todo as complete/incomplete
- Delete a todo
- Filter todos by status
- Edit an existing todo
- Add multiple todos
- Clear all completed todos
- Test persistence (refresh page)
- Test very long todo text

## Part 2: Functional Testing (45 minutes)

### Exercise 2.1: Test Case Execution

**Task:** Execute detailed test cases

#### TC-001: Add New Todo
**Preconditions:** Application is loaded
**Steps:**
1. Type "Buy groceries" in the input field
2. Press Enter
**Expected:**
- Todo appears in the list
- Input field is cleared
- Counter shows "1 item left"

Execute this test and document: ✅ Pass or ❌ Fail

#### TC-002: Mark Todo as Complete
**Preconditions:** At least one todo exists
**Steps:**
1. Click the checkbox next to a todo
**Expected:**
- Todo is crossed out
- Checkbox is checked
- Counter decrements

#### TC-003: Delete Todo
**Preconditions:** At least one todo exists
**Steps:**
1. Hover over a todo
2. Click the X button
**Expected:**
- Todo is removed from list
- Counter updates correctly

#### TC-004: Filter - Active Items
**Preconditions:** Mix of completed and active todos exist
**Steps:**
1. Click "Active" filter
**Expected:**
- Only uncompleted todos are shown
- URL updates to /#/active

#### TC-005: Empty Todo Validation
**Steps:**
1. Press Enter in empty input field
2. Type only spaces and press Enter
**Expected:**
- No todo is added
- Input field remains empty

**Document your results for each test case.**

### Exercise 2.2: Edge Cases

Test the following edge cases:

1. **Very Long Text:**
   - Add a todo with 500+ characters
   - Does the UI handle it gracefully?

2. **Special Characters:**
   - Add todos with: `<script>alert('xss')</script>`
   - Add todos with emojis: 🎉 🚀 ✅
   - Add todos with HTML: `<b>bold</b>`

3. **Rapid Actions:**
   - Quickly add 20 todos
   - Quickly mark/unmark multiple todos
   - Does the counter stay accurate?

4. **Browser Refresh:**
   - Add several todos
   - Refresh the page
   - Are todos persisted?

**Document any bugs or unexpected behavior.**

## Part 3: Bug Reporting (30 minutes)

### Exercise 3.1: File Bug Reports

For each bug you found, create a bug report with:

**Bug Template:**
```
BUG-ID: [Unique ID]
Title: [Concise description]
Severity: [Critical/High/Medium/Low]
Priority: [High/Medium/Low]

Steps to Reproduce:
1.
2.
3.

Expected Result:
[What should happen]

Actual Result:
[What actually happens]

Browser: [Chrome 120 / Firefox 115 / etc]
Screenshots: [Attach if relevant]
```

**Example Bug:**
```
BUG-001
Title: Empty spaces accepted as valid todo

Severity: Medium
Priority: Medium

Steps to Reproduce:
1. Click in the input field
2. Type 5 spaces
3. Press Enter

Expected Result:
No todo should be added (input validation should fail)

Actual Result:
A todo with only spaces is added to the list

Browser: Chrome 120
```

### Exercise 3.2: Bug Classification

Classify your bugs by:
- **Type:** Functional, UI, Performance, Usability
- **Severity:** Critical, High, Medium, Low
- **Priority:** Urgent, High, Medium, Low

## Part 4: DevTools Inspection (15 minutes)

### Exercise 4.1: Inspect Network Activity

**Task:** Monitor network requests

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Perform various actions (add, delete, complete todos)
4. Observe:
   - Are there any API calls?
   - Is data stored locally?
   - Check Application tab → Local Storage

**Document:**
- How are todos persisted?
- What storage mechanism is used?

### Exercise 4.2: Console Errors

**Task:** Check for JavaScript errors

1. Open Console tab in DevTools
2. Perform all major actions
3. Look for errors or warnings

**Document any errors found.**

## Deliverables

Create a test report including:

1. **Test Summary**
   - Total test cases executed
   - Passed / Failed / Blocked
   - Test coverage percentage

2. **Bug List**
   - All bugs found with complete details
   - Screenshots attached

3. **Test Notes**
   - Areas that need improvement
   - Suggestions for additional testing
   - Overall quality assessment

## Bonus Challenges

1. **Accessibility Testing:**
   - Can you navigate the app using only keyboard?
   - Check with a screen reader
   - Validate ARIA labels

2. **Performance Testing:**
   - Add 1000 todos via console
   - Does the app remain responsive?
   - Check rendering performance

3. **Cross-Browser Testing:**
   - Test in Chrome, Firefox, Safari, Edge
   - Document any browser-specific issues

4. **Mobile Testing:**
   - Test on mobile device or browser DevTools mobile mode
   - Check touch interactions
   - Verify responsive design

## Solution Notes

Common bugs you might find:
- Empty/whitespace validation missing
- XSS vulnerabilities with HTML input
- Counter issues with rapid actions
- UI scaling issues with very long text
- Filter persistence issues

## Next Steps

- Try testing other TodoMVC implementations: https://todomvc.com/
- Compare bug counts across different frameworks
- Practice automation on this app using Playwright/Cypress
