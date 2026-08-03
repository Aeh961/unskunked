import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Button } from "@/src/components/Button";
import { ConfidenceBadge } from "@/src/components/ConfidenceBadge";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { RigDiagram } from "@/src/components/RigDiagram";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { RegionId, regions } from "@/src/data/regions";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { ActivityType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { useSelectedRegion } from "@/src/hooks/useSelectedRegion";
import { colors, radii, spacing } from "@/src/theme";
import { saveTrip, saveTripPlan, trackBetaEvent } from "@/src/utils/localStore";
import { buildTripPlan } from "@/src/utils/recommendations";
import { formatTripPlanShare, shareText } from "@/src/utils/share";
import { Coordinates, defaultManualLocation, manualLocations, requestExpoLocation } from "@/src/services/location";
import { buildShellfishPlan } from "@/src/services/shellfishPlanner";
import { cacheConditionsForLocation } from "@/src/services/conditionProviders";
import { getFreshnessState, getProviderById } from "@/src/services/dataTrust";

const months = ["June", "July", "August", "September"] as const;
const activityOptions: ActivityType[] = ["fishing", "clamming", "crabbing"];
const accessOptions = ["Shore", "Boat"] as const;
const experienceOptions = ["Beginner", "Intermediate", "Advanced"] as const;
const timeOptions = ["1 hour", "2 hours", "Half day", "All day"] as const;
const stepLabels = ["Activity", "State", "Waterbody", "Species", "Date", "Gear"];

export default function PlanTripScreen() {
  const params = useLocalSearchParams<{ activity?: string; waterbodyId?: string; targetFishId?: string }>();
  const initialActivity = activityOptions.includes(params.activity as ActivityType) ? (params.activity as ActivityType) : "fishing";
  const initialWaterbodyId = waterbodies.some((water) => water.id === params.waterbodyId) ? (params.waterbodyId as string) : waterbodies[0].id;
  const initialTargetFishId = fishSpecies.some((fish) => fish.id === params.targetFishId)
    ? (params.targetFishId as string)
    : waterbodies.find((water) => water.id === initialWaterbodyId)?.speciesIds[0] ?? waterbodies[0].speciesIds[0];

  const { region: storedRegion } = useSelectedRegion();
  const [step, setStep] = useState(params.waterbodyId || params.targetFishId ? stepLabels.length - 1 : 0);
  const [generated, setGenerated] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>(initialActivity);
  const [region, setRegion] = useState<RegionId>("washington");
  const [month, setMonth] = useState<(typeof months)[number]>("July");
  const [waterbodyId, setWaterbodyId] = useState(initialWaterbodyId);
  const [shellfishLocationId, setShellfishLocationId] = useState(
    shellfishLocations.find((location) => location.activityTypes.includes(activityType === "crabbing" ? "crabbing" : "clamming"))?.id ?? shellfishLocations[0]?.id
  );
  const [access, setAccess] = useState<(typeof accessOptions)[number]>("Shore");
  const [experience, setExperience] = useState<(typeof experienceOptions)[number]>("Beginner");
  const [targetFishId, setTargetFishId] = useState(initialTargetFishId);
  const [availableBait, setAvailableBait] = useState("");
  const [availableGear, setAvailableGear] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultManualLocation.coordinates);
  const [timeAvailable, setTimeAvailable] = useState<(typeof timeOptions)[number]>("2 hours");
  const [locationMessage, setLocationMessage] = useState("Using Seattle as the manual location.");

  useEffect(() => {
    setRegion(storedRegion);
  }, [storedRegion]);

  const isFishing = activityType === "fishing";
  const shellfishActivity = activityType === "crabbing" ? "crabbing" : "clamming";
  const shellfishOptions = useMemo(
    () => shellfishLocations.filter((location) => location.activityTypes.includes(shellfishActivity)),
    [shellfishActivity]
  );
  const selectedWaterbody = waterbodies.find((water) => water.id === waterbodyId) ?? waterbodies[0];
  const selectedShellfishLocation = shellfishOptions.find((location) => location.id === shellfishLocationId) ?? shellfishOptions[0];
  const targetShellfishSpecies = shellfishSpecies.find((item) => item.activityType === shellfishActivity);
  const regionInfo = regions.find((item) => item.id === region);

  const plan = useMemo(
    () => buildTripPlan({ month, waterbodyId, access, experience, targetFishId, availableBait, availableGear, userLocation: coordinates, timeAvailable }),
    [access, availableBait, availableGear, coordinates, experience, month, targetFishId, timeAvailable, waterbodyId]
  );
  const shellfishPlan = useMemo(
    () => buildShellfishPlan({ activityType: shellfishActivity, coordinates, experience, locationId: shellfishLocationId }),
    [shellfishActivity, coordinates, experience, shellfishLocationId]
  );
  const recommendationSource = getProviderById(isFishing ? "unskunked-waterbodies" : "wdfw-shellfish");
  const sourceFreshness = recommendationSource ? getFreshnessState(recommendationSource.freshness) : null;

  async function useCurrentLocation() {
    const state = await requestExpoLocation();
    setCoordinates(state.coordinates ?? defaultManualLocation.coordinates);
    setLocationMessage(state.message);
  }

  function useManualLocation(location: (typeof manualLocations)[number]) {
    setCoordinates(location.coordinates);
    setLocationMessage(`Using ${location.label} as your location.`);
  }

  async function saveCurrentPlan() {
    if (!isFishing) {
      await cacheConditionsForLocation({
        id: `${activityType}:${shellfishPlan.location.id}`,
        locationName: shellfishPlan.location.name,
        activityType,
        location: shellfishPlan.location
      });
      await trackBetaEvent("planner-choice", `${shellfishPlan.location.name} · ${shellfishPlan.species?.name ?? activityType} · ${shellfishPlan.score}`);
      await saveTripPlan({
        id: `plan-${Date.now()}`,
        activityType,
        createdAt: new Date().toISOString(),
        location: shellfishPlan.location.name,
        targetSpecies: shellfishPlan.species?.name ?? activityType,
        regulationSummary: shellfishPlan.location.regulationWarning,
        gearChecklist: shellfishPlan.whatToBring,
        baitChecklist: activityType === "crabbing" ? ["Fish carcass or legal crab bait", "Bait box"] : ["No bait needed", "Tide table"],
        rigSetup: activityType === "crabbing" ? "Crab ring or pot setup" : "Low-tide beach digging setup",
        knot: activityType === "crabbing" ? "Bowline or secure pot line knot" : "No fishing knot required",
        bestTime: shellfishPlan.bestTime,
        score: shellfishPlan.score,
        conditionsSummary: `${shellfishPlan.weather.airTempF}F · ${shellfishPlan.weather.windMph} mph wind · ${shellfishPlan.tide?.movement ?? "No tide"} tide`,
        safetyReminder: shellfishPlan.safetyNotes.join(" "),
        backupPlan: activityType === "crabbing" ? "If pots are empty, move depth or scent trail and verify legal soak/location." : "If the beach is crowded or closed, switch to a verified nearby open beach.",
        youtubeLinks: shellfishPlan.species?.youtubeSearches ?? [`Washington ${activityType} beginner`]
      });
      setSavedMessage(`${activityType} plan saved locally.`);
      return;
    }
    await trackBetaEvent("planner-choice", `${plan.water.name} · ${plan.fish.name} · ${plan.suggestedRig}`);
    await saveTripPlan({
      id: `plan-${Date.now()}`,
      activityType: "fishing",
      createdAt: new Date().toISOString(),
      location: plan.water.name,
      targetSpecies: plan.fish.name,
      regulationSummary: plan.regulationReminder,
      gearChecklist: plan.gearChecklist,
      baitChecklist: plan.baitChecklist,
      rigSetup: plan.suggestedRig,
      knot: plan.suggestedKnot,
      bestTime: plan.bestTime,
      score: plan.estimatedSuccess,
      conditionsSummary: plan.weatherReminder,
      safetyReminder: plan.safetyReminder,
      backupPlan: plan.backupPlan,
      youtubeLinks: plan.youtubeLinks
    });
    setSavedMessage("Trip plan saved locally.");
  }

  async function startTrip() {
    if (!isFishing) {
      await saveTrip({
        id: `draft-${Date.now()}`,
        activityType,
        location: shellfishPlan.location.name,
        date: new Date().toISOString().slice(0, 10),
        weather: `${shellfishPlan.weather.airTempF}F, ${shellfishPlan.weather.windMph} mph wind`,
        speciesCaught: shellfishPlan.species?.name ?? activityType,
        numberCaught: 0,
        bait: activityType === "crabbing" ? "Crab bait" : "No bait",
        rig: activityType === "crabbing" ? "Crab ring/pot" : "Clam shovel/rake",
        tide: shellfishPlan.tide ? `${shellfishPlan.tide.movement} · high ${shellfishPlan.tide.high} · low ${shellfishPlan.tide.low}` : undefined,
        notes: `Draft ${activityType} trip from planner. ${shellfishPlan.explanation}`,
        result: "Skunked"
      });
      setSavedMessage(`Draft ${activityType} trip started in Trip Log.`);
      return;
    }
    await saveTrip({
      id: `draft-${Date.now()}`,
      activityType: "fishing",
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
    if (!isFishing) {
      await shareText(`Unskunked helped me plan a ${activityType} trip at ${shellfishPlan.location.name}. Score: ${shellfishPlan.score}/100. Best window: ${shellfishPlan.bestTime}. Verify WDFW rules, emergency rules, license, and health advisories before harvesting.`, "Unskunked shellfish plan");
      return;
    }
    await shareText(formatTripPlanShare({
      location: plan.water.name,
      targetSpecies: plan.fish.name,
      rigSetup: plan.suggestedRig,
      knot: plan.suggestedKnot,
      baitChecklist: plan.baitChecklist
    }), "Unskunked trip plan");
  }

  function goNext() {
    if (step < stepLabels.length - 1) {
      setStep(step + 1);
    } else {
      setGenerated(true);
    }
  }

  function goBack() {
    if (generated) {
      setGenerated(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  if (generated) {
    return (
      <Screen>
        <View style={styles.hero}>
          <AppText variant="title" style={styles.lightText}>Your Trip Plan</AppText>
          <AppText style={styles.heroText}>Generated from what you chose - nothing picked for you.</AppText>
        </View>
        <Button icon="chevron-back-outline" variant="ghost" onPress={goBack}>Edit choices</Button>

        {!isFishing ? (
          <Card style={styles.plan}>
            <SectionHeader title={`${activityType === "clamming" ? "Clam" : "Crab"} plan at ${shellfishPlan.location.name}`} eyebrow={`${shellfishPlan.score}/100 trip score`} />
            {recommendationSource ? (
              <View style={styles.sourceRow}>
                <ConfidenceBadge confidence={recommendationSource.confidence} compact />
                <AppText variant="caption" style={styles.sourceCopy}>{recommendationSource.label} · {sourceFreshness?.warning}</AppText>
              </View>
            ) : null}
            <Stack>
              <AppText>Target: {shellfishPlan.species?.name ?? activityType}</AppText>
              <AppText>Best window: {shellfishPlan.bestTime}</AppText>
              <AppText>Weather: {shellfishPlan.weather.airTempF}F · wind {shellfishPlan.weather.windMph} mph · rain {shellfishPlan.weather.rainChancePercent}%</AppText>
              <AppText>Tide: {shellfishPlan.tide ? `${shellfishPlan.tide.current} · ${shellfishPlan.tide.movement} · high ${shellfishPlan.tide.high} · low ${shellfishPlan.tide.low}` : "No tide data"}</AppText>
              <AppText>{shellfishPlan.explanation}</AppText>
              <AppText style={styles.warning}>Regulation: {shellfishPlan.location.regulationWarning}</AppText>
            </Stack>
            <SectionHeader title="Checklist" eyebrow="Before you leave" />
            <Stack>
              {[...shellfishPlan.whatToBring, ...shellfishPlan.regulationReminders, ...shellfishPlan.safetyNotes].map((item) => (
                <View key={item} style={styles.bullet}>
                  <View style={styles.dot} />
                  <AppText style={styles.flex}>{item}</AppText>
                </View>
              ))}
            </Stack>
            <SectionHeader title="Watch and learn" eyebrow="External searches" />
            {(shellfishPlan.species?.youtubeSearches ?? [`Washington ${activityType} beginner`]).map((query) => (
              <YoutubeLink key={query} query={query} />
            ))}
            <View style={styles.actions}>
              <Button icon="save" style={styles.actionButton} onPress={saveCurrentPlan}>Save plan</Button>
              <Button icon="play" variant="secondary" style={styles.actionButton} onPress={startTrip}>Start Trip</Button>
            </View>
            <Button icon="share-social" variant="ghost" onPress={sharePlan}>Share shellfish plan</Button>
            {savedMessage ? <AppText variant="caption" style={styles.saved}>{savedMessage}</AppText> : null}
          </Card>
        ) : (
          <Card style={styles.plan}>
            <SectionHeader title={`${plan.bestFish} at ${plan.water.name}`} eyebrow={`${plan.estimatedSuccess}% confidence`} />
            {recommendationSource ? (
              <View style={styles.sourceRow}>
                <ConfidenceBadge confidence={recommendationSource.confidence} compact />
                <AppText variant="caption" style={styles.sourceCopy}>{recommendationSource.label} · {sourceFreshness?.warning}</AppText>
              </View>
            ) : null}
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
        )}
        <OfficialLinks links={plan.regulation.sourceLinks} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Plan a Trip</AppText>
        <View style={styles.progressRow}>
          {stepLabels.map((label, index) => (
            <View key={label} style={[styles.progressDot, index <= step && styles.progressDotActive]} />
          ))}
        </View>
        <AppText style={styles.heroText}>Step {step + 1} of {stepLabels.length}: {stepLabels[step]}</AppText>
      </View>

      <Card style={styles.form}>
        {step === 0 ? (
          <View style={styles.group}>
            <AppText variant="subheading">What do you want to do?</AppText>
            <View style={styles.activityGrid}>
              {activityOptions.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${option}`}
                  onPress={() => setActivityType(option)}
                  style={[styles.activityCard, activityType === option && styles.activityCardActive]}
                >
                  <Ionicons name={option === "fishing" ? "fish" : option === "crabbing" ? "boat" : "sunny"} size={28} color={activityType === option ? "#fff" : colors.forest} />
                  <AppText style={[styles.activityLabel, activityType === option && styles.activityLabelActive]}>
                    {option === "fishing" ? "Fishing" : option === "crabbing" ? "Crabbing" : "Clamming"}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.group}>
            <AppText variant="subheading">Which state?</AppText>
            <ChoiceRow label="" value={region} options={regions.map((item) => item.id)} labels={Object.fromEntries(regions.map((item) => [item.id, item.name]))} onSelect={setRegion} />
            {regionInfo && regionInfo.status !== "Mocked" ? (
              <AppText variant="caption" style={styles.warning}>{regionInfo.note} Showing Washington sample data below until real {regionInfo.name} data is connected.</AppText>
            ) : null}
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.group}>
            <AppText variant="subheading">Where would you like to go?</AppText>
            <View style={styles.nearbyCard}>
              <AppText>{locationMessage}</AppText>
              <View style={styles.actions}>
                <Button icon="locate" style={styles.actionButton} onPress={useCurrentLocation}>Use my location</Button>
              </View>
              <View style={styles.options}>
                {manualLocations.map((location) => (
                  <Pressable key={location.id} accessibilityRole="button" accessibilityLabel={`Use ${location.label}`} onPress={() => useManualLocation(location)} style={styles.option}>
                    <AppText variant="caption" style={styles.optionText}>{location.label}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>
            {isFishing ? (
              <ChoiceRow label="Waterbody" value={waterbodyId} options={waterbodies.map((water) => water.id)} labels={Object.fromEntries(waterbodies.map((water) => [water.id, water.name]))} onSelect={setWaterbodyId} />
            ) : (
              <ChoiceRow label="Location" value={shellfishLocationId ?? ""} options={shellfishOptions.map((location) => location.id)} labels={Object.fromEntries(shellfishOptions.map((location) => [location.id, location.name]))} onSelect={setShellfishLocationId} />
            )}
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.group}>
            <AppText variant="subheading">What are you targeting?</AppText>
            {isFishing ? (
              <ChoiceRow
                label="Target fish"
                value={targetFishId}
                options={selectedWaterbody.speciesIds}
                labels={Object.fromEntries(fishSpecies.map((fish) => [fish.id, fish.name]))}
                onSelect={setTargetFishId}
              />
            ) : (
              <Card style={styles.confirmCard}>
                <AppText variant="heading">{targetShellfishSpecies?.name ?? shellfishActivity}</AppText>
                <AppText variant="caption">The only legal target at {selectedShellfishLocation?.name} for {shellfishActivity}.</AppText>
              </Card>
            )}
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.group}>
            <AppText variant="subheading">When are you going?</AppText>
            <ChoiceRow label="Month" value={month} options={months} onSelect={setMonth} />
            <ChoiceRow label="Time available" value={timeAvailable} options={timeOptions} onSelect={setTimeAvailable} />
          </View>
        ) : null}

        {step === 5 ? (
          <View style={styles.group}>
            <AppText variant="subheading">What gear do you have?</AppText>
            <ChoiceRow label="Shore or boat" value={access} options={accessOptions} onSelect={setAccess} />
            <ChoiceRow label="Experience" value={experience} options={experienceOptions} onSelect={setExperience} />
            <Field label={isFishing ? "Available bait" : "Available gear/bait"} value={availableBait} onChangeText={setAvailableBait} placeholder={isFishing ? "worms, PowerBait, jigs..." : "clam shovel, crab pot, gauge, bait..."} />
            <Field label="Available gear" value={availableGear} onChangeText={setAvailableGear} placeholder="light spinning rod, 6 lb mono..." />
          </View>
        ) : null}
      </Card>

      <View style={styles.navRow}>
        {step > 0 ? (
          <Button icon="chevron-back-outline" variant="secondary" style={styles.actionButton} onPress={goBack}>Back</Button>
        ) : null}
        <Button icon={step === stepLabels.length - 1 ? "sparkles" : "chevron-forward-outline"} style={styles.actionButton} onPress={goNext}>
          {step === stepLabels.length - 1 ? "Generate Trip Plan" : "Next"}
        </Button>
      </View>
    </Screen>
  );
}

function ChoiceRow<T extends string>({ label, value, options, labels, onSelect }: { label: string; value: T; options: readonly T[]; labels?: Record<string, string>; onSelect: (value: T) => void }) {
  return (
    <View style={styles.group}>
      {label ? <AppText variant="subheading">{label}</AppText> : null}
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable key={option} accessibilityRole="button" accessibilityLabel={`Select ${labels?.[option] ?? option} for ${label}`} onPress={() => onSelect(option)} style={[styles.option, value === option && styles.optionActive]}>
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
  progressRow: {
    flexDirection: "row",
    gap: spacing.xs
  },
  progressDot: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: radii.pill,
    flex: 1,
    height: 4
  },
  progressDotActive: {
    backgroundColor: "#fff"
  },
  form: {
    gap: spacing.md
  },
  activityGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  activityCard: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: radii.md,
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.lg
  },
  activityCardActive: {
    backgroundColor: colors.forest
  },
  activityLabel: {
    color: colors.forest,
    fontWeight: "800"
  },
  activityLabelActive: {
    color: "#fff"
  },
  confirmCard: {
    backgroundColor: colors.mist,
    gap: spacing.xs
  },
  nearbyCard: {
    backgroundColor: colors.mist,
    borderRadius: radii.md,
    gap: spacing.md,
    padding: spacing.md
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
  navRow: {
    flexDirection: "row",
    gap: spacing.sm
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
  },
  sourceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  sourceCopy: {
    color: colors.muted,
    flex: 1,
    fontWeight: "700"
  }
});
