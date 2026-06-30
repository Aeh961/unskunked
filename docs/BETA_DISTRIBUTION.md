# Unskunked Beta Distribution

This guide prepares Unskunked for real beta testing with friends, anglers, and early users.

## Environment Requirements

- Node.js 22+
- npm
- Expo CLI through `npx`
- Xcode for iOS Simulator and TestFlight builds
- Android Studio for Android Emulator and internal testing builds
- Expo account for EAS builds
- Apple Developer Program membership for TestFlight
- Google Play Console account for Android internal testing

## Baseline Commands

Run these before sharing a beta build:

```bash
npm install
npm test
npm run typecheck
npx expo start
```

Bundle checks:

```bash
npx expo export --platform ios
npx expo export --platform android
```

## Expo Go Testing

Expo Go is the fastest path for early testers who can run a development build experience.

```bash
npm install
npx expo start
```

Ask testers to install Expo Go, scan the QR code, and test:

- onboarding
- location permission fallback
- nearby waterbody sorting
- trip planner
- feedback
- export/share sheet

## iOS Simulator Setup

1. Install Xcode from the Mac App Store.
2. Open Xcode once to finish installing components.
3. Open Simulator from Xcode.
4. Run:

```bash
npm run ios
```

If Expo has trouble finding ports under newer Node versions, use Node 22 and run:

```bash
npx expo start --ios --port 8081
```

## Android Emulator Setup

1. Install Android Studio.
2. Install Android SDK Platform Tools.
3. Create a Pixel emulator.
4. Boot the emulator.
5. Run:

```bash
npm run android
```

## EAS Build Setup

Do not run a production build until credentials are ready.

Configure EAS:

```bash
npx eas build:configure
```

iOS build:

```bash
npx eas build --platform ios
```

Android build:

```bash
npx eas build --platform android
```

## TestFlight Path

1. Confirm Apple Developer account access.
2. Configure app identifier and signing credentials in EAS.
3. Build iOS with EAS.
4. Submit to App Store Connect.
5. Add internal testers first.
6. Add external testers after Beta App Review.

## Android Internal Testing Path

1. Confirm Google Play Console access.
2. Configure Android package and signing.
3. Build Android with EAS.
4. Upload the build to Internal testing.
5. Add tester emails or Google Group.
6. Share opt-in link with testers.

## Location Testing Notes

Test all location states:

- permission granted
- permission denied
- location unavailable
- manual Seattle fallback
- manual Tacoma/Spokane/Yakima/Wenatchee fallback
- nearest beginner-friendly waterbody

## Known Beta Limitations

- Washington data is still mock guidance, not official WDFW data.
- GPS is used only on device and not sent anywhere.
- Official WDFW links are placeholders/source links, not scraped data.
- EAS builds require credentials and are not expected to complete in local CI unless configured.
