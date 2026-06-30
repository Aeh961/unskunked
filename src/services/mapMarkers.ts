import { shellfishLocations } from "@/src/data/shellfish";
import { ActivityType, WaterType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { Coordinates, distanceMiles } from "@/src/services/location";

export type MapMarkerKind = ActivityType;

export type UnskunkedMapMarker = {
  id: string;
  sourceId: string;
  kind: MapMarkerKind;
  name: string;
  latitude: number;
  longitude: number;
  county?: string;
  waterType: WaterType | "Beach" | "Marine Area";
  difficulty: "Easy" | "Moderate" | "Advanced";
  familyFriendly?: boolean;
  boatAccess?: boolean;
  shoreAccess?: boolean;
  distanceMiles?: number;
  subtitle: string;
};

export type MarkerFilters = {
  activity?: ActivityType | "all";
  waterType?: WaterType | "Beach" | "Marine Area" | "all";
  shoreOnly?: boolean;
  boatOnly?: boolean;
  familyFriendly?: boolean;
  query?: string;
  coordinates?: Coordinates;
};

export function getMapMarkers(filters: MarkerFilters = {}): UnskunkedMapMarker[] {
  const fishingMarkers: UnskunkedMapMarker[] = waterbodies.map((water) => ({
    id: `fishing:${water.id}`,
    sourceId: water.id,
    kind: "fishing",
    name: water.name,
    latitude: water.latitude,
    longitude: water.longitude,
    county: water.county,
    waterType: water.waterType,
    difficulty: water.beginnerDifficulty,
    familyFriendly: water.familyFriendly,
    boatAccess: water.boatLaunch,
    shoreAccess: water.bankFishing ?? true,
    subtitle: `${water.waterType} · ${water.county ?? "WA"} · ${water.beginnerDifficulty}`
  }));

  const shellfishMarkers: UnskunkedMapMarker[] = shellfishLocations.flatMap((location) =>
    location.activityTypes.map((kind) => ({
      id: `${kind}:${location.id}`,
      sourceId: location.id,
      kind,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      county: location.county,
      waterType: location.waterType,
      difficulty: location.difficulty,
      familyFriendly: location.familyFriendly,
      boatAccess: location.accessType === "Boat",
      shoreAccess: location.accessType === "Beach" || location.accessType === "Pier" || location.accessType === "Shore",
      subtitle: `${kind === "clamming" ? "Clamming" : "Crabbing"} · ${location.county} · ${location.difficulty}`
    }))
  );

  const query = filters.query?.trim().toLowerCase();
  return [...fishingMarkers, ...shellfishMarkers]
    .filter((marker) => filters.activity && filters.activity !== "all" ? marker.kind === filters.activity : true)
    .filter((marker) => filters.waterType && filters.waterType !== "all" ? marker.waterType === filters.waterType : true)
    .filter((marker) => filters.shoreOnly ? marker.shoreAccess : true)
    .filter((marker) => filters.boatOnly ? marker.boatAccess : true)
    .filter((marker) => filters.familyFriendly ? marker.familyFriendly : true)
    .filter((marker) => query ? [marker.name, marker.county, marker.waterType, marker.kind, marker.difficulty].filter(Boolean).join(" ").toLowerCase().includes(query) : true)
    .map((marker) => filters.coordinates ? { ...marker, distanceMiles: Number(distanceMiles(filters.coordinates, marker).toFixed(1)) } : marker)
    .sort((a, b) => (a.distanceMiles ?? 9999) - (b.distanceMiles ?? 9999) || a.name.localeCompare(b.name));
}

export function getMarkerTint(kind: MapMarkerKind) {
  if (kind === "clamming") return "#C96F3B";
  if (kind === "crabbing") return "#A23E48";
  return "#176B87";
}
