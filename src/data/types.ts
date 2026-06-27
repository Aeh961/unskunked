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
  status: Status;
  difficulty: "Easy" | "Moderate" | "Advanced";
  bestBait: string[];
  bestLures: string[];
  rodSetup: string;
  line: string;
  hook: string;
  knots: string[];
  tips: string[];
  regulation: Regulation;
  youtubeSearches: string[];
};

export type Waterbody = {
  id: string;
  name: string;
  region: string;
  speciesIds: string[];
  status: Status;
  regulationSummary: string;
  suggestedBait: string[];
  beginnerSetup: string;
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
