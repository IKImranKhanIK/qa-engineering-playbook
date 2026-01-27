# System Integration Testing Lab

## Overview

**Duration:** 4 hours
**Difficulty:** Advanced
**Category:** Systems Testing

Test a complete IoT ecosystem: smart device + mobile app + cloud backend + web dashboard.

## Learning Objectives

- Design end-to-end test scenarios
- Test cross-platform integrations
- Validate data flow across systems
- Test firmware-software-cloud interaction
- Create compatibility matrices

## Scenario

**IoT Smart Lock System:**
- Smart Lock (firmware)
- Mobile App (iOS/Android)
- Cloud Backend (REST API)
- Web Dashboard
- Alexa/Google Home integration

## Part 1: System Architecture (30 min)

### Component Diagram

```
┌──────────────┐
│  Smart Lock  │ ← Bluetooth →
│  (Firmware)  │               ↓
└──────────────┘        ┌──────────────┐
       ↑                │  Mobile App  │
       │ WiFi           │ (iOS/Android)│
       ↓                └──────────────┘
┌──────────────┐               ↓
│ Cloud Backend│ ← HTTPS ──────┘
│   (AWS)      │
└──────────────┘
       ↑
       │ WebSocket
       ↓
┌──────────────┐
│ Web Dashboard│
└──────────────┘
```

### Integration Points

| Integration | Protocol | Frequency | Critical? |
|------------|----------|-----------|-----------|
| Lock ↔ App | BLE 5.0 | On-demand | Yes |
| Lock ↔ Cloud | WiFi/MQTT | Every 5min | Yes |
| App ↔ Cloud | HTTPS | Real-time | Yes |
| Dashboard ↔ Cloud | WebSocket | Real-time | Medium |

## Part 2: Device Pairing & Setup (45 min)

### Test Scenarios

**1. First-Time Setup Flow:**
```
Steps:
1. Unbox lock, install batteries
2. Open mobile app
3. Create account (email/password)
4. Tap "Add Device"
5. Lock enters pairing mode (LED blinks blue)
6. App discovers lock via BLE
7. Enter WiFi credentials in app
8. App provisions WiFi to lock
9. Lock connects to cloud
10. Confirm successful setup

Expected Time: < 3 minutes
Test on: iOS 17, Android 14
```

**2. Multiple Device Pairing:**
- Pair 5 locks to same account
- Verify all appear in app
- Test controlling each individually

**3. Guest Access:**
- Owner shares access with guest
- Guest receives invite email
- Guest downloads app, accepts
- Verify guest can unlock

## Part 3: Cross-Platform Testing (60 min)

### Compatibility Matrix

| Lock FW | App Version | Cloud API | Web Dashboard | Status |
|---------|-------------|-----------|---------------|--------|
| v1.0.0 | iOS 2.5.0 | v3 | v1.8 | ✅ |
| v1.0.0 | Android 2.5.0 | v3 | v1.8 | ✅ |
| v1.1.0 | iOS 2.5.0 | v3 | v1.8 | ⚠️ |
| v1.1.0 | Android 2.5.0 | v3 | v1.8 | ❌ |

**Test Each Combination:**
- Lock/unlock works
- Status sync accurate
- Battery level reported correctly
- Settings changes propagate

### Version Compatibility

**Backward Compatibility:**
```
Old App (v2.4) + New Lock FW (v1.2):
- Core functions work?
- New features gracefully disabled?
- Update prompt shown?
```

**Forward Compatibility:**
```
New App (v2.6) + Old Lock FW (v1.0):
- No crashes?
- Missing features indicated?
- OTA update offered?
```

## Part 4: Data Synchronization (45 min)

### State Sync Testing

**Scenario 1: Offline Operation**
```
1. Lock loses WiFi
2. User unlocks via BLE
3. Lock logs event locally
4. WiFi restored
5. Verify event syncs to cloud within 1 min
6. Verify event appears in web dashboard
```

**Scenario 2: Concurrent Updates**
```
1. User A locks via app
2. User B unlocks via web dashboard (1 second later)
3. Expected: Lock state = unlocked
4. Verify: All clients show unlocked within 2s
5. Check: No race condition errors
```

**Scenario 3: Offline Backlog**
```
1. Lock offline for 24 hours
2. 50 lock/unlock events occur (BLE)
3. WiFi restored
4. Verify: All 50 events sync
5. Check: Events in correct order
6. Check: Timestamps preserved
```

## Part 5: OTA Firmware Updates (45 min)

### Update Flow Testing

**Normal OTA Update:**
```
Steps:
1. New firmware v1.2 uploaded to cloud
2. Cloud pushes update notification
3. Lock downloads firmware
4. User approves installation (in app)
5. Lock installs update
6. Lock reboots
7. Verify new version active
8. Test all functions work

Pass Criteria:
- Update completes in < 10 minutes
- No data loss (settings, access codes)
- Lock remains operational if update fails
- Rollback works if update corrupted
```

**Failure Scenarios:**
- WiFi drops during download
- Battery dies mid-update
- Corrupted firmware file
- User cancels update

## Part 6: Voice Assistant Integration (30 min)

### Alexa Integration

**Setup:**
```
1. Enable skill in Alexa app
2. Link smart lock account
3. Discover devices
4. Verify lock appears
```

**Voice Commands:**
```
"Alexa, lock the front door"
Expected: Lock engages, status syncs

"Alexa, is the front door locked?"
Expected: Correct status reported

"Alexa, unlock the front door"
Expected: PIN verification required
```

### Google Home

Same tests as Alexa above.

## Part 7: Security Testing (45 min)

### Authentication

**Test Cases:**
- [ ] Replay attack prevention (BLE)
- [ ] Encrypted communication (TLS 1.3)
- [ ] Token expiration (15 min)
- [ ] JWT validation
- [ ] Rate limiting (10 req/min)

### Authorization

**Test Cases:**
- [ ] Guest can't delete owner
- [ ] Owner can revoke guest
- [ ] Expired guest access blocked
- [ ] Admin can't access other accounts

### Data Privacy

**Test Cases:**
- [ ] Passwords hashed (bcrypt)
- [ ] Events encrypted at rest
- [ ] No PII in URLs
- [ ] GDPR delete request works

## Deliverables

### Integration Test Report

**1. Test Coverage Matrix**

| Feature | Device | App | Cloud | Dashboard | Status |
|---------|--------|-----|-------|-----------|--------|
| Lock/Unlock | ✅ | ✅ | ✅ | ✅ | Pass |
| Guest Access | ✅ | ✅ | ✅ | ✅ | Pass |
| OTA Update | ✅ | ✅ | ✅ | N/A | Pass |
| Voice Control | ✅ | N/A | ✅ | N/A | Fail |

**2. Compatibility Matrix**
(Completed table from Part 3)

**3. Critical Issues Found**

```markdown
## Issue #1: State Sync Delay

**Severity:** High
**Components:** Lock Firmware v1.1, Cloud API v3

**Description:**
Lock state takes 30 seconds to sync to cloud instead of 
expected 2 seconds when lock is controlled via BLE.

**Impact:**
Web dashboard shows stale data, causing user confusion.

**Root Cause:**
Lock firmware batches events instead of immediate sync.

**Recommendation:**
Update firmware to sync immediately after BLE operation.
```

## Resources

- [IoT Testing Best Practices](https://www.iot-tests.org/)
- [MQTT Protocol Spec](https://mqtt.org/)
- [BLE Testing Guide](https://www.bluetooth.com/specifications/specs/)
