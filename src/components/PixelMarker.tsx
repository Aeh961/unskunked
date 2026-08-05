import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "@/src/theme";
import { MapMarkerKind } from "@/src/services/mapMarkers";

const iconByKind: Record<MapMarkerKind, keyof typeof Ionicons.glyphMap> = {
  fishing: "fish",
  clamming: "ellipse",
  crabbing: "bug"
};

/** Original square-pixel map pin - no image assets, just a bordered tinted square with a glyph. */
export function PixelMarker({ kind, tint }: { kind: MapMarkerKind; tint: string }) {
  return (
    <View style={[styles.square, { backgroundColor: tint }]}>
      <Ionicons name={iconByKind[kind]} size={12} color={colors.background} />
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    alignItems: "center",
    borderColor: colors.ink,
    borderRadius: 3,
    borderWidth: 2,
    height: 22,
    justifyContent: "center",
    width: 22
  }
});
