import { Waterbody } from "@/src/data/types";

const fishRonneby = "https://www.havochvatten.se/";

export const ronnebyWaterbodies: Waterbody[] = [
  rb("ronneby-river-brunnspark", "Ronnebyån vid Brunnsparken", "Ronneby town center", "Ronneby", "River", 56.2108, 15.2733, ["sea-trout", "pike", "perch"], "open", "Easy", "Easy", "Free public parking near Ronneby Brunnspark.", "Family-friendly town-park stretch of the river; verify local fiskekort rules.", ["worms", "small spinners"], ["Bobber rig", "Spinner setup"], "Spring and autumn sea trout runs; perch and pike most of the year.", "Start in the park stretch near the falls for easy bank access and a beginner-friendly first cast."),
  rb("ronneby-river-kallinge", "Ronnebyån vid Kallinge", "Kallinge", "Ronneby", "River", 56.2597, 15.3167, ["sea-trout", "pike", "perch"], "restricted", "Moderate", "Moderate", "Roadside pullouts near Kallinge; limited parking.", "Upstream stretch with seasonal sea trout protections; verify current section rules.", ["flies", "small spoons"], ["Spinner setup"], "Spring and autumn sea trout runs.", "Verify whether this stretch is currently open or catch-and-release before targeting sea trout."),
  rb("ljungasjon", "Ljungasjön", "North of Ronneby", "Ronneby", "Lake", 56.2761, 15.2264, ["pike", "perch", "zander"], "open", "Easy", "Easy", "Small lakeside parking area; local fiskekort may be required.", "Local fishing-permit-area (fiskevårdsområde) rules apply; verify before fishing.", ["worms", "spoons"], ["Spinner setup", "Jig"], "Spring pike; summer perch; low-light zander.", "Fish the reed edges early morning for pike and perch."),
  rb("vabysjon", "Väbysjön", "West of Ronneby", "Ronneby", "Lake", 56.235, 15.21, ["pike", "perch"], "open", "Easy", "Easy", "Small local access point; parking is limited.", "Local fishing-permit-area rules apply; verify before fishing.", ["worms", "small spinners"], ["Bobber rig", "Spinner setup"], "Spring through autumn.", "A quiet, easy lake for a relaxed beginner outing."),
  rb("ronneby-skargard-karon", "Ronneby Skärgård (Karön)", "Ronneby archipelago", "Ronneby", "Saltwater", 56.1889, 15.3417, ["baltic-cod", "herring", "sea-trout", "pike"], "restricted", "Moderate", "Moderate", "Small boat launch near Karön; limited parking.", "Baltic coastal rules apply; some species have national closed seasons.", ["small bait pieces", "spoons"], ["Jig", "Spinner setup"], "Spring archipelago pike; summer herring; cod highly restricted.", "Target spring pike in shallow archipelago bays before trying open-water species."),
  rb("saxemara-coast", "Saxemara Kust", "Saxemara", "Ronneby", "Saltwater", 56.1494, 15.2069, ["herring", "sea-trout", "pike"], "open", "Easy", "Easy", "Small coastal parking area near the village.", "Baltic coastal handredskap rules apply broadly; verify species-specific limits.", ["small bait pieces", "spoons"], ["Bobber rig", "Spinner setup"], "Spring pike; summer herring.", "An easy, low-key coastal spot for a first Baltic shore-fishing trip."),
  rb("listerby-archipelago", "Listerby Skärgård", "Listerby", "Ronneby", "Saltwater", 56.1889, 15.65, ["baltic-cod", "herring", "pike"], "restricted", "Moderate", "Moderate", "Small harbor and launch points near Listerby.", "Baltic coastal and national species rules apply; verify before keeping fish.", ["cut bait", "spoons"], ["Jig", "Spinner setup"], "Spring pike; summer herring; cod highly restricted.", "Explore the sheltered inner archipelago first before venturing to open water."),
  rb("ronneby-marina", "Ronneby Hamn (Marina)", "Ronneby town", "Ronneby", "Pier", 56.2011, 15.2822, ["herring", "baltic-cod"], "open", "Easy", "Easy", "Public marina parking near the town center.", "Harbor fishing is broadly open; verify species-specific national rules.", ["small bait pieces"], ["Bobber rig"], "Spring and autumn herring runs.", "A simple, easy first stop for harbor and jetty fishing right in town."),
  rb("blekinge-archipelago-pike", "Blekinge Skärgård Pike Grounds", "Outer Ronneby archipelago", "Ronneby", "Saltwater", 56.16, 15.4, ["pike", "perch", "sea-trout"], "restricted", "Advanced", "Moderate", "Boat access only; nearest public launch is in Ronneby harbor.", "Brackish archipelago pike fishing is popular but boat-access and weather dependent.", ["spoons", "large spinners"], ["Spinner setup"], "Spring is the signature season for archipelago pike.", "Plan around a calm spring day and consider a local guide for a first archipelago pike trip.")
];

function rb(
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
    waterbodyId: `HAV-SE-${id.toUpperCase().replaceAll("-", "_")}`,
    name,
    regionId: "ronneby",
    region,
    county,
    city: region,
    source: "Havs- och vattenmyndigheten (HaV); local fiskevårdsområde guidance",
    lastUpdated: "May 2026",
    regulationReference: "Verify current HaV national rules and local fiskevårdsområde/fiskekort rules before fishing.",
    boatLaunchReference: "Verify launch access locally; many archipelago spots are boat-access only.",
    waterType,
    latitude,
    longitude,
    speciesIds,
    shoreAccessDifficulty,
    parkingNote,
    bestSeason,
    officialLink: fishRonneby,
    boatLaunch: waterType === "Lake" || waterType === "Saltwater",
    kayakFriendly: waterType !== "Pier" && beginnerDifficulty !== "Advanced",
    bankFishing: waterType !== "Saltwater" || beginnerDifficulty !== "Advanced",
    wheelchairAccessible: beginnerDifficulty === "Easy" && (waterType === "Pier" || waterType === "River"),
    bathrooms: beginnerDifficulty === "Easy",
    camping: false,
    fee: "Usually free with public access rights (allemansrätten); some lakes require a local fiskekort",
    photoPlaceholder: `${name} photo placeholder`,
    familyFriendly: beginnerDifficulty === "Easy" && shoreAccessDifficulty === "Easy",
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
