import { Waterbody } from "./types";
import { makeWdfwWaterbodyId, wdfwDataUpdated, wdfwSourceNames } from "./wdfwSources";

const fishWashington = "https://wdfw.wa.gov/fishing/locations";

export const waterbodies: Waterbody[] = [
  wa("lake-washington", "Lake Washington", "Seattle metro", "King", "Lake", 47.6215, -122.2559, ["yellow-perch", "smallmouth-bass", "largemouth-bass", "cutthroat-trout"], "open", "Easy", "Easy", "Urban launches, parks, and piers; parking varies by access point.", "Warmwater fishing is approachable, but trout/cutthroat rules and advisories must be verified.", ["worms", "drop shot worms", "small jigs"], ["Drop shot rig", "Split shot rig", "Jig"], "Summer perch; spring through fall bass; check trout/cutthroat notes.", "Target perch near docks with tiny worm pieces before trying bass around rocks."),
  wa("green-lake", "Green Lake", "Seattle", "King", "Park", 47.6801, -122.3289, ["rainbow-trout", "yellow-perch", "largemouth-bass", "bluegill"], "open", "Easy", "Easy", "City park lots and street parking can fill on sunny weekends.", "Stocked trout and warmwater options. Check city and WDFW notices.", ["PowerBait", "worms", "small spinners"], ["Bobber rig", "Trout PowerBait rig", "Spinner setup"], "Spring stockings and cool mornings; panfish in summer.", "Start with a bobber and worm around weed edges, then switch to PowerBait for trout."),
  wa("lake-sammamish", "Lake Sammamish", "Eastside", "King", "Lake", 47.5933, -122.0655, ["smallmouth-bass", "yellow-perch", "kokanee", "cutthroat-trout"], "restricted", "Moderate", "Moderate", "State park and boat launch access; summer parking can be tight.", "Bass and perch options; kokanee and trout rules require extra checking.", ["drop shot worms", "small jigs", "scented corn where legal"], ["Drop shot rig", "Jig", "Carolina rig"], "Spring through fall bass; kokanee rules vary.", "Use a drop shot on rocky points. Keep kokanee as a future boat/trolling goal."),
  wa("lake-union", "Lake Union", "Seattle", "King", "Lake", 47.6396, -122.3335, ["largemouth-bass", "yellow-perch", "bluegill", "crappie"], "open", "Easy", "Easy", "Street parking and small parks; watch boat traffic.", "Urban warmwater fishing with waterbody-specific advisories to verify.", ["worms", "small jigs", "soft plastics"], ["Bobber rig", "Jig", "Texas rig"], "Late spring through fall for warmwater species.", "Fish shade lines around docks with a worm or small jig."),
  wa("rattlesnake-lake", "Rattlesnake Lake", "North Bend", "King", "Lake", 47.4332, -121.7673, ["rainbow-trout", "cutthroat-trout"], "open", "Easy", "Easy", "Large recreation lot, but it fills on warm hiking days.", "Trout rules and seasonal access should be checked before keeping fish.", ["PowerBait", "worms", "small spoons"], ["Trout PowerBait rig", "Bobber rig", "Spinner setup"], "Spring and fall trout windows.", "Fish early from shore before wind and recreation traffic pick up."),
  wa("pine-lake", "Pine Lake", "Sammamish", "King", "Lake", 47.5888, -122.0368, ["rainbow-trout", "largemouth-bass", "yellow-perch", "bluegill"], "open", "Easy", "Easy", "City park parking; best early before crowds.", "Stocking and warmwater rules should be verified.", ["PowerBait", "worms", "small spinners"], ["Bobber rig", "Trout PowerBait rig", "Spinner setup"], "Spring trout; summer panfish and bass.", "Start from the park with PowerBait for trout or worms for panfish."),
  wa("beaver-lake", "Beaver Lake", "Sammamish", "King", "Lake", 47.5866, -122.0033, ["rainbow-trout", "largemouth-bass", "yellow-perch", "bluegill"], "open", "Easy", "Easy", "Park access with limited busy-day parking.", "Verify stocked trout timing, lake rules, and harvest limits.", ["PowerBait", "worms", "small jigs"], ["Bobber rig", "Trout PowerBait rig", "Jig"], "Spring trout; summer warmwater.", "Use a simple bank setup and move quietly along accessible shoreline."),
  wa("angle-lake", "Angle Lake", "SeaTac", "King", "Lake", 47.4296, -122.2937, ["rainbow-trout", "yellow-perch", "largemouth-bass", "bluegill"], "open", "Easy", "Easy", "City park lot; airport-area traffic can be busy.", "Urban lake rules and fish advisories should be checked.", ["PowerBait", "worms", "small spinners"], ["Bobber rig", "Trout PowerBait rig", "Spinner setup"], "Spring trout, summer panfish.", "Try worms under a bobber from the park shoreline."),
  wa("american-lake", "American Lake", "Lakewood", "Pierce", "Lake", 47.1307, -122.5648, ["rainbow-trout", "kokanee", "yellow-perch", "smallmouth-bass"], "restricted", "Moderate", "Moderate", "Boat launches and parks; shore options vary.", "Kokanee/trout limits and advisories should be verified.", ["PowerBait", "worms", "small jigs", "scented corn where legal"], ["Trout PowerBait rig", "Drop shot rig", "Jig"], "Spring trout; summer kokanee and bass.", "Beginners should start with trout or perch from shore."),
  wa("spanaway-lake", "Spanaway Lake", "Spanaway", "Pierce", "Lake", 47.1037, -122.4268, ["rainbow-trout", "yellow-perch", "largemouth-bass", "bluegill", "crappie"], "open", "Easy", "Easy", "County park parking and docks; fees may apply.", "Verify stocking, daily limits, and park rules.", ["PowerBait", "worms", "small jigs"], ["Bobber rig", "Trout PowerBait rig", "Jig"], "Spring trout; summer panfish.", "Fish docks and weed edges with worms when trout slow down."),
  wa("potholes-reservoir", "Potholes Reservoir", "Columbia Basin", "Grant", "Lake", 46.9868, -119.3232, ["walleye", "smallmouth-bass", "largemouth-bass", "yellow-perch", "crappie"], "open", "Moderate", "Moderate", "State park and resort access; large water needs planning.", "Warmwater limits and area-specific rules should be checked.", ["worms", "jigs", "crankbaits"], ["Jig", "Drop shot rig", "Carolina rig"], "Spring through fall warmwater.", "Target panfish or bass first; save walleye structure patterns for a longer trip."),
  wa("banks-lake", "Banks Lake", "Grand Coulee", "Grant", "Lake", 47.6415, -119.0925, ["walleye", "smallmouth-bass", "yellow-perch", "rainbow-trout"], "open", "Moderate", "Moderate", "State park and boat launches; wind can be serious.", "Large-reservoir rules and species limits require verification.", ["jigs", "worms", "crankbaits"], ["Jig", "Drop shot rig", "Spinner setup"], "Spring and fall for shore comfort; summer early/late.", "Use jigs around rocky banks for smallmouth if you are new."),
  wa("lake-chelan", "Lake Chelan", "Chelan", "Chelan", "Lake", 47.8463, -120.0248, ["kokanee", "rainbow-trout", "cutthroat-trout", "smallmouth-bass"], "restricted", "Advanced", "Moderate", "Public parks, docks, and launches; deep clear water.", "Kokanee/trout rules and deep-water tactics require checking.", ["scented corn where legal", "small spoons", "worms"], ["Dodger and hoochie", "Spinner setup", "Drop shot rig"], "Spring/summer kokanee; bass in warmer months.", "Beginners should fish docks or shoreline for bass before tackling kokanee."),
  wa("yakima-river", "Yakima River", "Yakima Canyon", "Kittitas/Yakima", "River", 46.8537, -120.4778, ["rainbow-trout", "cutthroat-trout"], "restricted", "Advanced", "Moderate", "Access points along canyon; wading safety matters.", "Selective gear, catch-and-release, and section rules may apply.", ["flies", "small spinners where legal"], ["Spinner setup", "Split shot rig"], "Spring and fall; summer mornings.", "Verify section rules first; new anglers should consider guided or bank-access scouting."),
  wa("snoqualmie-river", "Snoqualmie River", "King County", "King", "River", 47.5415, -121.8372, ["rainbow-trout", "cutthroat-trout", "salmon", "steelhead"], "restricted", "Advanced", "Advanced", "Many access points; river sections and flows matter.", "River rules vary by section, season, and species.", ["spinners", "worms where legal", "jigs where legal"], ["Spinner setup", "Split shot rig", "Jig"], "Trout windows vary; salmon/steelhead highly regulated.", "If you are new, use this as a scouting and learning destination first."),
  wa("skykomish-river", "Skykomish River", "Snohomish County", "Snohomish", "River", 47.8387, -121.6619, ["salmon", "steelhead", "rainbow-trout", "cutthroat-trout"], "restricted", "Advanced", "Advanced", "Access near towns and bars; flows can be hazardous.", "Salmon/steelhead emergency rules can change quickly.", ["jigs where legal", "spinners", "eggs where legal"], ["Jig", "Spinner setup"], "Highly species and rule dependent.", "Check emergency rules first; practice casting only if unsure."),
  wa("green-river", "Green River", "South King County", "King", "River", 47.3112, -122.2037, ["salmon", "steelhead", "cutthroat-trout"], "restricted", "Advanced", "Advanced", "Urban river access varies; watch flows and private property.", "Rules vary by section and emergency closures.", ["spinners", "jigs where legal"], ["Spinner setup", "Jig"], "Species windows vary widely.", "Treat as an advanced rules-checking destination."),
  wa("cedar-river", "Cedar River", "Renton", "King", "River", 47.4807, -122.2171, ["rainbow-trout", "cutthroat-trout", "salmon"], "restricted", "Advanced", "Advanced", "Trail and park access; sections may be closed.", "Closures, selective gear, and salmon protections may apply.", ["small spinners where legal", "flies"], ["Spinner setup", "Split shot rig"], "Verify current river openings.", "Do not fish until you confirm the exact open section and rules."),
  wa("columbia-river", "Columbia River", "State border", "Multiple", "River", 45.6272, -122.7006, ["smallmouth-bass", "walleye", "salmon", "steelhead", "sturgeon"], "restricted", "Advanced", "Moderate", "Huge river with many launches; wind/current planning is essential.", "Big river with changing salmon, sturgeon, and warmwater rules.", ["tube jigs", "drop shot worms", "salmon gear where legal"], ["Drop shot rig", "Jig", "Spinner setup"], "Warmwater spring-fall; salmon/sturgeon highly regulated.", "Skip salmon complexity and target smallmouth with a jig around rocky edges."),
  wa("puget-sound", "Puget Sound", "Marine areas", "Multiple", "Saltwater", 47.7237, -122.4713, ["salmon", "lingcod", "rockfish", "flounder"], "restricted", "Advanced", "Advanced", "Marine access varies by beach, launch, and pier.", "Marine areas have complex salmon, bottomfish, shellfish, and emergency rules.", ["jigs", "spinners", "herring where legal"], ["Jig", "Spinner setup"], "Tides, marine area, and species dependent.", "Treat this as a learning stop until marine area status is verified."),
  wa("edmonds-pier", "Edmonds Fishing Pier", "Edmonds", "Snohomish", "Pier", 47.8132, -122.3862, ["salmon", "lingcod", "rockfish", "flounder", "yellow-perch"], "restricted", "Moderate", "Moderate", "Pier access and nearby lots; check city parking signs.", "Pier and marine rules apply; salmon seasons can change quickly.", ["jigs", "small pieces of shrimp", "herring where legal"], ["Jig", "Spinner setup", "Split shot rig"], "Pier fishing varies by tide and season.", "Practice with a small jig and verify salmon/bottomfish rules first."),
  wa("seattle-waterfront-piers", "Seattle Waterfront Piers", "Seattle", "King", "Pier", 47.6068, -122.3425, ["salmon", "flounder", "rockfish"], "restricted", "Moderate", "Moderate", "Paid garages, transit, and street parking nearby.", "Marine and pier rules apply; closures and species rules must be checked.", ["jigs", "small bait pieces where legal"], ["Jig", "Split shot rig"], "Best with tides and legal openings.", "Use this as a casting and identification practice spot unless rules are clear."),
  wa("westport", "Westport", "Coast", "Grays Harbor", "Saltwater", 46.9043, -124.1051, ["salmon", "lingcod", "rockfish", "flounder"], "restricted", "Advanced", "Moderate", "Marina, beaches, jetties, and charter access; ocean conditions matter.", "Marine, shellfish, bottomfish, and salmon rules must be verified.", ["jigs", "herring where legal", "shrimp where legal"], ["Jig", "Spinner setup"], "Ocean seasons and weather dependent.", "Beginners should start with pier/jetty basics or a charter and verify marine rules."),
  wa("neah-bay", "Neah Bay", "North Coast", "Clallam", "Saltwater", 48.3681, -124.6153, ["salmon", "lingcod", "rockfish", "flounder"], "restricted", "Advanced", "Advanced", "Remote marine access; tribal/local rules and ocean safety matter.", "Marine area rules, tribal considerations, and emergency changes must be checked.", ["jigs", "herring where legal"], ["Jig", "Spinner setup"], "Highly marine-area and weather dependent.", "Advanced destination; verify official rules and local requirements before planning."),
  wa("deception-pass", "Deception Pass", "Whidbey/Fidalgo", "Island/Skagit", "Saltwater", 48.4057, -122.6446, ["salmon", "lingcod", "rockfish", "flounder"], "restricted", "Advanced", "Advanced", "State park parking; currents are powerful and dangerous.", "Marine area and species rules apply; currents add safety risk.", ["jigs", "spinners", "herring where legal"], ["Jig", "Spinner setup"], "Tide and season dependent.", "Shore fish only from safe areas and verify rules before targeting bottomfish or salmon.")
];

function wa(
  id: string,
  name: string,
  region: string,
  county: string,
  waterType: Waterbody["waterType"],
  latitude: number,
  longitude: number,
  speciesIds: string[],
  status: Waterbody["status"],
  shoreAccessDifficulty: NonNullable<Waterbody["shoreAccessDifficulty"]>,
  beginnerDifficulty: Waterbody["beginnerDifficulty"],
  parkingNote: string,
  regulationSummary: string,
  suggestedBait: string[],
  recommendedRigs: string[],
  bestSeason: string,
  todayRecommendation: string
): Waterbody {
  return {
    id,
    waterbodyId: makeWdfwWaterbodyId(id),
    name,
    region,
    county,
    city: region,
    source: `${wdfwSourceNames.fishWashington}; ${wdfwSourceNames.regulations}; ${wdfwSourceNames.waterAccess}`,
    lastUpdated: wdfwDataUpdated,
    regulationReference: "Verify in the WDFW annual pamphlet and emergency rules before fishing.",
    boatLaunchReference: "Verify launch status in WDFW water access listings.",
    waterType,
    latitude,
    longitude,
    speciesIds,
    shoreAccessDifficulty,
    parkingNote,
    bestSeason,
    officialLink: fishWashington,
    boatLaunch: waterType === "Lake" || waterType === "Saltwater",
    kayakFriendly: waterType === "Lake" && beginnerDifficulty !== "Advanced",
    bankFishing: waterType !== "Saltwater" || beginnerDifficulty !== "Advanced",
    wheelchairAccessible: beginnerDifficulty === "Easy" && (waterType === "Park" || waterType === "Pier" || waterType === "Lake"),
    bathrooms: beginnerDifficulty === "Easy" || waterType === "Pier",
    camping: ["potholes-reservoir", "banks-lake", "lake-chelan", "deception-pass", "rattlesnake-lake"].includes(id),
    fee: ["rattlesnake-lake", "lake-sammamish", "spanaway-lake", "deception-pass"].includes(id) ? "Parking or day-use fee may apply" : "Usually free or varies by access point",
    photoPlaceholder: `${name} photo placeholder`,
    familyFriendly: beginnerDifficulty === "Easy" && shoreAccessDifficulty === "Easy",
    stocking: makeStocking(id),
    status,
    regulationSummary: `Mock guidance: ${regulationSummary}`,
    suggestedBait,
    recommendedRigs,
    beginnerSetup: `${recommendedRigs[0]} with ${suggestedBait[0]}; verify official rules first.`,
    beginnerDifficulty,
    notes: `${parkingNote} ${regulationSummary}`,
    todayRecommendation,
    youtubeSearch: `${name} fishing beginner ${recommendedRigs[0]}`
  };
}

function makeStocking(id: string): Waterbody["stocking"] {
  const stocked: Record<string, Waterbody["stocking"]> = {
    "green-lake": [{ species: "Rainbow Trout", date: "2026-04-18", count: 3500, source: wdfwSourceNames.stocking }],
    "rattlesnake-lake": [{ species: "Rainbow Trout", date: "2026-04-24", count: 2500, source: wdfwSourceNames.stocking }],
    "pine-lake": [{ species: "Rainbow Trout", date: "2026-04-11", count: 1800, source: wdfwSourceNames.stocking }],
    "beaver-lake": [{ species: "Rainbow Trout", date: "2026-04-09", count: 2200, source: wdfwSourceNames.stocking }],
    "angle-lake": [{ species: "Rainbow Trout", date: "2026-04-15", count: 1600, source: wdfwSourceNames.stocking }],
    "spanaway-lake": [{ species: "Rainbow Trout", date: "2026-04-20", count: 3000, source: wdfwSourceNames.stocking }]
  };
  return stocked[id] ?? [];
}
