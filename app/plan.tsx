import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { RigDiagram } from "@/src/components/RigDiagram";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { waterbodies } from "@/src/data/waterbodies";
import { colors, radii, spacing } from "@/src/theme";
import { buildTripPlan } from "@/src/utils/recommendations";

const months = ["June", "July", "August", "September"] as const;
const accessOptions = ["Shore", "Boat"] as const;
const experienceOptions = ["Beginner", "Intermediate"] as const;

export default function PlanTripScreen() {
  const [month, setMonth] = useState<(typeof months)[number]>("July");
  const [waterbodyId, setWaterbodyId] = useState(waterbodies[0].id);
  const [access, setAccess] = useState<(typeof accessOptions)[number]>("Shore");
  const [experience, setExperience] = useState<(typeof experienceOptions)[number]>("Beginner");
  const [targetFishId, setTargetFishId] = useState(waterbodies[0].speciesIds[0]);
  const [availableBait, setAvailableBait] = useState("");
  const [availableGear, setAvailableGear] = useState("");

  const plan = useMemo(
    () => buildTripPlan({ month, waterbodyId, access, experience, targetFishId, availableBait, availableGear }),
    [access, availableBait, availableGear, experience, month, targetFishId, waterbodyId]
  );

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Plan My Fishing Trip</AppText>
        <AppText style={styles.heroText}>Generate a clear beginner-ready plan from mock local data.</AppText>
      </View>

      <Card style={styles.form}>
        <SectionHeader title="Trip inputs" eyebrow="Local planner" />
        <ChoiceRow label="Month" value={month} options={months} onSelect={setMonth} />
        <ChoiceRow label="Waterbody" value={waterbodyId} options={waterbodies.map((water) => water.id)} labels={Object.fromEntries(waterbodies.map((water) => [water.id, water.name]))} onSelect={setWaterbodyId} />
        <ChoiceRow label="Shore or boat" value={access} options={accessOptions} onSelect={setAccess} />
        <ChoiceRow label="Experience" value={experience} options={experienceOptions} onSelect={setExperience} />
        <ChoiceRow label="Target fish" value={targetFishId} options={fishSpecies.map((fish) => fish.id)} labels={Object.fromEntries(fishSpecies.map((fish) => [fish.id, fish.name]))} onSelect={setTargetFishId} />
        <Field label="Available bait" value={availableBait} onChangeText={setAvailableBait} placeholder="worms, PowerBait, jigs..." />
        <Field label="Available gear" value={availableGear} onChangeText={setAvailableGear} placeholder="light spinning rod, 6 lb mono..." />
      </Card>

      <Card style={styles.plan}>
        <SectionHeader title={`${plan.bestFish} at ${plan.water.name}`} eyebrow={`${plan.estimatedSuccess}% confidence`} />
        <Stack>
          <AppText>Suggested gear: {plan.suggestedGear}</AppText>
          <AppText>Suggested bait: {plan.suggestedBait}</AppText>
          <AppText>Suggested rig: {plan.suggestedRig}</AppText>
          <AppText>Suggested knot: {plan.suggestedKnot}</AppText>
          <AppText>Best time: {plan.bestTime}</AppText>
          <AppText>{plan.beginnerAdvice}</AppText>
          <AppText>Weather reminder: {plan.weatherReminder}</AppText>
          <AppText style={styles.warning}>Regulation reminder: {plan.regulationReminder}</AppText>
        </Stack>
        <RigDiagram parts={plan.rig.parts} />
        <SectionHeader title="Checklist" eyebrow="Before you leave" />
        <Stack>
          {plan.checklist.map((item) => (
            <View key={item} style={styles.bullet}>
              <View style={styles.dot} />
              <AppText style={styles.flex}>{item}</AppText>
            </View>
          ))}
        </Stack>
        <YoutubeLink query={`${plan.suggestedRig} ${plan.bestFish} beginner`} />
      </Card>
    </Screen>
  );
}

function ChoiceRow<T extends string>({ label, value, options, labels, onSelect }: { label: string; value: T; options: readonly T[]; labels?: Record<string, string>; onSelect: (value: T) => void }) {
  return (
    <View style={styles.group}>
      <AppText variant="subheading">{label}</AppText>
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable key={option} onPress={() => onSelect(option)} style={[styles.option, value === option && styles.optionActive]}>
            <AppText variant="caption" style={[styles.optionText, value === option && styles.optionTextActive]}>
              {labels?.[option] ?? option}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Field({ label, ...props }: { label: string; value: string; placeholder: string; onChangeText: (text: string) => void }) {
  return (
    <View style={styles.group}>
      <AppText variant="subheading">{label}</AppText>
      <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />
    </View>
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
  form: {
    gap: spacing.md
  },
  group: {
    gap: spacing.sm
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  option: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  optionActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  optionText: {
    fontWeight: "900"
  },
  optionTextActive: {
    color: "#fff"
  },
  input: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  plan: {
    gap: spacing.md
  },
  warning: {
    color: colors.danger,
    fontWeight: "800"
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
  flex: {
    flex: 1
  }
});
