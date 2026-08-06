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
  rb("ronneby-marina", "Ronneby Hamn (Marina)", "Ronneby town", "Ronneby", "Pier", 56.2011, 15.2822, ["herring", "baltic-cod"], "restricted", "Easy", "Easy", "Public marina parking near the town center.", "Havs- och vattenmyndigheten pike protection area: fishing is prohibited in Ronneby harbor from 15 September to 31 May; open outside that window.", ["small bait pieces"], ["Bobber rig"], "Open season (1 June - 14 September) for herring; closed the rest of the year for pike protection.", "Check the calendar before you go - the harbor is closed to all fishing outside the summer window.", {
    sourceUrl: "https://www.ronneby.se/uppleva--gora/idrott-motion-och-friluftsliv/friluftsliv-sport-och-motion/fiske.html",
    sourceOrganization: "Havs- och vattenmyndigheten / Ronneby kommun",
    verificationStatus: "imported",
    accessType: "Pier"
  }),
  rb("blekinge-archipelago-pike", "Blekinge Skärgård Pike Grounds", "Outer Ronneby archipelago", "Ronneby", "Saltwater", 56.16, 15.4, ["pike", "perch", "sea-trout"], "restricted", "Advanced", "Moderate", "Boat access only; nearest public launch is in Ronneby harbor.", "Brackish archipelago pike fishing is popular but boat-access and weather dependent.", ["spoons", "large spinners"], ["Spinner setup"], "Spring is the signature season for archipelago pike.", "Plan around a calm spring day and consider a local guide for a first archipelago pike trip."),
  rb("galtsjon", "Galtsjön", "West of Ronneby, near E22", "Ronneby", "Lake", 56.2188, 15.2105, ["rainbow-trout", "pike", "perch"], "open", "Easy", "Easy", "Small roadside lot off E22 a few km west of Ronneby.", "Ronneby kommun put-and-take rainbow trout lake; a local fiskekort (day permit) is required, sold via iFiske.", ["PowerBait", "worms", "small spoons"], ["Trout PowerBait rig", "Bobber rig"], "Stocked spring through autumn for put-and-take rainbow trout.", "Buy a day permit on iFiske first, then fish the stocked areas near the access point with PowerBait.", {
    sourceUrl: "https://www.ronneby.se/uppleva--gora/idrott-motion-och-friluftsliv/friluftsliv-sport-och-motion/fiske/skarsjon-och-galtsjon.html",
    sourceOrganization: "Ronneby kommun",
    verificationStatus: "imported",
    accessType: "Bank"
  }),
  rb("skarsjon", "Skärsjön", "Between Ronneby and Kallinge", "Ronneby", "Lake", 56.2223, 15.2897, ["rainbow-trout", "pike", "perch"], "open", "Easy", "Easy", "Small lot near the lake between Ronneby and Kallinge.", "Ronneby kommun put-and-take rainbow trout lake (max depth ~9.4m); a local fiskekort (day permit) is required, sold via iFiske.", ["PowerBait", "worms", "small spoons"], ["Trout PowerBait rig", "Bobber rig"], "Stocked spring through autumn for put-and-take rainbow trout.", "Buy a day permit on iFiske first, then start near the main bank access with a simple bobber-and-worm setup.", {
    sourceUrl: "https://www.ronneby.se/uppleva--gora/idrott-motion-och-friluftsliv/friluftsliv-sport-och-motion/fiske/skarsjon-och-galtsjon.html",
    sourceOrganization: "Ronneby kommun",
    verificationStatus: "imported",
    accessType: "Bank"
  })
];

type ProvenanceOverrides = {
  sourceUrl?: string;
  sourceOrganization?: string;
  verificationStatus?: NonNullable<Waterbody["verificationStatus"]>;
  accessType?: NonNullable<Waterbody["accessType"]>;
};

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
  todayRecommendation: string,
  provenance: ProvenanceOverrides = {}
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
    lastUpdated: "August 2026",
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
    youtubeSearch: `${name} fishing beginner ${recommendedRigs[0]}`,
    activities: ["fishing"],
    sourceUrl: provenance.sourceUrl ?? fishRonneby,
    sourceOrganization: provenance.sourceOrganization ?? "Havs- och vattenmyndigheten",
    verificationStatus: provenance.verificationStatus ?? "needs-verification",
    accessType: provenance.accessType
  };
}
