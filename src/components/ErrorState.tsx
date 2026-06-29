import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { colors, spacing } from "@/src/theme";

type Props = {
  title?: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({ title = "Something needs attention", body, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="warning" size={28} color={colors.danger} />
      <AppText variant="heading" style={styles.center}>
        {title}
      </AppText>
      <AppText style={styles.center}>{body}</AppText>
      {actionLabel && onAction ? (
        <Button variant="secondary" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "#fff4ef",
    borderColor: colors.danger,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  center: {
    textAlign: "center"
  }
});
