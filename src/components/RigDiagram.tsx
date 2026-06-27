import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "@/src/theme";

export function RigDiagram({ parts }: { parts: string[] }) {
  const hasBobber = parts.some((part) => part.toLowerCase().includes("bobber"));
  const hasSwivel = parts.some((part) => part.toLowerCase().includes("swivel"));
  const hasWeight = parts.some((part) => part.toLowerCase().includes("weight") || part.toLowerCase().includes("sinker"));

  return (
    <Svg width="100%" height={150} viewBox="0 0 340 150">
      <Line x1="20" y1="70" x2="315" y2="70" stroke={colors.ink} strokeWidth="3" />
      <SvgText x="18" y="42" fill={colors.muted} fontSize="12">
        Rod/reel
      </SvgText>
      <SvgText x="124" y="52" fill={colors.muted} fontSize="12">
        Main line
      </SvgText>
      {hasBobber ? <Circle cx="105" cy="70" r="18" fill={colors.sun} stroke={colors.ink} strokeWidth="2" /> : null}
      {hasBobber ? (
        <SvgText x="82" y="116" fill={colors.muted} fontSize="12">
          Bobber
        </SvgText>
      ) : null}
      {hasWeight ? <Rect x="182" y="58" width="20" height="24" rx="4" fill={colors.reed} /> : null}
      {hasWeight ? (
        <SvgText x="170" y="116" fill={colors.muted} fontSize="12">
          Weight
        </SvgText>
      ) : null}
      {hasSwivel ? <Circle cx="220" cy="70" r="7" fill={colors.river} /> : null}
      {hasSwivel ? (
        <SvgText x="204" y="42" fill={colors.muted} fontSize="12">
          Swivel
        </SvgText>
      ) : null}
      <Line x1="275" y1="70" x2="300" y2="96" stroke={colors.ink} strokeWidth="3" />
      <Line x1="300" y1="96" x2="318" y2="88" stroke={colors.ink} strokeWidth="3" />
      <SvgText x="282" y="126" fill={colors.muted} fontSize="12">
        Hook
      </SvgText>
      <Circle cx="262" cy="70" r="8" fill={colors.pine} />
      <SvgText x="242" y="52" fill={colors.muted} fontSize="12">
        Bait/lure
      </SvgText>
    </Svg>
  );
}
