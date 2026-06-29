import { Href, Link } from "expo-router";
import { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { WaterType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { useFavorites } from "@/src/hooks/useFavorites";
import { colors, radii, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";

const filters: Array<WaterType | "All"> = ["All", "Lake", "River", "Saltwater", "Park", "Pier"];

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WaterType | "All">("All");
  const [selectedId, setSelectedId] = useState(waterbodies[0].id);
  const [recentIds, setRecentIds] = useState<string[]>([waterbodies[0].id]);
  const { isFavorite, toggle } = useFavorites();

  const filtered = useMemo(() => {
    const byType = filter === "All" ? waterbodies : waterbodies.filter((water) => water.waterType === filter);
    return searchByFields(byType, query, [
      (water) => water.name,
      (water) => water.region,
      (water) => water.waterType,
      (water) => water.notes,
      (water) => water.suggestedBait,
      (water) => water.recommendedRigs
    ]);
  }, [filter, query]);

  const selected = filtered.find((water) => water.id === selectedId) ?? filtered[0] ?? waterbodies[0];
  const species = selected.speciesIds
    .map((id) => fishSpecies.find((fish) => fish.id === id)?.name)
    .filter(Boolean);

  function openDirections() {
    const url = `https://maps.apple.com/?q=${encodeURIComponent(selected.name)}&ll=${selected.latitude},${selected.longitude}`;
    Linking.openURL(url);
  }

  function selectWater(id: string) {
    setSelectedId(id);
    setRecentIds((current) => [id, ...current.filter((item) => item !== id)].slice(0, 4));
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Explore Waters</AppText>
        <AppText style={styles.heroText}>Search Washington lakes, rivers, parks, piers, and saltwater spots using local demo data.</AppText>
      </View>
      <Disclaimer />

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
        {filters.map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
            <AppText variant="caption" style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.mapCanvas}>
        <View style={styles.mountainOne} />
        <View style={styles.mountainTwo} />
        <View style={styles.waterShape} />
        <AppText variant="caption" style={styles.mapLabel}>
          Mock interactive map
        </AppText>
        {filtered.slice(0, 6).map((water, index) => (
          <Pressable
            key={water.id}
            onPress={() => selectWater(water.id)}
            style={[
              styles.pin,
              pinPositions[index % pinPositions.length],
              selected.id === water.id && styles.pinActive
            ]}
          >
            <Ionicons name={water.waterType === "River" ? "water" : water.waterType === "Pier" ? "trail-sign" : "location"} size={17} color="#fff" />
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
          <SectionHeader title="Matched locations" eyebrow={`${filtered.length} local spots`} />
          <View style={styles.locationList}>
            {filtered.map((water) => (
              <Pressable
                key={water.id}
                onPress={() => selectWater(water.id)}
                style={[styles.locationChip, selected.id === water.id && styles.locationChipActive]}
              >
                <AppText style={[styles.locationName, selected.id === water.id && styles.locationTextActive]}>{water.name}</AppText>
                <AppText variant="caption" style={[styles.locationMeta, selected.id === water.id && styles.locationTextActive]}>
                  {water.waterType} · {water.beginnerDifficulty}
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
              {selected.region} · {selected.waterType} · {selected.beginnerDifficulty}
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
          <AppText>Recommended bait: {selected.suggestedBait.join(", ")}</AppText>
          <AppText>Recommended rigs: {selected.recommendedRigs.join(", ")}</AppText>
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
        </View>
      </Card>
    </Screen>
  );
}

const pinPositions = [
  { left: "18%", top: "48%" },
  { left: "36%", top: "34%" },
  { left: "56%", top: "54%" },
  { left: "72%", top: "28%" },
  { left: "80%", top: "66%" },
  { left: "28%", top: "70%" }
] as const;

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
  mountainOne: {
    backgroundColor: colors.moss,
    borderRadius: 120,
    height: 180,
    left: -38,
    position: "absolute",
    top: -58,
    transform: [{ rotate: "18deg" }],
    width: 230
  },
  mountainTwo: {
    backgroundColor: colors.pine,
    borderRadius: 140,
    height: 190,
    position: "absolute",
    right: -58,
    top: -44,
    transform: [{ rotate: "-16deg" }],
    width: 260
  },
  waterShape: {
    backgroundColor: colors.river,
    borderRadius: 130,
    bottom: -72,
    height: 180,
    left: -20,
    position: "absolute",
    width: "112%"
  },
  mapLabel: {
    color: colors.deepWater,
    fontWeight: "900",
    left: spacing.md,
    position: "absolute",
    top: spacing.md
  },
  pin: {
    alignItems: "center",
    backgroundColor: colors.clay,
    borderColor: "#fff",
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    width: 38
  },
  pinActive: {
    backgroundColor: colors.forest,
    transform: [{ scale: 1.14 }]
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
