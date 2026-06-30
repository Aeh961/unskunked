export type Status = "open" | "closed" | "restricted";

export type Regulation = {
  status: Status;
  season: string;
  dailyLimit: string;
  sizeLimit: string;
  restrictions: string[];
  warning: string;
};

export type FishSpecies = {
  id: string;
  name: string;
  waterKind?: "Freshwater" | "Saltwater" | "Anadromous";
  status: Status;
  difficulty: "Easy" | "Moderate" | "Advanced";
  seasonNotes?: string;
  habitat?: string[];
  regulationsWarning?: string;
  keepReleaseWarning?: string;
  bestSeason: string;
  bestWeather: string;
  bestTimeOfDay: string;
  bestBait: string[];
  bestLures: string[];
  rodSetup: string;
  reel: string;
  line: string;
  hook: string;
  knots: string[];
  rigs: string[];
  castingTips: string[];
  whereToFind: string[];
  commonMistakes: string[];
  tips: string[];
  regulation: Regulation;
  youtubeSearches: string[];
};

export type WaterType = "Lake" | "River" | "Saltwater" | "Park" | "Pier";

export type Waterbody = {
  id: string;
  waterbodyId?: string;
  name: string;
  region: string;
  county?: string;
  city?: string;
  source?: string;
  lastUpdated?: string;
  regulationReference?: string;
  boatLaunchReference?: string;
  waterType: WaterType;
  latitude: number;
  longitude: number;
  speciesIds: string[];
  shoreAccessDifficulty?: "Easy" | "Moderate" | "Advanced";
  parkingNote?: string;
  bestSeason?: string;
  officialLink?: string;
  boatLaunch?: boolean;
  kayakFriendly?: boolean;
  bankFishing?: boolean;
  wheelchairAccessible?: boolean;
  bathrooms?: boolean;
  camping?: boolean;
  fee?: string;
  photoPlaceholder?: string;
  familyFriendly?: boolean;
  stocking?: Array<{
    species: string;
    date: string;
    count: number;
    source: string;
  }>;
  status: Status;
  regulationSummary: string;
  suggestedBait: string[];
  recommendedRigs: string[];
  beginnerSetup: string;
  beginnerDifficulty: "Easy" | "Moderate" | "Advanced";
  notes: string;
  todayRecommendation: string;
  youtubeSearch: string;
};

export type RigOrKnot = {
  id: string;
  name: string;
  type: "knot" | "rig";
  beginnerExplanation: string;
  whenToUse: string;
  worksFor: string[];
  steps: string[];
  parts: string[];
  youtubeSearch: string;
};
