# Network & Offline Testing

## Overview

Mobile apps must function gracefully across varying network conditions—from high-speed 5G to complete offline scenarios. This lesson covers strategies for testing network resilience, offline functionality, and data synchronization.

## Network Conditions Spectrum

### Connection Types

**Mobile Networks:**
```
5G (Ultra-fast):
- Download: 100-1000 Mbps
- Upload: 50-500 Mbps
- Latency: 1-10ms
- Use case: Video streaming, real-time gaming

4G/LTE (Fast):
- Download: 5-50 Mbps
- Upload: 2-15 Mbps
- Latency: 30-50ms
- Most common mobile connection

3G (Slow):
- Download: 0.5-2 Mbps
- Upload: 0.5-1 Mbps
- Latency: 100-500ms
- Still used in rural areas

2G/EDGE (Very Slow):
- Download: 40-200 Kbps
- Upload: 20-100 Kbps
- Latency: 300-1000ms
- Legacy networks, some regions

WiFi (Variable):
- Download: 10-1000 Mbps
- Upload: 10-1000 Mbps
- Latency: 5-30ms
- Most reliable, but not always available

Offline:
- No connectivity
- Must rely on cached data
- Queue operations for later sync
```

### Network Conditions Matrix

**Test Scenarios:**
| Condition | Bandwidth | Latency | Packet Loss | Use Case |
|-----------|-----------|---------|-------------|----------|
| Excellent | >10 Mbps | <50ms | 0% | WiFi, 5G |
| Good | 2-10 Mbps | 50-100ms | <1% | 4G |
| Fair | 0.5-2 Mbps | 100-300ms | 1-5% | 3G |
| Poor | 50-500 Kbps | 300-800ms | 5-10% | 2G, congested network |
| Very Poor | <50 Kbps | >800ms | >10% | Edge of coverage |
| Offline | 0 | N/A | 100% | No connection |

## Network Simulation Tools

### iOS Network Link Conditioner

**Setup:**
```bash
# Enable Network Link Conditioner
# Settings → Developer → Network Link Conditioner

# Available profiles:
- 100% Loss (offline)
- 3G (Good/Average/Lossy)
- LTE (Good/Average/Lossy)
- Edge (Good/Average/Lossy)
- WiFi (Good/Average/Lossy)
- Very Bad Network (High latency + packet loss)
- DSL (Wired broadband simulation)

# Custom profile creation:
Downlink Bandwidth: 1000 Kbps
Downlink Packets Dropped: 10%
Uplink Bandwidth: 500 Kbps
Uplink Packets Dropped: 5%
DNS Delay: 100ms
```

**Xcode Automation:**
```swift
// Using XCUITest with network conditions
import XCTest

class NetworkTests: XCTestCase {

    func testSlowNetworkPerformance() {
        // Enable 3G profile programmatically
        // Note: Requires manual setup via Network Link Conditioner

        let app = XCUIApplication()
        app.launch()

        // Measure performance under slow network
        measure {
            app.buttons["Refresh"].tap()

            // Wait for loading to complete (max 30s)
            let exists = app.staticTexts["Content Loaded"]
                .waitForExistence(timeout: 30)

            XCTAssertTrue(exists, "Content should load within 30s on 3G")
        }
    }
}
```

### Android Network Throttling

**Using Android Emulator:**
```bash
# Via command line
adb shell

# Simulate network conditions
# Set to 3G
settings put global network_type 3

# Available network types:
# 0 = Unknown
# 1 = GPRS (2G)
# 2 = EDGE (2G)
# 3 = UMTS (3G)
# 13 = LTE (4G)

# Disable data connection
svc data disable

# Enable data connection
svc data enable

# Airplane mode
settings put global airplane_mode_on 1
am broadcast -a android.intent.action.AIRPLANE_MODE

# Exit airplane mode
settings put global airplane_mode_on 0
am broadcast -a android.intent.action.AIRPLANE_MODE
```

**Using Chrome DevTools (for WebViews):**
```javascript
// In Chrome DevTools connected to device
// Network tab → Throttling dropdown

Profiles:
- Fast 3G: 1.6 Mbps down, 750 Kbps up, 562ms latency
- Slow 3G: 400 Kbps down, 400 Kbps up, 2000ms latency
- Offline: No connection

// Custom throttling
Download: 500 Kbps
Upload: 250 Kbps
Latency: 1000ms
```

### Cross-Platform Tools

**Charles Proxy:**
```
Configuration:
1. Install Charles on desktop
2. Configure mobile device to use Charles as proxy
3. Apply throttling rules

Throttling Settings:
- Bandwidth: 512 Kbps
- Utilization: 80%
- Round-trip latency: 500ms
- MTU: 1500 bytes

Advanced Rules:
- Throttle specific hosts only
- Random packet loss
- Connection stability issues
```

**Network Emulation in CI/CD:**
```yaml
# Using tc (traffic control) in Linux CI environment
jobs:
  test-slow-network:
    runs-on: ubuntu-latest
    steps:
      - name: Setup network throttling
        run: |
          # Limit bandwidth to 1 Mbps
          sudo tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms

          # Add latency (200ms)
          sudo tc qdisc add dev eth0 root netem delay 200ms

          # Add packet loss (5%)
          sudo tc qdisc add dev eth0 root netem loss 5%

      - name: Run tests
        run: ./run-network-tests.sh
```

## Offline Functionality Testing

### Offline-First Architecture

**Testing Checklist:**
```
✅ App launches without network
✅ Cached content displays correctly
✅ User can navigate cached screens
✅ Actions queue for later sync
✅ Clear indication of offline status
✅ No crashes when APIs unavailable
✅ Graceful error messages
✅ Data integrity maintained offline
```

### Offline Test Scenarios

**Scenario 1: Cold Start Offline**
```javascript
test('App launches successfully when offline', async () => {
  // Disable network before launch
  await device.setNetworkCondition('offline');

  // Launch app
  await device.launchApp({ newInstance: true });

  // Should show cached content or empty state
  await expect(element(by.id('mainScreen'))).toBeVisible();
  await expect(element(by.id('offlineIndicator'))).toBeVisible();

  // Should not crash or show loading spinner indefinitely
  await expect(element(by.id('loadingSpinner'))).not.toBeVisible();
});
```

**Scenario 2: Transition to Offline**
```javascript
test('App handles transition from online to offline', async () => {
  // Start with network
  await device.setNetworkCondition('wifi');
  await device.launchApp();

  // Load some content
  await element(by.id('refreshButton')).tap();
  await waitFor(element(by.id('contentList')))
    .toBeVisible()
    .withTimeout(5000);

  // Disable network
  await device.setNetworkCondition('offline');

  // Try to perform an action
  await element(by.id('favoriteButton')).tap();

  // Should show offline message, queue action
  await expect(element(by.text('Action saved. Will sync when online.')))
    .toBeVisible();
});
```

**Scenario 3: Offline Editing**
```javascript
test('User can edit data offline and sync later', async () => {
  // Go offline
  await device.setNetworkCondition('offline');
  await device.launchApp();

  // Edit cached item
  await element(by.id('article1')).tap();
  await element(by.id('editButton')).tap();
  await element(by.id('titleInput')).typeText('Updated Title');
  await element(by.id('saveButton')).tap();

  // Should save locally
  await expect(element(by.text('Saved locally. Will sync when online.')))
    .toBeVisible();

  // Verify change persisted locally
  await device.reloadReactNative();
  await element(by.id('article1')).tap();
  await expect(element(by.text('Updated Title'))).toBeVisible();

  // Go online
  await device.setNetworkCondition('wifi');

  // Should auto-sync
  await waitFor(element(by.text('Synced successfully')))
    .toBeVisible()
    .withTimeout(10000);
});
```

### Offline Data Strategies

**Local Storage Options:**
```javascript
// AsyncStorage (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Cache failed:', error);
  }
};

const getCachedData = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    return null;
  }
};

// SQLite for complex offline data
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'myapp.db' });

// Store structured data
db.transaction(tx => {
  tx.executeSql(
    'INSERT INTO articles (id, title, content, synced) VALUES (?, ?, ?, ?)',
    [1, 'Title', 'Content', 0]
  );
});

// Realm for reactive offline data
import Realm from 'realm';

const ArticleSchema = {
  name: 'Article',
  properties: {
    id: 'int',
    title: 'string',
    content: 'string',
    synced: { type: 'bool', default: false }
  }
};
```

## Data Synchronization Testing

### Sync Strategies

**1. Immediate Sync (Online Only):**
```
User Action → API Call → Update Local → Show Result
❌ Fails offline
✅ Simple implementation
```

**2. Optimistic UI:**
```
User Action → Update Local → Show Result → API Call (background)
✅ Fast feedback
⚠️ Must handle sync failures
```

**3. Queue-Based Sync:**
```
User Action → Queue Action → Update Local → Show Pending
Network Available → Process Queue → Update Server → Confirm Sync
✅ Reliable offline support
✅ User sees pending status
```

### Conflict Resolution

**Test Scenarios:**
```javascript
test('Handles sync conflict gracefully', async () => {
  // 1. Load article while online
  await loadArticle(123);

  // 2. Go offline
  await device.setNetworkCondition('offline');

  // 3. Edit article offline
  await editArticle(123, { title: 'Offline Edit' });

  // 4. Simulate server-side change (mock API)
  mockAPI.updateArticle(123, { title: 'Server Edit' });

  // 5. Go back online
  await device.setNetworkCondition('wifi');

  // 6. Trigger sync
  await triggerSync();

  // 7. Should show conflict resolution UI
  await expect(element(by.id('conflictDialog'))).toBeVisible();
  await expect(element(by.text('Local: Offline Edit'))).toBeVisible();
  await expect(element(by.text('Server: Server Edit'))).toBeVisible();

  // 8. User chooses local version
  await element(by.id('keepLocalButton')).tap();

  // 9. Verify local version won
  await expect(element(by.text('Offline Edit'))).toBeVisible();
});
```

**Conflict Resolution Strategies:**
```
1. Last Write Wins (LWW):
   - Timestamp-based
   - Simple but may lose data

2. First Write Wins:
   - Server version takes precedence
   - Discard local changes

3. Manual Resolution:
   - Show user both versions
   - Let user choose or merge

4. Automatic Merge:
   - Combine non-conflicting changes
   - Flag conflicts for review
```

### Background Sync Testing

**iOS Background Fetch:**
```swift
test('Background sync works on iOS', async () => {
  // Queue some changes
  await queueOfflineChanges();

  // Send app to background
  await device.sendToHome();

  // Simulate background fetch
  await device.simulateBackgroundFetch();

  // Wait for sync to complete
  await sleep(5000);

  // Return to app
  await device.launchApp({ newInstance: false });

  // Verify synced
  await expect(element(by.id('syncIndicator')))
    .toHaveText('Last synced: Just now');
});
```

**Android WorkManager:**
```kotlin
test('Background sync works on Android', async () => {
  // Queue changes
  await queueOfflineChanges();

  // Trigger periodic work
  await triggerWorkManager('sync-worker');

  // Verify work completed
  const workStatus = await getWorkStatus('sync-worker');
  expect(workStatus).toBe('SUCCEEDED');

  // Check data synced
  await verifyServerHasChanges();
});
```

## Network Error Handling

### HTTP Status Code Handling

**Test Coverage:**
```javascript
const networkErrorTests = [
  { status: 408, name: 'Request Timeout', action: 'retry' },
  { status: 429, name: 'Too Many Requests', action: 'backoff' },
  { status: 500, name: 'Server Error', action: 'retry-later' },
  { status: 502, name: 'Bad Gateway', action: 'retry' },
  { status: 503, name: 'Service Unavailable', action: 'queue' },
  { status: 504, name: 'Gateway Timeout', action: 'retry' }
];

networkErrorTests.forEach(({ status, name, action }) => {
  test(`Handles ${status} ${name} correctly`, async () => {
    // Mock API to return error
    mockAPI.setResponse(status);

    // Perform action
    await element(by.id('submitButton')).tap();

    // Verify appropriate handling
    if (action === 'retry') {
      await expect(element(by.text('Retrying...'))).toBeVisible();
    } else if (action === 'queue') {
      await expect(element(by.text('Saved for later'))).toBeVisible();
    }
  });
});
```

### Timeout Handling

**Configuration:**
```javascript
// Network timeout settings
const TIMEOUT_CONFIG = {
  connect: 10000,      // 10s to establish connection
  read: 30000,         // 30s to receive response
  write: 15000,        // 15s to send request

  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,    // Start with 1s
  retryMultiplier: 2   // Exponential backoff
};

// Test timeout handling
test('Request times out on slow network', async () => {
  // Simulate very slow network (5 Kbps)
  await device.setNetworkCondition('slow-3g');

  // Start timer
  const startTime = Date.now();

  // Attempt large request
  await element(by.id('downloadButton')).tap();

  // Should timeout and show message
  await waitFor(element(by.text('Request timed out')))
    .toBeVisible()
    .withTimeout(35000);

  const elapsed = Date.now() - startTime;

  // Should timeout around 30s (read timeout)
  expect(elapsed).toBeGreaterThan(28000);
  expect(elapsed).toBeLessThan(35000);
});
```

### Retry Logic Testing

**Exponential Backoff:**
```javascript
test('Retries with exponential backoff', async () => {
  const retryAttempts = [];

  // Mock API to track retry attempts
  mockAPI.onRequest((req) => {
    retryAttempts.push(Date.now());
    return { status: 503 }; // Service Unavailable
  });

  // Perform action
  await element(by.id('submitButton')).tap();

  // Wait for all retries
  await sleep(10000);

  // Verify retry pattern
  expect(retryAttempts.length).toBe(4); // Initial + 3 retries

  // Check exponential backoff (1s, 2s, 4s)
  const delay1 = retryAttempts[1] - retryAttempts[0];
  const delay2 = retryAttempts[2] - retryAttempts[1];
  const delay3 = retryAttempts[3] - retryAttempts[2];

  expect(delay1).toBeCloseTo(1000, -2);  // ~1s
  expect(delay2).toBeCloseTo(2000, -2);  // ~2s
  expect(delay3).toBeCloseTo(4000, -2);  // ~4s
});
```

## Progressive Loading Strategies

### Image Loading

**Test Cases:**
```javascript
test('Images load progressively on slow network', async () => {
  // Set slow network
  await device.setNetworkCondition('3g');

  // Navigate to image gallery
  await element(by.id('galleryTab')).tap();

  // Should show placeholders immediately
  const placeholders = await element(by.id('imagePlaceholder'));
  await expect(placeholders).toBeVisible();

  // Should show low-res version quickly
  await waitFor(element(by.id('lowResImage')))
    .toBeVisible()
    .withTimeout(3000);

  // Should eventually load high-res
  await waitFor(element(by.id('highResImage')))
    .toBeVisible()
    .withTimeout(15000);
});
```

**Implementation Pattern:**
```javascript
// Progressive image loading
const ImageLoader = ({ url }) => {
  const [state, setState] = useState('placeholder');

  useEffect(() => {
    // Load thumbnail first (small, fast)
    loadImage(url + '?size=thumbnail')
      .then(() => setState('thumbnail'))
      .catch(() => setState('error'));

    // Then load full image
    loadImage(url)
      .then(() => setState('full'))
      .catch(() => setState('error'));
  }, [url]);

  return (
    <>
      {state === 'placeholder' && <Placeholder />}
      {state === 'thumbnail' && <Image source={url + '?size=thumbnail'} />}
      {state === 'full' && <Image source={url} />}
      {state === 'error' && <ErrorIcon />}
    </>
  );
};
```

### Content Prioritization

**Above-the-Fold First:**
```javascript
test('Critical content loads first on slow network', async () => {
  await device.setNetworkCondition('slow-3g');
  await navigateToArticle();

  // Title and first paragraph should load quickly
  await waitFor(element(by.id('articleTitle')))
    .toBeVisible()
    .withTimeout(5000);

  await waitFor(element(by.id('firstParagraph')))
    .toBeVisible()
    .withTimeout(7000);

  // User can start reading immediately
  // Images and comments load in background

  // Eventually all content loads
  await waitFor(element(by.id('comments')))
    .toBeVisible()
    .withTimeout(30000);
});
```

## Platform-Specific Network Features

### iOS Reachability

**Test Network State Changes:**
```swift
test('App responds to reachability changes', async () => {
  // Start with WiFi
  await device.setNetworkCondition('wifi');
  await expect(element(by.id('networkStatus'))).toHaveText('WiFi');

  // Switch to cellular
  await device.setNetworkCondition('cellular');
  await expect(element(by.id('networkStatus'))).toHaveText('Cellular');

  // Go offline
  await device.setNetworkCondition('offline');
  await expect(element(by.id('networkStatus'))).toHaveText('Offline');

  // Verify app disables online-only features
  await expect(element(by.id('uploadButton'))).not.toBeVisible();
});
```

### Android ConnectivityManager

**Test Network Type Detection:**
```kotlin
test('Detects network type changes', async () => {
  // WiFi
  await setNetworkType('wifi');
  await verifyHighQualitySettings();

  // Mobile data
  await setNetworkType('mobile');
  await verifyReducedQualitySettings();

  // Metered connection warning
  await expect(element(by.text('Using mobile data'))).toBeVisible();

  // User preference for mobile data
  await element(by.id('allowHighQualityOnMobile')).tap();
  await verifyHighQualitySettings();
});
```

## Performance Under Poor Network

### Perceived Performance

**Techniques to Test:**
```
1. Skeleton Screens
   - Show layout immediately
   - Fill with real content as it loads

2. Optimistic Updates
   - Update UI immediately
   - Sync in background

3. Prefetching
   - Predict next user action
   - Load data proactively

4. Caching Headers
   - Cache static assets
   - Reduce redundant requests
```

**Test Case:**
```javascript
test('Skeleton screen improves perceived performance', async () => {
  await device.setNetworkCondition('slow-3g');

  // Measure time to visible content
  const startTime = Date.now();

  await element(by.id('profileTab')).tap();

  // Skeleton should appear immediately (<100ms)
  await waitFor(element(by.id('profileSkeleton')))
    .toBeVisible()
    .withTimeout(100);

  const skeletonTime = Date.now() - startTime;
  expect(skeletonTime).toBeLessThan(200);

  // Real content fills in later
  await waitFor(element(by.id('profileName')))
    .toBeVisible()
    .withTimeout(10000);

  // User sees something immediately, improving perceived speed
});
```

## Testing Checklist

### Pre-Release Network Testing

```
✅ Slow Network (3G):
   - App usable, no long blocking operations
   - Timeouts set appropriately
   - Loading indicators shown
   - User can navigate away while loading

✅ Very Slow Network (2G):
   - Critical features work (login, view cached data)
   - Non-critical features disabled or deferred
   - Clear messaging about slow network

✅ Intermittent Connection:
   - Handles frequent disconnections
   - Resumes interrupted operations
   - No duplicate submissions

✅ Complete Offline:
   - App launches successfully
   - Cached content accessible
   - Actions queue for later
   - Clear offline messaging

✅ Transition Scenarios:
   - Online → Offline (mid-operation)
   - Offline → Online (automatic sync)
   - WiFi → Cellular (quality adjustment)
   - Cellular → WiFi (upgrade quality)

✅ Background Sync:
   - Queued actions sync when online
   - Background fetch works (iOS)
   - WorkManager executes (Android)
   - Battery-efficient sync strategy

✅ Error Handling:
   - Timeouts handled gracefully
   - HTTP errors shown clearly
   - Retry logic works correctly
   - No crashes on network errors

✅ Data Integrity:
   - No data loss offline
   - Sync conflicts resolved
   - Queue persists across app restarts
   - Local cache invalidates appropriately
```

## Monitoring Network Performance

### Metrics to Track

```javascript
// Track network request performance
const trackNetworkRequest = (url, method) => {
  const start = Date.now();

  return fetch(url, { method })
    .then(response => {
      const duration = Date.now() - start;

      analytics.track('network_request', {
        url,
        method,
        status: response.status,
        duration,
        network_type: getNetworkType(),
        success: response.ok
      });

      return response;
    })
    .catch(error => {
      const duration = Date.now() - start;

      analytics.track('network_error', {
        url,
        method,
        error: error.message,
        duration,
        network_type: getNetworkType()
      });

      throw error;
    });
};

// Monitor in production
const PERFORMANCE_TARGETS = {
  wifi: {
    p50: 500,    // 50% of requests < 500ms
    p95: 2000,   // 95% of requests < 2s
    p99: 5000    // 99% of requests < 5s
  },
  cellular: {
    p50: 1500,
    p95: 5000,
    p99: 10000
  }
};
```

## Summary

**Network Testing Essentials:**
- Test across all network conditions (5G to offline)
- Simulate with Network Link Conditioner (iOS) and throttling (Android)
- Implement offline-first architecture
- Handle transitions gracefully
- Queue operations when offline
- Retry with exponential backoff
- Progressive loading for better UX
- Monitor real-world network performance

**Offline-First Principles:**
1. App works offline by default
2. Sync when network available
3. Queue operations locally
4. Resolve conflicts intelligently
5. Clear status indicators
6. No data loss

## Next Steps

- Study [Mobile Automation](05-mobile-automation.md) frameworks
- Learn [Performance on Mobile](06-performance-mobile.md) optimization
- Practice with [Mobile Testing Lab](../../labs/software/mobile-testing-lab.md)
