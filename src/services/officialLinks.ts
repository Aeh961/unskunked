import { Waterbody } from "@/src/data/types";

export type OfficialSourceLinks = {
  regulations: string;
  emergencyRules: string;
  licenses: string;
  fishWashington: string;
  shellfishSeaweed: string;
  marineAreas: string;
  freshwaterRules: string;
};

export const wdfwLinks: OfficialSourceLinks = {
  regulations: "https://wdfw.wa.gov/fishing/regulations",
  emergencyRules: "https://wdfw.wa.gov/fishing/regulations/emergency-rules",
  licenses: "https://wdfw.wa.gov/licenses/fishing",
  fishWashington: "https://wdfw.wa.gov/fishing/locations",
  shellfishSeaweed: "https://wdfw.wa.gov/fishing/shellfishing-regulations",
  marineAreas: "https://wdfw.wa.gov/fishing/management/marine-areas",
  freshwaterRules: "https://wdfw.wa.gov/fishing/regulations/freshwater"
};

export function getOfficialLinksForWaterbody(waterbody?: Pick<Waterbody, "waterType" | "officialLink">): OfficialSourceLinks {
  return {
    ...wdfwLinks,
    fishWashington: waterbody?.officialLink ?? wdfwLinks.fishWashington
  };
}

export function getOfficialVerificationCopy(waterbody?: Pick<Waterbody, "name" | "waterType">) {
  const subject = waterbody ? `${waterbody.name} (${waterbody.waterType})` : "this water";
  return `Use Unskunked for planning only. Verify current WDFW rules, emergency rules, license requirements, seasons, limits, closures, and gear restrictions for ${subject} before fishing or keeping fish.`;
}
