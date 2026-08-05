import { StyleSheet, View } from "react-native";
import { Status } from "@/src/data/types";
import { getStatusLabel, getStatusTone } from "@/src/utils/regulations";
import { colors, radii, spacing } from "@/src/theme";
import { AppText } from "./AppText";

export function StatusBadge({ status }: { status: Status }) {
  const tone = getStatusTone(status);
  return (
    <View style={[styles.badge, styles[tone]]} accessibilityLabel={`Status: ${getStatusLabel(status)}`}>
      <AppText style={[styles.text, tone === "bad" ? styles.lightText : styles.darkText]}>{getStatusLabel(status)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  text: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  },
  lightText: {
    color: colors.ink
  },
  darkText: {
    color: "#14170f"
  },
  good: {
    backgroundColor: colors.good
  },
  caution: {
    backgroundColor: colors.caution
  },
  bad: {
    backgroundColor: colors.dangerFill
  }
});
