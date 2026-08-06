# Beta Release Plan

This is the plan of record for taking Skunked from "runs on my own two phones" to "outside
testers can install it." It assumes physical-device testing (`docs/PHYSICAL_DEVICE_QA.md`) has
already passed on both platforms.

For hands-on setup commands (installing Xcode/Android Studio, running local builds, EAS build
commands), see `docs/BETA_DISTRIBUTION.md`. For what testers themselves should read, see
`docs/BETA_TESTER_GUIDE.md`. This document is the release-management layer above both: what has
to be true before you invite anyone, and what to do if it goes wrong.

**No submission happens without your explicit approval at each step below.**

## Prerequisites checklist

- [ ] Apple Developer Program membership ($99/year) - required for TestFlight, not required for
      installing dev builds on your own device via Xcode.
- [ ] Google Play Console account ($25 one-time) - required for Play Internal Testing.
- [ ] Expo account (free) and `eas login` completed.
- [ ] `eas init` run once to link this repo to a real EAS project (`extra.eas.projectId` in
      `app.json` gets filled in automatically - it is intentionally absent right now).
- [ ] A real Google Maps API key set in `app.json` (`android.config.googleMaps.apiKey`) -
      required before the Android build is usable by anyone, not just you.
- [ ] Bundle identifiers finalized: currently `com.unskunked.app` on both platforms. Changing
      this again after TestFlight/Play submission means starting over as a new app listing, so
      confirm it now.

## Versioning and build numbers

- `app.json` `version` (`0.1.0`) is the user-facing marketing version. Bump it for meaningful
  milestones (e.g., `0.2.0` for first outside-tester round), not every build.
- `eas.json` sets `"appVersionSource": "local"`, so `ios.buildNumber` and `android.versionCode`
  in `app.json` are the source of truth (currently `1` / `1`). Increment both by 1 for every
  build you upload to TestFlight or Play, even for a one-line fix - both stores reject a
  re-upload with a duplicate build number.
- The `production` EAS profile has `"autoIncrement": true`, which bumps these automatically on
  each production build. `development` and `preview` profiles do not auto-increment - bump them
  by hand before a preview build you intend to actually distribute.

## TestFlight setup (iOS)

1. `eas login`, then `eas init` (one-time, links the Expo project).
2. `eas build --profile preview --platform ios` - produces an internal-distribution build you
   can install straight onto registered devices without going through App Store Connect at all.
   Use this for the first few outside testers if you want to skip Apple's review entirely.
3. When ready for TestFlight proper (needed for testers beyond ~100 registered devices, or to
   avoid manually registering each device's UDID):
   - `eas build --profile production --platform ios`
   - `eas submit --platform ios` to upload the build to App Store Connect.
   - In App Store Connect, add the build to a TestFlight group.
   - Internal testers (your own Apple Developer team, up to 100 people) get access immediately,
     no review required.
   - External testers require **Beta App Review** (usually 24-48 hours) before their first
     build. Subsequent builds to the same group don't need re-review unless you change
     encryption/permissions in a way Apple flags.
4. Invite testers by email or a public TestFlight link (Apple Developer → TestFlight → public
   link, capped at 10,000 testers).

## Google Play Internal Testing setup (Android)

1. `eas build --profile preview --platform android` produces an APK testers can sideload
   directly - no Play Console needed at all for a first round. Share the `.apk` build link EAS
   gives you (or run `eas build:list` to find it again later).
2. For Play-distributed testing:
   - `eas build --profile production --platform android` (produces an `.aab`, required by Play).
   - `eas submit --platform android` to upload to Play Console.
   - Create an **Internal testing** track in Play Console (instant, no review), add tester
     emails or a Google Group, and share the opt-in link.
   - Play's Internal Testing track has no review delay. **Closed testing** (needed once you scale
     past ~100 testers) does have a review step, similar to Apple's.

## Tester invitation flow

1. Confirm the tester has completed the relevant device QA pass yourself first
   (`docs/PHYSICAL_DEVICE_QA.md`) so you're not debugging your own build issues via someone else's
   bug report.
2. Send the TestFlight/Play opt-in link plus a short message pointing at
   `docs/BETA_TESTER_GUIDE.md` (or its content copy-pasted into the invite - testers won't clone
   the repo).
3. Always include the safety/regulation disclaimer from `BETA_TESTER_GUIDE.md`'s "Safety And
   Regulation Reminder" section in the invite itself, not just buried in the app - this is a
   fishing-regulation app; testers should not treat beta data as legal guidance from message one.
4. Ask testers to use the in-app Feedback screen rather than emailing/texting you directly, so
   reports land in a structured, exportable place (see Feedback collection below).

## Release notes

Keep a short entry per build number, even pre-launch. A minimal template:

```
Build 1.2 (iOS build 4 / Android versionCode 4) - 2026-XX-XX
- Fixed: [what]
- Changed: [what]
- Known issue: [what, and workaround if any]
```

Since there's no backend, release notes live in this repo (a `CHANGELOG.md` or the store
listing's "What's New" field), not a remote config system.

## Privacy policy requirements

Both TestFlight external testing and Play Internal Testing (once you add real testers, not just
yourself) require a privacy policy URL. `docs/PRIVACY.md` has the actual content; before
submitting you still need to:

- [ ] Publish `docs/PRIVACY.md`'s content somewhere with a stable public URL (a GitHub Pages page
      off this repo, or a simple hosted page - it cannot be a link into the private repo itself).
- [ ] Add that URL to App Store Connect's App Privacy section and Play Console's Data Safety
      form. Since the app makes zero network calls and stores everything locally, both forms
      should be answerable as "no data collected/shared" - fill them out honestly rather than
      accepting a template default.
- [ ] Revisit `docs/PRIVACY.md`'s "Future Cloud Plans" section before adding any real network
      calls (weather/tide API, live regulation feed, etc.) - that's the point at which the
      privacy answers above stop being "no data collected."

## Feedback collection

- Today: the in-app Feedback screen (`app/feedback.tsx`) is the only feedback channel, and it's
  local-only until a tester exports it. For beta testers, that means **you have to ask them to
  export and send you their feedback JSON** - it does not reach you automatically. Say this
  explicitly in the tester invite, or feedback will silently pile up on testers' phones.
- Consider a lightweight interim channel (a shared form, or just "screenshot + text me") for
  testers who won't remember to export, until an actual feedback-submission endpoint exists.

## Crash reporting recommendations

There is currently no crash reporting configured. Before outside testers install a build,
pick one:

- **Sentry (`@sentry/react-native`)** - most common choice for Expo/EAS projects, has an EAS
  Build config plugin, free tier is enough for a small beta.
- **Expo's own error reporting** via EAS Build + `expo-dev-client`'s dev-mode error overlays
  covers crashes during your own testing, but does not report crashes from testers' phones back
  to you - you need one of the above for that.

Either choice should be added and verified (force a test crash, confirm it appears in the
dashboard) before the first external TestFlight/Play round, not after.

## Analytics recommendations (privacy-friendly)

`src/services/betaInsights.ts` already tracks local-only usage events (viewed fish/waterbodies,
searches, feedback categories) with no network transmission - this is a reasonable privacy-first
baseline and matches what `docs/PRIVACY.md` promises today. If you want aggregate insight across
testers (not just per-device), options that preserve the current privacy stance:

- Keep analytics on-device and ask testers to export/share their local insights periodically
  (no code change needed, just a process).
- If you do add a real telemetry backend later, prefer an anonymous/aggregate-only tool
  (e.g., Plausible-style page analytics adapted for app events) over one that fingerprints
  individual testers, and update `docs/PRIVACY.md` and the store Data Safety forms in the same
  change that adds it - not after.

## Known limitations (carry into every tester invite)

- Washington is the only region with real (still mock, not live) data depth; Oregon, Idaho,
  California are explicitly placeholder/demo-only.
- All regulation, weather, tide, and stocking data is local mock data, not a live feed - the
  in-app disclaimers already say this, but repeat it in tester communications too.
- No backend, no account system, no cross-device sync.
- Dark mode and accessibility are partially implemented - see the "Known limitation" notes in
  `docs/PHYSICAL_DEVICE_QA.md`.
- No crash reporting or remote feedback ingestion yet (see above) - you are dependent on testers
  manually reporting/exporting.

## Rollback plan

Because this is TestFlight/Internal Testing (not a public store listing), rollback is simpler
than a full production release, but still needs a plan:

- **iOS**: TestFlight builds expire automatically after 90 days, and you can stop distribution
  to a group immediately from App Store Connect if a build has a serious bug - testers stay on
  their last-installed build until you push a new one (there's no forced-update mechanism without
  EAS Update, which isn't configured here).
- **Android**: Internal Testing track lets you halt the current release from Play Console
  immediately; testers keep whatever's already installed.
- **In both cases**: if a bad build already destroyed local data via a broken migration, there is
  no server-side recovery - `AsyncStorage` is on-device only. Treat any change to
  `src/utils/localStore.ts`'s stored shapes as requiring a compatibility check against existing
  local data before it ships to testers, since there is no way to roll back their on-device state.
- Keep the previous known-good build number (via `eas build:list`) so you can re-submit it to
  the same track quickly if a new build needs to be pulled.

## Do not submit without approval

This document describes how to release, not a decision to release. Every `eas submit` and every
"add external tester" action in App Store Connect / Play Console should be a deliberate,
confirmed step - not something run as part of a routine build/verify pass.
