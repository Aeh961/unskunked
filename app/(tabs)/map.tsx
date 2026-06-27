import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { Screen, Stack } from "@/src/components/Screen";
import { StatusBadge } from "@/src/components/StatusBadge";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { waterbodies } from "@/src/data/waterbodies";
import { colors, spacing } from "@/src/theme";
import { searchByFields } from "@/src/utils/search";

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(waterbodies[0].id);
  const filtered = useMemo(
    () => searchByFields(waterbodies, query, [(water) => water.name, (water) => water.region]),
    [query]
  );
  const selected = waterbodies.find((water) => water.id === selectedId) ?? filtered[0] ?? waterbodies[0];
  const species = selected.speciesIds
    .map((id) => fishSpecies.find((fish) => fish.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Screen>
      <AppText variant="title">Map</AppText>
      <AppText>This MVP uses a searchable Washington waterbody list while native map setup stays optional.</AppText>
      <Disclaimer />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search lakes, rivers, or regions"
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      <View style={styles.list}>
        {filtered.map((water) => (
          <Pressable
            key={water.id}
            onPress={() => setSelectedId(water.id)}
            style={[styles.waterButton, selected.id === water.id && styles.waterButtonActive]}
          >
            <AppText style={[styles.waterText, selected.id === water.id && styles.waterTextActive]}>
              {water.name}
            </AppText>
          </Pressable>
        ))}
      </View>

      <Card>
        <View style={styles.row}>
          <AppText variant="heading" style={styles.flex}>
            {selected.name}
          </AppText>
          <StatusBadge status={selected.status} />
        </View>
        <Stack>
          <AppText>Likely fish: {species}</AppText>
          <AppText>Mock regulation summary: {selected.regulationSummary}</AppText>
          <AppText>Suggested bait/lures: {selected.suggestedBait.join(", ")}</AppText>
          <AppText>Beginner setup: {selected.beginnerSetup}</AppText>
        </Stack>
        <YoutubeLink query={selected.youtubeSearch} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  waterButton: {
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  waterButtonActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  waterText: {
    color: colors.ink,
    fontWeight: "700"
  },
  waterTextActive: {
    color: "#fff"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  flex: {
    flex: 1
  }
});
