import { Linking, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { ConfidenceBadge, ConfidenceRow } from "@/src/components/ConfidenceBadge";
import { ListItem } from "@/src/components/ListItem";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { providerMetadata, getFreshnessState, verificationWorkflow } from "@/src/services/dataTrust";
import { getImportReadinessReport } from "@/src/services/wdfwImportPipeline";
import { getWashingtonTrustSummary, regionalProviders } from "@/src/services/regionalProviders";
import { colors, radii, spacing } from "@/src/theme";

export default function DataSourcesScreen() {
  const importReport = getImportReadinessReport();
  const trustSummary = getWashingtonTrustSummary();

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Data Sources</AppText>
        <AppText style={styles.heroText}>See where Unskunked guidance comes from, how fresh it is, and what still needs official verification.</AppText>
      </View>

      <View style={styles.stats}>
        <Stat label="Providers" value={`${providerMetadata.length}`} />
        <Stat label="Official/Verified" value={`${trustSummary.verifiedCount}`} />
        <Stat label="Imported" value={`${trustSummary.importedCount}`} />
      </View>

      <Card style={styles.card}>
        <SectionHeader title="Source confidence" eyebrow="How to read the badges" />
        <Stack>
          <ConfidenceRow confidence="Official Source" />
          <ConfidenceRow confidence="Imported" />
          <ConfidenceRow confidence="Needs Verification" />
          <ConfidenceRow confidence="Demo Data" />
        </Stack>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Import readiness" eyebrow="WDFW snapshot framework" />
        <AppText>Data last updated: {importReport.dataLastUpdated}</AppText>
        <AppText>Source manifests: {importReport.sourceCount}</AppText>
        <AppText>Waterbodies with IDs/source metadata: {importReport.waterbodyCount}</AppText>
        <AppText>Shellfish locations: {importReport.shellfishLocationCount}</AppText>
        <AppText>Missing source metadata: {importReport.missingSourceWaterbodies.length ? importReport.missingSourceWaterbodies.join(", ") : "None"}</AppText>
      </Card>

      <SectionHeader title="Providers" eyebrow="Trust metadata" />
      {providerMetadata.map((provider) => {
        const freshness = getFreshnessState(provider.freshness);
        return (
          <Card key={provider.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <SectionHeader title={provider.label} eyebrow={provider.organization} />
                <AppText variant="caption">{provider.sourceType} · {provider.updateFrequency} updates · {provider.verificationStatus}</AppText>
              </View>
              <ConfidenceBadge confidence={provider.confidence} compact />
            </View>
            <Stack>
              <AppText>Activities: {provider.activities.join(", ")}</AppText>
              <AppText>Data types: {provider.dataTypes.join(", ")}</AppText>
              <AppText>Created: {provider.freshness.createdAt}</AppText>
              <AppText>Imported: {provider.freshness.importedAt}</AppText>
              <AppText>Last updated: {provider.freshness.lastUpdatedAt}</AppText>
              <AppText>Last verified: {provider.freshness.lastVerifiedAt}</AppText>
              <AppText style={freshness.isStale || freshness.isExpiringSoon ? styles.warning : styles.good}>{freshness.warning}</AppText>
              <AppText variant="caption">{provider.notes}</AppText>
              {provider.sourceUrl ? (
                <Pressable accessibilityRole="link" accessibilityLabel={`Open source for ${provider.label}`} onPress={() => Linking.openURL(provider.sourceUrl!)} style={styles.sourceLink}>
                  <AppText variant="caption" style={styles.sourceText}>Open official/source page</AppText>
                </Pressable>
              ) : null}
            </Stack>
          </Card>
        );
      })}

      <Card style={styles.card}>
        <SectionHeader title="Verification workflow" eyebrow="Admin-ready states" />
        <Stack>
          {verificationWorkflow.map((record) => (
            <ListItem
              key={record.id}
              icon={record.status === "verified" ? "checkmark-circle" : record.status === "rejected" ? "close-circle" : "clipboard"}
              title={`${record.subjectId}: ${record.status}`}
              subtitle={`${record.subjectType} · ${record.reviewedAt} · ${record.notes}`}
              right={<View style={styles.statusPill}><AppText variant="caption" style={styles.statusText}>{record.status}</AppText></View>}
            />
          ))}
        </Stack>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Regional providers" eyebrow="Plug-and-play roadmap" />
        <Stack>
          {regionalProviders.map((provider) => (
            <ListItem
              key={provider.region}
              icon={provider.region === "washington" ? "shield-checkmark" : "construct"}
              title={provider.name}
              subtitle={`${provider.status} · ${provider.sourceOrganization} · ${provider.supportedDomains.join(", ")}`}
            />
          ))}
        </Stack>
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" style={styles.statLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg
  },
  lightText: {
    color: "#fff"
  },
  heroText: {
    color: colors.mist,
    fontWeight: "700"
  },
  stats: {
    flexDirection: "row",
    gap: spacing.sm
  },
  stat: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 72,
    padding: spacing.md
  },
  statLabel: {
    fontWeight: "900",
    textAlign: "center"
  },
  card: {
    gap: spacing.md
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  flex: {
    flex: 1
  },
  warning: {
    color: colors.danger,
    fontWeight: "900"
  },
  good: {
    color: colors.good,
    fontWeight: "900"
  },
  sourceLink: {
    alignSelf: "flex-start",
    borderColor: colors.river,
    borderRadius: radii.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  sourceText: {
    color: colors.river,
    fontWeight: "900"
  },
  statusPill: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  statusText: {
    color: colors.pine,
    fontWeight: "900"
  }
});
