import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { SourceConfidence, confidenceDescriptions } from "@/src/services/dataTrust";
import { colors, radii, spacing } from "@/src/theme";

type Props = {
  confidence: SourceConfidence;
  compact?: boolean;
};

const darkTextTones = new Set(["verified", "needs"]);

export function ConfidenceBadge({ confidence, compact = false }: Props) {
  const tone = toneFor(confidence);
  const textStyle = darkTextTones.has(tone) ? styles.darkText : styles.lightText;
  return (
    <Pressable
      accessibilityRole="text"
      accessibilityLabel={`${confidence}. ${confidenceDescriptions[confidence]}`}
      style={[styles.badge, styles[tone]]}
    >
      <AppText variant="caption" style={[styles.text, textStyle]}>{confidence}</AppText>
      {!compact ? <AppText variant="caption" style={[styles.body, textStyle]}>{confidenceDescriptions[confidence]}</AppText> : null}
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
  if (confidence === "Verified" || confidence === "Official Source") return "verified" as const;
  if (confidence === "Community Verified" || confidence === "Imported") return "imported" as const;
  if (confidence === "Needs Verification") return "needs" as const;
  if (confidence === "Demo Data") return "demo" as const;
  return "unknown" as const;
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
    fontWeight: "900"
  },
  darkText: {
    color: "#14170f"
  },
  lightText: {
    color: colors.ink
  },
  body: {
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
    backgroundColor: colors.dangerFill
  },
  unknown: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderWidth: 2
  }
});
