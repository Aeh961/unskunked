import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Polygon, Rect } from "react-native-svg";
import { AppText } from "@/src/components/AppText";
import { getSkunkShapes, MascotShape, MASCOT_OUTLINE, MascotPose } from "@/src/data/skunkMascotArt";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { pickBoundedOffset, pickIdleDelay, pickSpeechLine } from "@/src/utils/mascotAnimation";
import { colors, radii, spacing } from "@/src/theme";

export type MascotVariant = "idle" | "thinking" | "fishing" | "celebrating" | "warning" | "empty" | "loading" | "success";

type Props = {
  variant?: MascotVariant;
  size?: number;
  interactive?: boolean;
  showBubble?: boolean;
  message?: string;
  position?: "corner" | "center" | "inline";
  reducedMotion?: boolean;
};

const poseByVariant: Record<MascotVariant, MascotPose> = {
  idle: "idle",
  fishing: "cast",
  thinking: "resting",
  celebrating: "resting",
  warning: "resting",
  empty: "resting",
  loading: "resting",
  success: "resting"
};

const badgeByVariant: Partial<Record<MascotVariant, { icon: keyof typeof Ionicons.glyphMap; color: string }>> = {
  thinking: { icon: "help", color: colors.sky },
  celebrating: { icon: "sparkles", color: colors.amber },
  warning: { icon: "warning", color: colors.danger },
  loading: { icon: "ellipsis-horizontal", color: colors.muted },
  success: { icon: "checkmark-circle", color: colors.good }
};

function renderShape(shape: MascotShape, index: number) {
  switch (shape.kind) {
    case "rect":
      return <Rect key={index} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} fill={shape.fill} stroke={MASCOT_OUTLINE} strokeWidth={1.5} />;
    case "polygon":
      return <Polygon key={index} points={shape.points} fill={shape.fill} stroke={MASCOT_OUTLINE} strokeWidth={1.5} strokeLinejoin="round" />;
    case "circle":
      return <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} stroke={MASCOT_OUTLINE} strokeWidth={1.5} />;
    case "line":
      return <Line key={index} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke={shape.stroke} strokeWidth={shape.strokeWidth ?? 2} strokeLinecap="round" />;
    case "ellipse":
      return <Ellipse key={index} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={shape.fill} />;
    default:
      return null;
  }
}

/**
 * Reusable original pixel-art skunk-with-fishing-rod mascot. Idle motion and the tap
 * "dodge" are gated on useReducedMotion; timers are always cleared on unmount/blur so
 * off-screen instances never keep animating or leaking.
 */
export function SkunkMascot({
  variant = "idle",
  size = 64,
  interactive = false,
  showBubble = false,
  message,
  position = "inline",
  reducedMotion
}: Props) {
  const detectedReducedMotion = useReducedMotion();
  const isReducedMotion = reducedMotion ?? detectedReducedMotion;
  const offset = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const [bubbleText, setBubbleText] = useState<string | null>(showBubble ? message ?? null : null);
  const focusedRef = useRef(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cancelledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      return () => {
        focusedRef.current = false;
      };
    }, [])
  );

  useEffect(() => {
    cancelledRef.current = false;
    if (isReducedMotion) return undefined;

    function scheduleNext() {
      idleTimer.current = setTimeout(() => {
        if (cancelledRef.current) return;
        if (!focusedRef.current) {
          scheduleNext();
          return;
        }
        Animated.sequence([
          Animated.timing(bounce, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(bounce, { toValue: 0, duration: 280, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
        ]).start(() => {
          if (!cancelledRef.current) scheduleNext();
        });
      }, pickIdleDelay());
    }
    scheduleNext();

    return () => {
      cancelledRef.current = true;
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isReducedMotion, bounce]);

  useEffect(
    () => () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    },
    []
  );

  function handleTap() {
    if (!interactive) return;
    if (isReducedMotion) {
      Animated.sequence([
        Animated.timing(pressScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
        Animated.timing(pressScale, { toValue: 1, duration: 120, useNativeDriver: true })
      ]).start();
    } else {
      const bounded = pickBoundedOffset(size * 0.18);
      Animated.spring(offset, { toValue: bounded, useNativeDriver: true, friction: 5, tension: 80 }).start(() => {
        Animated.spring(offset, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 5, tension: 80 }).start();
      });
    }
    if (showBubble) {
      setBubbleText(message ?? pickSpeechLine());
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubbleText(null), 1600);
    }
  }

  const shapes = getSkunkShapes(poseByVariant[variant]);
  const badge = badgeByVariant[variant];
  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.07] });

  const sprite = (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ translateX: offset.x }, { translateY: Animated.add(offset.y, translateY) }, { scale: pressScale }]
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {shapes.map((shape, index) => renderShape(shape, index))}
      </Svg>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.surfaceStrong, borderColor: badge.color }]}>
          <Ionicons name={badge.icon} size={Math.max(10, size * 0.18)} color={badge.color} />
        </View>
      ) : null}
    </Animated.View>
  );

  return (
    <View style={[styles.wrap, position === "corner" && styles.corner, position === "center" && styles.center]} pointerEvents="box-none">
      {bubbleText ? (
        <View style={styles.bubble}>
          <AppText variant="caption" style={styles.bubbleText}>{bubbleText}</AppText>
        </View>
      ) : null}
      {interactive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skunked mascot"
          onPress={handleTap}
          hitSlop={8}
        >
          {sprite}
        </Pressable>
      ) : (
        sprite
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center"
  },
  corner: {
    bottom: spacing.md,
    position: "absolute",
    right: spacing.md,
    zIndex: 5
  },
  center: {
    alignSelf: "center"
  },
  badge: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    top: -4,
    width: 20
  },
  bubble: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.amber,
    borderRadius: radii.md,
    borderWidth: 2,
    marginBottom: spacing.xs,
    maxWidth: 160,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  bubbleText: {
    color: colors.amber,
    fontWeight: "900",
    textAlign: "center"
  }
});
