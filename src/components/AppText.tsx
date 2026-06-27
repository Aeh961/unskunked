import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { colors } from "@/src/theme";

type Props = PropsWithChildren<TextProps & { variant?: "title" | "heading" | "body" | "caption" }>;

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
    lineHeight: 22
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26
  },
  body: {
    fontSize: 16
  },
  caption: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  }
});
