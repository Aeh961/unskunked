import { PropsWithChildren } from "react";
import { Platform, Pressable, StyleSheet, View, ViewProps } from "react-native";
import { colors, radii, shadows, spacing } from "@/src/theme";

type Props = PropsWithChildren<ViewProps & { onPress?: () => void }>;

export function Card({ children, style, onPress, ...props }: Props) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }

  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: Platform.OS === "android" ? 0 : StyleSheet.hairlineWidth,
    padding: spacing.md,
    ...shadows.card
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  }
});
