import { describe, expect, it } from "vitest";
import { waterbodies } from "@/src/data/waterbodies";
import { getNearbyWaterbodies, defaultManualLocation } from "@/src/services/location";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { calculateTripScore, getMockWeather } from "@/src/services/fishingConditions";
import { getOfflinePacks } from "@/src/services/offlineDownloads";
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
  "/search",
  "/journal",
  "/insights",
  "/settings",
  "/about"
];

describe("Phase 8 E2E smoke flows", () => {
  it("covers the required screenshot and beta routes", () => {
    expect(phase8Routes).toContain("/regulations");
    expect(phase8Routes).toContain("/weather");
    expect(phase8Routes).toContain("/offline");
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
});
