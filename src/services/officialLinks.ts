import { RegionId } from "@/src/data/regions";
import { Waterbody } from "@/src/data/types";
import { SourceConfidence } from "@/src/services/dataTrust";

export type OfficialSourceLinks = {
  regulations: string;
  emergencyRules: string;
  licenses: string;
  locationsDirectory: string;
  shellfishSeaweed: string;
  marineAreas: string;
  freshwaterRules: string;
};

export interface OfficialLinkProvider {
  readonly state: RegionId;
  readonly agencyName: string;
  readonly agencyAbbreviation: string;
  readonly confidence: SourceConfidence;
  readonly note: string;
  getLinks(waterbody?: Pick<Waterbody, "officialLink">): OfficialSourceLinks;
}

class WashingtonOfficialLinkProvider implements OfficialLinkProvider {
  readonly state = "washington" as const;
  readonly agencyName = "Washington Department of Fish & Wildlife";
  readonly agencyAbbreviation = "WDFW";
  readonly confidence: SourceConfidence = "Official Source";
  readonly note = "Deep links verified against WDFW's public fishing regulations site.";

  private readonly base: OfficialSourceLinks = {
    regulations: "https://wdfw.wa.gov/fishing/regulations",
    emergencyRules: "https://wdfw.wa.gov/fishing/regulations/emergency-rules",
    licenses: "https://wdfw.wa.gov/licenses/fishing",
    locationsDirectory: "https://wdfw.wa.gov/fishing/locations",
    shellfishSeaweed: "https://wdfw.wa.gov/fishing/shellfishing-regulations",
    marineAreas: "https://wdfw.wa.gov/fishing/management/marine-areas",
    freshwaterRules: "https://wdfw.wa.gov/fishing/regulations/freshwater"
  };

  getLinks(waterbody?: Pick<Waterbody, "officialLink">): OfficialSourceLinks {
    return {
      ...this.base,
      locationsDirectory: waterbody?.officialLink ?? this.base.locationsDirectory
    };
  }
}

/**
 * Oregon/Idaho/California providers intentionally point every field at the agency's real
 * homepage rather than a guessed deep link. Only the root domains below are confidently known -
 * fabricating specific regulation/license URL paths for agencies this app hasn't verified against
 * would be worse than an honest placeholder. Replace with real deep links once verified, the same
 * way WDFW's links above were.
 */
function placeholderAgencyLinks(homepage: string): OfficialSourceLinks {
  return {
    regulations: homepage,
    emergencyRules: homepage,
    licenses: homepage,
    locationsDirectory: homepage,
    shellfishSeaweed: homepage,
    marineAreas: homepage,
    freshwaterRules: homepage
  };
}

class OregonOfficialLinkProvider implements OfficialLinkProvider {
  readonly state = "oregon" as const;
  readonly agencyName = "Oregon Department of Fish and Wildlife";
  readonly agencyAbbreviation = "ODFW";
  readonly confidence: SourceConfidence = "Needs Verification";
  readonly note = "Points to ODFW's homepage until specific regulation/license page paths are verified.";
  private readonly links = placeholderAgencyLinks("https://myodfw.com");

  getLinks(): OfficialSourceLinks {
    return this.links;
  }
}

class IdahoOfficialLinkProvider implements OfficialLinkProvider {
  readonly state = "idaho" as const;
  readonly agencyName = "Idaho Fish and Game";
  readonly agencyAbbreviation = "IDFG";
  readonly confidence: SourceConfidence = "Needs Verification";
  readonly note = "Points to IDFG's homepage until specific regulation/license page paths are verified.";
  private readonly links = placeholderAgencyLinks("https://idfg.idaho.gov");

  getLinks(): OfficialSourceLinks {
    return this.links;
  }
}

class CaliforniaOfficialLinkProvider implements OfficialLinkProvider {
  readonly state = "california" as const;
  readonly agencyName = "California Department of Fish and Wildlife";
  readonly agencyAbbreviation = "CDFW";
  readonly confidence: SourceConfidence = "Needs Verification";
  readonly note = "Points to CDFW's homepage until specific regulation/license page paths are verified.";
  private readonly links = placeholderAgencyLinks("https://wildlife.ca.gov");

  getLinks(): OfficialSourceLinks {
    return this.links;
  }
}

export const officialLinkProviders: OfficialLinkProvider[] = [
  new WashingtonOfficialLinkProvider(),
  new OregonOfficialLinkProvider(),
  new IdahoOfficialLinkProvider(),
  new CaliforniaOfficialLinkProvider()
];

export function getOfficialLinkProvider(state: RegionId): OfficialLinkProvider {
  return officialLinkProviders.find((provider) => provider.state === state) ?? officialLinkProviders[0];
}

export function getOfficialLinksForRegion(state: RegionId, waterbody?: Pick<Waterbody, "officialLink">): OfficialSourceLinks {
  return getOfficialLinkProvider(state).getLinks(waterbody);
}

/** Washington's links, used as the default when no region context is available yet. */
export const wdfwLinks: OfficialSourceLinks = new WashingtonOfficialLinkProvider().getLinks();

export function getOfficialLinksForWaterbody(waterbody?: Pick<Waterbody, "officialLink">): OfficialSourceLinks {
  return getOfficialLinkProvider("washington").getLinks(waterbody);
}

export function getOfficialVerificationCopy(waterbody?: Pick<Waterbody, "name" | "waterType">) {
  const subject = waterbody ? `${waterbody.name} (${waterbody.waterType})` : "this water";
  return `Use Unskunked for planning only. Verify current WDFW rules, emergency rules, license requirements, seasons, limits, closures, and gear restrictions for ${subject} before fishing or keeping fish.`;
}
