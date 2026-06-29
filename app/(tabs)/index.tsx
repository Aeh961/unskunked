import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { Screen, Stack } from "@/src/components/Screen";
import { colors, spacing } from "@/src/theme";

const quickLinks = [
  { label: "Find Water", href: "/map", icon: "navigate", hint: "Search nearby-style demo spots" },
  { label: "Pick a Fish", href: "/fish", icon: "fish", hint: "Choose bait and gear" },
  { label: "Tie a Rig", href: "/rigs", icon: "git-branch", hint: "Simple steps and diagrams" },
  { label: "Ask", href: "/ask", icon: "chatbubble-ellipses", hint: "Local beginner answers" }
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
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles" size={16} color={colors.ink} />
          <AppText variant="caption" style={styles.heroBadgeText}>
            Local demo data, no paid APIs
          </AppText>
        </View>
        <AppText variant="title">Unskunked</AppText>
        <AppText style={styles.tagline}>A beginner fishing copilot for deciding where to go, what to target, and how to rig up.</AppText>
      </View>

      <View style={styles.quickGrid}>
        {quickLinks.map((item) => (
          <Link key={item.label} href={item.href} asChild>
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
        <AppText variant="heading">Demo game plan</AppText>
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
        <AppText variant="heading">Keep it simple</AppText>
        <AppText>Start with easy targets like stocked trout or perch, use small hooks, and fish the first or last hour of daylight.</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Rules first</AppText>
        <AppText>Unskunked shows friendly mock summaries. Always check the official waterbody, season, limit, size, and closure rules before you cast.</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.pine,
    borderRadius: 8,
    gap: spacing.sm,
    padding: spacing.lg
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
  tagline: {
    color: "#eef7ef",
    fontSize: 18,
    fontWeight: "600"
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
  }
});
