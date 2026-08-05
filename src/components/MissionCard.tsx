import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { colors, radii, spacing } from "@/src/theme";

type Props = {
  eyebrow: string;
  title: string;
  meta: string[];
  statusLabel?: string;
  statusTone?: "good" | "caution" | "bad";
  onPress?: () => void;
  actions?: ReactNode;
};

const toneStyles = {
  good: { backgroundColor: colors.good, textStyle: { color: "#14170f" } },
  caution: { backgroundColor: colors.caution, textStyle: { color: "#14170f" } },
  bad: { backgroundColor: colors.dangerFill, textStyle: { color: colors.ink } }
} as const;

export function MissionCard({ eyebrow, title, meta, statusLabel, statusTone = "good", onPress, actions }: Props) {
  const Content = (
    <>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <AppText variant="caption" style={styles.eyebrow}>{eyebrow}</AppText>
          <AppText variant="heading" numberOfLines={2}>{title}</AppText>
        </View>
        {statusLabel ? (
          <View style={[styles.badge, { backgroundColor: toneStyles[statusTone].backgroundColor }]}>
            <AppText variant="caption" style={[styles.badgeText, toneStyles[statusTone].textStyle]}>{statusLabel}</AppText>
          </View>
        ) : null}
      </View>
      <View style={styles.metaRow}>
        {meta.map((line) => (
          <AppText key={line} variant="caption" style={styles.metaText} numberOfLines={1}>{line}</AppText>
        ))}
      </View>
      {actions}
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}>
        {Content}
      </Pressable>
    );
  }

  return <Card style={styles.card}>{Content}</Card>;
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.md
  },
  card: {
    gap: spacing.sm
  },
  pressed: {
    borderColor: colors.amber,
    opacity: 0.9
  },
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  copy: {
    flex: 1,
    gap: 2
  },
  eyebrow: {
    color: colors.amber,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  badge: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  badgeText: {
    fontWeight: "800"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  metaText: {
    color: colors.muted
  }
});
