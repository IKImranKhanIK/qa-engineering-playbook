# App Store Readiness

## Overview

App store submission is a critical milestone that requires careful preparation. This lesson covers the requirements, review process, and best practices for successfully publishing to the App Store (iOS) and Google Play (Android).

## App Store vs Google Play

### Key Differences

| Aspect | Apple App Store | Google Play Store |
|--------|----------------|------------------|
| Review Time | 1-3 days | 1-3 hours (expedited: minutes) |
| Review Process | Manual human review | Automated + manual spot checks |
| Approval Rate | ~60% first submission | ~85% first submission |
| Rejection Rate | ~40% (strict guidelines) | ~15% (more lenient) |
| Update Speed | 1-3 days per update | Same day |
| Rollback | Must submit new version | Instant rollback available |
| Beta Testing | TestFlight (100 internal, 10,000 external) | Internal/Closed/Open tracks |
| Age Rating | Required, strict | Required, flexible |
| Content Policy | Very strict (no adult content) | More permissive |

## iOS App Store Submission

### Pre-Submission Checklist

**1. App Store Connect Setup**
```
✅ Apple Developer account ($99/year)
✅ App ID created
✅ Certificates and provisioning profiles configured
✅ App Store Connect app record created
✅ Privacy policy URL (required)
✅ Support URL
✅ Copyright information
```

**2. App Information**
```
✅ App name (max 30 characters)
✅ Subtitle (max 30 characters)
✅ Primary category (required)
✅ Secondary category (optional)
✅ Age rating questionnaire completed
✅ App description (max 4,000 characters)
✅ Keywords (max 100 characters, comma-separated)
✅ What's New text (max 4,000 characters)
✅ Promotional text (max 170 characters)
```

**3. Visual Assets**
```
✅ App Icon (1024x1024px, no alpha channel)
✅ Screenshots:
   - iPhone 6.7" (required): 1290x2796px
   - iPhone 6.5" (required): 1242x2688px
   - iPhone 5.5" (optional): 1242x2208px
   - iPad Pro 12.9" (required if iPad app): 2048x2732px
✅ App Preview videos (optional, 15-30 seconds)
✅ All screenshots show actual app functionality
✅ No placeholder text "Lorem ipsum" in screenshots
```

**4. Build Requirements**
```
✅ Built with latest Xcode
✅ Targets latest iOS SDK
✅ Minimum deployment target set (iOS 15+ recommended)
✅ App binary uploaded via Xcode or Transporter
✅ Build number increments with each upload
✅ Version number follows semantic versioning (1.0.0)
✅ All architectures included (arm64)
✅ Bitcode included (if required)
```

**5. App Review Information**
```
✅ Demo account credentials (if login required)
✅ Special instructions for reviewers
✅ Contact information (first name, last name, phone, email)
✅ Notes about non-obvious features
✅ Explanation of permissions requested
```

### Common Rejection Reasons (iOS)

**1. Guideline 2.1: App Completeness**
```
❌ Crashes on launch
❌ Broken links or buttons
❌ Placeholder content ("Coming Soon")
❌ Incomplete information
❌ References to "beta" or "demo"

✅ Fix:
- Test thoroughly on actual devices
- Remove all debug/test features
- Complete all sections
- Professional, finished experience
```

**2. Guideline 4.3: Spam / Similar Apps**
```
❌ Duplicate apps with minor changes
❌ Template apps with just content swapped
❌ Same functionality as existing app

✅ Fix:
- Consolidate features into one app
- Use in-app purchases for variations
- Significant differentiation
```

**3. Guideline 5.1.1: Data Collection and Storage**
```
❌ Requesting permissions without clear purpose
❌ Missing privacy policy
❌ Accessing data before permission granted
❌ Not explaining data usage

✅ Fix:
- Add privacy policy URL
- Explain why each permission is needed
- Request permissions only when needed
- Be transparent about data usage
```

**4. Guideline 2.3.10: Accurate Metadata**
```
❌ Screenshots don't match actual app
❌ Description mentions features not present
❌ Hidden or undocumented features
❌ Misleading app name

✅ Fix:
- Update screenshots to match current version
- Accurate feature descriptions
- Remove misleading information
```

**5. Guideline 4.2: Minimum Functionality**
```
❌ App is just a website wrapper
❌ Single-purpose apps (flashlight only)
❌ Apps with minimal utility

✅ Fix:
- Add native features
- Integrate with device capabilities
- Provide substantial functionality
```

### iOS Review Process

**Timeline:**
```
1. Submit → 2-12 hours: "Waiting for Review"
2. 1-3 days: "In Review" (usually 24-48 hours)
3. Outcome:
   - Approved → "Ready for Sale"
   - Rejected → Fix issues and resubmit
   - Metadata Rejected → Update info and resubmit (faster)
```

**Expedited Review Request:**
```
Criteria (use sparingly):
- Critical bug fix
- Time-sensitive event
- Serious security issue

Process:
1. App Store Connect → My Apps → App Version
2. Request Expedited Review
3. Explain urgent reason
4. Usually processed within 24 hours
```

## Android Google Play Submission

### Pre-Submission Checklist

**1. Google Play Console Setup**
```
✅ Google Play Developer account ($25 one-time)
✅ App created in Play Console
✅ Store listing completed
✅ Content rating questionnaire
✅ Privacy policy URL (required)
✅ App access (provide test credentials if needed)
```

**2. App Bundle/APK Requirements**
```
✅ Android App Bundle (.aab) preferred over APK
✅ Target API level: Latest or n-1 (e.g., API 33/34)
✅ Signed with upload key
✅ Version code increments (integer)
✅ Version name (user-facing, e.g., 1.0.0)
✅ Permissions declared in manifest
✅ File size: <150MB (use APK Expansion if larger)
```

**3. Store Listing**
```
✅ App name (max 30 characters)
✅ Short description (max 80 characters)
✅ Full description (max 4,000 characters)
✅ App icon (512x512px)
✅ Feature graphic (1024x500px)
✅ Screenshots (min 2, max 8 per device type):
   - Phone: 320px - 3840px
   - 7" Tablet: 1024x600px
   - 10" Tablet: 1920x1080px
✅ Promo video (YouTube link, optional)
✅ Category (required)
✅ Tags (optional, 5 max)
✅ Contact details (email, phone, website)
```

**4. Content Rating**
```
✅ IARC questionnaire completed
✅ Ratings received (ESRB, PEGI, etc.)
✅ Accurate representation of content
✅ Age-appropriate content
```

**5. Pricing & Distribution**
```
✅ Free or paid (price set)
✅ Countries/regions selected
✅ Content rating confirmed
✅ Target audience selected
✅ News app designation (if applicable)
```

### Common Rejection Reasons (Android)

**1. Policy Violations**
```
❌ Malware or spyware
❌ Deceptive behavior
❌ Accessing sensitive data without permission
❌ Inappropriate content

✅ Fix:
- Review Play Console policy warnings
- Remove violating functionality
- Update permissions
```

**2. App Quality Issues**
```
❌ Crashes on startup
❌ Core functionality broken
❌ Unresponsive UI
❌ Security vulnerabilities

✅ Fix:
- Pre-launch report in Play Console
- Test on all target Android versions
- Fix crashes and ANRs
```

**3. Missing Information**
```
❌ Incomplete store listing
❌ Missing privacy policy
❌ Invalid contact information
❌ Misleading metadata

✅ Fix:
- Complete all required fields
- Add valid URLs
- Accurate descriptions
```

**4. Target API Requirements**
```
❌ Targeting old API level (Android enforces)
❌ Missing required permissions for target API

✅ Fix:
- Update targetSdkVersion to latest or n-1
- Test on latest Android version
- Update deprecated APIs
```

### Android Review Process

**Timeline:**
```
1. Upload → Immediately: Automated scan
2. 1-3 hours: Basic review (usually)
3. 24-48 hours: Full review (if flagged)
4. Outcome:
   - Published → Live within hours
   - Rejected → Fix and resubmit
   - Suspended → Appeal or fix critical issues
```

**Staged Rollout:**
```
Best practice for major updates:
1. Upload new version
2. Set rollout percentage (10% → 50% → 100%)
3. Monitor crash-free rate, ANR rate
4. Increase percentage if stable
5. Halt rollout if issues detected
6. Instant rollback if needed

// Example rollout strategy
Day 1: 10% rollout, monitor for 24h
Day 2: If stable, increase to 25%
Day 3: Increase to 50%
Day 4: Increase to 100%
```

## Platform-Specific Guidelines

### iOS Human Interface Guidelines (HIG)

**Design Principles:**
```
1. Clarity: Text is legible, icons are precise
2. Deference: Content is king, UI doesn't compete
3. Depth: Visual layers convey hierarchy

Key Requirements:
✅ 44x44pt minimum tap targets
✅ System fonts or custom (properly licensed)
✅ SF Symbols usage (if applicable)
✅ Safe area insets respected
✅ Accessible to all users
✅ Dark mode support (strongly recommended)
✅ Localization support
```

**Navigation:**
```
✅ Use native navigation patterns:
   - Tab bar for main sections
   - Navigation bar for hierarchy
   - Modal sheets for tasks
✅ Back button behavior consistent
✅ No hamburger menu (iOS discourages)
```

### Android Material Design

**Design Principles:**
```
1. Material is the metaphor
2. Bold, graphic, intentional
3. Motion provides meaning

Key Requirements:
✅ 48x48dp minimum tap targets
✅ Floating action button (FAB) for primary action
✅ Bottom navigation or navigation drawer
✅ Material components library
✅ Adaptive icons (API 26+)
✅ Dark theme support (API 29+)
✅ Edge-to-edge content
```

## Pre-Launch Testing

### iOS TestFlight

**Internal Testing:**
```
- Up to 100 internal testers
- No review required
- Instant distribution
- 90-day build expiration

Setup:
1. App Store Connect → TestFlight
2. Add internal testers (email)
3. Upload build
4. Automatically available to testers
```

**External Testing:**
```
- Up to 10,000 external testers
- Requires Beta App Review (1-2 days)
- Public link or email invitation
- Collect feedback via TestFlight

Setup:
1. Add external testers group
2. Submit for review
3. Once approved, share public link
4. Testers install via TestFlight app
```

### Android Testing Tracks

**Internal Testing:**
```
- Up to 100 testers
- No review required
- Immediate distribution

Setup:
1. Play Console → Release → Testing
2. Create internal testing release
3. Add testers (Google accounts or lists)
4. Upload APK/AAB
5. Share opt-in URL
```

**Closed Testing:**
```
- Up to 2000 testers per track
- Email lists or Google Groups
- Can have multiple tracks (alpha, beta, etc.)

Setup:
1. Create closed testing track
2. Add tester lists
3. Upload build
4. Testers opt-in via Play Store
```

**Open Testing:**
```
- Unlimited testers
- Public opt-in
- Visible in Play Store with "early access" badge

Setup:
1. Create open testing track
2. Upload build
3. Publish
4. Share opt-in link
```

## Post-Submission Monitoring

### iOS App Analytics

**Monitor in App Store Connect:**
```
- Impressions & downloads
- Crash rate (crashes per session)
- Energy impact
- App Store ratings & reviews
- TestFlight feedback
```

### Android Play Console Vitals

**Monitor:**
```
Critical metrics:
- Crash rate (target: <0.5%)
- ANR rate (target: <0.5%)
- Battery drain
- Wake locks
- Rendering time
- Slow rendering (target: <8%)
- Frozen frames (target: <0.1%)

Track by:
- Device model
- Android version
- Country
- App version
```

### Crash Reporting Integration

**Recommended tools:**
```javascript
// Firebase Crashlytics (cross-platform)
crashlytics.recordError(error, {
  context: 'App Store Submission',
  version: '1.0.0',
  user_id: userId
});

// Sentry
Sentry.captureException(error);

// Bugsnag
Bugsnag.notify(error);
```

## App Store Optimization (ASO)

### Keywords Strategy

**iOS:**
```
- 100 character limit
- Comma-separated, no spaces after commas
- No app name repetition
- Focus on high-traffic, low-competition keywords

Example:
"fitness,workout,exercise,gym,training,health,weight,muscle,cardio,yoga"
```

**Android:**
```
- Naturally integrate keywords into description
- First 250 characters most important
- Use in short description
- Repeat important keywords 2-3 times
```

### Screenshot Best Practices

```
✅ First screenshot is most important (30% see only first)
✅ Show key features, not just UI
✅ Add text overlays explaining features
✅ Localize screenshots for target markets
✅ Use consistent design language
✅ Update with each major release
✅ A/B test different screenshot sets

❌ No UI-only screenshots
❌ No text-heavy images
❌ No misleading representations
```

## Localization

**Priority Markets:**
```
Tier 1:
- English (US, UK)
- Spanish (Spain, Latin America)
- French (France, Canada)
- German
- Japanese
- Chinese (Simplified, Traditional)

Tier 2:
- Korean
- Portuguese (Brazil)
- Italian
- Russian
- Dutch
- Swedish
```

**Localization Checklist:**
```
✅ App metadata (name, description, keywords)
✅ Screenshots (with localized text)
✅ In-app text strings
✅ Date/time formats
✅ Currency
✅ Number formats
✅ RTL support (Arabic, Hebrew)
✅ Cultural appropriateness
✅ Legal requirements per region
```

## Summary

**iOS App Store:**
- Strict manual review (1-3 days)
- High rejection rate (~40%)
- TestFlight for beta testing
- Emphasis on design guidelines
- Slower update cycle

**Google Play:**
- Automated + spot checks (hours)
- Lower rejection rate (~15%)
- Flexible testing tracks
- More lenient policies
- Fast updates and rollbacks

**Both:**
- Complete metadata required
- Professional screenshots
- Privacy policy mandatory
- Thorough pre-launch testing
- Continuous monitoring post-launch

## Next Steps

- Study [Network & Offline Testing](04-network-offline-testing.md)
- Learn [Mobile Automation](05-mobile-automation.md)
- Practice with [Mobile Testing Lab](../../labs/software/mobile-testing-lab.md)
