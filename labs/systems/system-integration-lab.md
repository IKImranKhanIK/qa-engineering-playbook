# Lab: System Integration Testing

**Difficulty:** Advanced
**Duration:** 4 hours
**Category:** Systems

## Objectives

- Test IoT device integration with mobile app and cloud
- Validate end-to-end data flow
- Test system-level scenarios
- Verify interoperability
- Practice distributed system testing

## Prerequisites

- Completed [End-to-End System Validation lesson](../../docs/08-systems-integration/07-end-to-end-system-validation.md)
- Understanding of API testing and mobile testing
- Basic cloud services knowledge

## Scenario

Test a **Smart Home Security System:**

**Components:**
1. **IoT Devices:**
   - Door/window sensors (BLE)
   - Motion detector (WiFi)
   - Smart camera (WiFi)
   - Hub device (central controller)

2. **Mobile App:** (iOS/Android)
   - Real-time alerts
   - Live camera view
   - Arm/disarm system
   - Event history

3. **Cloud Backend:**
   - User authentication
   - Device management
   - Video storage
   - Alert routing
   - Analytics

4. **Third-party Integrations:**
   - Alexa/Google Home
   - IFTTT
   - Email/SMS notifications

## Part 1: Component Integration (60 minutes)

### Exercise 1.1: Device-to-Hub Communication

**Test Scenario:** Sensor detection and pairing

**Test Cases:**

**TC-SYS-001: Sensor Pairing**
```
Preconditions:
- Hub powered on and in pairing mode
- Sensor has fresh battery
- Within 10 meters range

Steps:
1. Put hub in pairing mode via app
2. Press pairing button on sensor
3. Wait for confirmation

Expected:
- Sensor detected within 30 seconds
- LED confirms pairing
- Sensor appears in app with correct name
- Battery level shown correctly
- Signal strength indicator present

Verify data flow:
Hub ← BLE → Sensor
  ↓
App (via WiFi/Cloud)
```

**TC-SYS-002: Sensor State Reporting**
```
Test sensor state changes propagate through system:

1. Open door (trigger sensor)
2. Verify:
   - Hub receives event within 1 second
   - Cloud receives event within 2 seconds
   - App shows notification within 3 seconds
   - Push notification sent to phone
   - Event logged in history

Measure end-to-end latency:
Sensor trigger → User notification
Target: <5 seconds
```

### Exercise 1.2: Multi-Device Coordination

**Test Scenario:** Multiple sensors triggering simultaneously

**Test:**
1. Trigger 5 sensors within 1 second window
2. Verify:
   - All events captured
   - Correct event ordering
   - No dropped messages
   - Proper event deduplication
   - App UI updates correctly

**Stress Test:**
- Trigger 20 sensors in 10 seconds
- Check for message loss or delays

## Part 2: Mobile App Integration (60 minutes)

### Exercise 2.1: App-Cloud Sync

**Test bidirectional sync:**

**Scenario 1: Configuration Change in App**
```
Test: Change sensor name in app

Steps:
1. Open app
2. Navigate to sensor settings
3. Change name: "Front Door" → "Main Entrance"
4. Save

Verify:
- Change reflected in cloud immediately
- Other logged-in devices see update within 30s
- Hub receives update
- Sensor metadata updated

Test offline scenario:
- Make change while offline
- Reconnect to network
- Verify sync occurs automatically
```

**Scenario 2: Cloud-initiated Update**
```
Test: Firmware update pushed from cloud

Steps:
1. Trigger firmware update from cloud admin panel
2. Verify hub receives notification
3. Hub downloads firmware
4. Hub applies update during maintenance window
5. Hub reports success to cloud
6. App shows updated firmware version

Monitor:
- Download progress
- Update status
- Rollback on failure
```

### Exercise 2.2: Real-time Features

**Test: Live Camera Streaming**

**TC-SYS-010: Video Stream Quality**
```
Test video streaming end-to-end:

Camera (1080p) → Hub → Cloud → App

Test on different networks:
1. WiFi (high bandwidth)
   - Verify: Full 1080p, <500ms latency
2. 4G/LTE
   - Verify: Adaptive quality (720p), <1s latency
3. 3G
   - Verify: Drops to 480p, <2s latency
4. Poor connection
   - Verify: Graceful degradation, buffering indicator

Metrics to measure:
- Resolution adaptation
- Frame rate
- Latency
- Buffer time
- Quality of experience
```

## Part 3: Cloud Backend Integration (60 minutes)

### Exercise 3.1: API Integration Testing

**Test API endpoints:**

**Authentication Flow:**
```javascript
// Test: Login → Get Token → Access Resources

// 1. User login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}

Response:
{
  "token": "eyJhbGc...",
  "refreshToken": "...",
  "expiresIn": 3600
}

// 2. Get devices (with token)
GET /api/v1/devices
Headers: Authorization: Bearer eyJhbGc...

Response:
{
  "devices": [
    {
      "id": "sensor-001",
      "type": "door_sensor",
      "status": "online",
      "battery": 85
    }
  ]
}

// 3. Test token expiry
- Wait for token expiry
- Attempt API call
- Verify 401 Unauthorized
- Use refresh token
- Verify new token works
```

**Event Processing Pipeline:**
```
Test: Sensor event → Cloud processing → Notifications

1. Trigger sensor
2. POST /api/v1/events
3. Cloud processes event
4. Rules engine evaluates
5. Notifications sent (push, email, SMS)

Verify:
- Event stored in database
- Correct timestamp
- User preferences honored
- Rate limiting (no alert spam)
- Multiple notification channels work
```

### Exercise 3.2: Data Consistency

**Test: Multi-user scenario**

```
Scenario: Two users manage same home

User A (phone):
1. Arms system via app

User B (tablet):
2. Simultaneously views status
3. Should see "Armed" state

User A:
4. Disarms via voice (Alexa)

User B:
5. Should see state change immediately

Verify:
- State consistency across all clients
- No race conditions
- Optimistic locking works
- Conflict resolution
```

## Part 4: Third-Party Integrations (60 minutes)

### Exercise 4.1: Voice Assistant Integration

**Test: Alexa/Google Home commands**

**Test Cases:**

```
TC-SYS-020: Voice Command - Arm System

User: "Alexa, arm the security system"

Flow:
1. Alexa captures command
2. Sends to skill backend
3. Skill authenticates user
4. Calls your API: POST /api/v1/system/arm
5. Cloud sends command to hub
6. Hub arms system
7. Confirms back to Alexa
8. Alexa responds: "Security system armed"

Verify:
- End-to-end latency <5 seconds
- Correct authentication
- Error handling (if system already armed)
- Voice feedback appropriate

Error scenarios:
- "Sorry, I couldn't connect to the security system"
- "The system is already armed"
```

### Exercise 4.2: IFTTT Integration

**Test: Automated triggers**

**Scenario: "If motion detected, turn on lights"**

```
Setup IFTTT applet:
- Trigger: Motion sensor activated
- Action: Turn on smart lights (via different service)

Test:
1. Trigger motion sensor
2. Verify webhook sent to IFTTT
3. IFTTT processes
4. Lights turn on

Monitor:
- Webhook delivery
- Retry logic
- Timeout handling
- Authentication tokens
```

## Part 5: End-to-End Scenarios (60 minutes)

### Exercise 5.1: User Journey Testing

**Scenario: New User Setup**

```
Complete user journey:

1. Download app
2. Create account (email verification)
3. Purchase and unbox hub
4. Plug in hub (auto-discovery on network)
5. Pair hub with app
6. Pair first sensor
7. Name devices and rooms
8. Set up notifications
9. Create automation rules
10. Test system (arm/disarm)

Verify at each step:
- Instructions clear
- Process completes successfully
- Error messages helpful
- Can continue after interruption
- Data persists correctly

Time the process: Target <15 minutes
```

### Exercise 5.2: Failure Scenarios

**Test system resilience:**

**Test 1: Hub Offline**
```
1. System armed and monitoring
2. Disconnect hub from internet
3. Trigger sensor
4. Verify:
   - Hub still processes locally
   - Siren sounds (local action)
   - Events queued for upload
5. Reconnect hub
6. Verify:
   - Queued events sync to cloud
   - App shows historic events
   - No data loss
```

**Test 2: Cloud Outage**
```
1. Simulate cloud service outage
2. Verify:
   - App shows "Connecting..." state
   - Cached data still accessible
   - Local control still works (hub ← → app direct)
   - Graceful degradation message
3. Restore cloud
4. Verify: Full functionality restored
```

**Test 3: Mobile App Killed**
```
1. System armed
2. Force quit mobile app
3. Trigger sensor (motion/door)
4. Verify:
   - Push notification still delivered
   - SMS backup sent (if configured)
   - Email sent (if configured)
```

## Deliverables

Create comprehensive system integration test report:

1. **Test Summary Dashboard**
   - Total tests executed
   - Pass/fail rate
   - Integration points tested
   - End-to-end latencies measured

2. **Integration Map**
   - Diagram showing all components
   - Data flows between components
   - Test coverage visualization

3. **Performance Metrics**
   - End-to-end latencies
   - Throughput measurements
   - Resource utilization

4. **Issues Log**
   - Integration bugs found
   - Severity and priority
   - Component responsible

5. **Recommendations**
   - Architecture improvements
   - Performance optimizations
   - Additional tests needed

## Bonus Challenges

1. **Chaos Engineering:**
   - Randomly kill services
   - Introduce network delays
   - Test system recovery

2. **Scale Testing:**
   - Simulate 1000 concurrent users
   - 100 devices per home
   - Measure breaking points

3. **Security Testing:**
   - MITM attacks
   - Token replay attacks
   - Device spoofing

4. **Monitoring & Observability:**
   - Set up distributed tracing
   - Create Grafana dashboards
   - Implement alerting

## Next Steps

- Apply to real IoT systems
- Learn Kubernetes for orchestration
- Study microservices testing
- Explore service mesh testing
