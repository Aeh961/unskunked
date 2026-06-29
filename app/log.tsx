import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { TripLog, TripResult, getTrips, saveTrip } from "@/src/utils/localStore";
import { colors, radii, spacing } from "@/src/theme";

const results: TripResult[] = ["Skunked", "Caught One", "Great Day", "Limited Out"];

const blankTrip = {
  location: "",
  weather: "",
  speciesCaught: "",
  bait: "",
  rig: "",
  notes: "",
  result: "Skunked" as TripResult
};

export default function TripLogScreen() {
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [form, setForm] = useState(blankTrip);

  useEffect(() => {
    getTrips().then(setTrips);
  }, []);

  const stats = useMemo(() => {
    const caughtTrips = trips.filter((trip) => trip.result !== "Skunked").length;
    return {
      total: trips.length,
      caughtTrips,
      skunked: trips.filter((trip) => trip.result === "Skunked").length,
      best: trips.filter((trip) => trip.result === "Great Day" || trip.result === "Limited Out").length
    };
  }, [trips]);

  async function submit() {
    const trip: TripLog = {
      id: `${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      location: form.location.trim() || "Unknown spot",
      weather: form.weather.trim() || "Not logged",
      speciesCaught: form.speciesCaught.trim() || "None",
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

      <Card style={styles.form}>
        <SectionHeader title="Log a trip" eyebrow="Saved locally" />
        <Field label="Location" value={form.location} onChangeText={(location) => setForm({ ...form, location })} placeholder="Green Lake" />
        <Field label="Weather" value={form.weather} onChangeText={(weather) => setForm({ ...form, weather })} placeholder="Cool, cloudy, light wind" />
        <Field label="Species caught" value={form.speciesCaught} onChangeText={(speciesCaught) => setForm({ ...form, speciesCaught })} placeholder="Rainbow Trout" />
        <Field label="Bait" value={form.bait} onChangeText={(bait) => setForm({ ...form, bait })} placeholder="Worms" />
        <Field label="Rig" value={form.rig} onChangeText={(rig) => setForm({ ...form, rig })} placeholder="Bobber rig" />
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

function Field({ label, ...props }: { label: string; value: string; placeholder: string; onChangeText: (text: string) => void; multiline?: boolean }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" style={styles.fieldLabel}>
        {label}
      </AppText>
      <TextInput placeholderTextColor={colors.muted} style={[styles.input, props.multiline && styles.textArea]} {...props} />
    </View>
  );
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
