# OTA Update Testing

## Overview

Over-The-Air (OTA) updates allow devices to receive firmware updates remotely without physical access. OTA testing is critical because failed updates can brick devices, and success rates directly impact customer satisfaction and support costs.

## OTA Update Flow

```
1. Backend publishes new firmware
2. Device checks for updates (poll or push notification)
3. Device downloads update package
4. Device verifies signature/checksum
5. Device writes to flash memory
6. Device validates new firmware
7. Device reboots with new firmware
8. Device reports success/failure to backend
```

## Test Categories

### 1. Happy Path

**Scenario:** Perfect conditions, update succeeds

```javascript
test('Successful OTA update from v2.2.0 to v2.3.1', async () => {
  const device = new Device({ firmwareVersion: '2.2.0' });

  // 1. Device checks for updates
  const updateAvailable = await device.checkForUpdate();
  expect(updateAvailable).toMatchObject({
    available: true,
    version: '2.3.1',
    size: 524288, // 512KB
    url: expect.stringMatching(/^https:\/\//),
    checksum: expect.stringMatching(/^[a-f0-9]{64}$/)
  });

  // 2. Download firmware
  const download = await device.downloadUpdate({
    onProgress: (pct) => console.log(`Download: ${pct}%`)
  });

  expect(download.success).toBe(true);
  expect(download.size).toBe(524288);

  // 3. Verify checksum
  const checksumValid = await device.verifyChecksum();
  expect(checksumValid).toBe(true);

  // 4. Apply update
  const updateResult = await device.applyUpdate();
  expect(updateResult.success).toBe(true);

  // 5. Device reboots
  await device.waitForReboot();

  // 6. Verify new version
  const newVersion = await device.getFirmwareVersion();
  expect(newVersion).toBe('2.3.1');

  // 7. Verify functionality
  await device.setTemperature(22);
  expect(await device.getTargetTemperature()).toBe(22);

  // 8. Backend receives confirmation
  const deviceInfo = await backend.getDevice(device.id);
  expect(deviceInfo.firmwareVersion).toBe('2.3.1');
  expect(deviceInfo.lastUpdateStatus).toBe('SUCCESS');
});
```

### 2. Download Failures

**Test interrupted downloads**

```javascript
test('Download interrupted - resumes from checkpoint', async () => {
  await device.startDownload();

  // Simulate network loss at 50%
  await sleep(2000);
  await network.disconnect();

  // Wait, then reconnect
  await sleep(5000);
  await network.reconnect();

  // Download should resume
  const resumeResult = await device.resumeDownload();

  expect(resumeResult.resumedFrom).toBeGreaterThanOrEqual(50);
  expect(resumeResult.success).toBe(true);

  await device.applyUpdate();
  expect(await device.getFirmwareVersion()).toBe('2.3.1');
});

test('Download corrupted - checksum fails', async () => {
  const downloadSpy = jest.spyOn(device, 'downloadUpdate');

  // Inject corruption
  downloadSpy.mockImplementation(async () => ({
    success: true,
    data: corruptedFirmwareData
  }));

  await device.downloadUpdate();
  const checksumValid = await device.verifyChecksum();

  expect(checksumValid).toBe(false);
  expect(device.getLastError()).toBe('CHECKSUM_MISMATCH');

  // Device should not apply corrupted firmware
  await expect(device.applyUpdate()).rejects.toThrow('INVALID_FIRMWARE');

  // Still on old version
  expect(await device.getFirmwareVersion()).toBe('2.2.0');
});
```

### 3. Power Loss During Update

**Most critical failure mode - can brick device**

```javascript
test('Power loss during flash - device recovers', async () => {
  await device.startUpdate();

  // Simulate power loss at 50% flash progress
  await device.simulatePowerLoss({ atProgress: 50 });

  // Device should still boot (from backup partition)
  await device.powerOn();

  expect(await device.getFirmwareVersion()).toBe('2.2.0'); // Old version
  expect(device.getBootStatus()).toBe('RECOVERED_FROM_BAD_UPDATE');

  // User can retry update
  await device.retryUpdate();
  expect(await device.getFirmwareVersion()).toBe('2.3.1');
});

test('Power loss before commit - rollback to old firmware', async () => {
  await device.downloadUpdate();
  await device.flashUpdate(); // Writes new firmware to alternate partition

  // Power loss before marking new firmware as "good"
  await device.simulatePowerLoss({ beforeCommit: true });

  await device.powerOn();

  // Should boot old firmware
  expect(await device.getFirmwareVersion()).toBe('2.2.0');
  expect(device.getPendingUpdate()).toBe('2.3.1'); // Available to retry
});
```

### 4. Low Battery

**Prevent update if battery too low**

```javascript
test('Update blocked if battery <20%', async () => {
  device.setBatteryLevel(15);

  const updateCheck = await device.checkForUpdate();
  expect(updateCheck.available).toBe(true);

  const updateResult = await device.startUpdate();

  expect(updateResult.success).toBe(false);
  expect(updateResult.error).toBe('BATTERY_TOO_LOW');
  expect(device.getErrorMessage()).toContain('Charge to at least 20%');
});

test('Update proceeds with sufficient battery', async () => {
  device.setBatteryLevel(80);

  const updateResult = await device.startUpdate();
  expect(updateResult.success).toBe(true);
});

test('Battery depletes during download - pauses and resumes', async () => {
  device.setBatteryLevel(25);

  const updatePromise = device.startUpdate();

  // Simulate battery drain during download
  setTimeout(() => device.setBatteryLevel(15), 2000);

  const result = await updatePromise;

  expect(result.paused).toBe(true);
  expect(result.reason).toBe('BATTERY_LOW');

  // Charge battery
  device.setBatteryLevel(50);

  // Update auto-resumes
  await waitFor(async () => {
    expect(await device.getFirmwareVersion()).toBe('2.3.1');
  }, { timeout: 60000 });
});
```

### 5. Version Validation

**Prevent downgrades and invalid versions**

```javascript
test('Downgrade blocked', async () => {
  const device = new Device({ firmwareVersion: '2.3.1' });

  // Try to downgrade to 2.2.0
  const downgradeFirmware = {
    version: '2.2.0',
    url: 'https://example.com/firmware-2.2.0.bin',
    checksum: '...'
  };

  const result = await device.applyUpdate(downgradeFirmware);

  expect(result.success).toBe(false);
  expect(result.error).toBe('DOWNGRADE_NOT_ALLOWED');
  expect(await device.getFirmwareVersion()).toBe('2.3.1'); // Unchanged
});

test('Same version skipped', async () => {
  const device = new Device({ firmwareVersion: '2.3.1' });

  const updateCheck = await device.checkForUpdate();

  expect(updateCheck.available).toBe(false);
  expect(updateCheck.message).toBe('Already on latest version');
});

test('Incompatible version rejected', async () => {
  const device = new Device({
    model: 'Thermostat-V1',
    firmwareVersion: '2.3.1'
  });

  // Try to install V2 firmware on V1 hardware
  const incompatibleFirmware = {
    version: '3.0.0',
    targetModel: 'Thermostat-V2',
    url: '...'
  };

  const result = await device.applyUpdate(incompatibleFirmware);

  expect(result.success).toBe(false);
  expect(result.error).toBe('INCOMPATIBLE_HARDWARE');
});
```

### 6. Concurrent Updates

**Multiple devices updating simultaneously**

```javascript
test('Backend handles 1000 devices updating concurrently', async () => {
  const devices = Array.from({ length: 1000 }, (_, i) =>
    new Device({ id: `DEV-${i}`, firmwareVersion: '2.2.0' })
  );

  // All devices check for updates simultaneously
  const updateChecks = await Promise.all(
    devices.map(d => d.checkForUpdate())
  );

  expect(updateChecks.every(check => check.available)).toBe(true);

  // All devices start downloading
  const downloads = await Promise.all(
    devices.map(d => d.downloadUpdate())
  );

  // Backend should not rate-limit or fail
  expect(downloads.every(dl => dl.success)).toBe(true);

  // Verify backend metrics
  const backendStats = await backend.getUpdateStats();
  expect(backendStats.concurrentDownloads).toBeLessThan(1000); // Staggered
  expect(backendStats.bandwidth).toBeLessThan(100 * 1024 * 1024); // <100 MB/s
});
```

### 7. Rollback Testing

**Automatic rollback if new firmware is bad**

```javascript
test('Automatic rollback if new firmware crashes', async () => {
  const device = new Device({ firmwareVersion: '2.2.0' });

  // Update to buggy firmware v2.3.0-beta
  await device.downloadUpdate({ version: '2.3.0-beta' });
  await device.applyUpdate();
  await device.reboot();

  // New firmware crashes on boot (simulated)
  const bootCount = await device.getBootAttempts();

  if (bootCount >= 3) {
    // Automatic rollback after 3 failed boot attempts
    await device.rollbackToPreviousFirmware();
  }

  await device.reboot();

  // Should be back on old version
  expect(await device.getFirmwareVersion()).toBe('2.2.0');
  expect(device.getBootStatus()).toBe('ROLLED_BACK');

  // Backend receives rollback notification
  const deviceInfo = await backend.getDevice(device.id);
  expect(deviceInfo.lastUpdateStatus).toBe('ROLLED_BACK');
  expect(deviceInfo.rollbackReason).toBe('BOOT_LOOP');
});
```

## Gradual Rollout Testing

**Canary deployments to minimize risk**

```javascript
test('Canary rollout - 1% → 10% → 100%', async () => {
  const allDevices = await backend.getAllDevices();

  // Stage 1: 1% canary
  await backend.setUpdatePolicy({
    version: '2.3.1',
    rolloutPercentage: 1
  });

  await sleep(3600000); // Wait 1 hour

  const canaryDevices = allDevices.filter(d =>
    d.availableUpdate === '2.3.1'
  );

  expect(canaryDevices.length).toBeCloseTo(allDevices.length * 0.01, 0);

  // Check canary metrics
  const canaryStats = await backend.getUpdateStats({ version: '2.3.1' });

  if (canaryStats.successRate > 0.95 && canaryStats.rollbackRate < 0.01) {
    // Stage 2: Expand to 10%
    await backend.setUpdatePolicy({
      version: '2.3.1',
      rolloutPercentage: 10
    });

    await sleep(7200000); // Wait 2 hours

    const stage2Stats = await backend.getUpdateStats({ version: '2.3.1' });

    if (stage2Stats.successRate > 0.95) {
      // Stage 3: Full rollout
      await backend.setUpdatePolicy({
        version: '2.3.1',
        rolloutPercentage: 100
      });
    }
  }
});
```

## OTA Update Metrics

Track success and failure rates.

```javascript
const getOTAMetrics = async (version) => {
  const updates = await backend.getUpdateAttempts({ version });

  const metrics = {
    total: updates.length,
    successful: updates.filter(u => u.status === 'SUCCESS').length,
    failed: updates.filter(u => u.status === 'FAILED').length,
    rolledBack: updates.filter(u => u.status === 'ROLLED_BACK').length,
    inProgress: updates.filter(u => u.status === 'IN_PROGRESS').length,

    failureReasons: groupAndCount(
      updates.filter(u => u.status === 'FAILED'),
      'errorCode'
    ),

    averageDownloadTime: average(updates.map(u => u.downloadDuration)),
    averageUpdateTime: average(updates.map(u => u.totalDuration)),

    successRate: 0
  };

  metrics.successRate = (metrics.successful / metrics.total) * 100;

  return metrics;
};

// Example output:
// {
//   total: 10000,
//   successful: 9850,
//   failed: 100,
//   rolledBack: 50,
//   successRate: 98.5,
//   failureReasons: {
//     'CHECKSUM_MISMATCH': 40,
//     'BATTERY_TOO_LOW': 30,
//     'DOWNLOAD_FAILED': 20,
//     'FLASH_ERROR': 10
//   },
//   averageDownloadTime: 120000, // 2 minutes
//   averageUpdateTime: 300000     // 5 minutes
// }
```

## OTA Test Checklist

- [ ] Happy path (successful update)
- [ ] Download interruption and resume
- [ ] Checksum/signature validation
- [ ] Power loss during flash
- [ ] Low battery scenarios
- [ ] Downgrade protection
- [ ] Hardware incompatibility
- [ ] Concurrent updates (load testing)
- [ ] Automatic rollback on failure
- [ ] Gradual rollout (canary)
- [ ] Update metrics and monitoring

## Summary

OTA testing requires:
- **Failure injection** (power loss, network, corruption)
- **Safety mechanisms** (battery checks, rollback, checksums)
- **Gradual rollouts** to minimize risk
- **Monitoring** of success rates and failure patterns
- **Robust recovery** from all failure modes

A single OTA failure in production can brick thousands of devices. Test thoroughly!
