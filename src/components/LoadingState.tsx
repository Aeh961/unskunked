import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, spacing } from "@/src/theme";

export function LoadingState({ label = "Loading the best fishing intel..." }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.river} />
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg
  },
  label: {
    textAlign: "center"
  }
});
