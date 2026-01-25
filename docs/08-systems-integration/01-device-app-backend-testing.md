# Device + App + Backend Testing

## Overview

Systems integration testing validates that hardware devices, mobile/web applications, and backend services work together seamlessly. This is critical for IoT products, smart devices, and connected systems where multiple components must communicate reliably.

## The Integration Stack

### Typical Architecture

```
┌─────────────┐
│   Device    │ ← Hardware (sensors, controllers, displays)
│  (Firmware) │
└──────┬──────┘
       │ BLE/WiFi/Cellular
┌──────▼──────┐
│ Mobile App  │ ← iOS/Android application
│  (Client)   │
└──────┬──────┘
       │ HTTPS/WebSocket
┌──────▼──────┐
│   Backend   │ ← Cloud services, APIs, databases
│  (Services) │
└─────────────┘
```

## Testing Challenges

### 1. Multiple Communication Protocols

**Challenge:** Different layers use different protocols (BLE, HTTPS, MQTT, WebSocket).

**Test Approach:**
- Validate each protocol independently first
- Test protocol fallback/reconnection logic
- Verify data format consistency across layers

**Example Test Case:**
```javascript
// Device → App → Backend data flow test
test('Temperature data flows from device to backend', async () => {
  // 1. Device sends BLE packet
  const blePayload = { temp: 23.5, unit: 'C' };
  await device.sendBLEData(blePayload);

  // 2. App receives and transforms
  await waitFor(() => {
    expect(app.getTemperature()).toBe(23.5);
  });

  // 3. App sends to backend via HTTPS
  const apiPayload = await app.syncToBackend();
  expect(apiPayload).toMatchObject({
    deviceId: 'DEV-001',
    temperature: 23.5,
    unit: 'celsius'
  });

  // 4. Backend stores correctly
  const dbRecord = await db.query('SELECT * FROM readings WHERE device_id = ?', ['DEV-001']);
  expect(dbRecord.temperature).toBe(23.5);
});
```

### 2. Timing and Synchronization

**Challenge:** Components operate at different speeds; race conditions can occur.

**Test Scenarios:**
- Device sends data faster than app can process
- Backend response arrives after timeout
- Multiple devices sending simultaneously

**Example Test:**
```javascript
test('App handles burst data from device', async () => {
  // Simulate device sending 100 readings in 1 second
  const readings = Array.from({ length: 100 }, (_, i) => ({
    timestamp: Date.now() + i * 10,
    value: Math.random() * 100
  }));

  await device.sendBurstData(readings);

  // App should queue and process all
  await waitFor(() => {
    expect(app.getQueueSize()).toBe(0);
    expect(app.getProcessedCount()).toBe(100);
  }, { timeout: 5000 });
});
```

### 3. State Synchronization

**Challenge:** Each layer maintains state; they can get out of sync.

**Test Matrix:**

| Scenario | Device State | App State | Backend State | Expected Outcome |
|----------|--------------|-----------|---------------|------------------|
| Happy path | ON | ON | ON | All synced ✅ |
| App offline | ON | OFFLINE | ON | Device buffers data |
| Backend down | ON | ON | ERROR | App shows offline mode |
| State conflict | HEATING | COOLING | HEATING | Backend wins, app updates |

**Test Implementation:**
```javascript
test('State conflict resolution - backend wins', async () => {
  // 1. Device thinks it's heating
  await device.setState('HEATING');

  // 2. Backend has it as cooling (user changed via web)
  await backend.setState(deviceId, 'COOLING');

  // 3. App syncs and updates device
  await app.sync();

  // 4. Verify device state updated
  const finalState = await device.getState();
  expect(finalState).toBe('COOLING');
});
```

## Integration Test Patterns

### 1. End-to-End User Flows

Test complete user journeys that span all three layers.

**Example: Pair New Device**

```gherkin
Feature: Device Pairing

Scenario: User pairs a new device
  Given a new device in pairing mode
  And the mobile app is open
  When user taps "Add Device"
  And selects the device from BLE scan
  And enters WiFi credentials
  Then device connects to WiFi
  And device registers with backend
  And app shows device as "Connected"
  And backend shows device status as "Online"
```

**Automated Test:**
```javascript
test('Complete device pairing flow', async () => {
  // Step 1: Device advertising via BLE
  await device.startPairingMode();

  // Step 2: App discovers device
  await app.scanForDevices();
  const devices = await app.getDiscoveredDevices();
  expect(devices).toContainEqual(expect.objectContaining({
    name: 'SmartThermostat-ABC123'
  }));

  // Step 3: User selects and pairs
  await app.selectDevice('SmartThermostat-ABC123');
  await app.enterWiFiCredentials('MyNetwork', 'password123');

  // Step 4: Device connects to WiFi and backend
  await waitFor(async () => {
    const status = await backend.getDeviceStatus(deviceId);
    expect(status).toBe('online');
  }, { timeout: 30000 });

  // Step 5: Verify in app
  const deviceInApp = await app.getDevice(deviceId);
  expect(deviceInApp.connectionStatus).toBe('connected');
});
```

### 2. Failure Injection Testing

Intentionally break components to verify graceful degradation.

**Test Scenarios:**

```javascript
describe('Failure handling', () => {
  test('Device loses WiFi mid-operation', async () => {
    await device.connect();
    await app.setTemperature(25);

    // Simulate WiFi loss
    await network.disconnectDevice();

    // Device should buffer command
    expect(await device.hasBufferedCommands()).toBe(true);

    // Reconnect
    await network.reconnectDevice();

    // Command should apply
    await waitFor(async () => {
      expect(await device.getTargetTemperature()).toBe(25);
    });
  });

  test('Backend API timeout', async () => {
    await backend.setResponseDelay(10000); // 10s delay

    const result = await app.syncData({ timeout: 3000 });

    expect(result.status).toBe('timeout');
    expect(app.getOfflineMode()).toBe(true);

    // User should see cached data
    expect(await app.canViewHistoricalData()).toBe(true);
  });
});
```

### 3. Data Consistency Testing

Verify data integrity across all layers.

**Test Pattern:**
```javascript
test('Data consistency across stack', async () => {
  const testData = {
    deviceId: 'DEV-123',
    readings: [
      { timestamp: '2025-01-01T10:00:00Z', temp: 22.0 },
      { timestamp: '2025-01-01T10:05:00Z', temp: 22.5 },
      { timestamp: '2025-01-01T10:10:00Z', temp: 23.0 }
    ]
  };

  // 1. Device records locally
  await device.recordReadings(testData.readings);

  // 2. App syncs from device
  await app.syncFromDevice();
  const appData = await app.getReadings(testData.deviceId);
  expect(appData).toEqual(testData.readings);

  // 3. App uploads to backend
  await app.uploadToBackend();

  // 4. Backend stores
  const backendData = await backend.getReadings(testData.deviceId, {
    start: '2025-01-01T10:00:00Z',
    end: '2025-01-01T10:15:00Z'
  });

  // Verify all layers have same data
  expect(backendData).toEqual(testData.readings);

  // 5. Fresh app install pulls from backend
  const freshApp = new AppInstance();
  await freshApp.login('user@example.com');
  const syncedData = await freshApp.getReadings(testData.deviceId);
  expect(syncedData).toEqual(testData.readings);
});
```

## Test Environment Setup

### 1. Mock Devices

Use simulators or mock hardware for repeatable testing.

```javascript
// Mock device that simulates BLE behavior
class MockDevice {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.state = 'OFF';
    this.buffer = [];
  }

  async sendBLEData(data) {
    // Simulate BLE transmission delay
    await sleep(50);
    this.bleClient.emit('data', {
      deviceId: this.deviceId,
      payload: data
    });
  }

  async receiveCommand(cmd) {
    if (!this.isConnectedToWiFi) {
      this.buffer.push(cmd);
      return { status: 'buffered' };
    }
    return this.executeCommand(cmd);
  }
}
```

### 2. Test Backends

Use staging or local backend instances.

```javascript
// Backend test configuration
const testConfig = {
  backend: {
    url: process.env.TEST_BACKEND_URL || 'http://localhost:3000',
    database: 'test_db', // Isolated test database
    redis: 'localhost:6380' // Separate Redis instance
  }
};

beforeEach(async () => {
  // Clean slate for each test
  await testBackend.clearDatabase();
  await testBackend.clearRedisCache();
});
```

### 3. Network Simulation

Control network conditions to test edge cases.

```javascript
const networkSimulator = require('network-simulator');

test('App handles slow network', async () => {
  // Simulate 3G network
  await networkSimulator.set({
    latency: 300, // ms
    downloadBandwidth: 1000, // kbps
    uploadBandwidth: 500
  });

  const startTime = Date.now();
  await app.uploadImage(largeImage);
  const duration = Date.now() - startTime;

  expect(duration).toBeGreaterThan(5000); // Should take time
  expect(app.showedProgressIndicator()).toBe(true);
});
```

## Integration Test Checklist

### Device ↔ App
- [ ] BLE pairing and discovery
- [ ] WiFi credential provisioning
- [ ] Firmware OTA updates from app
- [ ] Real-time data streaming (BLE notifications)
- [ ] Command/response cycles
- [ ] Connection loss and recovery
- [ ] Multiple simultaneous connections
- [ ] Device battery reporting to app

### App ↔ Backend
- [ ] User authentication (OAuth/JWT)
- [ ] Device registration
- [ ] Data sync (upload/download)
- [ ] Push notifications
- [ ] API error handling (400, 401, 500)
- [ ] Rate limiting behavior
- [ ] Pagination for large datasets
- [ ] File upload/download (firmware, logs)

### Device ↔ Backend (Direct)
- [ ] MQTT/CoAP messaging
- [ ] Cloud-to-device commands
- [ ] Telemetry and health reporting
- [ ] Certificate-based authentication
- [ ] Firmware updates from cloud
- [ ] Remote diagnostics
- [ ] Device twin synchronization

### End-to-End
- [ ] User creates account → pairs device → receives data
- [ ] Device settings changed in web UI → reflected on device
- [ ] Multi-device homes/groups
- [ ] Firmware update → app shows new features
- [ ] Factory reset → device re-pairs seamlessly
- [ ] Account deletion → all data removed

## Common Integration Bugs

### 1. Timestamp Mismatches

**Issue:** Device uses Unix timestamp, app uses ISO 8601, backend expects UTC.

**Solution:**
```javascript
// Standardize on ISO 8601 UTC everywhere
const standardizeTimestamp = (ts) => {
  if (typeof ts === 'number') {
    return new Date(ts * 1000).toISOString();
  }
  return new Date(ts).toISOString();
};

test('Timestamps are consistent', () => {
  const deviceTs = 1704110400; // Unix timestamp
  const appTs = '2025-01-01T10:00:00.000Z';
  const backendTs = '2025-01-01T10:00:00Z';

  expect(standardizeTimestamp(deviceTs)).toBe('2025-01-01T10:00:00.000Z');
  expect(standardizeTimestamp(appTs)).toBe('2025-01-01T10:00:00.000Z');
  expect(standardizeTimestamp(backendTs)).toBe('2025-01-01T10:00:00.000Z');
});
```

### 2. Data Type Mismatches

**Issue:** Device sends integers, backend expects floats.

```javascript
// Device firmware
uint8_t temp = 23; // Integer
send_to_app(temp);

// Backend expects
{ "temperature": 23.0 } // Float

// Fix: Ensure type consistency
const normalizeTemp = (temp) => parseFloat(temp).toFixed(1);
```

### 3. State Race Conditions

**Issue:** App and backend both trying to update device state simultaneously.

**Solution:** Implement optimistic locking or last-write-wins with timestamps.

```javascript
// Optimistic locking
const updateDeviceState = async (deviceId, newState, version) => {
  const result = await db.query(
    'UPDATE devices SET state = ?, version = version + 1 WHERE id = ? AND version = ?',
    [newState, deviceId, version]
  );

  if (result.affectedRows === 0) {
    throw new Error('Version conflict - state was updated by another client');
  }
};
```

## Tools for Integration Testing

- **Postman/Newman**: API testing and orchestration
- **Appium**: Mobile app automation
- **MQTT.fx**: MQTT protocol testing
- **Wireshark**: Network packet analysis
- **Charles Proxy**: HTTPS traffic inspection
- **Docker Compose**: Multi-service test environments
- **Testcontainers**: Disposable backend instances

## Summary

Systems integration testing requires:
- **End-to-end thinking**: Test complete user flows across all components
- **Failure injection**: Verify graceful degradation
- **Data consistency**: Ensure data integrity across layers
- **Protocol validation**: Test each communication layer
- **State synchronization**: Handle concurrent updates correctly
- **Realistic environments**: Use staging/test backends that match production

Strong integration testing catches bugs that unit tests miss and ensures your system works as a cohesive whole.
