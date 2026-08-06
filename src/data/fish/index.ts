import { RegionId } from "@/src/data/regions";
import { floridaFishSpecies } from "@/src/data/fish/florida";
import { ronnebyFishSpecies } from "@/src/data/fish/ronneby";
import { washingtonFishSpecies } from "@/src/data/fish/washington";
import { FishSpecies } from "@/src/data/types";

export const fishSpeciesByRegion: Partial<Record<RegionId, FishSpecies[]>> = {
  washington: washingtonFishSpecies,
  florida: floridaFishSpecies,
  ronneby: ronnebyFishSpecies
};

export function getSpeciesForRegion(region: RegionId): FishSpecies[] {
  return fishSpeciesByRegion[region] ?? [];
}

/** All bundled fish species across every region. Region-facing screens should use getSpeciesForRegion instead. */
export const fishSpecies: FishSpecies[] = [...washingtonFishSpecies, ...floridaFishSpecies, ...ronnebyFishSpecies];
