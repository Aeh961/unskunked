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

## Multi-Region Data Architecture

`src/data/regions.ts` defines `RegionId` and a `Region` record with `country` (`"US" | "SE"`), `status` (`"Mocked" | "Placeholder"`), and a short `note`. Washington, Florida, and Ronneby (Sweden) are `"Mocked"` - they ship real named waterbodies and species. Oregon, Idaho, and California stay `"Placeholder"` until real data is added the same way.

Region-scoped data lives one file per region under a shared directory, each exporting a region-tagged array plus a small builder function (`wa()` for Washington, `fl()` for Florida, `rb()` for Ronneby) that stamps `regionId` and fills in the region's default source/link metadata:

- `src/data/waterbodies/{washington,florida,ronneby}.ts`, merged by `src/data/waterbodies/index.ts` into `getWaterbodiesForRegion(region)` (and a flat `waterbodies` export for code that intentionally wants every region at once, e.g. autocomplete indexing).
- `src/data/fish/{washington,florida,ronneby}.ts`, merged the same way by `src/data/fish/index.ts` into `getSpeciesForRegion(region)`.

Two more provider registries key off the same `RegionId` and follow the existing array + `find()` pattern:

- `src/services/officialLinks.ts` - one `OfficialLinkProvider` class per region (`WashingtonOfficialLinkProvider`, `FloridaOfficialLinkProvider`, `RonnebyOfficialLinkProvider`, ...), registered in `officialLinkProviders` and looked up with `getOfficialLinkProvider(region)`.
- `src/services/regulations.ts` - `MockedRegionRegulationProvider` is a shared abstract base class (statewide/species/waterbody rule lookup logic) that `WashingtonRegulationProvider`, `FloridaRegulationProvider`, and `RonnebyRegulationProvider` extend by only supplying `state`, `region`, and a couple of copy strings. `regionToRegulationState` maps a `RegionId` to the `RegulationQuery.state` code these providers key off.

**Adding a region** (a new US state, or another Swedish municipality/country alongside Ronneby) means: add one `Region` entry in `regions.ts`, one waterbody file, one species file, one `OfficialLinkProvider` subclass, and one `RegulationProvider` subclass - no changes to UI screens, which already read through `useSelectedRegion()` + the `getXForRegion()` accessors rather than importing a specific region's data directly.

The primary browsing screens (Map, Search, Species, Weather, Regulations, Start Here, Offline, Data Sources) read the active region from `useSelectedRegion()` and call the region-scoped accessors above. The trip planner (`app/(tabs)/trips.tsx`) and its supporting recommendation/autocomplete/natural-language-parsing engines still operate on the flat all-regions lists; deeper region-scoping there is tracked as follow-up work.

## Data Trust Flow

Source metadata lives in `src/services/dataTrust.ts`. Every provider can expose organization, source type, confidence, verification status, update frequency, imported date, last verified date, expiration, and stale warning.

## Trip Planner

The planner uses local fishing recommendations plus shellfish planner logic. Each plan now shows source confidence and freshness warnings.

## Recommendation Engine

Recommendations are local and rule-based. They should always disclose whether the source is official, imported, demo, or needs verification.

## Map Architecture

`src/services/mapMarkers.ts` merges the selected region's waterbodies (via `getWaterbodiesForRegion`) with shellfish locations into one searchable marker shape. Shellfish/clamming/crabbing markers are Washington-specific today and are only included when `region === "washington"`. The Map tab renders native markers and keeps a chip/list fallback.

## Storage

`src/utils/storage.ts` wraps AsyncStorage and uses an in-memory Node fallback for tests. Local store persists trips, plans, favorites, profile, feedback, offline packs, recent searches, and cached conditions.

## Testing Strategy

Vitest covers data integrity, regulation helpers, search, shellfish planning, provider metadata, map markers, storage, smoke flows, typed autocomplete, and natural-language trip parsing. Expo exports verify bundle compilation for iOS and Android.

Vitest runs these files as plain Node modules (no Metro), so `src/theme.ts` and anything under `src/services/`, `src/utils/`, and `src/data/` must never import from `react-native` directly - react-native's source uses Flow syntax that only Metro's Babel transform strips. `src/hooks/useReducedMotion.ts` is the one place `AccessibilityInfo` is imported; only screen/component (`.tsx`) files should import it.

## Future Cloud Sync

Cloud sync should be added behind explicit opt-in account settings, with export/delete controls and clear privacy copy.
