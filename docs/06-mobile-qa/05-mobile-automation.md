# Mobile Automation

## Overview

Mobile test automation is essential for maintaining quality at scale across frequent releases. This lesson covers native and cross-platform automation frameworks, best practices, and strategies for building maintainable test suites.

## Framework Comparison

### Native Frameworks

**iOS: XCUITest**
```
Pros:
✅ First-class Apple support
✅ Excellent integration with Xcode
✅ Fast execution (direct access to app)
✅ Reliable element identification
✅ Built-in recording feature
✅ Accessibility integration

Cons:
❌ Swift/Objective-C only
❌ iOS-only (not cross-platform)
❌ Steeper learning curve
❌ Less flexible than third-party tools
```

**Android: Espresso**
```
Pros:
✅ Official Google framework
✅ Extremely fast (no delays)
✅ Automatic synchronization
✅ Excellent Android Studio integration
✅ Gray box testing (can access internals)
✅ Highly reliable

Cons:
❌ Kotlin/Java only
❌ Android-only
❌ White/gray box testing (requires app code access)
❌ Limited to single app testing
```

### Cross-Platform Frameworks

**Appium**
```
Pros:
✅ Supports iOS and Android
✅ Uses WebDriver protocol
✅ Multiple language bindings (JS, Python, Java, Ruby)
✅ No app modification required
✅ Large community
✅ Cloud service integration

Cons:
❌ Slower than native frameworks
❌ Complex setup
❌ Flakiness issues
❌ Requires Appium server
```

**Detox (React Native)**
```
Pros:
✅ Purpose-built for React Native
✅ Gray box testing
✅ Excellent synchronization
✅ Fast and reliable
✅ JavaScript/TypeScript
✅ CI/CD friendly

Cons:
❌ React Native apps only
❌ Smaller community than Appium
❌ Limited to RN ecosystem
```

**Maestro**
```
Pros:
✅ Simple YAML syntax
✅ Built-in flows (login, signup)
✅ Cross-platform (iOS/Android)
✅ No code required
✅ Quick setup
✅ Cloud execution

Cons:
❌ Less mature than alternatives
❌ Limited customization
❌ Smaller ecosystem
```

## iOS Automation with XCUITest

### Setup

**Creating Test Target:**
```bash
# In Xcode
1. File → New → Target
2. Select "UI Testing Bundle"
3. Name: MyAppUITests
4. Language: Swift

# Or via command line
xcodebuild -project MyApp.xcodeproj \
  -scheme MyApp \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  test
```

### Basic Test Structure

**XCUITest Example:**
```swift
import XCTest

class LoginTests: XCTestCase {

    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["--uitesting"]
        app.launch()
    }

    override func tearDownWithError() throws {
        app.terminate()
    }

    func testSuccessfulLogin() throws {
        // Find and interact with elements
        let emailField = app.textFields["emailTextField"]
        XCTAssertTrue(emailField.exists)
        emailField.tap()
        emailField.typeText("test@example.com")

        let passwordField = app.secureTextFields["passwordTextField"]
        passwordField.tap()
        passwordField.typeText("password123")

        let loginButton = app.buttons["loginButton"]
        loginButton.tap()

        // Wait for home screen
        let homeTitle = app.staticTexts["Welcome"]
        let exists = homeTitle.waitForExistence(timeout: 5)
        XCTAssertTrue(exists)
    }

    func testLoginWithInvalidCredentials() throws {
        app.textFields["emailTextField"].tap()
        app.textFields["emailTextField"].typeText("wrong@example.com")

        app.secureTextFields["passwordTextField"].tap()
        app.secureTextFields["passwordTextField"].typeText("wrongpass")

        app.buttons["loginButton"].tap()

        // Verify error message
        let errorAlert = app.alerts["Error"]
        XCTAssertTrue(errorAlert.waitForExistence(timeout: 3))

        let errorMessage = errorAlert.staticTexts["Invalid credentials"]
        XCTAssertTrue(errorMessage.exists)
    }
}
```

### Element Identification

**Strategies:**
```swift
// By accessibility identifier (best practice)
app.buttons["loginButton"]

// By label
app.buttons["Log In"]

// By index (fragile, avoid)
app.buttons.element(boundBy: 0)

// By predicate
let predicate = NSPredicate(format: "label CONTAINS[c] 'submit'")
app.buttons.containing(predicate).element

// By type
app.textFields.firstMatch
app.images.element

// Chaining queries
app.tables["userTable"].cells["userCell"].buttons["delete"]
```

**Setting Accessibility Identifiers in SwiftUI:**
```swift
Button("Log In") {
    performLogin()
}
.accessibilityIdentifier("loginButton")

TextField("Email", text: $email)
    .accessibilityIdentifier("emailTextField")
```

### Advanced XCUITest Features

**Screenshots and Attachments:**
```swift
func testCheckoutFlow() throws {
    // Take screenshot at each step
    let screenshot1 = app.screenshot()
    let attachment1 = XCTAttachment(screenshot: screenshot1)
    attachment1.name = "Cart Screen"
    add(attachment1)

    app.buttons["checkout"].tap()

    let screenshot2 = app.screenshot()
    let attachment2 = XCTAttachment(screenshot: screenshot2)
    attachment2.name = "Checkout Screen"
    add(attachment2)
}
```

**Performance Testing:**
```swift
func testAppLaunchPerformance() throws {
    measure(metrics: [XCTApplicationLaunchMetric()]) {
        XCUIApplication().launch()
    }
}

func testScrollPerformance() throws {
    let table = app.tables["productList"]

    measure(metrics: [XCTOSSignpostMetric.scrollDecelerationMetric]) {
        table.swipeUp(velocity: .fast)
    }
}
```

**Siri Shortcuts Testing:**
```swift
func testSiriShortcut() throws {
    let siri = XCUIDevice.shared.siriService

    siri.activate(voiceRecognitionText: "Order my usual coffee")

    let confirmButton = app.buttons["Confirm"]
    XCTAssertTrue(confirmButton.waitForExistence(timeout: 5))
}
```

## Android Automation with Espresso

### Setup

**build.gradle (app):**
```groovy
android {
    defaultConfig {
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}

dependencies {
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation 'androidx.test:runner:1.5.2'
    androidTestImplementation 'androidx.test:rules:1.5.0'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
}
```

### Basic Test Structure

**Espresso Example:**
```kotlin
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LoginTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun testSuccessfulLogin() {
        // Type email
        onView(withId(R.id.emailEditText))
            .perform(typeText("test@example.com"), closeSoftKeyboard())

        // Type password
        onView(withId(R.id.passwordEditText))
            .perform(typeText("password123"), closeSoftKeyboard())

        // Click login button
        onView(withId(R.id.loginButton))
            .perform(click())

        // Verify home screen appears
        onView(withId(R.id.welcomeText))
            .check(matches(isDisplayed()))
            .check(matches(withText("Welcome")))
    }

    @Test
    fun testLoginWithInvalidCredentials() {
        onView(withId(R.id.emailEditText))
            .perform(typeText("wrong@example.com"), closeSoftKeyboard())

        onView(withId(R.id.passwordEditText))
            .perform(typeText("wrongpass"), closeSoftKeyboard())

        onView(withId(R.id.loginButton))
            .perform(click())

        // Verify error message
        onView(withText("Invalid credentials"))
            .check(matches(isDisplayed()))
    }
}
```

### ViewMatchers and Actions

**Common Matchers:**
```kotlin
// By ID (most reliable)
onView(withId(R.id.button))

// By text
onView(withText("Submit"))

// By content description
onView(withContentDescription("Profile icon"))

// Combining matchers
onView(allOf(
    withId(R.id.submitButton),
    withText("Submit"),
    isEnabled()
))

// Within a parent
onView(allOf(
    withId(R.id.title),
    isDescendantOfA(withId(R.id.container))
))
```

**Common Actions:**
```kotlin
// Click
onView(withId(R.id.button)).perform(click())

// Long click
onView(withId(R.id.item)).perform(longClick())

// Type text
onView(withId(R.id.input))
    .perform(typeText("Hello"), closeSoftKeyboard())

// Clear text
onView(withId(R.id.input)).perform(clearText())

// Swipe
onView(withId(R.id.list)).perform(swipeUp())
onView(withId(R.id.item)).perform(swipeLeft())

// Scroll to
onView(withId(R.id.scrollView))
    .perform(scrollTo())
```

### RecyclerView Testing

**Testing Lists:**
```kotlin
import androidx.test.espresso.contrib.RecyclerViewActions

@Test
fun testRecyclerViewInteraction() {
    // Scroll to position
    onView(withId(R.id.recyclerView))
        .perform(RecyclerViewActions.scrollToPosition<RecyclerView.ViewHolder>(10))

    // Click item at position
    onView(withId(R.id.recyclerView))
        .perform(RecyclerViewActions.actionOnItemAtPosition<RecyclerView.ViewHolder>(
            5,
            click()
        ))

    // Match by view holder
    onView(withId(R.id.recyclerView))
        .perform(RecyclerViewActions.scrollTo<RecyclerView.ViewHolder>(
            hasDescendant(withText("Specific Item"))
        ))
}
```

### Idling Resources

**Synchronization with Async Operations:**
```kotlin
// Custom idling resource for network calls
class NetworkIdlingResource : IdlingResource {
    private var callback: IdlingResource.ResourceCallback? = null
    var isIdle = true

    override fun getName() = "NetworkIdlingResource"

    override fun isIdleNow() = isIdle

    override fun registerIdleTransitionCallback(callback: IdlingResource.ResourceCallback) {
        this.callback = callback
    }

    fun setIdle(idle: Boolean) {
        isIdle = idle
        if (idle) {
            callback?.onTransitionToIdle()
        }
    }
}

// Using in tests
@Before
fun setup() {
    IdlingRegistry.getInstance().register(networkIdlingResource)
}

@After
fun teardown() {
    IdlingRegistry.getInstance().unregister(networkIdlingResource)
}

@Test
fun testWithNetworkCall() {
    // Espresso automatically waits for idling resource
    onView(withId(R.id.loadButton)).perform(click())

    // This will wait until network call completes
    onView(withId(R.id.dataText))
        .check(matches(withText("Loaded Data")))
}
```

## Cross-Platform: Appium

### Setup

**Installation:**
```bash
# Install Appium
npm install -g appium

# Install drivers
appium driver install xcuitest  # iOS
appium driver install uiautomator2  # Android

# Start server
appium
```

**Test Configuration:**
```javascript
// WebDriverIO with Appium
const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'iOS',
  'appium:deviceName': 'iPhone 15',
  'appium:platformVersion': '17.0',
  'appium:app': '/path/to/MyApp.app',
  'appium:automationName': 'XCUITest'
};

// For Android
const androidCapabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Pixel 7',
  'appium:platformVersion': '14',
  'appium:app': '/path/to/app.apk',
  'appium:automationName': 'UiAutomator2'
};
```

### Writing Appium Tests

**Basic Test:**
```javascript
describe('Login Flow', () => {
  let driver;

  before(async () => {
    driver = await remote({
      hostname: 'localhost',
      port: 4723,
      capabilities
    });
  });

  after(async () => {
    await driver.deleteSession();
  });

  it('should login successfully', async () => {
    // Wait for element
    const emailField = await driver.$('~emailTextField');
    await emailField.waitForDisplayed({ timeout: 5000 });

    // Enter email
    await emailField.setValue('test@example.com');

    // Enter password
    const passwordField = await driver.$('~passwordTextField');
    await passwordField.setValue('password123');

    // Click login
    const loginButton = await driver.$('~loginButton');
    await loginButton.click();

    // Verify home screen
    const welcomeText = await driver.$('~welcomeText');
    await welcomeText.waitForDisplayed({ timeout: 5000 });

    const text = await welcomeText.getText();
    expect(text).toBe('Welcome');
  });
});
```

### Appium Element Locators

**Strategies:**
```javascript
// Accessibility ID (recommended for cross-platform)
await driver.$('~loginButton');

// ID (Android)
await driver.$('#com.myapp:id/loginButton');

// XPath (use sparingly, slow and fragile)
await driver.$('//XCUIElementTypeButton[@name="Login"]');

// Class name
await driver.$('android.widget.Button');

// iOS Predicate String (iOS only)
await driver.$('-ios predicate string:label CONTAINS "Login"');

// iOS Class Chain (iOS only)
await driver.$('-ios class chain:**/XCUIElementTypeButton[`label == "Login"`]');

// Android UiSelector (Android only)
await driver.$('android=new UiSelector().text("Login")');

// Multiple elements
const buttons = await driver.$$('android.widget.Button');
await buttons[0].click();
```

### Mobile Gestures

**Touch Actions:**
```javascript
// Tap
await driver.touchAction({
  action: 'tap',
  x: 100,
  y: 200
});

// Long press
await driver.touchAction({
  action: 'longPress',
  x: 100,
  y: 200
});

// Swipe
await driver.touchAction([
  { action: 'press', x: 100, y: 400 },
  { action: 'wait', ms: 100 },
  { action: 'moveTo', x: 100, y: 100 },
  { action: 'release' }
]);

// Scroll (using gesture)
const element = await driver.$('~scrollableElement');
await element.scrollIntoView();

// Pinch zoom (multitouch)
await driver.touchPerform([
  {
    action: 'press',
    options: { x: 100, y: 100 }
  },
  {
    action: 'moveTo',
    options: { x: 50, y: 50 }
  },
  {
    action: 'release'
  }
]);
```

## React Native: Detox

### Setup

**Installation:**
```bash
# Install Detox
npm install detox --save-dev

# iOS dependencies
brew tap wix/brew
brew install applesimutils

# Initialize
detox init
```

**.detoxrc.json:**
```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/MyApp.app",
      "build": "xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 15"
      }
    },
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_7_API_33"
      }
    }
  },
  "configurations": {
    "ios": {
      "device": "simulator",
      "app": "ios"
    },
    "android": {
      "device": "emulator",
      "app": "android"
    }
  }
}
```

### Detox Test Example

**e2e/login.test.js:**
```javascript
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully with valid credentials', async () => {
    // Type email
    await element(by.id('emailInput')).typeText('test@example.com');

    // Type password
    await element(by.id('passwordInput')).typeText('password123');

    // Tap login button
    await element(by.id('loginButton')).tap();

    // Wait for and verify home screen
    await waitFor(element(by.id('homeScreen')))
      .toBeVisible()
      .withTimeout(5000);

    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should show error with invalid credentials', async () => {
    await element(by.id('emailInput')).typeText('wrong@example.com');
    await element(by.id('passwordInput')).typeText('wrongpass');
    await element(by.id('loginButton')).tap();

    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });

  it('should navigate through app', async () => {
    // Login first
    await element(by.id('emailInput')).typeText('test@example.com');
    await element(by.id('passwordInput')).typeText('password123');
    await element(by.id('loginButton')).tap();

    // Navigate to profile
    await element(by.id('profileTab')).tap();
    await expect(element(by.id('profileScreen'))).toBeVisible();

    // Scroll in profile
    await element(by.id('profileScrollView')).scrollTo('bottom');

    // Tap logout
    await element(by.id('logoutButton')).tap();

    // Confirm logout
    await element(by.text('Confirm')).tap();

    // Should return to login
    await expect(element(by.id('loginScreen'))).toBeVisible();
  });
});
```

### Detox Matchers and Actions

**Element Matching:**
```javascript
// By ID (testID in React Native)
element(by.id('submitButton'))

// By text
element(by.text('Submit'))

// By label (iOS accessibility label)
element(by.label('Submit'))

// By type
element(by.type('RCTScrollView'))

// By traits (iOS accessibility traits)
element(by.traits(['button']))

// Combining matchers
element(by.id('submitButton').and(by.text('Submit')))

// Index
element(by.type('RCTView')).atIndex(2)
```

**Actions:**
```javascript
// Tap
await element(by.id('button')).tap();

// Long press
await element(by.id('item')).longPress();

// Multi-tap
await element(by.id('button')).multiTap(3);

// Type text
await element(by.id('input')).typeText('Hello');

// Replace text (faster)
await element(by.id('input')).replaceText('New text');

// Clear text
await element(by.id('input')).clearText();

// Scroll
await element(by.id('scrollView')).scroll(200, 'down');
await element(by.id('scrollView')).scrollTo('bottom');

// Swipe
await element(by.id('screen')).swipe('left', 'fast', 0.75);
```

## Page Object Model

**Best Practice Pattern:**
```javascript
// pages/LoginPage.js
class LoginPage {
  get emailInput() {
    return element(by.id('emailInput'));
  }

  get passwordInput() {
    return element(by.id('passwordInput'));
  }

  get loginButton() {
    return element(by.id('loginButton'));
  }

  get errorMessage() {
    return element(by.id('errorMessage'));
  }

  async login(email, password) {
    await this.emailInput.typeText(email);
    await this.passwordInput.typeText(password);
    await this.loginButton.tap();
  }

  async expectError(message) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }
}

export default new LoginPage();

// Using in tests
import loginPage from './pages/LoginPage';

it('should login successfully', async () => {
  await loginPage.login('test@example.com', 'password123');
  await expect(element(by.id('homeScreen'))).toBeVisible();
});
```

## CI/CD Integration

### GitHub Actions - iOS

```yaml
name: iOS E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install pods
        run: cd ios && pod install

      - name: Build app
        run: detox build --configuration ios

      - name: Run tests
        run: detox test --configuration ios --cleanup

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: ios-test-artifacts
          path: artifacts/
```

### GitHub Actions - Android

```yaml
name: Android E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Create AVD
        run: |
          echo "y" | $ANDROID_HOME/tools/bin/sdkmanager --install 'system-images;android-33;google_apis;x86_64'
          echo "no" | $ANDROID_HOME/tools/bin/avdmanager create avd -n test_emulator -k 'system-images;android-33;google_apis;x86_64' --force

      - name: Start emulator
        run: |
          $ANDROID_HOME/emulator/emulator -avd test_emulator -no-window -gpu swiftshader_indirect -no-snapshot -noaudio -no-boot-anim &
          $ANDROID_HOME/platform-tools/adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'

      - name: Build app
        run: detox build --configuration android

      - name: Run tests
        run: detox test --configuration android --headless

      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: android-test-artifacts
          path: artifacts/
```

## Best Practices

### 1. Test Organization

```javascript
// Group related tests
describe('Authentication', () => {
  describe('Login', () => {
    it('should login with valid credentials', async () => {});
    it('should show error with invalid credentials', async () => {});
    it('should disable button when fields empty', async () => {});
  });

  describe('Signup', () => {
    it('should create new account', async () => {});
    it('should validate email format', async () => {});
  });

  describe('Password Reset', () => {
    it('should send reset email', async () => {});
  });
});
```

### 2. Use Explicit Waits

```javascript
// ✅ Good - explicit wait
await waitFor(element(by.id('loadedContent')))
  .toBeVisible()
  .withTimeout(10000);

// ❌ Bad - arbitrary sleep
await new Promise(resolve => setTimeout(resolve, 5000));
```

### 3. Idempotent Tests

```javascript
// Each test should reset state
beforeEach(async () => {
  await device.reloadReactNative();
  // Or clear app data
  await device.clearKeychain(); // iOS
  await device.launchApp({ delete: true }); // Clear data
});
```

### 4. Test Data Management

```javascript
// Use test data factory
class TestDataFactory {
  static validUser() {
    return {
      email: `test${Date.now()}@example.com`,
      password: 'ValidPass123!'
    };
  }

  static invalidUser() {
    return {
      email: 'invalid-email',
      password: '123'
    };
  }
}

// Use in tests
const user = TestDataFactory.validUser();
await loginPage.login(user.email, user.password);
```

### 5. Screenshot on Failure

```javascript
// Detox
afterEach(async function () {
  if (this.currentTest.state === 'failed') {
    await device.takeScreenshot(this.currentTest.title);
  }
});

// XCUITest
override func tearDownWithError() throws {
    if let failure = testRun?.hasSucceeded, !failure {
        let screenshot = XCUIScreen.main.screenshot()
        let attachment = XCTAttachment(screenshot: screenshot)
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
```

## Debugging Tests

### Detox Debug Mode

```bash
# Run with debug logs
detox test --configuration ios --loglevel trace

# Run single test file
detox test e2e/login.test.js --configuration ios

# Run specific test
detox test e2e/login.test.js -t "should login successfully"

# Debug mode (opens debugger)
detox test --configuration ios --inspect-brk
```

### Element Inspector

```javascript
// Print element hierarchy
await device.printXMLToConsole();

// Take screenshot and save
await device.takeScreenshot('debug-screenshot');

// Log element attributes
const element = await driver.$('~loginButton');
console.log(await element.getAttribute('enabled'));
console.log(await element.getAttribute('visible'));
```

## Summary

**Key Takeaways:**
- Use native frameworks (XCUITest, Espresso) for best reliability
- Choose cross-platform (Appium, Detox) for code reuse
- Implement Page Object Model for maintainability
- Use explicit waits, never arbitrary sleeps
- Keep tests idempotent and independent
- Integrate with CI/CD pipelines
- Debug with screenshots and element inspection

**Framework Selection Guide:**
- **iOS only** → XCUITest
- **Android only** → Espresso
- **Both platforms, separate codebases** → XCUITest + Espresso
- **Both platforms, single codebase** → Appium
- **React Native** → Detox

## Next Steps

- Study [Performance on Mobile](06-performance-mobile.md) testing
- Learn [Mobile Security Testing](07-mobile-security.md)
- Practice with [Mobile Testing Lab](../../labs/software/mobile-testing-lab.md)
