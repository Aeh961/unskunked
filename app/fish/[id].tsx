import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { OfficialLinks } from "@/src/components/OfficialLinks";
import { Button } from "@/src/components/Button";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { StatusBadge } from "@/src/components/StatusBadge";
import { YoutubeLink } from "@/src/components/YoutubeLink";
import { fishSpecies } from "@/src/data/fish";
import { useFavorites } from "@/src/hooks/useFavorites";
import { regulationService } from "@/src/services/regulations";
import { colors, radii, spacing } from "@/src/theme";
import { formatFishShare, shareText } from "@/src/utils/share";
import { trackBetaEvent } from "@/src/utils/localStore";

export default function FishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fish = fishSpecies.find((item) => item.id === id);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    if (fish) {
      trackBetaEvent("fish-view", fish.name);
    }
  }, [fish]);

  if (!fish) {
    return (
      <Screen>
        <EmptyState
          icon="fish"
          title="Fish not found"
          body="That species is not in the local MVP catalog yet. Head back to the Fish tab and pick one from the list."
        />
      </Screen>
    );
  }

  const selectedFish = fish;
  const regulation = regulationService.getSummary({ state: "WA", speciesId: selectedFish.id, date: new Date().toISOString() });

  async function shareFish() {
    await shareText(formatFishShare(selectedFish), `Unskunked ${selectedFish.name} tip`);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.imagePlaceholder}>
          <AppText style={styles.placeholderText}>{fish.name}</AppText>
        </View>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <AppText variant="title" style={styles.lightText}>
              {fish.name}
            </AppText>
            <AppText style={styles.headerSubtitle}>
              {fish.difficulty} · Best {fish.bestTimeOfDay.toLowerCase()}
            </AppText>
          </View>
          <StatusBadge status={fish.status} />
          <FavoriteButton active={isFavorite("fish", fish.id)} onPress={() => toggle("fish", fish.id)} label={`Favorite ${fish.name}`} />
        </View>
      </View>
      <Disclaimer />

      <Card>
        <SectionHeader title="Quick read" eyebrow="Target plan" />
        <View style={styles.grid}>
          <Fact label="Season" value={fish.bestSeason} />
          <Fact label="Weather" value={fish.bestWeather} />
          <Fact label="Time" value={fish.bestTimeOfDay} />
          <Fact label="Difficulty" value={fish.difficulty} />
        </View>
      </Card>

      <Card>
        <SectionHeader title="Recommended setup" eyebrow="Gear" />
        <Stack>
          <AppText>Rod: {fish.rodSetup}</AppText>
          <AppText>Reel: {fish.reel}</AppText>
          <AppText>Line: {fish.line}</AppText>
          <AppText>Hook sizes: {fish.hook}</AppText>
          <AppText>Best bait: {fish.bestBait.join(", ")}</AppText>
          <AppText>Artificial lures: {fish.bestLures.join(", ")}</AppText>
          <AppText>Knots: {fish.knots.join(", ")}</AppText>
          <AppText>Rigs: {fish.rigs.join(", ")}</AppText>
        </Stack>
      </Card>
      <Button icon="share-social" variant="secondary" onPress={shareFish}>Share fish tip</Button>

      <InfoList title="Where to find them" eyebrow="Habitat" items={fish.whereToFind} />
      <InfoList title="Casting tips" eyebrow="Technique" items={fish.castingTips} />
      <InfoList title="Common mistakes" eyebrow="Avoid this" items={fish.commonMistakes} danger />

      <Card>
        <SectionHeader title="Rules snapshot" eyebrow="Verify before keeping" />
        <Stack>
          <AppText>Legal status: {fish.regulation.status}</AppText>
          <AppText>Season: {fish.regulation.season}</AppText>
          <AppText>Daily limit: {fish.regulation.dailyLimit}</AppText>
          <AppText>Size limit: {fish.regulation.sizeLimit}</AppText>
          <AppText>Restrictions: {fish.regulation.restrictions.join(" ")}</AppText>
          <AppText>Catch and release: {regulation.catchAndRelease ? "Yes or likely" : "Not shown in mock summary"}</AppText>
          <AppText>Gear restrictions: {regulation.gearRestrictions.join(", ") || "Verify by waterbody"}</AppText>
          <AppText variant="caption" style={styles.warning}>
            {fish.regulation.warning}
          </AppText>
        </Stack>
      </Card>
      <OfficialLinks links={regulation.sourceLinks} compact />

      <Card>
        <SectionHeader title="Watch on YouTube" eyebrow="External searches" />
        {fish.youtubeSearches.map((query) => (
          <YoutubeLink key={query} query={query} />
        ))}
      </Card>
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <AppText variant="caption" style={styles.factLabel}>
        {label}
      </AppText>
      <AppText style={styles.factValue}>{value}</AppText>
    </View>
  );
}

function InfoList({ title, eyebrow, items, danger = false }: { title: string; eyebrow: string; items: string[]; danger?: boolean }) {
  return (
    <Card>
      <SectionHeader title={title} eyebrow={eyebrow} />
      <Stack>
        {items.map((item) => (
          <View key={item} style={styles.tipRow}>
            <View style={[styles.tipDot, danger && styles.dangerDot]} />
            <AppText style={styles.tipText}>{item}</AppText>
          </View>
        ))}
      </Stack>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    gap: spacing.md,
    padding: spacing.md
  },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: colors.river,
    borderRadius: radii.md,
    height: 178,
    justifyContent: "center"
  },
  placeholderText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  titleBlock: {
    flex: 1
  },
  lightText: {
    color: "#fff"
  },
  headerSubtitle: {
    color: colors.mist,
    fontWeight: "800"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  fact: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: "48%",
    gap: spacing.xs,
    padding: spacing.md
  },
  factLabel: {
    color: colors.river,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  factValue: {
    fontWeight: "800"
  },
  warning: {
    color: colors.danger,
    fontWeight: "800"
  },
  tipRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  tipDot: {
    backgroundColor: colors.river,
    borderRadius: radii.pill,
    height: 8,
    marginTop: 7,
    width: 8
  },
  dangerDot: {
    backgroundColor: colors.danger
  },
  tipText: {
    flex: 1
  }
});
