# Public Beta Checklist

## Device Compatibility

- iOS simulator and physical iPhone smoke test
- Android emulator and physical Android smoke test
- Expo Go compatibility check
- Development build custom scheme check
- Small-screen layout review
- Large text layout review

## Required Permissions

- Location permission explains nearby water sorting
- App works when GPS is denied
- App works when GPS is unavailable
- No contacts, camera, microphone, or background location required

## Privacy Review

- Trip logs remain local
- Favorites remain local
- Feedback remains local unless exported by the user
- No hidden analytics
- No account system
- No cloud sync in public beta

## Manual QA

- Onboarding completes
- Home loads demo data
- GPS map shows fallback list
- Fishing planner saves a plan
- Clamming planner shows tide/legal reminders
- Crabbing planner shows catch record/reminder copy
- Trip log saves fishing and shellfish activities
- Favorites persist
- Search finds fish, shellfish, waterbodies, regulations, and trips
- Data Sources screen explains confidence and freshness
- Export JSON works
- Feedback saves locally

## Release Checklist

- `npm install --no-audit --no-fund`
- `npm test`
- `npm run typecheck`
- `npx expo export --platform ios`
- `npx expo export --platform android`
- README screenshots render
- App icon and splash load
- EAS preview build profile configured
- TestFlight/Play internal tester notes include regulation disclaimer
