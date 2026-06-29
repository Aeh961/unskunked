import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { colors, radii } from "@/src/theme";

type Props = {
  active: boolean;
  onPress: () => void;
  label?: string;
};

export function FavoriteButton({ active, onPress, label = "Toggle favorite" }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.button}>
      <Ionicons name={active ? "heart" : "heart-outline"} size={22} color={active ? colors.danger : colors.pine} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  }
});
