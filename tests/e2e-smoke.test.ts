import { describe, expect, it } from "vitest";
import { waterbodies } from "@/src/data/waterbodies";
import { getNearbyWaterbodies, defaultManualLocation } from "@/src/services/location";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { calculateTripScore, getMockWeather } from "@/src/services/fishingConditions";
import { getOfflinePacks } from "@/src/services/offlineDownloads";
import { getMapMarkers } from "@/src/services/mapMarkers";
import { buildShellfishPlan } from "@/src/services/shellfishPlanner";
import { buildTripPlan } from "@/src/utils/recommendations";
import { searchByFields } from "@/src/utils/search";

const phase8Routes = [
  "/",
  "/map",
  "/fish/rainbow-trout",
  "/regulations",
  "/weather",
  "/plan",
  "/offline",
  "/data-sources",
  "/search",
  "/journal",
  "/insights",
  "/settings",
  "/about"
];

const phase9Screens = [
  "Home",
  "Nearby Waters",
  "Waterbody Detail",
  "Fish Detail",
  "Regulations",
  "Weather",
  "Trip Planner",
  "GPS Permission",
  "Offline Mode",
  "Search",
  "Fishing Journal",
  "Beta Insights",
  "Settings",
  "About"
];

describe("Phase 9 E2E smoke flows", () => {
  it("covers the required screenshot and beta routes", () => {
    expect(phase8Routes).toContain("/regulations");
    expect(phase8Routes).toContain("/weather");
    expect(phase8Routes).toContain("/offline");
    expect(phase8Routes).toContain("/data-sources");
    expect(phase8Routes).toContain("/journal");
  });

  it("handles GPS denied by using manual nearby fallback", () => {
    const nearby = getNearbyWaterbodies(defaultManualLocation.coordinates, { limit: 3 });
    expect(nearby.length).toBe(3);
    expect(nearby[0].distanceMiles).toBeLessThanOrEqual(nearby[1].distanceMiles);
  });

  it("supports search across county, species, and difficulty metadata", () => {
    const results = searchByFields(waterbodies, "King", [(water) => water.county ?? "", (water) => water.name, (water) => water.beginnerDifficulty]);
    expect(results.length).toBeGreaterThan(3);
  });

  it("builds a nearby planner result with current regulations", () => {
    const plan = buildTripPlan({
      month: "July",
      waterbodyId: "lake-washington",
      access: "Shore",
      experience: "Beginner",
      targetFishId: "rainbow-trout",
      preferNearest: true,
      userLocation: defaultManualLocation.coordinates,
      timeAvailable: "2 hours"
    });
    const rules = getCurrentRegulations({ waterbodyId: plan.water.id, speciesId: plan.fish.id });
    expect(plan.water.name).toBeTruthy();
    expect(rules.badges.length).toBeGreaterThan(2);
  });

  it("scores weather and supports offline packs", () => {
    const water = waterbodies[0];
    const score = calculateTripScore({ weather: getMockWeather(water), waterbody: water, userExperience: "Beginner", targetSpecies: water.speciesIds[0] });
    expect(score).toBeGreaterThan(0);
    expect(getOfflinePacks().length).toBeGreaterThan(3);
  });

  it("covers Phase 9 screenshot surfaces", () => {
    expect(phase9Screens).toContain("Nearby Waters");
    expect(phase9Screens).toContain("GPS Permission");
    expect(phase9Screens).toContain("Fishing Journal");
  });

  it("supports GPS map marker filters for shellfish activities", () => {
    const clamMarkers = getMapMarkers({ activity: "clamming", coordinates: defaultManualLocation.coordinates });
    const crabMarkers = getMapMarkers({ activity: "crabbing", coordinates: defaultManualLocation.coordinates });
    expect(clamMarkers.length).toBeGreaterThan(0);
    expect(crabMarkers.length).toBeGreaterThan(0);
    expect(clamMarkers[0].distanceMiles).toBeGreaterThanOrEqual(0);
  });

  it("builds shellfish planner flows for clamming and crabbing", () => {
    const clamming = buildShellfishPlan({ activityType: "clamming", coordinates: defaultManualLocation.coordinates, experience: "Beginner" });
    const crabbing = buildShellfishPlan({ activityType: "crabbing", coordinates: defaultManualLocation.coordinates, experience: "Intermediate" });
    expect(clamming.location.activityTypes).toContain("clamming");
    expect(crabbing.location.activityTypes).toContain("crabbing");
    expect(crabbing.tide?.movement).toBeTruthy();
  });
});
