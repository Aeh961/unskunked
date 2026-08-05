import { fishSpecies } from "@/src/data/fish";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { ActivityType } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";

export type AccessType = "Shore" | "Boat" | "Pier" | "Beach";

export type ParsedTrip = {
  raw: string;
  activityType?: ActivityType;
  targetFishId?: string;
  targetShellfishId?: string;
  waterbodyId?: string;
  shellfishLocationId?: string;
  accessType?: AccessType;
  gearOrBait?: string;
  dateHint?: string;
};

const crabbingPattern = /\bcrab(s|bing)?\b/i;
const clammingPattern = /\bclam(s|ming)?\b|\bdig(ging)?\b/i;
const fishingPattern = /\bfish(ing)?\b|\bcatch(ing)?\b|\bcast(ing)?\b/i;

const accessPatterns: Array<{ type: AccessType; pattern: RegExp }> = [
  { type: "Pier", pattern: /\bpier\b/i },
  { type: "Boat", pattern: /\b(boat|kayak)\b/i },
  { type: "Beach", pattern: /\bbeach\b/i },
  { type: "Shore", pattern: /\bshore\b|\bbank\b/i }
];

const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const dateKeywordPatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: "this weekend", pattern: /\bthis weekend\b/i },
  { label: "today", pattern: /\btoday\b|\btonight\b/i },
  { label: "tomorrow", pattern: /\btomorrow\b/i },
  { label: "this week", pattern: /\bthis week\b/i }
];

/** True when the text reads as a trip-building request rather than a general question. */
export function isTripIntent(text: string): boolean {
  const lower = text.toLowerCase();
  if (fishingPattern.test(lower) || crabbingPattern.test(lower) || clammingPattern.test(lower)) return true;
  return findEntityInText(fishSpecies, lower) !== undefined || findEntityInText(shellfishSpecies, lower) !== undefined;
}

// Excluded from single-word fallback matching so activity verbs/filler words never
// false-match a catalog name that happens to contain them as a substring
// (e.g. "fish" inside "Channel Catfish" or "Edmonds Fishing Pier").
const stopWords = new Set([
  "i", "a", "an", "the", "to", "for", "at", "on", "in", "of", "and", "or", "with",
  "want", "wants", "wanted", "would", "like", "going", "get", "some", "this", "that",
  "what", "can", "could", "today", "tonight", "tomorrow", "weekend", "week",
  "fish", "fishing", "catch", "catching", "cast", "casting",
  "crab", "crabs", "crabbing", "clam", "clams", "clamming", "dig", "digging"
]);

function tokenize(text: string): string[] {
  return text.replace(/[^a-z0-9\s]/gi, " ").split(/\s+/).filter(Boolean);
}

/** Longest n-grams (3, 2, 1 words) first, so a multi-word match wins over a single generic word. */
function ngramsLongestFirst(tokens: string[], maxN = 3): string[] {
  const grams: string[] = [];
  for (let n = Math.min(maxN, tokens.length); n >= 1; n -= 1) {
    for (let i = 0; i + n <= tokens.length; i += 1) {
      grams.push(tokens.slice(i, i + n).join(" "));
    }
  }
  return grams;
}

/**
 * Finds the catalog entry whose name best matches free text. Tries a direct
 * "full name is a substring of the text" pass first (handles exact/plural
 * matches like "razor clams" containing "razor clam"), then falls back to
 * matching text n-grams against catalog names (handles generic single-word
 * mentions like "trout" or "perch" that don't include the full species name,
 * and partial location names like "Edmonds Pier" for "Edmonds Pier Crab Area").
 */
function findEntityInText<T extends { name: string }>(items: T[], text: string): T | undefined {
  let best: { item: T; score: number } | undefined;
  for (const item of items) {
    const name = item.name.toLowerCase();
    if (!name) continue;
    if (text.includes(name) || (name.length > 3 && text.includes(name.replace(/s$/, "")))) {
      const score = name.length;
      if (!best || score > best.score) best = { item, score };
    }
  }
  if (best) return best.item;

  for (const gram of ngramsLongestFirst(tokenize(text))) {
    if (gram.length < 4) continue;
    if (!gram.includes(" ") && stopWords.has(gram)) continue;
    const match = items.find((item) => item.name.toLowerCase().includes(gram));
    if (match) return match;
  }
  return undefined;
}

export function parseTripText(text: string): ParsedTrip {
  const lower = text.toLowerCase();
  const parsed: ParsedTrip = { raw: text };

  const shellfishSpeciesMatch = findEntityInText(shellfishSpecies, lower);
  const fishMatch = findEntityInText(fishSpecies, lower);
  const waterbodyMatch = findEntityInText(waterbodies, lower);
  const shellfishLocationMatch = findEntityInText(shellfishLocations, lower);

  if (crabbingPattern.test(lower)) parsed.activityType = "crabbing";
  else if (clammingPattern.test(lower)) parsed.activityType = "clamming";
  else if (fishingPattern.test(lower)) parsed.activityType = "fishing";
  else if (shellfishSpeciesMatch) parsed.activityType = shellfishSpeciesMatch.activityType;
  else if (fishMatch) parsed.activityType = "fishing";

  if (fishMatch) parsed.targetFishId = fishMatch.id;
  if (shellfishSpeciesMatch) parsed.targetShellfishId = shellfishSpeciesMatch.id;
  if (waterbodyMatch) parsed.waterbodyId = waterbodyMatch.id;
  if (shellfishLocationMatch) parsed.shellfishLocationId = shellfishLocationMatch.id;

  for (const { type, pattern } of accessPatterns) {
    if (pattern.test(lower)) {
      parsed.accessType = type;
      break;
    }
  }

  const gearStopLookahead = /(?=\s+and\b|\s+to\s+(?:catch|fish|crab|dig|go)\b|[.,!?]|$)/i;
  const gearMatch = lower.match(new RegExp(`\\bi have ([^.,!?]+?)${gearStopLookahead.source}`, "i"))
    ?? lower.match(new RegExp(`\\bwith ([^.,!?]+?)${gearStopLookahead.source}`, "i"));
  if (gearMatch) parsed.gearOrBait = gearMatch[1].trim();

  for (const { label, pattern } of dateKeywordPatterns) {
    if (pattern.test(lower)) {
      parsed.dateHint = label;
      break;
    }
  }
  if (!parsed.dateHint) {
    const month = monthNames.find((name) => lower.includes(name));
    if (month) parsed.dateHint = month[0].toUpperCase() + month.slice(1);
  }

  return parsed;
}

export type FollowUp = {
  field: "activity" | "species" | "location";
  question: string;
};

/** Returns the single highest-priority missing field as one short question, or null if ready to build. */
export function nextFollowUp(parsed: ParsedTrip): FollowUp | null {
  const hasLocation = Boolean(parsed.waterbodyId || parsed.shellfishLocationId || parsed.accessType);
  const hasSpecies = Boolean(parsed.targetFishId || parsed.targetShellfishId);

  if (!parsed.activityType && !hasSpecies && !hasLocation) {
    return { field: "activity", question: "What are you fishing, crabbing, or clamming for?" };
  }

  if (parsed.activityType === "fishing" && !hasSpecies && !hasLocation) {
    return { field: "species", question: "What are you targeting?" };
  }

  if (!hasLocation) {
    const activityLabel = parsed.activityType === "crabbing" ? "crabbing" : parsed.activityType === "clamming" ? "clamming" : "fishing";
    return { field: "location", question: `Where are you ${activityLabel}?` };
  }

  return null;
}

/** Merges a follow-up answer into a previously parsed trip so multi-turn state can accumulate. */
export function mergeFollowUpAnswer(parsed: ParsedTrip, answerText: string): ParsedTrip {
  const answer = parseTripText(answerText);
  return {
    ...parsed,
    activityType: parsed.activityType ?? answer.activityType,
    targetFishId: parsed.targetFishId ?? answer.targetFishId,
    targetShellfishId: parsed.targetShellfishId ?? answer.targetShellfishId,
    waterbodyId: parsed.waterbodyId ?? answer.waterbodyId,
    shellfishLocationId: parsed.shellfishLocationId ?? answer.shellfishLocationId,
    accessType: parsed.accessType ?? answer.accessType,
    gearOrBait: parsed.gearOrBait ?? answer.gearOrBait,
    dateHint: parsed.dateHint ?? answer.dateHint
  };
}
