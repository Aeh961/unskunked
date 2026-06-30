import { fishSpecies } from "@/src/data/fish";
import { learningArticles } from "@/src/data/learning";
import { rigsAndKnots } from "@/src/data/rigs";
import { waterbodies } from "@/src/data/waterbodies";
import { ExperienceLevel, Favorite, TripLog } from "@/src/utils/localStore";
import { calculateTripAnalytics } from "./tripAnalytics";

export type UserProfile = {
  experience: ExperienceLevel;
  preferredStyle: "Shore" | "Boat" | "Dock" | "River" | "Saltwater";
  favoriteFishIds: string[];
  favoriteWaterbodyIds: string[];
  month: string;
};

export type PersonalizedRecommendation = {
  waterbody: string;
  targetSpecies: string;
  baitOrLure: string;
  rig: string;
  knot: string;
  learningContent: string;
  nextBestAction: string;
  reason: string;
};

export class PersonalizationService {
  buildRecommendation(profile: UserProfile, favorites: Favorite[], trips: TripLog[]): PersonalizedRecommendation {
    const analytics = calculateTripAnalytics(trips);
    const favoriteWaterId = profile.favoriteWaterbodyIds[0] ?? favorites.find((item) => item.type === "location")?.id;
    const favoriteFishId = profile.favoriteFishIds[0] ?? favorites.find((item) => item.type === "fish")?.id;
    const water = waterbodies.find((item) => item.id === favoriteWaterId) ?? waterbodies.find((item) => item.beginnerDifficulty === "Easy") ?? waterbodies[0];
    const fish = fishSpecies.find((item) => item.id === favoriteFishId) ?? fishSpecies.find((item) => water.speciesIds.includes(item.id) && item.difficulty !== "Advanced") ?? fishSpecies[0];
    const rig = rigsAndKnots.find((item) => item.type === "rig" && fish.rigs.some((name) => item.name.includes(name.replace(" setup", "")))) ?? rigsAndKnots.find((item) => item.id === "bobber-rig") ?? rigsAndKnots[0];
    const knot = rigsAndKnots.find((item) => item.type === "knot" && fish.knots.includes(item.name)) ?? rigsAndKnots.find((item) => item.id === "improved-clinch-knot") ?? rigsAndKnots[0];
    const learning = learningArticles.find((article) => article.relatedTopics?.some((topic) => fish.name.toLowerCase().includes(topic.toLowerCase()))) ?? learningArticles[0];
    const provenBait = analytics.bestBait[0];

    return {
      waterbody: water.name,
      targetSpecies: fish.name,
      baitOrLure: provenBait ?? fish.bestBait[0] ?? fish.bestLures[0],
      rig: rig.name,
      knot: knot.name,
      learningContent: learning.title,
      nextBestAction: profile.experience === "Beginner" ? "Plan a simple two-hour shore session and save it before you leave." : "Compare your last successful bait with the current waterbody recommendation.",
      reason: `${profile.month} recommendation using ${profile.experience.toLowerCase()} profile, favorites, and ${trips.length} logged trips.`
    };
  }
}

export const personalizationService = new PersonalizationService();
