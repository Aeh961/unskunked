import { FishSpecies, Waterbody } from "@/src/data/types";
import { TripLog, TripPlanRecord } from "@/src/utils/localStore";

export async function shareText(message: string, title = "Unskunked") {
  const { Share } = await import("react-native");
  return Share.share({ title, message });
}

export function formatTripPlanShare(plan: Pick<TripPlanRecord, "location" | "targetSpecies" | "rigSetup" | "knot" | "baitChecklist">) {
  const bait = plan.baitChecklist[0] ?? "simple bait";
  return `Unskunked helped me plan a ${plan.targetSpecies.toLowerCase()} trip at ${plan.location} using ${plan.rigSetup}, ${bait}, and ${plan.knot}.`;
}

export function formatFishShare(fish: FishSpecies) {
  return `Unskunked tip: target ${fish.name} during ${fish.bestSeason.toLowerCase()} with ${fish.bestBait[0]} and a ${fish.rigs[0]}. Verify official rules before keeping fish.`;
}

export function formatWaterbodyShare(water: Waterbody) {
  return `Unskunked waterbody pick: ${water.name}. Try ${water.suggestedBait[0]} with ${water.recommendedRigs[0]}. Regulation reminder: ${water.regulationSummary}`;
}

export function formatTripLogShare(trip: TripLog) {
  return `Unskunked trip log: ${trip.result} at ${trip.location}. Caught ${trip.numberCaught} ${trip.speciesCaught} using ${trip.bait} and ${trip.rig}.`;
}

export function formatJsonExport(data: unknown) {
  return JSON.stringify(data, null, 2);
}
