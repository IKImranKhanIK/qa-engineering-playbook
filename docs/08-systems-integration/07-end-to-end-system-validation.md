# End-to-End System Validation

## Overview

End-to-end (E2E) system validation tests complete user journeys across all components: hardware device, firmware, mobile app, backend services, and third-party integrations. These tests verify the system works as a cohesive whole, not just as individual parts.

## Complete User Journeys

### Journey 1: New User Onboarding

```gherkin
Feature: New User Onboarding

Scenario: User sets up their first device
  Given user downloads the mobile app
  And creates an account
  When user taps "Add Device"
  And puts device in pairing mode
  And app discovers device via BLE
  And user selects device
  And enters WiFi credentials
  Then device connects to WiFi
  And device registers with backend
  And device syncs initial state to app
  And user sees device as "Online" in app
  And user can control device temperature
```

**Automated Test:**

```javascript
test('Complete new user onboarding flow', async () => {
  // 1. User creates account
  const user = await app.createAccount({
    email: 'newuser@example.com',
    password: 'Password123!'
  });

  expect(user.id).toBeDefined();

  // 2. Login
  await app.login('newuser@example.com', 'Password123!');
  expect(app.isLoggedIn()).toBe(true);

  // 3. Add device
  const device = new Device({ id: 'DEV-NEW-123' });
  await device.enterPairingMode();

  await app.navigateTo('AddDevice');
  await app.scanForDevices();

  const discoveredDevices = await app.getDiscoveredDevices();
  expect(discoveredDevices).toContainEqual(
    expect.objectContaining({ id: 'DEV-NEW-123' })
  );

  // 4. Pair device
  await app.selectDevice('DEV-NEW-123');
  await app.enterWiFiCredentials({
    ssid: 'TestNetwork',
    password: 'wifipass123'
  });

  // 5. Device connects
  await waitFor(async () => {
    expect(await device.isConnectedToWiFi()).toBe(true);
  }, { timeout: 30000 });

  // 6. Device registers with backend
  await waitFor(async () => {
    const backendDevice = await backend.getDevice('DEV-NEW-123');
    expect(backendDevice.status).toBe('online');
    expect(backendDevice.userId).toBe(user.id);
  }, { timeout: 10000 });

  // 7. User controls device
  await app.setTemperature(22);
  await waitFor(async () => {
    expect(await device.getTargetTemperature()).toBe(22);
  }, { timeout: 5000 });

  // 8. Verify backend received command
  const deviceHistory = await backend.getDeviceHistory('DEV-NEW-123');
  expect(deviceHistory[0]).toMatchObject({
    type: 'TEMPERATURE_SET',
    value: 22,
    userId: user.id
  });
});
```

### Journey 2: Daily Usage

```javascript
test('User daily interaction flow', async () => {
  await user.login();

  // Morning: Check current temperature
  const temp = await app.getCurrentTemperature();
  expect(temp).toBeGreaterThan(15);
  expect(temp).toBeLessThan(30);

  // Adjust temperature via app
  await app.setTemperature(21);

  // Device reflects change
  await waitFor(async () => {
    expect(await device.getTargetTemperature()).toBe(21);
  });

  // Evening: Set schedule
  await app.createSchedule({
    name: 'Weekday Morning',
    days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    time: '06:00',
    temperature: 20
  });

  // Backend stores schedule
  const schedules = await backend.getSchedules(user.id);
  expect(schedules).toContainEqual(
    expect.objectContaining({ name: 'Weekday Morning' })
  );

  // Device executes schedule (time-travel to 06:00 next Monday)
  await simulateTime('next Monday 06:00');
  await waitFor(async () => {
    expect(await device.getTargetTemperature()).toBe(20);
  });
});
```

### Journey 3: Multi-Device Coordination

```javascript
test('User manages multiple devices', async () => {
  const user = await createUser();
  const livingRoom = new Device({ id: 'LR-001', name: 'Living Room' });
  const bedroom = new Device({ id: 'BR-001', name: 'Bedroom' });

  // Add both devices
  await app.addDevice(livingRoom);
  await app.addDevice(bedroom);

  // Create home group
  await app.createHome({
    name: 'My Home',
    devices: ['LR-001', 'BR-001']
  });

  // Set all devices to same temperature
  await app.setHomeTemperature('My Home', 22);

  // Both devices update
  await waitFor(async () => {
    expect(await livingRoom.getTargetTemperature()).toBe(22);
    expect(await bedroom.getTargetTemperature()).toBe(22);
  });

  // Leave home mode (geofencing)
  await app.simulateUserLocation({ lat: 40.7128, lng: -74.0060 }); // Away from home

  await waitFor(async () => {
    // Devices enter away mode (energy saving)
    expect(await livingRoom.getMode()).toBe('AWAY');
    expect(await bedroom.getMode()).toBe('AWAY');
  }, { timeout: 30000 });
});
```

## Cross-Component Integration Tests

### Voice Assistant Integration

```javascript
test('Voice control via Google Assistant', async () => {
  // Setup
  await user.linkGoogleAccount();
  await googleHome.syncDevices();

  // Voice command
  await googleAssistant.say('Set bedroom temperature to 23 degrees');

  // Command flows through: Google → Backend → Device
  await waitFor(async () => {
    const device = await backend.getDevice('BR-001');
    expect(device.targetTemperature).toBe(23);
    expect(await physicalDevice.getTargetTemperature()).toBe(23);
  }, { timeout: 10000 });

  // Status query
  const response = await googleAssistant.ask('What is the bedroom temperature?');
  expect(response).toContain('23 degrees');
});
```

### Firmware Update Journey

```javascript
test('Complete firmware update journey', async () => {
  const device = new Device({ firmwareVersion: '2.2.0' });

  // 1. Backend publishes new firmware
  await backend.publishFirmware({
    version: '2.3.1',
    url: 'https://cdn.example.com/firmware-2.3.1.bin',
    rolloutPercentage: 100
  });

  // 2. App checks for update (automatic background check)
  await app.checkForUpdates();

  // 3. User sees notification
  expect(app.hasNotification('UPDATE_AVAILABLE')).toBe(true);

  // 4. User taps "Update"
  await app.tapNotification('UPDATE_AVAILABLE');
  await app.confirmUpdate();

  // 5. Update process
  const updateProgress = [];
  device.on('updateProgress', (pct) => updateProgress.push(pct));

  await device.performUpdate();

  // 6. Verify completion
  expect(updateProgress[updateProgress.length - 1]).toBe(100);
  expect(await device.getFirmwareVersion()).toBe('2.3.1');

  // 7. Backend confirms
  const deviceInfo = await backend.getDevice(device.id);
  expect(deviceInfo.firmwareVersion).toBe('2.3.1');
  expect(deviceInfo.lastUpdateTime).toBeDefined();
});
```

## Performance & Load Testing

### System Under Load

```javascript
test('System handles 10,000 concurrent users', async () => {
  const users = Array.from({ length: 10000 }, (_, i) => ({
    id: `user-${i}`,
    deviceId: `DEV-${i}`
  }));

  // All users set temperature simultaneously
  const start = Date.now();

  await Promise.all(
    users.map(async (u) => {
      await backend.setDeviceTemperature(u.deviceId, 22, {
        userId: u.id
      });
    })
  );

  const duration = Date.now() - start;

  // All commands processed within 5 seconds
  expect(duration).toBeLessThan(5000);

  // Verify backend metrics
  const metrics = await backend.getMetrics();
  expect(metrics.avgResponseTime).toBeLessThan(100); // < 100ms
  expect(metrics.errorRate).toBeLessThan(0.01); // < 1% errors
});
```

## Chaos Engineering

Inject failures to test resilience.

```javascript
test('System recovers from backend outage', async () => {
  // User controls device
  await app.setTemperature(22);
  expect(await device.getTargetTemperature()).toBe(22);

  // Backend goes down
  await backend.simulateOutage({ duration: 60000 }); // 60s

  // App enters offline mode
  expect(app.getConnectionStatus()).toBe('OFFLINE');

  // User can still control device via BLE
  await app.setTemperature(23);
  expect(await device.getTargetTemperature()).toBe(23);

  // Backend recovers
  await sleep(60000);

  // App reconnects
  await waitFor(() => {
    expect(app.getConnectionStatus()).toBe('ONLINE');
  }, { timeout: 30000 });

  // Pending changes sync
  const deviceState = await backend.getDevice(device.id);
  expect(deviceState.targetTemperature).toBe(23);
});
```

## E2E Test Suite Structure

```javascript
describe('E2E System Validation', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
    await backend.reset();
    await devices.reset();
  });

  describe('User Journeys', () => {
    test('New user onboarding');
    test('Daily usage');
    test('Multi-device management');
    test('Firmware update');
  });

  describe('Integrations', () => {
    test('Google Home integration');
    test('Alexa integration');
    test('IFTTT webhooks');
  });

  describe('Resilience', () => {
    test('Backend outage recovery');
    test('WiFi reconnection');
    test('Device power cycle');
  });

  describe('Performance', () => {
    test('10K concurrent users');
    test('1M devices registered');
    test('10K devices updating simultaneously');
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });
});
```

## E2E Testing Best Practices

1. **Test real user workflows**, not just API calls
2. **Use production-like data** volumes
3. **Include third-party services** (don't mock everything)
4. **Test failure scenarios** (chaos engineering)
5. **Monitor performance metrics** (latency, throughput)
6. **Run on schedule** (nightly E2E test suite)
7. **Maintain test data** (clean up after tests)

## Summary

End-to-end validation ensures:
- **Complete user journeys work** across all components
- **Third-party integrations** function correctly
- **System handles load** and recovers from failures
- **Performance meets SLAs** under realistic conditions

E2E tests catch integration issues that unit and component tests miss. Run them regularly to ensure system health.
