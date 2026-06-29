import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors, radii, spacing } from "@/src/theme";

const steps = [
  {
    title: "Pick beginner water",
    body: "Start with a lake, park, or pier where casting is easy and rules are simple to verify.",
    href: "/map",
    icon: "map" as const
  },
  {
    title: "Choose one target",
    body: "Trout, perch, and bluegill are friendly first targets. Avoid complex salmon rules until you are ready.",
    href: "/fish",
    icon: "fish" as const
  },
  {
    title: "Build one rig",
    body: "Answer a few questions and use the recommended rig instead of packing every tackle option.",
    href: "/rigs",
    icon: "git-branch" as const
  },
  {
    title: "Log the result",
    body: "Save bait, rig, location, and what happened. Patterns show up after just a few trips.",
    href: "/log",
    icon: "journal" as const
  }
];

export default function StartHereScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>
          Start Here
        </AppText>
        <AppText style={styles.heroText}>A simple beginner path for getting unskunked without overthinking the tackle wall.</AppText>
      </View>
      <Disclaimer />

      <Card style={styles.planCard}>
        <SectionHeader title="Your first-trip flow" eyebrow="15 minute setup" />
        <Stack>
          {steps.map((step, index) => (
            <Link key={step.title} href={step.href as Href} asChild>
              <Pressable style={styles.step}>
                <View style={styles.stepNumber}>
                  <AppText variant="caption" style={styles.stepNumberText}>
                    {index + 1}
                  </AppText>
                </View>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={22} color={colors.pine} />
                </View>
                <View style={styles.stepCopy}>
                  <AppText variant="subheading">{step.title}</AppText>
                  <AppText variant="caption">{step.body}</AppText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            </Link>
          ))}
        </Stack>
      </Card>

      <Card style={styles.tipCard}>
        <SectionHeader title="Default beginner setup" eyebrow="When unsure" />
        <AppText>Light spinning rod, 4-6 lb mono, size 8-12 hook, worm or PowerBait, and a bobber or split shot rig.</AppText>
        <Link href={"/rigs" as Href} asChild>
          <Button icon="git-branch">Open Rig Builder</Button>
        </Link>
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
  lightText: {
    color: "#fff"
  },
  heroText: {
    color: colors.mist,
    fontWeight: "700"
  },
  planCard: {
    gap: spacing.md
  },
  step: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  stepNumber: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: radii.pill,
    height: 26,
    justifyContent: "center",
    width: 26
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "900"
  },
  stepIcon: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  stepCopy: {
    flex: 1,
    gap: spacing.xxs
  },
  tipCard: {
    gap: spacing.md
  }
});
