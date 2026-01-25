# Performance on Mobile

## Overview

Mobile performance directly impacts user experience, retention, and app store ratings. Users expect fast, smooth, and battery-efficient apps. This lesson covers key performance metrics, profiling tools, and optimization strategies for iOS and Android.

## Key Performance Metrics

### Critical Thresholds

**App Launch Time:**
```
Cold Start (app not in memory):
✅ Excellent: < 1 second
✅ Good: 1-2 seconds
⚠️ Acceptable: 2-3 seconds
❌ Poor: > 3 seconds

Warm Start (app in background):
✅ Excellent: < 500ms
✅ Good: 500ms - 1s
❌ Poor: > 1s

Hot Start (app in foreground):
✅ Excellent: < 100ms
✅ Good: 100-300ms
```

**Frame Rate (FPS):**
```
Target: 60 FPS (16.67ms per frame)
✅ Smooth: > 55 FPS consistently
⚠️ Noticeable jank: 45-55 FPS
❌ Poor: < 45 FPS

For 120Hz displays (ProMotion, some Android):
Target: 120 FPS (8.33ms per frame)
```

**Memory Usage:**
```
Low-end devices (2GB RAM):
✅ Good: < 100 MB
⚠️ Acceptable: 100-200 MB
❌ Excessive: > 200 MB

Mid-range devices (4GB RAM):
✅ Good: < 200 MB
⚠️ Acceptable: 200-400 MB
❌ Excessive: > 400 MB

High-end devices (8GB+ RAM):
✅ Good: < 300 MB
⚠️ Acceptable: 300-600 MB
```

**Battery Drain:**
```
Background (per hour):
✅ Excellent: < 1% per hour
✅ Good: 1-2% per hour
⚠️ Acceptable: 2-5% per hour
❌ Poor: > 5% per hour

Active use (per hour):
✅ Excellent: < 10% per hour
✅ Good: 10-20% per hour
⚠️ High: 20-30% per hour
❌ Excessive: > 30% per hour
```

**Network Performance:**
```
API Response Time:
✅ Excellent: < 500ms
✅ Good: 500ms - 1s
⚠️ Acceptable: 1-2s
❌ Poor: > 2s

Time to First Byte (TTFB):
✅ Excellent: < 200ms
✅ Good: 200-500ms
```

## iOS Performance Profiling

### Xcode Instruments

**Time Profiler:**
```swift
// Measure CPU usage and identify bottlenecks

1. Product → Profile (⌘I)
2. Select "Time Profiler"
3. Record while using app
4. Analyze call tree

Key areas to check:
- Methods taking > 16ms (blocks 60 FPS)
- Heavy main thread operations
- Redundant calculations
- Inefficient algorithms
```

**Allocations:**
```
// Track memory allocations and leaks

1. Select "Allocations" template
2. Record during typical usage
3. Look for:
   - Growing memory over time
   - Abandoned memory (leaks)
   - Large allocations
   - Retain cycles

Tips:
- Use "Mark Generation" to track specific flows
- Filter by category (All Heap, All Anonymous VM)
- Check for zombie objects
```

**Leaks:**
```
// Detect memory leaks

Common leak patterns:
1. Retain cycles (strong reference loops)
2. Delegates not marked as weak
3. Closures capturing self strongly
4. Notification observers not removed

Example leak fix:
❌ self.callback = { self.doSomething() }
✅ self.callback = { [weak self] in self?.doSomething() }
```

**Energy Log:**
```
// Measure battery impact

Metrics tracked:
- CPU usage
- Network activity
- Location services
- Display brightness
- Background tasks

Red flags:
- High CPU usage when idle
- Frequent network requests
- Continuous location updates
- Wake locks
```

### iOS Performance Test Metrics

**XCTest Performance Metrics:**
```swift
func testAppLaunchPerformance() {
    measure(metrics: [XCTApplicationLaunchMetric()]) {
        XCUIApplication().launch()
    }
    // Baseline: 0.8s, Tolerance: ±10%
}

func testScrollPerformance() {
    let app = XCUIApplication()
    app.launch()

    let table = app.tables.firstMatch

    measure(metrics: [XCTOSSignpostMetric.scrollDecelerationMetric]) {
        table.swipeUp(velocity: .fast)
    }
}

func testCPUUsage() {
    measure(metrics: [XCTCPUMetric()]) {
        // Perform CPU-intensive operation
        app.buttons["processData"].tap()
        sleep(5)
    }
}

func testMemoryUsage() {
    measure(metrics: [XCTMemoryMetric()]) {
        // Load large dataset
        app.buttons["loadImages"].tap()
        sleep(3)
    }
}
```

### MetricKit (Production Monitoring)

**Collecting Metrics:**
```swift
import MetricKit

class MetricsManager: NSObject, MXMetricManagerSubscriber {

    override init() {
        super.init()
        MXMetricManager.shared.add(self)
    }

    func didReceive(_ payloads: [MXMetricPayload]) {
        for payload in payloads {
            // App launch time
            if let launchMetrics = payload.applicationLaunchMetrics {
                print("Launch time: \(launchMetrics.histogrammedTimeToFirstDrawKey)")
            }

            // Hang rate
            if let hangMetrics = payload.applicationResponsivenessMetrics {
                print("Hang time: \(hangMetrics.histogrammedApplicationHangTime)")
            }

            // Memory
            if let memoryMetrics = payload.memoryMetrics {
                print("Peak memory: \(memoryMetrics.peakMemoryUsage)")
            }

            // Battery
            if let cpuMetrics = payload.cpuMetrics {
                print("CPU time: \(cpuMetrics.cumulativeCPUTime)")
            }

            // Send to analytics
            Analytics.track("performance_metrics", payload.dictionaryRepresentation())
        }
    }
}
```

## Android Performance Profiling

### Android Profiler

**CPU Profiler:**
```kotlin
// In Android Studio: View → Tool Windows → Profiler

1. Select app and device
2. Click CPU timeline
3. Record trace:
   - Sampled (Java/Kotlin) - low overhead
   - Instrumented (Java/Kotlin) - detailed
   - System Trace - system calls

Analyze:
- Top Down (which methods consume most time)
- Bottom Up (which callers invoke expensive methods)
- Flame Chart (visual hierarchy)
- Call Chart (execution timeline)
```

**Memory Profiler:**
```
// Track memory allocations in real-time

Features:
1. Live memory graph
2. Capture heap dump
3. Record allocations
4. Analyze by:
   - Class name
   - Allocation count
   - Shallow size
   - Retained size

Common issues:
- Bitmap leaks
- Large collections
- Static references
- Activity/Fragment leaks
```

**LeakCanary Integration:**
```kotlin
// build.gradle
debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.12'

// Automatically detects leaks in debug builds

// Example leak notification:
/*
┬───
│ GC Root: System class
│
├─ android.view.inputmethod.InputMethodManager instance
│    Leaking: NO
│    ↓ InputMethodManager.mCurRootView
├─ android.view.ViewRootImpl instance
│    Leaking: YES (View.mContext references destroyed Activity)
│    ↓ ViewRootImpl.mView
├─ android.widget.LinearLayout instance
│    ↓ LinearLayout.mContext
╰→ com.example.MainActivity instance
     Leaking: YES
*/
```

**Network Profiler:**
```
// Monitor network requests

Tracks:
- Request/response timeline
- Payload size
- Connection type
- Thread usage

Optimization tips:
- Batch requests
- Use compression (gzip)
- Cache responses
- Reduce payload size
- Use HTTP/2 or HTTP/3
```

### Android Performance Testing

**Benchmark Library:**
```kotlin
// app/build.gradle
androidTestImplementation "androidx.benchmark:benchmark-junit4:1.2.0"

// benchmarks/ExampleBenchmark.kt
@RunWith(AndroidJUnit4::class)
class ListBenchmark {

    @get:Rule
    val benchmarkRule = BenchmarkRule()

    @Test
    fun scrollList() {
        benchmarkRule.measureRepeated {
            // Setup
            val intent = Intent(ApplicationProvider.getApplicationContext(), MainActivity::class.java)
            val scenario = ActivityScenario.launch<MainActivity>(intent)

            // Measure
            scenario.onActivity { activity ->
                val recyclerView = activity.findViewById<RecyclerView>(R.id.list)
                recyclerView.scrollToPosition(50)
            }
        }
    }
}

// Results show:
// - Minimum time
// - Median time
// - Standard deviation
```

**Macrobenchmark for Startup:**
```kotlin
@RunWith(AndroidJUnit4::class)
class StartupBenchmark {
    @get:Rule
    val benchmarkRule = MacrobenchmarkRule()

    @Test
    fun startup() = benchmarkRule.measureRepeated(
        packageName = "com.example.app",
        metrics = listOf(StartupTimingMetric()),
        iterations = 5,
        startupMode = StartupMode.COLD
    ) {
        pressHome()
        startActivityAndWait()
    }
}

// Measures:
// - Time to initial display
// - Time to fully drawn
```

### Android Vitals (Play Console)

**Key Metrics Monitored:**
```
Crash Rate:
✅ Good: < 0.5%
⚠️ Warning: 0.5-1.5%
❌ Bad: > 1.5%

ANR (Application Not Responding) Rate:
✅ Good: < 0.3%
⚠️ Warning: 0.3-1%
❌ Bad: > 1%

Slow Rendering:
✅ Good: < 8% of frames
⚠️ Warning: 8-12%
❌ Bad: > 12%

Frozen Frames:
✅ Good: < 0.1%
⚠️ Warning: 0.1-0.5%
❌ Bad: > 0.5%

Startup Time (Cold):
✅ Good: < 2s
⚠️ Warning: 2-4s
❌ Bad: > 4s
```

## Common Performance Bottlenecks

### 1. Main Thread Blocking

**Problem:**
```javascript
// ❌ Bad: Heavy operation on main thread
async function loadData() {
  const data = await fetch('/api/data'); // OK
  const processed = processLargeDataset(data); // BLOCKS UI!
  setState(processed);
}
```

**Solution:**
```javascript
// ✅ Good: Offload to background
async function loadData() {
  const data = await fetch('/api/data');

  // Process in Web Worker (React Native: use thread/queue)
  const processed = await processInBackground(data);

  setState(processed);
}
```

**iOS - Dispatch to Background:**
```swift
// ❌ Bad
let result = heavyCalculation(data) // Blocks main thread
updateUI(result)

// ✅ Good
DispatchQueue.global(qos: .userInitiated).async {
    let result = heavyCalculation(data)

    DispatchQueue.main.async {
        updateUI(result)
    }
}
```

**Android - Coroutines:**
```kotlin
// ❌ Bad
val result = heavyCalculation(data) // Blocks main thread
updateUI(result)

// ✅ Good
lifecycleScope.launch {
    val result = withContext(Dispatchers.Default) {
        heavyCalculation(data)
    }
    updateUI(result)
}
```

### 2. Image Loading & Caching

**Problem:**
```javascript
// ❌ Bad: Load full-size images
<Image source={{ uri: 'https://example.com/huge-image.jpg' }} />
```

**Solution:**
```javascript
// ✅ Good: Lazy load with caching
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: 'https://example.com/huge-image.jpg',
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.contain}
/>

// Or use responsive images
<Image
  source={{
    uri: `https://example.com/image-${width}x${height}.jpg`
  }}
/>
```

**iOS - SDWebImage:**
```swift
import SDWebImage

imageView.sd_setImage(with: URL(string: imageUrl), placeholderImage: placeholder)
```

**Android - Coil/Glide:**
```kotlin
// Coil
imageView.load("https://example.com/image.jpg") {
    crossfade(true)
    placeholder(R.drawable.placeholder)
    transformations(RoundedCornersTransformation(8.dp))
}

// Glide
Glide.with(context)
    .load(imageUrl)
    .placeholder(R.drawable.placeholder)
    .into(imageView)
```

### 3. List Rendering

**Problem:**
```javascript
// ❌ Bad: Render entire list (1000+ items)
{data.map(item => <ExpensiveComponent key={item.id} data={item} />)}
```

**Solution:**
```javascript
// ✅ Good: Virtualized list
import { FlatList } from 'react-native';

<FlatList
  data={data}
  renderItem={({ item }) => <ListItem data={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**iOS - UITableView Optimization:**
```swift
// Cell reuse
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)

    // Configure cell
    // Only set what's changed, don't recreate views

    return cell
}

// Estimated heights for better scrolling
tableView.estimatedRowHeight = 80
tableView.rowHeight = UITableView.automaticDimension
```

**Android - RecyclerView Optimization:**
```kotlin
// ViewHolder pattern (automatic with RecyclerView)
class MyAdapter : RecyclerView.Adapter<MyViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        // Inflate once, reuse
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item, parent, false)
        return MyViewHolder(view)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        // Only update data, don't recreate views
        holder.bind(items[position])
    }
}

// DiffUtil for efficient updates
class MyDiffCallback(private val old: List<Item>, private val new: List<Item>) : DiffUtil.Callback() {
    override fun areItemsTheSame(oldPos: Int, newPos: Int) = old[oldPos].id == new[newPos].id
    override fun areContentsTheSame(oldPos: Int, newPos: Int) = old[oldPos] == new[newPos]
}
```

### 4. Re-renders & State Updates

**Problem:**
```javascript
// ❌ Bad: Unnecessary re-renders
function ExpensiveList({ data, onSelect }) {
  return data.map(item => (
    <ExpensiveItem
      key={item.id}
      item={item}
      onPress={() => onSelect(item)} // New function every render!
    />
  ));
}
```

**Solution:**
```javascript
// ✅ Good: Memoization
import { useMemo, useCallback } from 'react';

const ExpensiveList = React.memo(({ data, onSelect }) => {
  const handleSelect = useCallback((item) => {
    onSelect(item);
  }, [onSelect]);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <ExpensiveItem item={item} onPress={() => handleSelect(item)} />
      )}
      keyExtractor={item => item.id}
    />
  );
});

const ExpensiveItem = React.memo(({ item, onPress }) => {
  // Only re-renders if item or onPress changes
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
});
```

### 5. Bundle Size

**Analyze Bundle:**
```bash
# React Native
npx react-native-bundle-visualizer

# Check bundle size
du -sh android/app/build/generated/assets/react/release/index.android.bundle
du -sh ios/main.jsbundle
```

**Optimization:**
```javascript
// Code splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Conditional imports
if (Platform.OS === 'ios') {
  const IosOnlyModule = require('./IosOnlyModule');
}

// Remove unused dependencies
npm uninstall lodash
npm install lodash.debounce // Only what you need

// Use Hermes (React Native)
// android/app/build.gradle
project.ext.react = [
    enableHermes: true
]
```

## Battery Optimization

### Location Services

**iOS - Appropriate Accuracy:**
```swift
// ❌ Bad: Always use best accuracy
locationManager.desiredAccuracy = kCLLocationAccuracyBest

// ✅ Good: Use lowest acceptable accuracy
locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters

// Only request when needed
locationManager.requestLocation() // Single update

// Background updates sparingly
locationManager.allowsBackgroundLocationUpdates = false
```

**Android - Fused Location:**
```kotlin
// ❌ Bad: High power, frequent updates
val request = LocationRequest.create().apply {
    interval = 1000 // 1 second
    priority = LocationRequest.PRIORITY_HIGH_ACCURACY
}

// ✅ Good: Balanced power
val request = LocationRequest.create().apply {
    interval = 60000 // 1 minute
    fastestInterval = 30000
    priority = LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY
}

// Or use geofencing instead of continuous tracking
```

### Background Tasks

**iOS - Background Modes:**
```swift
// Only use necessary background modes
// Avoid: background fetch, location, audio if not needed

// Use background tasks for deferred work
import BackgroundTasks

BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.app.refresh", using: nil) { task in
    handleAppRefresh(task: task as! BGAppRefreshTask)
}

// Schedule efficiently
let request = BGAppRefreshTaskRequest(identifier: "com.app.refresh")
request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60) // 15 minutes
```

**Android - WorkManager:**
```kotlin
// ✅ Good: Batch background work
val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.CONNECTED)
    .setRequiresBatteryNotLow(true) // Wait for charging
    .build()

val syncWork = PeriodicWorkRequestBuilder<SyncWorker>(
    15, TimeUnit.MINUTES // Minimum 15 minutes
)
    .setConstraints(constraints)
    .setBackoffCriteria(BackoffPolicy.LINEAR, 10, TimeUnit.MINUTES)
    .build()

WorkManager.getInstance(context).enqueue(syncWork)
```

### Network Efficiency

**Batching Requests:**
```javascript
// ❌ Bad: Multiple small requests
items.forEach(item => {
  fetch(`/api/items/${item.id}`);
});

// ✅ Good: Batch into single request
const ids = items.map(item => item.id);
fetch(`/api/items?ids=${ids.join(',')}`);
```

**Prefetching:**
```javascript
// Predict and prefetch next screen's data
const prefetchNextScreen = () => {
  // Low priority, cancellable fetch
  const controller = new AbortController();

  fetch('/api/next-screen-data', {
    signal: controller.signal,
    priority: 'low'
  }).then(data => cache.set('next-screen', data));

  // Cancel if user navigates elsewhere
  return () => controller.abort();
};
```

## Performance Testing Checklist

### Pre-Release Performance Audit

```
✅ App Launch:
   - Cold start < 2s
   - Warm start < 1s
   - No blocking operations on launch

✅ Rendering:
   - 60 FPS during scrolling
   - No dropped frames during animations
   - Images load progressively

✅ Memory:
   - No memory leaks
   - Memory usage stable over time
   - Proper cleanup on screen transitions

✅ Network:
   - API calls < 1s on 4G
   - Graceful handling of slow network
   - Proper caching strategy

✅ Battery:
   - < 2% drain per hour in background
   - No wake locks when idle
   - Efficient location usage

✅ Bundle Size:
   - iOS: < 50MB initial download
   - Android: < 150MB AAB
   - Code splitting for large features

✅ Device Support:
   - Smooth on 3-year-old devices
   - Acceptable on budget devices
   - No crashes due to memory
```

## Monitoring in Production

### Performance Dashboards

**Firebase Performance:**
```javascript
import perf from '@react-native-firebase/perf';

// Automatic traces
// - App start time
// - Screen rendering
// - Network requests

// Custom traces
const trace = await perf().startTrace('image_processing');
await processImage(image);
await trace.stop();

// Custom metrics
trace.putMetric('images_processed', 15);
trace.putAttribute('image_type', 'jpeg');
```

**Sentry Performance Monitoring:**
```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_DSN',
  tracesSampleRate: 0.2, // 20% of transactions
});

// Automatic transaction tracking
// Manual transaction
const transaction = Sentry.startTransaction({
  name: 'Checkout Flow',
  op: 'navigation'
});

Sentry.getCurrentHub().configureScope(scope => {
  scope.setSpan(transaction);
});

// ... perform checkout ...

transaction.finish();
```

## Summary

**Performance Priorities:**
1. **App Launch** - First impression, must be fast
2. **Frame Rate** - Smooth scrolling and animations
3. **Memory** - Prevent crashes and system kills
4. **Battery** - User retention and satisfaction
5. **Network** - Data usage and speed

**Optimization Strategy:**
- Measure first, then optimize
- Target low-end devices
- Monitor production metrics
- Fix regressions quickly
- Balance performance vs features

**Tools:**
- iOS: Xcode Instruments, MetricKit
- Android: Profiler, Android Vitals, LeakCanary
- Cross-platform: Firebase Performance, Sentry

## Next Steps

- Study [Mobile Security Testing](07-mobile-security.md)
- Review [App Store Readiness](03-app-store-readiness.md)
- Practice with [Mobile Testing Lab](../../labs/software/mobile-testing-lab.md)
