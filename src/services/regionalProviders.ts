import { RegionId, regions } from "@/src/data/regions";
import { providerMetadata } from "@/src/services/dataTrust";
import { ProviderDomain } from "@/src/services/providerFramework";

export type RegionProvider = {
  region: RegionId | "british-columbia";
  name: string;
  status: "complete-mock" | "placeholder" | "future";
  supportedDomains: ProviderDomain[];
  sourceOrganization: string;
  notes: string;
};

const completeMockDomains: Record<string, ProviderDomain[]> = {
  washington: ["fishing", "clamming", "crabbing", "weather", "tides", "waterbodies", "emergency-rules"],
  florida: ["fishing", "weather", "tides", "waterbodies"],
  ronneby: ["fishing", "weather", "waterbodies"]
};

const completeMockOrganization: Record<string, string> = {
  washington: "Washington Department of Fish & Wildlife",
  florida: "Florida Fish and Wildlife Conservation Commission",
  ronneby: "Havs- och vattenmyndigheten"
};

export const regionalProviders: RegionProvider[] = [
  ...regions.map((region) => region.status === "Mocked"
    ? {
        region: region.id,
        name: region.name,
        status: "complete-mock" as const,
        supportedDomains: completeMockDomains[region.id] ?? (["fishing", "waterbodies"] as ProviderDomain[]),
        sourceOrganization: completeMockOrganization[region.id] ?? `${region.name} fish and wildlife agency`,
        notes: region.note
      }
    : {
        region: region.id,
        name: region.name,
        status: "placeholder" as const,
        supportedDomains: ["fishing", "waterbodies"] as ProviderDomain[],
        sourceOrganization: `${region.name} fish and wildlife agency placeholder`,
        notes: region.note
      }),
  {
    region: "british-columbia",
    name: "British Columbia",
    status: "future",
    supportedDomains: ["fishing", "clamming", "crabbing", "waterbodies"],
    sourceOrganization: "British Columbia fisheries provider placeholder",
    notes: "Future cross-border region. No production data is bundled yet."
  }
];

export function getRegionalProvider(region: RegionProvider["region"]) {
  return regionalProviders.find((provider) => provider.region === region);
}

export function getWashingtonTrustSummary() {
  const trusted = providerMetadata.filter((provider) => provider.organization.includes("Washington") || provider.id.includes("wdfw"));
  return {
    providerCount: trusted.length,
    verifiedCount: trusted.filter((provider) => provider.confidence === "Verified" || provider.confidence === "Official Source").length,
    importedCount: trusted.filter((provider) => provider.confidence === "Imported").length
  };
}
