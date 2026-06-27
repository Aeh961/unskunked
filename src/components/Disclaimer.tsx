import { StyleSheet, View } from "react-native";
import { regulationDisclaimer } from "@/src/data/disclaimer";
import { colors, spacing } from "@/src/theme";
import { AppText } from "./AppText";

export function Disclaimer() {
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" style={styles.text}>
        {regulationDisclaimer}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff3d6",
    borderColor: "#e4c26a",
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.sm
  },
  text: {
    color: colors.ink,
    fontWeight: "600"
  }
});
