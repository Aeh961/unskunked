import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { BetaInsights, calculateBetaInsights } from "@/src/services/betaInsights";
import { colors, radii, spacing } from "@/src/theme";
import { getBetaEvents, getDemoSearchHistory, getFavorites, getFeedback, getTripPlans, getTrips } from "@/src/utils/localStore";

export default function BetaInsightsScreen() {
  const [insights, setInsights] = useState<BetaInsights | null>(null);

  useEffect(() => {
    Promise.all([getBetaEvents(), getDemoSearchHistory(), getFeedback(), getTrips(), getTripPlans(), getFavorites()]).then(
      ([events, searches, feedback, trips, tripPlans, favorites]) => {
        setInsights(calculateBetaInsights({ events, searches, feedback, trips, tripPlans, favorites }));
      }
    );
  }, []);

  if (!insights) {
    return (
      <Screen>
        <EmptyState icon="analytics" title="Loading beta insights" body="Reading local-only usage patterns from this device." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Beta Insights</AppText>
        <AppText style={styles.heroText}>Local-only product analytics. Nothing leaves this device.</AppText>
      </View>
      <Insight title="Most viewed fish" items={insights.mostViewedFish} />
      <Insight title="Most viewed waterbodies" items={insights.mostViewedWaterbodies} />
      <Insight title="Most used rigs" items={insights.mostUsedRigs} />
      <Insight title="Trip planner choices" items={insights.plannerChoices} />
      <Insight title="Search terms" items={insights.searchedTerms} />
      <Insight title="Feedback categories" items={insights.feedbackCategories} />
    </Screen>
  );
}

function Insight({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <SectionHeader title={title} eyebrow={`${items.length} local signals`} />
      {items.length ? (
        <Stack>
          {items.map((item) => (
            <AppText key={item}>- {item}</AppText>
          ))}
        </Stack>
      ) : (
        <AppText>Not enough local beta activity yet.</AppText>
      )}
    </Card>
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
  }
});
