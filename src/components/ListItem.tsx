import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, radii, spacing } from "@/src/theme";

type Props = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  right?: ReactNode;
  onPress?: () => void;
};

export function ListItem({ title, subtitle, icon = "leaf", right, onPress }: Props) {
  const Content = (
    <>
      <View style={styles.icon}>
        <Ionicons name={icon} size={19} color={colors.pine} />
      </View>
      <View style={styles.copy}>
        <AppText variant="subheading">{title}</AppText>
        {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        {Content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{Content}</View>;
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  copy: {
    flex: 1,
    gap: spacing.xxs
  },
  pressed: {
    opacity: 0.78
  }
});
