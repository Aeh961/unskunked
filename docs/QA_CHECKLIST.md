# Unskunked QA Checklist

Use this checklist before sharing a beta build with testers.

## Setup

- [ ] Run `npm install`.
- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npx expo export --platform ios`.
- [ ] Run `npx expo export --platform android`.
- [ ] Confirm Demo Mode can be enabled from Settings.

## Onboarding

- [ ] Open Start Here from Home.
- [ ] Select Washington.
- [ ] Select Oregon, Idaho, and California and confirm placeholder copy is clear.
- [ ] Select Beginner, Intermediate, and Advanced.
- [ ] Select fishing style.
- [ ] Select favorite fish.
- [ ] Select favorite waterbodies.
- [ ] Tap Save beta profile.
- [ ] Relaunch app and confirm profile selections persist.

## Home

- [ ] Hero, recommendation, quick actions, favorites, and regulation reminder render cleanly.
- [ ] Start Here, Plan Trip, Search, Stats, Feedback, Settings links navigate correctly.
- [ ] Text does not overlap on small screens.

## Map

- [ ] Search waterbodies.
- [ ] Filter by water type.
- [ ] Select a waterbody.
- [ ] Favorite a location.
- [ ] Verify official links open.
- [ ] Share waterbody recommendation.

## Fish Detail

- [ ] Open Rainbow Trout detail.
- [ ] Favorite fish.
- [ ] Verify regulation summary and official links render.
- [ ] Share fish tip.
- [ ] YouTube search links open externally.

## Rig Builder

- [ ] Complete guided rig inputs.
- [ ] Confirm recommendation, knot, bait, diagram, and confidence render.
- [ ] Confirm YouTube learning link opens externally.

## Trip Planner

- [ ] Change month, waterbody, access, experience, and target fish.
- [ ] Confirm legal summary, checklist, safety reminder, backup plan, and YouTube links update.
- [ ] Save trip plan.
- [ ] Start Trip creates a draft trip log.
- [ ] Share trip plan.

## Trip Log

- [ ] Save a new trip.
- [ ] Confirm history updates.
- [ ] Confirm saved plans appear.
- [ ] Share trip result.
- [ ] Open Fishing Stats and confirm analytics update.

## Favorites

- [ ] Favorite fish, waterbody, rig, and knot.
- [ ] Confirm Favorites screen lists each item.
- [ ] Confirm empty state appears when no favorites exist.

## Search

- [ ] Search fish.
- [ ] Search waterbodies.
- [ ] Search rigs and knots.
- [ ] Search learning articles.
- [ ] Search trip logs.
- [ ] Confirm recent searches persist.

## Feedback

- [ ] Submit each feedback type.
- [ ] Confirm feedback saves locally.
- [ ] Export feedback JSON through share sheet.

## Export

- [ ] Export all beta data.
- [ ] Export trip logs.
- [ ] Export favorites.
- [ ] Export trip plans.
- [ ] Export feedback.
- [ ] Export profile/preferences.

## Settings

- [ ] Toggle Demo Mode.
- [ ] Reload demo data.
- [ ] Change selected region.
- [ ] Confirm personalized recommendation updates.
- [ ] Open About, Feedback, and Export.

## iOS

- [ ] App launches in iOS Simulator or device.
- [ ] Native share sheet opens from planner, fish detail, map, trip log, feedback, and export.
- [ ] Screenshots generate with `npm run screenshots:ios`.

## Android

- [ ] App launches in Android Emulator or device.
- [ ] Native share sheet opens from planner, fish detail, map, trip log, feedback, and export.
- [ ] Screenshots generate with `npm run screenshots:android`.
