# Unskunked

![Unskunked logo placeholder](screenshots/logo-placeholder.svg)

Unskunked is a local-first Expo React Native fishing assistant for beginner anglers. It helps users choose a waterbody, pick a target species, build a simple rig, plan a trip, learn the basics, and log what worked.

The current app is a polished Phase 7 Washington-focused beta using expanded mock Washington fishing data, GPS/manual nearby search, local storage, typed data services, native share/export flows, and no paid APIs or backend.

## Feature Overview

- Demo Mode that preloads favorite waters, fish, rigs, knots, realistic trip history, profiles, notifications, recommendations, and search history
- First-launch beta onboarding with region, experience, fishing style, favorite fish, favorite waterbodies, and a final Start Fishing Smarter flow
- GPS-aware nearby fishing with permission handling, denied/unavailable fallbacks, manual city locations, distance sorting, and water-type filters
- Expanded Washington mock waterbody dataset with 25 locations, counties, coordinates, access notes, parking notes, seasons, rigs, bait, and regulation warnings
- Expanded Washington fish coverage including trout, bass, panfish, walleye, catfish, carp, salmon, steelhead, sturgeon placeholder, and saltwater species
- Real-data-ready regulation architecture with provider interfaces, Washington mock provider, emergency-rule placeholders, waterbody rules, species rules, season checks, limits, and gear warnings
- Official WDFW verification links for regulations, emergency rules, licenses, Fish Washington, freshwater rules, marine areas, and shellfish/seaweed resources
- Personalization engine using onboarding profile, favorites, trip history, season, successful bait, and successful rigs
- Professional Home dashboard with today’s recommendation, continue-trip prompt, favorite lakes, quick actions, beginner tips, recent catches, weather placeholder, and regulation reminder
- Interactive mock map with search suggestions, filters, markers, recently viewed waterbodies, favorites, and a polished selected-water detail card
- Plan My Fishing Trip generator with legal summary, gear checklist, bait checklist, rig setup, knot, best time, safety reminder, backup plan, YouTube links, saved plans, and Start Trip draft logs
- Fish database and detail pages with season, weather, time of day, bait, lures, gear, rigs, knots, mistakes, habitat, regulation warnings, and YouTube learning links
- Guided Rig Builder with a confidence estimate, bait recommendation, knot recommendation, and labeled SVG rig diagrams
- Trip Log with saved plans, local history, skunked versus unskunked stats, most successful bait, and most successful location
- Fishing Stats screen with best locations, bait, rigs, time of day, species, monthly activity, and personal records
- Favorites for fish, waterbodies, rigs, and knots
- Ask Unskunked rule-based local assistant
- Learning Center with beginner, species, rod, reel, line, hook, lure, safety, etiquette, and Washington basics articles
- Region selection for Washington, Oregon, Idaho, and California, with non-Washington regions clearly marked demo-only
- Global search across fish, waterbodies, rigs, knots, learning articles, and trip logs
- Feedback system for bug reports, feature requests, confusing regulations, wrong recommendations, wrong waterbody info, and general notes
- Native share-sheet support for trip plans, fish tips, waterbody recommendations, trip log results, feedback, and beta data export
- About Unskunked page with mission, disclaimers, current region support, roadmap, and contact/feedback entry point
- Local-only Beta Insights for viewed fish, viewed waterbodies, rig use, planner choices, searches, and feedback categories
- Screenshot automation for iOS and Android

## Architecture

- `app/`: Expo Router screens and routes
- `app/(tabs)/`: primary tab experience
- `src/components/`: reusable UI system
- `src/data/`: mock fish, waterbody, rig, learning, and region data
- `src/hooks/`: reusable hooks such as favorites
- `src/services/`: regulation providers, personalization engine, and trip analytics
- `src/services/location.ts`: distance calculation, manual fallback locations, Expo location permission flow, and nearby sorting
- `src/utils/`: storage abstraction, local store, recommendations, search, and YouTube helpers
- `scripts/`: automation utilities
- `docs/`: QA checklist, beta tester guide, and developer handoff
- `screenshots/`: generated iOS and Android screenshots

The app is intentionally local-first. Future real-data integrations should replace or augment provider classes in `src/services/*` while preserving the current screen contracts.

## Regulation Data Path

Phase 5 adds the production-facing shape for regulation data:

- `RegulationProvider`: shared provider contract
- `WashingtonRegulationProvider`: mocked Washington rules and official WDFW source links
- `MockRegulationProvider`: placeholder provider for demo-only states
- `RegulationService`: public query surface for statewide, species, and waterbody rules
- `EmergencyRuleService`: placeholder for emergency-rule ingestion
- `WaterbodyRuleService`: focused helper for waterbody warning messages

Current rule data is still mock/local. Official WDFW integration should add source timestamps, import validation, and waterbody/species/date matching before any legal claims are made.

## Beta Testing

Useful docs:

- [QA Checklist](docs/QA_CHECKLIST.md)
- [Beta Tester Guide](docs/BETA_TESTER_GUIDE.md)
- [Developer Handoff](docs/DEVELOPER_HANDOFF.md)
- [Beta Distribution](docs/BETA_DISTRIBUTION.md)

Beta testers should focus on onboarding, location permission/fallback behavior, nearby water sorting, planning a trip, checking disclaimers/source links, saving feedback, exporting JSON, and sharing plans/results through the native share sheet.

## Development Setup

Requirements:

- Node.js 22+
- npm
- Expo Go, iOS Simulator, or Android Emulator

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Run iOS:

```bash
npm run ios
```

Run Android:

```bash
npm run android
```

## Testing

```bash
npm test
npm run typecheck
```

Compile bundle checks:

```bash
npx expo export --platform ios --output-dir /private/tmp/unskunked-export-ios
npx expo export --platform android --output-dir /private/tmp/unskunked-export-android
```

## Screenshot Automation

Create screenshots after the app is running on a simulator/emulator.

For standalone or development builds that register `unskunked://`:

```bash
npm run screenshots:ios
npm run screenshots:android
```

For Expo Go, pass the dev-server URL printed by Expo:

```bash
EXPO_URL=exp://YOUR_LOCAL_IP:8081 npm run screenshots:ios
EXPO_URL=exp://YOUR_LOCAL_IP:8081 npm run screenshots:android
```

The script navigates to each route and captures:

- Onboarding
- Home with nearby recommendation
- Map
- Nearby Waterbodies
- Waterbody Detail
- Fish Detail
- Nearby Trip Planner
- Rig Builder
- Trip Planner
- Trip Log
- Beta Insights
- Feedback
- Export
- Settings
- About

## Screenshots

Screenshots are tracked so GitHub visitors see the app flow immediately. Regenerate them with the screenshot script after launching the latest build in iOS Simulator or Android Emulator.

### iOS

![iOS Onboarding](screenshots/ios/ios-onboarding.png)
![iOS Home](screenshots/ios/ios-home.png)
![iOS Map](screenshots/ios/ios-map.png)
![iOS Nearby Waterbodies](screenshots/ios/ios-nearby-waterbodies.png)
![iOS Waterbody Detail](screenshots/ios/ios-waterbody-detail.png)
![iOS Fish Detail](screenshots/ios/ios-fish-detail.png)
![iOS Nearby Trip Planner](screenshots/ios/ios-nearby-trip-planner.png)
![iOS Rig Builder](screenshots/ios/ios-rig-builder.png)
![iOS Trip Planner](screenshots/ios/ios-trip-planner.png)
![iOS Trip Log](screenshots/ios/ios-trip-log.png)
![iOS Beta Insights](screenshots/ios/ios-beta-insights.png)
![iOS Feedback](screenshots/ios/ios-feedback.png)
![iOS Export](screenshots/ios/ios-export.png)
![iOS Settings](screenshots/ios/ios-settings.png)
![iOS About](screenshots/ios/ios-about.png)

### Android

![Android Onboarding](screenshots/android/android-onboarding.png)
![Android Home](screenshots/android/android-home.png)
![Android Map](screenshots/android/android-map.png)
![Android Nearby Waterbodies](screenshots/android/android-nearby-waterbodies.png)
![Android Waterbody Detail](screenshots/android/android-waterbody-detail.png)
![Android Fish Detail](screenshots/android/android-fish-detail.png)
![Android Nearby Trip Planner](screenshots/android/android-nearby-trip-planner.png)
![Android Rig Builder](screenshots/android/android-rig-builder.png)
![Android Trip Planner](screenshots/android/android-trip-planner.png)
![Android Trip Log](screenshots/android/android-trip-log.png)
![Android Beta Insights](screenshots/android/android-beta-insights.png)
![Android Feedback](screenshots/android/android-feedback.png)
![Android Export](screenshots/android/android-export.png)
![Android Settings](screenshots/android/android-settings.png)
![Android About](screenshots/android/android-about.png)

## App Limitations

- Regulation content is mock/local and must be verified with official agencies.
- Washington has the most complete mock data; Oregon, Idaho, and California are placeholders.
- No backend, account sync, weather, tides, stocking reports, or official regulation feed is connected yet.
- GPS is used only locally for distance sorting and has manual fallback locations.
- JSON export uses the native share sheet rather than a hosted account portal.

## Roadmap To Real Data

- Integrate official WDFW regulation datasets with source timestamps, waterbody IDs, emergency-rule status, and validation tests
- Add real map provider and GPS search
- Add waterbody detail pages with emergency rule alerts
- Add weather, tide, and pressure context
- Add account sync once local-only beta behavior is proven
- Add offline map/location packs
- Add real catch photo attachments
- Add fish ID by photo
- Add optional AI coach only after explicit user consent

## Contributing

Keep Unskunked Expo-compatible, TypeScript-clean, beginner-friendly, and local-first unless a feature explicitly requires integration. Regulation-related content must clearly distinguish mock guidance from official legal guidance.

## GitHub

Repository: `https://github.com/Aeh961/unskunked`

## Disclaimer

Unskunked is for planning and education only. Always verify current regulations with official fish and wildlife agencies before fishing or keeping fish.
