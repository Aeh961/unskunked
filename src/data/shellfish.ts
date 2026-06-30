import { ActivityLocation, ShellfishSpecies } from "./types";
import { wdfwDataUpdated, wdfwSourceNames } from "./wdfwSources";
import { wdfwLinks } from "@/src/services/officialLinks";

export const shellfishSpecies: ShellfishSpecies[] = [
  clam("razor-clam", "Razor Clam", "Moderate", ["Ocean beaches", "Surf zone"], ["clam gun or shovel", "license", "container"], "Ocean beaches open by WDFW announcement only; check marine toxin closures."),
  clam("manila-clam", "Manila Clam", "Easy", ["Gravel beaches", "Protected bays"], ["small rake", "bucket", "gauge"], "Check beach-specific seasons, size, limits, and DOH health status."),
  clam("butter-clam", "Butter Clam", "Moderate", ["Gravel and cobble beaches"], ["shovel", "bucket", "gauge"], "Butter clams can retain toxins longer; verify health advisories."),
  clam("littleneck-clam", "Littleneck Clam", "Easy", ["Gravel beaches", "Tide flats"], ["small rake", "bucket", "gauge"], "Verify beach status, daily limits, and minimum size."),
  clam("horse-clam", "Horse Clam", "Advanced", ["Deeper mud and gravel"], ["large shovel", "bucket", "gauge"], "Advanced digging; confirm harvest rules and beach status."),
  clam("cockle", "Cockle", "Easy", ["Sandy mud", "Tide flats"], ["rake", "bucket", "license"], "Verify daily limits and beach health status."),
  clam("geoduck", "Geoduck Placeholder", "Advanced", ["Deep sand and mud"], ["deep shovel", "tube", "experience"], "Placeholder only; rules, gear, and access are specialized."),
  crab("dungeness-crab", "Dungeness Crab", "Moderate", ["Marine areas", "Piers", "Bays"], ["crab pot or ring", "bait box", "gauge", "catch record card"], "Verify sex, size, daily limit, soft-shell release, catch record card, and area season."),
  crab("red-rock-crab", "Red Rock Crab", "Easy", ["Rocky piers", "Marine shorelines"], ["crab ring", "bait", "gauge"], "Verify daily limits, area rules, and shell condition.")
];

export const shellfishLocations: ActivityLocation[] = [
  beach("dosewallips-state-park", "Dosewallips State Park", ["clamming", "crabbing"], "Jefferson", "Hood Canal", 47.687, -122.9005, "Beach", "Moderate", "Productive Hood Canal shellfish beach with camping nearby.", "Strong tide planning and DOH health checks required."),
  beach("birch-bay", "Birch Bay", ["clamming", "crabbing"], "Whatcom", "North Sound", 48.917, -122.744, "Beach", "Easy", "Family-friendly tide flats with broad access.", "Check shellfish safety, seasons, and parking rules."),
  beach("penrose-point", "Penrose Point", ["clamming", "crabbing"], "Pierce", "South Sound", 47.257, -122.748, "Beach", "Easy", "State park beach with family access and camping.", "Verify clam/oyster seasons and marine toxin status."),
  beach("westport-jetty", "Westport Jetty", ["crabbing"], "Grays Harbor", "Coast", 46.904, -124.12, "Pier", "Moderate", "Coastal jetty and marina access for crab and marine fishing.", "Ocean conditions, crab rules, and safety conditions change quickly."),
  beach("edmonds-pier-crab", "Edmonds Pier Crab Area", ["crabbing"], "Snohomish", "Puget Sound", 47.8132, -122.3862, "Pier", "Easy", "Pier-based crabbing and marine learning spot.", "Check marine area crab seasons, catch record card, and pier rules."),
  beach("long-beach-razor", "Long Beach Razor Clam Area", ["clamming"], "Pacific", "Coast", 46.352, -124.054, "Beach", "Moderate", "Iconic razor clam beach with WDFW opener dependency.", "Only dig on announced openers and verify marine toxin status.")
];

function clam(id: string, name: string, difficulty: ShellfishSpecies["difficulty"], habitat: string[], gear: string[], warning: string): ShellfishSpecies {
  return {
    id,
    name,
    activityType: "clamming",
    difficulty,
    seasonNotes: "Beach-specific seasons and health closures apply.",
    habitat,
    gear,
    regulationWarning: warning,
    keepReleaseWarning: "Keep only legal clams and refill holes where required.",
    youtubeSearches: [`Washington ${name} clamming beginner`, "WDFW shellfish beach rules"]
  };
}

function crab(id: string, name: string, difficulty: ShellfishSpecies["difficulty"], habitat: string[], gear: string[], warning: string): ShellfishSpecies {
  return {
    id,
    name,
    activityType: "crabbing",
    difficulty,
    seasonNotes: "Marine area seasons and catch record rules apply.",
    habitat,
    gear,
    regulationWarning: warning,
    keepReleaseWarning: "Release undersized, female, soft-shell, or illegal crab immediately.",
    youtubeSearches: [`Washington ${name} crabbing beginner`, "WDFW crab rules catch record card"]
  };
}

function beach(id: string, name: string, activityTypes: ActivityLocation["activityTypes"], county: string, region: string, latitude: number, longitude: number, accessType: ActivityLocation["accessType"], difficulty: ActivityLocation["difficulty"], seasonNotes: string, warning: string): ActivityLocation {
  return {
    id,
    name,
    activityTypes,
    county,
    region,
    waterType: accessType === "Pier" ? "Pier" : "Beach",
    latitude,
    longitude,
    accessType,
    difficulty,
    familyFriendly: difficulty !== "Advanced",
    seasonNotes,
    regulationWarning: warning,
    tideDependency: "Plan around low tide for clamming and moving tides for crabbing.",
    gearChecklist: activityTypes.includes("crabbing") ? ["license", "crab gauge", "crab pot/ring", "bait", "catch record card where required"] : ["license", "clam shovel/rake", "bucket", "shellfish gauge", "tide table"],
    harvestNotes: ["Verify beach or marine area is open", "Check emergency rules and health advisories", "Respect daily limits and minimum sizes"],
    safetyWarnings: ["Watch tides", "Avoid unsafe surf/current", "Do not harvest from closed or polluted beaches"],
    officialLinks: [wdfwLinks.shellfishSeaweed, wdfwLinks.emergencyRules, wdfwLinks.licenses, wdfwLinks.marineAreas],
    source: `${wdfwSourceNames.shellfishSeaweed}; ${wdfwSourceNames.emergencyRules}`,
    lastUpdated: wdfwDataUpdated,
    photoPlaceholder: `${name} shellfish location photo placeholder`
  };
}
