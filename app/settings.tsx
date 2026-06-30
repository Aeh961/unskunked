import { useEffect, useState } from "react";
import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { regions, RegionId } from "@/src/data/regions";
import { personalizationService, PersonalizedRecommendation } from "@/src/services/personalization";
import { colors, radii, spacing } from "@/src/theme";
import {
  getFavorites,
  getDemoNotifications,
  getDemoProfiles,
  getDemoRecommendations,
  getDemoSearchHistory,
  getOnboardingProfile,
  getSelectedRegion,
  getTrips,
  isDemoModeEnabled,
  seedDemoData,
  setDemoModeEnabled,
  setSelectedRegion
} from "@/src/utils/localStore";

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [region, setRegion] = useState<RegionId>("washington");
  const [personalized, setPersonalized] = useState<PersonalizedRecommendation | null>(null);

  async function refresh() {
    const [demoEnabled, demoProfiles, demoNotifications, demoRecommendations, demoSearches, selectedRegion, profile, favorites, trips] = await Promise.all([
      isDemoModeEnabled(),
      getDemoProfiles(),
      getDemoNotifications(),
      getDemoRecommendations(),
      getDemoSearchHistory(),
      getSelectedRegion(),
      getOnboardingProfile(),
      getFavorites(),
      getTrips()
    ]);
    setEnabled(demoEnabled);
    setRegion(selectedRegion);
    setProfiles(demoProfiles.map((profile) => `${profile.label}: ${profile.homeWater} · ${profile.favoriteTarget}`));
    setNotifications(demoNotifications.map((item) => item.title));
    setRecommendations(demoRecommendations.map((item) => item.title));
    setSearchHistory(demoSearches);
    setPersonalized(personalizationService.buildRecommendation({ ...profile, month: "July" }, favorites, trips));
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

  async function chooseRegion(nextRegion: RegionId) {
    setRegion(nextRegion);
    await setSelectedRegion(nextRegion);
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

      <Card style={styles.card}>
        <SectionHeader title="Safety and legal" eyebrow="Global disclaimer" />
        <Stack>
          <AppText>Unskunked is for planning and education only.</AppText>
          <AppText>Do not rely on this app as legal advice. Always verify official rules, emergency rules, license requirements, seasons, limits, size rules, closures, and gear restrictions before fishing or keeping fish.</AppText>
        </Stack>
        <View style={styles.actionRow}>
          <Link href={"/about" as Href} asChild>
            <Button icon="information-circle" variant="secondary" style={styles.actionButton}>About</Button>
          </Link>
          <Link href={"/feedback" as Href} asChild>
            <Button icon="chatbox" variant="secondary" style={styles.actionButton}>Feedback</Button>
          </Link>
          <Link href={"/export" as Href} asChild>
            <Button icon="share-social" variant="secondary" style={styles.actionButton}>Export</Button>
          </Link>
          <Link href={"/insights" as Href} asChild>
            <Button icon="analytics" variant="secondary" style={styles.actionButton}>Insights</Button>
          </Link>
          <Link href={"/offline" as Href} asChild>
            <Button icon="download" variant="secondary" style={styles.actionButton}>Offline</Button>
          </Link>
          <Link href={"/data-sources" as Href} asChild>
            <Button icon="shield-checkmark" variant="secondary" style={styles.actionButton}>Sources</Button>
          </Link>
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Selected region" eyebrow="Data source" />
        <View style={styles.regionGrid}>
          {regions.map((item) => (
            <Pressable key={item.id} onPress={() => chooseRegion(item.id)} style={[styles.regionCard, region === item.id && styles.regionActive]}>
              <AppText variant="subheading" style={region === item.id && styles.regionActiveText}>{item.name}</AppText>
              <AppText variant="caption" style={region === item.id && styles.regionActiveText}>{item.status}</AppText>
            </Pressable>
          ))}
        </View>
        <AppText variant="caption">{regions.find((item) => item.id === region)?.note}</AppText>
      </Card>

      {personalized ? (
        <Card style={styles.card}>
          <SectionHeader title="Personalized next action" eyebrow="Local engine" />
          <Stack>
            <AppText>Waterbody: {personalized.waterbody}</AppText>
            <AppText>Target: {personalized.targetSpecies}</AppText>
            <AppText>Bait/Lure: {personalized.baitOrLure}</AppText>
            <AppText>Rig/Knot: {personalized.rig} · {personalized.knot}</AppText>
            <AppText>Learn: {personalized.learningContent}</AppText>
            <AppText style={styles.recommendation}>{personalized.nextBestAction}</AppText>
            <AppText variant="caption">{personalized.reason}</AppText>
          </Stack>
        </Card>
      ) : null}

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
  },
  regionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  regionCard: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: "48%",
    gap: spacing.xs,
    padding: spacing.md
  },
  regionActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  regionActiveText: {
    color: "#fff"
  },
  recommendation: {
    color: colors.pine,
    fontWeight: "900"
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  actionButton: {
    flexBasis: "31%"
  }
});
