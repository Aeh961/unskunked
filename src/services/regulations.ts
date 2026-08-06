import { getSpeciesForRegion } from "@/src/data/fish";
import { RegionId } from "@/src/data/regions";
import { Regulation, Status, Waterbody } from "@/src/data/types";
import { getWaterbodiesForRegion } from "@/src/data/waterbodies";
import { getOfficialLinksForRegion, OfficialSourceLinks } from "@/src/services/officialLinks";

/** @deprecated use OfficialSourceLinks from src/services/officialLinks - kept as an alias so existing imports don't break. */
export type RegulationSourceLinks = OfficialSourceLinks;

export type RegulationQuery = {
  state: "WA" | "FL" | "SE-RONNEBY" | "OR" | "ID" | "CA";
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
  sourceLinks: OfficialSourceLinks;
};

export interface RegulationProvider {
  readonly state: RegulationQuery["state"];
  getStatewideRules(query: RegulationQuery): RegulationSummary;
  getSpeciesRules(speciesId: string, query: RegulationQuery): RegulationSummary;
  getWaterbodyRules(waterbodyId: string, query: RegulationQuery): RegulationSummary;
}

const stateToRegion: Record<RegulationQuery["state"], RegionId> = {
  WA: "washington",
  FL: "florida",
  "SE-RONNEBY": "ronneby",
  OR: "oregon",
  ID: "idaho",
  CA: "california"
};

export const regionToRegulationState: Partial<Record<RegionId, RegulationQuery["state"]>> = {
  washington: "WA",
  florida: "FL",
  ronneby: "SE-RONNEBY",
  oregon: "OR",
  idaho: "ID",
  california: "CA"
};

function fromRegulation(regulation: Regulation, region: RegionId, water?: Waterbody): RegulationSummary {
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
    emergencyRulePlaceholder: "No official emergency-rule feed is connected yet. Always verify official emergency rules before keeping fish.",
    sourceLinks: getOfficialLinksForRegion(region, water)
  };
}

/**
 * Shared implementation for every region that ships local mock waterbody/species data
 * (Washington, Florida, Ronneby). Region-specific subclasses only set state/region/copy -
 * the rule lookup logic itself is identical across regions.
 */
abstract class MockedRegionRegulationProvider implements RegulationProvider {
  abstract readonly state: RegulationQuery["state"];
  protected abstract readonly region: RegionId;
  protected abstract readonly agencyAbbreviation: string;
  protected abstract readonly summerSeasonNote: string;
  protected abstract readonly annualSeasonNote: string;

  getStatewideRules(query: RegulationQuery): RegulationSummary {
    const month = new Date(query.date ?? new Date().toISOString()).getMonth() + 1;
    return {
      status: "restricted",
      season: month >= 7 ? this.summerSeasonNote : this.annualSeasonNote,
      dailyLimit: "Varies by species and waterbody",
      sizeLimit: "Varies by species and waterbody",
      restrictions: ["License required", "Waterbody rules override generic summaries", "Emergency rules can supersede annual rules"],
      warningMessages: ["This is a local planning summary, not legal guidance."],
      catchAndRelease: false,
      gearRestrictions: ["Confirm bait, hook, and selective gear rules before fishing rivers or salmon waters."],
      emergencyRulePlaceholder: `${this.agencyAbbreviation} emergency rule integration target: ingest active rule changes by species, waterbody, county, and date.`,
      sourceLinks: getOfficialLinksForRegion(this.region)
    };
  }

  getSpeciesRules(speciesId: string, query: RegulationQuery): RegulationSummary {
    const fish = getSpeciesForRegion(this.region).find((item) => item.id === speciesId);
    return fish ? fromRegulation(fish.regulation, this.region, query.waterbodyId ? getWaterbodiesForRegion(this.region).find((water) => water.id === query.waterbodyId) : undefined) : this.getStatewideRules(query);
  }

  getWaterbodyRules(waterbodyId: string, query: RegulationQuery): RegulationSummary {
    const water = getWaterbodiesForRegion(this.region).find((item) => item.id === waterbodyId);
    const firstFish = getSpeciesForRegion(this.region).find((fish) => water?.speciesIds.includes(fish.id));
    return firstFish ? fromRegulation(firstFish.regulation, this.region, water) : this.getStatewideRules(query);
  }
}

export class WashingtonRegulationProvider extends MockedRegionRegulationProvider {
  readonly state = "WA" as const;
  protected readonly region = "washington" as const;
  protected readonly agencyAbbreviation = "WDFW";
  protected readonly summerSeasonNote = "Mock statewide season: summer rules may vary by species and waterbody.";
  protected readonly annualSeasonNote = "Mock statewide season: verify current annual pamphlet.";
}

export class FloridaRegulationProvider extends MockedRegionRegulationProvider {
  readonly state = "FL" as const;
  protected readonly region = "florida" as const;
  protected readonly agencyAbbreviation = "FWC";
  protected readonly summerSeasonNote = "Mock statewide season: summer rules may vary by species and waterbody.";
  protected readonly annualSeasonNote = "Mock statewide season: verify the current FWC regulations summary.";
}

export class RonnebyRegulationProvider extends MockedRegionRegulationProvider {
  readonly state = "SE-RONNEBY" as const;
  protected readonly region = "ronneby" as const;
  protected readonly agencyAbbreviation = "HaV";
  protected readonly summerSeasonNote = "Mock season: many Swedish waters allow free handredskap fishing along the coast, but license/permit rules vary by water.";
  protected readonly annualSeasonNote = "Mock season: verify current HaV and local fishing-permit-area (fiskevårdsområde) rules.";
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
      sourceLinks: getOfficialLinksForRegion(stateToRegion[this.state])
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

  getWaterbodyWarning(waterbodyId: string, state: RegulationQuery["state"] = "WA", date = new Date().toISOString()) {
    const summary = this.regulationService.getSummary({ state, waterbodyId, date });
    return summary.warningMessages.join(" ");
  }
}

export const regulationService = new RegulationService([
  new WashingtonRegulationProvider(),
  new FloridaRegulationProvider(),
  new RonnebyRegulationProvider(),
  new MockRegulationProvider("OR"),
  new MockRegulationProvider("ID"),
  new MockRegulationProvider("CA")
]);
