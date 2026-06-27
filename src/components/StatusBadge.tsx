import { StyleSheet, View } from "react-native";
import { Status } from "@/src/data/types";
import { getStatusLabel, getStatusTone } from "@/src/utils/regulations";
import { colors, spacing } from "@/src/theme";
import { AppText } from "./AppText";

export function StatusBadge({ status }: { status: Status }) {
  const tone = getStatusTone(status);
  return (
    <View style={[styles.badge, styles[tone]]}>
      <AppText style={styles.text}>{getStatusLabel(status)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  },
  good: {
    backgroundColor: colors.good
  },
  caution: {
    backgroundColor: colors.caution
  },
  bad: {
    backgroundColor: colors.danger
  }
});
