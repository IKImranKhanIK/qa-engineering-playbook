# Firmware ↔ Software Versioning

## Overview

Firmware and software versioning presents unique challenges because firmware updates are riskier (can brick devices), slower to deploy, and harder to roll back than software updates. Coordinating releases across firmware, mobile apps, and backend services requires careful planning and testing.

## Key Challenges

### 1. Firmware Update Constraints

Unlike software:
- **Can't easily roll back**: Bricked device = RMA cost
- **Slower deployment**: OTA updates take time, users may delay
- **Resource constrained**: Limited flash memory for update packages
- **Always backward compatible**: Old firmware must work with new apps

### 2. Version Skew Scenarios

```
Real-world version distribution (example product):

Firmware Versions in Field:
- v2.3.1: 45% of devices (latest)
- v2.2.0: 30% of devices
- v2.1.5: 15% of devices
- v2.0.x: 10% of devices (ancient)

App Versions:
- iOS v3.1.0: 60%
- iOS v3.0.x: 25%
- iOS v2.9.x: 15%

Backend API: v4.2.0 (100% - centrally controlled)
```

**Your system must handle ALL combinations gracefully.**

## Testing Version Compatibility

### Protocol Version Negotiation

Implement a handshake to agree on protocol version.

```javascript
// Example handshake
test('Firmware and app negotiate protocol version', async () => {
  // App supports protocols v2 and v3
  const app = new App({ supportedProtocols: [2, 3] });

  // Old firmware only supports v2
  const device = new Device({ protocolVersion: 2 });

  const connection = await app.connectToDevice(device);

  // Should negotiate down to v2
  expect(connection.protocolVersion).toBe(2);
  expect(connection.features).toEqual({
    temperatureControl: true,
    scheduling: true,
    geofencing: false, // Not in protocol v2
    voiceControl: false
  });
});

test('App refuses connection to very old firmware', async () => {
  const app = new App({ supportedProtocols: [2, 3] });
  const ancientDevice = new Device({ protocolVersion: 1 });

  await expect(
    app.connectToDevice(ancientDevice)
  ).rejects.toThrow('PROTOCOL_VERSION_TOO_OLD');

  expect(app.getLastError()).toMatchObject({
    code: 'PROTOCOL_VERSION_TOO_OLD',
    minimumSupported: 2,
    deviceVersion: 1,
    message: 'Please update device firmware to v2.0.0 or later'
  });
});
```

### Backward Compatibility Testing

Ensure new software works with old firmware.

```javascript
describe('Backward compatibility', () => {
  test('New app works with old firmware', async () => {
    const newApp = new App({ version: '3.1.0' });
    const oldFirmware = new Device({ firmwareVersion: '2.0.0' });

    await newApp.connect(oldFirmware);

    // Basic features should work
    await newApp.setTemperature(22);
    expect(await oldFirmware.getTargetTemperature()).toBe(22);

    // New features gracefully unavailable
    const geofencingResult = await newApp.enableGeofencing();
    expect(geofencingResult.supported).toBe(false);
    expect(newApp.showsFeatureUnavailableMessage()).toBe(true);
  });

  test('Old app works with new firmware', async () => {
    const oldApp = new App({ version: '2.9.0' });
    const newFirmware = new Device({ firmwareVersion: '2.3.1' });

    await oldApp.connect(newFirmware);

    // All features old app knows about should work
    await oldApp.setTemperature(22);
    expect(await newFirmware.getTargetTemperature()).toBe(22);

    // New firmware features invisible to old app (OK)
    // Old app just doesn't know about voice control, but device works fine
  });
});
```

## Firmware Update Testing

### Over-The-Air (OTA) Update Flow

```gherkin
Feature: Firmware OTA Update

Scenario: Successful firmware update
  Given device is running firmware v2.2.0
  And backend has firmware v2.3.1 available
  When app checks for updates
  Then app shows "Update Available" notification
  When user taps "Update Now"
  Then app downloads firmware package
  And app verifies package signature
  And app sends package to device
  And device validates package
  And device writes to flash memory
  And device reboots
  And device reports new version v2.3.1
  And app reconnects successfully
```

**Automated Test:**

```javascript
test('Complete OTA update flow', async () => {
  const device = new Device({ firmwareVersion: '2.2.0' });
  await app.connectToDevice(device);

  // 1. Check for updates
  const updateAvailable = await app.checkForFirmwareUpdate();
  expect(updateAvailable).toBe(true);
  expect(app.getAvailableUpdateVersion()).toBe('2.3.1');

  // 2. Download firmware package
  const downloadResult = await app.downloadFirmwareUpdate();
  expect(downloadResult.success).toBe(true);
  expect(downloadResult.size).toBeGreaterThan(0);
  expect(downloadResult.sha256).toMatch(/^[a-f0-9]{64}$/);

  // 3. Verify signature (security critical!)
  const signatureValid = await app.verifyFirmwareSignature();
  expect(signatureValid).toBe(true);

  // 4. Transfer to device
  const transferProgress = [];
  const transferResult = await app.transferFirmwareToDevice({
    onProgress: (pct) => transferProgress.push(pct)
  });

  expect(transferResult.success).toBe(true);
  expect(transferProgress[transferProgress.length - 1]).toBe(100);

  // 5. Device validates and flashes
  device.on('updateProgress', (event) => {
    console.log(`Update: ${event.stage} - ${event.percent}%`);
  });

  const updateResult = await device.applyFirmwareUpdate();
  expect(updateResult.success).toBe(true);

  // 6. Device reboots (simulate)
  await device.reboot();

  // 7. Reconnect and verify version
  await app.reconnectToDevice();
  const newVersion = await device.getFirmwareVersion();
  expect(newVersion).toBe('2.3.1');

  // 8. Verify device functionality after update
  await app.setTemperature(23);
  expect(await device.getTargetTemperature()).toBe(23);
});
```

### Failure Scenarios

Test that firmware updates fail safely.

```javascript
describe('Firmware update failure handling', () => {
  test('Update fails if battery too low', async () => {
    device.setBatteryLevel(15); // Below 20% threshold

    const result = await app.startFirmwareUpdate();

    expect(result.success).toBe(false);
    expect(result.error).toBe('BATTERY_TOO_LOW');
    expect(app.getErrorMessage()).toContain('Charge to at least 20%');
  });

  test('Update rejected if signature invalid', async () => {
    const corruptedPackage = await app.downloadFirmwareUpdate();
    corruptedPackage.signature = 'invalid_signature';

    const signatureValid = await app.verifyFirmwareSignature(corruptedPackage);
    expect(signatureValid).toBe(false);

    await expect(
      app.transferFirmwareToDevice(corruptedPackage)
    ).rejects.toThrow('INVALID_SIGNATURE');

    // Device should still be on old firmware
    expect(await device.getFirmwareVersion()).toBe('2.2.0');
  });

  test('Device rolls back if update corrupted mid-flash', async () => {
    await app.startFirmwareUpdate();

    // Simulate power loss during flash
    await device.simulatePowerLoss({ atProgress: 50 });

    // Device should still boot with old firmware
    await device.boot();
    expect(await device.getFirmwareVersion()).toBe('2.2.0');
    expect(device.getBootStatus()).toBe('RECOVERED_FROM_BAD_UPDATE');
  });

  test('Update paused and resumed on connection loss', async () => {
    const updatePromise = app.startFirmwareUpdate();

    // Simulate BLE disconnection at 30%
    await sleep(1000);
    await device.disconnect();

    // Reconnect
    await sleep(2000);
    await app.reconnectToDevice();

    // Update should resume from 30%
    const resumeResult = await app.resumeFirmwareUpdate();
    expect(resumeResult.resumedFromPercent).toBeGreaterThanOrEqual(25);

    await updatePromise;
    expect(await device.getFirmwareVersion()).toBe('2.3.1');
  });
});
```

## Version-Specific Feature Testing

### Feature Flags Based on Version

```javascript
// App feature detection
const getDeviceCapabilities = async (firmwareVersion) => {
  const capabilities = {
    temperatureControl: true, // Always supported
    scheduling: true,
    geofencing: false,
    voiceControl: false,
    energyReports: 'none'
  };

  if (semver.gte(firmwareVersion, '2.2.0')) {
    capabilities.scheduling = true;
  }

  if (semver.gte(firmwareVersion, '2.3.0')) {
    capabilities.geofencing = true;
    capabilities.energyReports = 'basic';
  }

  if (semver.gte(firmwareVersion, '2.3.1')) {
    capabilities.voiceControl = true;
    capabilities.energyReports = 'detailed';
  }

  return capabilities;
};

test('App shows correct features for firmware version', async () => {
  const deviceV220 = new Device({ firmwareVersion: '2.2.0' });
  const capsV220 = await getDeviceCapabilities(deviceV220.firmwareVersion);

  expect(capsV220.geofencing).toBe(false);
  expect(capsV220.voiceControl).toBe(false);

  const deviceV231 = new Device({ firmwareVersion: '2.3.1' });
  const capsV231 = await getDeviceCapabilities(deviceV231.firmwareVersion);

  expect(capsV231.geofencing).toBe(true);
  expect(capsV231.voiceControl).toBe(true);
  expect(capsV231.energyReports).toBe('detailed');
});
```

## Coordinated Multi-Component Releases

### Scenario: New Feature Requires Updates Across Stack

**Feature:** Voice control via Google Assistant

**Requirements:**
- Firmware v2.3.1: Add voice command parsing
- iOS App v3.1.0: Add Google Assistant integration
- Android App v3.0.5: Add Google Assistant integration
- Backend v4.2.0: Add Google Assistant webhook

**Release Strategy:**

```
Week 1: Backend v4.2.0 deployed (feature flag OFF)
Week 2: Firmware v2.3.1 released to 10% devices
Week 3: Firmware expanded to 50%, iOS app v3.1.0 released
Week 4: Android app v3.0.5 released
Week 5: Backend feature flag ON for all users
```

**Testing Strategy:**

```javascript
describe('Voice control rollout', () => {
  test('Voice control disabled if firmware too old', async () => {
    await setupVersions({
      firmware: '2.2.0',
      app: '3.1.0',
      backend: '4.2.0'
    });

    const voiceControlAvailable = await app.isVoiceControlAvailable();
    expect(voiceControlAvailable).toBe(false);
    expect(app.getVoiceControlMessage()).toBe(
      'Update device firmware to enable voice control'
    );
  });

  test('Voice control disabled if app too old', async () => {
    await setupVersions({
      firmware: '2.3.1',
      app: '3.0.0',
      backend: '4.2.0'
    });

    // Device supports it, backend supports it, but app doesn't
    const voiceControlAvailable = await app.isVoiceControlAvailable();
    expect(voiceControlAvailable).toBe(false);
  });

  test('Voice control enabled with all latest versions', async () => {
    await setupVersions({
      firmware: '2.3.1',
      app: '3.1.0',
      backend: '4.2.0'
    });

    const voiceControlAvailable = await app.isVoiceControlAvailable();
    expect(voiceControlAvailable).toBe(true);

    // Functional test
    await googleAssistant.say('Set temperature to 22 degrees');

    await waitFor(async () => {
      const temp = await device.getTargetTemperature();
      expect(temp).toBe(22);
    });
  });
});
```

## Version Deprecation Testing

Test that old versions are properly sunset.

```javascript
test('Deprecated firmware version warned in app', async () => {
  const deprecatedDevice = new Device({
    firmwareVersion: '2.1.0',
    releaseDate: '2024-01-01'
  });

  await app.connectToDevice(deprecatedDevice);

  expect(app.showsDeprecationWarning()).toBe(true);
  expect(app.getWarningMessage()).toContain(
    'Firmware v2.1.0 will be unsupported after June 1, 2026'
  );
  expect(app.getWarningActions()).toEqual([
    'Update Now',
    'Remind Me in 1 Week',
    'Learn More'
  ]);
});

test('End-of-life firmware blocked from connecting', async () => {
  const eolDevice = new Device({ firmwareVersion: '1.9.0' });

  await expect(
    app.connectToDevice(eolDevice)
  ).rejects.toThrow('FIRMWARE_END_OF_LIFE');

  expect(app.getErrorMessage()).toContain(
    'Firmware v1.9.0 is no longer supported'
  );
  expect(app.showsFirmwareUpdateRequired()).toBe(true);
});
```

## Tools and Best Practices

### 1. Firmware Version Manifest

Track all firmware versions in production.

```json
{
  "firmwareVersions": [
    {
      "version": "2.3.1",
      "releaseDate": "2025-12-01",
      "status": "stable",
      "compatibleProtocols": [2, 3],
      "features": ["geofencing", "voiceControl", "energyReports"],
      "deployment": {
        "production": "100%",
        "canary": "0%"
      }
    },
    {
      "version": "2.2.0",
      "releaseDate": "2025-06-01",
      "status": "deprecated",
      "endOfLife": "2026-06-01",
      "compatibleProtocols": [2],
      "deployment": {
        "production": "30%"
      }
    }
  ]
}
```

### 2. Automated Compatibility Checks in CI

```yaml
# .github/workflows/compatibility-check.yml
name: Version Compatibility Check

on: [pull_request]

jobs:
  compatibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check API compatibility
        run: |
          npm run check-api-compatibility
      - name: Check firmware compatibility
        run: |
          npm run check-firmware-compatibility
```

### 3. Version Analytics

Track version distribution in the field.

```javascript
// Backend analytics
const getVersionDistribution = async () => {
  const stats = await db.query(`
    SELECT
      firmware_version,
      COUNT(*) as device_count,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM devices), 2) as percentage
    FROM devices
    WHERE last_seen > NOW() - INTERVAL '30 days'
    GROUP BY firmware_version
    ORDER BY device_count DESC
  `);

  return stats;
};

// Result:
// [
//   { firmware_version: '2.3.1', device_count: 45000, percentage: 45.00 },
//   { firmware_version: '2.2.0', device_count: 30000, percentage: 30.00 },
//   ...
// ]
```

## Summary

Effective firmware ↔ software versioning requires:
- **Protocol negotiation** to handle version mismatches
- **Backward compatibility** so new software works with old firmware
- **Safe OTA updates** with rollback protection
- **Feature flags** tied to version capabilities
- **Coordinated releases** for multi-component features
- **Gradual rollouts** to minimize risk
- **Clear deprecation timelines** to sunset old versions
- **Analytics** to understand version distribution

Remember: Firmware updates are high-risk, so test thoroughly!
