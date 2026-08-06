import { describe, expect, it } from "vitest";
import { isTripIntent, mergeFollowUpAnswer, nextFollowUp, parseTripText } from "@/src/utils/tripParser";

describe("natural-language trip parsing", () => {
  it("parses activity, species, and location from a full sentence", () => {
    const parsed = parseTripText("I want to fish for trout at Green Lake");
    expect(parsed.activityType).toBe("fishing");
    expect(parsed.targetFishId).toBe("rainbow-trout");
    expect(parsed.waterbodyId).toBe("green-lake");
    expect(nextFollowUp(parsed)).toBeNull();
  });

  it("parses activity, species, and shore access from 'catch salmon from shore'", () => {
    const parsed = parseTripText("I want to catch salmon from shore");
    expect(parsed.activityType).toBe("fishing");
    expect(parsed.targetFishId).toBe("salmon");
    expect(parsed.accessType).toBe("Shore");
    expect(nextFollowUp(parsed)).toBeNull();
  });

  it("parses crabbing at a named pier", () => {
    const parsed = parseTripText("I want to crab at Edmonds Pier");
    expect(parsed.activityType).toBe("crabbing");
    expect(parsed.shellfishLocationId).toBe("edmonds-pier-crab");
    expect(parsed.accessType).toBe("Pier");
    expect(nextFollowUp(parsed)).toBeNull();
  });

  it("parses clamming with a relative date", () => {
    const parsed = parseTripText("I want to dig razor clams this weekend");
    expect(parsed.activityType).toBe("clamming");
    expect(parsed.targetShellfishId).toBe("razor-clam");
    expect(parsed.dateHint).toBe("this weekend");
    expect(nextFollowUp(parsed)).toBeNull();
  });

  it("extracts gear/bait and asks for location when it's missing", () => {
    const parsed = parseTripText("I have worms and want to catch perch");
    expect(parsed.activityType).toBe("fishing");
    expect(parsed.targetFishId).toBe("yellow-perch");
    expect(parsed.gearOrBait).toBe("worms");
    expect(nextFollowUp(parsed)?.question).toBe("Where are you fishing?");
  });

  it("treats a location-only question as answerable without asking for species", () => {
    const parsed = parseTripText("What can I catch at Lake Washington?");
    expect(parsed.waterbodyId).toBe("lake-washington");
    expect(nextFollowUp(parsed)).toBeNull();
  });

  it("asks exactly one follow-up question for an incomplete request", () => {
    const parsed = parseTripText("I want to fish for trout.");
    expect(parsed.activityType).toBe("fishing");
    expect(parsed.targetFishId).toBe("rainbow-trout");
    expect(parsed.waterbodyId).toBeUndefined();
    expect(nextFollowUp(parsed)?.question).toBe("Where are you fishing?");
  });

  it("does not let the word 'fish' or 'fishing' false-match unrelated catalog entries", () => {
    const parsed = parseTripText("I want to fish for trout.");
    expect(parsed.targetFishId).not.toBe("channel-catfish");
    expect(parsed.waterbodyId).not.toBe("edmonds-pier");
  });

  it("accumulates a follow-up answer across turns", () => {
    const first = parseTripText("I want to fish for trout.");
    const followUp = nextFollowUp(first);
    expect(followUp?.question).toBe("Where are you fishing?");
    const merged = mergeFollowUpAnswer(first, "Green Lake");
    expect(merged.waterbodyId).toBe("green-lake");
    expect(merged.targetFishId).toBe("rainbow-trout");
    expect(nextFollowUp(merged)).toBeNull();
  });

  it("recognizes trip-shaped text vs a general question", () => {
    expect(isTripIntent("I want to fish for trout")).toBe(true);
    expect(isTripIntent("Dungeness crab")).toBe(true);
    expect(isTripIntent("What knot should I tie for a drop shot rig?")).toBe(false);
  });
});
