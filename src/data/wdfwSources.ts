export const wdfwDataUpdated = "May 2026";

export const wdfwSourceNames = {
  regulations: "WDFW fishing regulations",
  emergencyRules: "WDFW emergency fishing and shellfishing rules",
  shellfishSeaweed: "WDFW shellfish and seaweed regulations",
  marineAreas: "WDFW marine area resources",
  stocking: "WDFW fish stocking reports",
  fishWashington: "WDFW Fish Washington / places to go fishing",
  waterAccess: "WDFW water access areas"
};

export function makeWdfwWaterbodyId(id: string) {
  return `WDFW-WA-${id.toUpperCase().replaceAll("-", "_")}`;
}
