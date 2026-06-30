import { describe, expect, it } from "vitest";
import { fishSpecies } from "@/src/data/fish";
import { rigsAndKnots } from "@/src/data/rigs";
import { waterbodies } from "@/src/data/waterbodies";
import { getStatusLabel, isFishable } from "@/src/utils/regulations";
import { answerLocalQuestion, buildTripPlan, recommendSpeciesFromGear } from "@/src/utils/recommendations";
import { searchByFields } from "@/src/utils/search";
import { createMemoryStorageDriver, createStorageRepository } from "@/src/utils/storage";
import { regulationService, WashingtonRegulationProvider } from "@/src/services/regulations";
import { calculateTripAnalytics } from "@/src/services/tripAnalytics";
import { personalizationService } from "@/src/services/personalization";
import { demoFavorites, demoOnboardingProfile, demoTrips } from "@/src/utils/localStore";

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
});

describe("search helpers", () => {
  it("filters waterbodies by name and region", () => {
    const results = searchByFields(waterbodies, "seattle", [(water) => water.name, (water) => water.region]);
    expect(results.map((water) => water.name)).toContain("Green Lake");
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
});

describe("mock data validation", () => {
  it("has valid waterbody species references", () => {
    const speciesIds = new Set(fishSpecies.map((fish) => fish.id));
    for (const water of waterbodies) {
      expect(water.speciesIds.every((id) => speciesIds.has(id))).toBe(true);
    }
  });

  it("has step-by-step content for every rig and knot", () => {
    expect(rigsAndKnots.every((item) => item.steps.length >= 3 && item.parts.length >= 3)).toBe(true);
  });
});
