import { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { SectionHeader } from "@/src/components/SectionHeader";
import { AppText } from "@/src/components/AppText";
import { OfficialSourceLinks } from "@/src/services/officialLinks";
import { colors, spacing } from "@/src/theme";

type Props = {
  links: OfficialSourceLinks;
  agencyAbbreviation?: string;
  compact?: boolean;
  context?: "fishing" | "shellfish";
};

export function OfficialLinks({ links, agencyAbbreviation, compact = false, context = "fishing" }: Props) {
  const [showMore, setShowMore] = useState(false);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Rules can change" eyebrow="Check before you go" action={<Ionicons name="warning-outline" size={18} color={colors.amber} />} />
      {!compact ? <AppText>Verify current official rules and emergency updates before you go.</AppText> : null}
      <View style={styles.actions}>
        {context === "shellfish" ? (
          <>
            <Button icon="water-outline" style={styles.button} onPress={() => Linking.openURL(links.regulations)}>
              Beach Status
            </Button>
            <Button icon="warning-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.emergencyRules)}>
              Marine Toxins
            </Button>
            <Button icon="leaf-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.shellfishSeaweed)}>
              Harvest Rules
            </Button>
          </>
        ) : (
          <>
            <Button icon="open-outline" style={styles.button} onPress={() => Linking.openURL(links.regulations)}>
              Official Rules
            </Button>
            <Button icon="warning-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.emergencyRules)}>
              Emergency Updates
            </Button>
            <Button icon="card-outline" variant="secondary" style={styles.button} onPress={() => Linking.openURL(links.licenses)}>
              License Info
            </Button>
          </>
        )}
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
