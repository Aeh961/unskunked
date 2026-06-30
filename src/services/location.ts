import { WaterType, Waterbody } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LocationState =
  | { status: "idle"; coordinates?: Coordinates; message: string }
  | { status: "granted"; coordinates: Coordinates; message: string }
  | { status: "denied"; coordinates: Coordinates; message: string }
  | { status: "unavailable"; coordinates: Coordinates; message: string };

export type NearbyWaterbody = Waterbody & {
  distanceMiles: number;
};

export const manualLocations = [
  { id: "seattle", label: "Seattle", coordinates: { latitude: 47.6062, longitude: -122.3321 } },
  { id: "tacoma", label: "Tacoma", coordinates: { latitude: 47.2529, longitude: -122.4443 } },
  { id: "spokane", label: "Spokane", coordinates: { latitude: 47.6588, longitude: -117.426 } },
  { id: "yakima", label: "Yakima", coordinates: { latitude: 46.6021, longitude: -120.5059 } },
  { id: "wenatchee", label: "Wenatchee", coordinates: { latitude: 47.4235, longitude: -120.3103 } }
] as const;

export const defaultManualLocation = manualLocations[0];

export function distanceMiles(from: Coordinates, to: Coordinates) {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearbyWaterbodies(coordinates: Coordinates, options: { waterType?: WaterType | "All"; beginnerOnly?: boolean; limit?: number } = {}): NearbyWaterbody[] {
  return waterbodies
    .filter((water) => (options.waterType && options.waterType !== "All" ? water.waterType === options.waterType : true))
    .filter((water) => (options.beginnerOnly ? water.beginnerDifficulty === "Easy" || water.shoreAccessDifficulty === "Easy" : true))
    .map((water) => ({
      ...water,
      distanceMiles: Number(distanceMiles(coordinates, { latitude: water.latitude, longitude: water.longitude }).toFixed(1))
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, options.limit ?? waterbodies.length);
}

export function getNearestBeginnerWaterbody(coordinates: Coordinates) {
  return getNearbyWaterbodies(coordinates, { beginnerOnly: true, limit: 1 })[0] ?? getNearbyWaterbodies(coordinates, { limit: 1 })[0];
}

export async function requestExpoLocation(): Promise<LocationState> {
  try {
    const Location = await import("expo-location");
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      return {
        status: "denied",
        coordinates: defaultManualLocation.coordinates,
        message: "Location permission was denied. Using Seattle as a manual fallback."
      };
    }
    const current = await Location.getCurrentPositionAsync({});
    return {
      status: "granted",
      coordinates: {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude
      },
      message: "Using your current location for nearby recommendations."
    };
  } catch {
    return {
      status: "unavailable",
      coordinates: defaultManualLocation.coordinates,
      message: "Location is unavailable on this device right now. Using Seattle as a fallback."
    };
  }
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
