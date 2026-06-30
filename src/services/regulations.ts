import { fishSpecies } from "@/src/data/fish";
import { Regulation, Status, Waterbody } from "@/src/data/types";
import { waterbodies } from "@/src/data/waterbodies";
import { wdfwLinks } from "@/src/services/officialLinks";

export type RegulationSourceLinks = {
  regulations: string;
  emergencyRules: string;
  licenses: string;
  fishWashington: string;
  shellfishSeaweed: string;
  marineAreas: string;
  freshwaterRules: string;
};

export type RegulationQuery = {
  state: "WA" | "OR" | "ID" | "CA";
  waterbodyId?: string;
  speciesId?: string;
  date?: string;
};

export type RegulationSummary = {
  status: Status;
  season: string;
  dailyLimit: string;
  sizeLimit: string;
  restrictions: string[];
  warningMessages: string[];
  catchAndRelease: boolean;
  gearRestrictions: string[];
  emergencyRulePlaceholder: string;
  sourceLinks: RegulationSourceLinks;
};

export interface RegulationProvider {
  readonly state: RegulationQuery["state"];
  getStatewideRules(query: RegulationQuery): RegulationSummary;
  getSpeciesRules(speciesId: string, query: RegulationQuery): RegulationSummary;
  getWaterbodyRules(waterbodyId: string, query: RegulationQuery): RegulationSummary;
}

export const washingtonSourceLinks: RegulationSourceLinks = {
  ...wdfwLinks
};

const placeholderLinks: RegulationSourceLinks = {
  ...wdfwLinks
};

function fromRegulation(regulation: Regulation, water?: Waterbody): RegulationSummary {
  const closed = regulation.status === "closed" || water?.status === "closed";
  const restricted = regulation.status === "restricted" || water?.status === "restricted";
  return {
    status: closed ? "closed" : restricted ? "restricted" : "open",
    season: regulation.season,
    dailyLimit: regulation.dailyLimit,
    sizeLimit: regulation.sizeLimit,
    restrictions: regulation.restrictions,
    warningMessages: [regulation.warning, water?.regulationSummary].filter(Boolean) as string[],
    catchAndRelease: regulation.dailyLimit.toLowerCase().includes("release") || regulation.restrictions.some((item) => item.toLowerCase().includes("release")),
    gearRestrictions: regulation.restrictions.filter((item) => /barbless|single|bait|gear|hook/i.test(item)),
    emergencyRulePlaceholder: "No official emergency-rule feed is connected yet. Always verify WDFW emergency rules before keeping fish.",
    sourceLinks: washingtonSourceLinks
  };
}

export class WashingtonRegulationProvider implements RegulationProvider {
  readonly state = "WA" as const;

  getStatewideRules(query: RegulationQuery): RegulationSummary {
    const month = new Date(query.date ?? new Date().toISOString()).getMonth() + 1;
    return {
      status: "restricted",
      season: month >= 7 ? "Mock statewide season: summer rules may vary by species and waterbody." : "Mock statewide season: verify current annual pamphlet.",
      dailyLimit: "Varies by species and waterbody",
      sizeLimit: "Varies by species and waterbody",
      restrictions: ["License required", "Waterbody rules override generic summaries", "Emergency rules can supersede annual rules"],
      warningMessages: ["This is a local planning summary, not legal guidance."],
      catchAndRelease: false,
      gearRestrictions: ["Confirm bait, hook, and selective gear rules before fishing rivers or salmon waters."],
      emergencyRulePlaceholder: "WDFW emergency rule integration target: ingest active rule changes by species, waterbody, county, and date.",
      sourceLinks: washingtonSourceLinks
    };
  }

  getSpeciesRules(speciesId: string, query: RegulationQuery): RegulationSummary {
    const fish = fishSpecies.find((item) => item.id === speciesId);
    return fish ? fromRegulation(fish.regulation, query.waterbodyId ? waterbodies.find((water) => water.id === query.waterbodyId) : undefined) : this.getStatewideRules(query);
  }

  getWaterbodyRules(waterbodyId: string, query: RegulationQuery): RegulationSummary {
    const water = waterbodies.find((item) => item.id === waterbodyId);
    const firstFish = fishSpecies.find((fish) => water?.speciesIds.includes(fish.id));
    return firstFish ? fromRegulation(firstFish.regulation, water) : this.getStatewideRules(query);
  }
}

export class MockRegulationProvider implements RegulationProvider {
  readonly state: RegulationQuery["state"];

  constructor(state: RegulationQuery["state"]) {
    this.state = state;
  }

  getStatewideRules(_query?: RegulationQuery): RegulationSummary {
    return {
      status: "restricted",
      season: `${this.state} placeholder: official data not connected`,
      dailyLimit: "Demo-only",
      sizeLimit: "Demo-only",
      restrictions: ["Use Washington mock data for the current beta demo"],
      warningMessages: ["This region is a placeholder until official state data is connected."],
      catchAndRelease: true,
      gearRestrictions: ["Verify official state rules before fishing."],
      emergencyRulePlaceholder: "Emergency rules are not connected for this placeholder region.",
      sourceLinks: placeholderLinks
    };
  }

  getSpeciesRules(_speciesId: string, query: RegulationQuery): RegulationSummary {
    return this.getStatewideRules(query);
  }

  getWaterbodyRules(_waterbodyId: string, query: RegulationQuery): RegulationSummary {
    return this.getStatewideRules(query);
  }
}

export class RegulationService {
  constructor(private readonly providers: RegulationProvider[]) {}

  private providerFor(state: RegulationQuery["state"]) {
    return this.providers.find((provider) => provider.state === state) ?? this.providers[0];
  }

  getSummary(query: RegulationQuery) {
    const provider = this.providerFor(query.state);
    if (query.waterbodyId) return provider.getWaterbodyRules(query.waterbodyId, query);
    if (query.speciesId) return provider.getSpeciesRules(query.speciesId, query);
    return provider.getStatewideRules(query);
  }
}

export class EmergencyRuleService {
  getEmergencyWarning(summary: RegulationSummary) {
    return summary.emergencyRulePlaceholder;
  }
}

export class WaterbodyRuleService {
  constructor(private readonly regulationService: RegulationService) {}

  getWaterbodyWarning(waterbodyId: string, date = new Date().toISOString()) {
    const summary = this.regulationService.getSummary({ state: "WA", waterbodyId, date });
    return summary.warningMessages.join(" ");
  }
}

export const regulationService = new RegulationService([
  new WashingtonRegulationProvider(),
  new MockRegulationProvider("OR"),
  new MockRegulationProvider("ID"),
  new MockRegulationProvider("CA")
]);
