import { wdfwDataUpdated } from "@/src/data/wdfwSources";
import { wdfwSnapshotManifest } from "@/src/services/wdfwImportPipeline";

export type SourceConfidence =
  | "Verified"
  | "Community Verified"
  | "Official Source"
  | "Imported"
  | "Needs Verification"
  | "Demo Data"
  | "Unknown";

export type VerificationStatus = "imported" | "reviewed" | "verified" | "rejected" | "archived";

export type SourceType = "Official" | "Mock" | "User" | "Derived" | "Placeholder";

export type UpdateFrequency = "Live" | "Daily" | "Weekly" | "Monthly" | "Manual" | "Unknown";

export type DataFreshness = {
  createdAt: string;
  importedAt: string;
  lastUpdatedAt: string;
  lastVerifiedAt: string;
  expiresAfterDays: number;
};

export type DataProviderMetadata = {
  id: string;
  label: string;
  organization: string;
  sourceType: SourceType;
  confidence: SourceConfidence;
  verificationStatus: VerificationStatus;
  updateFrequency: UpdateFrequency;
  activities: string[];
  dataTypes: string[];
  sourceUrl?: string;
  freshness: DataFreshness;
  notes: string;
};

export type VerificationRecord = {
  id: string;
  subjectId: string;
  subjectType: "regulation" | "recommendation" | "waterbody" | "provider";
  status: VerificationStatus;
  reviewer: string;
  reviewedAt: string;
  notes: string;
};

export const confidenceDescriptions: Record<SourceConfidence, string> = {
  Verified: "Reviewed against an official or trusted source recently.",
  "Community Verified": "Checked by local users, but still needs official confirmation.",
  "Official Source": "Points directly to an official agency source.",
  Imported: "Loaded from a source snapshot and awaiting deeper review.",
  "Needs Verification": "Useful planning context, but users should confirm before relying on it.",
  "Demo Data": "Local mock data for beta testing and demos.",
  Unknown: "Source quality has not been classified yet."
};

export const providerMetadata: DataProviderMetadata[] = [
  {
    id: "wdfw-regulations",
    label: "Fishing Regulations",
    organization: "Washington Department of Fish & Wildlife",
    sourceType: "Official",
    confidence: "Official Source",
    verificationStatus: "reviewed",
    updateFrequency: "Manual",
    activities: ["Fishing", "Clamming", "Crabbing"],
    dataTypes: ["Regulations", "Emergency rules", "License reminders"],
    sourceUrl: "https://wdfw.wa.gov/fishing/regulations",
    freshness: trustDate("2026-05-01", "2026-06-30", 45),
    notes: "Official links are available in-app; local summaries remain planning guidance."
  },
  {
    id: "wdfw-shellfish",
    label: "Shellfish Rules",
    organization: "Washington Department of Fish & Wildlife",
    sourceType: "Official",
    confidence: "Imported",
    verificationStatus: "imported",
    updateFrequency: "Manual",
    activities: ["Clamming", "Crabbing"],
    dataTypes: ["Shellfish locations", "Harvest reminders", "Marine area links"],
    sourceUrl: "https://wdfw.wa.gov/fishing/shellfishing-regulations",
    freshness: trustDate("2026-05-01", "2026-06-30", 30),
    notes: "Snapshot manifest is present; beach health closures still require official verification."
  },
  {
    id: "unskunked-waterbodies",
    label: "Waterbody Information",
    organization: "Unskunked local seed data",
    sourceType: "Mock",
    confidence: "Demo Data",
    verificationStatus: "reviewed",
    updateFrequency: "Manual",
    activities: ["Fishing"],
    dataTypes: ["Waterbody names", "Access notes", "Beginner difficulty", "Bait and rig suggestions"],
    sourceUrl: "https://wdfw.wa.gov/fishing/locations",
    freshness: trustDate("2026-05-01", "2026-06-30", 60),
    notes: "Washington mock data is structured for future official imports."
  },
  {
    id: "mock-weather-tides",
    label: "Weather and Tides",
    organization: "Unskunked mock conditions provider",
    sourceType: "Mock",
    confidence: "Demo Data",
    verificationStatus: "imported",
    updateFrequency: "Unknown",
    activities: ["Fishing", "Clamming", "Crabbing"],
    dataTypes: ["Weather", "Tides", "Sunrise/sunset", "Trip score factors"],
    freshness: trustDate("2026-06-30", "2026-06-30", 7),
    notes: "Provider interface is ready for future live NOAA/weather/tide sources."
  },
  {
    id: "user-journal",
    label: "Personal Fishing Journal",
    organization: "Local device storage",
    sourceType: "User",
    confidence: "Community Verified",
    verificationStatus: "reviewed",
    updateFrequency: "Live",
    activities: ["Fishing", "Clamming", "Crabbing"],
    dataTypes: ["Trip logs", "Favorites", "Saved plans", "Feedback"],
    freshness: trustDate("2026-06-30", "2026-06-30", 365),
    notes: "Private local data. Nothing is uploaded by the app."
  },
  ...wdfwSnapshotManifest.sources.map((source) => ({
    id: source.id,
    label: source.title,
    organization: "Washington Department of Fish & Wildlife",
    sourceType: "Official" as const,
    confidence: "Imported" as const,
    verificationStatus: "imported" as const,
    updateFrequency: "Manual" as const,
    activities: source.activityTypes.map((activity) => activity[0].toUpperCase() + activity.slice(1)),
    dataTypes: ["Snapshot manifest", "Source metadata"],
    sourceUrl: source.sourceUrl,
    freshness: {
      createdAt: source.snapshotDate,
      importedAt: source.importedDate,
      lastUpdatedAt: wdfwDataUpdated,
      lastVerifiedAt: source.lastVerifiedDate,
      expiresAfterDays: 30
    },
    notes: "Immutable Phase 9/10 source snapshot for future importer validation."
  }))
];

export const verificationWorkflow: VerificationRecord[] = [
  {
    id: "verify-regulations-001",
    subjectId: "wdfw-regulations",
    subjectType: "provider",
    status: "reviewed",
    reviewer: "Unskunked beta team",
    reviewedAt: "2026-06-30",
    notes: "Official links and disclaimers are present. Local summaries are still not legal advice."
  },
  {
    id: "verify-shellfish-001",
    subjectId: "wdfw-shellfish",
    subjectType: "provider",
    status: "imported",
    reviewer: "Unskunked beta team",
    reviewedAt: "2026-06-30",
    notes: "Source manifest exists; beach status and toxin closures need live official verification."
  }
];

function trustDate(sourceDate: string, verifiedAt: string, expiresAfterDays: number): DataFreshness {
  return {
    createdAt: sourceDate,
    importedAt: "2026-06-30",
    lastUpdatedAt: sourceDate,
    lastVerifiedAt: verifiedAt,
    expiresAfterDays
  };
}

export function getFreshnessState(freshness: DataFreshness, now = new Date()) {
  const verified = new Date(`${freshness.lastVerifiedAt}T00:00:00.000Z`);
  const ageDays = Math.max(0, Math.floor((now.getTime() - verified.getTime()) / 86_400_000));
  const daysUntilStale = freshness.expiresAfterDays - ageDays;
  return {
    ageDays,
    daysUntilStale,
    isStale: daysUntilStale < 0,
    isExpiringSoon: daysUntilStale >= 0 && daysUntilStale <= 7,
    warning: daysUntilStale < 0
      ? `Stale by ${Math.abs(daysUntilStale)} days. Verify official rules before relying on this.`
      : daysUntilStale <= 7
        ? `Becoming stale in ${daysUntilStale} days. Recheck official sources.`
        : `Fresh for ${daysUntilStale} more days.`
  };
}

export function getProviderById(id: string) {
  return providerMetadata.find((provider) => provider.id === id);
}
