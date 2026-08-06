import { StyleSheet, View } from "react-native";

const LINE_COUNT = 24;

/**
 * Static (non-animated) CRT scanline texture - a subtle repeating overlay meant
 * to be used sparingly on one or two hero panels, never for readable content.
 * No motion involved, so there is nothing for reduced-motion settings to gate.
 */
export function Scanlines() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      {Array.from({ length: LINE_COUNT }).map((_, index) => (
        <View key={index} style={styles.line} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    overflow: "hidden"
  },
  line: {
    backgroundColor: "rgba(0,0,0,0.08)",
    height: 1
  }
});
