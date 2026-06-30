import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { calculateTripAnalytics, TripAnalytics } from "@/src/services/tripAnalytics";
import { colors, radii, spacing } from "@/src/theme";
import { getTrips } from "@/src/utils/localStore";

export default function FishingStatsScreen() {
  const [analytics, setAnalytics] = useState<TripAnalytics | null>(null);

  useEffect(() => {
    getTrips().then((trips) => setAnalytics(calculateTripAnalytics(trips)));
  }, []);

  if (!analytics) {
    return (
      <Screen>
        <EmptyState icon="stats-chart" title="Loading stats" body="Crunching your local trip history." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Fishing Stats</AppText>
        <AppText style={styles.heroText}>Turn trip logs into patterns you can use on the next cast.</AppText>
      </View>

      <View style={styles.grid}>
        <Stat label="Total trips" value={`${analytics.totalTrips}`} />
        <Stat label="Unskunked" value={`${analytics.unskunkedTrips}`} />
        <Stat label="Skunked" value={`${analytics.skunkedTrips}`} />
        <Stat label="Success" value={`${analytics.unskunkedRatio}%`} />
      </View>

      <Insight title="Best locations" items={analytics.bestLocations} />
      <Insight title="Best bait" items={analytics.bestBait} />
      <Insight title="Best rigs" items={analytics.bestRigs} />
      <Insight title="Most caught species" items={analytics.mostCaughtSpecies} />

      <Card>
        <SectionHeader title="Best time of day" eyebrow="Inferred" />
        <AppText variant="heading">{analytics.bestTimeOfDay}</AppText>
      </Card>

      <Card>
        <SectionHeader title="Monthly activity" eyebrow={`${analytics.monthlyActivity.length} months`} />
        <Stack>
          {analytics.monthlyActivity.map((item) => (
            <View key={item.month} style={styles.row}>
              <AppText style={styles.flex}>{item.month}</AppText>
              <AppText variant="subheading">{item.trips}</AppText>
            </View>
          ))}
        </Stack>
      </Card>

      <Card>
        <SectionHeader title="Personal records" eyebrow="Local only" />
        <Stack>
          {analytics.personalRecords.map((item) => (
            <View key={item.label} style={styles.row}>
              <AppText style={styles.flex}>{item.label}</AppText>
              <AppText variant="caption" style={styles.badge}>{item.value}</AppText>
            </View>
          ))}
        </Stack>
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" style={styles.statLabel}>{label}</AppText>
    </View>
  );
}

function Insight({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <SectionHeader title={title} eyebrow={`${items.length} ranked`} />
      {items.length ? (
        <Stack>
          {items.map((item) => (
            <AppText key={item}>- {item}</AppText>
          ))}
        </Stack>
      ) : (
        <AppText>Not enough successful trip data yet.</AppText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.forest,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  stat: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: "48%",
    padding: spacing.md
  },
  statLabel: {
    fontWeight: "900"
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  flex: {
    flex: 1
  },
  badge: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    color: colors.pine,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  }
});
