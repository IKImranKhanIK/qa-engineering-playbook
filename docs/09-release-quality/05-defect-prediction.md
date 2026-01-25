# Defect Prediction

## Overview

Defect prediction uses historical data and code metrics to identify high-risk areas before bugs occur, allowing teams to allocate testing effort more effectively.

## Risk Indicators

### 1. Code Churn

**Definition:** Lines of code changed in recent commits

**High Risk:** Files with >500 lines changed in past 2 weeks

```javascript
const calculateCodeChurn = async (filePath, days = 14) => {
  const commits = await git.log({
    file: filePath,
    since: `${days} days ago`
  });

  const linesChanged = commits.reduce((sum, commit) => {
    return sum + commit.additions + commit.deletions;
  }, 0);

  return {
    file: filePath,
    linesChanged,
    commits: commits.length,
    riskLevel: linesChanged > 500 ? 'HIGH' : linesChanged > 200 ? 'MEDIUM' : 'LOW'
  };
};
```

### 2. Complexity

**Metric:** Cyclomatic complexity per function

**High Risk:** Complexity >10

```javascript
const analyzeComplexity = (functionCode) => {
  const complexity = calculateCyclomaticComplexity(functionCode);

  return {
    complexity,
    riskLevel: complexity > 10 ? 'HIGH' : complexity > 5 ? 'MEDIUM' : 'LOW',
    recommendation: complexity > 10 ? 'Refactor and add unit tests' : 'OK'
  };
};
```

### 3. Historical Bug Density

**Formula:** Bugs per 1,000 lines of code

```javascript
const bugDensity = (file) => {
  const bugs = getBugHistory(file);
  const lines = countLines(file);

  const density = (bugs.length / lines) * 1000;

  return {
    file,
    bugs: bugs.length,
    lines,
    density,
    riskLevel: density > 5 ? 'HIGH' : density > 2 ? 'MEDIUM' : 'LOW'
  };
};
```

### 4. Test Coverage Gaps

**High Risk:** Code with <50% test coverage

```javascript
const findCoverageGaps = (coverageReport) => {
  return coverageReport.files
    .filter(file => file.coverage < 50)
    .sort((a, b) => a.coverage - b.coverage);
};
```

## Defect Prediction Model

Combine multiple factors to predict defect-prone areas:

```javascript
const predictDefects = (file) => {
  const churn = calculateCodeChurn(file);
  const complexity = analyzeComplexity(file);
  const density = bugDensity(file);
  const coverage = getCoverage(file);

  // Weighted risk score
  const riskScore =
    (churn.riskLevel === 'HIGH' ? 3 : churn.riskLevel === 'MEDIUM' ? 2 : 1) +
    (complexity.riskLevel === 'HIGH' ? 3 : complexity.riskLevel === 'MEDIUM' ? 2 : 1) +
    (density.riskLevel === 'HIGH' ? 3 : density.riskLevel === 'MEDIUM' ? 2 : 1) +
    (coverage < 50 ? 3 : coverage < 70 ? 2 : 1);

  return {
    file,
    riskScore, // Max: 12, Min: 4
    riskLevel: riskScore >= 10 ? 'HIGH' : riskScore >= 7 ? 'MEDIUM' : 'LOW',
    factors: { churn, complexity, density, coverage }
  };
};
```

## Actionable Recommendations

Based on risk score:

| Risk Level | Action |
|------------|--------|
| HIGH (10-12) | Mandatory code review, add unit tests, manual exploratory testing |
| MEDIUM (7-9) | Code review, automated tests |
| LOW (4-6) | Standard testing process |

## Summary

Defect prediction helps:
- Focus testing on high-risk areas
- Allocate resources efficiently
- Prevent bugs before they occur
- Improve code quality proactively

Use historical data and code metrics to predict where bugs are most likely to occur.
