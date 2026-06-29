import { useEffect, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors, radii, spacing } from "@/src/theme";
import {
  getDemoNotifications,
  getDemoProfiles,
  getDemoRecommendations,
  getDemoSearchHistory,
  isDemoModeEnabled,
  seedDemoData,
  setDemoModeEnabled
} from "@/src/utils/localStore";

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  async function refresh() {
    const [demoEnabled, demoProfiles, demoNotifications, demoRecommendations, demoSearches] = await Promise.all([
      isDemoModeEnabled(),
      getDemoProfiles(),
      getDemoNotifications(),
      getDemoRecommendations(),
      getDemoSearchHistory()
    ]);
    setEnabled(demoEnabled);
    setProfiles(demoProfiles.map((profile) => `${profile.label}: ${profile.homeWater} · ${profile.favoriteTarget}`));
    setNotifications(demoNotifications.map((item) => item.title));
    setRecommendations(demoRecommendations.map((item) => item.title));
    setSearchHistory(demoSearches);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function toggleDemo(value: boolean) {
    await setDemoModeEnabled(value);
    await refresh();
  }

  async function reseed() {
    await seedDemoData();
    await refresh();
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Settings</AppText>
        <AppText style={styles.heroText}>Demo controls for investor walkthroughs, screenshots, and early beta reviews.</AppText>
      </View>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <SectionHeader title="Demo Mode" eyebrow={__DEV__ ? "Auto-enabled in development" : "Manual"} />
            <AppText>Preload favorites, sample trips, beginner profiles, recommendations, notifications, and search history.</AppText>
          </View>
          <Switch value={enabled} onValueChange={toggleDemo} trackColor={{ true: colors.river, false: colors.line }} thumbColor={enabled ? colors.sun : colors.surfaceStrong} />
        </View>
        <Button icon="refresh" variant="secondary" onPress={reseed}>Reload demo data</Button>
      </Card>

      <DemoSection title="Profiles" items={profiles} />
      <DemoSection title="Sample notifications" items={notifications} />
      <DemoSection title="Example recommendations" items={recommendations} />
      <DemoSection title="Example search history" items={searchHistory} />
    </Screen>
  );
}

function DemoSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <SectionHeader title={title} eyebrow={`${items.length} loaded`} />
      <Stack>
        {items.map((item) => (
          <View key={item} style={styles.bullet}>
            <View style={styles.dot} />
            <AppText style={styles.flex}>{item}</AppText>
          </View>
        ))}
      </Stack>
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
  },
  card: {
    gap: spacing.md
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  flex: {
    flex: 1
  },
  bullet: {
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
  }
});
