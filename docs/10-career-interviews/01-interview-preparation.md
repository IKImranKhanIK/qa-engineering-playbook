# Interview Preparation

## Overview

Preparing for QA interviews requires understanding both technical concepts and demonstrating problem-solving ability. This lesson covers how to prepare effectively.

## Interview Types

### 1. Phone Screen (30-45 min)
- Basic QA concepts
- Resume walkthrough
- Behavioral questions
- Salary expectations

### 2. Technical Interview (45-90 min)
- Test case writing
- Bug report creation
- SQL queries
- Automation coding

### 3. System Design (60 min)
- Test strategy for complex systems
- Test automation architecture
- CI/CD pipeline design

### 4. Behavioral Interview (45-60 min)
- Past experiences
- Conflict resolution
- Leadership examples

## Preparation Checklist

### Technical Preparation
- [ ] Review SDLC and testing methodologies
- [ ] Practice writing test cases
- [ ] Refresh SQL skills
- [ ] Code automation examples (Selenium/Playwright)
- [ ] Study API testing (Postman/REST)
- [ ] Review mobile testing concepts
- [ ] Understand CI/CD basics

### Behavioral Preparation
- [ ] Prepare STAR stories (Situation, Task, Action, Result)
- [ ] Have examples of:
  - Bug you found that saved the company
  - Conflict with developer/PM
  - Time you improved a process
  - Failure and what you learned
- [ ] Research the company
- [ ] Prepare questions to ask

## Common QA Concepts to Review

1. **Test Levels**: Unit, Integration, System, UAT
2. **Test Types**: Functional, Non-functional, Regression
3. **Test Design**: Equivalence partitioning, boundary value analysis
4. **Defect Lifecycle**: New → Assigned → Fixed → Verified → Closed
5. **Agile/Scrum**: Sprints, stand-ups, retrospectives

## Practice Exercises

### Exercise 1: Write Test Cases

**Scenario:** Test a login page

**Expected Answer:**
```
Test Case ID: TC-LOGIN-001
Title: Successful login with valid credentials
Preconditions: User account exists
Steps:
1. Navigate to login page
2. Enter valid username
3. Enter valid password
4. Click "Login" button
Expected Result: User redirected to dashboard

Test Case ID: TC-LOGIN-002
Title: Login fails with invalid password
...
```

### Exercise 2: Find Bugs

**Scenario:** Given a buggy calculator app, identify issues

**Skills Tested:**
- Exploratory testing
- Bug reporting
- Edge case thinking

### Exercise 3: SQL Query

**Question:** "Write a query to find users who haven't logged in for 30 days"

```sql
SELECT user_id, email, last_login
FROM users
WHERE last_login < NOW() - INTERVAL '30 days'
ORDER BY last_login ASC;
```

## Interview Day Tips

1. **Arrive 10-15 minutes early**
2. **Bring copies of resume**
3. **Ask clarifying questions** before answering
4. **Think out loud** during technical problems
5. **Admit when you don't know** something
6. **Ask questions** about the role/company
7. **Send thank-you email** within 24 hours

## Red Flags to Watch For

- No QA process/team
- "We don't have time for testing"
- Unrealistic timelines
- No test environment
- Manual-only testing with no automation plan

## Summary

Successful interview preparation requires:
- Technical knowledge review
- Practice problems
- STAR story preparation
- Company research
- Confidence and honesty

Prepare thoroughly, but be authentic. Companies hire people, not robots.
