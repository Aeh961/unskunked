export type LearningArticle = {
  id: string;
  title: string;
  category: "Basics" | "Casting" | "Knots" | "Rigs" | "Behavior" | "Mistakes" | "Glossary" | "FAQ";
  summary: string;
  bullets: string[];
  youtubeSearch: string;
};

export const learningArticles: LearningArticle[] = [
  {
    id: "first-trip-checklist",
    title: "First Trip Checklist",
    category: "Basics",
    summary: "A short packing list for a low-stress first fishing trip.",
    bullets: ["License and regulation check", "One rod, one rig, one target fish", "Pliers, small towel, water, and sunscreen"],
    youtubeSearch: "beginner fishing checklist first trip"
  },
  {
    id: "basic-cast",
    title: "Simple Spinning Rod Cast",
    category: "Casting",
    summary: "A smooth cast beats a hard cast. Load the rod and release toward your target.",
    bullets: ["Pinch the line before opening the bail", "Bring the rod back to about 2 o'clock", "Release as the rod points at the water"],
    youtubeSearch: "how to cast a spinning rod beginner"
  },
  {
    id: "palomar",
    title: "Palomar Knot",
    category: "Knots",
    summary: "A strong, beginner-friendly knot for hooks and lures.",
    bullets: ["Double the line", "Tie an overhand knot", "Pass the hook through the loop and wet before tightening"],
    youtubeSearch: "palomar knot beginner fishing"
  },
  {
    id: "bobber-basics",
    title: "Bobber Rig Basics",
    category: "Rigs",
    summary: "Use a bobber when fish are suspended or you want a clear bite indicator.",
    bullets: ["Set depth shallow at first", "Use one small split shot", "Wait for the bobber to dip before lifting"],
    youtubeSearch: "bobber rig setup beginner trout panfish"
  },
  {
    id: "where-fish-hold",
    title: "Where Fish Hold",
    category: "Behavior",
    summary: "Fish usually sit near food, cover, shade, current breaks, or temperature comfort.",
    bullets: ["Look for weeds, docks, rocks, shade, and points", "Fish transitions between shallow and deep water", "Slow down when water is cold"],
    youtubeSearch: "where do fish hold lake fishing beginners"
  },
  {
    id: "beginner-mistakes",
    title: "Beginner Mistakes",
    category: "Mistakes",
    summary: "Most first trips improve by simplifying tackle and checking rules before fishing.",
    bullets: ["Hooks are often too large", "Lures are retrieved too fast", "Rules are checked too late"],
    youtubeSearch: "common beginner fishing mistakes"
  },
  {
    id: "glossary",
    title: "Quick Glossary",
    category: "Glossary",
    summary: "Plain-English fishing terms you will see around the app.",
    bullets: ["Leader: short line between main line and hook", "Structure: physical features fish use", "Skunked: no fish caught"],
    youtubeSearch: "fishing terms glossary beginners"
  },
  {
    id: "faq",
    title: "Beginner FAQ",
    category: "FAQ",
    summary: "Quick answers for common first-trip questions.",
    bullets: ["Worms catch many beginner-friendly fish", "Morning and evening are usually easiest", "When unsure, release the fish"],
    youtubeSearch: "beginner fishing questions answered"
  }
];
