# iOS / Android Test Strategies

## Platform Differences

**iOS vs Android:**
```
iOS:
- Closed ecosystem, controlled hardware
- Swift/Objective-C
- Xcode + XCUITest
- TestFlight for beta distribution
- Strict App Store review

Android:
- Open ecosystem, fragmented devices
- Kotlin/Java
- Android Studio + Espresso
- Google Play Console
- More lenient review process
```

---

## Testing Approach

```javascript
// Platform-specific testing example
describe('Login Flow', () => {
  it('should handle biometric authentication', async () => {
    if (platform === 'iOS') {
      await device.setBiometricEnrollment(true);
      await element(by.id('faceIdButton')).tap();
    } else {
      await device.setFingerprintEnrollment(true);
      await element(by.id('fingerprintButton')).tap();
    }
    
    await expect(element(by.id('homeScreen'))).toBeVisible();
  });
});
```

---

## Key Test Cases

1. **Navigation:** Back button (Android), swipe back (iOS)
2. **Permissions:** Camera, location, notifications
3. **Orientation:** Portrait/landscape rotation
4. **Interruptions:** Phone call, low battery, app backgrounding
5. **Network:** WiFi, cellular, offline mode
6. **Platform Features:** Share sheet, deep links, widgets

---

## Device Matrix

```
Priority Devices:

iOS:
- iPhone 15 Pro (iOS 17 - latest)
- iPhone 13 (iOS 16)
- iPhone SE 3rd gen (iOS 15 - min supported)
- iPad Pro 12.9" (iPadOS 17)

Android:
- Google Pixel 8 (Android 14)
- Samsung Galaxy S23 (Android 13, One UI)
- OnePlus 11 (Android 13, OxygenOS)
- Budget device (Android 8 - min supported)
```

---

## Best Practices

**1. Test on real devices:**
```
❌ Simulator/emulator only
✅ Real devices for final validation
```

**2. Cover OS versions:**
```
✅ Latest OS (iOS 17, Android 14)
✅ n-1 (iOS 16, Android 13)
✅ Min supported (iOS 15, Android 8)
```

**3. Platform-specific UX:**
```
✅ iOS: Swipe gestures, navigation bar
✅ Android: Back button, material design
```

---

## Exercise

Create mobile test plan covering:
1. Platform-specific features
2. Device matrix (5 devices minimum)
3. OS version coverage
4. Orientation testing
5. Permission handling

**Deliverable:** Mobile test plan with 50+ test cases.

---

## Next Steps

- Learn [Device Fragmentation](02-device-fragmentation.md)
- Study [Mobile Automation](05-mobile-automation.md)
