import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { RigDiagram } from "@/src/components/RigDiagram";
import { Screen, Stack } from "@/src/components/Screen";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { rigsAndKnots } from "@/src/data/rigs";
import { colors, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";

export default function RigsScreen() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"all" | "knot" | "rig">("all");
  const filtered = useMemo(() => {
    const byMode = mode === "all" ? rigsAndKnots : rigsAndKnots.filter((item) => item.type === mode);
    return searchByFields(byMode, query, [(item) => item.name, (item) => item.worksFor, (item) => item.whenToUse]);
  }, [mode, query]);

  return (
    <Screen>
      <AppText variant="title">Rigs & Knots</AppText>
      <Disclaimer />
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
        placeholder="Search trout, bass, bobber, knot..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      {filtered.map((item) => (
        <Card key={item.id}>
          <View style={styles.row}>
            <AppText variant="heading" style={styles.flex}>
              {item.name}
            </AppText>
            <AppText variant="caption" style={styles.type}>
              {item.type.toUpperCase()}
            </AppText>
          </View>
          <AppText>{item.beginnerExplanation}</AppText>
          <AppText>When to use: {item.whenToUse}</AppText>
          <AppText>Works for: {item.worksFor.join(", ")}</AppText>
          <RigDiagram parts={item.parts} />
          <Stack>
            {item.steps.map((step, index) => (
              <AppText key={step}>
                {index + 1}. {step}
              </AppText>
            ))}
          </Stack>
          <YoutubeLink query={item.youtubeSearch} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 6,
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
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  flex: {
    flex: 1
  },
  type: {
    color: colors.pine,
    fontWeight: "900"
  }
});
