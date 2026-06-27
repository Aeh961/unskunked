import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { Screen } from "@/src/components/Screen";
import { colors, spacing } from "@/src/theme";

const quickLinks = [
  { label: "Fish Near Me", href: "/map", icon: "navigate" },
  { label: "Open Map", href: "/map", icon: "map" },
  { label: "Ask Unskunked", href: "/ask", icon: "chatbubble-ellipses" },
  { label: "Knots and Rigs", href: "/rigs", icon: "git-branch" }
] as const;

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Unskunked</AppText>
        <AppText style={styles.tagline}>Know what to fish, where to fish, and how to rig up.</AppText>
      </View>

      <View style={styles.quickGrid}>
        {quickLinks.map((item) => (
          <Link key={item.label} href={item.href} asChild>
            <Pressable style={styles.quickButton}>
              <Ionicons name={item.icon} size={22} color="#fff" />
              <AppText style={styles.quickText}>{item.label}</AppText>
            </Pressable>
          </Link>
        ))}
      </View>

      <Disclaimer />

      <Card>
        <AppText variant="heading">Don't get skunked today</AppText>
        <AppText>Start with easy targets like stocked trout or perch, then match the bait to where they feed.</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Check rules before you cast</AppText>
        <AppText>Look up the exact waterbody, season, daily limit, size limit, and emergency closures.</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Match your bait to the fish</AppText>
        <AppText>Worms catch perch and trout. Soft plastics shine for bass. Salmon rules need extra care.</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.pine,
    borderRadius: 8,
    gap: spacing.sm,
    padding: spacing.lg
  },
  tagline: {
    color: "#eef7ef",
    fontSize: 18,
    fontWeight: "600"
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  quickButton: {
    alignItems: "center",
    backgroundColor: colors.river,
    borderRadius: 8,
    flexBasis: "48%",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 58,
    padding: spacing.md
  },
  quickText: {
    color: "#fff",
    flex: 1,
    fontWeight: "800"
  }
});
