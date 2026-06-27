import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { Screen } from "@/src/components/Screen";
import { StatusBadge } from "@/src/components/StatusBadge";
import { fishSpecies } from "@/src/data/fish";
import { colors, spacing } from "@/src/theme";

export default function FishScreen() {
  return (
    <Screen>
      <AppText variant="title">Fish</AppText>
      <Disclaimer />
      {fishSpecies.map((fish) => (
        <Link key={fish.id} href={`/fish/${fish.id}`} asChild>
          <Pressable>
            <Card>
              <View style={styles.row}>
                <AppText variant="heading" style={styles.title}>
                  {fish.name}
                </AppText>
                <StatusBadge status={fish.status} />
              </View>
              <AppText>Difficulty: {fish.difficulty}</AppText>
              <AppText>Best bait: {fish.bestBait.join(", ")}</AppText>
              <AppText variant="caption" style={styles.warning}>
                {fish.regulation.warning}
              </AppText>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  title: {
    flex: 1
  },
  warning: {
    color: colors.danger,
    fontWeight: "700"
  }
});
