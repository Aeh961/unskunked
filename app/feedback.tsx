import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors, radii, spacing } from "@/src/theme";
import { FeedbackEntry, FeedbackType, getFeedback, saveFeedback } from "@/src/utils/localStore";
import { formatJsonExport, shareText } from "@/src/utils/share";

const feedbackTypes: FeedbackType[] = [
  "Bug report",
  "Feature request",
  "Confusing regulation",
  "Wrong fish recommendation",
  "Wrong waterbody info",
  "General feedback"
];

export default function FeedbackScreen() {
  const [type, setType] = useState<FeedbackType>("General feedback");
  const [screen, setScreen] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    getFeedback().then(setFeedback);
  }, []);

  async function submit() {
    const entry: FeedbackEntry = {
      id: `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
      type,
      screen: screen.trim() || "Not specified",
      message: message.trim() || "No message entered"
    };
    const next = await saveFeedback(entry);
    setFeedback(next);
    setMessage("");
    setScreen("");
    setSaved("Feedback saved locally.");
  }

  async function exportFeedback() {
    await shareText(formatJsonExport({ exportedAt: new Date().toISOString(), feedback }), "Unskunked feedback export");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Beta Feedback</AppText>
        <AppText style={styles.heroText}>Save bugs, confusing rules, wrong recommendations, and feature ideas locally.</AppText>
      </View>

      <Card style={styles.card}>
        <SectionHeader title="What kind of feedback?" eyebrow="Local beta" />
        <View style={styles.options}>
          {feedbackTypes.map((item) => (
            <Pressable key={item} onPress={() => setType(item)} style={[styles.option, type === item && styles.optionActive]}>
              <AppText variant="caption" style={[styles.optionText, type === item && styles.optionTextActive]}>{item}</AppText>
            </Pressable>
          ))}
        </View>
        <Field label="Screen or flow" value={screen} onChangeText={setScreen} placeholder="Map, Trip Planner, Fish Detail..." />
        <Field label="Feedback" value={message} onChangeText={setMessage} placeholder="What happened? What did you expect?" multiline />
        <Button icon="send" onPress={submit}>Save feedback</Button>
        {saved ? <AppText variant="caption" style={styles.saved}>{saved}</AppText> : null}
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Export feedback" eyebrow={`${feedback.length} entries`} />
        <AppText>Use the native share sheet to send feedback JSON to yourself or the developer.</AppText>
        <Button icon="share-social" variant="secondary" onPress={exportFeedback}>Export feedback JSON</Button>
      </Card>

      <SectionHeader title="Saved feedback" eyebrow="This device" />
      {feedback.length ? (
        <Stack>
          {feedback.map((item) => (
            <Card key={item.id}>
              <AppText variant="caption" style={styles.type}>{item.type}</AppText>
              <AppText variant="heading">{item.screen}</AppText>
              <AppText>{item.message}</AppText>
              <AppText variant="caption">{item.createdAt}</AppText>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState icon="chatbox" title="No feedback yet" body="Save one note after testing a flow, even if it is just something that felt confusing." />
      )}
    </Screen>
  );
}

function Field({ label, ...props }: { label: string; value: string; placeholder: string; onChangeText: (text: string) => void; multiline?: boolean }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" style={styles.label}>{label}</AppText>
      <TextInput placeholderTextColor={colors.muted} style={[styles.input, props.multiline && styles.textArea]} {...props} />
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
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" },
  card: { gap: spacing.md },
  options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  option: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  optionActive: { backgroundColor: colors.pine, borderColor: colors.pine },
  optionText: { fontWeight: "900" },
  optionTextActive: { color: "#fff" },
  field: { gap: spacing.xs },
  label: { color: colors.river, fontWeight: "900", textTransform: "uppercase" },
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
  textArea: { minHeight: 112, paddingTop: spacing.sm, textAlignVertical: "top" },
  saved: { color: colors.good, fontWeight: "900" },
  type: { color: colors.river, fontWeight: "900", textTransform: "uppercase" }
});
