import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { getOfflinePacks } from "@/src/services/offlineDownloads";
import { colors, radii, spacing } from "@/src/theme";
import { getDownloadedOfflinePackIds, toggleOfflinePack } from "@/src/utils/localStore";

export default function OfflineScreen() {
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const packs = getOfflinePacks();

  useEffect(() => {
    getDownloadedOfflinePackIds().then(setDownloaded);
  }, []);

  async function toggle(id: string) {
    setDownloaded(await toggleOfflinePack(id));
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Offline Mode</AppText>
        <AppText style={styles.heroText}>Download local packs for maps, waterbodies, regulations, and trip logs.</AppText>
      </View>
      <Card>
        <SectionHeader title="Offline status" eyebrow="Local first" />
        <AppText>{downloaded.length ? `${downloaded.length} packs marked for offline use.` : "No packs downloaded yet. Core demo data still works offline."}</AppText>
      </Card>
      <Stack>
        {packs.map((pack) => (
          <Card key={pack.id} style={styles.card}>
            <SectionHeader title={pack.label} eyebrow={pack.type} />
            <AppText>{pack.waterbodyCount} waterbodies · {pack.speciesCount} species · about {pack.estimatedSizeMb} MB</AppText>
            <Button icon={downloaded.includes(pack.id) ? "checkmark-circle" : "download"} variant={downloaded.includes(pack.id) ? "secondary" : "primary"} onPress={() => toggle(pack.id)}>
              {downloaded.includes(pack.id) ? "Downloaded" : "Download pack"}
            </Button>
          </Card>
        ))}
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest, borderRadius: radii.md, gap: spacing.sm, padding: spacing.lg },
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" },
  card: { gap: spacing.md }
});
