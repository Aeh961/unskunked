import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/theme";
import { openYoutubeSearch } from "@/src/utils/youtube";
import { AppText } from "./AppText";

export function YoutubeLink({ query }: { query: string }) {
  return (
    <Pressable style={styles.link} onPress={() => openYoutubeSearch(query)}>
      <Ionicons name="logo-youtube" size={18} color={colors.danger} />
      <AppText style={styles.text}>{query}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.xs
  },
  text: {
    color: colors.river,
    flex: 1,
    fontWeight: "700"
  }
});
