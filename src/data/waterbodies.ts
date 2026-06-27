import { Waterbody } from "./types";

export const waterbodies: Waterbody[] = [
  {
    id: "lake-washington",
    name: "Lake Washington",
    region: "Seattle metro",
    speciesIds: ["yellow-perch", "smallmouth-bass", "largemouth-bass"],
    status: "open",
    regulationSummary: "Mock summary: warmwater species generally open, special rules may apply.",
    suggestedBait: ["worms", "drop shot worms", "small jigs"],
    beginnerSetup: "Ultralight rod, 6 lb line, small hook with worm for perch.",
    youtubeSearch: "How to fish Lake Washington for perch"
  },
  {
    id: "green-lake",
    name: "Green Lake",
    region: "Seattle",
    speciesIds: ["rainbow-trout", "yellow-perch", "largemouth-bass"],
    status: "open",
    regulationSummary: "Mock summary: stocked trout and warmwater options. Check city and WDFW notices.",
    suggestedBait: ["PowerBait", "worms", "small spinners"],
    beginnerSetup: "Bobber rig with worm near shore or PowerBait rig from the bank.",
    youtubeSearch: "Beginner bobber rig for trout"
  },
  {
    id: "lake-sammamish",
    name: "Lake Sammamish",
    region: "Eastside",
    speciesIds: ["smallmouth-bass", "yellow-perch", "kokanee"],
    status: "restricted",
    regulationSummary: "Mock summary: bass and perch options; kokanee rules require extra checking.",
    suggestedBait: ["drop shot worms", "small jigs", "scented corn where legal"],
    beginnerSetup: "Drop shot soft plastic near rocky points for smallmouth.",
    youtubeSearch: "Smallmouth bass drop shot for beginners"
  },
  {
    id: "puget-sound",
    name: "Puget Sound",
    region: "Marine areas",
    speciesIds: ["salmon"],
    status: "restricted",
    regulationSummary: "Mock summary: marine areas have complex salmon seasons and emergency rules.",
    suggestedBait: ["jigs", "spinners", "herring where legal"],
    beginnerSetup: "Start by reading current marine area rules before buying bait.",
    youtubeSearch: "Washington salmon fishing regulations for beginners"
  },
  {
    id: "snoqualmie-river",
    name: "Snoqualmie River",
    region: "King County",
    speciesIds: ["rainbow-trout", "salmon"],
    status: "restricted",
    regulationSummary: "Mock summary: river rules vary by section, season, and species.",
    suggestedBait: ["spinners", "worms where legal"],
    beginnerSetup: "Small spinner on 6 lb line only after confirming the section is open.",
    youtubeSearch: "How to fish Washington rivers for trout beginners"
  },
  {
    id: "columbia-river",
    name: "Columbia River",
    region: "State border",
    speciesIds: ["smallmouth-bass", "salmon"],
    status: "restricted",
    regulationSummary: "Mock summary: big river with changing salmon rules and warmwater opportunities.",
    suggestedBait: ["tube jigs", "drop shot worms", "salmon gear where legal"],
    beginnerSetup: "Target smallmouth around rocks with a tube jig and confirm local access rules.",
    youtubeSearch: "Columbia River smallmouth bass fishing beginners"
  }
];
