import { fishSpecies } from "@/src/data/fish";
import { rigsAndKnots } from "@/src/data/rigs";
import { waterbodies } from "@/src/data/waterbodies";

export function recommendSpeciesFromGear(question: string) {
  const text = question.toLowerCase();

  if (text.includes("worm") || text.includes("worms")) {
    return fishSpecies.filter((fish) => fish.bestBait.some((bait) => bait.toLowerCase().includes("worm")));
  }

  if (text.includes("spinner")) {
    return fishSpecies.filter((fish) => fish.bestLures.some((lure) => lure.toLowerCase().includes("spinner")));
  }

  if (text.includes("powerbait") || text.includes("trout")) {
    return fishSpecies.filter((fish) => fish.id === "rainbow-trout");
  }

  if (text.includes("bass")) {
    return fishSpecies.filter((fish) => fish.name.toLowerCase().includes("bass"));
  }

  return fishSpecies.filter((fish) => fish.difficulty === "Easy");
}

export function findBestRig(question: string) {
  const text = question.toLowerCase();
  return (
    rigsAndKnots.find((item) => text.includes(item.name.toLowerCase().replace(" rig", ""))) ??
    rigsAndKnots.find((item) => item.worksFor.some((fish) => text.includes(fish.toLowerCase().split(" ")[0]))) ??
    rigsAndKnots.find((item) => item.id === "bobber-rig") ??
    rigsAndKnots[0]
  );
}

export function answerLocalQuestion(question: string) {
  const text = question.toLowerCase();
  const water = waterbodies.find((item) => text.includes(item.name.toLowerCase()));

  if (water) {
    return `${water.name}: ${water.regulationSummary} Good beginner setup: ${water.beginnerSetup}`;
  }

  if (text.includes("knot")) {
    const knot = rigsAndKnots.find((item) => item.type === "knot" && text.includes(item.name.toLowerCase().split(" ")[0]));
    const pick = knot ?? rigsAndKnots.find((item) => item.id === "palomar-knot");
    return `${pick?.name}: ${pick?.beginnerExplanation} ${pick?.steps.slice(0, 3).join(" ")}`;
  }

  if (text.includes("rig") || text.includes("setup")) {
    const rig = findBestRig(question);
    return `${rig.name}: ${rig.beginnerExplanation} Start with: ${rig.steps.slice(0, 3).join(" ")}`;
  }

  const recommendations = recommendSpeciesFromGear(question)
    .slice(0, 3)
    .map((fish) => fish.name)
    .join(", ");

  return `Based on that, start with: ${recommendations}. Keep it simple, use small hooks, and check official regulations first.`;
}
