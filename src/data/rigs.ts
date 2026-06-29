import { RigOrKnot } from "./types";

export const rigsAndKnots: RigOrKnot[] = [
  {
    id: "improved-clinch-knot",
    name: "Improved Clinch Knot",
    type: "knot",
    beginnerExplanation: "A dependable everyday knot for tying line directly to a hook, swivel, or lure.",
    whenToUse: "Use with monofilament and small trout or panfish tackle.",
    worksFor: ["Rainbow Trout", "Yellow Perch", "Bluegill"],
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
    worksFor: ["Rainbow Trout", "Yellow Perch", "Bluegill"],
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
    worksFor: ["Largemouth Bass", "Rainbow Trout"],
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
    worksFor: ["Smallmouth Bass", "Yellow Perch"],
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
    worksFor: ["Rainbow Trout"],
    parts: ["Main line", "Sliding sinker", "Swivel", "Leader", "Treble or bait hook", "PowerBait"],
    steps: ["Slide a small egg sinker onto the main line.", "Tie on a swivel.", "Add an 18-24 inch leader.", "Tie on a small bait hook.", "Cover the hook with floating PowerBait."],
    youtubeSearch: "Trout PowerBait rig setup for beginners"
  },
  {
    id: "texas-rig",
    name: "Texas rig",
    type: "rig",
    beginnerExplanation: "A weedless soft-plastic setup for bass around grass, docks, and cover.",
    whenToUse: "Use when bass are tight to weeds, wood, or shallow cover.",
    worksFor: ["Largemouth Bass", "Smallmouth Bass"],
    parts: ["Main line", "Bullet weight", "Offset hook", "Soft plastic"],
    steps: ["Slide a bullet weight onto the line.", "Tie on an offset worm hook.", "Insert the hook point into the nose of the soft plastic.", "Bring the hook out and rotate it.", "Skin-hook the point so it stays weedless."],
    youtubeSearch: "Texas rig setup for bass beginners"
  },
  {
    id: "split-shot-rig",
    name: "Split shot rig",
    type: "rig",
    beginnerExplanation: "A tiny weight above a baited hook that lets worms drift or sink naturally.",
    whenToUse: "Use for trout, panfish, and light river presentations.",
    worksFor: ["Rainbow Trout", "Brook Trout", "Bluegill", "Yellow Perch"],
    parts: ["Main line", "Split shot", "Hook", "Bait"],
    steps: ["Tie on a small hook.", "Pinch one split shot 10-18 inches above the hook.", "Add a small worm or bait piece.", "Cast gently.", "Let it sink and retrieve slowly."],
    youtubeSearch: "Split shot rig fishing setup beginners"
  },
  {
    id: "jig",
    name: "Jig",
    type: "rig",
    beginnerExplanation: "A weighted hook with a soft plastic or skirt that can hop, swim, or drop near fish.",
    whenToUse: "Use around docks, rocks, brush, and deeper edges.",
    worksFor: ["Crappie", "Smallmouth Bass", "Yellow Perch", "Salmon where legal"],
    parts: ["Main line", "Jig head", "Soft plastic", "Hook"],
    steps: ["Tie the line directly to the jig.", "Thread on a soft plastic straight.", "Cast past the target.", "Let it sink.", "Hop or swim it with short pauses."],
    youtubeSearch: "How to fish a jig for beginners"
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
