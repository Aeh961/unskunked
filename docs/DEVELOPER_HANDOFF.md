# Unskunked Developer Handoff

Unskunked is an Expo React Native TypeScript app using Expo Router, local mock data, AsyncStorage, and typed service layers. It is designed to stay local-first until the beta proves the product flow.

## Architecture Overview

- `app/`: Expo Router screens.
- `app/(tabs)/`: Home, Map, Fish, Rigs, and Ask tabs.
- `src/components/`: reusable UI system.
- `src/data/`: local fish, waterbody, rig, learning, disclaimer, and region data.
- `src/hooks/`: reusable app hooks.
- `src/services/`: regulation providers, personalization, and analytics.
- `src/services/location.ts`: Expo location permission handling, distance math, manual fallback locations, and nearby sorting.
- `src/services/officialLinks.ts`: WDFW source link definitions and verification copy.
- `src/utils/`: storage, local store, recommendations, search, share, and YouTube helpers.
- `scripts/`: screenshot automation.
- `docs/`: QA, beta testing, and handoff documentation.

## Data Layer

Mock data lives in `src/data/*`. The app currently uses arrays of typed records for fish, waterbodies, rigs/knots, learning articles, and regions. Screens should read through these typed modules or through services when behavior is more than simple lookup.

## Regulation Providers

Regulation architecture lives in `src/services/regulations.ts`.

- `RegulationProvider` defines the interface.
- `WashingtonRegulationProvider` provides mocked Washington rules and WDFW source links.
- `MockRegulationProvider` marks unsupported states as placeholders.
- `RegulationService` selects the right provider for statewide, species, or waterbody summaries.
- `EmergencyRuleService` is the future integration point for emergency-rule feeds.
- `WaterbodyRuleService` formats waterbody warning messages.

Official data should be added as a provider implementation, not hard-coded in screens.

## Local Storage

`src/utils/storage.ts` defines the storage abstraction.

`src/utils/localStore.ts` persists:

- onboarding profile
- selected region
- favorites
- trip logs
- trip plans
- feedback
- demo mode state
- recent searches

Use `createMemoryStorageDriver` for unit tests.

## Location And Nearby

Nearby fishing is local-only. `requestExpoLocation` asks for foreground permission through `expo-location`; denied or unavailable states fall back to Seattle. `getNearbyWaterbodies` calculates haversine distance and sorts local mock waterbody data. Manual fallback locations currently include Seattle, Tacoma, Spokane, Yakima, and Wenatchee.

## Screenshot Automation

`scripts/capture-screenshots.mjs` opens routes and captures simulator/emulator screenshots.

Commands:

```bash
npm run screenshots:ios
npm run screenshots:android
```

For Expo Go, pass the Expo URL:

```bash
EXPO_URL=exp://YOUR_LOCAL_IP:8081 npm run screenshots:ios
EXPO_URL=exp://YOUR_LOCAL_IP:8081 npm run screenshots:android
```

## Testing Commands

```bash
npm install
npm test
npm run typecheck
npx expo export --platform ios
npx expo export --platform android
```

## Add A New State Or Region

1. Add the region to `src/data/regions.ts`.
2. Add a provider in `src/services/regulations.ts`.
3. Register the provider in `regulationService`.
4. Add region-specific copy to onboarding/settings if needed.
5. Add tests for placeholder or official behavior.

## Add A New Fish

1. Add a `FishSpecies` record in `src/data/fish.ts`.
2. Reference existing rigs, knots, bait, and lures.
3. Add the species id to relevant waterbodies.
4. Add YouTube search queries.
5. Run tests to validate references.

## Add A New Waterbody

1. Add a `Waterbody` record in `src/data/waterbodies.ts`.
2. Use existing fish species ids.
3. Add beginner setup, bait, rigs, and regulation summary.
4. Confirm Map search and filters surface it.
5. Add provider data once official rules exist.

## Add Official Regulation Data Later

1. Import official source data into typed fixtures or a local cache.
2. Preserve source URL and retrieval timestamp.
3. Match rules by state, waterbody, species, date, and gear type.
4. Validate emergency rules separately from annual rules.
5. Keep disclaimers visible and link to official sources.
6. Add tests for open, closed, restricted, catch-and-release, size limit, bag limit, and gear restriction cases.
