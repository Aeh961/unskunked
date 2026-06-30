import { Href, Link } from "expo-router";
import { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { ActivityType, WaterType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { useFavorites } from "@/src/hooks/useFavorites";
import { colors, radii, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";
import { regulationService } from "@/src/services/regulations";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { Coordinates, defaultManualLocation, getNearbyWaterbodies, manualLocations, requestExpoLocation } from "@/src/services/location";
import { formatWaterbodyShare, shareText } from "@/src/utils/share";
import { trackBetaEvent } from "@/src/utils/localStore";
import { getMapMarkers, getMarkerTint } from "@/src/services/mapMarkers";

const filters: Array<WaterType | "All"> = ["All", "Lake", "River", "Saltwater", "Park", "Pier"];
const activityFilters: Array<ActivityType | "all"> = ["all", "fishing", "clamming", "crabbing"];

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WaterType | "All">("All");
  const [activityFilter, setActivityFilter] = useState<ActivityType | "all">("all");
  const [selectedId, setSelectedId] = useState(waterbodies[0].id);
  const [selectedShellfishId, setSelectedShellfishId] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([waterbodies[0].id]);
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultManualLocation.coordinates);
  const [locationMessage, setLocationMessage] = useState("Using Seattle as the manual nearby fallback.");
  const [locationStatus, setLocationStatus] = useState<"idle" | "granted" | "denied" | "unavailable">("idle");
  const { isFavorite, toggle } = useFavorites();

  const filtered = useMemo(() => {
    const nearby = getNearbyWaterbodies(coordinates, { waterType: filter });
    return searchByFields(nearby, query, [
      (water) => water.name,
      (water) => water.region,
      (water) => water.county ?? "",
      (water) => water.waterType,
      (water) => water.notes,
      (water) => water.suggestedBait,
      (water) => water.recommendedRigs
    ]);
  }, [coordinates, filter, query]);

  const markers = useMemo(() => getMapMarkers({
    activity: activityFilter,
    waterType: filter === "All" ? "all" : filter,
    query,
    coordinates
  }), [activityFilter, coordinates, filter, query]);

  const selected = filtered.find((water) => water.id === selectedId) ?? filtered[0] ?? waterbodies[0];
  const selectedShellfishLocation = selectedShellfishId ? shellfishLocations.find((location) => location.id === selectedShellfishId) : null;
  const selectedShellfishTargets = selectedShellfishLocation
    ? shellfishSpecies.filter((speciesItem) => selectedShellfishLocation.activityTypes.includes(speciesItem.activityType))
    : [];
  const mapRegion = {
    latitude: selectedShellfishLocation?.latitude ?? selected.latitude,
    longitude: selectedShellfishLocation?.longitude ?? selected.longitude,
    latitudeDelta: 0.95,
    longitudeDelta: 0.95
  };
  const species = selected.speciesIds
    .map((id) => fishSpecies.find((fish) => fish.id === id)?.name)
    .filter(Boolean);
  const regulation = regulationService.getSummary({ state: "WA", waterbodyId: selected.id, date: new Date().toISOString() });
  const currentRegulations = getCurrentRegulations({ waterbodyId: selected.id, date: new Date().toISOString() });

  function openDirections() {
    const url = `https://maps.apple.com/?q=${encodeURIComponent(selected.name)}&ll=${selected.latitude},${selected.longitude}`;
    Linking.openURL(url);
  }

  function selectWater(id: string) {
    setSelectedId(id);
    setSelectedShellfishId(null);
    setRecentIds((current) => [id, ...current.filter((item) => item !== id)].slice(0, 4));
    const water = waterbodies.find((item) => item.id === id);
    if (water) {
      trackBetaEvent("waterbody-view", water.name);
    }
  }

  function selectShellfish(id: string) {
    setSelectedShellfishId(id);
    setRecentIds((current) => current.slice(0, 4));
    const location = shellfishLocations.find((item) => item.id === id);
    if (location) {
      trackBetaEvent("waterbody-view", `${location.name} shellfish`);
    }
  }

  async function shareWaterbody() {
    await shareText(formatWaterbodyShare(selected), "Unskunked waterbody recommendation");
  }

  async function useCurrentLocation() {
    const state = await requestExpoLocation();
    setCoordinates(state.coordinates ?? defaultManualLocation.coordinates);
    setLocationStatus(state.status);
    setLocationMessage(state.message);
  }

  function useManualLocation(location: (typeof manualLocations)[number]) {
    setCoordinates(location.coordinates);
    setLocationStatus("idle");
    setLocationMessage(`Using ${location.label} as your manual location.`);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Explore Waters</AppText>
        <AppText style={styles.heroText}>Search Washington lakes, rivers, parks, piers, and saltwater spots using local demo data.</AppText>
      </View>
      <Disclaimer />

      <Card style={styles.locationCard}>
        <SectionHeader title="Nearby fishing" eyebrow={locationStatus === "granted" ? "GPS enabled" : "Manual fallback"} />
        <AppText>{locationMessage}</AppText>
        {locationStatus === "denied" ? <AppText style={styles.warning}>Permission denied. You can still use manual locations and search all waterbodies.</AppText> : null}
        {locationStatus === "unavailable" ? <AppText style={styles.warning}>Location unavailable or offline. Manual nearby search is active.</AppText> : null}
        <View style={styles.actions}>
          <Button icon="locate" style={styles.actionButton} onPress={useCurrentLocation}>Use my location</Button>
          <Button icon="map" variant="secondary" style={styles.actionButton} onPress={() => useManualLocation(defaultManualLocation)}>Manual</Button>
        </View>
        <View style={styles.suggestionRow}>
          {manualLocations.map((location) => (
            <Pressable key={location.id} onPress={() => useManualLocation(location)} style={styles.suggestion}>
              <AppText variant="caption" style={styles.suggestionText}>{location.label}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search lakes, rivers, piers, parks, bait..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      <View style={styles.suggestionRow}>
        {["trout", "pier", "worms", "bass"].map((suggestion) => (
          <Pressable key={suggestion} onPress={() => setQuery(suggestion)} style={styles.suggestion}>
            <AppText variant="caption" style={styles.suggestionText}>{suggestion}</AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.filterRow}>
        {activityFilters.map((item) => (
          <Pressable key={item} onPress={() => setActivityFilter(item)} style={[styles.filter, activityFilter === item && styles.filterActive]}>
            <AppText variant="caption" style={[styles.filterText, activityFilter === item && styles.filterTextActive]}>
              {item === "all" ? "All activity" : item}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.filterRow}>
        {filters.map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
            <AppText variant="caption" style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.mapCanvas}>
        <MapView
          style={StyleSheet.absoluteFill}
          region={mapRegion}
          showsUserLocation={locationStatus === "granted"}
          showsMyLocationButton={false}
          loadingEnabled
        >
          {markers.slice(0, 50).map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.name}
              description={marker.subtitle}
              pinColor={getMarkerTint(marker.kind)}
              onPress={() => marker.kind === "fishing" ? selectWater(marker.sourceId) : selectShellfish(marker.sourceId)}
            />
          ))}
        </MapView>
        <View style={styles.mapOverlay}>
          <AppText variant="caption" style={styles.mapLabel}>
            Live GPS map · {markers.length} markers
          </AppText>
          <AppText variant="caption" style={styles.mapSubLabel}>
            Blue fishing · orange clams · red crab
          </AppText>
        </View>
      </View>

      <SectionHeader title="Map results" eyebrow="Search fallback" />
      <View style={styles.locationList}>
        {markers.slice(0, 8).map((marker) => (
          <Pressable
            key={marker.id}
            onPress={() => marker.kind === "fishing" ? selectWater(marker.sourceId) : selectShellfish(marker.sourceId)}
            style={[styles.locationChip, (selectedShellfishId === marker.sourceId || selected.id === marker.sourceId) && styles.locationChipActive]}
          >
            <AppText style={[styles.locationName, (selectedShellfishId === marker.sourceId || selected.id === marker.sourceId) && styles.locationTextActive]}>{marker.name}</AppText>
            <AppText variant="caption" style={[styles.locationMeta, (selectedShellfishId === marker.sourceId || selected.id === marker.sourceId) && styles.locationTextActive]}>
              {marker.distanceMiles ? `${marker.distanceMiles} mi · ` : ""}{marker.kind} · {marker.waterType}
            </AppText>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="map"
          title="No locations found"
          body="Try lake, river, pier, park, saltwater, worms, bass, trout, or clear the water-type filter."
        />
      ) : (
        <>
          <SectionHeader title="Nearby waterbodies" eyebrow={`${filtered.length} sorted by distance`} />
          <View style={styles.locationList}>
            {filtered.map((water) => (
              <Pressable
                key={water.id}
                onPress={() => selectWater(water.id)}
                style={[styles.locationChip, selected.id === water.id && styles.locationChipActive]}
              >
                <AppText style={[styles.locationName, selected.id === water.id && styles.locationTextActive]}>{water.name}</AppText>
                <AppText variant="caption" style={[styles.locationMeta, selected.id === water.id && styles.locationTextActive]}>
                  {water.distanceMiles} mi · {water.waterType} · {water.beginnerDifficulty}
                </AppText>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <SectionHeader title="Recently viewed" eyebrow="This session" />
      <View style={styles.locationList}>
        {recentIds.map((id) => waterbodies.find((water) => water.id === id)).filter(Boolean).map((water) => water ? (
          <Pressable key={water.id} onPress={() => selectWater(water.id)} style={styles.recentChip}>
            <AppText variant="caption" style={styles.recentText}>{water.name}</AppText>
          </Pressable>
        ) : null)}
      </View>

      <Card style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.row}>
          <View style={styles.flex}>
            <AppText variant="heading">{selected.name}</AppText>
            <AppText variant="caption">
              {selected.region} · {selected.county ?? "WA"} · {selected.waterType} · {selected.beginnerDifficulty}
            </AppText>
          </View>
          <StatusBadge status={selected.status} />
          <View style={styles.saveWrap}>
            <FavoriteButton active={isFavorite("location", selected.id)} onPress={() => toggle("location", selected.id)} label={`Save ${selected.name}`} />
            <AppText variant="caption" style={styles.saveText}>Save</AppText>
          </View>
        </View>

        <Stack>
          <View style={styles.recommendation}>
            <Ionicons name="sunny" size={20} color={colors.forest} />
            <View style={styles.flex}>
              <AppText variant="subheading">Today&apos;s recommendation</AppText>
              <AppText>{selected.todayRecommendation}</AppText>
            </View>
          </View>

          <AppText variant="subheading">Fish found</AppText>
          <View style={styles.badgeWrap}>
            {species.map((name) => (
              <View key={name} style={styles.speciesBadge}>
                <AppText variant="caption" style={styles.speciesText}>
                  {name}
                </AppText>
              </View>
            ))}
          </View>

          <AppText>Best beginner setup: {selected.beginnerSetup}</AppText>
          <AppText>Distance: {"distanceMiles" in selected ? `${selected.distanceMiles} miles from selected location` : "Set a location to calculate distance"}</AppText>
          <AppText>Shore access: {selected.shoreAccessDifficulty ?? selected.beginnerDifficulty}</AppText>
          <AppText>Boat launch: {selected.boatLaunch ? "Yes or nearby" : "Not highlighted"}</AppText>
          <AppText>Kayak friendly: {selected.kayakFriendly ? "Yes" : "Use caution"}</AppText>
          <AppText>Bank fishing: {selected.bankFishing ? "Yes" : "Limited"}</AppText>
          <AppText>Wheelchair accessible: {selected.wheelchairAccessible ? "Likely at some access points" : "Not confirmed"}</AppText>
          <AppText>Bathrooms: {selected.bathrooms ? "Likely at primary access" : "Not confirmed"}</AppText>
          <AppText>Camping: {selected.camping ? "Nearby or on-site" : "Not highlighted"}</AppText>
          <AppText>Fee: {selected.fee}</AppText>
          <AppText>Parking: {selected.parkingNote ?? "Check local parking before leaving."}</AppText>
          <AppText>GPS: {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}</AppText>
          <AppText>Best season: {selected.bestSeason ?? "Verify by waterbody and species."}</AppText>
          <AppText>Recommended bait: {selected.suggestedBait.join(", ")}</AppText>
          <AppText>Recommended rigs: {selected.recommendedRigs.join(", ")}</AppText>
          <AppText>Season check: {regulation.season}</AppText>
          <AppText>Bag/size: {regulation.dailyLimit} · {regulation.sizeLimit}</AppText>
          <View style={styles.badgeWrap}>
            {currentRegulations.badges.map((badge) => (
              <View key={badge.label} style={[styles.speciesBadge, badge.tone === "caution" && styles.cautionBadge, badge.tone === "bad" && styles.badBadge]}>
                <AppText variant="caption" style={styles.speciesText}>{badge.label}</AppText>
              </View>
            ))}
          </View>
          <AppText>Data last updated: {currentRegulations.dataLastUpdated}</AppText>
          <AppText>WDFW seed ID: {selected.waterbodyId}</AppText>
          {selected.stocking?.length ? (
            <Stack>
              <AppText variant="subheading">Recent stocking</AppText>
              {selected.stocking.map((stock) => (
                <AppText key={`${stock.species}-${stock.date}`}>{stock.species}: {stock.count.toLocaleString()} fish on {stock.date}</AppText>
              ))}
            </Stack>
          ) : null}
          <AppText style={styles.warning}>Regulation warning: {selected.regulationSummary}</AppText>
          <AppText variant="caption">{selected.notes}</AppText>
          <YoutubeLink query={selected.youtubeSearch} />
        </Stack>

        <View style={styles.actions}>
          <Link href={"/plan" as Href} asChild>
            <Button icon="calendar" style={styles.actionButton}>
              Plan Trip
            </Button>
          </Link>
          <Button icon="navigate" variant="secondary" style={styles.actionButton} onPress={openDirections}>
            Directions
          </Button>
          <Button icon="share-social" variant="ghost" style={styles.actionButton} onPress={shareWaterbody}>
            Share
          </Button>
        </View>
      </Card>
      {selectedShellfishLocation ? (
        <Card style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText variant="heading">{selectedShellfishLocation.name}</AppText>
              <AppText variant="caption">
                {selectedShellfishLocation.region} · {selectedShellfishLocation.county} · {selectedShellfishLocation.waterType} · {selectedShellfishLocation.difficulty}
              </AppText>
            </View>
            <View style={styles.saveWrap}>
              <FavoriteButton active={isFavorite("shellfish-location", selectedShellfishLocation.id)} onPress={() => toggle("shellfish-location", selectedShellfishLocation.id)} label={`Save ${selectedShellfishLocation.name}`} />
              <AppText variant="caption" style={styles.saveText}>Save</AppText>
            </View>
          </View>
          <Stack>
            <View style={styles.recommendation}>
              <Ionicons name="boat" size={20} color={colors.forest} />
              <View style={styles.flex}>
                <AppText variant="subheading">Best shellfish plan</AppText>
                <AppText>{selectedShellfishLocation.tideDependency}</AppText>
              </View>
            </View>
            <AppText variant="subheading">Targets</AppText>
            <View style={styles.badgeWrap}>
              {selectedShellfishTargets.map((target) => (
                <View key={target.id} style={styles.speciesBadge}>
                  <AppText variant="caption" style={styles.speciesText}>{target.name}</AppText>
                </View>
              ))}
            </View>
            <AppText>Gear: {selectedShellfishLocation.gearChecklist.join(", ")}</AppText>
            <AppText>Access: {selectedShellfishLocation.accessType} · Family friendly: {selectedShellfishLocation.familyFriendly ? "Yes" : "Use caution"}</AppText>
            <AppText>GPS: {selectedShellfishLocation.latitude.toFixed(4)}, {selectedShellfishLocation.longitude.toFixed(4)}</AppText>
            <AppText>Source: {selectedShellfishLocation.source}</AppText>
            <AppText>Data last updated: {selectedShellfishLocation.lastUpdated}</AppText>
            <AppText style={styles.warning}>Regulation warning: {selectedShellfishLocation.regulationWarning}</AppText>
            {selectedShellfishLocation.harvestNotes.map((note) => (
              <AppText key={note}>{note}</AppText>
            ))}
          </Stack>
          <View style={styles.actions}>
            <Link href={"/plan" as Href} asChild>
              <Button icon="calendar" style={styles.actionButton}>Plan Shellfish</Button>
            </Link>
            <Button icon="navigate" variant="secondary" style={styles.actionButton} onPress={() => Linking.openURL(`https://maps.apple.com/?q=${encodeURIComponent(selectedShellfishLocation.name)}&ll=${selectedShellfishLocation.latitude},${selectedShellfishLocation.longitude}`)}>
              Directions
            </Button>
            <Button icon="share-social" variant="ghost" style={styles.actionButton} onPress={() => shareText(`Unskunked shellfish pick: ${selectedShellfishLocation.name}. Verify WDFW shellfish, emergency, license, and health advisories before harvesting.`, "Unskunked shellfish location")}>
              Share
            </Button>
          </View>
        </Card>
      ) : null}
      <OfficialLinks links={regulation.sourceLinks} compact />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg
  },
  heroText: {
    color: colors.mist,
    fontWeight: "700"
  },
  search: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: spacing.md
  },
  locationCard: {
    gap: spacing.md
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  suggestionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  suggestion: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  suggestionText: {
    color: colors.forest,
    fontWeight: "900"
  },
  filter: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  filterText: {
    color: colors.ink,
    fontWeight: "900"
  },
  filterTextActive: {
    color: "#fff"
  },
  mapCanvas: {
    backgroundColor: colors.sky,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 250,
    overflow: "hidden"
  },
  mapOverlay: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: radii.md,
    left: spacing.md,
    padding: spacing.sm,
    position: "absolute",
    top: spacing.md
  },
  mapLabel: {
    color: colors.deepWater,
    fontWeight: "900"
  },
  mapSubLabel: {
    color: colors.muted,
    fontWeight: "800"
  },
  locationList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  locationChip: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    minWidth: "47%",
    padding: spacing.md
  },
  locationChipActive: {
    backgroundColor: colors.deepWater,
    borderColor: colors.deepWater
  },
  locationName: {
    fontWeight: "900"
  },
  locationMeta: {
    color: colors.muted
  },
  locationTextActive: {
    color: "#fff"
  },
  recentChip: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  recentText: {
    color: colors.forest,
    fontWeight: "900"
  },
  sheet: {
    gap: spacing.md
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.line,
    borderRadius: radii.pill,
    height: 5,
    width: 48
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  saveWrap: {
    alignItems: "center",
    gap: spacing.xxs
  },
  saveText: {
    color: colors.pine,
    fontWeight: "900"
  },
  flex: {
    flex: 1
  },
  recommendation: {
    backgroundColor: "#fff3d5",
    borderColor: colors.sunrise,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  badgeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  speciesBadge: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  cautionBadge: {
    backgroundColor: "#fff3d6"
  },
  badBadge: {
    backgroundColor: "#f9ded8"
  },
  speciesText: {
    color: colors.forest,
    fontWeight: "900"
  },
  warning: {
    color: colors.danger,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  actionButton: {
    flex: 1
  }
});
