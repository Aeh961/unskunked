import { ActivityType } from "@/src/data/types";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { Coordinates, distanceMiles } from "@/src/services/location";
import { calculateTripScore, getMockWeather, getTideSnapshot } from "@/src/services/fishingConditions";

export function buildShellfishPlan(input: { activityType: Extract<ActivityType, "clamming" | "crabbing">; coordinates: Coordinates; experience: "Beginner" | "Intermediate" | "Advanced" }) {
  const locations = shellfishLocations
    .filter((location) => location.activityTypes.includes(input.activityType))
    .map((location) => ({ ...location, distanceMiles: Number(distanceMiles(input.coordinates, location).toFixed(1)) }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
  const location = locations[0] ?? shellfishLocations[0];
  const species = shellfishSpecies.find((item) => item.activityType === input.activityType);
  const weather = getMockWeather({ waterType: location.waterType === "Pier" ? "Pier" : "Saltwater", region: location.region });
  const tide = getTideSnapshot({ waterType: location.waterType === "Pier" ? "Pier" : "Saltwater" });
  const score = calculateTripScore({
    activityType: input.activityType,
    weather,
    tide,
    distanceMiles: location.distanceMiles,
    userExperience: input.experience,
    waterbody: {
      waterType: "Saltwater",
      beginnerDifficulty: location.difficulty,
      bestSeason: location.seasonNotes
    },
    targetSpecies: species?.name
  });

  return {
    location,
    species,
    weather,
    tide,
    score,
    bestTime: input.activityType === "clamming" ? `Low tide window near ${tide?.low ?? "posted low tide"}` : `${tide?.movement ?? "Moving"} tide around ${tide?.high ?? "posted high tide"}`,
    whatToBring: location.gearChecklist,
    regulationReminders: location.harvestNotes,
    safetyNotes: location.safetyWarnings,
    explanation: input.activityType === "clamming"
      ? "Clamming improves when low tide exposes legal beach. Verify beach health status first."
      : "Crabbing improves around moving tide with legal gear, correct gauge, and area-season verification."
  };
}
