import type { Favorite, FeedbackEntry, TripLog, TripPlanRecord } from "@/src/utils/localStore";

export type BetaEventType = "fish-view" | "waterbody-view" | "rig-use" | "planner-choice" | "search";

export type BetaEvent = {
  id: string;
  type: BetaEventType;
  label: string;
  createdAt: string;
};

export type BetaInsights = {
  mostViewedFish: string[];
  mostViewedWaterbodies: string[];
  mostUsedRigs: string[];
  plannerChoices: string[];
  searchedTerms: string[];
  feedbackCategories: string[];
};

export function calculateBetaInsights(input: {
  events: BetaEvent[];
  searches: string[];
  feedback: FeedbackEntry[];
  trips: TripLog[];
  tripPlans: TripPlanRecord[];
  favorites: Favorite[];
}): BetaInsights {
  return {
    mostViewedFish: top(input.events.filter((event) => event.type === "fish-view").map((event) => event.label)),
    mostViewedWaterbodies: top(input.events.filter((event) => event.type === "waterbody-view").map((event) => event.label)),
    mostUsedRigs: top([
      ...input.events.filter((event) => event.type === "rig-use").map((event) => event.label),
      ...input.trips.map((trip) => trip.rig),
      ...input.tripPlans.map((plan) => plan.rigSetup),
      ...input.favorites.filter((favorite) => favorite.type === "rig").map((favorite) => favorite.id)
    ]),
    plannerChoices: top(input.events.filter((event) => event.type === "planner-choice").map((event) => event.label)),
    searchedTerms: top([...input.searches, ...input.events.filter((event) => event.type === "search").map((event) => event.label)]),
    feedbackCategories: top(input.feedback.map((entry) => entry.type))
  };
}

function top(values: string[], limit = 5) {
  const counts = values.filter(Boolean).reduce<Record<string, number>>((memo, value) => {
    memo[value] = (memo[value] ?? 0) + 1;
    return memo;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value]) => value);
}
