import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors, radii, spacing } from "@/src/theme";
import { getBetaExportData } from "@/src/utils/localStore";
import { formatJsonExport, shareText } from "@/src/utils/share";

type ExportData = Awaited<ReturnType<typeof getBetaExportData>>;

export default function ExportScreen() {
  const [data, setData] = useState<ExportData | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getBetaExportData().then(setData);
  }, []);

  async function exportAll() {
    if (!data) return;
    await shareText(formatJsonExport(data), "Unskunked beta export");
    setStatus("Opened native share sheet with beta export JSON.");
  }

  async function exportSection(key: keyof ExportData) {
    if (!data) return;
    await shareText(formatJsonExport({ exportedAt: new Date().toISOString(), [key]: data[key] }), `Unskunked ${String(key)} export`);
    setStatus(`Opened export for ${String(key)}.`);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Beta Data Export</AppText>
        <AppText style={styles.heroText}>Share local JSON for trip logs, favorites, plans, feedback, profile, and preferences.</AppText>
      </View>
      <Card style={styles.card}>
        <SectionHeader title="Export all beta data" eyebrow="JSON" />
        <AppText>This uses the native share sheet. Choose Messages, Mail, Notes, AirDrop, or another destination available on your device.</AppText>
        <Button icon="share-social" onPress={exportAll}>Export all JSON</Button>
        {status ? <AppText variant="caption" style={styles.status}>{status}</AppText> : null}
      </Card>
      {data ? (
        <Card style={styles.card}>
          <SectionHeader title="Export sections" eyebrow="Granular" />
          <Stack>
            {(["tripLogs", "favorites", "tripPlans", "feedback", "profile", "selectedRegion"] as Array<keyof ExportData>).map((key) => (
              <Button key={String(key)} icon="document-text" variant="secondary" onPress={() => exportSection(key)}>
                Export {String(key)}
              </Button>
            ))}
          </Stack>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest, borderRadius: radii.md, gap: spacing.sm, padding: spacing.lg },
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" },
  card: { gap: spacing.md },
  status: { color: colors.good, fontWeight: "900" }
});
