import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, radii, spacing } from "@/src/theme";

export type AutocompleteItem = {
  id: string;
  kind: string;
  label: string;
  subtitle?: string;
};

type Props = {
  items: AutocompleteItem[];
  onSelect: (item: AutocompleteItem) => void;
};

/**
 * Compact dropdown rendered directly under a SearchInput. Renders nothing when
 * `items` is empty so it never shows before the user has typed anything.
 */
export function Autocomplete({ items, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <View accessibilityRole="menu" style={styles.wrap}>
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          accessibilityRole="menuitem"
          accessibilityLabel={`${item.label}, ${item.kind}${item.subtitle ? `, ${item.subtitle}` : ""}`}
          onPress={() => onSelect(item)}
          style={[styles.row, index < items.length - 1 && styles.rowDivider]}
        >
          <View style={styles.tag}>
            <AppText variant="caption" style={styles.tagText}>{item.kind}</AppText>
          </View>
          <View style={styles.copy}>
            <AppText style={styles.label} numberOfLines={1}>{item.label}</AppText>
            {item.subtitle ? <AppText variant="caption" numberOfLines={1}>{item.subtitle}</AppText> : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    overflow: "hidden"
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  rowDivider: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1
  },
  tag: {
    backgroundColor: colors.mist,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2
  },
  tagText: {
    color: colors.forest,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  copy: {
    flex: 1,
    gap: 1
  },
  label: {
    fontWeight: "700"
  }
});
