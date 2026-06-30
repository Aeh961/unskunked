import { Linking, StyleSheet, View } from "react-native";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { SectionHeader } from "@/src/components/SectionHeader";
import { AppText } from "@/src/components/AppText";
import { RegulationSourceLinks, washingtonSourceLinks } from "@/src/services/regulations";
import { spacing } from "@/src/theme";

type Props = {
  links?: RegulationSourceLinks;
  compact?: boolean;
};

export function OfficialLinks({ links = washingtonSourceLinks, compact = false }: Props) {
  return (
    <Card style={styles.card}>
      <SectionHeader title="Official verification" eyebrow="Rules can change" />
      {!compact ? <AppText>Use Unskunked to plan, then verify current official rules before keeping fish.</AppText> : null}
      <View style={styles.actions}>
        <Button icon="open-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.regulations)}>
          Verify official rules
        </Button>
        <Button icon="warning-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.emergencyRules)}>
          Check emergency rules
        </Button>
        <Button icon="card-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.licenses)}>
          Buy/check license
        </Button>
        <Button icon="map-outline" variant="ghost" style={styles.button} onPress={() => Linking.openURL(links.fishWashington)}>
          Fish Washington
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  button: {
    flexBasis: "48%"
  }
});
