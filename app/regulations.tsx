import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { ConfidenceBadge } from "@/src/components/ConfidenceBadge";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { waterbodies } from "@/src/data/waterbodies";
import { getCurrentRegulations } from "@/src/services/regulationEngine";
import { getFreshnessState, getProviderById } from "@/src/services/dataTrust";
import { colors, radii, spacing } from "@/src/theme";

export default function RegulationsScreen() {
  const featured = waterbodies.slice(0, 6).map((water) => ({ water, rules: getCurrentRegulations({ waterbodyId: water.id }) }));
  const source = getProviderById("wdfw-regulations");
  const freshness = source ? getFreshnessState(source.freshness) : null;

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Current Regulations</AppText>
        <AppText style={styles.heroText}>Offline WDFW-ready summaries with emergency-rule reminders.</AppText>
      </View>
      <Stack>
        {featured.map(({ water, rules }) => (
          <Card key={water.id}>
            <SectionHeader title={water.name} eyebrow={`Data last updated: ${rules.dataLastUpdated}`} />
            {source ? (
              <View style={styles.sourceRow}>
                <ConfidenceBadge confidence={source.confidence} compact />
                <AppText variant="caption" style={styles.sourceCopy}>{freshness?.warning}</AppText>
              </View>
            ) : null}
            <View style={styles.badges}>
              {rules.badges.map((badge) => (
                <View key={badge.label} style={[styles.badge, badge.tone === "caution" && styles.caution, badge.tone === "bad" && styles.bad]}>
                  <AppText variant="caption" style={styles.badgeText}>{badge.label}</AppText>
                </View>
              ))}
            </View>
            <AppText>Season: {rules.season}</AppText>
            <AppText>Catch limits: {rules.catchLimits.join(" · ")}</AppText>
            <AppText>Bait restrictions: {rules.baitRestrictions.join(" · ")}</AppText>
            <AppText variant="caption">{rules.emergencyRules[0]}</AppText>
            <AppText variant="caption" style={styles.verify}>Always verify official rules and emergency rules before keeping fish or shellfish.</AppText>
          </Card>
        ))}
      </Stack>
      <OfficialLinks />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.deepWater, borderRadius: radii.md, gap: spacing.sm, padding: spacing.lg },
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  sourceRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  sourceCopy: { color: colors.muted, flex: 1 },
  badge: { backgroundColor: colors.mist, borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  caution: { backgroundColor: "#fff3d6" },
  bad: { backgroundColor: "#f9ded8" },
  badgeText: { color: colors.pine, fontWeight: "900" },
  verify: { color: colors.danger, fontWeight: "800" }
});
