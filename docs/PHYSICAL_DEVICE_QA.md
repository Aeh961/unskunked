# Physical Device QA Checklist

Manual test pass for a real iPhone and a real Android phone, before inviting outside beta
testers. Run this after every development build you install, not just once.

Skunked is fully local-first: there is no backend, no network calls in the app code, and no
account system. Everything below tests local logic, on-device GPS, and native modules
(`react-native-maps`, `expo-location`, `AsyncStorage`, share sheet) - not server integration.

## Before you start

- [ ] Confirm you're testing the build you think you are: check **Settings → About Skunked**
      or the onboarding version string against the `version`/`buildNumber`/`versionCode` in
      `app.json`.
- [ ] Android only: confirm a real Google Maps API key is set in `app.json`
      (`android.config.googleMaps.apiKey`). If it's still the placeholder
      `REPLACE_WITH_YOUR_GOOGLE_MAPS_API_KEY`, the map screen will render blank/gray - that's
      expected until you add a real key, not a new bug.

## Fresh install

- [ ] Uninstall any previous build first (bundle ID changed to `com.unskunked.app` this round -
      an old `com.anonymous.unskunked` install will sit side-by-side, not update in place).
- [ ] Fresh install completes and app icon/splash screen show correctly (not a blank white/black
      screen).
- [ ] First launch does not crash before onboarding appears.

## Onboarding

- [ ] Region, experience, fishing style, favorite fish, and favorite waterbody steps all advance.
- [ ] "Start Fishing Smarter" (or equivalent final step) completes and lands on Home.
- [ ] Force-quit and relaunch mid-onboarding: does it resume sensibly or restart cleanly (no
      crash, no stuck loading state)?

## Location permission

- [ ] **Granted**: allow location when prompted. Map/Home shows "GPS enabled" and a real
      coordinate-based distance, not the Seattle fallback.
- [ ] **Denied**: deny location. App shows the "Permission denied... manual locations" message
      (`src/services/location.ts`) and does not crash or hang.
- [ ] **Unavailable**: turn off Location Services device-wide (not just for the app) and confirm
      the "Location is unavailable" fallback message appears.
- [ ] **Manual fallback**: tap each manual location chip (Seattle, Tacoma, Spokane, Yakima,
      Wenatchee) and confirm nearby results reorder correctly.

## Live GPS map (`app/(tabs)/map.tsx`)

- [ ] Map renders tiles (not a blank gray box) on both platforms. This is the #1 place a missing
      Android Maps API key shows up.
- [ ] Blue location dot appears only after permission is granted (`showsUserLocation`).
- [ ] Markers render for fishing (blue), clamming (orange), and crabbing (red) per the on-map
      legend.
- [ ] Tapping a marker selects the right waterbody/shellfish location and updates the detail
      sheet below the map.
- [ ] Map filters: cycle through activity filters (All/fishing/clamming/crabbing) and water-type
      filters (Lake/River/Saltwater/Park/Pier) - marker count and list update together.
- [ ] Search box filters by name, region, county, water type, bait, and rig text.
- [ ] "Directions" button opens Apple Maps/Google Maps with the right coordinates.

## Fishing trip planner (`app/plan.tsx`)

- [ ] Generates a full plan: waterbody, target species, gear checklist, bait checklist, rig/knot,
      timing, safety reminder, backup plan.
- [ ] "Nearby mode" using device location produces a different (closer) result than a manually
      chosen distant waterbody.
- [ ] Saving a plan persists it (check Trip Log after restart, see below).
- [ ] "Start Trip" flow creates a draft log entry.

## Clamming planner

- [ ] Tide reminder and legal/health warning copy appears (shellfish rules, red-tide-style
      caution language).
- [ ] Gear checklist is shellfish-specific (rake/gauge/bucket, not rod/reel).

## Crabbing planner

- [ ] Catch-record and reminder copy appears (ring/pot limits, size/sex rules language).
- [ ] Tide movement (incoming/outgoing/slack) visibly affects the recommendation or score.

## Weather and tide fallback

- [ ] Weather screen shows current, hourly, 7-day, sunrise/sunset, golden hour, and bite-window
      data. This is all `getMockWeather()` local data, not live - confirm it displays without
      errors, not that the numbers match reality outside.
- [ ] Saltwater/pier waterbodies show a tide snapshot; freshwater lakes/rivers correctly show no
      tide section (`getTideSnapshot` returns `null` for non-tidal water).

## Offline mode (`app/offline.tsx`)

- [ ] Turn on Airplane Mode. Confirm the app still opens and functions - there should be **no**
      visible difference, since nothing in this app makes network calls today.
- [ ] Offline download packs list shows Washington/county/species packs and toggles download
      state without crashing.

## Favorites

- [ ] Favorite a fish, a waterbody, a rig/knot, and a shellfish location.
- [ ] All four favorite types show up correctly on the Favorites screen.
- [ ] Un-favoriting removes them immediately.

## Trip logs

- [ ] Logging a trip (fishing and a shellfish activity) saves correctly.
- [ ] Trip Log stats (skunked vs. unskunked, best bait/location/time) update after adding a trip.
- [ ] With **zero** trips logged (fresh install), stats screens show "not enough data" messaging
      instead of crashing or showing `NaN`/`undefined`.

## Share sheet

- [ ] Share a trip plan, a fish tip, a waterbody recommendation, and feedback. The native
      share sheet should open every time (this uses React Native's built-in `Share` API - no
      special permission is required on either platform).

## Data export

- [ ] Export JSON from the Export/Data screen. Confirm the file/share sheet includes trips,
      favorites, and feedback in valid JSON (open it afterward to confirm it isn't truncated).

## App restart persistence

- [ ] Force-quit the app after favoriting something, logging a trip, and saving a plan. Reopen
      and confirm all three persisted (AsyncStorage-backed, `src/utils/localStore.ts`).
- [ ] Reboot the phone entirely and reopen the app - same check.

## Dark mode

- [ ] Toggle system Dark Mode. **Known limitation**: `src/theme.ts` defines one static light
      color palette with no dark variant, even though `app.json` sets
      `"userInterfaceStyle": "automatic"`. Expect system chrome (status bar, keyboard, system
      alerts) to switch to dark while app content stays light-themed. This QA pass should confirm
      that combination doesn't produce unreadable contrast anywhere (e.g., a light-on-light
      system alert), not that the app itself goes dark.

## Accessibility

- [ ] Turn on VoiceOver (iOS) / TalkBack (Android) and navigate Home, Map, and the Trip Planner.
      **Known limitation**: only a subset of interactive elements across the app currently have
      `accessibilityLabel`/`accessibilityRole` set (concentrated in Map and a few shared
      components) - most screens have not been audited. Note every element that VoiceOver/TalkBack
      announces as just "button" with no label; that's the actual gap to fix, not a regression.
- [ ] Turn on the largest system text size (Dynamic Type / Android font scale) and confirm no text
      is clipped or overlapping on Home, Map, and the Trip Planner detail sheet.

## iPhone-specific layout

- [ ] Test on both a small screen (SE-class, if available) and a large screen (Pro Max-class,
      or the simulator size if that's all you have) for clipped buttons or overlapping text,
      especially the bottom tab bar and the map bottom sheet.
- [ ] Confirm the safe area (notch/Dynamic Island, home indicator) doesn't overlap content.

## Android-specific layout

- [ ] Test on at least one real Android phone (not just the emulator) for back-gesture behavior,
      keyboard-avoiding behavior on the search/onboarding text inputs, and system back-button
      handling (should navigate back through Expo Router stack, not exit the app unexpectedly).
- [ ] Confirm the adaptive icon renders correctly on the home screen (foreground image over the
      `#123B30` background, not a white square).

## Filing what you find

Use the in-app Feedback screen (bug report / feature request / confusing regulation / wrong
recommendation / wrong waterbody info / general note) to capture issues as you go - it's already
built to collect exactly this kind of structured QA feedback, and everything saves locally until
you export it.
