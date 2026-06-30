import { ActivityType } from "@/src/data/types";
import { DataProviderMetadata } from "@/src/services/dataTrust";

export type ProviderDomain =
  | "fishing"
  | "clamming"
  | "crabbing"
  | "weather"
  | "tides"
  | "waterbodies"
  | "emergency-rules";

export type ProviderResult<T> = {
  data: T[];
  metadata: DataProviderMetadata;
  fetchedAt: string;
};

export type ImportProvider<Raw, Transformed> = {
  id: string;
  domain: ProviderDomain;
  supportedActivities: ActivityType[];
  fetch: () => Promise<Raw[]>;
  validate: (records: Raw[]) => { valid: boolean; errors: string[] };
  transform: (records: Raw[]) => Transformed[];
  cache: (records: Transformed[]) => Promise<void>;
  metadata: () => DataProviderMetadata;
};

export function createProviderHealthReport(providers: Array<Pick<ImportProvider<unknown, unknown>, "id" | "domain" | "metadata">>) {
  return providers.map((provider) => {
    const metadata = provider.metadata();
    return {
      id: provider.id,
      domain: provider.domain,
      confidence: metadata.confidence,
      verificationStatus: metadata.verificationStatus,
      sourceType: metadata.sourceType,
      readyForLiveSync: metadata.sourceType !== "Placeholder" && metadata.verificationStatus !== "rejected"
    };
  });
}
