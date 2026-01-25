# Interoperability Testing

## Overview

Interoperability testing verifies that your product works correctly with third-party devices, services, and platforms. For connected products, this includes smart home ecosystems (Alexa, Google Home, Apple HomeKit), cloud services, and other IoT devices.

## Third-Party Integrations

### Smart Home Platforms

Test integration with major ecosystems.

**Example: Google Home Integration**

```javascript
test('Device controlled via Google Assistant', async () => {
  // 1. Link account
  await googleHome.linkAccount({
    email: 'user@example.com',
    password: 'password123'
  });

  // 2. Discover devices
  await googleAssistant.say('Sync my devices');
  await waitFor(async () => {
    const devices = await googleHome.getDevices();
    expect(devices).toContainEqual(
      expect.objectContaining({
        name: 'Living Room Thermostat',
        type: 'THERMOSTAT'
      })
    );
  });

  // 3. Voice control
  await googleAssistant.say('Set living room to 22 degrees');

  await waitFor(async () => {
    const temp = await device.getTargetTemperature();
    expect(temp).toBe(22);
  });

  // 4. Status query
  const response = await googleAssistant.ask('What is the living room temperature?');
  expect(response).toContain('22 degrees');
});
```

### API Compatibility

Test against third-party API specifications.

```javascript
test('OAuth 2.0 flow complies with spec', async () => {
  const authResult = await thirdPartyService.authenticate({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: 'https://example.com/callback',
    scope: 'device.control'
  });

  expect(authResult).toMatchObject({
    access_token: expect.any(String),
    token_type: 'Bearer',
    expires_in: expect.any(Number),
    refresh_token: expect.any(String)
  });

  // Verify token works
  const deviceResponse = await thirdPartyService.api.get('/devices', {
    headers: { Authorization: `Bearer ${authResult.access_token}` }
  });

  expect(deviceResponse.status).toBe(200);
});
```

## Cross-Platform Testing

### Multiple Operating Systems

| Platform | Version | Status | Notes |
|----------|---------|--------|-------|
| iOS | 15.0+ | ✅ Supported | Full feature set |
| Android | 11+ | ✅ Supported | Full feature set |
| iOS | 14.x | ⚠️ Limited | No widgets |
| Android | 10 | ⚠️ Limited | No dark mode |
| iOS | 13.x | ❌ Unsupported | Security risk |

```javascript
describe('Cross-platform compatibility', () => {
  const platforms = [
    { os: 'iOS', version: '16.0', device: 'iPhone 14' },
    { os: 'iOS', version: '15.0', device: 'iPhone 12' },
    { os: 'Android', version: '13', device: 'Pixel 7' },
    { os: 'Android', version: '12', device: 'Samsung S22' }
  ];

  platforms.forEach(({ os, version, device }) => {
    test(`App works on ${os} ${version} (${device})`, async () => {
      const simulator = await launchSimulator({ os, version, device });
      await simulator.installApp();
      await simulator.launchApp();

      // Basic smoke test
      await simulator.login('user@example.com', 'password');
      await simulator.addDevice();
      await simulator.setTemperature(22);

      const deviceState = await simulator.getDeviceState();
      expect(deviceState.targetTemperature).toBe(22);
    });
  });
});
```

## Protocol Compliance

### BLE (Bluetooth Low Energy)

Verify compliance with Bluetooth SIG specifications.

```javascript
test('BLE GATT services comply with spec', async () => {
  const services = await device.getGATTServices();

  // Check standard service UUIDs
  expect(services).toContainEqual(expect.objectContaining({
    uuid: '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
    characteristics: expect.arrayContaining([
      { uuid: '00002a29-0000-1000-8000-00805f9b34fb' }, // Manufacturer Name
      { uuid: '00002a26-0000-1000-8000-00805f9b34fb' }  // Firmware Revision
    ])
  }));

  // Check custom service
  const customService = services.find(s => s.uuid.startsWith('12345678'));
  expect(customService.characteristics.length).toBeGreaterThan(0);
});
```

### MQTT

Test MQTT broker compatibility.

```javascript
test('MQTT messages comply with spec', async () => {
  const mqtt = require('mqtt');
  const client = mqtt.connect('mqtt://test.mosquitto.org');

  await new Promise((resolve) => client.on('connect', resolve));

  // Subscribe to device topic
  client.subscribe('devices/DEV-123/status');

  // Device publishes state
  await device.publishState();

  // Verify message format
  const message = await waitForMessage(client, 'devices/DEV-123/status');

  expect(message).toMatchObject({
    deviceId: 'DEV-123',
    timestamp: expect.any(Number),
    state: expect.stringMatching(/^(ON|OFF|IDLE)$/),
    temperature: expect.any(Number)
  });
});
```

## Hardware Interoperability

### USB-C Compliance

```javascript
test('Device negotiates USB-C Power Delivery correctly', async () => {
  const usbAnalyzer = new USBAnalyzer();

  await device.connect(usbAnalyzer);

  // Check PD negotiation
  const pdNegotiation = await usbAnalyzer.getPDNegotiation();

  expect(pdNegotiation).toMatchObject({
    voltage: 5, // 5V
    current: 3, // 3A (15W)
    dataRate: 'USB 2.0'
  });

  // Verify no non-compliant behavior
  expect(usbAnalyzer.getViolations()).toEqual([]);
});
```

## Certification Testing

### Apple HomeKit

```javascript
test('HomeKit accessory complies with HAP spec', async () => {
  const homekit = new HomeKitTester();

  await homekit.discover();
  const accessory = await homekit.getAccessory('Thermostat');

  // Verify required services
  expect(accessory.services).toContainEqual(expect.objectContaining({
    type: 'Thermostat',
    characteristics: expect.arrayContaining([
      { type: 'CurrentTemperature' },
      { type: 'TargetTemperature' },
      { type: 'CurrentHeatingCoolingState' },
      { type: 'TargetHeatingCoolingState' }
    ])
  }));

  // Control test
  await homekit.setCharacteristic(accessory, 'TargetTemperature', 22);

  await waitFor(async () => {
    const current = await homekit.getCharacteristic(accessory, 'CurrentTemperature');
    expect(Math.abs(current - 22)).toBeLessThan(1);
  }, { timeout: 60000 });
});
```

## Cloud Service Integration

### AWS IoT Core

```javascript
test('Device connects to AWS IoT Core', async () => {
  const iotClient = new AWS.IotData({
    endpoint: 'a1b2c3d4e5f6g7.iot.us-east-1.amazonaws.com'
  });

  // Device publishes to AWS IoT
  await device.publishToCloud({
    temperature: 22.5,
    humidity: 45
  });

  // Verify message received in AWS
  const shadow = await iotClient.getThingShadow({
    thingName: 'device-123'
  }).promise();

  const reported = JSON.parse(shadow.payload).state.reported;
  expect(reported.temperature).toBe(22.5);
  expect(reported.humidity).toBe(45);
});
```

## Interoperability Test Matrix

| Integration | Test Coverage | Status | Notes |
|-------------|---------------|--------|-------|
| Google Home | Voice control, state sync | ✅ Pass | All features work |
| Amazon Alexa | Voice control, routines | ✅ Pass | |
| Apple HomeKit | Siri, automation | ⚠️ Partial | No scenes |
| SmartThings | Device control | ✅ Pass | |
| IFTTT | Triggers, actions | ✅ Pass | |
| Zapier | Webhooks | ❌ Fail | Rate limiting issue |

## Summary

Interoperability testing ensures:
- **Third-party platform compatibility** (Alexa, Google, Apple)
- **Protocol compliance** (BLE, MQTT, USB-C)
- **Cross-platform functionality** (iOS, Android, web)
- **Certification readiness** (HomeKit, Works with Alexa)
- **API standard adherence** (OAuth, REST)

Test early and often with real third-party services, not just mocks.
