import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { washingtonWaterbodies } from "@/src/data/waterbodies/washington";
import { floridaWaterbodies } from "@/src/data/waterbodies/florida";
import { ronnebyWaterbodies } from "@/src/data/waterbodies/ronneby";
import { waterbodies } from "@/src/data/waterbodies";
import { getMapMarkers } from "@/src/services/mapMarkers";
import { clamp, MASCOT_SPEECH_LINES, pickBoundedOffset, pickIdleDelay, pickSpeechLine } from "@/src/utils/mascotAnimation";
import {
  demoFavorites,
  demoTrips,
  getFavorites,
  getRecentlyViewed,
  getSelectedRegion,
  getTrips,
  isDemoModeEnabled,
  pruneDemoRecords,
  recordRecentlyViewed,
  runDemoCleanupMigrationOnce,
  seedDemoData,
  setDemoModeEnabled,
  setFavorites,
  setSelectedRegion,
  setTrips
} from "@/src/utils/localStore";
import { normalizeImportRecord } from "../scripts/data-pipeline/normalize.mjs";
import { dedupeRecords } from "../scripts/data-pipeline/dedupe.mjs";

const validWaterTypes = new Set(["Lake", "River", "Saltwater", "Park", "Pier"]);
const datasetsByRegion: Array<[string, typeof washingtonWaterbodies]> = [
  ["washington", washingtonWaterbodies],
  ["florida", floridaWaterbodies],
  ["ronneby", ronnebyWaterbodies]
];

describe("region selection persistence", () => {
  // Runs first in this file so it observes the true default before any other test writes to storage.
  it("defaults to washington and persists a change", async () => {
    expect(await getSelectedRegion()).toBe("washington");
    await setSelectedRegion("florida");
    expect(await getSelectedRegion()).toBe("florida");
    await setSelectedRegion("washington");
    expect(await getSelectedRegion()).toBe("washington");
  });
});

describe("waterbody dataset validation", () => {
  for (const [regionId, list] of datasetsByRegion) {
    it(`${regionId}: every record has required fields and valid coordinates`, () => {
      expect(list.length).toBeGreaterThan(0);
      for (const water of list) {
        expect(water.id, `${water.name} missing id`).toBeTruthy();
        expect(water.name, `${water.id} missing name`).toBeTruthy();
        expect(water.latitude).toBeGreaterThanOrEqual(-90);
        expect(water.latitude).toBeLessThanOrEqual(90);
        expect(water.longitude).toBeGreaterThanOrEqual(-180);
        expect(water.longitude).toBeLessThanOrEqual(180);
        expect(validWaterTypes.has(water.waterType), `${water.name} has invalid waterType ${water.waterType}`).toBe(true);
      }
    });

    it(`${regionId}: has no duplicate ids`, () => {
      const ids = list.map((water) => water.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it(`${regionId}: has no duplicate name+coordinate pairs`, () => {
      const keys = list.map((water) => `${water.name.toLowerCase()}|${water.latitude.toFixed(3)}|${water.longitude.toFixed(3)}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  }

  it("every record with a verificationStatus also has a sourceUrl", () => {
    const allWater = [...washingtonWaterbodies, ...floridaWaterbodies, ...ronnebyWaterbodies];
    for (const water of allWater) {
      if (water.verificationStatus) {
        expect(water.sourceUrl, `${water.name} has verificationStatus but no sourceUrl`).toBeTruthy();
      }
    }
  });

  it("Washington, Florida, and Ronneby grew substantially via the real-data pipeline", () => {
    expect(washingtonWaterbodies.length).toBeGreaterThanOrEqual(300);
    expect(floridaWaterbodies.length).toBeGreaterThanOrEqual(100);
    expect(ronnebyWaterbodies.length).toBeGreaterThanOrEqual(10);
  });
});

describe("map/list dataset consistency", () => {
  it("getMapMarkers - the single source for both the map and the result list - respects region and query filters", () => {
    const markers = getMapMarkers({ region: "florida", query: "pier" });
    expect(markers.length).toBeGreaterThan(0);
    for (const marker of markers) {
      const haystack = `${marker.name} ${marker.county} ${marker.waterType} ${marker.kind} ${marker.difficulty}`.toLowerCase();
      expect(haystack).toContain("pier");
    }
  });

  it("search fallback: an empty query still returns the full region dataset for list rendering", () => {
    const markers = getMapMarkers({ region: "washington", query: "" });
    expect(markers.length).toBeGreaterThanOrEqual(washingtonWaterbodies.length);
  });
});

describe("recently viewed", () => {
  it("defaults to empty when nothing has been viewed - the section should be hidden, never seeded", async () => {
    expect(await getRecentlyViewed()).toEqual([]);
  });

  it("records views most-recent-first, deduped by id+type, capped at 10", async () => {
    for (let i = 0; i < 12; i += 1) {
      await recordRecentlyViewed(`test-water-${i}`, "location");
    }
    await recordRecentlyViewed("test-water-5", "location");
    const list = await getRecentlyViewed();
    expect(list.length).toBe(10);
    expect(list[0]).toMatchObject({ id: "test-water-5", type: "location" });
    expect(list.filter((item) => item.id === "test-water-5").length).toBe(1);
  });

  it("tracks fishing and shellfish views as distinct entries", async () => {
    await recordRecentlyViewed("shared-id", "location");
    await recordRecentlyViewed("shared-id", "shellfish-location");
    const list = await getRecentlyViewed();
    expect(list.filter((item) => item.id === "shared-id").length).toBe(2);
  });
});

describe("demo record isolation", () => {
  it("pruneDemoRecords strips only known demo ids, leaving real user data untouched", async () => {
    const realTrip = {
      id: "real-trip-1",
      location: "My Spot",
      date: "2026-01-01",
      weather: "sunny",
      speciesCaught: "Trout",
      numberCaught: 1,
      bait: "worm",
      rig: "bobber",
      notes: "",
      result: "Unskunked" as const
    };
    await setTrips([...demoTrips, realTrip]);
    await setFavorites([...demoFavorites, { type: "fish" as const, id: "real-favorite-fish" }]);

    const removed = await pruneDemoRecords();
    expect(removed).toBeGreaterThan(0);

    const trips = await getTrips();
    const favorites = await getFavorites();
    expect(trips.find((trip) => trip.id === "real-trip-1")).toBeTruthy();
    expect(trips.find((trip) => trip.id === demoTrips[0].id)).toBeUndefined();
    expect(favorites.find((favorite) => favorite.id === "real-favorite-fish")).toBeTruthy();
    expect(favorites.some((favorite) => demoFavorites.some((demo) => demo.id === favorite.id && demo.type === favorite.type))).toBe(false);
  });

  it("setDemoModeEnabled(false) prunes demo records that seedDemoData wrote into real storage", async () => {
    await seedDemoData();
    expect(await isDemoModeEnabled()).toBe(true);
    await setDemoModeEnabled(false);
    expect(await isDemoModeEnabled()).toBe(false);
    const trips = await getTrips();
    expect(trips.some((trip) => demoTrips.some((demo) => demo.id === trip.id))).toBe(false);
  });

  it("runDemoCleanupMigrationOnce prunes leftover demo data once, then no-ops on repeat", async () => {
    await setTrips(demoTrips);
    const removedFirst = await runDemoCleanupMigrationOnce();
    expect(removedFirst).toBeGreaterThan(0);
    expect((await getTrips()).length).toBe(0);

    await setTrips(demoTrips);
    const removedSecond = await runDemoCleanupMigrationOnce();
    expect(removedSecond).toBe(0);
  });
});

describe("mascot animation logic", () => {
  it("clamp keeps values within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("pickBoundedOffset never exceeds the requested bound", () => {
    for (let i = 0; i < 200; i += 1) {
      const { x, y } = pickBoundedOffset(20);
      expect(x).toBeGreaterThanOrEqual(-20);
      expect(x).toBeLessThanOrEqual(20);
      expect(y).toBeGreaterThanOrEqual(-20);
      expect(y).toBeLessThanOrEqual(20);
    }
  });

  it("pickIdleDelay stays within the requested range", () => {
    for (let i = 0; i < 50; i += 1) {
      const delay = pickIdleDelay(1000, 2000);
      expect(delay).toBeGreaterThanOrEqual(1000);
      expect(delay).toBeLessThanOrEqual(2000);
    }
  });

  it("pickSpeechLine always returns a line from the approved, original copy pool", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(MASCOT_SPEECH_LINES).toContain(pickSpeechLine());
    }
  });
});

describe("data pipeline: normalize", () => {
  it("accepts a well-formed record with a real source", () => {
    const result = normalizeImportRecord(
      { name: "Test Lake", county: "King", waterType: "Lake", latitude: 47.5, longitude: -122.1, sourceUrl: "https://wdfw.wa.gov/fishing/locations", sourceOrganization: "WDFW" },
      "washington"
    );
    expect(result.record).toBeDefined();
    expect(result.record?.id).toBe("test-lake");
    expect(result.record?.verificationStatus).toBe("imported");
  });

  it("rejects an invalid waterType", () => {
    const result = normalizeImportRecord({ name: "Bad", county: "King", waterType: "Ocean", latitude: 47.5, longitude: -122.1, sourceUrl: "https://wdfw.wa.gov/x" }, "washington");
    expect(result.error).toBeTruthy();
  });

  it("rejects a record missing a sourceUrl", () => {
    const result = normalizeImportRecord({ name: "No Source", county: "King", waterType: "Lake", latitude: 47.5, longitude: -122.1 }, "washington");
    expect(result.error).toBeTruthy();
  });

  it("rejects out-of-range coordinates", () => {
    const result = normalizeImportRecord({ name: "Bad Coords", county: "King", waterType: "Lake", latitude: 200, longitude: -122.1, sourceUrl: "https://wdfw.wa.gov/x" }, "washington");
    expect(result.error).toBeTruthy();
  });

  it("filters out activity values outside the app's fishing/clamming/crabbing enum", () => {
    const result = normalizeImportRecord(
      { name: "Boating Lake", county: "King", waterType: "Lake", latitude: 47.5, longitude: -122.1, sourceUrl: "https://wdfw.wa.gov/x", activities: ["boating"] },
      "washington"
    );
    expect(result.record?.activities).toEqual(["fishing"]);
  });

  it("rejects crowdsourced/social sources", () => {
    const result = normalizeImportRecord({ name: "Wiki Lake", county: "King", waterType: "Lake", latitude: 47.5, longitude: -122.1, sourceUrl: "https://en.wikipedia.org/wiki/Some_Lake" }, "washington");
    expect(result.error).toBeTruthy();
  });
});

describe("data pipeline: dedupe", () => {
  it("keeps distinct same-named waters in different locations, drops true duplicates", () => {
    const records = [
      { id: "clear-lake-a", name: "Clear Lake", latitude: 47.1, longitude: -122.1 },
      { id: "clear-lake-b", name: "Clear Lake", latitude: 48.9, longitude: -117.2 },
      { id: "clear-lake-c", name: "Clear Lake", latitude: 47.1001, longitude: -122.1001 }
    ];
    const { kept, droppedInternal, droppedAgainstExisting } = dedupeRecords(records, ["Green Lake"]);
    expect(kept.length).toBe(2);
    expect(droppedInternal.length).toBe(1);
    expect(droppedAgainstExisting.length).toBe(0);
  });

  it("drops records matching an existing curated name", () => {
    const records = [{ id: "green-lake-dup", name: "Green Lake", latitude: 47.68, longitude: -122.33 }];
    const { kept, droppedAgainstExisting } = dedupeRecords(records, ["Green Lake"]);
    expect(kept.length).toBe(0);
    expect(droppedAgainstExisting).toEqual(["Green Lake"]);
  });
});

describe("tripParser word-boundary matching regression", () => {
  it("does not false-match 'have' against the real 'Haven Lake' record", async () => {
    const { parseTripText, nextFollowUp } = await import("@/src/utils/tripParser");
    expect(waterbodies.some((water) => water.name.toLowerCase() === "haven lake")).toBe(true);
    const parsed = parseTripText("I have worms and want to catch perch");
    expect(parsed.waterbodyId).toBeUndefined();
    expect(nextFollowUp(parsed)?.question).toBe("Where are you fishing?");
  });
});

describe("regression guards: removed/renamed content", () => {
  it("Map screen no longer has a separate 'Nearby waterbodies' section", () => {
    const source = readFileSync("app/(tabs)/map.tsx", "utf8");
    expect(source).not.toMatch(/Nearby waterbodies/i);
  });

  it("Settings hero no longer leads with investor/demo framing", () => {
    const source = readFileSync("app/settings.tsx", "utf8");
    expect(source).not.toMatch(/investor walkthroughs/i);
  });

  it("OfficialLinks resolves a distinct action set for the shellfish context", () => {
    const source = readFileSync("src/components/OfficialLinks.tsx", "utf8");
    expect(source).toMatch(/Beach Status/);
    expect(source).toMatch(/Marine Toxins/);
    expect(source).toMatch(/Harvest Rules/);
  });
});
