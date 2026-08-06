import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { RegionId, regions } from "@/src/data/regions";
import { colors, radii, spacing } from "@/src/theme";

const supportedRegionIds: RegionId[] = ["washington", "florida", "ronneby"];
const supportedRegions = regions.filter((region) => supportedRegionIds.includes(region.id));
const shortLabel: Partial<Record<RegionId, string>> = {
  ronneby: "RONNEBY"
};

type Props = {
  region: RegionId;
  onChange: (region: RegionId) => void;
};

/** Compact always-visible region switcher for the Map screen. Persistence is handled by the caller via setSelectedRegion. */
export function RegionSelector({ region, onChange }: Props) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Region" style={styles.wrap}>
      {supportedRegions.map((option) => {
        const active = option.id === region;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Region: ${option.name}`}
            onPress={() => onChange(option.id)}
            style={[styles.option, active && styles.optionActive]}
          >
            <AppText variant="caption" numberOfLines={1} style={[styles.optionText, active && styles.optionTextActive]}>
              {shortLabel[option.id] ?? option.name.toUpperCase()}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    flexDirection: "row",
    gap: 3,
    padding: 3
  },
  option: {
    alignItems: "center",
    borderRadius: radii.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.xs
  },
  optionActive: {
    backgroundColor: colors.pine
  },
  optionText: {
    color: colors.muted,
    fontWeight: "900"
  },
  optionTextActive: {
    color: colors.ink
  }
});
