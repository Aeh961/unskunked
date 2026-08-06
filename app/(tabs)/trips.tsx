import { Href, Link, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Autocomplete } from "@/src/components/Autocomplete";
import { Card } from "@/src/components/Card";
import { Button } from "@/src/components/Button";
import { ConfidenceBadge } from "@/src/components/ConfidenceBadge";
import { EmptyState } from "@/src/components/EmptyState";
import { ExpandableSection } from "@/src/components/ExpandableSection";
import { MissionCard } from "@/src/components/MissionCard";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { RigDiagram } from "@/src/components/RigDiagram";
import { Scanlines } from "@/src/components/Scanlines";
import { SearchInput } from "@/src/components/SearchInput";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { ActivityType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { colors, radii, spacing } from "@/src/theme";
import { getSuggestions } from "@/src/utils/autocomplete";
import { getTripPlans, getTrips, saveTrip, saveTripPlan, trackBetaEvent, TripLog, TripPlanRecord } from "@/src/utils/localStore";
import { buildTripPlan } from "@/src/utils/recommendations";
import { formatTripPlanShare, shareText } from "@/src/utils/share";
import { Coordinates, defaultManualLocation, manualLocations, requestExpoLocation } from "@/src/services/location";
import { buildShellfishPlan } from "@/src/services/shellfishPlanner";
import { cacheConditionsForLocation } from "@/src/services/conditionProviders";
import { getFreshnessState, getProviderById } from "@/src/services/dataTrust";
import { FollowUp, mergeFollowUpAnswer, nextFollowUp, ParsedTrip, parseTripText } from "@/src/utils/tripParser";

const months = ["June", "July", "August", "September"] as const;
const activityOptions: ActivityType[] = ["fishing", "clamming", "crabbing"];
const accessOptions = ["Shore", "Boat"] as const;
const experienceOptions = ["Beginner", "Intermediate", "Advanced"] as const;
const timeOptions = ["1 hour", "2 hours", "Half day", "All day"] as const;
const stepLabels = ["Target", "Date", "Loadout"];

function applyParsedToState(
  parsed: ParsedTrip,
  setters: {
    setActivityType: (value: ActivityType) => void;
    setWaterbodyId: (value: string) => void;
    setShellfishLocationId: (value: string | undefined) => void;
    setTargetFishId: (value: string) => void;
    setAccess: (value: (typeof accessOptions)[number]) => void;
  }
) {
  if (parsed.activityType) setters.setActivityType(parsed.activityType);
  if (parsed.waterbodyId) setters.setWaterbodyId(parsed.waterbodyId);
  if (parsed.shellfishLocationId) setters.setShellfishLocationId(parsed.shellfishLocationId);
  if (parsed.targetFishId) setters.setTargetFishId(parsed.targetFishId);
  if (parsed.accessType) setters.setAccess(parsed.accessType === "Boat" ? "Boat" : "Shore");
}

export default function TripsScreen() {
  const params = useLocalSearchParams<{ q?: string; activity?: string; activityType?: string; waterbodyId?: string; targetFishId?: string; targetShellfishId?: string; shellfishLocationId?: string }>();
  const parsedFromQuery = useMemo(() => (params.q ? parseTripText(params.q) : null), [params.q]);

  const hasDeepLinkParams = Boolean(
    params.q || params.activity || params.activityType || params.waterbodyId || params.targetFishId || params.targetShellfishId || params.shellfishLocationId
  );

  const initialActivity = ((params.activityType || params.activity || parsedFromQuery?.activityType) && activityOptions.includes((params.activityType || params.activity || parsedFromQuery?.activityType) as ActivityType))
    ? ((params.activityType || params.activity || parsedFromQuery?.activityType) as ActivityType)
    : "fishing";
  const initialWaterbodyId = params.waterbodyId ?? parsedFromQuery?.waterbodyId;
  const initialTargetFishId = params.targetFishId ?? parsedFromQuery?.targetFishId;
  const initialShellfishLocationId = params.shellfishLocationId ?? parsedFromQuery?.shellfishLocationId;
  const initialTargetShellfishId = params.targetShellfishId ?? parsedFromQuery?.targetShellfishId;

  const initialParsedForFollowUp: ParsedTrip | null = hasDeepLinkParams
    ? {
        raw: params.q ?? "",
        activityType: initialActivity,
        waterbodyId: initialWaterbodyId,
        shellfishLocationId: initialShellfishLocationId,
        targetFishId: initialTargetFishId,
        targetShellfishId: initialTargetShellfishId
      }
    : null;
  const initialFollowUp = initialParsedForFollowUp ? nextFollowUp(initialParsedForFollowUp) : null;

  const [savedPlans, setSavedPlans] = useState<TripPlanRecord[]>([]);
  const [fieldNotes, setFieldNotes] = useState<TripLog[]>([]);
  const [showLanding, setShowLanding] = useState(!hasDeepLinkParams);
  const [landingQuery, setLandingQuery] = useState("");

  const [step, setStep] = useState(hasDeepLinkParams && !initialFollowUp ? stepLabels.length - 1 : 0);
  const [generated, setGenerated] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>(initialActivity);
  const [month, setMonth] = useState<(typeof months)[number]>("July");
  const [waterbodyId, setWaterbodyId] = useState(initialWaterbodyId ?? waterbodies[0].id);
  const [shellfishLocationId, setShellfishLocationId] = useState<string | undefined>(
    initialShellfishLocationId ?? shellfishLocations.find((location) => location.activityTypes.includes(initialActivity === "crabbing" ? "crabbing" : "clamming"))?.id
  );
  const [access, setAccess] = useState<(typeof accessOptions)[number]>("Shore");
  const [experience, setExperience] = useState<(typeof experienceOptions)[number]>("Beginner");
  const [targetFishId, setTargetFishId] = useState(
    initialTargetFishId ?? waterbodies.find((water) => water.id === (initialWaterbodyId ?? waterbodies[0].id))?.speciesIds[0] ?? waterbodies[0].speciesIds[0]
  );
  const [availableBait, setAvailableBait] = useState("");
  const [availableGear, setAvailableGear] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultManualLocation.coordinates);
  const [timeAvailable, setTimeAvailable] = useState<(typeof timeOptions)[number]>("2 hours");
  const [locationMessage, setLocationMessage] = useState("Using Seattle as the manual location.");

  const [targetText, setTargetText] = useState(params.q ?? "");
  const [pendingParsed, setPendingParsed] = useState<ParsedTrip | null>(initialFollowUp ? initialParsedForFollowUp : null);
  const [pendingFollowUp, setPendingFollowUp] = useState<FollowUp | null>(initialFollowUp);
  const [followUpText, setFollowUpText] = useState("");

  useEffect(() => {
    Promise.all([getTripPlans(), getTrips()]).then(([plans, trips]) => {
      setSavedPlans(plans);
      setFieldNotes(trips.filter((trip) => trip.status !== "draft"));
    });
  }, []);

  const setters = { setActivityType, setWaterbodyId, setShellfishLocationId, setTargetFishId, setAccess };

  function continueResolving(parsed: ParsedTrip) {
    const followUp = nextFollowUp(parsed);
    if (followUp) {
      setPendingParsed(parsed);
      setPendingFollowUp(followUp);
      return;
    }
    applyParsedToState(parsed, setters);
    setPendingParsed(null);
    setPendingFollowUp(null);
    setStep(1);
  }

  function resolveTarget(text: string) {
    setTargetText(text);
    continueResolving(parseTripText(text));
  }

  function submitFollowUp() {
    if (!pendingParsed || !followUpText.trim()) return;
    const merged = mergeFollowUpAnswer(pendingParsed, followUpText);
    setFollowUpText("");
    continueResolving(merged);
  }

  function startNewMission() {
    setShowLanding(false);
    setGenerated(false);
    setStep(0);
    setTargetText("");
    setPendingParsed(null);
    setPendingFollowUp(null);
    setSavedMessage("");
  }

  const suggestions = useMemo(() => getSuggestions(targetText), [targetText]);
  const followUpSuggestions = useMemo(() => getSuggestions(followUpText), [followUpText]);

  const isFishing = activityType === "fishing";
  const shellfishActivity = activityType === "crabbing" ? "crabbing" : "clamming";
  const shellfishOptions = useMemo(
    () => shellfishLocations.filter((location) => location.activityTypes.includes(shellfishActivity)),
    [shellfishActivity]
  );
  const selectedWaterbody = waterbodies.find((water) => water.id === waterbodyId) ?? waterbodies[0];
  const selectedShellfishLocation = shellfishOptions.find((location) => location.id === shellfishLocationId) ?? shellfishOptions[0];
  const targetShellfishSpecies = shellfishSpecies.find((item) => item.activityType === shellfishActivity);

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
      setSavedMessage(`${activityType} mission saved.`);
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
    setSavedMessage("Mission saved.");
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
        result: "Skunked",
        status: "draft"
      });
      setSavedMessage(`Draft ${activityType} mission started in Field Notes.`);
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
      result: "Skunked",
      status: "draft"
    });
    setSavedMessage("Draft mission started in Field Notes.");
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

  if (showLanding) {
    return (
      <Screen>
        <View style={styles.hero}>
          <AppText variant="display" style={styles.lightText}>MISSIONS</AppText>
          <AppText style={styles.heroText}>What are you targeting?</AppText>
        </View>
        <SearchInput
          accessibilityLabel="Type what you're fishing, clamming, or crabbing for"
          value={landingQuery}
          onChangeText={setLandingQuery}
          onClear={() => setLandingQuery("")}
          onSubmitEditing={() => resolveTarget(landingQuery)}
          placeholder="Rainbow trout, Dungeness crab, Green Lake..."
        />
        <Autocomplete
          items={getSuggestions(landingQuery)}
          onSelect={(item) => resolveTarget(item.label)}
        />
        <Button icon="add-circle" onPress={startNewMission}>New Mission</Button>

        {savedPlans.length > 0 ? (
          <View style={styles.listSection}>
            <SectionHeader title="Saved Missions" eyebrow={`${savedPlans.length}`} />
            {savedPlans.map((item) => (
              <MissionCard
                key={item.id}
                eyebrow={item.activityType ?? "fishing"}
                title={`${item.targetSpecies} at ${item.location}`}
                meta={[item.bestTime, item.rigSetup, item.regulationSummary]}
              />
            ))}
          </View>
        ) : null}

        {fieldNotes.length > 0 ? (
          <View style={styles.listSection}>
            <SectionHeader title="Field Notes" eyebrow={`${fieldNotes.length}`} />
            {fieldNotes.slice(0, 5).map((trip) => (
              <Link key={trip.id} href={"/log" as Href} asChild>
                <MissionCard
                  eyebrow={trip.date}
                  title={`${trip.speciesCaught} at ${trip.location}`}
                  meta={[`${trip.numberCaught} caught`, trip.result]}
                  onPress={() => {}}
                />
              </Link>
            ))}
          </View>
        ) : null}

        {savedPlans.length === 0 && fieldNotes.length === 0 ? (
          <EmptyState icon="flag" title="No missions yet" body="Type what you're going after above to build your first plan." />
        ) : null}
      </Screen>
    );
  }

  if (generated) {
    return (
      <Screen>
        <View style={styles.hero}>
          <Scanlines />
          <AppText variant="display" style={styles.lightText}>MISSION READY</AppText>
          <AppText style={styles.heroText}>Generated from what you chose - nothing picked for you.</AppText>
        </View>
        <Button icon="chevron-back-outline" variant="ghost" onPress={goBack}>Edit choices</Button>

        {!isFishing ? (
          <Card style={styles.plan}>
            <View style={styles.summaryTop}>
              <View style={styles.flex}>
                <AppText variant="caption" style={styles.eyebrow}>{activityType === "crabbing" ? "CRAB MISSION" : "CLAM MISSION"}</AppText>
                <AppText variant="heading">{shellfishPlan.species?.name ?? activityType} at {shellfishPlan.location.name}</AppText>
              </View>
              <View style={styles.scoreBadge}>
                <AppText variant="caption" style={styles.scoreText}>{shellfishPlan.score}/100</AppText>
              </View>
            </View>
            {recommendationSource ? (
              <View style={styles.sourceRow}>
                <ConfidenceBadge confidence={recommendationSource.confidence} compact />
                <AppText variant="caption" style={styles.sourceCopy}>{recommendationSource.label} · {sourceFreshness?.warning}</AppText>
              </View>
            ) : null}
            <AppText>Best window: {shellfishPlan.bestTime}</AppText>
            <AppText style={styles.warning}>Regulation: {shellfishPlan.location.regulationWarning}</AppText>

            <View style={styles.actions}>
              <Button icon="save" style={styles.actionButton} onPress={saveCurrentPlan}>Save Mission</Button>
              <Button icon="play" variant="secondary" style={styles.actionButton} onPress={startTrip}>Launch Trip</Button>
            </View>
            {savedMessage ? <AppText variant="caption" style={styles.saved}>{savedMessage}</AppText> : null}

            <ExpandableSection title="Conditions" eyebrow="Weather & tide">
              <AppText>Weather: {shellfishPlan.weather.airTempF}F · wind {shellfishPlan.weather.windMph} mph · rain {shellfishPlan.weather.rainChancePercent}%</AppText>
              <AppText>Tide: {shellfishPlan.tide ? `${shellfishPlan.tide.current} · ${shellfishPlan.tide.movement} · high ${shellfishPlan.tide.high} · low ${shellfishPlan.tide.low}` : "No tide data"}</AppText>
              <AppText>{shellfishPlan.explanation}</AppText>
            </ExpandableSection>
            <ExpandableSection title="Gear Check" eyebrow="Before you leave">
              {[...shellfishPlan.whatToBring, ...shellfishPlan.regulationReminders, ...shellfishPlan.safetyNotes].map((item) => (
                <View key={item} style={styles.bullet}>
                  <View style={styles.dot} />
                  <AppText style={styles.flex}>{item}</AppText>
                </View>
              ))}
            </ExpandableSection>
            <ExpandableSection title="Watch and Learn" eyebrow="External searches">
              {(shellfishPlan.species?.youtubeSearches ?? [`Washington ${activityType} beginner`]).map((query) => (
                <YoutubeLink key={query} query={query} />
              ))}
            </ExpandableSection>
            <Button icon="share-social" variant="ghost" onPress={sharePlan}>Share mission</Button>
          </Card>
        ) : (
          <Card style={styles.plan}>
            <View style={styles.summaryTop}>
              <View style={styles.flex}>
                <AppText variant="caption" style={styles.eyebrow}>FISHING MISSION</AppText>
                <AppText variant="heading">{plan.bestFish} at {plan.water.name}</AppText>
              </View>
              <StatusBadge status={plan.water.status} />
            </View>
            {recommendationSource ? (
              <View style={styles.sourceRow}>
                <ConfidenceBadge confidence={recommendationSource.confidence} compact />
                <AppText variant="caption" style={styles.sourceCopy}>{recommendationSource.label} · {sourceFreshness?.warning}</AppText>
              </View>
            ) : null}
            <AppText>Setup: {plan.suggestedGear} · {plan.suggestedBait} · {plan.suggestedRig}</AppText>
            <AppText>Best time: {plan.bestTime}</AppText>
            <AppText style={styles.warning}>Regulation reminder: {plan.regulationReminder}</AppText>

            <View style={styles.actions}>
              <Button icon="save" style={styles.actionButton} onPress={saveCurrentPlan}>Save Mission</Button>
              <Button icon="play" variant="secondary" style={styles.actionButton} onPress={startTrip}>Launch Trip</Button>
            </View>
            {savedMessage ? <AppText variant="caption" style={styles.saved}>{savedMessage}</AppText> : null}

            <ExpandableSection title="Rig Diagram" eyebrow="Suggested setup">
              <AppText>Suggested knot: {plan.suggestedKnot}</AppText>
              <RigDiagram parts={plan.rig.parts} />
            </ExpandableSection>
            <ExpandableSection title="Conditions" eyebrow="Weather & advice">
              <AppText>{plan.beginnerAdvice}</AppText>
              <AppText>Weather reminder: {plan.weatherReminder}</AppText>
              <AppText>Safety: {plan.safetyReminder}</AppText>
              <AppText>Backup plan: {plan.backupPlan}</AppText>
            </ExpandableSection>
            <ExpandableSection title="Gear Check" eyebrow="Before you leave">
              {[...plan.checklist, ...plan.baitChecklist.map((bait) => `Bait/lure: ${bait}`)].map((item) => (
                <View key={item} style={styles.bullet}>
                  <View style={styles.dot} />
                  <AppText style={styles.flex}>{item}</AppText>
                </View>
              ))}
            </ExpandableSection>
            <ExpandableSection title="Watch and Learn" eyebrow="External searches">
              {plan.youtubeLinks.map((query) => (
                <YoutubeLink key={query} query={query} />
              ))}
            </ExpandableSection>
            <ExpandableSection title="Full Regulations" eyebrow="Official sources">
              <OfficialLinks links={plan.regulation.sourceLinks} />
            </ExpandableSection>
            <Button icon="share-social" variant="ghost" onPress={sharePlan}>Share mission</Button>
          </Card>
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="display" style={styles.lightText}>NEW MISSION</AppText>
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
            <AppText variant="subheading">What are you targeting?</AppText>
            <SearchInput
              accessibilityLabel="What are you fishing, clamming, or crabbing for"
              value={targetText}
              onChangeText={setTargetText}
              onClear={() => setTargetText("")}
              onSubmitEditing={() => resolveTarget(targetText)}
              placeholder="Rainbow trout, Dungeness crab, Green Lake..."
            />
            <Autocomplete items={suggestions} onSelect={(item) => resolveTarget(item.label)} />
            <Button icon="chevron-forward-outline" onPress={() => resolveTarget(targetText)}>Continue</Button>

            {pendingFollowUp ? (
              <View style={styles.followUp}>
                <AppText variant="subheading">{pendingFollowUp.question}</AppText>
                <TextInput
                  value={followUpText}
                  onChangeText={setFollowUpText}
                  onSubmitEditing={submitFollowUp}
                  placeholder="Type your answer..."
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  accessibilityLabel={pendingFollowUp.question}
                />
                <Autocomplete items={followUpSuggestions} onSelect={(item) => { setFollowUpText(item.label); }} />
                <Button icon="chevron-forward-outline" onPress={submitFollowUp}>Continue</Button>
              </View>
            ) : null}
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.group}>
            <AppText variant="subheading">When are you heading out?</AppText>
            <View style={styles.nearbyCard}>
              <AppText variant="caption" style={styles.eyebrow}>YOUR LOCATION (for weather & tide accuracy)</AppText>
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
            <ChoiceRow label="Month" value={month} options={months} onSelect={setMonth} />
            <ChoiceRow label="Time available" value={timeAvailable} options={timeOptions} onSelect={setTimeAvailable} />
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.group}>
            <AppText variant="subheading">Loadout</AppText>
            <ChoiceRow label="Shore or boat" value={access} options={accessOptions} onSelect={setAccess} />
            <ChoiceRow label="Experience" value={experience} options={experienceOptions} onSelect={setExperience} />
            <Field label={isFishing ? "Available bait" : "Available gear/bait"} value={availableBait} onChangeText={setAvailableBait} placeholder={isFishing ? "worms, PowerBait, jigs..." : "clam shovel, crab pot, gauge, bait..."} />
            <Field label="Available gear" value={availableGear} onChangeText={setAvailableGear} placeholder="light spinning rod, 6 lb mono..." />
            {!isFishing ? (
              <Card style={styles.confirmCard}>
                <AppText variant="subheading">{targetShellfishSpecies?.name ?? shellfishActivity}</AppText>
                <AppText variant="caption">The only legal target at {selectedShellfishLocation?.name} for {shellfishActivity}.</AppText>
              </Card>
            ) : null}
          </View>
        ) : null}
      </Card>

      <View style={styles.navRow}>
        {step > 0 ? (
          <Button icon="chevron-back-outline" variant="secondary" style={styles.actionButton} onPress={goBack}>Back</Button>
        ) : null}
        {step > 0 ? (
          <Button icon={step === stepLabels.length - 1 ? "sparkles" : "chevron-forward-outline"} style={styles.actionButton} onPress={goNext}>
            {step === stepLabels.length - 1 ? "Launch Trip" : "Next"}
          </Button>
        ) : null}
      </View>
    </Screen>
  );
}

function ChoiceRow<T extends string>({ label, value, options, onSelect }: { label: string; value: T; options: readonly T[]; onSelect: (value: T) => void }) {
  return (
    <View style={styles.group}>
      {label ? <AppText variant="subheading">{label}</AppText> : null}
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable key={option} accessibilityRole="button" accessibilityLabel={`Select ${option} for ${label}`} onPress={() => onSelect(option)} style={[styles.option, value === option && styles.optionActive]}>
            <AppText variant="caption" style={[styles.optionText, value === option && styles.optionTextActive]}>
              {option}
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
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    gap: spacing.sm,
    overflow: "hidden",
    padding: spacing.lg
  },
  lightText: {
    color: colors.ink
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
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: radii.sm,
    flex: 1,
    height: 4
  },
  progressDotActive: {
    backgroundColor: colors.amber
  },
  form: {
    gap: spacing.md
  },
  followUp: {
    borderColor: colors.line,
    borderTopWidth: 2,
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm
  },
  listSection: {
    gap: spacing.sm
  },
  confirmCard: {
    backgroundColor: colors.surfaceStrong,
    gap: spacing.xs
  },
  nearbyCard: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
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
    borderRadius: radii.md,
    borderWidth: 2,
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
    color: colors.ink
  },
  input: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
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
  summaryTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  eyebrow: {
    color: colors.amber,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  scoreBadge: {
    backgroundColor: colors.good,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  scoreText: {
    color: "#14170f",
    fontWeight: "900"
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
    backgroundColor: colors.amber,
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
