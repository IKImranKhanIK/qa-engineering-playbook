# Mobile Testing Scenarios

## Overview

**Duration:** 3 hours
**Difficulty:** Intermediate
**Category:** Mobile Testing

Practice mobile testing techniques including device fragmentation, network conditions, and platform-specific scenarios.

## Learning Objectives

- Test across different devices and OS versions
- Simulate network conditions
- Test mobile-specific features (gestures, sensors)
- Validate app store readiness
- Test push notifications and deep linking

## Prerequisites

- Android Studio (for Android testing)
- Xcode (for iOS testing - macOS only)
- Physical or virtual mobile devices
- Demo mobile app (we'll use publicly available ones)

## Test Applications

**Android:** Google I/O App
- Download from Play Store or use APK

**iOS:** Apple Developer App
- Download from App Store

**Cross-Platform:** React Native demo apps

## Part 1: Device Fragmentation Testing (45 minutes)

### Android Device Matrix

Test on minimum 4 configurations:

| Device | OS Version | Screen Size | Resolution |
|--------|-----------|-------------|------------|
| Pixel 7 | Android 14 | 6.3" | 1080 x 2400 |
| Samsung S21 | Android 13 | 6.2" | 1080 x 2400 |
| OnePlus 9 | Android 12 | 6.55" | 1080 x 2400 |
| Budget Phone | Android 11 | 5.5" | 720 x 1280 |

### iOS Device Matrix

| Device | OS Version | Screen Size |
|--------|-----------|-------------|
| iPhone 15 Pro | iOS 17 | 6.1" |
| iPhone 12 | iOS 16 | 6.1" |
| iPhone SE | iOS 15 | 4.7" |
| iPad Air | iPadOS 17 | 10.9" |

### Test Scenarios

- [ ] App launches successfully on all devices
- [ ] UI elements are properly scaled
- [ ] No text truncation
- [ ] Images load correctly
- [ ] Touch targets are ≥ 44x44 dp
- [ ] Landscape mode works

## Part 2: Network Conditions Testing (40 minutes)

### Simulate Network Conditions

**Android (ADB):**
```bash
# Enable network shaping
adb shell dumpsys battery set usb 0

# Simulate 3G
adb shell dumpsys netpolicy set restrict-background true
```

**iOS (Network Link Conditioner):**
1. Settings → Developer → Network Link Conditioner
2. Enable and select profile

### Test Scenarios

**Offline Mode:**
- [ ] Enable airplane mode
- [ ] Launch app
- [ ] Verify cached data loads
- [ ] Test offline error messages
- [ ] Try user actions (should queue or fail gracefully)

**Slow Network (3G):**
- [ ] Time to first byte < 3s
- [ ] Images load progressively
- [ ] Loading indicators shown
- [ ] Timeout handling works

**Network Transitions:**
- [ ] WiFi → Mobile data → Offline → WiFi
- [ ] App handles transitions smoothly
- [ ] No crashes during network change
- [ ] Retry logic works

## Part 3: Platform-Specific Testing (45 minutes)

### Android-Specific

**Intents:**
```bash
# Test deep link
adb shell am start -W -a android.intent.action.VIEW -d "myapp://product/123"

# Share intent
adb shell am start -a android.intent.action.SEND --es android.intent.extra.TEXT "Test"
```

**Back Button:**
- [ ] Back from every screen
- [ ] Back with dialog open
- [ ] Back with keyboard open

**App States:**
- [ ] Pause app (home button)
- [ ] Resume app
- [ ] Low memory scenario
- [ ] Process death

### iOS-Specific

**3D Touch / Haptic Touch:**
- [ ] Quick actions from home screen
- [ ] Peek and pop (if applicable)

**Handoff:**
- [ ] Start on iPhone, continue on iPad

**Multitasking:**
- [ ] Split screen (iPad)
- [ ] Slide over
- [ ] Picture in Picture

## Part 4: Permissions Testing (30 minutes)

### Test Permission Flows

**Location:**
- [ ] Deny → verify app handles gracefully
- [ ] Allow Once → test on next launch
- [ ] Allow While Using → background behavior
- [ ] Revoke permission → app behavior

**Camera:**
- [ ] First time prompt
- [ ] Denied → show explanation
- [ ] Settings link works

**Notifications:**
- [ ] Request permission at appropriate time
- [ ] Explain benefit before asking
- [ ] Handle denial

## Part 5: Battery & Performance (30 minutes)

### Battery Drain Testing

**Android (Battery Historian):**
```bash
adb shell dumpsys batterystats > batterystats.txt
```

**iOS (Xcode Instruments):**
- Energy Log instrument
- Run for 30 minutes
- Analyze battery impact

### Test Scenarios

- [ ] App in background for 1 hour
- [ ] Battery drain < 2% per hour
- [ ] No wake locks preventing sleep
- [ ] GPS usage optimized

### Performance Profiling

**Metrics to Check:**
- Cold start time < 2s
- Hot start time < 1s
- Frame rate: 60 FPS
- Memory usage < 200 MB
- APK/IPA size reasonable

## Part 6: Push Notifications (20 minutes)

### Test Scenarios

**Delivery:**
- [ ] App in foreground
- [ ] App in background
- [ ] App closed
- [ ] Device locked

**Interaction:**
- [ ] Tap notification → correct screen
- [ ] Dismiss notification
- [ ] Action buttons work
- [ ] Rich notifications (images, videos)

### Tools

**Android:**
```bash
# Send test notification
adb shell am broadcast -a com.test.NOTIFICATION
```

**iOS:**
- Use APNs Tester
- Or push from Firebase Console

## Deliverables

### Mobile Test Report

**1. Device Coverage**

| Device | OS | Tests Executed | Pass/Fail | Issues |
|--------|-----|---------------|-----------|---------|
| | | | | |

**2. Network Testing Results**

| Scenario | Behavior | Expected | Actual | Status |
|----------|----------|----------|--------|--------|
| Offline mode | | | | |
| Slow 3G | | | | |
| WiFi to Mobile | | | | |

**3. Critical Bugs Found**

List with:
- Device/OS affected
- Reproduction steps
- Screenshots/screen recording
- Severity

**4. Performance Metrics**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Cold Start | < 2s | | |
| Memory | < 200MB | | |
| Battery/hr | < 2% | | |

## Bonus Challenges

1. **Accessibility:**
   - Test with TalkBack/VoiceOver
   - Font scaling (200%)
   - Dark mode

2. **Localization:**
   - Test in different languages
   - RTL languages (Arabic, Hebrew)
   - Date/number formatting

3. **Security:**
   - Test with rooted/jailbroken device
   - SSL pinning
   - Data at rest encryption

## Resources

- [Android Testing Guidelines](https://developer.android.com/training/testing)
- [iOS Testing Guide](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/testing_with_xcode/)
- [Firebase Test Lab](https://firebase.google.com/docs/test-lab)
