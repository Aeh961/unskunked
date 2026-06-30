import { useEffect, useMemo, useState } from "react";
import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { TripLog, TripPlanRecord, TripResult, getTripPlans, getTrips, saveTrip } from "@/src/utils/localStore";
import { colors, radii, spacing } from "@/src/theme";

const results: TripResult[] = ["Skunked", "Unskunked", "Great Day", "Limited Out"];

const blankTrip = {
  location: "",
  date: new Date().toISOString().slice(0, 10),
  weather: "",
  speciesCaught: "",
  numberCaught: "0",
  bait: "",
  rig: "",
  notes: "",
  result: "Skunked" as TripResult
};

export default function TripLogScreen() {
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [plans, setPlans] = useState<TripPlanRecord[]>([]);
  const [form, setForm] = useState(blankTrip);

  useEffect(() => {
    Promise.all([getTrips(), getTripPlans()]).then(([savedTrips, savedPlans]) => {
      setTrips(savedTrips);
      setPlans(savedPlans);
    });
  }, []);

  const stats = useMemo(() => {
    const caughtTrips = trips.filter((trip) => trip.result !== "Skunked").length;
    return {
      total: trips.length,
      caughtTrips,
      skunked: trips.filter((trip) => trip.result === "Skunked").length,
      best: trips.filter((trip) => trip.result === "Great Day" || trip.result === "Limited Out").length,
      bait: mostCommon(trips.filter((trip) => trip.result !== "Skunked").map((trip) => trip.bait)),
      location: mostCommon(trips.filter((trip) => trip.result !== "Skunked").map((trip) => trip.location))
    };
  }, [trips]);

  async function submit() {
    const trip: TripLog = {
      id: `${Date.now()}`,
      date: form.date.trim() || new Date().toISOString().slice(0, 10),
      location: form.location.trim() || "Unknown spot",
      weather: form.weather.trim() || "Not logged",
      speciesCaught: form.speciesCaught.trim() || "None",
      numberCaught: Number.parseInt(form.numberCaught, 10) || 0,
      bait: form.bait.trim() || "Not logged",
      rig: form.rig.trim() || "Not logged",
      notes: form.notes.trim() || "No notes yet",
      result: form.result
    };
    const next = await saveTrip(trip);
    setTrips(next);
    setForm(blankTrip);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Trip Log</AppText>
        <AppText style={styles.heroText}>Track what worked, what did not, and how often you beat the skunk.</AppText>
      </View>

      <View style={styles.stats}>
        <Stat label="Trips" value={`${stats.total}`} />
        <Stat label="Caught" value={`${stats.caughtTrips}`} />
        <Stat label="Skunked" value={`${stats.skunked}`} />
        <Stat label="Great+" value={`${stats.best}`} />
      </View>
      <View style={styles.insightGrid}>
        <Card style={styles.insightCard}>
          <AppText variant="caption" style={styles.insightLabel}>Most successful bait</AppText>
          <AppText variant="subheading">{stats.bait}</AppText>
        </Card>
        <Card style={styles.insightCard}>
          <AppText variant="caption" style={styles.insightLabel}>Most successful location</AppText>
          <AppText variant="subheading">{stats.location}</AppText>
        </Card>
      </View>
      <Link href={"/stats" as Href} asChild>
        <Button icon="stats-chart" variant="secondary">Open Fishing Stats</Button>
      </Link>

      <Card>
        <SectionHeader title="Saved trip plans" eyebrow={`${plans.length} local`} />
        {plans.length ? (
          <Stack>
            {plans.slice(0, 3).map((plan) => (
              <View key={plan.id} style={styles.row}>
                <View style={styles.flex}>
                  <AppText variant="subheading">{plan.location}</AppText>
                  <AppText variant="caption">{plan.targetSpecies} · {plan.bestTime}</AppText>
                </View>
                <AppText variant="caption" style={styles.resultBadge}>{plan.rigSetup}</AppText>
              </View>
            ))}
          </Stack>
        ) : (
          <AppText>Save a plan from Plan My Fishing Trip to stage your next outing.</AppText>
        )}
      </Card>

      <Card style={styles.form}>
        <SectionHeader title="Log a trip" eyebrow="Saved locally" />
        <Field label="Location" value={form.location} onChangeText={(location) => setForm({ ...form, location })} placeholder="Green Lake" />
        <Field label="Date" value={form.date} onChangeText={(date) => setForm({ ...form, date })} placeholder="2026-06-29" />
        <Field label="Weather" value={form.weather} onChangeText={(weather) => setForm({ ...form, weather })} placeholder="Cool, cloudy, light wind" />
        <Field label="Species caught" value={form.speciesCaught} onChangeText={(speciesCaught) => setForm({ ...form, speciesCaught })} placeholder="Rainbow Trout" />
        <Field label="Number caught" value={form.numberCaught} onChangeText={(numberCaught) => setForm({ ...form, numberCaught })} placeholder="1" keyboardType="number-pad" />
        <Field label="Bait/lure used" value={form.bait} onChangeText={(bait) => setForm({ ...form, bait })} placeholder="Worms" />
        <Field label="Rig used" value={form.rig} onChangeText={(rig) => setForm({ ...form, rig })} placeholder="Bobber rig" />
        <Field label="Notes" value={form.notes} onChangeText={(notes) => setForm({ ...form, notes })} placeholder="Bites near weeds at sunset" multiline />

        <AppText variant="subheading">Trip result</AppText>
        <View style={styles.resultRow}>
          {results.map((result) => (
            <Pressable key={result} onPress={() => setForm({ ...form, result })} style={[styles.result, form.result === result && styles.resultActive]}>
              <AppText variant="caption" style={[styles.resultText, form.result === result && styles.resultTextActive]}>
                {result}
              </AppText>
            </Pressable>
          ))}
        </View>

        <Button icon="add-circle" onPress={submit}>
          Save trip
        </Button>
      </Card>

      <SectionHeader title="Recent trips" eyebrow="History" />
      {trips.length > 0 ? (
        trips.map((trip) => (
          <Card key={trip.id}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <AppText variant="heading">{trip.location}</AppText>
                <AppText variant="caption">
                  {trip.date} · {trip.weather}
                </AppText>
              </View>
              <AppText variant="caption" style={styles.resultBadge}>
                {trip.result}
              </AppText>
            </View>
            <Stack>
              <AppText>Species: {trip.speciesCaught}</AppText>
              <AppText>Number caught: {trip.numberCaught ?? 0}</AppText>
              <AppText>Bait/Rig: {trip.bait} · {trip.rig}</AppText>
              <AppText variant="caption">{trip.notes}</AppText>
              <View style={styles.photoPlaceholder}>
                <AppText variant="caption">Photo placeholder</AppText>
              </View>
            </Stack>
          </Card>
        ))
      ) : (
        <EmptyState icon="journal" title="No trips logged yet" body="Save your first trip after a session, even if you got skunked. Patterns show up quickly." />
      )}
    </Screen>
  );
}

function Field({ label, ...props }: { label: string; value: string; placeholder: string; onChangeText: (text: string) => void; multiline?: boolean; keyboardType?: "default" | "number-pad" }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" style={styles.fieldLabel}>
        {label}
      </AppText>
      <TextInput placeholderTextColor={colors.muted} style={[styles.input, props.multiline && styles.textArea]} {...props} />
    </View>
  );
}

function mostCommon(values: string[]) {
  const clean = values.map((value) => value.trim()).filter((value) => value && value !== "Not logged" && value !== "Unknown spot");
  if (clean.length === 0) return "Not enough data";
  const counts = clean.reduce<Record<string, number>>((memo, value) => {
    memo[value] = (memo[value] ?? 0) + 1;
    return memo;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" style={styles.statLabel}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.deepWater,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg
  },
  heroText: {
    color: colors.mist,
    fontWeight: "700"
  },
  stats: {
    flexDirection: "row",
    gap: spacing.sm
  },
  insightGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  insightCard: {
    flex: 1,
    gap: spacing.xs
  },
  insightLabel: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  stat: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md
  },
  statLabel: {
    fontWeight: "900"
  },
  form: {
    gap: spacing.md
  },
  field: {
    gap: spacing.xs
  },
  fieldLabel: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
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
  textArea: {
    minHeight: 86,
    paddingTop: spacing.sm,
    textAlignVertical: "top"
  },
  resultRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  result: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  resultActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  resultText: {
    fontWeight: "900"
  },
  resultTextActive: {
    color: "#fff"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  flex: {
    flex: 1
  },
  resultBadge: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    color: colors.pine,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  photoPlaceholder: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 72,
    justifyContent: "center"
  }
});
