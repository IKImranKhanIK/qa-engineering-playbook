# Lab: Mobile Testing Scenarios

**Difficulty:** Intermediate
**Duration:** 3 hours
**Category:** Software

## Objectives

- Test mobile app across different devices and OS versions
- Validate device-specific features
- Test network conditions
- Check orientation and screen sizes
- Verify mobile-specific functionality

## Prerequisites

- Completed [iOS / Android Test Strategies lesson](../../docs/06-mobile-qa/01-ios-android-strategies.md)
- Android Studio or Xcode installed
- Mobile device or emulator access

## Setup

### Test Application

**Option 1:** Use real app (e.g., Wikipedia app)
- Android: https://play.google.com/store/apps/details?id=org.wikipedia
- iOS: https://apps.apple.com/app/wikipedia/id324715238

**Option 2:** Use demo app
- Android: https://github.com/android/testing-samples
- iOS: https://github.com/raywenderlich/ios-tutorials

### Tools Needed

- Android Studio (for Android emulators)
- Xcode (for iOS simulators - Mac only)
- Chrome DevTools (for mobile web testing)
- ADB (Android Debug Bridge)

## Part 1: Device Matrix Testing (60 minutes)

### Exercise 1.1: Create Device Matrix

Test on the following configurations:

| Device | OS Version | Screen Size | Result |
|--------|-----------|-------------|---------|
| Pixel 7 | Android 14 | 6.3" | |
| Pixel 5 | Android 12 | 6.0" | |
| iPhone 15 | iOS 17 | 6.1" | |
| iPhone 12 | iOS 16 | 6.1" | |
| Samsung Galaxy S21 | Android 13 | 6.2" | |

**Test Scenarios:**
- App launches successfully
- Main features work
- UI renders correctly
- No crashes

### Exercise 1.2: Screen Orientation Testing

**Test Steps:**
1. Launch app in portrait mode
2. Rotate to landscape
3. Rotate back to portrait
4. Repeat on different screens

**Verify:**
- UI adapts correctly
- Data is preserved
- No layout issues
- Controls remain accessible

## Part 2: Network Testing (45 minutes)

### Exercise 2.1: Network Conditions

Test under different network conditions:

**Using Android Studio:**
1. Open emulator extended controls
2. Go to Cellular → Network Type
3. Test on: 5G, 4G/LTE, 3G, 2G, No connection

**Test Cases:**
- App behavior on slow network
- Offline functionality
- Network error handling
- Data caching

### Exercise 2.2: Airplane Mode Testing

**Test Steps:**
1. Use app normally
2. Enable airplane mode
3. Attempt various actions
4. Disable airplane mode

**Verify:**
- Graceful offline handling
- Data sync when reconnected
- Appropriate error messages

## Part 3: Device Features (60 minutes)

### Exercise 3.1: Permission Testing

**Permissions to Test:**
- Camera
- Location
- Notifications
- Contacts
- Storage

**Scenarios:**
- Deny permission
- Grant permission
- Revoke after granting
- Request at appropriate time

### Exercise 3.2: Interruption Testing

**Test interruptions:**
- Incoming call during app use
- SMS received
- Calendar notification
- Battery low warning
- Switch to another app

**Verify app state:**
- Resumes correctly
- Data not lost
- Background tasks handled

### Exercise 3.3: Touch Gestures

**Test:**
- Single tap
- Double tap
- Long press
- Swipe (left, right, up, down)
- Pinch to zoom
- Multi-touch gestures

## Part 4: Performance (45 minutes)

### Exercise 4.1: Memory Usage

**Using Android Studio Profiler:**
1. Launch app
2. Open Profiler → Memory
3. Navigate through app
4. Look for memory leaks

**Document:**
- Average memory usage
- Peak memory usage
- Memory leaks found

### Exercise 4.2: Battery Impact

**Test:**
1. Fully charge device
2. Use app for 1 hour
3. Check battery consumption

**Settings → Battery → Battery Usage**

**Acceptable:** App uses appropriate battery based on usage

### Exercise 4.3: Launch Time

**Measure:**
- Cold start time
- Warm start time
- Hot start time

**Using ADB:**
```bash
adb shell am start -W com.your.package/.MainActivity
```

**Acceptable:** < 3 seconds for most apps

## Part 5: Platform-Specific Testing (30 minutes)

### Exercise 5.1: Android-Specific

**Test:**
- Back button behavior
- Recent apps screen
- Share functionality
- App shortcuts
- Widgets (if any)

### Exercise 5.2: iOS-Specific

**Test:**
- 3D Touch / Haptic Touch
- Widgets (Today view, Lock screen)
- Handoff functionality
- Siri integration
- Dark mode

## Deliverables

1. **Device Compatibility Report**
   - Results for each device tested
   - Issues found per device
   - Screenshots of bugs

2. **Test Evidence**
   - Screen recordings
   - Profiler screenshots
   - Performance metrics

3. **Bug Reports**
   - Device-specific bugs
   - OS version-specific issues
   - Resolution recommendations

## Bonus Challenges

1. **Accessibility Testing**
   - Test with TalkBack (Android)
   - Test with VoiceOver (iOS)
   - Check text scaling
   - Verify color contrast

2. **Localization Testing**
   - Test in different languages
   - Check RTL support
   - Verify date/time formats

3. **Cloud Testing**
   - Use Firebase Test Lab
   - Or Sauce Labs / BrowserStack
   - Test on 20+ real devices

4. **Mobile Automation**
   - Write Appium tests
   - Automate repetitive scenarios
   - Integrate with CI/CD

## Next Steps

- Practice on more complex apps
- Learn mobile automation (Appium/XCUITest)
- Study mobile security testing
- Explore performance optimization
