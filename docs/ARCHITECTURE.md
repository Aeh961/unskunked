# Architecture

## Folder Structure

- `app/`: Expo Router screens
- `app/(tabs)/`: primary tab navigation
- `src/components/`: reusable UI components
- `src/data/`: local fish, waterbody, shellfish, learning, and source seed data
- `src/services/`: regulation, provider, map, trust, personalization, analytics, and planning services
- `src/utils/`: search, storage, recommendations, sharing, and helpers
- `data/snapshots/`: immutable source manifests and future import snapshots
- `docs/`: beta, privacy, provider, and handoff documentation
- `scripts/`: screenshot automation

## Provider Architecture

Phase 10 defines import providers around `fetch`, `validate`, `transform`, `cache`, and `metadata`. Provider domains include fishing, clamming, crabbing, weather, tides, waterbody information, and emergency rules.

## Data Trust Flow

Source metadata lives in `src/services/dataTrust.ts`. Every provider can expose organization, source type, confidence, verification status, update frequency, imported date, last verified date, expiration, and stale warning.

## Trip Planner

The planner uses local fishing recommendations plus shellfish planner logic. Each plan now shows source confidence and freshness warnings.

## Recommendation Engine

Recommendations are local and rule-based. They should always disclose whether the source is official, imported, demo, or needs verification.

## Map Architecture

`src/services/mapMarkers.ts` merges waterbodies and shellfish locations into one searchable marker shape. The Map tab renders native markers and keeps a chip/list fallback.

## Storage

`src/utils/storage.ts` wraps AsyncStorage and uses an in-memory Node fallback for tests. Local store persists trips, plans, favorites, profile, feedback, offline packs, recent searches, and cached conditions.

## Testing Strategy

Vitest covers data integrity, regulation helpers, search, shellfish planning, provider metadata, map markers, storage, and smoke flows. Expo exports verify bundle compilation for iOS and Android.

## Future Cloud Sync

Cloud sync should be added behind explicit opt-in account settings, with export/delete controls and clear privacy copy.
