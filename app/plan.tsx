import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Button } from "@/src/components/Button";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { RigDiagram } from "@/src/components/RigDiagram";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { waterbodies } from "@/src/data/waterbodies";
import { colors, radii, spacing } from "@/src/theme";
import { saveTrip, saveTripPlan, trackBetaEvent } from "@/src/utils/localStore";
import { buildTripPlan } from "@/src/utils/recommendations";
import { formatTripPlanShare, shareText } from "@/src/utils/share";
import { Coordinates, defaultManualLocation, getNearestBeginnerWaterbody, manualLocations, requestExpoLocation } from "@/src/services/location";

const months = ["June", "July", "August", "September"] as const;
const accessOptions = ["Shore", "Boat"] as const;
const experienceOptions = ["Beginner", "Intermediate"] as const;
const timeOptions = ["1 hour", "2 hours", "Half day", "All day"] as const;

export default function PlanTripScreen() {
  const [month, setMonth] = useState<(typeof months)[number]>("July");
  const [waterbodyId, setWaterbodyId] = useState(waterbodies[0].id);
  const [access, setAccess] = useState<(typeof accessOptions)[number]>("Shore");
  const [experience, setExperience] = useState<(typeof experienceOptions)[number]>("Beginner");
  const [targetFishId, setTargetFishId] = useState(waterbodies[0].speciesIds[0]);
  const [availableBait, setAvailableBait] = useState("");
  const [availableGear, setAvailableGear] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultManualLocation.coordinates);
  const [preferNearest, setPreferNearest] = useState(false);
  const [timeAvailable, setTimeAvailable] = useState<(typeof timeOptions)[number]>("2 hours");
  const [locationMessage, setLocationMessage] = useState("Using Seattle as the manual nearby fallback.");

  const plan = useMemo(
    () => buildTripPlan({ month, waterbodyId, access, experience, targetFishId, availableBait, availableGear, userLocation: coordinates, preferNearest, timeAvailable }),
    [access, availableBait, availableGear, coordinates, experience, month, preferNearest, targetFishId, timeAvailable, waterbodyId]
  );

  const nearestBeginner = useMemo(() => getNearestBeginnerWaterbody(coordinates), [coordinates]);

  async function useCurrentLocation() {
    const state = await requestExpoLocation();
    setCoordinates(state.coordinates ?? defaultManualLocation.coordinates);
    setLocationMessage(state.message);
    setPreferNearest(true);
  }

  function useManualLocation(location: (typeof manualLocations)[number]) {
    setCoordinates(location.coordinates);
    setLocationMessage(`Using ${location.label} as the planner location.`);
  }

  async function saveCurrentPlan() {
    await trackBetaEvent("planner-choice", `${plan.water.name} · ${plan.fish.name} · ${plan.suggestedRig}`);
    await saveTripPlan({
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      location: plan.water.name,
      targetSpecies: plan.fish.name,
      regulationSummary: plan.regulationReminder,
      gearChecklist: plan.gearChecklist,
      baitChecklist: plan.baitChecklist,
      rigSetup: plan.suggestedRig,
      knot: plan.suggestedKnot,
      bestTime: plan.bestTime,
      safetyReminder: plan.safetyReminder,
      backupPlan: plan.backupPlan,
      youtubeLinks: plan.youtubeLinks
    });
    setSavedMessage("Trip plan saved locally.");
  }

  async function startTrip() {
    await saveTrip({
      id: `draft-${Date.now()}`,
      location: plan.water.name,
      date: new Date().toISOString().slice(0, 10),
      weather: plan.weatherReminder,
      speciesCaught: plan.fish.name,
      numberCaught: 0,
      bait: plan.suggestedBait,
      rig: plan.suggestedRig,
      notes: `Draft trip from planner. Backup plan: ${plan.backupPlan}`,
      result: "Skunked"
    });
    setSavedMessage("Draft trip started in Trip Log.");
  }

  async function sharePlan() {
    await shareText(formatTripPlanShare({
      location: plan.water.name,
      targetSpecies: plan.fish.name,
      rigSetup: plan.suggestedRig,
      knot: plan.suggestedKnot,
      baitChecklist: plan.baitChecklist
    }), "Unskunked trip plan");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Plan My Fishing Trip</AppText>
        <AppText style={styles.heroText}>Generate a clear beginner-ready plan from mock local data.</AppText>
      </View>

      <Card style={styles.form}>
        <SectionHeader title="Trip inputs" eyebrow="Local planner" />
        <View style={styles.nearbyCard}>
          <SectionHeader title="Nearby mode" eyebrow="Optional GPS" />
          <AppText>{locationMessage}</AppText>
          <AppText>Nearest beginner-friendly pick: {nearestBeginner?.name ?? "No nearby waterbody found"}</AppText>
          <View style={styles.actions}>
            <Button icon="locate" style={styles.actionButton} onPress={useCurrentLocation}>Use my location</Button>
            <Button icon="navigate" variant={preferNearest ? "primary" : "secondary"} style={styles.actionButton} onPress={() => setPreferNearest(!preferNearest)}>
              {preferNearest ? "Nearest on" : "Nearest off"}
            </Button>
          </View>
          <View style={styles.options}>
            {manualLocations.map((location) => (
              <Pressable key={location.id} onPress={() => useManualLocation(location)} style={styles.option}>
                <AppText variant="caption" style={styles.optionText}>{location.label}</AppText>
              </Pressable>
            ))}
          </View>
        </View>
        <ChoiceRow label="Month" value={month} options={months} onSelect={setMonth} />
        <ChoiceRow label="Waterbody" value={waterbodyId} options={waterbodies.map((water) => water.id)} labels={Object.fromEntries(waterbodies.map((water) => [water.id, water.name]))} onSelect={setWaterbodyId} />
        <ChoiceRow label="Shore or boat" value={access} options={accessOptions} onSelect={setAccess} />
        <ChoiceRow label="Time available" value={timeAvailable} options={timeOptions} onSelect={setTimeAvailable} />
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
          <AppText>Safety: {plan.safetyReminder}</AppText>
          <AppText>Backup plan: {plan.backupPlan}</AppText>
        </Stack>
        <RigDiagram parts={plan.rig.parts} />
        <SectionHeader title="Gear checklist" eyebrow="Before you leave" />
        <Stack>
          {[...plan.checklist, ...plan.baitChecklist.map((bait) => `Bait/lure: ${bait}`)].map((item) => (
            <View key={item} style={styles.bullet}>
              <View style={styles.dot} />
              <AppText style={styles.flex}>{item}</AppText>
            </View>
          ))}
        </Stack>
        <SectionHeader title="Watch and learn" eyebrow="External searches" />
        {plan.youtubeLinks.map((query) => (
          <YoutubeLink key={query} query={query} />
        ))}
        <View style={styles.actions}>
          <Button icon="save" style={styles.actionButton} onPress={saveCurrentPlan}>Save plan</Button>
          <Button icon="play" variant="secondary" style={styles.actionButton} onPress={startTrip}>Start Trip</Button>
        </View>
        <Button icon="share-social" variant="ghost" onPress={sharePlan}>Share trip plan</Button>
        {savedMessage ? <AppText variant="caption" style={styles.saved}>{savedMessage}</AppText> : null}
      </Card>
      <OfficialLinks links={plan.regulation.sourceLinks} />
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
  nearbyCard: {
    backgroundColor: colors.mist,
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
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  actionButton: {
    flex: 1
  },
  saved: {
    color: colors.good,
    fontWeight: "900"
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
