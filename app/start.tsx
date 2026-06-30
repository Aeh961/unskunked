import { Href, Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { fishSpecies } from "@/src/data/fish";
import { regions, RegionId } from "@/src/data/regions";
import { waterbodies } from "@/src/data/waterbodies";
import { colors, radii, spacing } from "@/src/theme";
import { ExperienceLevel, getOnboardingProfile, getSelectedRegion, setOnboardingProfile, setSelectedRegion } from "@/src/utils/localStore";

const steps = [
  {
    title: "Pick beginner water",
    body: "Start with a lake, park, or pier where casting is easy and rules are simple to verify.",
    href: "/map",
    icon: "map" as const
  },
  {
    title: "Choose one target",
    body: "Trout, perch, and bluegill are friendly first targets. Avoid complex salmon rules until you are ready.",
    href: "/fish",
    icon: "fish" as const
  },
  {
    title: "Build one rig",
    body: "Answer a few questions and use the recommended rig instead of packing every tackle option.",
    href: "/rigs",
    icon: "git-branch" as const
  },
  {
    title: "Log the result",
    body: "Save bait, rig, location, and what happened. Patterns show up after just a few trips.",
    href: "/log",
    icon: "journal" as const
  }
];

export default function StartHereScreen() {
  const [region, setRegion] = useState<RegionId>("washington");
  const [experience, setExperience] = useState<ExperienceLevel>("Beginner");
  const [style, setStyle] = useState<"Shore" | "Boat" | "Dock" | "River" | "Saltwater">("Shore");
  const [favoriteFishIds, setFavoriteFishIds] = useState<string[]>(["rainbow-trout"]);
  const [favoriteWaterbodyIds, setFavoriteWaterbodyIds] = useState<string[]>(["green-lake"]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([getSelectedRegion(), getOnboardingProfile()]).then(([selectedRegion, profile]) => {
      setRegion(selectedRegion);
      setExperience(profile.experience);
      setStyle(profile.preferredStyle);
      setFavoriteFishIds(profile.favoriteFishIds);
      setFavoriteWaterbodyIds(profile.favoriteWaterbodyIds);
    });
  }, []);

  async function saveProfile(nextRegion = region) {
    await setSelectedRegion(nextRegion);
    await setOnboardingProfile({
      experience,
      preferredStyle: style,
      favoriteFishIds,
      favoriteWaterbodyIds
    });
    setSaved(true);
  }

  async function chooseRegion(nextRegion: RegionId) {
    setRegion(nextRegion);
    await saveProfile(nextRegion);
  }

  function toggleItem(id: string, values: string[], setter: (next: string[]) => void) {
    const next = values.includes(id) ? values.filter((item) => item !== id) : [...values, id];
    setter(next.length ? next : [id]);
    setSaved(false);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>
          Start Here
        </AppText>
        <AppText style={styles.heroText}>A simple beginner path for getting unskunked without overthinking the tackle wall.</AppText>
      </View>
      <Disclaimer />

      <Card style={styles.planCard}>
        <SectionHeader title="Choose your region" eyebrow="Beta setup" />
        <View style={styles.regionGrid}>
          {regions.map((item) => (
            <Pressable key={item.id} onPress={() => chooseRegion(item.id)} style={[styles.regionCard, region === item.id && styles.regionActive]}>
              <AppText variant="subheading" style={region === item.id && styles.regionActiveText}>{item.name}</AppText>
              <AppText variant="caption" style={region === item.id && styles.regionActiveText}>{item.status}</AppText>
            </Pressable>
          ))}
        </View>
        <AppText variant="caption">{regions.find((item) => item.id === region)?.note}</AppText>
        <View style={styles.regionGrid}>
          {(["Beginner", "Intermediate", "Advanced"] as const).map((item) => (
            <Pressable key={item} onPress={() => { setExperience(item); setSaved(false); }} style={[styles.experience, experience === item && styles.regionActive]}>
              <AppText variant="caption" style={[styles.experienceText, experience === item && styles.regionActiveText]}>{item}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.planCard}>
        <SectionHeader title="Fishing style" eyebrow="Personalize" />
        <View style={styles.regionGrid}>
          {(["Shore", "Boat", "Dock", "River", "Saltwater"] as const).map((item) => (
            <Pressable key={item} onPress={() => { setStyle(item); setSaved(false); }} style={[styles.experience, style === item && styles.regionActive]}>
              <AppText variant="caption" style={[styles.experienceText, style === item && styles.regionActiveText]}>{item}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.planCard}>
        <SectionHeader title="Favorite fish" eyebrow={`${favoriteFishIds.length} selected`} />
        <View style={styles.regionGrid}>
          {fishSpecies.slice(0, 8).map((fish) => (
            <Pressable key={fish.id} onPress={() => toggleItem(fish.id, favoriteFishIds, setFavoriteFishIds)} style={[styles.regionCard, favoriteFishIds.includes(fish.id) && styles.regionActive]}>
              <AppText variant="subheading" style={favoriteFishIds.includes(fish.id) && styles.regionActiveText}>{fish.name}</AppText>
              <AppText variant="caption" style={favoriteFishIds.includes(fish.id) && styles.regionActiveText}>{fish.difficulty}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.planCard}>
        <SectionHeader title="Favorite waterbodies" eyebrow={`${favoriteWaterbodyIds.length} selected`} />
        <View style={styles.regionGrid}>
          {waterbodies.slice(0, 6).map((water) => (
            <Pressable key={water.id} onPress={() => toggleItem(water.id, favoriteWaterbodyIds, setFavoriteWaterbodyIds)} style={[styles.regionCard, favoriteWaterbodyIds.includes(water.id) && styles.regionActive]}>
              <AppText variant="subheading" style={favoriteWaterbodyIds.includes(water.id) && styles.regionActiveText}>{water.name}</AppText>
              <AppText variant="caption" style={favoriteWaterbodyIds.includes(water.id) && styles.regionActiveText}>{water.waterType} · {water.beginnerDifficulty}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.planCard}>
        <SectionHeader title="Your first-trip flow" eyebrow="15 minute setup" />
        <Stack>
          {steps.map((step, index) => (
            <Link key={step.title} href={step.href as Href} asChild>
              <Pressable style={styles.step}>
                <View style={styles.stepNumber}>
                  <AppText variant="caption" style={styles.stepNumberText}>
                    {index + 1}
                  </AppText>
                </View>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={22} color={colors.pine} />
                </View>
                <View style={styles.stepCopy}>
                  <AppText variant="subheading">{step.title}</AppText>
                  <AppText variant="caption">{step.body}</AppText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            </Link>
          ))}
        </Stack>
      </Card>

      <Card style={styles.tipCard}>
        <SectionHeader title="Start Fishing Smarter" eyebrow="Ready" />
        <AppText>Save your beta profile, then start with a plan that matches your region, fish, style, and experience.</AppText>
        <Button icon="checkmark-circle" onPress={() => saveProfile()}>{saved ? "Profile saved" : "Save beta profile"}</Button>
        <Link href={"/plan" as Href} asChild>
          <Button icon="calendar" variant="secondary">Plan first trip</Button>
        </Link>
      </Card>
    </Screen>
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
  planCard: {
    gap: spacing.md
  },
  step: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  stepNumber: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: radii.pill,
    height: 26,
    justifyContent: "center",
    width: 26
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "900"
  },
  stepIcon: {
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  stepCopy: {
    flex: 1,
    gap: spacing.xxs
  },
  tipCard: {
    gap: spacing.md
  },
  regionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  regionCard: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: "48%",
    gap: spacing.xs,
    padding: spacing.md
  },
  regionActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine
  },
  regionActiveText: {
    color: "#fff"
  },
  experience: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  experienceText: {
    fontWeight: "900"
  }
});
