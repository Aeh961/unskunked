import { Href, Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Linking, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { MapErrorBoundary } from "@/src/components/MapErrorBoundary";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { PixelMarker } from "@/src/components/PixelMarker";
import { RegionSelector } from "@/src/components/RegionSelector";
import { SearchInput } from "@/src/components/SearchInput";
import { Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { WaterbodyListRow } from "@/src/components/WaterbodyListRow";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { getSpeciesForRegion } from "@/src/data/fish";
import { RegionId } from "@/src/data/regions";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { ActivityType, Status, WaterType } from "@/src/data/types";
import { getWaterbodiesForRegion, waterbodies } from "@/src/data/waterbodies";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { useFavorites } from "@/src/hooks/useFavorites";
import { colors, radii, spacing } from "@/src/theme";
import { Coordinates, defaultManualLocation, manualLocations, requestExpoLocation } from "@/src/services/location";
import { getMapMarkers, getMarkerTint, SkunkedMapMarker } from "@/src/services/mapMarkers";
import { regionToRegulationState, regulationService } from "@/src/services/regulations";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { formatWaterbodyShare, shareText } from "@/src/utils/share";
import { getSelectedRegion, setSelectedRegion, trackBetaEvent } from "@/src/utils/localStore";

const filters: Array<WaterType | "All"> = ["All", "Lake", "River", "Saltwater", "Park", "Pier"];
const activityFilters: Array<ActivityType | "all"> = ["all", "fishing", "clamming", "crabbing"];

function activityLabelFor(kind: ActivityType) {
  if (kind === "clamming") return "Clamming";
  if (kind === "crabbing") return "Crabbing";
  return "Fishing";
}

export default function MapScreen() {
  const [region, setRegion] = useState<RegionId>("washington");
  const [queryInput, setQueryInput] = useState("");
  const query = useDebouncedValue(queryInput, 200);
  const [filter, setFilter] = useState<WaterType | "All">("All");
  const [activityFilter, setActivityFilter] = useState<ActivityType | "all">("all");
  const [selectedId, setSelectedId] = useState(waterbodies[0].id);
  const [selectedShellfishId, setSelectedShellfishId] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultManualLocation.coordinates);
  const [locationMessage, setLocationMessage] = useState("Using Seattle as the manual nearby fallback.");
  const [locationStatus, setLocationStatus] = useState<"idle" | "granted" | "denied" | "unavailable">("idle");
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    getSelectedRegion().then(setRegion);
  }, []);

  function changeRegion(next: RegionId) {
    setRegion(next);
    setSelectedRegion(next);
    setSelectedShellfishId(null);
  }

  const regionWaterbodies = useMemo(() => getWaterbodiesForRegion(region), [region]);
  const regionSpecies = useMemo(() => getSpeciesForRegion(region), [region]);
  const statusById = useMemo(() => {
    const map = new Map<string, Status>();
    regionWaterbodies.forEach((water) => map.set(water.id, water.status));
    return map;
  }, [regionWaterbodies]);

  useEffect(() => {
    setSelectedId(regionWaterbodies[0]?.id ?? waterbodies[0].id);
  }, [region, regionWaterbodies]);

  const markers = useMemo(() => getMapMarkers({
    region,
    activity: activityFilter,
    waterType: filter === "All" ? "all" : filter,
    query,
    coordinates
  }), [activityFilter, coordinates, filter, query, region]);

  const selected = regionWaterbodies.find((water) => water.id === selectedId) ?? regionWaterbodies[0] ?? waterbodies[0];
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
    .map((id) => regionSpecies.find((fish) => fish.id === id)?.name)
    .filter(Boolean);
  const regulation = regulationService.getSummary({ state: regionToRegulationState[region] ?? "WA", waterbodyId: selected.id, date: new Date().toISOString() });
  const currentRegulations = getCurrentRegulations({ waterbodyId: selected.id, date: new Date().toISOString() });
  const recentMarkers = recentIds.map((id) => waterbodies.find((water) => water.id === id)).filter(Boolean) as typeof waterbodies;

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
    const location = shellfishLocations.find((item) => item.id === id);
    if (location) {
      trackBetaEvent("waterbody-view", `${location.name} shellfish`);
    }
  }

  function selectMarker(marker: SkunkedMapMarker) {
    if (marker.kind === "fishing") selectWater(marker.sourceId);
    else selectShellfish(marker.sourceId);
  }

  async function shareWaterbody() {
    await shareText(formatWaterbodyShare(selected), "Skunked waterbody recommendation");
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
    setShowFilters(false);
  }

  const listHeader = (
    <View style={styles.headerStack}>
      <View style={styles.titleRow}>
        <AppText variant="display">EXPLORE WATERS</AppText>
      </View>
      <Disclaimer />

      <RegionSelector region={region} onChange={changeRegion} />

      <View style={styles.locationRow}>
        <Ionicons name={locationStatus === "granted" ? "navigate" : "location-outline"} size={16} color={colors.amber} />
        <AppText variant="caption" style={styles.locationText} numberOfLines={2}>{locationMessage}</AppText>
        <Pressable accessibilityRole="button" accessibilityLabel="Use my location" onPress={useCurrentLocation} style={styles.locationAction}>
          <AppText variant="caption" style={styles.locationActionText}>GPS</AppText>
        </Pressable>
      </View>
      {locationStatus === "denied" ? <AppText style={styles.warning}>Permission denied. Manual locations and search still work.</AppText> : null}
      {locationStatus === "unavailable" ? <AppText style={styles.warning}>Location unavailable or offline. Manual nearby search is active.</AppText> : null}

      <SearchInput
        accessibilityLabel="Search waterbodies, shellfish locations, bait, county, or water type"
        value={queryInput}
        onChangeText={setQueryInput}
        onClear={() => setQueryInput("")}
        placeholder="Search lakes, rivers, piers, parks, bait..."
      />

      <Pressable accessibilityRole="button" accessibilityLabel="Open map filters" style={styles.filtersToggle} onPress={() => setShowFilters(true)}>
        <Ionicons name="options" size={16} color={colors.amber} />
        <AppText variant="caption" style={styles.filtersToggleText}>
          Filters: {activityFilter === "all" ? "All activity" : activityFilter} · {filter}
        </AppText>
      </Pressable>

      {Platform.OS === "web" ? (
        <View style={styles.mapFallback}>
          <Ionicons name="map-outline" size={20} color={colors.muted} />
          <AppText variant="caption" style={styles.mapFallbackText}>Map unavailable — showing results as a list.</AppText>
        </View>
      ) : (
        <MapErrorBoundary
          fallback={
            <View style={styles.mapFallback}>
              <Ionicons name="map-outline" size={20} color={colors.muted} />
              <AppText variant="caption" style={styles.mapFallbackText}>Map unavailable — showing results as a list.</AppText>
            </View>
          }
        >
          <View style={styles.mapCanvas}>
            <MapView
              style={StyleSheet.absoluteFill}
              region={mapRegion}
              showsUserLocation={locationStatus === "granted"}
              showsMyLocationButton={false}
              loadingEnabled
            >
              {markers.slice(0, 80).map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  title={marker.name}
                  description={marker.subtitle}
                  onPress={() => selectMarker(marker)}
                >
                  <PixelMarker kind={marker.kind} tint={getMarkerTint(marker.kind)} />
                </Marker>
              ))}
            </MapView>
            <View style={styles.mapOverlay}>
              <AppText variant="caption" style={styles.mapLabel}>{markers.length} markers</AppText>
              <AppText variant="caption" style={styles.mapSubLabel}>Cyan fishing · amber clams · red crab</AppText>
            </View>
          </View>
        </MapErrorBoundary>
      )}

      <SectionHeader title="Results" eyebrow={`${markers.length} sorted by distance`} />

      {recentMarkers.length > 0 ? (
        <View style={styles.recentSection}>
          <AppText variant="caption" style={styles.recentLabel}>RECENTLY VIEWED</AppText>
          {recentMarkers.map((water) => (
            <WaterbodyListRow
              key={water.id}
              name={water.name}
              waterType={water.waterType}
              county={water.county}
              activityLabel="Fishing"
              status={water.status}
              selected={selected.id === water.id}
              onPress={() => selectWater(water.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );

  const listFooter = (
    <View style={styles.footerStack}>
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
            <Ionicons name="sunny" size={20} color={colors.amber} />
            <View style={styles.flex}>
              <AppText variant="subheading">Today&apos;s recommendation</AppText>
              <AppText>{selected.todayRecommendation}</AppText>
            </View>
          </View>

          {species[0] ? <AppText>Primary species: {species[0]}</AppText> : null}
        </Stack>

        <View style={styles.actions}>
          <Link href={`/trips?waterbodyId=${selected.id}` as Href} asChild>
            <Button icon="calendar" style={styles.actionButton}>
              Plan Trip
            </Button>
          </Link>
          <Button icon="shield-checkmark" variant="secondary" style={styles.actionButton} onPress={() => Linking.openURL(regulation.sourceLinks.regulations)}>
            Official Regs
          </Button>
        </View>

        {showDetails ? (
          <Stack>
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
        ) : null}

        <View style={styles.actions}>
          <Button icon={showDetails ? "chevron-up-outline" : "chevron-down-outline"} variant="ghost" style={styles.actionButton} onPress={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide details" : "Details"}
          </Button>
          <Button icon="navigate" variant="ghost" style={styles.actionButton} onPress={openDirections}>
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
              <Ionicons name="boat" size={20} color={colors.amber} />
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
            <Link href={"/trips" as Href} asChild>
              <Button icon="calendar" style={styles.actionButton}>Plan Shellfish</Button>
            </Link>
            <Button icon="navigate" variant="secondary" style={styles.actionButton} onPress={() => Linking.openURL(`https://maps.apple.com/?q=${encodeURIComponent(selectedShellfishLocation.name)}&ll=${selectedShellfishLocation.latitude},${selectedShellfishLocation.longitude}`)}>
              Directions
            </Button>
            <Button icon="share-social" variant="ghost" style={styles.actionButton} onPress={() => shareText(`Skunked shellfish pick: ${selectedShellfishLocation.name}. Verify WDFW shellfish, emergency, license, and health advisories before harvesting.`, "Skunked shellfish location")}>
              Share
            </Button>
          </View>
        </Card>
      ) : null}

      <OfficialLinks links={regulation.sourceLinks} compact context={selectedShellfishLocation ? "shellfish" : "fishing"} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={markers}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        initialNumToRender={16}
        windowSize={7}
        removeClippedSubviews
        renderItem={({ item }) => (
          <WaterbodyListRow
            name={item.name}
            waterType={item.waterType}
            county={item.county}
            activityLabel={activityLabelFor(item.kind)}
            distanceMiles={item.distanceMiles}
            status={item.kind === "fishing" ? statusById.get(item.sourceId) : undefined}
            selected={item.kind === "fishing" ? selected.id === item.sourceId : selectedShellfishId === item.sourceId}
            onPress={() => selectMarker(item)}
          />
        )}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ListEmptyComponent={
          <EmptyState icon="map" title="No locations found" body="Try lake, river, pier, park, saltwater, worms, bass, trout, or clear the water-type filter." />
        }
      />

      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <Pressable style={styles.modalBackdrop} accessibilityRole="button" accessibilityLabel="Close filters" onPress={() => setShowFilters(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.sheetHandle} />
          <SectionHeader title="Filters" action={
            <Pressable accessibilityRole="button" accessibilityLabel="Close filters" onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={20} color={colors.muted} />
            </Pressable>
          } />
          <AppText variant="subheading">Activity</AppText>
          <View style={styles.filterRow}>
            {activityFilters.map((item) => (
              <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Filter map by ${item === "all" ? "all activities" : item}`} onPress={() => setActivityFilter(item)} style={[styles.filter, activityFilter === item && styles.filterActive]}>
                <AppText variant="caption" style={[styles.filterText, activityFilter === item && styles.filterTextActive]}>
                  {item === "all" ? "All activity" : item}
                </AppText>
              </Pressable>
            ))}
          </View>
          <AppText variant="subheading">Water type</AppText>
          <View style={styles.filterRow}>
            {filters.map((item) => (
              <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Filter map by ${item}`} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
                <AppText variant="caption" style={[styles.filterText, filter === item && styles.filterTextActive]}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </View>
          <AppText variant="subheading">Manual location</AppText>
          <View style={styles.filterRow}>
            {manualLocations.map((location) => (
              <Pressable key={location.id} accessibilityRole="button" accessibilityLabel={`Use ${location.label} as manual map location`} onPress={() => useManualLocation(location)} style={styles.filter}>
                <AppText variant="caption" style={styles.filterText}>{location.label}</AppText>
              </Pressable>
            ))}
          </View>
          <Button icon="checkmark" onPress={() => setShowFilters(false)}>Apply</Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    paddingBottom: spacing.xl
  },
  headerStack: {
    gap: spacing.md,
    padding: spacing.md
  },
  footerStack: {
    gap: spacing.md,
    paddingHorizontal: spacing.md
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  locationRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  locationText: {
    flex: 1,
    flexShrink: 1
  },
  locationAction: {
    backgroundColor: colors.pine,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  locationActionText: {
    color: colors.ink,
    fontWeight: "900"
  },
  filtersToggle: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md
  },
  filtersToggleText: {
    color: colors.ink,
    fontWeight: "800",
    textTransform: "capitalize"
  },
  modalBackdrop: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.lg
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
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
    height: 220,
    overflow: "hidden"
  },
  mapFallback: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderStyle: "dashed",
    borderWidth: 2,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 56,
    padding: spacing.md
  },
  mapFallbackText: {
    color: colors.muted,
    flexShrink: 1
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
  recentSection: {
    gap: spacing.xs
  },
  recentLabel: {
    color: colors.amber,
    fontWeight: "900",
    letterSpacing: 1
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
    color: colors.amber,
    fontWeight: "900"
  },
  flex: {
    flex: 1
  },
  recommendation: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.amber,
    borderLeftWidth: 4,
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
