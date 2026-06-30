import { Href, Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { regions } from "@/src/data/regions";
import { colors, radii, spacing } from "@/src/theme";

const roadmap = [
  "Official WDFW data import with source timestamps",
  "Real map provider and GPS-based waterbody search",
  "Weather, tide, and seasonal context",
  "Photo attachments for trip logs",
  "Optional account sync after local beta validation"
];

export default function AboutScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>About Unskunked</AppText>
        <AppText style={styles.heroText}>A beginner-first fishing assistant for planning smarter trips and learning what worked.</AppText>
      </View>
      <Card>
        <SectionHeader title="Mission" eyebrow="Why this exists" />
        <AppText>Unskunked helps new anglers turn confusing fishing choices into a simple plan: where to go, what to target, what to tie, what to bring, and what to log afterward.</AppText>
      </Card>
      <Card>
        <SectionHeader title="Safety and legal disclaimer" eyebrow="Important" />
        <Stack>
          <AppText>Unskunked is for planning and education only.</AppText>
          <AppText>Do not rely on this app as legal advice.</AppText>
          <AppText>Always verify official rules, emergency rules, license requirements, seasons, limits, size rules, closures, and gear restrictions before fishing or keeping fish.</AppText>
        </Stack>
      </Card>
      <Card>
        <SectionHeader title="Current region support" eyebrow="Beta" />
        <Stack>
          {regions.map((region) => (
            <AppText key={region.id}>{region.name}: {region.status} - {region.note}</AppText>
          ))}
        </Stack>
      </Card>
      <Card>
        <SectionHeader title="Roadmap" eyebrow="Future" />
        <Stack>
          {roadmap.map((item) => (
            <AppText key={item}>- {item}</AppText>
          ))}
        </Stack>
      </Card>
      <OfficialLinks />
      <Link href={"/feedback" as Href} asChild>
        <Button icon="chatbox">Send beta feedback</Button>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.deepWater, borderRadius: radii.md, gap: spacing.sm, padding: spacing.lg },
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" }
});
