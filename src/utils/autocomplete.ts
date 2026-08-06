import { fishSpecies } from "@/src/data/fish";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { waterbodies } from "@/src/data/waterbodies";
import { normalizeSearch, scoreSearchItem } from "@/src/utils/search";

export type Suggestion = {
  id: string;
  kind: "Fish" | "Shellfish" | "Water" | "Activity";
  label: string;
  subtitle: string;
  route: string;
};

const activitySuggestions: Array<Suggestion & { keywords: string[] }> = [
  {
    id: "activity-fishing",
    kind: "Activity",
    label: "Fishing",
    subtitle: "Rivers, lakes, piers, saltwater",
    route: "/trips?activityType=fishing",
    keywords: ["fish", "fishing", "rod", "cast", "trout", "salmon", "bass"]
  },
  {
    id: "activity-crabbing",
    kind: "Activity",
    label: "Crabbing",
    subtitle: "Pots, rings, piers",
    route: "/trips?activityType=crabbing",
    keywords: ["crab", "crabbing", "pot", "ring", "dungeness"]
  },
  {
    id: "activity-clamming",
    kind: "Activity",
    label: "Clamming",
    subtitle: "Beaches, tides, digging",
    route: "/trips?activityType=clamming",
    keywords: ["clam", "clamming", "dig", "digging", "razor"]
  }
];

/**
 * Ranked, cross-catalog autocomplete for the typed "what are you going after?"
 * inputs. Returns `[]` for an empty query - callers must not render a dropdown
 * before the user has typed anything.
 */
export function getSuggestions(query: string, { limit = 6 }: { limit?: number } = {}): Suggestion[] {
  const trimmed = normalizeSearch(query);
  if (!trimmed) return [];

  const fishResults = fishSpecies
    .map((fish) => ({ fish, score: scoreSearchItem(fish, trimmed, [(item) => item.name, (item) => item.bestBait, (item) => item.rigs]) }))
    .filter((result) => result.score > 0)
    .map((result) => ({
      id: `fish-${result.fish.id}`,
      kind: "Fish" as const,
      label: result.fish.name,
      subtitle: `${result.fish.difficulty} · ${result.fish.bestSeason}`,
      route: `/fish/${result.fish.id}`,
      score: result.score
    }));

  const shellfishResults = shellfishSpecies
    .map((item) => ({ item, score: scoreSearchItem(item, trimmed, [(entry) => entry.name, (entry) => entry.habitat, (entry) => entry.gear]) }))
    .filter((result) => result.score > 0)
    .map((result) => ({
      id: `shellfish-${result.item.id}`,
      kind: "Shellfish" as const,
      label: result.item.name,
      subtitle: `${result.item.activityType} · ${result.item.difficulty}`,
      route: `/trips?activityType=${result.item.activityType}&targetShellfishId=${result.item.id}`,
      score: result.score
    }));

  const waterResults = waterbodies
    .map((water) => ({
      water,
      score: scoreSearchItem(water, trimmed, [
        (item) => item.name,
        (item) => item.region,
        (item) => item.county ?? "",
        (item) => item.city ?? "",
        (item) => item.waterType
      ])
    }))
    .filter((result) => result.score > 0)
    .map((result) => ({
      id: `water-${result.water.id}`,
      kind: "Water" as const,
      label: result.water.name,
      subtitle: `${result.water.county ?? result.water.region} · ${result.water.waterType}`,
      route: `/map?waterbodyId=${result.water.id}`,
      score: result.score
    }));

  const shellfishLocationResults = shellfishLocations
    .map((location) => ({
      location,
      score: scoreSearchItem(location, trimmed, [(item) => item.name, (item) => item.county, (item) => item.region, (item) => item.activityTypes])
    }))
    .filter((result) => result.score > 0)
    .map((result) => ({
      id: `shellfish-location-${result.location.id}`,
      kind: "Water" as const,
      label: result.location.name,
      subtitle: `${result.location.county} · ${result.location.activityTypes.join("/")}`,
      route: `/map?shellfishLocationId=${result.location.id}`,
      score: result.score
    }));

  const activityResults = activitySuggestions
    .map((activity) => ({
      id: activity.id,
      kind: activity.kind,
      label: activity.label,
      subtitle: activity.subtitle,
      route: activity.route,
      score: scoreSearchItem(activity, trimmed, [(item) => item.label, (item) => item.keywords])
    }))
    .filter((result) => result.score > 0);

  return [...fishResults, ...shellfishResults, ...waterResults, ...shellfishLocationResults, ...activityResults]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...suggestion }) => suggestion);
}
