import { Href, Link, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Autocomplete } from "@/src/components/Autocomplete";
import { Disclaimer } from "@/src/components/Disclaimer";
import { MissionCard } from "@/src/components/MissionCard";
import { SearchInput } from "@/src/components/SearchInput";
import { SkunkMascot } from "@/src/components/SkunkMascot";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { getSuggestions } from "@/src/utils/autocomplete";
import { colors, radii, spacing } from "@/src/theme";
import { getTrips, TripLog } from "@/src/utils/localStore";

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [draftTrip, setDraftTrip] = useState<TripLog | null>(null);
  const [recentTrips, setRecentTrips] = useState<TripLog[]>([]);
  const reducedMotion = useReducedMotion();
  const pressScale = useRef(new Animated.Value(1)).current;
  const pressBorder = useRef(new Animated.Value(0)).current;

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

  function pressIn() {
    if (reducedMotion) {
      pressScale.setValue(0.98);
      return;
    }
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true, friction: 6 }),
      Animated.timing(pressBorder, { toValue: 1, duration: 100, useNativeDriver: false })
    ]).start();
  }

  function pressOut() {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(pressBorder, { toValue: 0, duration: 160, useNativeDriver: false })
    ]).start();
  }

  const borderColor = pressBorder.interpolate({ inputRange: [0, 1], outputRange: [colors.forest, colors.amber] });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topRow}>
            <AppText variant="displayLarge">SKUNKED</AppText>
            <Link href={"/settings" as Href} asChild>
              <Pressable accessibilityRole="button" accessibilityLabel="Settings and more" style={styles.iconButton}>
                <Ionicons name="settings-outline" size={20} color={colors.amber} />
              </Pressable>
            </Link>
          </View>

          <View style={styles.hero}>
            <AppText variant="display" style={styles.question}>WHAT ARE YOU GOING AFTER?</AppText>

            <View style={styles.heroInput}>
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
            </View>

            <Pressable accessibilityRole="button" accessibilityLabel="Build plan" onPressIn={pressIn} onPressOut={pressOut} onPress={goBuildPlan}>
              <Animated.View style={[styles.buildButton, { transform: [{ scale: pressScale }], borderColor }]}>
                <AppText style={styles.buildButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  BUILD PLAN
                </AppText>
              </Animated.View>
            </Pressable>
          </View>

          <View style={styles.belowFold}>
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

            <View style={styles.mascotRow}>
              <SkunkMascot variant="idle" size={56} />
            </View>

            <Disclaimer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1
  },
  flex: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl
  },
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
  hero: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    gap: spacing.lg,
    justifyContent: "center",
    maxWidth: 520,
    paddingVertical: spacing.xl,
    width: "100%"
  },
  question: {
    flexShrink: 1,
    textAlign: "center",
    width: "100%"
  },
  heroInput: {
    gap: spacing.sm,
    width: "100%"
  },
  buildButton: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: radii.md,
    borderWidth: 3,
    justifyContent: "center",
    minHeight: 56,
    minWidth: 220,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md
  },
  buildButtonText: {
    color: colors.ink,
    fontWeight: "900",
    letterSpacing: 1.5
  },
  belowFold: {
    gap: spacing.md
  },
  recentSection: {
    gap: spacing.sm
  },
  recentLabel: {
    color: colors.amber,
    fontWeight: "900",
    letterSpacing: 1
  },
  mascotRow: {
    alignItems: "flex-end"
  }
});
