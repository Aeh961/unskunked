import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, radii, spacing } from "@/src/theme";

type Props = {
  name: string;
  waterType: string;
  county?: string;
  activityLabel: string;
  distanceMiles?: number;
  status?: string;
  selected?: boolean;
  onPress: () => void;
};

/** One compact clickable row - the shared shape used for both map fallback results and the main results list. */
export function WaterbodyListRow({ name, waterType, county, activityLabel, distanceMiles, status, selected, onPress }: Props) {
  const metaParts = [waterType, county, activityLabel].filter(Boolean) as string[];
  const meta = [distanceMiles !== undefined ? `${distanceMiles} mi` : null, ...metaParts].filter(Boolean).join(" · ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${meta}${status ? `, ${status}` : ""}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, selected && styles.rowActive, pressed && !selected && styles.rowPressed]}
    >
      <View style={styles.copy}>
        <AppText style={[styles.name, selected && styles.textActive]} numberOfLines={2}>{name}</AppText>
        <AppText variant="caption" style={[styles.meta, selected && styles.textActive]} numberOfLines={2}>{meta}</AppText>
      </View>
      {status ? (
        <View style={styles.statusPill}>
          <AppText variant="caption" style={styles.statusText} numberOfLines={1}>{status}</AppText>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={selected ? colors.ink : colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm
  },
  rowActive: {
    backgroundColor: colors.deepWater
  },
  rowPressed: {
    backgroundColor: colors.surfaceStrong
  },
  copy: {
    flex: 1,
    flexShrink: 1,
    gap: 2
  },
  name: {
    flexShrink: 1,
    fontWeight: "900"
  },
  meta: {
    color: colors.muted,
    flexShrink: 1
  },
  textActive: {
    color: colors.ink
  },
  statusPill: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    flexShrink: 0,
    maxWidth: 96,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3
  },
  statusText: {
    color: colors.forest,
    fontWeight: "900",
    textTransform: "capitalize"
  }
});
