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

export const regionalProviders: RegionProvider[] = [
  {
    region: "washington",
    name: "Washington",
    status: "complete-mock",
    supportedDomains: ["fishing", "clamming", "crabbing", "weather", "tides", "waterbodies", "emergency-rules"],
    sourceOrganization: "Washington Department of Fish & Wildlife",
    notes: "Primary beta region with WDFW-ready source metadata and local snapshots."
  },
  ...regions.filter((region) => region.id !== "washington").map((region) => ({
    region: region.id,
    name: region.name,
    status: "placeholder" as const,
    supportedDomains: ["fishing", "waterbodies"] as ProviderDomain[],
    sourceOrganization: `${region.name} fish and wildlife agency placeholder`,
    notes: region.note
  })),
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
