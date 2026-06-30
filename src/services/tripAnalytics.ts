import { TripLog } from "@/src/utils/localStore";

export type TripAnalytics = {
  totalTrips: number;
  skunkedTrips: number;
  unskunkedTrips: number;
  unskunkedRatio: number;
  bestLocations: string[];
  bestBait: string[];
  bestRigs: string[];
  bestTimeOfDay: string;
  mostCaughtSpecies: string[];
  monthlyActivity: Array<{ month: string; trips: number }>;
  personalRecords: Array<{ label: string; value: string }>;
};

export function calculateTripAnalytics(trips: TripLog[]): TripAnalytics {
  const successful = trips.filter((trip) => trip.result !== "Skunked" && trip.numberCaught > 0);
  const monthlyCounts = countBy(trips.map((trip) => trip.date.slice(0, 7) || "Unknown"));
  const biggestTrip = [...trips].sort((a, b) => b.numberCaught - a.numberCaught)[0];

  return {
    totalTrips: trips.length,
    skunkedTrips: trips.filter((trip) => trip.result === "Skunked").length,
    unskunkedTrips: successful.length,
    unskunkedRatio: trips.length ? Math.round((successful.length / trips.length) * 100) : 0,
    bestLocations: topValues(successful.map((trip) => trip.location)),
    bestBait: topValues(successful.map((trip) => trip.bait)),
    bestRigs: topValues(successful.map((trip) => trip.rig)),
    bestTimeOfDay: inferBestTime(successful),
    mostCaughtSpecies: topValues(successful.map((trip) => trip.speciesCaught)),
    monthlyActivity: Object.entries(monthlyCounts).map(([month, count]) => ({ month, trips: count })),
    personalRecords: [
      { label: "Most fish in one trip", value: biggestTrip ? `${biggestTrip.numberCaught} at ${biggestTrip.location}` : "Not enough data" },
      { label: "Best result", value: trips.find((trip) => trip.result === "Limited Out")?.location ?? trips.find((trip) => trip.result === "Great Day")?.location ?? "Not enough data" }
    ]
  };
}

function inferBestTime(trips: TripLog[]) {
  const text = trips.map((trip) => `${trip.weather} ${trip.notes}`.toLowerCase()).join(" ");
  if (text.includes("morning") || text.includes("am") || text.includes("dawn")) return "Morning";
  if (text.includes("sunset") || text.includes("evening") || text.includes("pm")) return "Evening";
  return trips.length ? "Midday or not logged" : "Not enough data";
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((memo, value) => {
    const key = value.trim() || "Unknown";
    memo[key] = (memo[key] ?? 0) + 1;
    return memo;
  }, {});
}

function topValues(values: string[], limit = 3) {
  return Object.entries(countBy(values.filter((value) => value && value !== "Not logged" && value !== "None")))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value]) => value);
}
