import { FishSpecies } from "./types";

export const fishSpecies: FishSpecies[] = [
  {
    id: "rainbow-trout",
    name: "Rainbow trout",
    status: "open",
    difficulty: "Easy",
    bestBait: ["PowerBait", "worms", "salmon eggs"],
    bestLures: ["inline spinners", "small spoons", "trout magnets"],
    rodSetup: "Light spinning rod, 1000-2500 reel",
    line: "4-6 lb monofilament",
    hook: "Size 8-12 bait hook",
    knots: ["Improved Clinch Knot", "Palomar Knot"],
    tips: ["Fish the first and last hour of daylight.", "Use a small hook and keep slack out of your line."],
    regulation: {
      status: "open",
      season: "Mock general lake season: open now",
      dailyLimit: "5 trout",
      sizeLimit: "No minimum in many stocked lakes",
      restrictions: ["Rules vary by lake and hatchery/wild status."],
      warning: "Check the current WDFW listing for the specific lake before keeping trout."
    },
    youtubeSearches: ["Trout PowerBait rig setup for beginners", "How to fish stocked trout lakes"]
  },
  {
    id: "largemouth-bass",
    name: "Largemouth bass",
    status: "open",
    difficulty: "Moderate",
    bestBait: ["nightcrawlers", "soft plastics", "live bait where legal"],
    bestLures: ["spinnerbaits", "senkos", "topwater frogs"],
    rodSetup: "Medium spinning or baitcasting rod",
    line: "8-12 lb mono or fluorocarbon",
    hook: "3/0 offset worm hook",
    knots: ["Palomar Knot", "Uni Knot"],
    tips: ["Cast near weeds, docks, and shade.", "Pause soft plastics longer than feels natural."],
    regulation: {
      status: "open",
      season: "Mock warmwater season: generally open",
      dailyLimit: "Statewide limits vary by water",
      sizeLimit: "Slot and minimum sizes vary",
      restrictions: ["Some lakes have special bass rules."],
      warning: "Confirm the specific waterbody rules before harvesting bass."
    },
    youtubeSearches: ["Beginner largemouth bass fishing senko", "How to fish docks for bass"]
  },
  {
    id: "smallmouth-bass",
    name: "Smallmouth bass",
    status: "open",
    difficulty: "Moderate",
    bestBait: ["worms", "crayfish-style soft plastics"],
    bestLures: ["drop shot worms", "tube jigs", "small crankbaits"],
    rodSetup: "Medium-light spinning rod",
    line: "6-10 lb fluorocarbon or braid to leader",
    hook: "Size 1 drop shot hook",
    knots: ["Palomar Knot", "Uni Knot"],
    tips: ["Look for rock piles and points.", "Keep bottom contact with a drop shot or tube."],
    regulation: {
      status: "open",
      season: "Mock warmwater season: generally open",
      dailyLimit: "Varies by water",
      sizeLimit: "Varies by water",
      restrictions: ["River sections can have different rules than lakes."],
      warning: "Verify local bass regulations before keeping fish."
    },
    youtubeSearches: ["Smallmouth bass drop shot for beginners", "How to fish rocky points for smallmouth"]
  },
  {
    id: "yellow-perch",
    name: "Yellow perch",
    status: "open",
    difficulty: "Easy",
    bestBait: ["worms", "maggots", "small pieces of shrimp"],
    bestLures: ["small jigs", "micro spoons"],
    rodSetup: "Ultralight spinning rod",
    line: "4-6 lb monofilament",
    hook: "Size 8-12 panfish hook",
    knots: ["Improved Clinch Knot", "Surgeon's Knot"],
    tips: ["Perch school up, so stay put after one bite.", "Use tiny bait pieces so fish take the hook."],
    regulation: {
      status: "open",
      season: "Mock panfish season: open now",
      dailyLimit: "Generous limits in many lakes",
      sizeLimit: "Usually no minimum",
      restrictions: ["Water-specific exceptions may apply."],
      warning: "Check official rules for current limits."
    },
    youtubeSearches: ["How to fish Lake Washington for perch", "Beginner yellow perch fishing setup"]
  },
  {
    id: "kokanee",
    name: "Kokanee",
    status: "restricted",
    difficulty: "Advanced",
    bestBait: ["shoepeg corn", "scented corn"],
    bestLures: ["dodgers", "mini hoochies", "small spoons"],
    rodSetup: "Light trolling rod or soft spinning rod",
    line: "6-8 lb mono",
    hook: "Small red hooks or kokanee leader",
    knots: ["Uni Knot", "Surgeon's Knot"],
    tips: ["Troll slowly and watch depth.", "Use scent and keep hooks sharp."],
    regulation: {
      status: "restricted",
      season: "Mock season: check lake listing",
      dailyLimit: "Often counted with trout limits",
      sizeLimit: "Varies by lake",
      restrictions: ["Depth, gear, and limit rules can change by lake."],
      warning: "Kokanee rules are water-specific. Verify before fishing."
    },
    youtubeSearches: ["Kokanee trolling setup for beginners", "How to fish for kokanee in lakes"]
  },
  {
    id: "salmon",
    name: "Salmon",
    status: "restricted",
    difficulty: "Advanced",
    bestBait: ["herring where legal", "eggs where legal"],
    bestLures: ["buzz bombs", "spinners", "jigs"],
    rodSetup: "Medium-heavy spinning or casting rod",
    line: "12-20 lb mono or braid to leader",
    hook: "Barbless hooks where required",
    knots: ["Uni Knot", "Palomar Knot"],
    tips: ["Salmon seasons can close quickly.", "Know species identification before keeping anything."],
    regulation: {
      status: "restricted",
      season: "Placeholder only: highly regulated",
      dailyLimit: "Depends on area, species, and emergency rules",
      sizeLimit: "Depends on area and species",
      restrictions: ["Emergency rules, barbless hooks, hatchery marks, and area closures may apply."],
      warning: "Extra restriction warning: salmon regulations change often. Always verify official rules."
    },
    youtubeSearches: ["Washington salmon fishing regulations for beginners", "How to identify salmon species"]
  }
];
