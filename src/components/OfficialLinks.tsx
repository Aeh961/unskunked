import { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { SectionHeader } from "@/src/components/SectionHeader";
import { AppText } from "@/src/components/AppText";
import { OfficialSourceLinks } from "@/src/services/officialLinks";
import { spacing } from "@/src/theme";

type Props = {
  links: OfficialSourceLinks;
  agencyAbbreviation?: string;
  compact?: boolean;
};

export function OfficialLinks({ links, agencyAbbreviation, compact = false }: Props) {
  const [showMore, setShowMore] = useState(false);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Official verification" eyebrow="Rules can change" />
      {!compact ? <AppText>Use Unskunked to plan, then verify current official rules before keeping fish.</AppText> : null}
      <View style={styles.actions}>
        <Button icon="open-outline" style={styles.button} onPress={() => Linking.openURL(links.regulations)}>
          View official regulations
        </Button>
        <Button icon="warning-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.emergencyRules)}>
          View emergency rules
        </Button>
        <Button icon="card-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.licenses)}>
          Buy fishing license
        </Button>
      </View>
      {showMore ? (
        <View style={styles.actions}>
          <Button icon="fish-outline" variant="ghost" style={styles.button} onPress={() => Linking.openURL(links.freshwaterRules)}>
            Freshwater rules
          </Button>
          <Button icon="boat-outline" variant="ghost" style={styles.button} onPress={() => Linking.openURL(links.marineAreas)}>
            Marine areas
          </Button>
          <Button icon="leaf-outline" variant="ghost" style={styles.button} onPress={() => Linking.openURL(links.shellfishSeaweed)}>
            Shellfish/seaweed
          </Button>
          <Button icon="map-outline" variant="ghost" style={styles.button} onPress={() => Linking.openURL(links.locationsDirectory)}>
            {agencyAbbreviation ? `Find ${agencyAbbreviation} locations` : "Find locations"}
          </Button>
        </View>
      ) : (
        <Button icon="chevron-down-outline" variant="ghost" onPress={() => setShowMore(true)}>
          More official links
        </Button>
      )}
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
