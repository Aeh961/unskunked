import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { ConfidenceBadge } from "@/src/components/ConfidenceBadge";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { getWaterbodiesForRegion } from "@/src/data/waterbodies";
import { useSelectedRegion } from "@/src/hooks/useSelectedRegion";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { getFreshnessState, getProviderById } from "@/src/services/dataTrust";
import { Status } from "@/src/data/types";
import { colors, radii, spacing } from "@/src/theme";

const simpleExplanations: Record<Status, string> = {
  open: "Open with standard limits. Check the season and catch limit before keeping fish.",
  restricted: "Open with restrictions. Verify catch limits, gear rules, and seasonal closures before fishing.",
  closed: "Closed to fishing. Do not fish or keep fish here until official rules change."
};

export default function RegulationsScreen() {
  const { region, officialLinkProvider } = useSelectedRegion();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const featured = getWaterbodiesForRegion(region).slice(0, 6).map((water) => ({ water, rules: getCurrentRegulations({ waterbodyId: water.id }) }));
  const source = getProviderById("wdfw-regulations");
  const freshness = source ? getFreshnessState(source.freshness) : null;

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Current Regulations</AppText>
        <AppText style={styles.heroText}>Offline WDFW-ready summaries with emergency-rule reminders.</AppText>
      </View>
      <Stack>
        {featured.map(({ water, rules }) => {
          const expanded = expandedId === water.id;
          return (
            <Card key={water.id}>
              <SectionHeader title={water.name} eyebrow={`Updated ${rules.dataLastUpdated}`} />
              <StatusBadge status={rules.status} />
              <AppText>{simpleExplanations[rules.status]}</AppText>
              {expanded ? (
                <Stack>
                  {source ? (
                    <View style={styles.sourceRow}>
                      <ConfidenceBadge confidence={source.confidence} compact />
                      <AppText variant="caption" style={styles.sourceCopy}>{freshness?.warning}</AppText>
                    </View>
                  ) : null}
                  <AppText>Season: {rules.season}</AppText>
                  <AppText>Catch limits: {rules.catchLimits.join(" · ")}</AppText>
                  <AppText>Bait restrictions: {rules.baitRestrictions.join(" · ")}</AppText>
                  <AppText variant="caption">{rules.emergencyRules[0]}</AppText>
                  <AppText variant="caption" style={styles.verify}>Always verify official rules and emergency rules before keeping fish or shellfish.</AppText>
                </Stack>
              ) : null}
              <Button icon={expanded ? "chevron-up-outline" : "chevron-down-outline"} variant="ghost" onPress={() => setExpandedId(expanded ? null : water.id)}>
                {expanded ? "Hide details" : "Details"}
              </Button>
            </Card>
          );
        })}
      </Stack>
      <OfficialLinks links={officialLinkProvider.getLinks()} agencyAbbreviation={officialLinkProvider.agencyAbbreviation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.deepWater, borderRadius: radii.md, gap: spacing.sm, padding: spacing.lg },
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" },
  sourceRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  sourceCopy: { color: colors.muted, flex: 1 },
  verify: { color: colors.danger, fontWeight: "800" }
});
