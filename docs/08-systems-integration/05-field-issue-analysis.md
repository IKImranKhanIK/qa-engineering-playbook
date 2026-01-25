# Field Issue Analysis

## Overview

Field issues are bugs that escape to production and affect real users. Analyzing and reproducing these issues is critical for systems with hardware, firmware, and software components. Unlike lab testing, field issues occur in unpredictable real-world conditions.

## Common Field Issue Patterns

### 1. Environmental Factors

Issues that only occur in specific environments.

**Example: Temperature-related failure**

```
Issue: Device stops responding after 6 months in Arizona
Root Cause: Ambient temperature >40°C caused thermal throttling
Lab Miss: All testing done at 20-25°C room temperature
```

**How to Test:**
```javascript
test('Device operates in extreme temperatures', async () => {
  const tempChamber = new EnvironmentalChamber();

  // Simulate Arizona summer
  await tempChamber.setTemperature(45); // 45°C / 113°F
  await device.operateFor({ hours: 24 });

  expect(await device.isResponsive()).toBe(true);
  expect(await device.getCPUTemp()).toBeLessThan(85); // Safe limit
});
```

### 2. Long-Running Issues

Problems that emerge after extended use.

**Example: Memory leak after 30 days uptime**

```
Issue: Device becomes unresponsive after ~1 month
Root Cause: Memory leak in temperature logging (10KB/day)
Lab Miss: Testing only ran for 48 hours max
```

**How to Test:**
```javascript
test('No memory leak over 30 days', async () => {
  const initialMemory = await device.getFreeMemory();

  // Simulate 30 days of operation (time-accelerated)
  await device.simulateOperation({
    duration: '30 days',
    acceleration: 1000 // 1 day = 1.44 minutes
  });

  const finalMemory = await device.getFreeMemory();
  const memoryDelta = initialMemory - finalMemory;

  // Allow small memory growth, but not >10% of total
  expect(memoryDelta).toBeLessThan(initialMemory * 0.1);
});
```

### 3. Network Variability

Real networks are unreliable in ways labs aren't.

**Example: Device fails to reconnect after WiFi outage**

```
Issue: 15% of devices don't reconnect after WiFi router restart
Root Cause: Retry logic times out if router takes >60s to come back
Lab Miss: Test WiFi always recovered in <10s
```

**How to Test:**
```javascript
test('Device reconnects after prolonged WiFi outage', async () => {
  await device.connect();

  // Simulate router restart (90s downtime)
  await network.disconnectWiFi();
  await sleep(90000);
  await network.reconnectWiFi();

  // Device should eventually reconnect
  await waitFor(async () => {
    expect(await device.isConnected()).toBe(true);
  }, { timeout: 180000 }); // 3 minute timeout

  // Verify device is functional
  await device.setTemperature(22);
  expect(await device.getTargetTemperature()).toBe(22);
});
```

## Reproducing Field Issues

### 1. Gather Diagnostic Data

Collect logs and telemetry from affected devices.

**Example: Remote diagnostics**

```javascript
const analyzeFieldIssue = async (deviceId, issueTicket) => {
  // 1. Get device logs from cloud
  const logs = await backend.getDeviceLogs(deviceId, {
    start: issueTicket.reportedAt - 86400000, // 24h before
    end: issueTicket.reportedAt
  });

  // 2. Parse for errors
  const errors = logs.filter(log => log.level === 'ERROR');

  // 3. Get firmware version
  const device = await backend.getDevice(deviceId);

  // 4. Get network history
  const networkEvents = logs.filter(log =>
    log.event.includes('WIFI_DISCONNECT') ||
    log.event.includes('RECONNECT')
  );

  return {
    deviceId,
    firmwareVersion: device.firmwareVersion,
    errors: errors.length,
    commonErrors: groupBy(errors, 'message'),
    networkDisconnects: networkEvents.length,
    lastSeen: device.lastSeen
  };
};

// Example output:
// {
//   deviceId: 'DEV-123',
//   firmwareVersion: '2.2.0',
//   errors: 15,
//   commonErrors: {
//     'MQTT_PUBLISH_FAILED': 10,
//     'HEAP_ALLOC_FAILED': 5
//   },
//   networkDisconnects: 3,
//   lastSeen: '2025-01-24T10:35:00Z'
// }
```

### 2. Recreate User Environment

Simulate the specific conditions from the field report.

```javascript
test('Reproduce issue #1234: Device unresponsive', async () => {
  // Issue details from field:
  // - Firmware: v2.2.0
  // - WiFi: 2.4GHz, weak signal (-75 dBm)
  // - Uptime: 45 days
  // - Last action: Temperature schedule update

  await device.flashFirmware('2.2.0');
  await network.setWiFiSignalStrength(-75); // Weak signal
  await device.simulateUptime({ days: 45 });

  // Reproduce user action
  const result = await device.updateSchedule({
    monday: [{ time: '06:00', temp: 20 }, { time: '22:00', temp: 18 }],
    tuesday: [{ time: '06:00', temp: 20 }, { time: '22:00', temp: 18 }]
    // ... rest of week
  });

  // Check if device becomes unresponsive
  expect(await device.ping({ timeout: 5000 })).toBe(true);
});
```

### 3. Statistical Analysis

Analyze patterns across multiple field reports.

```javascript
const analyzeFieldTrends = async () => {
  const issues = await backend.getFieldIssues({
    status: 'OPEN',
    last30Days: true
  });

  const analysis = {
    byFirmwareVersion: groupAndCount(issues, 'firmwareVersion'),
    byDeviceModel: groupAndCount(issues, 'deviceModel'),
    byNetworkType: groupAndCount(issues, 'networkType'),
    byGeography: groupAndCount(issues, 'country'),
    byUptime: {
      '<7days': issues.filter(i => i.uptime < 7).length,
      '7-30days': issues.filter(i => i.uptime >= 7 && i.uptime < 30).length,
      '>30days': issues.filter(i => i.uptime >= 30).length
    }
  };

  return analysis;
};

// Example output:
// {
//   byFirmwareVersion: {
//     '2.2.0': 45,  // ← Spike! Investigate
//     '2.3.0': 5,
//     '2.3.1': 2
//   },
//   byUptime: {
//     '<7days': 3,
//     '7-30days': 8,
//     '>30days': 41  // ← Issues occur after long uptime
//   }
// }
```

## Root Cause Analysis

### 5 Whys Technique

```
Issue: Device loses WiFi connection and never reconnects

Why #1: Why doesn't it reconnect?
→ Because the reconnect timer expires

Why #2: Why does the timer expire?
→ Because it's set to 60 seconds, but router takes 90s to restart

Why #3: Why is the timer only 60 seconds?
→ Because we assumed routers restart in <30s

Why #4: Why did we assume that?
→ Because our lab router restarts in 15s

Why #5: Why didn't we test with slower routers?
→ Because we only had one router model in the lab

Root Cause: Insufficient test coverage of router restart times
Fix: Increase timer to 180s and test with multiple router brands
```

### Binary Search for Regression

Find which firmware version introduced a bug.

```javascript
const findRegressionVersion = async (goodVersion, badVersion) => {
  const versions = await getAllVersionsBetween(goodVersion, badVersion);

  while (versions.length > 1) {
    const midpoint = Math.floor(versions.length / 2);
    const testVersion = versions[midpoint];

    console.log(`Testing version ${testVersion}...`);
    await device.flashFirmware(testVersion);
    const bugPresent = await reproduceBug();

    if (bugPresent) {
      // Bug is in this version or earlier
      versions = versions.slice(0, midpoint + 1);
    } else {
      // Bug introduced after this version
      versions = versions.slice(midpoint + 1);
    }
  }

  return versions[0]; // First version with bug
};

// Example:
// Versions: 2.0.0 (good), 2.1.0, 2.2.0, 2.3.0, 2.3.1 (bad)
// Test 2.2.0 → bug present → test 2.1.0 → no bug
// Result: Bug introduced in v2.2.0
```

## Implementing Field Monitoring

### Telemetry Collection

```javascript
// Device firmware sends telemetry
const reportTelemetry = () => {
  const telemetry = {
    deviceId: getDeviceId(),
    timestamp: Date.now(),
    uptime: getUptimeSeconds(),
    freeHeap: getFreeHeap(),
    wifiRSSI: getWiFiSignalStrength(),
    cpuTemp: getCPUTemperature(),
    errorCount: getErrorCount(),
    lastError: getLastError(),
    firmwareVersion: getFirmwareVersion()
  };

  sendToCloud('telemetry', telemetry);
};

// Call every 15 minutes
setInterval(reportTelemetry, 900000);
```

### Anomaly Detection

```javascript
const detectAnomalies = async (deviceId) => {
  const telemetry = await backend.getTelemetry(deviceId, {
    last: '7 days'
  });

  const anomalies = [];

  // Check for memory leak
  const heapTrend = telemetry.map(t => t.freeHeap);
  if (isDecreasing(heapTrend)) {
    anomalies.push({
      type: 'MEMORY_LEAK',
      severity: 'HIGH',
      detail: `Free heap decreased from ${heapTrend[0]} to ${heapTrend[heapTrend.length - 1]} over 7 days`
    });
  }

  // Check for WiFi instability
  const avgRSSI = average(telemetry.map(t => t.wifiRSSI));
  if (avgRSSI < -75) {
    anomalies.push({
      type: 'WEAK_WIFI',
      severity: 'MEDIUM',
      detail: `Average WiFi signal: ${avgRSSI} dBm (weak)`
    });
  }

  // Check for temperature issues
  const maxCPUTemp = Math.max(...telemetry.map(t => t.cpuTemp));
  if (maxCPUTemp > 80) {
    anomalies.push({
      type: 'OVERHEATING',
      severity: 'HIGH',
      detail: `Max CPU temp: ${maxCPUTemp}°C (limit: 80°C)`
    });
  }

  return anomalies;
};
```

## A/B Testing for Fixes

Test fixes on a subset of devices before full rollout.

```javascript
test('A/B test firmware fix for reconnect issue', async () => {
  // Group A: 10% of devices get fix (v2.2.1)
  const groupA = await backend.getDevices({ canaryGroup: 'A' });
  for (const device of groupA) {
    await device.updateFirmware('2.2.1');
  }

  // Group B: 90% stay on old version (v2.2.0)
  const groupB = await backend.getDevices({ canaryGroup: 'B' });

  // Wait 7 days
  await sleep(7 * 86400000);

  // Measure reconnect failure rate
  const groupAFailures = await backend.getReconnectFailures(groupA);
  const groupBFailures = await backend.getReconnectFailures(groupB);

  const groupARate = groupAFailures.length / groupA.length;
  const groupBRate = groupBFailures.length / groupB.length;

  console.log(`Group A (fix): ${groupARate * 100}% failure rate`);
  console.log(`Group B (old): ${groupBRate * 100}% failure rate`);

  // If fix reduces failures by >80%, roll out to all
  if (groupARate < groupBRate * 0.2) {
    await backend.rolloutFirmware('2.2.1', { percentage: 100 });
  }
});
```

## Field Issue Checklist

- [ ] Collect device logs and telemetry
- [ ] Identify firmware/app versions involved
- [ ] Determine affected device percentage
- [ ] Check for environmental factors (temp, WiFi, uptime)
- [ ] Reproduce issue in lab
- [ ] Perform root cause analysis (5 Whys)
- [ ] Implement fix
- [ ] Test fix in lab
- [ ] A/B test fix in field (canary rollout)
- [ ] Monitor post-fix metrics
- [ ] Update test suite to catch regression

## Summary

Effective field issue analysis requires:
- **Comprehensive telemetry** to diagnose remotely
- **Reproduce real-world conditions** in the lab
- **Statistical analysis** to identify patterns
- **Root cause analysis** beyond symptoms
- **Gradual fix deployment** to minimize risk
- **Continuous monitoring** post-fix

Field issues teach you what lab testing missed. Update your test strategy based on every field issue to prevent recurrence.
