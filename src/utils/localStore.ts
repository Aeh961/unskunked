import { RegionId } from "@/src/data/regions";
import { storage } from "@/src/utils/storage";

export type FavoriteType = "location" | "fish" | "rig" | "knot";
export type Favorite = {
  id: string;
  type: FavoriteType;
};

export type TripResult = "Skunked" | "Unskunked" | "Great Day" | "Limited Out";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type TripLog = {
  id: string;
  location: string;
  date: string;
  weather: string;
  speciesCaught: string;
  numberCaught: number;
  bait: string;
  rig: string;
  notes: string;
  result: TripResult;
};

export type TripPlanRecord = {
  id: string;
  createdAt: string;
  location: string;
  targetSpecies: string;
  regulationSummary: string;
  gearChecklist: string[];
  baitChecklist: string[];
  rigSetup: string;
  knot: string;
  bestTime: string;
  safetyReminder: string;
  backupPlan: string;
  youtubeLinks: string[];
};

export type OnboardingProfile = {
  experience: ExperienceLevel;
  preferredStyle: "Shore" | "Boat" | "Dock" | "River" | "Saltwater";
  favoriteFishIds: string[];
  favoriteWaterbodyIds: string[];
};

export type FeedbackType =
  | "Bug report"
  | "Feature request"
  | "Confusing regulation"
  | "Wrong fish recommendation"
  | "Wrong waterbody info"
  | "General feedback";

export type FeedbackEntry = {
  id: string;
  createdAt: string;
  type: FeedbackType;
  screen: string;
  message: string;
};

export type DemoProfile = {
  id: string;
  label: string;
  experience: "Beginner" | "Intermediate";
  homeWater: string;
  favoriteTarget: string;
  preferredRig: string;
};

export type DemoNotification = {
  id: string;
  title: string;
  body: string;
};

export type DemoRecommendation = {
  id: string;
  title: string;
  body: string;
};

const favoritesKey = "unskunked:favorites";
const tripsKey = "unskunked:trips";
const tripPlansKey = "unskunked:trip-plans";
const onboardingProfileKey = "unskunked:onboarding-profile";
const feedbackKey = "unskunked:feedback";
const demoEnabledKey = "unskunked:demo-enabled";
const profilesKey = "unskunked:demo-profiles";
const notificationsKey = "unskunked:demo-notifications";
const recommendationsKey = "unskunked:demo-recommendations";
const searchHistoryKey = "unskunked:demo-search-history";
const selectedRegionKey = "unskunked:selected-region";

export const demoFavorites: Favorite[] = [
  { type: "location", id: "green-lake" },
  { type: "location", id: "lake-washington" },
  { type: "location", id: "edmonds-pier" },
  { type: "fish", id: "rainbow-trout" },
  { type: "fish", id: "yellow-perch" },
  { type: "fish", id: "smallmouth-bass" },
  { type: "rig", id: "bobber-rig" },
  { type: "rig", id: "drop-shot-rig" },
  { type: "knot", id: "palomar-knot" },
  { type: "knot", id: "improved-clinch-knot" }
];

export const demoTrips: TripLog[] = [
  {
    id: "demo-trip-1",
    location: "Green Lake",
    date: "2026-06-21",
    weather: "Cool morning, light chop",
    speciesCaught: "Rainbow Trout",
    numberCaught: 2,
    bait: "PowerBait",
    rig: "Trout PowerBait rig",
    notes: "Both bites came within 30 feet of the swim beach before 8 AM.",
    result: "Unskunked"
  },
  {
    id: "demo-trip-2",
    location: "Lake Washington",
    date: "2026-06-24",
    weather: "Sunny, warm, calm",
    speciesCaught: "Yellow Perch",
    numberCaught: 7,
    bait: "Worms",
    rig: "Bobber rig",
    notes: "Tiny worm pieces near docks. Stayed after the first bite and found the school.",
    result: "Great Day"
  },
  {
    id: "demo-trip-3",
    location: "Lake Sammamish",
    date: "2026-06-27",
    weather: "Bright sun, afternoon wind",
    speciesCaught: "None",
    numberCaught: 0,
    bait: "Soft plastics",
    rig: "Drop shot rig",
    notes: "Started too late. Next time fish rocky shade earlier and slow down.",
    result: "Skunked"
  }
];

export const demoProfiles: DemoProfile[] = [
  {
    id: "beginner",
    label: "Beginner profile",
    experience: "Beginner",
    homeWater: "Green Lake",
    favoriteTarget: "Rainbow Trout",
    preferredRig: "Bobber rig"
  },
  {
    id: "intermediate",
    label: "Intermediate profile",
    experience: "Intermediate",
    homeWater: "Lake Washington",
    favoriteTarget: "Smallmouth Bass",
    preferredRig: "Drop shot rig"
  }
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "morning-window",
    title: "Morning bite window",
    body: "Green Lake should fish best before 9 AM with PowerBait or worms."
  },
  {
    id: "rules-reminder",
    title: "Rules check",
    body: "Verify the exact waterbody listing before keeping fish today."
  }
];

export const demoRecommendations: DemoRecommendation[] = [
  {
    id: "today",
    title: "Today at Green Lake",
    body: "Start with a bobber rig and worm near weed edges, then switch to PowerBait if trout are cruising deeper."
  },
  {
    id: "backup",
    title: "Backup plan",
    body: "If you go 20 minutes without bites, downsize your hook and move to shade, docks, or a wind-blown bank."
  }
];

export const demoSearchHistory = ["Green Lake trout", "Lake Washington perch", "bobber rig", "Palomar knot", "Seattle beginner fishing"];

export const demoOnboardingProfile: OnboardingProfile = {
  experience: "Beginner",
  preferredStyle: "Shore",
  favoriteFishIds: ["rainbow-trout", "yellow-perch"],
  favoriteWaterbodyIds: ["green-lake", "lake-washington"]
};

export const demoTripPlans: TripPlanRecord[] = [
  {
    id: "demo-plan-green-lake",
    createdAt: "2026-06-29T07:30:00.000Z",
    location: "Green Lake",
    targetSpecies: "Rainbow Trout",
    regulationSummary: "Mock summary: stocked trout and warmwater options. Verify WDFW before keeping fish.",
    gearChecklist: ["Light spinning rod", "4-6 lb mono", "Pliers", "License"],
    baitChecklist: ["PowerBait", "Worms", "Small spinners"],
    rigSetup: "Trout PowerBait rig",
    knot: "Improved Clinch Knot",
    bestTime: "Before 9 AM",
    safetyReminder: "Bring water, sun protection, and release fish gently if rules are unclear.",
    backupPlan: "If trout do not bite in 20 minutes, switch to a worm under a bobber near weed edges.",
    youtubeLinks: ["beginner trout PowerBait rig", "Green Lake trout fishing"]
  }
];

export async function getFavorites() {
  return storage.readJson<Favorite[]>(favoritesKey, []);
}

export async function setFavorites(favorites: Favorite[]) {
  await storage.writeJson(favoritesKey, favorites);
  return favorites;
}

export async function toggleFavorite(favorite: Favorite) {
  const favorites = await getFavorites();
  const exists = favorites.some((item) => item.id === favorite.id && item.type === favorite.type);
  const next = exists
    ? favorites.filter((item) => !(item.id === favorite.id && item.type === favorite.type))
    : [...favorites, favorite];
  await storage.writeJson(favoritesKey, next);
  return next;
}

export async function getTrips() {
  return storage.readJson<TripLog[]>(tripsKey, []);
}

export async function setTrips(trips: TripLog[]) {
  await storage.writeJson(tripsKey, trips);
  return trips;
}

export async function saveTrip(trip: TripLog) {
  const trips = await getTrips();
  const next = [trip, ...trips.filter((item) => item.id !== trip.id)];
  await storage.writeJson(tripsKey, next);
  return next;
}

export async function getTripPlans() {
  return storage.readJson<TripPlanRecord[]>(tripPlansKey, []);
}

export async function saveTripPlan(plan: TripPlanRecord) {
  const plans = await getTripPlans();
  const next = [plan, ...plans.filter((item) => item.id !== plan.id)];
  await storage.writeJson(tripPlansKey, next);
  return next;
}

export async function getOnboardingProfile() {
  return storage.readJson<OnboardingProfile>(onboardingProfileKey, demoOnboardingProfile);
}

export async function setOnboardingProfile(profile: OnboardingProfile) {
  return storage.writeJson(onboardingProfileKey, profile);
}

export async function getFeedback() {
  return storage.readJson<FeedbackEntry[]>(feedbackKey, []);
}

export async function saveFeedback(entry: FeedbackEntry) {
  const feedback = await getFeedback();
  const next = [entry, ...feedback.filter((item) => item.id !== entry.id)];
  await storage.writeJson(feedbackKey, next);
  return next;
}

export async function getBetaExportData() {
  const [favorites, trips, tripPlans, feedback, profile, region, searchHistory] = await Promise.all([
    getFavorites(),
    getTrips(),
    getTripPlans(),
    getFeedback(),
    getOnboardingProfile(),
    getSelectedRegion(),
    getDemoSearchHistory()
  ]);
  return {
    exportedAt: new Date().toISOString(),
    app: "Unskunked",
    version: "0.1.0",
    selectedRegion: region,
    profile,
    favorites,
    tripPlans,
    tripLogs: trips,
    feedback,
    recentSearches: searchHistory
  };
}

export async function getSelectedRegion() {
  return storage.readJson<RegionId>(selectedRegionKey, "washington");
}

export async function setSelectedRegion(region: RegionId) {
  return storage.writeJson(selectedRegionKey, region);
}

export async function saveRecentSearch(query: string) {
  const clean = query.trim();
  if (!clean) return getDemoSearchHistory();
  const history = await getDemoSearchHistory();
  const next = [clean, ...history.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 12);
  await storage.writeJson(searchHistoryKey, next);
  return next;
}

export async function isDemoModeEnabled() {
  return storage.readJson<boolean>(demoEnabledKey, false);
}

export async function setDemoModeEnabled(enabled: boolean) {
  await storage.writeJson(demoEnabledKey, enabled);
  if (enabled) {
    await seedDemoData();
  }
  return enabled;
}

export async function seedDemoData() {
  await Promise.all([
    setFavorites(demoFavorites),
    setTrips(demoTrips),
    storage.writeJson(tripPlansKey, demoTripPlans),
    storage.writeJson(onboardingProfileKey, demoOnboardingProfile),
    storage.writeJson(selectedRegionKey, "washington" satisfies RegionId),
    storage.writeJson(profilesKey, demoProfiles),
    storage.writeJson(notificationsKey, demoNotifications),
    storage.writeJson(recommendationsKey, demoRecommendations),
    storage.writeJson(searchHistoryKey, demoSearchHistory),
    storage.writeJson(demoEnabledKey, true)
  ]);
}

export async function getDemoProfiles() {
  return storage.readJson<DemoProfile[]>(profilesKey, demoProfiles);
}

export async function getDemoNotifications() {
  return storage.readJson<DemoNotification[]>(notificationsKey, demoNotifications);
}

export async function getDemoRecommendations() {
  return storage.readJson<DemoRecommendation[]>(recommendationsKey, demoRecommendations);
}

export async function getDemoSearchHistory() {
  return storage.readJson<string[]>(searchHistoryKey, demoSearchHistory);
}
