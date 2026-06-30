import { fishSpecies } from "@/src/data/fish";
import { waterbodies } from "@/src/data/waterbodies";

export type OfflinePackType = "Entire Washington" | "County" | "Region" | "Species";

export type OfflinePack = {
  id: string;
  type: OfflinePackType;
  label: string;
  waterbodyCount: number;
  speciesCount: number;
  estimatedSizeMb: number;
};

export function getOfflinePacks(): OfflinePack[] {
  const counties = [...new Set(waterbodies.map((water) => water.county ?? "Unknown"))].slice(0, 8);
  return [
    {
      id: "washington",
      type: "Entire Washington",
      label: "Entire Washington",
      waterbodyCount: waterbodies.length,
      speciesCount: fishSpecies.length,
      estimatedSizeMb: 24
    },
    ...counties.map((county) => ({
      id: `county-${county.toLowerCase().replaceAll(" ", "-")}`,
      type: "County" as const,
      label: `${county} County`,
      waterbodyCount: waterbodies.filter((water) => water.county === county).length,
      speciesCount: fishSpecies.length,
      estimatedSizeMb: 4
    })),
    {
      id: "species-trout",
      type: "Species",
      label: "Trout starter pack",
      waterbodyCount: waterbodies.filter((water) => water.speciesIds.some((id) => id.includes("trout"))).length,
      speciesCount: fishSpecies.filter((fish) => fish.name.includes("Trout")).length,
      estimatedSizeMb: 3
    }
  ];
}
