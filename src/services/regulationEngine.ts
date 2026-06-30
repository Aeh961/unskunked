import { fishSpecies } from "@/src/data/fish";
import { Waterbody } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { regulationService } from "@/src/services/regulations";

export type RegulationBadgeTone = "good" | "caution" | "bad";

export type RegulationBadge = {
  label: string;
  tone: RegulationBadgeTone;
};

export type CurrentRegulations = {
  status: "open" | "closed" | "restricted";
  season: string;
  catchLimits: string[];
  baitRestrictions: string[];
  emergencyRules: string[];
  badges: RegulationBadge[];
  dataLastUpdated: string;
  source: string;
};

export function getCurrentRegulations(input: { waterbodyId: string; speciesId?: string; date?: string }): CurrentRegulations {
  const water = waterbodies.find((item) => item.id === input.waterbodyId);
  const speciesId = input.speciesId ?? water?.speciesIds[0];
  const fish = fishSpecies.find((item) => item.id === speciesId);
  const summary = regulationService.getSummary({ state: "WA", waterbodyId: input.waterbodyId, speciesId, date: input.date });
  const baitRestrictions = inferBaitRestrictions(water, fish?.id);
  const catchLimit = fish?.regulation.dailyLimit ?? summary.dailyLimit;
  const status = summary.status;

  return {
    status,
    season: fish?.regulation.season ?? summary.season,
    catchLimits: [catchLimit, fish?.regulation.sizeLimit ?? summary.sizeLimit].filter(Boolean),
    baitRestrictions,
    emergencyRules: [summary.emergencyRulePlaceholder, ...summary.warningMessages],
    badges: [
      { label: status === "open" ? "Open" : status === "closed" ? "Closed" : "Restricted", tone: status === "open" ? "good" : status === "closed" ? "bad" : "caution" },
      ...baitRestrictions.map((label) => ({ label, tone: "caution" as const })),
      { label: formatLimitBadge(catchLimit), tone: "good" },
      { label: "Verify emergency rules", tone: "caution" }
    ],
    dataLastUpdated: water?.lastUpdated ?? "May 2026",
    source: water?.source ?? "WDFW public regulation, stocking, and water access pages"
  };
}

function inferBaitRestrictions(water?: Waterbody, speciesId?: string) {
  if (!water) return ["Verify bait rules"];
  if (water.waterType === "River" && water.status === "restricted") return ["Artificial lures only"];
  if (water.waterType === "Saltwater" || water.waterType === "Pier") return ["Marine area rules apply"];
  if (speciesId === "kokanee") return ["Scent/bait rules vary"];
  return ["Bait allowed where legal"];
}

function formatLimitBadge(limit: string) {
  if (/5 trout/i.test(limit)) return "Trout Limit 5";
  if (/release/i.test(limit)) return "Catch and release";
  return limit.length > 28 ? "Limits vary" : limit;
}
