import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { StatusBadge } from "@/src/components/StatusBadge";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { colors, spacing } from "@/src/theme";

export default function FishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fish = fishSpecies.find((item) => item.id === id);

  if (!fish) {
    return (
      <Screen>
        <EmptyState
          icon="fish"
          title="Fish not found"
          body="That species is not in the local MVP catalog yet. Head back to the Fish tab and pick one from the list."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.imagePlaceholder}>
        <AppText style={styles.placeholderText}>{fish.name}</AppText>
      </View>
      <View style={styles.row}>
        <AppText variant="title" style={styles.title}>
          {fish.name}
        </AppText>
        <StatusBadge status={fish.status} />
      </View>
      <Disclaimer />

      <Card>
        <AppText variant="heading">Quick read</AppText>
        <Stack>
          <AppText>Difficulty: {fish.difficulty}</AppText>
          <AppText>Start with: {fish.bestBait[0]} or {fish.bestLures[0]}</AppText>
          <AppText>Beginner line: {fish.line}</AppText>
        </Stack>
      </Card>

      <Card>
        <AppText variant="heading">Rules snapshot</AppText>
        <Stack>
          <AppText>Legal status: {fish.regulation.status}</AppText>
          <AppText>Season: {fish.regulation.season}</AppText>
          <AppText>Daily limit: {fish.regulation.dailyLimit}</AppText>
          <AppText>Size limit: {fish.regulation.sizeLimit}</AppText>
          <AppText>Restrictions: {fish.regulation.restrictions.join(" ")}</AppText>
          <AppText variant="caption" style={styles.warning}>
            {fish.regulation.warning}
          </AppText>
        </Stack>
      </Card>

      <Card>
        <AppText variant="heading">Setup</AppText>
        <Stack>
          <AppText>Best bait: {fish.bestBait.join(", ")}</AppText>
          <AppText>Best lures: {fish.bestLures.join(", ")}</AppText>
          <AppText>Rod/reel: {fish.rodSetup}</AppText>
          <AppText>Line: {fish.line}</AppText>
          <AppText>Hook: {fish.hook}</AppText>
          <AppText>Best knots: {fish.knots.join(", ")}</AppText>
        </Stack>
      </Card>

      <Card>
        <AppText variant="heading">Beginner tips</AppText>
        {fish.tips.map((tip) => (
          <View key={tip} style={styles.tipRow}>
            <View style={styles.tipDot} />
            <AppText style={styles.tipText}>{tip}</AppText>
          </View>
        ))}
      </Card>

      <Card>
        <AppText variant="heading">Watch and Learn</AppText>
        {fish.youtubeSearches.map((query) => (
          <YoutubeLink key={query} query={query} />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: colors.river,
    borderRadius: 8,
    height: 170,
    justifyContent: "center"
  },
  placeholderText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  title: {
    flex: 1
  },
  warning: {
    color: colors.danger,
    fontWeight: "700"
  },
  tipRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  tipDot: {
    backgroundColor: colors.river,
    borderRadius: 999,
    height: 8,
    marginTop: 7,
    width: 8
  },
  tipText: {
    flex: 1
  }
});
