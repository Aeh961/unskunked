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
  accessibilityLabel?: string;
}>;

const iconColor: Record<NonNullable<Props["variant"]>, string> = {
  primary: colors.ink,
  secondary: colors.forest,
  ghost: colors.amber,
  danger: colors.ink
};

const textStyleForVariant: Record<NonNullable<Props["variant"]>, object> = {
  primary: { color: colors.ink },
  secondary: { color: colors.forest },
  ghost: { color: colors.amber },
  danger: { color: colors.ink }
};

export function Button({ children, icon, onPress, variant = "primary", style, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === "string" ? children : undefined)}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color={iconColor[variant]} /> : null}
      <AppText style={[styles.text, textStyleForVariant[variant]]}>{children}</AppText>
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
    borderWidth: 2
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.line,
    borderWidth: 2
  },
  danger: {
    backgroundColor: colors.dangerFill
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  text: {
    fontWeight: "900",
    textAlign: "center"
  }
});
