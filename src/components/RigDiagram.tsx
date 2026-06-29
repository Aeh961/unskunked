import Svg, { Circle, Ellipse, Line, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "@/src/theme";

export function RigDiagram({ parts }: { parts: string[] }) {
  const text = parts.join(" ").toLowerCase();
  const hasBobber = text.includes("bobber");
  const hasSwivel = text.includes("swivel");
  const hasWeight = text.includes("weight") || text.includes("sinker") || text.includes("split shot");
  const hasBullet = text.includes("bullet");
  const hasJig = text.includes("jig");
  const hasSpinner = text.includes("spinner");

  return (
    <Svg width="100%" height={170} viewBox="0 0 340 170">
      <Rect x="4" y="8" width="332" height="154" rx="12" fill={colors.mist} />
      <Line x1="20" y1="82" x2="315" y2="82" stroke={colors.ink} strokeWidth="3" />
      <SvgText x="18" y="48" fill={colors.muted} fontSize="12">Rod/reel</SvgText>
      <SvgText x="124" y="62" fill={colors.muted} fontSize="12">Main line</SvgText>
      {hasBobber ? <Circle cx="105" cy="70" r="18" fill={colors.sun} stroke={colors.ink} strokeWidth="2" /> : null}
      {hasBobber ? (
        <>
          <Line x1="105" y1="88" x2="105" y2="82" stroke={colors.ink} strokeWidth="2" />
          <SvgText x="82" y="132" fill={colors.muted} fontSize="12">Bobber</SvgText>
        </>
      ) : null}
      {hasBullet ? <Polygon points="176,82 204,68 204,96" fill={colors.reed} /> : null}
      {hasWeight && !hasBullet ? <Rect x="182" y="70" width="20" height="24" rx="4" fill={colors.reed} /> : null}
      {hasWeight ? (
        <SvgText x="170" y="132" fill={colors.muted} fontSize="12">{hasBullet ? "Bullet weight" : "Weight"}</SvgText>
      ) : null}
      {hasSwivel ? <Circle cx="220" cy="82" r="7" fill={colors.river} /> : null}
      {hasSwivel ? (
        <SvgText x="204" y="48" fill={colors.muted} fontSize="12">Swivel</SvgText>
      ) : null}
      {hasSpinner ? <Ellipse cx="246" cy="82" rx="17" ry="8" fill={colors.sunrise} stroke={colors.ink} strokeWidth="2" /> : null}
      {hasJig ? <Circle cx="246" cy="82" r="11" fill={colors.clay} /> : null}
      <Line x1="275" y1="82" x2="300" y2="108" stroke={colors.ink} strokeWidth="3" />
      <Line x1="300" y1="108" x2="318" y2="100" stroke={colors.ink} strokeWidth="3" />
      <SvgText x="282" y="146" fill={colors.muted} fontSize="12">Hook</SvgText>
      {!hasJig ? <Circle cx="262" cy="82" r="8" fill={colors.pine} /> : null}
      <SvgText x="236" y="62" fill={colors.muted} fontSize="12">{hasSpinner ? "Spinner" : hasJig ? "Jig head" : "Bait/lure"}</SvgText>
    </Svg>
  );
}
