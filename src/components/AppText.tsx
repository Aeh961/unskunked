import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { colors, typography } from "@/src/theme";

type Props = PropsWithChildren<TextProps & { variant?: "hero" | "title" | "heading" | "subheading" | "body" | "caption" }>;

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
