import { RigOrKnot } from "./types";

export const rigsAndKnots: RigOrKnot[] = [
  {
    id: "improved-clinch-knot",
    name: "Improved Clinch Knot",
    type: "knot",
    beginnerExplanation: "A dependable everyday knot for tying line directly to a hook, swivel, or lure.",
    whenToUse: "Use with monofilament and small trout or panfish tackle.",
    worksFor: ["Rainbow trout", "Yellow perch"],
    parts: ["Main line", "Hook eye", "Tag end"],
    steps: ["Thread the line through the hook eye.", "Wrap the tag end around the main line 5-7 times.", "Pass the tag end through the first loop, then the big loop.", "Wet the knot and pull tight.", "Trim the tag end."],
    youtubeSearch: "How to tie an Improved Clinch Knot for beginners"
  },
  {
    id: "palomar-knot",
    name: "Palomar Knot",
    type: "knot",
    beginnerExplanation: "A strong, simple knot that is especially good for braid and drop shot hooks.",
    whenToUse: "Use when you want maximum strength with hooks or lures.",
    worksFor: ["Bass", "Trout", "Salmon"],
    parts: ["Doubled line", "Hook eye", "Loop"],
    steps: ["Double the line and pass the loop through the eye.", "Tie a loose overhand knot.", "Pass the hook through the loop.", "Wet the knot and pull both lines evenly.", "Trim the tag end."],
    youtubeSearch: "How to tie a Palomar knot for beginners"
  },
  {
    id: "uni-knot",
    name: "Uni Knot",
    type: "knot",
    beginnerExplanation: "A versatile knot for hooks, lures, and joining some lines.",
    whenToUse: "Use when changing lures often or tying leaders.",
    worksFor: ["Bass", "Kokanee", "Salmon"],
    parts: ["Main line", "Loop", "Tag end"],
    steps: ["Run the line through the eye.", "Make a loop alongside the main line.", "Wrap the tag end through the loop 5-7 times.", "Wet and snug the wraps.", "Slide the knot to the eye and tighten."],
    youtubeSearch: "How to tie a Uni Knot fishing beginners"
  },
  {
    id: "surgeons-knot",
    name: "Surgeon's Knot",
    type: "knot",
    beginnerExplanation: "A quick knot for connecting two similar-size lines.",
    whenToUse: "Use for adding a leader to your main line.",
    worksFor: ["Trout", "Perch", "Kokanee"],
    parts: ["Main line", "Leader", "Loop"],
    steps: ["Overlap the two line ends.", "Make one loop with both lines.", "Pass both ends through the loop twice.", "Wet and pull all four strands tight.", "Trim both tag ends."],
    youtubeSearch: "How to tie a Surgeon's Knot fishing line"
  },
  {
    id: "bobber-rig",
    name: "Bobber rig",
    type: "rig",
    beginnerExplanation: "Keeps bait suspended where fish can see it and shows bites clearly.",
    whenToUse: "Use from shore for trout and perch in shallow or stocked lakes.",
    worksFor: ["Rainbow trout", "Yellow perch"],
    parts: ["Rod/reel", "Main line", "Bobber", "Weight", "Hook", "Bait"],
    steps: ["Clip a bobber 2-5 feet above the hook.", "Add one small split shot weight.", "Tie on a small hook.", "Add worm or PowerBait.", "Cast gently and watch for the bobber to dip."],
    youtubeSearch: "Beginner bobber rig for trout"
  },
  {
    id: "carolina-rig",
    name: "Carolina rig",
    type: "rig",
    beginnerExplanation: "Lets bait or soft plastics move naturally behind a sliding weight.",
    whenToUse: "Use to cover bottom for bass or trout from shore.",
    worksFor: ["Largemouth bass", "Rainbow trout"],
    parts: ["Main line", "Sliding weight", "Swivel", "Leader", "Hook", "Bait/lure"],
    steps: ["Slide a weight onto the main line.", "Tie on a swivel.", "Add a 12-24 inch leader.", "Tie on a hook.", "Use bait or a soft plastic and drag slowly."],
    youtubeSearch: "Carolina rig setup for beginners"
  },
  {
    id: "drop-shot-rig",
    name: "Drop shot rig",
    type: "rig",
    beginnerExplanation: "Keeps a small bait above bottom while the weight stays below.",
    whenToUse: "Use for smallmouth bass and perch around rocks or docks.",
    worksFor: ["Smallmouth bass", "Yellow perch"],
    parts: ["Main line", "Hook", "Leader tag", "Drop shot weight", "Soft plastic"],
    steps: ["Tie a Palomar knot to a small hook.", "Leave a long tag end.", "Clip a drop shot weight to the tag end.", "Nose-hook a small soft plastic.", "Shake gently while keeping the weight on bottom."],
    youtubeSearch: "Drop shot rig setup for beginners"
  },
  {
    id: "trout-powerbait-rig",
    name: "Trout PowerBait rig",
    type: "rig",
    beginnerExplanation: "Floats bait just above bottom where stocked trout cruise.",
    whenToUse: "Use from shore in stocked lakes.",
    worksFor: ["Rainbow trout"],
    parts: ["Main line", "Sliding sinker", "Swivel", "Leader", "Treble or bait hook", "PowerBait"],
    steps: ["Slide a small egg sinker onto the main line.", "Tie on a swivel.", "Add an 18-24 inch leader.", "Tie on a small bait hook.", "Cover the hook with floating PowerBait."],
    youtubeSearch: "Trout PowerBait rig setup for beginners"
  },
  {
    id: "basic-spinner-setup",
    name: "Basic spinner setup",
    type: "rig",
    beginnerExplanation: "A simple cast-and-retrieve lure setup that creates flash and vibration.",
    whenToUse: "Use when fish are active or you want to search water quickly.",
    worksFor: ["Rainbow trout", "Bass", "Salmon where legal"],
    parts: ["Rod/reel", "Main line", "Snap swivel", "Spinner"],
    steps: ["Tie line to a small snap swivel.", "Clip on an inline spinner.", "Cast across likely water.", "Retrieve steadily just fast enough for the blade to spin.", "Pause briefly if a fish follows."],
    youtubeSearch: "Basic inline spinner fishing setup beginners"
  }
];
