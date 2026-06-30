# Unskunked Data Pipeline

Phase 9 keeps Unskunked offline-first while preparing the app for official Washington imports.

## Current Sources

Local fixtures are still shipped with the app. Each official-source-ready dataset should include:

- `sourceUrl`
- `snapshotDate`
- `importedDate`
- `lastVerifiedDate`
- `waterbodyId` or source-specific identifier
- activity coverage: fishing, clamming, crabbing

The first manifest lives at `data/snapshots/wdfw-shellfish-sources.json`.

## Import Flow

1. Download or manually export official WDFW data.
2. Save an immutable source snapshot under `data/snapshots/`.
3. Normalize source records into `src/data/*` shapes.
4. Validate required IDs, source URLs, timestamps, and activity coverage.
5. Keep official verification links in the UI even after import.

## Regulation Safety

Unskunked must never present local data as legal advice. Regulation cards should keep:

- verify official rules
- check emergency rules
- license reminder
- data last updated
- source/last verified dates

## Future Live Providers

Weather, tides, stocking, and official regulation APIs should implement provider interfaces first, then write the latest successful response into local cache so offline mode continues to work.
