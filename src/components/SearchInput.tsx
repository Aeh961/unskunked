import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors, radii, spacing } from "@/src/theme";

type Props = TextInputProps & {
  onClear?: () => void;
  accessibilityLabel: string;
};

export const SearchInput = forwardRef<TextInput, Props>(function SearchInput(
  { value, onClear, accessibilityLabel, style, ...props },
  ref
) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="terminal" size={18} color={colors.amber} style={styles.icon} />
      <TextInput
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        value={value}
        placeholderTextColor={colors.muted}
        style={[styles.input, style]}
        {...props}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search text" onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: spacing.sm
  },
  icon: {
    marginRight: spacing.xs
  },
  input: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingVertical: spacing.sm
  },
  clearButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44
  }
});
