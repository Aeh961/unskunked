import { Href, Link, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Autocomplete } from "@/src/components/Autocomplete";
import { Disclaimer } from "@/src/components/Disclaimer";
import { MissionCard } from "@/src/components/MissionCard";
import { Screen } from "@/src/components/Screen";
import { SearchInput } from "@/src/components/SearchInput";
import { getSuggestions } from "@/src/utils/autocomplete";
import { colors, spacing } from "@/src/theme";
import { getTrips, TripLog } from "@/src/utils/localStore";

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [draftTrip, setDraftTrip] = useState<TripLog | null>(null);
  const [recentTrips, setRecentTrips] = useState<TripLog[]>([]);

  useEffect(() => {
    getTrips().then((trips) => {
      setDraftTrip(trips.find((trip) => trip.status === "draft") ?? null);
      setRecentTrips(trips.filter((trip) => trip.status !== "draft").slice(0, 3));
    });
  }, []);

  const suggestions = useMemo(() => getSuggestions(query), [query]);

  function goBuildPlan() {
    const trimmed = query.trim();
    router.push((trimmed ? `/trips?q=${encodeURIComponent(trimmed)}` : "/trips") as Href);
  }

  function selectSuggestion(route: string) {
    setQuery("");
    router.push(route as Href);
  }

  return (
    <Screen>
      <View style={styles.topRow}>
        <AppText variant="displayLarge">UNSKUNKED</AppText>
        <Link href={"/settings" as Href} asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Settings and more" style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color={colors.amber} />
          </Pressable>
        </Link>
      </View>

      <AppText variant="display" style={styles.question}>WHAT ARE YOU GOING AFTER?</AppText>

      <SearchInput
        accessibilityLabel="Type what you're fishing, clamming, or crabbing for"
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
        onSubmitEditing={goBuildPlan}
        placeholder="Rainbow trout, Dungeness crab, Green Lake..."
        returnKeyType="go"
      />
      <Autocomplete items={suggestions} onSelect={(item) => item.route && selectSuggestion(item.route)} />

      <Pressable accessibilityRole="button" accessibilityLabel="Build my plan" style={styles.buildButton} onPress={goBuildPlan}>
        <AppText style={styles.buildButtonText}>BUILD MY PLAN</AppText>
      </Pressable>

      {draftTrip ? (
        <MissionCard
          eyebrow="Continue Mission"
          title={`${draftTrip.speciesCaught} at ${draftTrip.location}`}
          meta={[draftTrip.date, draftTrip.weather]}
          onPress={() => router.push("/trips" as Href)}
        />
      ) : null}

      {recentTrips.length > 0 ? (
        <View style={styles.recentSection}>
          <AppText variant="caption" style={styles.recentLabel}>FIELD NOTES</AppText>
          {recentTrips.map((trip) => (
            <MissionCard
              key={trip.id}
              eyebrow={trip.date}
              title={`${trip.speciesCaught} at ${trip.location}`}
              meta={[`${trip.numberCaught} caught`, trip.result]}
              onPress={() => router.push("/log" as Href)}
            />
          ))}
        </View>
      ) : null}

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
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  question: {
    marginTop: spacing.md
  },
  buildButton: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderColor: colors.forest,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  buildButtonText: {
    color: colors.ink,
    fontWeight: "900",
    letterSpacing: 1
  },
  recentSection: {
    gap: spacing.sm
  },
  recentLabel: {
    color: colors.amber,
    fontWeight: "900",
    letterSpacing: 1
  }
});
