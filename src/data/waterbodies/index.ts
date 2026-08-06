import { RegionId } from "@/src/data/regions";
import { Waterbody } from "@/src/data/types";
import { floridaWaterbodies } from "@/src/data/waterbodies/florida";
import { ronnebyWaterbodies } from "@/src/data/waterbodies/ronneby";
import { washingtonWaterbodies } from "@/src/data/waterbodies/washington";

export const waterbodiesByRegion: Partial<Record<RegionId, Waterbody[]>> = {
  washington: washingtonWaterbodies,
  florida: floridaWaterbodies,
  ronneby: ronnebyWaterbodies
};

export function getWaterbodiesForRegion(region: RegionId): Waterbody[] {
  return waterbodiesByRegion[region] ?? [];
}

/** All bundled waterbodies across every region. Region-facing screens should use getWaterbodiesForRegion instead. */
export const waterbodies: Waterbody[] = [...washingtonWaterbodies, ...floridaWaterbodies, ...ronnebyWaterbodies];
