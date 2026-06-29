import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { SectionHeader } from "@/src/components/SectionHeader";
import { Screen, Stack } from "@/src/components/Screen";
import { colors, radii, spacing } from "@/src/theme";

const quickLinks = [
  { label: "Find Water", href: "/map", icon: "navigate", hint: "Search nearby-style demo spots" },
  { label: "Pick a Fish", href: "/fish", icon: "fish", hint: "Choose bait and gear" },
  { label: "Tie a Rig", href: "/rigs", icon: "git-branch", hint: "Simple steps and diagrams" },
  { label: "Ask", href: "/ask", icon: "chatbubble-ellipses", hint: "Local beginner answers" },
  { label: "Log Trip", href: "/log", icon: "journal", hint: "Track catches and patterns" },
  { label: "Plan Trip", href: "/plan", icon: "calendar", hint: "Generate a trip checklist" },
  { label: "Learn", href: "/learn", icon: "school", hint: "Basics, knots, glossary" },
  { label: "Favorites", href: "/favorites", icon: "heart", hint: "Saved fish, waters, rigs" },
  { label: "Settings", href: "/settings", icon: "settings", hint: "Demo mode and data" }
] as const;

const beginnerPlan = [
  "Choose a waterbody and check its status.",
  "Pick one target fish instead of packing every lure.",
  "Tie a beginner rig, then watch one short setup video.",
  "Verify official rules before keeping anything."
];

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={16} color={colors.ink} />
            <AppText variant="caption" style={styles.heroBadgeText}>
              V2 local-first demo
            </AppText>
          </View>
          <View style={styles.weatherBadge}>
            <Ionicons name="partly-sunny" size={16} color={colors.forest} />
            <AppText variant="caption" style={styles.weatherText}>
              Dawn bite window
            </AppText>
          </View>
        </View>
        <AppText variant="hero" style={styles.heroTitle}>Unskunked</AppText>
        <AppText style={styles.tagline}>Beginner-friendly fishing plans: pick water, choose a target, build a rig, and log what worked.</AppText>
        <Link href={"/start" as Href} asChild>
          <Button icon="compass" style={styles.startButton}>Start here</Button>
        </Link>
      </View>

      <View style={styles.statusGrid}>
        <Card style={styles.statusCard}>
          <AppText variant="caption" style={styles.statusLabel}>Best first target</AppText>
          <AppText variant="subheading">Trout or perch</AppText>
        </Card>
        <Card style={styles.statusCard}>
          <AppText variant="caption" style={styles.statusLabel}>Default rig</AppText>
          <AppText variant="subheading">Bobber + worm</AppText>
        </Card>
      </View>

      <Card style={styles.recommendationCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="sunny" size={24} color={colors.forest} />
          <View style={styles.stepText}>
            <AppText variant="heading">Today&apos;s recommendation</AppText>
            <AppText>Fish Green Lake before 9 AM with a bobber rig, worms, and a backup PowerBait setup.</AppText>
          </View>
        </View>
        <Link href={"/plan" as Href} asChild>
          <Button icon="calendar" variant="secondary">Plan this trip</Button>
        </Link>
      </Card>

      <View style={styles.statusGrid}>
        <Card style={styles.statusCard}>
          <AppText variant="caption" style={styles.statusLabel}>Continue previous trip</AppText>
          <AppText variant="subheading">Lake Washington perch</AppText>
        </Card>
        <Card style={styles.statusCard}>
          <AppText variant="caption" style={styles.statusLabel}>Weather placeholder</AppText>
          <AppText variant="subheading">Cool AM, light wind</AppText>
        </Card>
      </View>

      <Card style={styles.favoriteCard}>
        <SectionHeader title="Favorite lakes" eyebrow="Demo mode" />
        <View style={styles.badgeRow}>
          {["Green Lake", "Lake Washington", "Edmonds Pier"].map((name) => (
            <View key={name} style={styles.badge}>
              <AppText variant="caption" style={styles.badgeText}>{name}</AppText>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader title="Choose your next move" eyebrow="Product flow" />
      <View style={styles.quickGrid}>
        {quickLinks.map((item) => (
            <Link key={item.label} href={item.href as Href} asChild>
            <Pressable style={styles.quickButton}>
              <Ionicons name={item.icon} size={22} color="#fff" />
              <View style={styles.quickCopy}>
                <AppText style={styles.quickText}>{item.label}</AppText>
                <AppText variant="caption" style={styles.quickHint}>
                  {item.hint}
                </AppText>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>

      <Disclaimer />

      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="compass" size={22} color={colors.pine} />
          <AppText variant="heading" style={styles.stepText}>
            Demo game plan
          </AppText>
        </View>
        <Stack>
          {beginnerPlan.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepDot}>
                <AppText variant="caption" style={styles.stepNumber}>
                  {index + 1}
                </AppText>
              </View>
              <AppText style={styles.stepText}>{step}</AppText>
            </View>
          ))}
        </Stack>
      </Card>
      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="trophy" size={22} color={colors.sunrise} />
          <AppText variant="heading" style={styles.stepText}>
            Recent catches
          </AppText>
        </View>
        <AppText>7 yellow perch at Lake Washington on worms and a bobber rig. Log your next trip to build your own pattern.</AppText>
      </Card>
      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="leaf" size={22} color={colors.pine} />
          <AppText variant="heading" style={styles.stepText}>
            Keep it simple
          </AppText>
        </View>
        <AppText>Start with easy targets like stocked trout or perch, use small hooks, and fish the first or last hour of daylight.</AppText>
      </Card>
      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={22} color={colors.danger} />
          <AppText variant="heading" style={styles.stepText}>
            Rules first
          </AppText>
        </View>
        <AppText>Unskunked shows friendly mock summaries. Always check the official waterbody, season, limit, size, and closure rules before you cast.</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  heroBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.sun,
    borderRadius: 999,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  heroBadgeText: {
    color: colors.ink,
    fontWeight: "900"
  },
  weatherBadge: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  weatherText: {
    color: colors.forest,
    fontWeight: "900"
  },
  heroTitle: {
    color: "#fff"
  },
  tagline: {
    color: "#eef7ef",
    fontSize: 18,
    fontWeight: "600"
  },
  startButton: {
    alignSelf: "flex-start",
    marginTop: spacing.sm
  },
  statusGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  statusCard: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  statusLabel: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  recommendationCard: {
    backgroundColor: "#fff6df",
    gap: spacing.md
  },
  favoriteCard: {
    gap: spacing.md
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  badge: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  badgeText: {
    color: colors.forest,
    fontWeight: "900"
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  quickButton: {
    alignItems: "center",
    backgroundColor: colors.river,
    borderRadius: 8,
    flexBasis: "48%",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 78,
    padding: spacing.md
  },
  quickCopy: {
    flex: 1,
    gap: 2
  },
  quickText: {
    color: "#fff",
    flex: 1,
    fontWeight: "800"
  },
  quickHint: {
    color: "#eaf7fb"
  },
  stepRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  stepDot: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "900"
  },
  stepText: {
    flex: 1
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  }
});
