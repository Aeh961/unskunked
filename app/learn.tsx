import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { learningArticles } from "@/src/data/learning";
import { colors, radii, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";

const categories = ["All", "Basics", "Casting", "Knots", "Rigs", "Behavior", "Mistakes", "Glossary", "FAQ"] as const;

export default function LearningCenterScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    const byCategory = category === "All" ? learningArticles : learningArticles.filter((article) => article.category === category);
    return searchByFields(byCategory, query, [(article) => article.title, (article) => article.category, (article) => article.summary, (article) => article.bullets]);
  }, [category, query]);

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Learning Center</AppText>
        <AppText style={styles.heroText}>Short lessons for fishing basics, casting, knots, rigs, behavior, mistakes, glossary, and FAQ.</AppText>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search casting, knots, mistakes..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      <View style={styles.categoryRow}>
        {categories.map((item) => (
          <Pressable key={item} onPress={() => setCategory(item)} style={[styles.category, category === item && styles.categoryActive]}>
            <AppText variant="caption" style={[styles.categoryText, category === item && styles.categoryTextActive]}>
              {item}
            </AppText>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Lessons" eyebrow={`${filtered.length} articles`} />
      {filtered.length > 0 ? (
        filtered.map((article) => (
          <Card key={article.id}>
            <AppText variant="heading">{article.title}</AppText>
            <AppText variant="caption" style={styles.categoryLabel}>
              {article.category}
            </AppText>
            <AppText>{article.summary}</AppText>
            <Stack>
              {article.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <View style={styles.dot} />
                  <AppText style={styles.bullet}>{bullet}</AppText>
                </View>
              ))}
            </Stack>
            <YoutubeLink query={article.youtubeSearch} />
          </Card>
        ))
      ) : (
        <EmptyState icon="school" title="No lessons found" body="Try a broader search like rig, knot, cast, behavior, or FAQ." />
      )}
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
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  category: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  categoryActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  categoryText: {
    fontWeight: "900"
  },
  categoryTextActive: {
    color: "#fff"
  },
  categoryLabel: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  bulletRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  dot: {
    backgroundColor: colors.river,
    borderRadius: radii.pill,
    height: 8,
    marginTop: 7,
    width: 8
  },
  bullet: {
    flex: 1
  }
});
