import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { RigDiagram } from "@/src/components/RigDiagram";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { rigsAndKnots } from "@/src/data/rigs";
import { useFavorites } from "@/src/hooks/useFavorites";
import { colors, radii, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";

type Builder = {
  water: "Lake" | "River" | "Saltwater" | "Dock" | "Shore" | "Boat";
  fish: "Trout" | "Bass" | "Perch" | "Salmon" | "Not sure";
  bait: "Worms" | "PowerBait" | "Spinners" | "Jigs" | "Soft plastics" | "None";
  rod: "Spinning rod" | "Baitcaster" | "Unknown";
  level: "Beginner" | "Intermediate";
};

const defaults: Builder = {
  water: "Lake",
  fish: "Trout",
  bait: "Worms",
  rod: "Spinning rod",
  level: "Beginner"
};

export default function RigsScreen() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"all" | "knot" | "rig">("all");
  const [builder, setBuilder] = useState<Builder>(defaults);
  const { isFavorite, toggle } = useFavorites();

  const recommendation = useMemo(() => buildRigRecommendation(builder), [builder]);

  const filtered = useMemo(() => {
    const byMode = mode === "all" ? rigsAndKnots : rigsAndKnots.filter((item) => item.type === mode);
    return searchByFields(byMode, query, [(item) => item.name, (item) => item.worksFor, (item) => item.whenToUse]);
  }, [mode, query]);

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Rig Builder</AppText>
        <AppText style={styles.heroText}>Answer a few basics and Unskunked picks a simple setup from local rules.</AppText>
      </View>
      <Disclaimer />

      <Card style={styles.builderCard}>
        <SectionHeader title="Build my setup" eyebrow="Local recommendation" />
        <BuilderGroup label="Where are you fishing?" value={builder.water} options={["Lake", "River", "Saltwater", "Dock", "Shore", "Boat"]} onSelect={(water) => setBuilder({ ...builder, water })} />
        <BuilderGroup label="What are you targeting?" value={builder.fish} options={["Trout", "Bass", "Perch", "Salmon", "Not sure"]} onSelect={(fish) => setBuilder({ ...builder, fish })} />
        <BuilderGroup label="What bait/lures do you have?" value={builder.bait} options={["Worms", "PowerBait", "Spinners", "Jigs", "Soft plastics", "None"]} onSelect={(bait) => setBuilder({ ...builder, bait })} />
        <BuilderGroup label="What rod do you have?" value={builder.rod} options={["Spinning rod", "Baitcaster", "Unknown"]} onSelect={(rod) => setBuilder({ ...builder, rod })} />
        <BuilderGroup label="Experience level" value={builder.level} options={["Beginner", "Intermediate"]} onSelect={(level) => setBuilder({ ...builder, level })} />
      </Card>

      <Card style={styles.recommendation}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <SectionHeader title={recommendation.rig.name} eyebrow={`${recommendation.estimatedSuccess}% estimated success`} />
          </View>
          <FavoriteButton
            active={isFavorite(recommendation.rig.type === "knot" ? "knot" : "rig", recommendation.rig.id)}
            onPress={() => toggle(recommendation.rig.type === "knot" ? "knot" : "rig", recommendation.rig.id)}
            label={`Favorite ${recommendation.rig.name}`}
          />
        </View>
        <AppText>{recommendation.explanation}</AppText>
        <AppText>Recommended knot: {recommendation.knot.name}</AppText>
        <AppText>Bait/lure recommendation: {recommendation.baitAdvice}</AppText>
        <RigDiagram parts={recommendation.rig.parts} />
        <Stack>
          {recommendation.rig.steps.slice(0, 4).map((step, index) => (
            <Step key={step} index={index} step={step} />
          ))}
        </Stack>
        <YoutubeLink query={recommendation.rig.youtubeSearch} />
      </Card>

      <SectionHeader title="Rig and knot library" eyebrow="Searchable" />
      <View style={styles.segment}>
        {(["all", "knot", "rig"] as const).map((item) => (
          <Pressable key={item} onPress={() => setMode(item)} style={[styles.segmentButton, mode === item && styles.active]}>
            <AppText style={[styles.segmentText, mode === item && styles.activeText]}>
              {item === "all" ? "All" : item === "knot" ? "Knots" : "Rigs"}
            </AppText>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search trout, bass, bobber, jig, knot..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      {filtered.length > 0 ? (
        filtered.map((item) => (
          <Card key={item.id} style={styles.libraryCard}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <AppText variant="heading">{item.name}</AppText>
                <AppText variant="caption" style={styles.type}>
                  {item.type.toUpperCase()}
                </AppText>
              </View>
              <FavoriteButton
                active={isFavorite(item.type === "knot" ? "knot" : "rig", item.id)}
                onPress={() => toggle(item.type === "knot" ? "knot" : "rig", item.id)}
                label={`Favorite ${item.name}`}
              />
            </View>
            <AppText>{item.beginnerExplanation}</AppText>
            <AppText>When to use: {item.whenToUse}</AppText>
            <AppText>Works for: {item.worksFor.join(", ")}</AppText>
            <RigDiagram parts={item.parts} />
            <Stack>
              {item.steps.map((step, index) => (
                <Step key={step} index={index} step={step} />
              ))}
            </Stack>
            <YoutubeLink query={item.youtubeSearch} />
          </Card>
        ))
      ) : (
        <EmptyState icon="git-branch" title="No rigs or knots found" body="Try trout, bass, bobber, spinner, jig, Texas, or clear the search." />
      )}
    </Screen>
  );
}

function BuilderGroup<T extends string>({ label, value, options, onSelect }: { label: string; value: T; options: T[]; onSelect: (value: T) => void }) {
  return (
    <View style={styles.builderGroup}>
      <AppText variant="subheading">{label}</AppText>
      <View style={styles.optionRow}>
        {options.map((option) => (
          <Pressable key={option} onPress={() => onSelect(option)} style={[styles.option, value === option && styles.optionActive]}>
            <AppText variant="caption" style={[styles.optionText, value === option && styles.optionTextActive]}>
              {option}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Step({ index, step }: { index: number; step: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepBadge}>
        <AppText variant="caption" style={styles.stepNumber}>
          {index + 1}
        </AppText>
      </View>
      <AppText style={styles.stepText}>{step}</AppText>
    </View>
  );
}

function buildRigRecommendation(builder: Builder) {
  const knot = rigsAndKnots.find((item) => item.id === (builder.rod === "Baitcaster" ? "palomar-knot" : "improved-clinch-knot")) ?? rigsAndKnots[0];
  const rigId =
    builder.fish === "Bass" && builder.bait === "Soft plastics"
      ? "texas-rig"
      : builder.fish === "Bass"
        ? "carolina-rig"
        : builder.fish === "Perch" || builder.fish === "Not sure"
          ? "bobber-rig"
          : builder.fish === "Salmon"
            ? "jig"
            : builder.bait === "PowerBait"
              ? "trout-powerbait-rig"
              : builder.bait === "Spinners"
                ? "basic-spinner-setup"
              : builder.water === "River"
                ? "split-shot-rig"
                : "bobber-rig";
  const rig = rigsAndKnots.find((item) => item.id === rigId) ?? rigsAndKnots.find((item) => item.type === "rig") ?? rigsAndKnots[0];
  const baitAdvice =
    builder.bait === "None"
      ? "Start with worms or PowerBait for trout/perch, or one small spinner if you want to cast and move."
      : builder.bait === "Jigs"
        ? "Use a small jig around docks, rocks, or deeper edges. Pause often."
        : builder.bait === "Spinners"
          ? "Use a small inline spinner and retrieve just fast enough for the blade to turn."
          : `Use ${builder.bait.toLowerCase()} and keep the presentation small.`;
  const estimatedSuccess = Math.max(42, 84 - (builder.fish === "Salmon" ? 22 : 0) - (builder.water === "Saltwater" ? 10 : 0) + (builder.level === "Beginner" ? 4 : 0) + (builder.fish === "Not sure" ? 3 : 0));
  return {
    knot,
    rig,
    baitAdvice,
    estimatedSuccess,
    explanation: `${builder.water} fishing for ${builder.fish.toLowerCase()} with ${builder.bait.toLowerCase()} pairs best with a ${rig.name.toLowerCase()}. It keeps the presentation simple, works with your ${builder.rod.toLowerCase()}, and gives you a clear next cast.`
  };
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
  builderCard: {
    gap: spacing.md
  },
  builderGroup: {
    gap: spacing.sm
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  option: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  optionActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  optionText: {
    color: colors.ink,
    fontWeight: "900"
  },
  optionTextActive: {
    color: "#fff"
  },
  recommendation: {
    backgroundColor: "#fff6df",
    gap: spacing.md
  },
  segment: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: radii.sm,
    flex: 1,
    paddingVertical: spacing.sm
  },
  active: {
    backgroundColor: colors.pine
  },
  segmentText: {
    fontWeight: "800"
  },
  activeText: {
    color: "#fff"
  },
  search: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  libraryCard: {
    gap: spacing.md
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  flex: {
    flex: 1
  },
  type: {
    color: colors.pine,
    fontWeight: "900"
  },
  stepRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  stepBadge: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: radii.pill,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "900"
  },
  stepText: {
    flex: 1
  }
});
