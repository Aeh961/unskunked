import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { fishSpecies } from "@/src/data/fish";
import { useFavorites } from "@/src/hooks/useFavorites";
import { colors, radii, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";

const difficultyFilters = ["All", "Easy", "Moderate", "Advanced"] as const;

export default function FishScreen() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof difficultyFilters)[number]>("All");
  const { isFavorite, toggle } = useFavorites();

  const filtered = useMemo(() => {
    const byDifficulty = difficulty === "All" ? fishSpecies : fishSpecies.filter((fish) => fish.difficulty === difficulty);
    return searchByFields(byDifficulty, query, [
      (fish) => fish.name,
      (fish) => fish.bestBait,
      (fish) => fish.bestLures,
      (fish) => fish.rigs,
      (fish) => fish.whereToFind
    ]);
  }, [difficulty, query]);

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Fish Database</AppText>
        <AppText style={styles.heroText}>Pick a target species and get the season, gear, rig, and beginner mistakes in one place.</AppText>
      </View>
      <Disclaimer />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search trout, worms, jig, docks..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      <View style={styles.filterRow}>
        {difficultyFilters.map((item) => (
          <Pressable key={item} onPress={() => setDifficulty(item)} style={[styles.filter, difficulty === item && styles.filterActive]}>
            <AppText variant="caption" style={[styles.filterText, difficulty === item && styles.filterTextActive]}>
              {item}
            </AppText>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Species" eyebrow={`${filtered.length} matches`} />

      {filtered.length > 0 ? (
        filtered.map((fish) => (
          <Card key={fish.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.fishIcon}>
                <AppText style={styles.fishInitial}>{fish.name.slice(0, 1)}</AppText>
              </View>
              <View style={styles.titleBlock}>
                <View style={styles.row}>
                  <AppText variant="heading" style={styles.title}>
                    {fish.name}
                  </AppText>
                  <StatusBadge status={fish.status} />
                </View>
                <AppText variant="caption">
                  {fish.difficulty} · {fish.bestSeason}
                </AppText>
              </View>
              <FavoriteButton active={isFavorite("fish", fish.id)} onPress={() => toggle("fish", fish.id)} label={`Favorite ${fish.name}`} />
            </View>
            <View style={styles.quickFacts}>
              <AppText style={styles.fact}>Bait: {fish.bestBait.slice(0, 2).join(", ")}</AppText>
              <AppText style={styles.fact}>Lures: {fish.bestLures.slice(0, 2).join(", ")}</AppText>
              <AppText style={styles.fact}>Rig: {fish.rigs[0]}</AppText>
            </View>
            <AppText variant="caption" style={styles.warning}>
              {fish.regulation.warning}
            </AppText>
            <Link href={`/fish/${fish.id}`} asChild>
              <Pressable style={styles.openButton}>
                <AppText style={styles.openText}>Open fish guide</AppText>
              </Pressable>
            </Link>
          </Card>
        ))
      ) : (
        <EmptyState icon="fish" title="No fish found" body="Try searching bait, habitat, lure type, or clear the difficulty filter." />
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
    color: colors.ink,
    fontWeight: "900"
  },
  filterTextActive: {
    color: "#fff"
  },
  card: {
    gap: spacing.md
  },
  cardTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  fishIcon: {
    alignItems: "center",
    backgroundColor: colors.sky,
    borderRadius: radii.md,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  fishInitial: {
    color: colors.deepWater,
    fontSize: 28,
    fontWeight: "900"
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xxs
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  title: {
    flex: 1
  },
  quickFacts: {
    gap: spacing.xs
  },
  fact: {
    fontWeight: "700"
  },
  warning: {
    color: colors.danger,
    fontWeight: "800"
  },
  openButton: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: radii.md,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  openText: {
    color: "#fff",
    fontWeight: "900"
  }
});
