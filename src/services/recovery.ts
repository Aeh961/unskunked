export type RecoveryScenario =
  | "gps-unavailable"
  | "provider-unavailable"
  | "weather-unavailable"
  | "tide-unavailable"
  | "offline"
  | "missing-image"
  | "missing-regulations"
  | "failed-import";

export function getRecoveryMessage(scenario: RecoveryScenario) {
  const messages: Record<RecoveryScenario, { title: string; body: string; action: string }> = {
    "gps-unavailable": {
      title: "Location is unavailable",
      body: "Use a manual Washington location and Unskunked will still sort nearby waters locally.",
      action: "Choose manual location"
    },
    "provider-unavailable": {
      title: "Live provider unavailable",
      body: "Unskunked is showing the latest local fallback data and source links.",
      action: "View data sources"
    },
    "weather-unavailable": {
      title: "Weather fallback active",
      body: "Mock offline weather is being used until a live provider is connected.",
      action: "Check again later"
    },
    "tide-unavailable": {
      title: "Tide unavailable",
      body: "Use official tide tables before clamming or crabbing when tide timing matters.",
      action: "Verify tides"
    },
    offline: {
      title: "Offline mode",
      body: "Local waters, saved trips, favorites, source metadata, and cached conditions remain available.",
      action: "Open offline packs"
    },
    "missing-image": {
      title: "Image missing",
      body: "This beta may show placeholders until production photos and attribution are added.",
      action: "Continue"
    },
    "missing-regulations": {
      title: "Regulation needs verification",
      body: "Do not keep fish or shellfish until you verify the official agency rules.",
      action: "Open official rules"
    },
    "failed-import": {
      title: "Import failed",
      body: "The previous verified local snapshot remains active until a new import validates cleanly.",
      action: "View import report"
    }
  };
  return messages[scenario];
}
