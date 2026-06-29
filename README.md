# Unskunked

Unskunked is a local-first Expo React Native fishing assistant for iOS and Android. It helps beginner anglers choose where to fish, what species to target, what bait or lure to use, how to rig up, what to learn next, and how to track trips over time.

The current MVP uses mock Washington fishing data only. It does not use paid APIs, a backend, live maps, or official live regulations yet.

## Features

- Premium outdoor-inspired UI system with reusable cards, buttons, badges, list items, section headers, empty states, loading states, and error states
- Interactive mock map with search, water-type filters, faux map pins, bottom-sheet details, favorites, directions placeholder, and YouTube search links
- Expanded fish database for trout, bass, panfish, kokanee, salmon, and steelhead
- Fish detail pages with season, weather, time of day, bait, lures, rod, reel, line, hooks, knots, rigs, casting tips, habitat, mistakes, regulations, and YouTube links
- Guided Rig Builder that recommends a setup, knot, SVG diagram, explanation, and success estimate
- Rig and knot library with labeled SVG diagrams and step-by-step instructions
- Trip Log with locally persisted trips, outcomes, notes, photo placeholder, and simple statistics
- Local favorites for locations, fish, rigs, and knots
- Ask Unskunked rule-based assistant powered by local data
- Learning Center for basics, casting, knots, rigs, fish behavior, mistakes, glossary, and FAQ

## Tech Stack

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- React Native SVG
- AsyncStorage for local favorites and trip logs
- Vitest for local helper tests

## Architecture

Unskunked keeps app state and data intentionally simple for the MVP:

- Screens live under `app/` using Expo Router.
- Shared UI components live in `src/components/`.
- Mock domain data lives in `src/data/`.
- Search, recommendations, YouTube links, and local storage utilities live in `src/utils/`.
- Reusable hooks live in `src/hooks/`.
- Design tokens live in `src/theme.ts`.

Future API integration should start by replacing or augmenting the local data modules with service adapters while keeping screens pointed at typed domain models.

## Folder Structure

```text
app/
  (tabs)/
    index.tsx
    map.tsx
    fish.tsx
    rigs.tsx
    ask.tsx
  fish/[id].tsx
  learn.tsx
  log.tsx
src/
  components/
  data/
  hooks/
  utils/
  theme.ts
tests/
```

## Installation

Requirements:

- Node.js 20+
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

Run tests:

```bash
npm test
```

Run TypeScript:

```bash
npm run typecheck
```

Verify native bundles compile:

```bash
npx expo export --platform ios --output-dir /private/tmp/unskunked-export-ios
npx expo export --platform android --output-dir /private/tmp/unskunked-export-android
```

## Screenshots

Add demo screenshots here:

- Phase 1 Design System: `screenshots/phase-1-design-system.png`
- Phase 2 Interactive Map: `screenshots/phase-2-map.png`
- Phase 3 Fish Database: `screenshots/phase-3-fish.png`
- Phase 4 Rig Builder: `screenshots/phase-4-rig-builder.png`
- Phase 5 Trip Log: `screenshots/phase-5-trip-log.png`
- Phase 6 Ask and Learn: `screenshots/phase-6-ask-learn.png`

## Roadmap

Two-week MVP:

- Week 1: polish design system, mock data, map, fish pages, rig builder, learning content, and trip logging
- Week 2: device QA, screenshots, onboarding, accessibility review, dark mode pass, animation polish, and demo script

Next product milestones:

- Real WDFW regulation integration with timestamps and source links
- Real map provider and geolocation
- Weather and pressure context
- Offline location packs
- Fish ID by photo
- Catch photo attachments
- Camera-based fish measurement
- Community reports
- Optional AI coach using a paid API only after clear user consent

## Contributing

Keep the app Expo-compatible and local-first. Prefer typed data models, reusable components, and small focused commits. All regulation-related copy must clearly state when it is mock data and should never imply official legal guidance.

## GitHub

Repository: `https://github.com/Aeh961/unskunked`

## Disclaimer

Unskunked is for planning and education only. Always verify current regulations with official fish and wildlife agencies before fishing or keeping fish.
