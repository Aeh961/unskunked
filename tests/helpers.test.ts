import { describe, expect, it } from "vitest";
import { fishSpecies } from "@/src/data/fish";
import { rigsAndKnots } from "@/src/data/rigs";
import { waterbodies } from "@/src/data/waterbodies";
import { getStatusLabel, isFishable } from "@/src/utils/regulations";
import { answerLocalQuestion, recommendSpeciesFromGear } from "@/src/utils/recommendations";
import { searchByFields } from "@/src/utils/search";

describe("regulation helpers", () => {
  it("labels and permits restricted waters as fishable with caution", () => {
    expect(getStatusLabel("restricted")).toBe("Restricted");
    expect(isFishable("restricted")).toBe(true);
    expect(isFishable("closed")).toBe(false);
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
});

describe("search helpers", () => {
  it("filters waterbodies by name and region", () => {
    const results = searchByFields(waterbodies, "seattle", [(water) => water.name, (water) => water.region]);
    expect(results.map((water) => water.name)).toContain("Green Lake");
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
