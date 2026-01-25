# Compatibility Matrices

## Overview

A compatibility matrix documents which versions of components (firmware, apps, backend) work together. This is critical for systems with multiple independently-versioned pieces that must interoperate correctly.

## Why Compatibility Matrices Matter

### Real-World Scenario

```
User has:
- Smart Thermostat with Firmware v2.3.1
- iOS App v3.1.0
- Android App v3.0.5
- Backend API v4.2.0

Question: Do all these versions work together?
```

Without a compatibility matrix, you risk:
- Silent failures (features don't work, no error shown)
- Data corruption (incompatible data formats)
- Poor UX (app crashes when communicating with old firmware)
- Support nightmares (hard to debug version-specific issues)

## Building a Compatibility Matrix

### Basic Structure

| Firmware | iOS App | Android App | Backend API | Status | Notes |
|----------|---------|-------------|-------------|--------|-------|
| v2.3.x | v3.1.x | v3.0.x | v4.2.x | ✅ Supported | Current stable |
| v2.2.x | v3.0.x | v2.9.x | v4.1.x | ⚠️ Deprecated | EOL June 2026 |
| v2.1.x | v2.8.x | v2.7.x | v4.0.x | ❌ Unsupported | Security risk |
| v2.3.x | v3.0.x | v2.9.x | v4.2.x | ⚠️ Limited | Missing push notifications |

### Multi-Dimensional Matrix

For complex systems with more components:

```
Component Version Matrix (Jan 2026)

Firmware 2.3.1
├─ iOS App 3.1.0 ✅
│  └─ Backend 4.2.0 ✅ (Full feature set)
│  └─ Backend 4.1.0 ⚠️ (No remote diagnostics)
│
├─ iOS App 3.0.0 ⚠️
│  └─ Backend 4.2.0 ⚠️ (No dark mode)
│
└─ Android App 3.0.5 ✅
   └─ Backend 4.2.0 ✅ (Full feature set)

Firmware 2.2.0
├─ iOS App 3.1.0 ❌ (Pairing fails)
└─ iOS App 3.0.0 ✅
   └─ Backend 4.1.0 ✅
```

## Testing Compatibility

### 1. Version Discovery Testing

Each component should report its version correctly.

**Test Cases:**

```javascript
describe('Version reporting', () => {
  test('Firmware reports version via BLE', async () => {
    const deviceInfo = await device.getInfo();
    expect(deviceInfo.firmwareVersion).toMatch(/^\d+\.\d+\.\d+$/);
    expect(deviceInfo.firmwareVersion).toBe('2.3.1');
  });

  test('App includes version in API headers', async () => {
    const request = await captureNextRequest();
    expect(request.headers['X-App-Version']).toBe('3.1.0');
    expect(request.headers['X-Platform']).toBe('iOS');
  });

  test('Backend returns version in response', async () => {
    const response = await api.get('/health');
    expect(response.data.version).toBe('4.2.0');
  });
});
```

### 2. Version Compatibility Checks

Test that components reject incompatible versions.

**Example: App checks firmware version before pairing**

```javascript
test('App rejects unsupported firmware', async () => {
  const oldDevice = createMockDevice({ firmwareVersion: '1.5.0' });

  await app.scanForDevices();
  await app.selectDevice(oldDevice.id);

  const result = await app.pair();

  expect(result.success).toBe(false);
  expect(result.error).toBe('FIRMWARE_TOO_OLD');
  expect(app.getErrorMessage()).toContain(
    'Please update firmware to v2.0.0 or later'
  );
});
```

**Example: Backend rejects old API clients**

```javascript
test('Backend returns 426 Upgrade Required for old apps', async () => {
  const oldAppRequest = {
    headers: {
      'X-App-Version': '2.5.0', // Min required is 3.0.0
      'X-Platform': 'iOS'
    }
  };

  const response = await api.get('/devices', oldAppRequest);

  expect(response.status).toBe(426); // Upgrade Required
  expect(response.data).toMatchObject({
    error: 'APP_VERSION_TOO_OLD',
    minVersion: '3.0.0',
    downloadUrl: 'https://apps.apple.com/app/id123456'
  });
});
```

### 3. Feature Availability Testing

Test that features work (or gracefully degrade) across version combinations.

**Test Matrix:**

| Feature | Firmware 2.3 + App 3.1 | Firmware 2.2 + App 3.1 | Firmware 2.3 + App 3.0 |
|---------|------------------------|------------------------|------------------------|
| Temperature control | ✅ Works | ✅ Works | ✅ Works |
| Schedules | ✅ Works | ✅ Works | ✅ Works |
| Geofencing | ✅ Works | ❌ Not available | ⚠️ Limited (no radius) |
| Voice control | ✅ Works | ❌ Not available | ❌ Not available |
| Energy reports | ✅ Works | ❌ Not available | ⚠️ Basic only |

**Automated Tests:**

```javascript
describe('Feature compatibility', () => {
  const testCases = [
    {
      firmware: '2.3.1',
      app: '3.1.0',
      features: {
        geofencing: 'full',
        voiceControl: 'enabled',
        energyReports: 'detailed'
      }
    },
    {
      firmware: '2.2.0',
      app: '3.1.0',
      features: {
        geofencing: 'disabled',
        voiceControl: 'disabled',
        energyReports: 'disabled'
      }
    },
    {
      firmware: '2.3.1',
      app: '3.0.0',
      features: {
        geofencing: 'basic', // No radius setting
        voiceControl: 'disabled',
        energyReports: 'basic'
      }
    }
  ];

  testCases.forEach(({ firmware, app, features }) => {
    test(`Features for FW ${firmware} + App ${app}`, async () => {
      await setupVersions({ firmware, app });

      const capabilities = await app.getDeviceCapabilities();

      expect(capabilities.geofencing).toBe(features.geofencing);
      expect(capabilities.voiceControl).toBe(features.voiceControl);
      expect(capabilities.energyReports).toBe(features.energyReports);
    });
  });
});
```

### 4. Data Format Compatibility

Ensure data structures are compatible across versions.

**Example: New field added in backend v4.2**

```javascript
// Backend v4.1 device response
{
  "id": "DEV-123",
  "name": "Living Room",
  "temperature": 22.5
}

// Backend v4.2 device response (added humidity)
{
  "id": "DEV-123",
  "name": "Living Room",
  "temperature": 22.5,
  "humidity": 45.2  // New field
}

// App v3.0 must handle missing field gracefully
test('Old app handles new backend fields', async () => {
  const device = await oldApp.getDevice('DEV-123');

  expect(device.temperature).toBe(22.5);
  // humidity might be undefined - app shouldn't crash
  expect(device.humidity === undefined || typeof device.humidity === 'number').toBe(true);
});

// New app must handle old backend responses
test('New app handles missing optional fields', async () => {
  mockBackend.setResponse({
    id: 'DEV-123',
    name: 'Living Room',
    temperature: 22.5
    // No humidity field
  });

  const device = await newApp.getDevice('DEV-123');

  expect(device.temperature).toBe(22.5);
  expect(device.humidity).toBeUndefined();
  // UI shows "Humidity: --" instead of crashing
});
```

## Managing Version Dependencies

### Semantic Versioning (SemVer)

Use SemVer (MAJOR.MINOR.PATCH) to communicate breaking changes.

```
v2.3.1
│ │ │
│ │ └─ PATCH: Bug fixes, no new features (backward compatible)
│ └─── MINOR: New features (backward compatible)
└───── MAJOR: Breaking changes (NOT backward compatible)
```

**Examples:**

- `v2.3.1 → v2.3.2`: Bug fixes only, always safe to upgrade
- `v2.3.2 → v2.4.0`: New features, old apps still work
- `v2.4.0 → v3.0.0`: Breaking changes, old apps may NOT work

### Version Requirement Specification

Document dependencies clearly.

**Example: Firmware v2.3.0 requirements**

```json
{
  "firmwareVersion": "2.3.0",
  "requires": {
    "iOSApp": {
      "minimum": "3.0.0",
      "recommended": "3.1.0"
    },
    "androidApp": {
      "minimum": "2.9.0",
      "recommended": "3.0.5"
    },
    "backendAPI": {
      "minimum": "4.1.0",
      "maximum": "4.x.x"
    }
  }
}
```

**Test that requirements are enforced:**

```javascript
test('Firmware rejects too-old app', async () => {
  const oldApp = { version: '2.8.0', platform: 'iOS' };

  const result = await device.checkAppCompatibility(oldApp);

  expect(result.compatible).toBe(false);
  expect(result.reason).toBe('APP_VERSION_TOO_OLD');
  expect(result.minimumVersion).toBe('3.0.0');
});
```

## Compatibility Testing Strategies

### 1. Full Matrix Testing

Test all supported combinations.

**Test Script:**

```javascript
const firmwareVersions = ['2.2.0', '2.3.0', '2.3.1'];
const iOSVersions = ['3.0.0', '3.1.0'];
const androidVersions = ['2.9.0', '3.0.5'];
const backendVersions = ['4.1.0', '4.2.0'];

const allCombinations = cartesianProduct(
  firmwareVersions,
  iOSVersions,
  androidVersions,
  backendVersions
);

// Generate 2 * 3 * 2 * 2 = 24 test combinations

allCombinations.forEach(([fw, ios, android, backend]) => {
  test(`FW:${fw} iOS:${ios} Android:${android} Backend:${backend}`, async () => {
    await setupEnvironment({ fw, ios, android, backend });
    await runSmokeTests();
  });
});
```

**Problem:** Combinatorial explosion (too many tests).

**Solution:** Risk-based matrix reduction.

### 2. Risk-Based Matrix Testing

Focus on high-risk combinations.

**Priority 1 (Always test):**
- Latest versions of all components
- Minimum supported versions
- Known problematic combinations

**Priority 2 (Periodically test):**
- N-1 versions (one version behind latest)
- Major version boundaries (v2.9 + v3.0)

**Priority 3 (Spot check):**
- Random sampling of other combinations

```javascript
const priorityMatrix = {
  p1: [
    { fw: '2.3.1', app: '3.1.0', backend: '4.2.0' }, // Latest all
    { fw: '2.2.0', app: '3.0.0', backend: '4.1.0' }, // Min supported
    { fw: '2.3.0', app: '3.0.5', backend: '4.2.0' }  // Known issue
  ],
  p2: [
    { fw: '2.3.0', app: '3.1.0', backend: '4.2.0' },
    { fw: '2.3.1', app: '3.0.0', backend: '4.1.0' }
  ],
  p3: [] // Randomly generated weekly
};
```

### 3. Canary Testing

Release new versions to a small subset of users first.

**Process:**
1. Release firmware v2.4.0 to 1% of devices
2. Monitor for errors, crashes, support tickets
3. If stable for 48 hours, expand to 10%
4. Continue gradual rollout

**Test:**
```javascript
test('Canary group receives new firmware', async () => {
  const canaryUsers = await backend.getCanaryUsers();

  for (const user of canaryUsers) {
    const device = await user.getDevice();
    expect(device.availableFirmwareUpdate).toBe('2.4.0');
  }

  const nonCanaryUsers = await backend.getNonCanaryUsers();
  for (const user of nonCanaryUsers.slice(0, 10)) {
    const device = await user.getDevice();
    expect(device.availableFirmwareUpdate).toBe('2.3.1'); // Still on old
  }
});
```

## Compatibility Matrix as Code

Store compatibility rules in code for automated enforcement.

**Example: `compatibility.json`**

```json
{
  "rules": [
    {
      "firmware": "2.3.x",
      "compatibleWith": {
        "iOSApp": ">=3.0.0",
        "androidApp": ">=2.9.0",
        "backendAPI": ">=4.1.0 <5.0.0"
      },
      "features": {
        "geofencing": "full",
        "voiceControl": true,
        "energyReports": "detailed"
      }
    },
    {
      "firmware": "2.2.x",
      "compatibleWith": {
        "iOSApp": ">=2.8.0 <3.1.0",
        "androidApp": ">=2.7.0 <3.0.0",
        "backendAPI": ">=4.0.0 <4.2.0"
      },
      "features": {
        "geofencing": false,
        "voiceControl": false,
        "energyReports": "basic"
      },
      "deprecated": true,
      "endOfLife": "2026-06-01"
    }
  ]
}
```

**Use in Tests:**

```javascript
const compatibility = require('./compatibility.json');

test('Version compatibility enforced', () => {
  const rule = compatibility.rules.find(r =>
    semver.satisfies('2.3.1', r.firmware)
  );

  expect(semver.satisfies('3.1.0', rule.compatibleWith.iOSApp)).toBe(true);
  expect(semver.satisfies('2.5.0', rule.compatibleWith.iOSApp)).toBe(false);
});
```

## Documentation Best Practices

### 1. Public Compatibility Page

Publish a page users can reference.

```markdown
# SmartThermostat Compatibility

## Current Versions (Jan 2026)
- Firmware: v2.3.1
- iOS App: v3.1.0
- Android App: v3.0.5
- Backend: v4.2.0

## Minimum Supported Versions
- Firmware: v2.2.0 (End of Life: June 2026)
- iOS App: v3.0.0
- Android App: v2.9.0

## Unsupported Versions
Firmware v2.1.x and earlier are no longer supported and have known security vulnerabilities. Please update immediately.
```

### 2. In-App Version Checks

Show compatibility warnings in the app.

```javascript
// On app startup
const checkCompatibility = async () => {
  const device = await getConnectedDevice();

  if (semver.lt(device.firmwareVersion, MIN_FIRMWARE_VERSION)) {
    showAlert({
      title: 'Firmware Update Required',
      message: `Your device firmware (v${device.firmwareVersion}) is outdated. Please update to v${MIN_FIRMWARE_VERSION} or later for best performance.`,
      actions: ['Update Now', 'Remind Me Later']
    });
  }
};
```

### 3. Release Notes

Document compatibility changes in every release.

```markdown
# iOS App v3.1.0 Release Notes

## Compatibility
- **Minimum firmware:** v2.2.0
- **Recommended firmware:** v2.3.1
- **Backend:** v4.1.0 - v4.2.x

## Breaking Changes
- Dropped support for firmware v2.1.x
- Minimum iOS version is now 14.0

## New Features
- Voice control (requires firmware v2.3.0+)
- Energy reports (requires backend v4.2.0+)
```

## Summary

Effective compatibility management requires:
- **Clear documentation** of supported versions
- **Automated version checks** at connection time
- **Graceful degradation** when features unavailable
- **Risk-based testing** of version combinations
- **Semantic versioning** to communicate changes
- **Gradual rollouts** to detect issues early

A well-maintained compatibility matrix prevents user frustration and reduces support burden.
