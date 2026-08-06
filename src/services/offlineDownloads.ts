import { getSpeciesForRegion } from "@/src/data/fish";
import { getRegion, RegionId } from "@/src/data/regions";
import { getWaterbodiesForRegion } from "@/src/data/waterbodies";

export type OfflinePackType = "Entire Region" | "County" | "Region" | "Species";

export type OfflinePack = {
  id: string;
  type: OfflinePackType;
  label: string;
  waterbodyCount: number;
  speciesCount: number;
  estimatedSizeMb: number;
};

export function getOfflinePacks(region: RegionId = "washington"): OfflinePack[] {
  const regionWaterbodies = getWaterbodiesForRegion(region);
  const regionSpecies = getSpeciesForRegion(region);
  const counties = [...new Set(regionWaterbodies.map((water) => water.county ?? "Unknown"))].slice(0, 8);
  return [
    {
      id: region,
      type: "Entire Region",
      label: `Entire ${getRegion(region).name}`,
      waterbodyCount: regionWaterbodies.length,
      speciesCount: regionSpecies.length,
      estimatedSizeMb: 24
    },
    ...counties.map((county) => ({
      id: `county-${county.toLowerCase().replaceAll(" ", "-")}`,
      type: "County" as const,
      label: `${county} County`,
      waterbodyCount: regionWaterbodies.filter((water) => water.county === county).length,
      speciesCount: regionSpecies.length,
      estimatedSizeMb: 4
    })),
    {
      id: "species-trout",
      type: "Species",
      label: "Trout starter pack",
      waterbodyCount: regionWaterbodies.filter((water) => water.speciesIds.some((id) => id.includes("trout"))).length,
      speciesCount: regionSpecies.filter((fish) => fish.name.includes("Trout")).length,
      estimatedSizeMb: 3
    }
  ];
}
