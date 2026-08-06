/** Pure, render-free logic behind SkunkMascot's idle motion, tap "dodge", and speech bubble. */

export const MASCOT_SPEECH_LINES = [
  "READY TO CAST?",
  "PICK YOUR TARGET",
  "LOADOUT CHECK",
  "RULES FIRST",
  "MISSION SAVED",
  "NO TRIPS YET",
  "TRY ANOTHER SEARCH"
] as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function randomInRange(min: number, max: number, rng: () => number = Math.random): number {
  return min + rng() * (max - min);
}

/** Bounded random x/y offset for the tap "dodge" animation, always within [-maxOffset, maxOffset]. */
export function pickBoundedOffset(maxOffset: number, rng: () => number = Math.random): { x: number; y: number } {
  return {
    x: clamp(randomInRange(-maxOffset, maxOffset, rng), -maxOffset, maxOffset),
    y: clamp(randomInRange(-maxOffset, maxOffset, rng), -maxOffset, maxOffset)
  };
}

/** Randomized delay between idle-motion beats, so the mascot feels alive without a fixed tick. */
export function pickIdleDelay(minMs = 4000, maxMs = 9000, rng: () => number = Math.random): number {
  return Math.round(randomInRange(minMs, maxMs, rng));
}

export function pickSpeechLine(rng: () => number = Math.random): string {
  const index = clamp(Math.floor(rng() * MASCOT_SPEECH_LINES.length), 0, MASCOT_SPEECH_LINES.length - 1);
  return MASCOT_SPEECH_LINES[index];
}
