import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, radii, spacing } from "@/src/theme";

type Props = PropsWithChildren<{
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  style?: ViewStyle;
}>;

export function Button({ children, icon, onPress, variant = "primary", style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color={variant === "primary" || variant === "danger" ? "#fff" : colors.pine} /> : null}
      <AppText style={[styles.text, (variant === "primary" || variant === "danger") && styles.lightText]}>{children}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radii.md,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  primary: {
    backgroundColor: colors.pine
  },
  secondary: {
    backgroundColor: colors.sky,
    borderColor: colors.river,
    borderWidth: 1
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.line,
    borderWidth: 1
  },
  danger: {
    backgroundColor: colors.danger
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  text: {
    color: colors.pine,
    fontWeight: "900",
    textAlign: "center"
  },
  lightText: {
    color: "#fff"
  }
});
