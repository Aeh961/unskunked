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

const favoritesKey = "unskunked:favorites";
const tripsKey = "unskunked:trips";

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

export async function saveTrip(trip: TripLog) {
  const trips = await getTrips();
  const next = [trip, ...trips.filter((item) => item.id !== trip.id)];
  await writeJson(tripsKey, next);
  return next;
}
