# Architecture

## Folder Structure

- `app/`: Expo Router screens
- `app/(tabs)/`: five-tab navigation - Home (`index.tsx`), Map, Trips, Ask, More
- `app/(tabs)/more.tsx`: grouped links to every secondary screen (Species, Rigs & Knots, Learning Center, Regulations, Data Sources, Weather, Favorites, Stats, Start Here, Advanced Search, Settings, Feedback, Export, Offline, About) - none of those have their own tab anymore
- `app/species.tsx`: the species/fish browser, moved out of the tab bar into a stack route
- `src/components/`: reusable UI components, including the text-first/arcade primitives - `SearchInput`, `Autocomplete`, `MissionCard`, `PixelMarker` (original map pin design), `Scanlines` (static CRT overlay)
- `src/data/`: local fish, waterbody, shellfish, learning, and source seed data
- `src/services/`: regulation, provider, map, trust, personalization, analytics, and planning services
- `src/utils/`: search, storage, recommendations, sharing, and helpers
- `src/utils/autocomplete.ts`: ranked autocomplete across fish/shellfish species, waterbodies, shellfish locations, and activity types - returns `[]` for an empty query
- `src/utils/tripParser.ts`: local, rule-based natural-language trip parsing (`parseTripText`, `nextFollowUp`, `mergeFollowUpAnswer`) - no network or LLM call, extends the existing `searchByFields`/`scoreSearchItem` scoring engine
- `src/hooks/useReducedMotion.ts`: the only place `AccessibilityInfo` is imported from react-native; keep it that way so `src/theme.ts` and the service/util layer stay importable from Vitest (see Testing Strategy below)
- `data/snapshots/`: immutable source manifests and future import snapshots
- `docs/`: beta, privacy, provider, and handoff documentation
- `scripts/`: screenshot automation

## Text-First Interaction Model

Home, Ask, and the Trips builder all funnel through the same two utilities instead of showing preselected suggestion cards: `autocomplete.ts` powers the compact typed dropdown (nothing renders until the user types), and `tripParser.ts` extracts structured trip fields from free text and drives a one-question-at-a-time follow-up loop until enough is known to build a plan. Reference data (species/waterbody catalogs) and user-created data (trips, plans, favorites) stay clearly separate - see Storage below.

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

Vitest covers data integrity, regulation helpers, search, shellfish planning, provider metadata, map markers, storage, smoke flows, typed autocomplete, and natural-language trip parsing. Expo exports verify bundle compilation for iOS and Android.

Vitest runs these files as plain Node modules (no Metro), so `src/theme.ts` and anything under `src/services/`, `src/utils/`, and `src/data/` must never import from `react-native` directly - react-native's source uses Flow syntax that only Metro's Babel transform strips. `src/hooks/useReducedMotion.ts` is the one place `AccessibilityInfo` is imported; only screen/component (`.tsx`) files should import it.

## Future Cloud Sync

Cloud sync should be added behind explicit opt-in account settings, with export/delete controls and clear privacy copy.
