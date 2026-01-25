# iOS / Android Test Strategies

## Overview

Mobile testing requires platform-specific strategies due to fundamental differences between iOS and Android ecosystems. This lesson covers how to design effective test strategies for both platforms.

## Platform Comparison

### iOS Ecosystem

**Characteristics:**
- Closed ecosystem with controlled hardware
- Limited device models (iPhone, iPad)
- Consistent OS adoption (80%+ on latest version within 6 months)
- Strict App Store review process
- Higher quality bar expected by users

**Development Tools:**
- Xcode IDE
- Swift/Objective-C languages
- XCUITest for UI automation
- TestFlight for beta distribution

**Testing Considerations:**
- Fewer devices to test (5-10 key models)
- Predictable behavior across devices
- Must follow Apple Human Interface Guidelines
- App Store rejection risks

### Android Ecosystem

**Characteristics:**
- Open ecosystem with device fragmentation
- Thousands of device models
- Slow OS adoption (40%+ still on older versions)
- More lenient Google Play review
- Wide range of user expectations

**Development Tools:**
- Android Studio IDE
- Kotlin/Java languages
- Espresso for UI automation
- Google Play Console for beta testing

**Testing Considerations:**
- Must test on 15-20+ device/OS combinations
- Manufacturer customizations (Samsung One UI, Xiaomi MIUI)
- Screen size/resolution variations
- Hardware capability differences

## Test Strategy Framework

### 1. Define Device Matrix

**iOS Priority Matrix:**
```
High Priority (Must Test):
- iPhone 15 Pro (iOS 17 - Latest flagship)
- iPhone 14 (iOS 17 - Previous generation)
- iPhone SE 3rd Gen (iOS 17 - Budget segment)
- iPad Pro 12.9" (iPadOS 17 - Tablet)
- iPhone 12 (iOS 16 - Older but popular)

Medium Priority:
- iPhone 13 mini (Small form factor)
- iPad Air (Mid-range tablet)

Low Priority:
- iPhone 11 (iOS 15 - Minimum supported)
```

**Android Priority Matrix:**
```
High Priority (Must Test):
- Google Pixel 8 (Android 14 - Stock Android)
- Samsung Galaxy S23 (Android 13 + One UI - Market leader)
- Samsung Galaxy A54 (Mid-range popular model)
- OnePlus 11 (Android 13 + OxygenOS - Performance segment)
- Budget device (Android 11/12 - Low-end market)

Medium Priority:
- Xiaomi 13 (MIUI customization)
- Motorola Edge (Near-stock Android)
- Samsung Galaxy Tab S9 (Tablet)

Low Priority:
- Older Samsung (Android 9/10 - Minimum supported)
- Foldable devices (Galaxy Z Fold/Flip)
```

### 2. OS Version Coverage

**iOS Strategy:**
```
✅ Latest (iOS 17): 60% of users
✅ n-1 (iOS 16): 25% of users
✅ n-2 (iOS 15): 10% of users
❌ Older: <5% of users, consider dropping support
```

**Android Strategy:**
```
✅ Latest (Android 14): 15% of users
✅ Android 13: 25% of users
✅ Android 12: 20% of users
✅ Android 11: 15% of users
✅ Android 10: 10% of users
⚠️ Android 9 and older: 15% but declining
```

### 3. Testing Approach

**Phase 1: Development Testing**
```
iOS:
- Simulator testing for rapid iteration
- 2-3 physical devices for critical paths

Android:
- Emulator testing (faster than iOS simulators)
- 5-7 physical devices covering:
  - Stock Android (Pixel)
  - Samsung (One UI)
  - Budget device
  - Different screen sizes
```

**Phase 2: Pre-Release Testing**
```
iOS:
- TestFlight beta (internal & external)
- Test on all high-priority devices
- Focus on: Camera, GPS, push notifications
- Verify iPad-specific features

Android:
- Internal testing track
- Closed beta with diverse devices
- Focus on: Battery drain, memory, background behavior
- Test manufacturer-specific features
```

**Phase 3: Release Validation**
```
iOS:
- Final TestFlight build → Production
- Monitor crash reports (Crashlytics/Sentry)
- Check App Store reviews

Android:
- Staged rollout (10% → 50% → 100%)
- Monitor Play Console vitals
- Check ANR (Application Not Responding) rates
```

## Platform-Specific Testing

### iOS-Specific Tests

**1. App Lifecycle**
```swift
// Test app restoration after termination
test('App restores state after background termination', async () => {
  // Navigate to specific screen
  await navigateToProfile();

  // Simulate app termination
  await device.sendToHome();
  await device.terminateApp();

  // Relaunch
  await device.launchApp();

  // Should restore to profile screen
  await expect(element(by.id('profileScreen'))).toBeVisible();
});
```

**2. 3D Touch / Haptic Touch**
```swift
test('Quick actions from home screen', async () => {
  await device.sendToHome();
  await element(by.label('MyApp')).longPress();
  await element(by.label('Scan QR Code')).tap();

  await expect(element(by.id('scannerView'))).toBeVisible();
});
```

**3. Handoff & Continuity**
```
Test Case: Handoff between iPhone and iPad
1. Start activity on iPhone (e.g., reading article)
2. Verify Handoff icon appears on iPad lock screen
3. Tap Handoff icon on iPad
4. Verify: Article continues from same position
```

**4. App Clips**
```
Test Case: App Clip launch and conversion
1. Scan App Clip code or tap NFC tag
2. Verify: App Clip launches (max 10MB)
3. Complete limited task
4. Tap "Get Full App"
5. Verify: Seamless transition to full app
```

### Android-Specific Tests

**1. Back Button Behavior**
```kotlin
test('Back button navigation hierarchy', async () => {
  // Navigate: Home → Settings → Privacy → Data Usage
  await element(by.id('settings')).tap();
  await element(by.id('privacy')).tap();
  await element(by.id('dataUsage')).tap();

  // Press back
  await device.pressBack();
  expect(await element(by.id('privacyScreen')).isVisible()).toBe(true);

  await device.pressBack();
  expect(await element(by.id('settingsScreen')).isVisible()).toBe(true);
});
```

**2. Picture-in-Picture (PiP)**
```kotlin
test('Video continues in PiP mode', async () => {
  await element(by.id('playVideo')).tap();
  await waitFor(element(by.id('videoPlayer'))).toBeVisible();

  // Go home (should trigger PiP)
  await device.sendToHome();

  // Verify PiP window visible
  await expect(element(by.id('pipWindow'))).toExist();

  // Video should still be playing
  await expect(element(by.id('videoProgress'))).toExist();
});
```

**3. Manufacturer Customizations**
```
Samsung One UI Tests:
- Edge panel integration
- Secure folder functionality
- Bixby integration
- Samsung DeX mode (desktop)

Xiaomi MIUI Tests:
- Second space feature
- MIUI optimizations impact
- Security app interactions
- Notification aggregation
```

**4. Android App Bundles & Dynamic Delivery**
```kotlin
test('On-demand module installation', async () => {
  // Trigger module installation
  await element(by.id('unlockPremiumFeatures')).tap();

  // Show installation progress
  await expect(element(by.id('downloadingModule'))).toBeVisible();

  // Wait for completion
  await waitFor(element(by.id('premiumFeatures')))
    .toBeVisible()
    .withTimeout(30000);
});
```

## Cross-Platform Testing

### Shared Test Scenarios

**Core Functionality:**
```javascript
// Same test logic for both platforms
const loginTests = (platform) => {
  test(`[${platform}] User can login with valid credentials`, async () => {
    await element(by.id('emailInput')).typeText('test@example.com');
    await element(by.id('passwordInput')).typeText('password123');
    await element(by.id('loginButton')).tap();

    await expect(element(by.id('homeScreen'))).toBeVisible();
  });

  test(`[${platform}] Login fails with invalid credentials`, async () => {
    await element(by.id('emailInput')).typeText('wrong@example.com');
    await element(by.id('passwordInput')).typeText('wrongpass');
    await element(by.id('loginButton')).tap();

    await expect(element(by.id('errorMessage')))
      .toHaveText('Invalid credentials');
  });
};

// Run for both platforms
describe('iOS Login Tests', () => loginTests('iOS'));
describe('Android Login Tests', () => loginTests('Android'));
```

### Platform-Specific Adaptations

**Biometric Authentication:**
```javascript
const testBiometric = async (platform) => {
  if (platform === 'iOS') {
    // Face ID or Touch ID
    await device.setBiometricEnrollment(true);
    await element(by.id('useFaceId')).tap();
    await device.matchFace();
  } else {
    // Fingerprint
    await device.setFingerprintEnrollment(true);
    await element(by.id('useFingerprint')).tap();
    await device.matchFingerprint();
  }

  await expect(element(by.id('authenticatedScreen'))).toBeVisible();
};
```

**Deep Links:**
```
iOS Universal Links:
https://example.com/product/123 → Opens app directly

Android App Links:
https://example.com/product/123 → Opens app or browser based on verification

Test Case:
1. Click link in email/SMS/browser
2. Verify: App opens to correct screen
3. Verify: Fallback to browser if app not installed
```

## Testing Tools Comparison

### UI Automation

| Feature | iOS (XCUITest) | Android (Espresso) |
|---------|----------------|-------------------|
| Language | Swift/Objective-C | Kotlin/Java |
| Speed | Moderate | Fast (on-device) |
| Reliability | High | Very High |
| Setup Complexity | Moderate | Low |
| Debuggability | Good (Xcode) | Excellent (Android Studio) |
| Accessibility | Strong | Good |

### Cross-Platform Tools

**Appium:**
```javascript
// Write once, run on both platforms
const capabilities = {
  platformName: process.env.PLATFORM, // iOS or Android
  deviceName: process.env.DEVICE,
  app: process.env.APP_PATH,
  automationName: process.env.PLATFORM === 'iOS' ? 'XCUITest' : 'UiAutomator2'
};

// Common test code
await driver.findElement('id', 'loginButton').click();
```

**Detox (React Native):**
```javascript
// Optimized for React Native apps
describe('Login Flow', () => {
  it('should login successfully', async () => {
    await element(by.id('email')).typeText('test@test.com');
    await element(by.id('password')).typeText('123456');
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
```

## Test Execution Strategy

### Cloud Testing Services

**Firebase Test Lab (Android & iOS):**
```yaml
# Execute on 20+ device configurations
gcloud firebase test android run \
  --type instrumentation \
  --app app-debug.apk \
  --test app-debug-test.apk \
  --device model=blueline,version=28 \
  --device model=flame,version=29 \
  --device model=redfin,version=30
```

**BrowserStack / Sauce Labs:**
```javascript
// Parallel execution across devices
const devices = [
  { device: 'iPhone 15', os: '17' },
  { device: 'Samsung Galaxy S23', os: '13' },
  { device: 'Google Pixel 7', os: '14' }
];

devices.forEach(config => {
  runTests(config);
});
```

## Best Practices

### 1. Prioritization

**High Priority (Test First):**
- First-time user experience
- Payment flows
- Login/authentication
- Push notifications
- Critical user journeys

**Medium Priority:**
- Secondary features
- Settings screens
- Profile management
- Search functionality

**Low Priority:**
- About/Help screens
- Optional features
- Rarely used paths

### 2. Test Data Management

```javascript
// Platform-specific test data
const testData = {
  iOS: {
    validEmail: 'ios.tester@example.com',
    testPhone: '+1-555-0100',
    notificationToken: 'apns-token-xxx'
  },
  Android: {
    validEmail: 'android.tester@example.com',
    testPhone: '+1-555-0200',
    notificationToken: 'fcm-token-yyy'
  }
};

const currentData = testData[platform];
```

### 3. Flaky Test Prevention

```javascript
// Use explicit waits
await waitFor(element(by.id('submitButton')))
  .toBeVisible()
  .withTimeout(10000);

// Retry on flaky interactions
const tapWithRetry = async (elementId, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await element(by.id(elementId)).tap();
      return;
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

## Summary

**iOS Testing Strategy:**
- Focus on fewer devices, higher quality
- Strict adherence to HIG guidelines
- Thorough TestFlight beta testing
- Monitor App Store review feedback

**Android Testing Strategy:**
- Comprehensive device/OS matrix
- Manufacturer customization testing
- Staged rollout monitoring
- Battery and performance optimization

**Both Platforms:**
- Automate repetitive tests
- Use cloud testing for scale
- Maintain platform-specific test suites
- Continuous monitoring post-release

## Next Steps

- Learn [Device Fragmentation](02-device-fragmentation.md) strategies
- Study [Mobile Automation](05-mobile-automation.md) frameworks
- Practice with [Mobile Testing Lab](../../labs/software/mobile-testing-lab.md)
