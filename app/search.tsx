import { Href, Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { fishSpecies } from "@/src/data/fish";
import { learningArticles } from "@/src/data/learning";
import { rigsAndKnots } from "@/src/data/rigs";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { waterbodies } from "@/src/data/waterbodies";
import { providerMetadata } from "@/src/services/dataTrust";
import { colors, radii, spacing } from "@/src/theme";
import { getDemoSearchHistory, getTrips, saveRecentSearch, trackBetaEvent, TripLog } from "@/src/utils/localStore";
import { searchByFields } from "@/src/utils/search";

const filters = ["All", "Fish", "Shellfish", "Water", "Rigs", "Knots", "Learning", "Regulations", "Trips"] as const;
const popularSearches = ["Lake Washington", "Dungeness crab", "razor clam", "marine area", "trout regulations", "family friendly pier"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [recent, setRecent] = useState<string[]>([]);
  const [trips, setTrips] = useState<TripLog[]>([]);

  useEffect(() => {
    Promise.all([getDemoSearchHistory(), getTrips()]).then(([history, savedTrips]) => {
      setRecent(history);
      setTrips(savedTrips);
    });
  }, []);

  const results = useMemo(() => {
    const fish = searchByFields(fishSpecies, query, [(item) => item.name, (item) => item.bestBait, (item) => item.rigs]).map((item) => ({
      type: "Fish",
      title: item.name,
      subtitle: `${item.difficulty} · ${item.bestSeason}`,
      href: `/fish/${item.id}` as Href
    }));
    const waters = searchByFields(waterbodies, query, [
      (item) => item.name,
      (item) => item.region,
      (item) => item.county ?? "",
      (item) => item.city ?? "",
      (item) => item.waterType,
      (item) => item.beginnerDifficulty,
      (item) => item.shoreAccessDifficulty ?? "",
      (item) => (item.bankFishing ? "shore bank shore only" : ""),
      (item) => (item.boatLaunch ? "boat launch boat only" : ""),
      (item) => (item.familyFriendly ? "family friendly" : ""),
      (item) => item.suggestedBait
    ]).map((item) => ({
      type: "Water",
      title: item.name,
      subtitle: `${item.county ?? "WA"} · ${item.waterType} · ${item.beginnerDifficulty}`,
      href: "/map" as Href
    }));
    const shellfish = [
      ...searchByFields(shellfishSpecies, query, [(item) => item.name, (item) => item.activityType, (item) => item.habitat, (item) => item.gear, (item) => item.regulationWarning]).map((item) => ({
        type: "Shellfish",
        title: item.name,
        subtitle: `${item.activityType} · ${item.difficulty} · ${item.seasonNotes}`,
        href: "/plan" as Href
      })),
      ...searchByFields(shellfishLocations, query, [(item) => item.name, (item) => item.county, (item) => item.region, (item) => item.waterType, (item) => item.activityTypes, (item) => item.regulationWarning]).map((item) => ({
        type: "Shellfish",
        title: item.name,
        subtitle: `${item.county} · ${item.activityTypes.join(", ")} · ${item.difficulty}`,
        href: "/map" as Href
      }))
    ];
    const gear = searchByFields(rigsAndKnots, query, [(item) => item.name, (item) => item.worksFor, (item) => item.parts]).map((item) => ({
      type: item.type === "rig" ? "Rigs" : "Knots",
      title: item.name,
      subtitle: item.whenToUse,
      href: "/rigs" as Href
    }));
    const learning = searchByFields(learningArticles, query, [(item) => item.title, (item) => item.category, (item) => item.relatedTopics ?? []]).map((item) => ({
      type: "Learning",
      title: item.title,
      subtitle: item.category,
      href: "/learn" as Href
    }));
    const tripResults = searchByFields(trips, query, [(item) => item.location, (item) => item.speciesCaught, (item) => item.bait, (item) => item.rig]).map((item) => ({
      type: "Trips",
      title: item.location,
      subtitle: `${item.date} · ${item.result}`,
      href: "/log" as Href
    }));
    const regulations = searchByFields(providerMetadata, query, [(item) => item.label, (item) => item.organization, (item) => item.activities, (item) => item.dataTypes, (item) => item.confidence, (item) => item.notes]).map((item) => ({
      type: "Regulations",
      title: item.label,
      subtitle: `${item.organization} · ${item.confidence} · verified ${item.freshness.lastVerifiedAt}`,
      href: "/data-sources" as Href
    }));
    const all = [...fish, ...shellfish, ...waters, ...gear, ...learning, ...regulations, ...tripResults];
    return filter === "All" ? all : all.filter((item) => item.type === filter);
  }, [filter, query, trips]);

  async function submitSearch(value = query) {
    const next = await saveRecentSearch(value);
    await trackBetaEvent("search", value);
    setRecent(next);
    setQuery(value);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Search Unskunked</AppText>
        <AppText style={styles.heroText}>Find fish, waters, rigs, knots, lessons, and logged trip patterns.</AppText>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => submitSearch()}
        placeholder="Search worms, Green Lake, Palomar, bass..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      <View style={styles.filterRow}>
        {filters.map((item) => (
          <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Filter search results by ${item}`} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
            <AppText variant="caption" style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</AppText>
          </Pressable>
        ))}
      </View>
      <SectionHeader title="Popular searches" eyebrow="Phase 10" />
      <View style={styles.filterRow}>
        {popularSearches.map((item) => (
          <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Search ${item}`} onPress={() => submitSearch(item)} style={styles.recent}>
            <AppText variant="caption" style={styles.recentText}>{item}</AppText>
          </Pressable>
        ))}
      </View>
      <SectionHeader title="Recent searches" eyebrow={`${recent.length} saved`} />
      <View style={styles.filterRow}>
        {recent.map((item) => (
          <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Repeat search ${item}`} onPress={() => submitSearch(item)} style={styles.recent}>
            <AppText variant="caption" style={styles.recentText}>{item}</AppText>
          </Pressable>
        ))}
      </View>
      <SectionHeader title="Results" eyebrow={`${results.length} matches`} />
      {results.length ? (
        results.map((item) => (
          <Link key={`${item.type}-${item.title}`} href={item.href} asChild>
            <Card>
              <AppText variant="caption" style={styles.resultType}>{item.type}</AppText>
              <AppText variant="heading">{item.title}</AppText>
              <AppText variant="caption">{item.subtitle}</AppText>
            </Card>
          </Link>
        ))
      ) : (
        <EmptyState icon="search" title="No matches yet" body="Try a fish, lake, bait, rig, knot, lesson topic, or trip note." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.deepWater,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg
  },
  lightText: {
    color: "#fff"
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
    fontWeight: "900"
  },
  filterTextActive: {
    color: "#fff"
  },
  recent: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  recentText: {
    color: colors.forest,
    fontWeight: "900"
  },
  resultType: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
  }
});
