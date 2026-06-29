import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, spacing } from "@/src/theme";

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
};

export function EmptyState({ icon = "search", title, body }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={28} color={colors.river} />
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>
      <AppText style={styles.body}>{body}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  title: {
    textAlign: "center"
  },
  body: {
    color: colors.muted,
    textAlign: "center"
  }
});
