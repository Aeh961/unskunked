import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { regulationDisclaimer } from "@/src/data/disclaimer";
import { colors, radii, spacing } from "@/src/theme";
import { AppText } from "./AppText";

export function Disclaimer() {
  return (
    <View style={styles.wrap}>
      <Ionicons name="alert-circle" size={16} color={colors.amber} />
      <AppText variant="caption" style={styles.text}>
        {regulationDisclaimer}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.amber,
    borderLeftWidth: 4,
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.sm
  },
  text: {
    color: colors.ink,
    flex: 1,
    fontWeight: "600"
  }
});
