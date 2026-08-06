import { colors } from "@/src/theme";

/**
 * Original pixel-art skunk-with-fishing-rod, built from flat rects/polygons on a 64x64
 * grid (crisp edges, no curves/gradients) so it stays in the app's flat arcade style.
 * Prototyped and visually verified as an inline-SVG preview before porting here - see
 * git history for the standalone HTML used to iterate the shape coordinates.
 */
export type MascotPose = "idle" | "cast" | "resting";

export type MascotShape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; rx?: number }
  | { kind: "polygon"; points: string; fill: string }
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; strokeWidth?: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; fill: string };

const fur = "#3a3f33";
const stripe = colors.mist;
const outline = colors.ink;
const innerEar = "#2a1f18";
const pupil = colors.background;
const rodColor = colors.amber;
const lineColor = colors.sky;
const accent = colors.clay;
const pawColor = colors.amber;

const rodByPose: Record<MascotPose, { tip: [number, number]; line: [number, number] }> = {
  idle: { tip: [58, 10], line: [54, 50] },
  cast: { tip: [62, 3], line: [44, 58] },
  resting: { tip: [60, 6], line: [55, 53] }
};

export function getSkunkShapes(pose: MascotPose = "idle"): MascotShape[] {
  const rod = rodByPose[pose];
  const shapes: MascotShape[] = [];

  shapes.push({ kind: "ellipse", cx: 32, cy: 60, rx: 22, ry: 3, fill: "rgba(0,0,0,0.35)" });

  // Tail - curls up from the rear of the body, white poof tip.
  shapes.push({ kind: "polygon", points: "18,44 10,42 5,33 7,21 15,12 25,9 27,16 19,17 13,26 13,36 19,41", fill: fur });
  shapes.push({ kind: "polygon", points: "15,12 25,9 27,16 20,18 14,19", fill: stripe });

  // Rear leg.
  shapes.push({ kind: "rect", x: 21, y: 49, w: 6, h: 9, fill: fur });
  shapes.push({ kind: "rect", x: 20, y: 57, w: 8, h: 3, fill: pawColor });

  // Body + dorsal stripe.
  shapes.push({ kind: "rect", x: 16, y: 29, w: 27, h: 22, fill: fur, rx: 4 });
  shapes.push({ kind: "polygon", points: "25,29 32,29 34,33 30,51 25,51 23,33", fill: stripe });

  // Front leg.
  shapes.push({ kind: "rect", x: 33, y: 49, w: 6, h: 9, fill: fur });
  shapes.push({ kind: "rect", x: 32, y: 57, w: 8, h: 3, fill: pawColor });

  // Head + ears.
  shapes.push({ kind: "rect", x: 38, y: 15, w: 21, h: 18, fill: fur, rx: 4 });
  shapes.push({ kind: "polygon", points: "40,15 44,5 48,15", fill: fur });
  shapes.push({ kind: "polygon", points: "50,15 54,5 58,15", fill: fur });
  shapes.push({ kind: "polygon", points: "42,14 44,8 46,14", fill: innerEar });
  shapes.push({ kind: "polygon", points: "52,14 54,8 56,14", fill: innerEar });

  // Forehead blaze continuing the body stripe.
  shapes.push({ kind: "polygon", points: "44,15 52,15 54,21 50,31 46,31 42,21", fill: stripe });

  shapes.push({ kind: "rect", x: 51, y: 21, w: 4, h: 4, fill: pupil });
  shapes.push({ kind: "rect", x: 57, y: 25, w: 4, h: 4, fill: accent });

  // Front paw holding the rod.
  shapes.push({ kind: "rect", x: 38, y: 33, w: 6, h: 7, fill: fur });
  shapes.push({ kind: "rect", x: 37, y: 38, w: 7, h: 4, fill: pawColor });

  shapes.push({ kind: "line", x1: 40, y1: 39, x2: rod.tip[0], y2: rod.tip[1], stroke: rodColor, strokeWidth: 3 });
  shapes.push({ kind: "line", x1: rod.tip[0], y1: rod.tip[1], x2: rod.line[0], y2: rod.line[1], stroke: lineColor, strokeWidth: 1 });
  shapes.push({ kind: "circle", cx: rod.line[0], cy: rod.line[1], r: 3, fill: accent });

  return shapes;
}

export const MASCOT_OUTLINE = outline;
