import { Href, Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { fishSpecies } from "@/src/data/fish";
import { rigsAndKnots } from "@/src/data/rigs";
import { waterbodies } from "@/src/data/waterbodies";
import { useFavorites } from "@/src/hooks/useFavorites";
import { colors, radii, spacing } from "@/src/theme";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const resolved = favorites.map((favorite) => {
    if (favorite.type === "fish") {
      const item = fishSpecies.find((fish) => fish.id === favorite.id);
      return item ? { title: item.name, subtitle: `${item.difficulty} · ${item.bestBait[0]}`, href: `/fish/${item.id}` as Href } : null;
    }
    if (favorite.type === "location") {
      const item = waterbodies.find((water) => water.id === favorite.id);
      return item ? { title: item.name, subtitle: `${item.waterType} · ${item.beginnerDifficulty}`, href: "/map" as Href } : null;
    }
    const item = rigsAndKnots.find((rig) => rig.id === favorite.id);
    return item ? { title: item.name, subtitle: `${item.type} · ${item.worksFor.slice(0, 2).join(", ")}`, href: "/rigs" as Href } : null;
  }).filter(Boolean);

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>
          Favorites
        </AppText>
        <AppText style={styles.heroText}>Saved fish, waters, rigs, and knots live here locally on this device.</AppText>
      </View>
      <SectionHeader title="Saved items" eyebrow={`${resolved.length} favorites`} />
      {resolved.length > 0 ? (
        resolved.map((item) => item ? (
          <Link key={`${item.title}-${item.subtitle}`} href={item.href} asChild>
            <Card>
              <AppText variant="heading">{item.title}</AppText>
              <AppText variant="caption">{item.subtitle}</AppText>
            </Card>
          </Link>
        ) : null)
      ) : (
        <EmptyState icon="heart" title="No favorites yet" body="Tap the heart on fish, waters, rigs, or knots to save your go-to plan." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.deepWater,
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
  }
});
