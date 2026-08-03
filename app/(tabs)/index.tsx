import { Href, Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { ActivityType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { personalizationService, PersonalizedRecommendation } from "@/src/services/personalization";
import { getMockWeather, getSunWindows } from "@/src/services/fishingConditions";
import { defaultManualLocation, getNearbyWaterbodies } from "@/src/services/location";
import { colors, radii, spacing } from "@/src/theme";
import { getFavorites, getOnboardingProfile, getTrips, TripLog } from "@/src/utils/localStore";

const activityButtons: Array<{ activity: ActivityType; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { activity: "fishing", label: "Go Fishing", icon: "fish" },
  { activity: "crabbing", label: "Go Crabbing", icon: "boat" },
  { activity: "clamming", label: "Go Clamming", icon: "sunny" }
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);
  const [recentTrips, setRecentTrips] = useState<TripLog[]>([]);

  useEffect(() => {
    Promise.all([getOnboardingProfile(), getFavorites(), getTrips()]).then(([profile, favorites, trips]) => {
      const month = new Date().toLocaleString("en-US", { month: "long" });
      setRecommendation(personalizationService.buildRecommendation({ ...profile, month }, favorites, trips));
      setRecentTrips(trips.slice(-3).reverse());
    });
  }, []);

  const nearbyPick = useMemo(
    () => getNearbyWaterbodies(defaultManualLocation.coordinates, { beginnerOnly: true, limit: 1 })[0],
    []
  );
  const conditions = useMemo(() => {
    const weather = getMockWeather(nearbyPick ?? waterbodies[0]);
    const sun = getSunWindows();
    return { weather, sun };
  }, [nearbyPick]);

  return (
    <Screen>
      <View style={styles.topRow}>
        <AppText variant="heading">{getGreeting()}</AppText>
        <View style={styles.iconRow}>
          <Link href={"/search" as Href} asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="Search" style={styles.iconButton}>
              <Ionicons name="search" size={20} color={colors.forest} />
            </Pressable>
          </Link>
          <Link href={"/settings" as Href} asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="Settings and more" style={styles.iconButton}>
              <Ionicons name="settings-outline" size={20} color={colors.forest} />
            </Pressable>
          </Link>
        </View>
      </View>
      <AppText variant="title" style={styles.question}>What would you like to do today?</AppText>

      <View style={styles.activityGrid}>
        {activityButtons.map((item) => (
          <Link key={item.activity} href={`/plan?activity=${item.activity}` as Href} asChild>
            <Pressable style={styles.activityButton} accessibilityRole="button" accessibilityLabel={item.label}>
              <Ionicons name={item.icon} size={32} color="#fff" />
              <AppText style={styles.activityLabel}>{item.label}</AppText>
            </Pressable>
          </Link>
        ))}
      </View>

      {nearbyPick ? (
        <Card style={styles.card}>
          <SectionHeader title="Nearby recommendation" eyebrow={`${nearbyPick.distanceMiles} mi from Seattle fallback`} />
          <AppText>{nearbyPick.name}: {nearbyPick.todayRecommendation}</AppText>
          <Link href={"/map" as Href} asChild>
            <Pressable accessibilityRole="button" style={styles.cardLink}>
              <AppText style={styles.cardLinkText}>See on map</AppText>
              <Ionicons name="chevron-forward" size={16} color={colors.pine} />
            </Pressable>
          </Link>
        </Card>
      ) : null}

      <Card style={styles.card}>
        <SectionHeader title="Today's conditions" eyebrow="Offline estimate" />
        <AppText>{conditions.weather.airTempF}°F · wind {conditions.weather.windMph} mph · {conditions.sun.morningBite} morning bite window</AppText>
        <Link href={"/weather" as Href} asChild>
          <Pressable accessibilityRole="button" style={styles.cardLink}>
            <AppText style={styles.cardLinkText}>Full forecast</AppText>
            <Ionicons name="chevron-forward" size={16} color={colors.pine} />
          </Pressable>
        </Link>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Recent trips" eyebrow={recommendation?.reason} />
        {recentTrips.length === 0 ? (
          <EmptyState icon="journal" title="No trips logged yet" body="Log your first trip after fishing to start building your own patterns." />
        ) : (
          recentTrips.map((trip) => (
            <AppText key={trip.id}>{trip.location}: {trip.numberCaught} {trip.speciesCaught} ({trip.result})</AppText>
          ))
        )}
        <Link href={"/log" as Href} asChild>
          <Pressable accessibilityRole="button" style={styles.cardLink}>
            <AppText style={styles.cardLinkText}>Trip log</AppText>
            <Ionicons name="chevron-forward" size={16} color={colors.pine} />
          </Pressable>
        </Link>
      </Card>

      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  question: {
    marginBottom: spacing.xs
  },
  activityGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  activityButton: {
    alignItems: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    flex: 1,
    gap: spacing.sm,
    paddingVertical: spacing.lg
  },
  activityLabel: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center"
  },
  card: {
    gap: spacing.sm
  },
  cardLink: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.xxs
  },
  cardLinkText: {
    color: colors.pine,
    fontWeight: "900"
  }
});
