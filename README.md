# Unskunked

Unskunked is a beginner-friendly fishing assistant for iOS and Android. It helps new anglers decide where to try, what fish to target, what bait or lures to use, what knot or rig to tie, and what YouTube search to open for a visual lesson.

This MVP uses local mock Washington data only. It does not use paid APIs, a backend, or official live regulations yet.

## Important Disclaimer

This app is for guidance only. Always verify current regulations with official fish and wildlife agencies before fishing or keeping fish.

## Tech Stack

- React Native with Expo
- TypeScript
- Expo Router
- Local mock data
- Vitest for helper tests

## Getting Started

Requirements:

- Node.js 20+
- npm
- Expo Go on your iOS or Android device, or a configured simulator/emulator

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Run on iOS:

```bash
npm run ios
```

This opens the iOS simulator when Xcode tooling is installed. You can also start Expo with `npm start` and press `i`.

Run on Android:

```bash
npm run android
```

This opens an Android emulator when Android Studio tooling is installed. You can also start Expo with `npm start` and press `a`.

Run tests:

```bash
npm test
```

Typecheck:

```bash
npm run typecheck
```

Verify the Expo app compiles:

```bash
npx expo start
```

## MVP Features

- Home screen with fast beginner actions
- Searchable Washington waterbody selector as the map fallback
- Fish list with open, restricted, and warning badges
- Fish detail pages with bait, lures, gear, limits, restrictions, and YouTube searches
- Rigs and knots library with step-by-step instructions
- Simple labeled rig diagrams built with SVG
- Ask Unskunked local rule-based chat
- Mock data validation and helper tests

## Screenshots

Add demo screenshots here:

- Home: `screenshots/home.png`
- Map: `screenshots/map.png`
- Fish detail: `screenshots/fish-detail.png`
- Rigs: `screenshots/rigs.png`
- Ask: `screenshots/ask.png`

## GitHub

Repository: `https://github.com/Aeh961/unskunked`

## 2-Week MVP Roadmap

Week 1:

- Scaffold Expo Router app
- Build mock fish, waterbody, regulation, rig, knot, and YouTube data
- Implement Home, Map fallback, Fish, Rigs, and Ask screens
- Add local helper tests
- Polish navigation, cards, warnings, and beginner copy

Week 2:

- Add device QA on iOS and Android
- Add screenshot capture and demo script
- Tune mock recommendations with real beginner scenarios
- Improve accessibility labels and touch target review
- Prepare GitHub README, roadmap, and demo build notes
- Create a public GitHub repository and push the MVP

## Future Features

- Official regulation API integration
- Fish ID by photo
- Camera-based fish measurement
- GPS-based regulation lookup
- Real fishing reports
- Offline maps
- Premium AI fishing coach

## Data Notes

All regulation content in this app is intentionally mocked for the MVP. The production version should integrate official fish and wildlife agency data and clearly show source timestamps.
