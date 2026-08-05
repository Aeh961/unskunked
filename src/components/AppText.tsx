import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { colors, typography } from "@/src/theme";

type Props = PropsWithChildren<TextProps & { variant?: "displayLarge" | "display" | "hero" | "title" | "heading" | "subheading" | "body" | "caption" }>;

/**
 * `display`/`displayLarge` use the pixel-inspired font and are meant for short
 * headings only (wordmark, section titles, mission titles) - never body copy,
 * button labels, or regulation text. Everything else stays on the system font.
 */
export function AppText({ variant = "body", style, children, ...props }: Props) {
  return (
    <Text {...props} style={[styles.base, styles[variant], style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.ink,
    letterSpacing: 0
  },
  displayLarge: {
    ...typography.displayLarge,
    color: colors.ink,
    letterSpacing: 1
  },
  display: {
    ...typography.display,
    color: colors.ink,
    letterSpacing: 1
  },
  hero: {
    ...typography.hero
  },
  title: {
    ...typography.title
  },
  heading: {
    ...typography.heading
  },
  subheading: {
    ...typography.subheading
  },
  body: {
    ...typography.body
  },
  caption: {
    color: colors.muted,
    ...typography.caption
  }
});
