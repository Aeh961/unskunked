export type LearningArticle = {
  id: string;
  title: string;
  category: "Basics" | "Casting" | "Knots" | "Rigs" | "Behavior" | "Mistakes" | "Glossary" | "FAQ" | "Gear" | "Safety" | "Etiquette" | "Washington";
  summary: string;
  bullets: string[];
  relatedTopics: string[];
  youtubeSearch: string;
};

export const learningArticles: LearningArticle[] = [
  {
    id: "first-trip-checklist",
    title: "First Trip Checklist",
    category: "Basics",
    summary: "A short packing list for a low-stress first fishing trip.",
    bullets: ["License and regulation check", "One rod, one rig, one target fish", "Pliers, small towel, water, and sunscreen"],
    relatedTopics: ["Washington Fishing Basics", "Fishing Safety", "Bobber Rig Basics"],
    youtubeSearch: "beginner fishing checklist first trip"
  },
  {
    id: "basic-cast",
    title: "Simple Spinning Rod Cast",
    category: "Casting",
    summary: "A smooth cast beats a hard cast. Load the rod and release toward your target.",
    bullets: ["Pinch the line before opening the bail", "Bring the rod back to about 2 o'clock", "Release as the rod points at the water"],
    relatedTopics: ["Rod Guide", "Reel Guide"],
    youtubeSearch: "how to cast a spinning rod beginner"
  },
  {
    id: "palomar",
    title: "Palomar Knot",
    category: "Knots",
    summary: "A strong, beginner-friendly knot for hooks and lures.",
    bullets: ["Double the line", "Tie an overhand knot", "Pass the hook through the loop and wet before tightening"],
    relatedTopics: ["Line Guide", "Hook Guide"],
    youtubeSearch: "palomar knot beginner fishing"
  },
  {
    id: "bobber-basics",
    title: "Bobber Rig Basics",
    category: "Rigs",
    summary: "Use a bobber when fish are suspended or you want a clear bite indicator.",
    bullets: ["Set depth shallow at first", "Use one small split shot", "Wait for the bobber to dip before lifting"],
    relatedTopics: ["Hook Guide", "Beginner Guide"],
    youtubeSearch: "bobber rig setup beginner trout panfish"
  },
  {
    id: "where-fish-hold",
    title: "Where Fish Hold",
    category: "Behavior",
    summary: "Fish usually sit near food, cover, shade, current breaks, or temperature comfort.",
    bullets: ["Look for weeds, docks, rocks, shade, and points", "Fish transitions between shallow and deep water", "Slow down when water is cold"],
    relatedTopics: ["Fish Species Guide", "Lure Guide"],
    youtubeSearch: "where do fish hold lake fishing beginners"
  },
  {
    id: "beginner-mistakes",
    title: "Beginner Mistakes",
    category: "Mistakes",
    summary: "Most first trips improve by simplifying tackle and checking rules before fishing.",
    bullets: ["Hooks are often too large", "Lures are retrieved too fast", "Rules are checked too late"],
    relatedTopics: ["Beginner Guide", "Fishing Etiquette"],
    youtubeSearch: "common beginner fishing mistakes"
  },
  {
    id: "glossary",
    title: "Quick Glossary",
    category: "Glossary",
    summary: "Plain-English fishing terms you will see around the app.",
    bullets: ["Leader: short line between main line and hook", "Structure: physical features fish use", "Skunked: no fish caught"],
    relatedTopics: ["Line Guide", "Rig Basics"],
    youtubeSearch: "fishing terms glossary beginners"
  },
  {
    id: "faq",
    title: "Beginner FAQ",
    category: "FAQ",
    summary: "Quick answers for common first-trip questions.",
    bullets: ["Worms catch many beginner-friendly fish", "Morning and evening are usually easiest", "When unsure, release the fish"],
    relatedTopics: ["Beginner Guide", "Washington Fishing Basics"],
    youtubeSearch: "beginner fishing questions answered"
  },
  {
    id: "beginner-guide",
    title: "Beginner Guide",
    category: "Basics",
    summary: "A first-week path for getting comfortable without buying too much gear.",
    bullets: ["Fish one easy waterbody", "Target trout, perch, or bluegill", "Use one rig until you understand bites"],
    relatedTopics: ["First Trip Checklist", "Bobber Rig Basics"],
    youtubeSearch: "beginner fishing guide first week"
  },
  {
    id: "fish-species-guide",
    title: "Fish Species Guide",
    category: "Behavior",
    summary: "Match fish to habitat, bait, and realistic beginner expectations.",
    bullets: ["Trout cruise cool water", "Perch and bluegill school near weeds and docks", "Bass relate to cover and shade"],
    relatedTopics: ["Where Fish Hold", "Lure Guide"],
    youtubeSearch: "common freshwater fish for beginners"
  },
  {
    id: "rod-guide",
    title: "Rod Guide",
    category: "Gear",
    summary: "Most beginners can start with one light or medium-light spinning rod.",
    bullets: ["Light rods help with trout and panfish", "Medium rods handle bass better", "Longer rods cast farther from shore"],
    relatedTopics: ["Reel Guide", "Line Guide"],
    youtubeSearch: "how to choose a fishing rod beginner"
  },
  {
    id: "reel-guide",
    title: "Reel Guide",
    category: "Gear",
    summary: "A 1000-2500 size spinning reel covers most beginner fishing.",
    bullets: ["Set drag before fishing", "Do not overfill the spool", "Close the bail by hand to reduce twists"],
    relatedTopics: ["Rod Guide", "Line Guide"],
    youtubeSearch: "spinning reel basics beginner fishing"
  },
  {
    id: "line-guide",
    title: "Line Guide",
    category: "Gear",
    summary: "Line affects casting, bite detection, and how natural your bait looks.",
    bullets: ["4-6 lb mono is great for trout and panfish", "8-12 lb line helps for bass cover", "Retie if line feels nicked"],
    relatedTopics: ["Knot Guide", "Hook Guide"],
    youtubeSearch: "fishing line basics mono fluorocarbon braid beginner"
  },
  {
    id: "hook-guide",
    title: "Hook Guide",
    category: "Gear",
    summary: "Small hooks catch more beginner fish because fish can actually take the bait.",
    bullets: ["Size 8-12 works for trout and panfish", "Bass soft plastics use offset worm hooks", "Keep hooks sharp and covered"],
    relatedTopics: ["Line Guide", "Bobber Rig Basics"],
    youtubeSearch: "fishing hook sizes explained beginner"
  },
  {
    id: "lure-guide",
    title: "Lure Guide",
    category: "Gear",
    summary: "Start with spinners, small jigs, and soft plastics before building a giant tackle box.",
    bullets: ["Spinners search water quickly", "Jigs work near bottom and docks", "Soft plastics need pauses"],
    relatedTopics: ["Fish Species Guide", "Beginner Mistakes"],
    youtubeSearch: "best beginner fishing lures explained"
  },
  {
    id: "fishing-safety",
    title: "Fishing Safety",
    category: "Safety",
    summary: "Safe anglers check water, weather, hooks, and footing before thinking about fish.",
    bullets: ["Wear a PFD around boats, piers, and rivers", "Watch slippery banks and tides", "Carry pliers for hooks"],
    relatedTopics: ["Fishing Etiquette", "First Trip Checklist"],
    youtubeSearch: "fishing safety tips beginners"
  },
  {
    id: "fishing-etiquette",
    title: "Fishing Etiquette",
    category: "Etiquette",
    summary: "Good etiquette keeps access open and makes crowded water easier for everyone.",
    bullets: ["Give other anglers casting room", "Pack out line and bait trash", "Ask before crossing someone's drift"],
    relatedTopics: ["Fishing Safety", "Washington Fishing Basics"],
    youtubeSearch: "fishing etiquette beginner tips"
  },
  {
    id: "washington-basics",
    title: "Washington Fishing Basics",
    category: "Washington",
    summary: "Washington rules can vary by water, species, season, and emergency closure.",
    bullets: ["Check the exact waterbody before fishing", "Know hatchery versus wild markings", "Emergency rules can override printed seasons"],
    relatedTopics: ["Fishing Safety", "Beginner FAQ"],
    youtubeSearch: "Washington fishing regulations beginners"
  }
];
