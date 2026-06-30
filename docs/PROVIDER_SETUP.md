# Provider Setup

Unskunked Phase 9 has provider seams for live data without requiring paid APIs.

## Conditions Providers

`src/services/conditionProviders.ts` exposes:

- `ConditionsProvider`
- `MockConditionsProvider`
- `LiveConditionsProvider`
- `cacheConditionsForLocation`

The mock provider powers development and tests. A future live provider can call free/public weather and tide services, then cache the response locally.

## WDFW Snapshot Provider

`src/services/wdfwImportPipeline.ts` reads the local snapshot manifest and reports import readiness. Future importers should add source snapshots rather than overwriting historical files.

## Map Data

`src/services/mapMarkers.ts` merges fishing waterbodies and shellfish locations into one map/search marker shape. Keep this layer as the screen contract when adding official data.

## EAS Builds

`eas.json` includes:

- `development`: internal development client
- `preview`: internal beta distribution
- `production`: store-ready build profile with auto increment
