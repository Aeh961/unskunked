import { describe, expect, it } from "vitest";
import { fishSpecies } from "@/src/data/fish";
import { rigsAndKnots } from "@/src/data/rigs";
import { waterbodies } from "@/src/data/waterbodies";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { getStatusLabel, isFishable } from "@/src/utils/regulations";
import { answerLocalQuestion, buildTripPlan, recommendSpeciesFromGear } from "@/src/utils/recommendations";
import { searchByFields } from "@/src/utils/search";
import { createMemoryStorageDriver, createStorageRepository } from "@/src/utils/storage";
import { regulationService, WashingtonRegulationProvider } from "@/src/services/regulations";
import { calculateTripAnalytics } from "@/src/services/tripAnalytics";
import { personalizationService } from "@/src/services/personalization";
import { demoFavorites, demoOnboardingProfile, demoTripPlans, demoTrips } from "@/src/utils/localStore";
import { formatJsonExport, formatTripPlanShare } from "@/src/utils/share";
import { defaultManualLocation, distanceMiles, getNearbyWaterbodies, getNearestBeginnerWaterbody } from "@/src/services/location";
import { getOfficialLinksForWaterbody } from "@/src/services/officialLinks";
import { calculateBetaInsights } from "@/src/services/betaInsights";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { calculateTripScore, getMockWeather, getSunWindows, getTideSnapshot } from "@/src/services/fishingConditions";
import { getOfflinePacks } from "@/src/services/offlineDownloads";
import { getMapMarkers } from "@/src/services/mapMarkers";
import { buildShellfishPlan } from "@/src/services/shellfishPlanner";
import { MockConditionsProvider, cacheConditionsForLocation } from "@/src/services/conditionProviders";
import { getImportReadinessReport, validateSnapshotManifest } from "@/src/services/wdfwImportPipeline";

describe("regulation helpers", () => {
  it("labels and permits restricted waters as fishable with caution", () => {
    expect(getStatusLabel("restricted")).toBe("Restricted");
    expect(isFishable("restricted")).toBe(true);
    expect(isFishable("closed")).toBe(false);
  });

  it("returns official-source-ready Washington regulation summaries", () => {
    const provider = new WashingtonRegulationProvider();
    const summary = provider.getWaterbodyRules("green-lake", { state: "WA", waterbodyId: "green-lake" });
    expect(summary.sourceLinks.regulations).toContain("wdfw.wa.gov");
    expect(summary.warningMessages.join(" ")).toContain("Mock");
  });

  it("falls back to placeholder provider for demo-only regions", () => {
    const summary = regulationService.getSummary({ state: "OR" });
    expect(summary.season).toContain("placeholder");
    expect(summary.catchAndRelease).toBe(true);
  });

  it("generates WDFW link sets with expanded official sources", () => {
    const links = getOfficialLinksForWaterbody(waterbodies.find((water) => water.id === "puget-sound"));
    expect(links.regulations).toContain("wdfw.wa.gov");
    expect(links.emergencyRules).toContain("emergency-rules");
    expect(links.marineAreas).toContain("marine-areas");
    expect(links.freshwaterRules).toContain("freshwater");
  });

  it("returns current regulation badges for a waterbody", () => {
    const rules = getCurrentRegulations({ waterbodyId: "green-lake", speciesId: "rainbow-trout" });
    expect(rules.badges.map((badge) => badge.label)).toContain("Open");
    expect(rules.badges.some((badge) => badge.label.includes("Trout Limit"))).toBe(true);
    expect(rules.dataLastUpdated).toBe("May 2026");
  });
});

describe("species recommendations", () => {
  it("recommends worm-friendly species", () => {
    const names = recommendSpeciesFromGear("I have worms and a spinning rod").map((fish) => fish.name);
    expect(names).toContain("Rainbow Trout");
    expect(names).toContain("Yellow Perch");
  });

  it("answers waterbody questions from local data", () => {
    expect(answerLocalQuestion("Can I fish Lake Washington today?")).toContain("Lake Washington");
  });

  it("builds a complete beginner trip plan", () => {
    const plan = buildTripPlan({
      month: "July",
      waterbodyId: "green-lake",
      access: "Shore",
      experience: "Beginner",
      targetFishId: "rainbow-trout"
    });
    expect(plan.gearChecklist.length).toBeGreaterThan(2);
    expect(plan.backupPlan).toContain("20 minutes");
    expect(plan.regulation.sourceLinks.emergencyRules).toContain("emergency-rules");
  });

  it("can build a nearby beginner trip plan from coordinates", () => {
    const plan = buildTripPlan({
      month: "July",
      waterbodyId: "lake-chelan",
      access: "Shore",
      experience: "Beginner",
      targetFishId: "rainbow-trout",
      userLocation: defaultManualLocation.coordinates,
      preferNearest: true,
      timeAvailable: "2 hours"
    });
    expect(plan.water.beginnerDifficulty).toBe("Easy");
    expect(plan.beginnerAdvice).toContain("2 hours");
  });
});

describe("location helpers", () => {
  it("calculates distance between Seattle and Green Lake", () => {
    const greenLake = waterbodies.find((water) => water.id === "green-lake");
    expect(greenLake).toBeTruthy();
    const miles = distanceMiles(defaultManualLocation.coordinates, { latitude: greenLake!.latitude, longitude: greenLake!.longitude });
    expect(miles).toBeGreaterThan(3);
    expect(miles).toBeLessThan(8);
  });

  it("sorts nearby waterbodies by distance", () => {
    const nearby = getNearbyWaterbodies(defaultManualLocation.coordinates, { limit: 5 });
    expect(nearby.length).toBe(5);
    expect(nearby[0].distanceMiles).toBeLessThanOrEqual(nearby[1].distanceMiles);
  });

  it("finds a nearest beginner-friendly waterbody", () => {
    const water = getNearestBeginnerWaterbody(defaultManualLocation.coordinates);
    expect(water?.beginnerDifficulty).toBe("Easy");
  });
});

describe("fishing conditions", () => {
  it("calculates a smart trip score", () => {
    const water = waterbodies.find((item) => item.id === "green-lake")!;
    const weather = getMockWeather(water);
    const score = calculateTripScore({ weather, waterbody: water, userExperience: "Beginner", targetSpecies: "rainbow-trout" });
    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("provides sun windows and saltwater tides", () => {
    expect(getSunWindows().morningBite).toContain("-");
    const tide = getTideSnapshot(waterbodies.find((item) => item.id === "puget-sound")!);
    expect(tide?.movement).toBeTruthy();
  });

  it("scores clamming and crabbing with tide context", () => {
    const water = { waterType: "Saltwater" as const, beginnerDifficulty: "Easy" as const, bestSeason: "Summer" };
    const weather = getMockWeather({ waterType: "Saltwater", region: "Puget Sound" });
    const tide = getTideSnapshot({ waterType: "Saltwater" });
    const clamScore = calculateTripScore({ activityType: "clamming", weather, tide, waterbody: water, userExperience: "Beginner", distanceMiles: 12 });
    const crabScore = calculateTripScore({ activityType: "crabbing", weather, tide, waterbody: water, userExperience: "Intermediate", distanceMiles: 12 });
    expect(clamScore).toBeGreaterThan(60);
    expect(crabScore).toBeGreaterThan(60);
  });

  it("builds shellfish trip plans from nearby coordinates", () => {
    const plan = buildShellfishPlan({ activityType: "clamming", coordinates: defaultManualLocation.coordinates, experience: "Beginner" });
    expect(plan.location.activityTypes).toContain("clamming");
    expect(plan.score).toBeGreaterThan(0);
    expect(plan.whatToBring.length).toBeGreaterThan(2);
  });

  it("uses condition providers and offline cache shape", async () => {
    const provider = new MockConditionsProvider();
    const location = shellfishLocations[0];
    const snapshot = await cacheConditionsForLocation({
      id: `test:${location.id}`,
      locationName: location.name,
      activityType: "clamming",
      location,
      provider
    });
    expect(snapshot.weather.airTempF).toBeGreaterThan(0);
    expect(snapshot.tide?.movement).toBeTruthy();
  });

  it("creates offline download packs", () => {
    const packs = getOfflinePacks();
    expect(packs.map((pack) => pack.label)).toContain("Entire Washington");
    expect(packs[0].waterbodyCount).toBeGreaterThanOrEqual(25);
  });
});

describe("search helpers", () => {
  it("filters waterbodies by name and region", () => {
    const results = searchByFields(waterbodies, "seattle", [(water) => water.name, (water) => water.region]);
    expect(results.map((water) => water.name)).toContain("Green Lake");
  });
});

describe("Phase 9 map and WDFW data readiness", () => {
  it("builds searchable markers for fishing, clamming, and crabbing", () => {
    const all = getMapMarkers({ coordinates: defaultManualLocation.coordinates });
    const clams = getMapMarkers({ activity: "clamming", query: "beach" });
    const crabs = getMapMarkers({ activity: "crabbing" });
    expect(all.some((marker) => marker.kind === "fishing")).toBe(true);
    expect(clams.every((marker) => marker.kind === "clamming")).toBe(true);
    expect(crabs.every((marker) => marker.kind === "crabbing")).toBe(true);
  });

  it("tracks shellfish species and verified source snapshots", () => {
    expect(shellfishSpecies.some((species) => species.id === "dungeness-crab")).toBe(true);
    expect(shellfishSpecies.some((species) => species.id === "razor-clam")).toBe(true);
    expect(validateSnapshotManifest()).toBe(true);
    const report = getImportReadinessReport();
    expect(report.dataLastUpdated).toBe("May 2026");
    expect(report.shellfishLocationCount).toBeGreaterThanOrEqual(6);
    expect(report.missingSourceWaterbodies).toEqual([]);
  });
});

describe("storage helpers", () => {
  it("reads fallback values when JSON is missing or invalid", async () => {
    const driver = createMemoryStorageDriver({ bad: "not-json" });
    const store = createStorageRepository(driver);
    expect(await store.readJson("missing", ["fallback"])).toEqual(["fallback"]);
    expect(await store.readJson("bad", { ok: true })).toEqual({ ok: true });
  });

  it("writes JSON through the configured driver", async () => {
    const driver = createMemoryStorageDriver();
    const store = createStorageRepository(driver);
    await store.writeJson("profile", { region: "washington" });
    expect(await store.readJson("profile", null)).toEqual({ region: "washington" });
  });
});

describe("share and export helpers", () => {
  it("formats a shareable trip plan", () => {
    const message = formatTripPlanShare(demoTripPlans[0]);
    expect(message).toContain("Green Lake");
    expect(message).toContain("rainbow trout");
    expect(message).toContain("Improved Clinch Knot");
  });

  it("formats JSON exports consistently", () => {
    const output = formatJsonExport({ feedback: [{ type: "Bug report" }] });
    expect(output).toContain("\"feedback\"");
    expect(output).toContain("Bug report");
  });
});

describe("trip analytics and personalization", () => {
  it("calculates useful trip stats", () => {
    const analytics = calculateTripAnalytics(demoTrips);
    expect(analytics.totalTrips).toBe(3);
    expect(analytics.bestBait).toContain("PowerBait");
    expect(analytics.unskunkedRatio).toBeGreaterThan(50);
  });

  it("generates a personalized next action", () => {
    const recommendation = personalizationService.buildRecommendation(
      { ...demoOnboardingProfile, month: "July" },
      demoFavorites,
      demoTrips
    );
    expect(recommendation.waterbody).toBeTruthy();
    expect(recommendation.nextBestAction).toContain("Plan");
  });

  it("calculates local-only beta insights", () => {
    const insights = calculateBetaInsights({
      events: [
        { id: "1", type: "fish-view", label: "Rainbow Trout", createdAt: "2026-06-30" },
        { id: "2", type: "waterbody-view", label: "Green Lake", createdAt: "2026-06-30" },
        { id: "3", type: "planner-choice", label: "Nearest beginner spot", createdAt: "2026-06-30" }
      ],
      searches: ["Green Lake"],
      feedback: [{ id: "f1", createdAt: "2026-06-30", type: "Bug report", screen: "Map", message: "Test" }],
      trips: demoTrips,
      tripPlans: demoTripPlans,
      favorites: demoFavorites
    });
    expect(insights.mostViewedFish).toContain("Rainbow Trout");
    expect(insights.feedbackCategories).toContain("Bug report");
  });
});

describe("mock data validation", () => {
  it("has valid waterbody species references", () => {
    const speciesIds = new Set(fishSpecies.map((fish) => fish.id));
    for (const water of waterbodies) {
      expect(water.speciesIds.every((id) => speciesIds.has(id))).toBe(true);
    }
  });

  it("has at least 25 expanded Washington waterbodies with access metadata", () => {
    expect(waterbodies.length).toBeGreaterThanOrEqual(25);
    expect(waterbodies.every((water) => water.county && water.parkingNote && water.bestSeason && water.officialLink && water.waterbodyId && water.lastUpdated)).toBe(true);
  });

  it("has expanded Washington fish species coverage", () => {
    const required = ["rainbow-trout", "cutthroat-trout", "brown-trout", "brook-trout", "kokanee", "largemouth-bass", "smallmouth-bass", "yellow-perch", "crappie", "bluegill", "walleye", "channel-catfish", "carp", "lingcod", "rockfish", "flounder", "salmon", "steelhead", "sturgeon"];
    const ids = new Set(fishSpecies.map((fish) => fish.id));
    expect(required.every((id) => ids.has(id))).toBe(true);
  });

  it("has step-by-step content for every rig and knot", () => {
    expect(rigsAndKnots.every((item) => item.steps.length >= 3 && item.parts.length >= 3)).toBe(true);
  });
});
