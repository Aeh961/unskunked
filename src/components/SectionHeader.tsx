import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { colors, spacing } from "@/src/theme";

type Props = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, eyebrow, action }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        {eyebrow ? (
          <AppText variant="caption" style={styles.eyebrow}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="heading">{title}</AppText>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  copy: {
    flex: 1
  },
  eyebrow: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
  }
});
