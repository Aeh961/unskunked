import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { SourceConfidence, confidenceDescriptions } from "@/src/services/dataTrust";
import { colors, radii, spacing } from "@/src/theme";

type Props = {
  confidence: SourceConfidence;
  compact?: boolean;
};

export function ConfidenceBadge({ confidence, compact = false }: Props) {
  return (
    <Pressable
      accessibilityRole="text"
      accessibilityLabel={`${confidence}. ${confidenceDescriptions[confidence]}`}
      style={[styles.badge, styles[toneFor(confidence)]]}
    >
      <AppText variant="caption" style={styles.text}>{confidence}</AppText>
      {!compact ? <AppText variant="caption" style={styles.body}>{confidenceDescriptions[confidence]}</AppText> : null}
    </Pressable>
  );
}

export function ConfidenceRow({ confidence }: Props) {
  return (
    <View style={styles.row}>
      <ConfidenceBadge confidence={confidence} compact />
      <AppText variant="caption" style={styles.rowText}>{confidenceDescriptions[confidence]}</AppText>
    </View>
  );
}

function toneFor(confidence: SourceConfidence) {
  if (confidence === "Verified" || confidence === "Official Source") return "verified";
  if (confidence === "Community Verified" || confidence === "Imported") return "imported";
  if (confidence === "Needs Verification") return "needs";
  if (confidence === "Demo Data") return "demo";
  return "unknown";
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radii.md,
    gap: spacing.xxs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  text: {
    color: "#fff",
    fontWeight: "900"
  },
  body: {
    color: "#fff",
    maxWidth: 280
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  rowText: {
    color: colors.muted,
    flex: 1
  },
  verified: {
    backgroundColor: colors.good
  },
  imported: {
    backgroundColor: colors.river
  },
  needs: {
    backgroundColor: colors.caution
  },
  demo: {
    backgroundColor: colors.clay
  },
  unknown: {
    backgroundColor: colors.muted
  }
});
