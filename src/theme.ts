import { AccessibilityInfo } from "react-native";

/**
 * Original arcade / field-terminal palette. `background`/`surface`/`surfaceStrong` are the
 * dark charcoal-olive chrome. `mist`/`sky` stay light sand/sage washes on purpose - they're
 * used across the app as inset chip/badge backgrounds paired with dark `pine`/`forest`/`deepWater`
 * text, so keeping them light preserves contrast everywhere without touching every screen.
 */
export const colors = {
  ink: "#eef2e2",
  muted: "#9fae8d",
  background: "#14170f",
  surface: "#1d2318",
  surfaceStrong: "#242b1d",
  line: "#4d5a40",
  mist: "#d8cfa8",
  sky: "#cbd9c0",
  river: "#1f6b73",
  deepWater: "#1d3220",
  pine: "#3f6b30",
  forest: "#2c4a22",
  moss: "#cbb98a",
  reed: "#d99a2b",
  sunrise: "#e8a33d",
  sun: "#e8a33d",
  clay: "#a83a31",
  danger: "#e57568",
  dangerFill: "#a83a31",
  good: "#5fae5a",
  caution: "#d99a2b",
  amber: "#e8a33d",
  cyan: "#4bd0dc",
  sand: "#cbb98a"
};

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44
};

export const typography = {
  display: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 14,
    lineHeight: 20
  },
  displayLarge: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 20,
    lineHeight: 28
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800" as const
  },
  hero: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800" as const
  },
  heading: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700" as const
  },
  subheading: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700" as const
  },
  body: {
    fontSize: 15,
    lineHeight: 21
  },
  caption: {
    fontSize: 12,
    lineHeight: 16
  }
};

export const radii = {
  sm: 2,
  md: 4,
  lg: 8,
  pill: 999
};

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0
  }
};

let reduceMotionEnabled = false;
AccessibilityInfo.isReduceMotionEnabled?.()
  .then((enabled) => {
    reduceMotionEnabled = enabled;
  })
  .catch(() => undefined);
AccessibilityInfo.addEventListener?.("reduceMotionChanged", (enabled: boolean) => {
  reduceMotionEnabled = enabled;
});

export const motion = {
  isReduceMotionEnabled: () => reduceMotionEnabled
};
