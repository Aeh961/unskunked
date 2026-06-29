import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoriteType = "location" | "fish" | "rig" | "knot";
export type Favorite = {
  id: string;
  type: FavoriteType;
};

export type TripResult = "Skunked" | "Unskunked" | "Great Day" | "Limited Out";

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
const demoEnabledKey = "unskunked:demo-enabled";
const profilesKey = "unskunked:demo-profiles";
const notificationsKey = "unskunked:demo-notifications";
const recommendationsKey = "unskunked:demo-recommendations";
const searchHistoryKey = "unskunked:demo-search-history";

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

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getFavorites() {
  return readJson<Favorite[]>(favoritesKey, []);
}

export async function setFavorites(favorites: Favorite[]) {
  await writeJson(favoritesKey, favorites);
  return favorites;
}

export async function toggleFavorite(favorite: Favorite) {
  const favorites = await getFavorites();
  const exists = favorites.some((item) => item.id === favorite.id && item.type === favorite.type);
  const next = exists
    ? favorites.filter((item) => !(item.id === favorite.id && item.type === favorite.type))
    : [...favorites, favorite];
  await writeJson(favoritesKey, next);
  return next;
}

export async function getTrips() {
  return readJson<TripLog[]>(tripsKey, []);
}

export async function setTrips(trips: TripLog[]) {
  await writeJson(tripsKey, trips);
  return trips;
}

export async function saveTrip(trip: TripLog) {
  const trips = await getTrips();
  const next = [trip, ...trips.filter((item) => item.id !== trip.id)];
  await writeJson(tripsKey, next);
  return next;
}

export async function isDemoModeEnabled() {
  return readJson<boolean>(demoEnabledKey, false);
}

export async function setDemoModeEnabled(enabled: boolean) {
  await writeJson(demoEnabledKey, enabled);
  if (enabled) {
    await seedDemoData();
  }
  return enabled;
}

export async function seedDemoData() {
  await Promise.all([
    setFavorites(demoFavorites),
    setTrips(demoTrips),
    writeJson(profilesKey, demoProfiles),
    writeJson(notificationsKey, demoNotifications),
    writeJson(recommendationsKey, demoRecommendations),
    writeJson(searchHistoryKey, demoSearchHistory),
    writeJson(demoEnabledKey, true)
  ]);
}

export async function getDemoProfiles() {
  return readJson<DemoProfile[]>(profilesKey, demoProfiles);
}

export async function getDemoNotifications() {
  return readJson<DemoNotification[]>(notificationsKey, demoNotifications);
}

export async function getDemoRecommendations() {
  return readJson<DemoRecommendation[]>(recommendationsKey, demoRecommendations);
}

export async function getDemoSearchHistory() {
  return readJson<string[]>(searchHistoryKey, demoSearchHistory);
}
