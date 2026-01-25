# Mobile Security Testing

## Overview

Mobile apps handle sensitive user data and must protect against various security threats. This lesson covers security best practices, common vulnerabilities, testing techniques, and tools for both iOS and Android platforms.

## OWASP Mobile Top 10 (2024)

### M1: Improper Platform Usage

**Description:** Misuse of platform features or failure to use security controls.

**Examples:**
```
- Not using iOS Keychain for sensitive data
- Storing passwords in SharedPreferences (Android)
- Improper use of TouchID/FaceID
- Insecure permissions configuration
```

**Test Cases:**
```
✅ Verify Keychain usage for credentials (iOS)
✅ Check KeyStore usage for crypto keys (Android)
✅ Validate biometric authentication implementation
✅ Review AndroidManifest.xml permissions
✅ Check Info.plist privacy usage descriptions
```

### M2: Insecure Data Storage

**Description:** Storing sensitive data insecurely on the device.

**Vulnerable Code (iOS):**
```swift
// ❌ Bad: Storing password in UserDefaults
UserDefaults.standard.set(password, forKey: "userPassword")

// ✅ Good: Using Keychain
let keychainItem = KeychainPasswordItem(service: "MyApp", account: "user")
try keychainItem.savePassword(password)
```

**Vulnerable Code (Android):**
```kotlin
// ❌ Bad: Plain SharedPreferences
val prefs = getSharedPreferences("app_prefs", MODE_PRIVATE)
prefs.edit().putString("api_key", apiKey).apply()

// ✅ Good: EncryptedSharedPreferences
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val encryptedPrefs = EncryptedSharedPreferences.create(
    context,
    "secret_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

encryptedPrefs.edit().putString("api_key", apiKey).apply()
```

**Testing Stored Data:**
```bash
# iOS - Extract app data
# Connect device, get app bundle ID
ideviceinstaller -l

# Backup device
idevicebackup2 backup --full /path/to/backup

# Extract and inspect
# Use tools like iBackup Viewer or SQLiteBrowser

# Check for sensitive data in:
# - UserDefaults (Library/Preferences/*.plist)
# - SQLite databases (*.db)
# - Core Data stores
# - Cache files
# - Cookies

# Android - Extract app data
adb backup -f app.ab com.example.app
dd if=app.ab bs=24 skip=1 | openssl zlib -d > app.tar
tar -xvf app.tar

# Check for sensitive data in:
# - SharedPreferences (shared_prefs/*.xml)
# - SQLite databases (databases/*.db)
# - Internal storage files
# - External storage (SD card)
```

### M3: Insecure Communication

**Description:** Failure to encrypt data in transit.

**Vulnerable Code:**
```javascript
// ❌ Bad: HTTP instead of HTTPS
fetch('http://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});

// ✅ Good: HTTPS with certificate pinning
const fetchWithPinning = async (url, options) => {
  // Certificate pinning library like react-native-ssl-pinning
  return RNSSLPinning.fetch(url, {
    ...options,
    sslPinning: {
      certs: ['sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=']
    }
  });
};
```

**iOS - Certificate Pinning:**
```swift
import Alamofire

let evaluators = [
    "api.example.com": PinnedCertificatesTrustEvaluator()
]

let manager = Session(
    serverTrustManager: ServerTrustManager(evaluators: evaluators)
)

manager.request("https://api.example.com/data").response { response in
    // Secure request
}
```

**Android - Network Security Config:**
```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <!-- Block cleartext (HTTP) traffic -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>

    <!-- Certificate pinning -->
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set expiration="2025-12-31">
            <pin digest="SHA-256">base64-encoded-pin</pin>
            <pin digest="SHA-256">backup-pin</pin>
        </pin-set>
    </domain-config>
</network-security-config>

<!-- AndroidManifest.xml -->
<application
    android:networkSecurityConfig="@xml/network_security_config">
</application>
```

**Testing Network Security:**
```bash
# Intercept traffic with Burp Suite or Charles Proxy

# iOS:
1. Install proxy certificate on device
2. Settings → Wi-Fi → Configure Proxy → Manual
3. Set proxy IP and port
4. General → About → Certificate Trust Settings → Enable

# Android:
1. Install Burp/Charles certificate
2. Settings → Wi-Fi → Modify Network → Advanced → Proxy
3. For Android 7+, add to network_security_config.xml:
<debug-overrides>
    <trust-anchors>
        <certificates src="user" />
    </trust-anchors>
</debug-overrides>

# Verify:
- All traffic uses HTTPS
- No sensitive data in URLs
- Certificate validation works
- Certificate pinning prevents MITM
```

### M4: Insecure Authentication

**Description:** Weak authentication mechanisms.

**Common Vulnerabilities:**
```
❌ Client-side authentication only
❌ Weak password requirements
❌ No rate limiting on login attempts
❌ Credentials stored in code
❌ Biometric bypass possible
```

**Secure Authentication (iOS):**
```swift
// Biometric authentication
import LocalAuthentication

func authenticateUser() {
    let context = LAContext()
    var error: NSError?

    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
        let reason = "Authenticate to access your account"

        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
            if success {
                // Retrieve credentials from Keychain
                // Make server request with credentials
            }
        }
    }
}

// Token-based auth
struct AuthToken {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date

    var isExpired: Bool {
        return Date() > expiresAt
    }
}

// Refresh token before expiry
if authToken.isExpired {
    authToken = try await refreshToken(authToken.refreshToken)
}
```

**Secure Authentication (Android):**
```kotlin
// BiometricPrompt
val executor = ContextCompat.getMainExecutor(this)
val biometricPrompt = BiometricPrompt(this, executor,
    object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            // Retrieve credentials from KeyStore
            val credentials = retrieveFromKeyStore()
            authenticateWithServer(credentials)
        }
    }
)

val promptInfo = BiometricPrompt.PromptInfo.Builder()
    .setTitle("Biometric login")
    .setSubtitle("Log in using your biometric credential")
    .setNegativeButtonText("Use password")
    .build()

biometricPrompt.authenticate(promptInfo)
```

**Authentication Test Cases:**
```
✅ Password requirements enforced
✅ Account lockout after failed attempts
✅ Tokens expire and refresh properly
✅ Biometric fallback to password
✅ Session timeout works
✅ Logout clears all credentials
✅ Multi-factor authentication (if applicable)
```

### M5: Insufficient Cryptography

**Description:** Weak encryption or crypto implementation.

**Vulnerable Code:**
```swift
// ❌ Bad: Weak encryption
let password = "password123"
let encrypted = password.data(using: .utf8)?.base64EncodedString()

// ❌ Bad: Hardcoded key
let key = "hardcodedkey1234"

// ✅ Good: Strong encryption with Keychain
import CryptoKit

// Generate key
let key = SymmetricKey(size: .bits256)

// Store key in Keychain
let keyData = key.withUnsafeBytes { Data($0) }
try keychainItem.savePassword(keyData.base64EncodedString())

// Encrypt data
let sealedBox = try AES.GCM.seal(data, using: key)
let encryptedData = sealedBox.combined
```

**Android Cryptography:**
```kotlin
// ✅ Good: Android KeyStore
val keyGenerator = KeyGenerator.getInstance(
    KeyProperties.KEY_ALGORITHM_AES,
    "AndroidKeyStore"
)

val keyGenParameterSpec = KeyGenParameterSpec.Builder(
    "MyKeyAlias",
    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
)
    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
    .setKeySize(256)
    .build()

keyGenerator.init(keyGenParameterSpec)
val secretKey = keyGenerator.generateKey()

// Encrypt
val cipher = Cipher.getInstance("AES/GCM/NoPadding")
cipher.init(Cipher.ENCRYPT_MODE, secretKey)
val encryptedData = cipher.doFinal(plaintext)
val iv = cipher.iv
```

**Cryptography Checklist:**
```
✅ Use AES-256 for symmetric encryption
✅ Use RSA-2048+ for asymmetric
✅ Generate keys securely (not hardcoded)
✅ Store keys in Keychain/KeyStore
✅ Use authenticated encryption (GCM mode)
✅ Proper IV/nonce generation
✅ Avoid deprecated algorithms (MD5, SHA1, DES)
```

### M6: Insecure Authorization

**Description:** Improper permission checks and access control.

**Vulnerable Code:**
```javascript
// ❌ Bad: Client-side role check only
if (user.role === 'admin') {
  showAdminPanel();
}

// ✅ Good: Server validates permissions
const canAccessAdmin = await fetch('/api/check-permission?resource=admin')
  .then(r => r.json());

if (canAccessAdmin) {
  showAdminPanel();
}
```

**iOS - Insecure Direct Object Reference:**
```swift
// ❌ Bad: Trusting client-provided ID
let userID = UserDefaults.standard.integer(forKey: "userID")
fetch("https://api.example.com/user/\(userID)/profile")

// ✅ Good: Server validates ownership
// Server checks if authenticated user can access this resource
fetch("https://api.example.com/user/me/profile")
```

**Authorization Test Cases:**
```
✅ Users can only access their own data
✅ Role-based access enforced server-side
✅ API endpoints validate authorization
✅ Deep links validate permissions
✅ File access restricted properly
✅ Privilege escalation not possible
```

### M7: Client Code Quality

**Description:** Code-level vulnerabilities.

**Common Issues:**
```
❌ Buffer overflows
❌ SQL injection
❌ Path traversal
❌ Memory corruption
❌ Insecure random number generation
```

**SQL Injection (Vulnerable):**
```swift
// ❌ Bad: String interpolation
let query = "SELECT * FROM users WHERE username = '\(username)'"
// username = "admin' OR '1'='1" bypasses authentication

// ✅ Good: Parameterized queries
let query = "SELECT * FROM users WHERE username = ?"
try db.prepare(query).run(username)
```

**Path Traversal (Vulnerable):**
```kotlin
// ❌ Bad: User-controlled file path
val filename = intent.getStringExtra("filename")
val file = File(cacheDir, filename)
// filename = "../../../etc/passwd" accesses sensitive files

// ✅ Good: Validate and sanitize
val filename = intent.getStringExtra("filename")
    ?.replace("[^a-zA-Z0-9.-]".toRegex(), "")
    ?: throw IllegalArgumentException()

val file = File(cacheDir, filename)
if (!file.canonicalPath.startsWith(cacheDir.canonicalPath)) {
    throw SecurityException("Path traversal attempt")
}
```

**Secure Random Number:**
```swift
// ❌ Bad: Predictable
let random = Int.random(in: 0...1000)

// ✅ Good: Cryptographically secure
import CryptoKit
let randomBytes = (0..<16).map { _ in UInt8.random(in: 0...255) }
```

### M8: Code Tampering

**Description:** App modification and reverse engineering.

**Detection Techniques:**
```swift
// iOS - Jailbreak detection
func isJailbroken() -> Bool {
    // Check for common jailbreak files
    let jailbreakPaths = [
        "/Applications/Cydia.app",
        "/usr/sbin/sshd",
        "/bin/bash",
        "/etc/apt"
    ]

    for path in jailbreakPaths {
        if FileManager.default.fileExists(atPath: path) {
            return true
        }
    }

    // Check if can write outside sandbox
    let testPath = "/private/jailbreak.txt"
    do {
        try "test".write(toFile: testPath, atomically: true, encoding: .utf8)
        try FileManager.default.removeItem(atPath: testPath)
        return true
    } catch {
        return false
    }
}
```

**Android - Root Detection:**
```kotlin
fun isRooted(): Boolean {
    // Check for root management apps
    val rootApps = listOf(
        "com.noshufou.android.su",
        "com.thirdparty.superuser",
        "eu.chainfire.supersu",
        "com.koushikdutta.superuser",
        "com.topjohnwu.magisk"
    )

    val pm = context.packageManager
    for (packageName in rootApps) {
        try {
            pm.getPackageInfo(packageName, 0)
            return true
        } catch (e: PackageManager.NameNotFoundException) {
            // Not installed
        }
    }

    // Check for su binary
    val suPaths = listOf(
        "/system/bin/su",
        "/system/xbin/su",
        "/sbin/su",
        "/data/local/su"
    )

    return suPaths.any { File(it).exists() }
}
```

**Code Obfuscation:**
```
iOS:
- Use bitcode (deprecated in Xcode 14)
- Obfuscate strings
- Strip symbols in release builds

Android:
- ProGuard / R8 obfuscation
- Native code (NDK)
- String encryption
```

**ProGuard Configuration:**
```
# android/app/proguard-rules.pro
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers

# Obfuscation
-repackageclasses
-allowaccessmodification
-flattenpackagehierarchy

# String encryption
-adaptclassstrings
```

### M9: Reverse Engineering

**Description:** Analyzing app to extract secrets.

**Protection Strategies:**
```
✅ Obfuscate code
✅ Encrypt sensitive strings
✅ Use native code for critical logic
✅ Implement anti-debugging
✅ Runtime application self-protection (RASP)
✅ Don't hardcode secrets
```

**Anti-Debugging (iOS):**
```swift
import Foundation

func isDebuggerAttached() -> Bool {
    var info = kinfo_proc()
    var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
    var size = MemoryLayout<kinfo_proc>.stride

    let result = sysctl(&mib, UInt32(mib.count), &info, &size, nil, 0)

    guard result == 0 else { return false }

    return (info.kp_proc.p_flag & P_TRACED) != 0
}

if isDebuggerAttached() {
    // Exit or degrade functionality
    fatalError("Debugger detected")
}
```

**Anti-Debugging (Android):**
```kotlin
fun isDebuggerConnected(): Boolean {
    return Debug.isDebuggerConnected() || Debug.waitingForDebugger()
}

// Detect emulator
fun isEmulator(): Boolean {
    return Build.FINGERPRINT.startsWith("generic") ||
           Build.FINGERPRINT.startsWith("unknown") ||
           Build.MODEL.contains("google_sdk") ||
           Build.MODEL.contains("Emulator") ||
           Build.MANUFACTURER.contains("Genymotion") ||
           Build.BRAND.startsWith("generic") ||
           Build.DEVICE.startsWith("generic")
}
```

### M10: Extraneous Functionality

**Description:** Debug code, backdoors, hidden features in production.

**Checklist:**
```
✅ Remove all console.log() / print() statements
✅ Disable debug menus
✅ Remove test accounts
✅ Disable developer options
✅ Remove unused permissions
✅ Strip debug symbols
✅ Disable crash reporting in sensitive apps
✅ Remove hardcoded credentials
```

**Build Configuration:**
```swift
// iOS - Conditional compilation
#if DEBUG
    print("Debug mode enabled")
    // Debug-only features
#endif

// Release-only code
#if !DEBUG
    // Disable logging
    // Enable security checks
#endif
```

```kotlin
// Android - BuildConfig
if (BuildConfig.DEBUG) {
    Timber.plant(Timber.DebugTree())
} else {
    // Production logging (crash reports only)
}

// Remove in release
if (!BuildConfig.DEBUG) {
    StrictMode.setThreadPolicy(StrictMode.ThreadPolicy.Builder().detectAll().build())
}
```

## Security Testing Tools

### Static Analysis

**iOS:**
```bash
# MobSF (Mobile Security Framework)
# Web-based platform for static/dynamic analysis

# Install
docker pull opensecurity/mobile-security-framework-mobsf
docker run -it -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest

# Upload IPA file for analysis

# Manual tools
# - Hopper Disassembler
# - class-dump (extract class info)
# - strings (find hardcoded strings)

strings MyApp.ipa | grep -i "password\|api\|key\|secret"
```

**Android:**
```bash
# APKTool - Decompile APK
apktool d app.apk

# Check AndroidManifest.xml for:
# - Dangerous permissions
# - Exported components
# - Debug flags

# Jadx - Decompile to Java
jadx -d output app.apk

# Search for secrets
grep -r "api_key\|password\|secret" output/

# MobSF
# Upload APK for comprehensive analysis
```

### Dynamic Analysis

**iOS - Frida:**
```javascript
// Hook method to log arguments
Java.perform(() => {
    const AuthClass = ObjC.classes.AuthenticationManager;

    Interceptor.attach(AuthClass['- login:password:'].implementation, {
        onEnter: function(args) {
            const username = ObjC.Object(args[2]).toString();
            const password = ObjC.Object(args[3]).toString();
            console.log(`Login attempt: ${username}:${password}`);
        }
    });
});

// Bypass jailbreak detection
Interceptor.replace(Module.findExportByName(null, 'isJailbroken'), new NativeCallback(() => {
    return 0; // Return false
}, 'int', []));
```

**Android - Frida:**
```javascript
// Hook method
Java.perform(() => {
    const AuthClass = Java.use('com.example.AuthManager');

    AuthClass.login.implementation = function(username, password) {
        console.log(`Login: ${username}:${password}`);
        return this.login(username, password);
    };

    // Bypass root detection
    const RootCheck = Java.use('com.example.RootChecker');
    RootCheck.isRooted.implementation = function() {
        console.log('Root check bypassed');
        return false;
    };
});
```

### Penetration Testing

**Test Scenarios:**
```
1. Data Storage:
   ✅ Extract app data from backup
   ✅ Check for unencrypted sensitive data
   ✅ Verify Keychain/KeyStore usage

2. Network:
   ✅ Intercept traffic with proxy
   ✅ Test certificate pinning
   ✅ Verify HTTPS only
   ✅ Check for API key exposure

3. Authentication:
   ✅ Brute force login
   ✅ Bypass biometric
   ✅ Token tampering
   ✅ Session timeout

4. Authorization:
   ✅ Access other users' data
   ✅ Privilege escalation
   ✅ Insecure direct object reference

5. Code:
   ✅ Reverse engineer app
   ✅ Extract hardcoded secrets
   ✅ Bypass security checks
   ✅ Modify app behavior

6. Runtime:
   ✅ Hook methods with Frida
   ✅ Dump memory
   ✅ Bypass root/jailbreak detection
   ✅ Modify runtime behavior
```

## Security Testing Checklist

### Pre-Release Security Audit

```
✅ Data Protection:
   - No sensitive data in logs
   - Credentials in Keychain/KeyStore
   - Database encrypted
   - Cache cleared on logout

✅ Network Security:
   - All traffic over HTTPS
   - Certificate pinning implemented
   - No sensitive data in URLs
   - API keys not in code

✅ Authentication:
   - Strong password policy
   - Rate limiting on login
   - Biometric implemented securely
   - Tokens expire and refresh

✅ Code Quality:
   - No SQL injection vulnerabilities
   - Input validation on all user input
   - Secure random number generation
   - No path traversal vulnerabilities

✅ App Integrity:
   - Code obfuscation enabled
   - Debug code removed
   - Anti-tampering checks
   - Root/jailbreak detection

✅ Permissions:
   - Minimal permissions requested
   - Runtime permission checks
   - Permission rationale shown
   - No excessive permissions

✅ Third-Party Libraries:
   - Dependencies up to date
   - Known vulnerabilities checked
   - Only trusted libraries used
   - Licenses compliant
```

## Compliance & Standards

### GDPR (EU)

```
✅ User consent for data collection
✅ Data minimization (collect only necessary data)
✅ Right to access data
✅ Right to delete data
✅ Data breach notification (72 hours)
✅ Privacy policy accessible
✅ Data stored securely
```

### CCPA (California)

```
✅ Disclose data collection practices
✅ Opt-out of data sale
✅ Access to collected data
✅ Delete personal information
```

### PCI-DSS (Payment Card Industry)

```
✅ Don't store full card numbers
✅ Don't store CVV
✅ Encrypt cardholder data
✅ Use secure payment gateways
✅ Regular security testing
```

### HIPAA (Healthcare)

```
✅ Encrypt protected health information (PHI)
✅ Access controls and audit logs
✅ Data integrity checks
✅ Secure transmission
✅ Business associate agreements
```

## Summary

**Security Priorities:**
1. **Data Protection** - Encrypt sensitive data at rest and in transit
2. **Authentication** - Implement strong, multi-factor authentication
3. **Authorization** - Validate permissions server-side
4. **Code Quality** - Follow secure coding practices
5. **App Integrity** - Protect against tampering and reverse engineering

**Testing Strategy:**
- Use automated tools (MobSF, static analyzers)
- Perform manual penetration testing
- Monitor security advisories
- Regular security audits
- Implement RASP (Runtime Application Self-Protection)

**Key Takeaways:**
- Security is not optional
- Test security throughout development
- Don't trust the client
- Encrypt everything
- Stay updated on vulnerabilities

## Next Steps

- Review [OWASP Mobile Security](https://owasp.org/www-project-mobile-top-10/)
- Practice with [Mobile Testing Lab](../../labs/software/mobile-testing-lab.md)
- Study [iOS/Android Test Strategies](01-ios-android-strategies.md)
