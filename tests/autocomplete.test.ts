import { describe, expect, it } from "vitest";
import { getSuggestions } from "@/src/utils/autocomplete";

describe("typed autocomplete", () => {
  it("returns nothing for an empty or whitespace-only query", () => {
    expect(getSuggestions("")).toEqual([]);
    expect(getSuggestions("   ")).toEqual([]);
  });

  it("matches fish species by partial name", () => {
    const results = getSuggestions("rainbow tr");
    expect(results.some((item) => item.kind === "Fish" && item.label === "Rainbow Trout")).toBe(true);
  });

  it("matches waterbodies by partial name", () => {
    const results = getSuggestions("green lak");
    expect(results.some((item) => item.kind === "Water" && item.label === "Green Lake")).toBe(true);
  });

  it("matches shellfish species and routes to a prefilled trip", () => {
    const results = getSuggestions("dungeness");
    const match = results.find((item) => item.kind === "Shellfish");
    expect(match?.label).toBe("Dungeness Crab");
    expect(match?.route).toContain("activityType=crabbing");
  });

  it("matches activity keywords", () => {
    const results = getSuggestions("crabbing");
    expect(results.some((item) => item.kind === "Activity" && item.label === "Crabbing")).toBe(true);
  });

  it("caps results at the requested limit", () => {
    const results = getSuggestions("a", { limit: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("ranks an exact match above partial matches", () => {
    const results = getSuggestions("Green Lake");
    expect(results[0]?.label).toBe("Green Lake");
  });
});
