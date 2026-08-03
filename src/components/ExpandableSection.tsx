import { PropsWithChildren, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/src/components/Card";
import { SectionHeader } from "@/src/components/SectionHeader";
import { Stack } from "@/src/components/Screen";
import { colors } from "@/src/theme";

type Props = PropsWithChildren<{
  title: string;
  eyebrow?: string;
  defaultExpanded?: boolean;
}>;

export function ExpandableSection({ title, eyebrow, defaultExpanded = false, children }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${title}`}
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <SectionHeader
          title={title}
          eyebrow={eyebrow}
          action={<Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={colors.muted} />}
        />
      </Pressable>
      {expanded ? <Stack>{children}</Stack> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 44
  }
});
