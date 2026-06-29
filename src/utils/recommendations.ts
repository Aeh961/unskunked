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
    (text.includes("july") || text.includes("summer") ? rigsAndKnots.find((item) => item.id === "drop-shot-rig") : undefined) ??
    (text.includes("worm") ? rigsAndKnots.find((item) => item.id === "bobber-rig" || item.id === "split-shot-rig") : undefined) ??
    (text.includes("powerbait") ? rigsAndKnots.find((item) => item.id === "trout-powerbait-rig") : undefined) ??
    (text.includes("soft plastic") || text.includes("senko") ? rigsAndKnots.find((item) => item.id === "texas-rig") : undefined) ??
    rigsAndKnots.find((item) => text.includes(item.name.toLowerCase().replace(" rig", ""))) ??
    rigsAndKnots.find((item) => item.worksFor.some((fish) => text.includes(fish.toLowerCase().split(" ")[0]))) ??
    rigsAndKnots.find((item) => item.id === "bobber-rig") ??
    rigsAndKnots[0]
  );
}

export function answerLocalQuestion(question: string) {
  const text = question.toLowerCase();
  const water = waterbodies.find((item) => text.includes(item.name.toLowerCase()));
  const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].find((item) =>
    text.includes(item)
  );

  if (water) {
    const names = water.speciesIds
      .map((id) => fishSpecies.find((fish) => fish.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    return `${water.name}: target ${names}. Today's local-data pick: ${water.todayRecommendation} Beginner setup: ${water.beginnerSetup} Bait/lures: ${water.suggestedBait.join(", ")}. Regulation note: ${water.regulationSummary}`;
  }

  if (month) {
    const seasonal = fishSpecies
      .filter((fish) => fish.bestSeason.toLowerCase().includes(month) || fish.bestSeason.toLowerCase().includes("summer") || fish.bestSeason.toLowerCase().includes("spring"))
      .slice(0, 4);
    return `${month[0].toUpperCase()}${month.slice(1)} plan: start with ${seasonal.map((fish) => fish.name).join(", ")}. Fish early or late, look for shade or deeper edges, and bring worms plus one simple lure like a spinner or jig.`;
  }

  if (text.includes("knot")) {
    const knot = rigsAndKnots.find((item) => item.type === "knot" && text.includes(item.name.toLowerCase().split(" ")[0]));
    const pick = knot ?? rigsAndKnots.find((item) => item.id === "palomar-knot");
    return `${pick?.name}: ${pick?.beginnerExplanation} First steps: ${pick?.steps.slice(0, 3).join(" ")} Wet the knot before tightening.`;
  }

  if (text.includes("rig") || text.includes("setup")) {
    const rig = findBestRig(question);
    return `${rig.name}: ${rig.beginnerExplanation} Best for: ${rig.worksFor.join(", ")}. Start with: ${rig.steps.slice(0, 3).join(" ")}`;
  }

  if (text.includes("what should i use") || text.includes("only have") || text.includes("i have")) {
    const rig = findBestRig(question);
    const fish = recommendSpeciesFromGear(question).slice(0, 3);
    return `Use what you have: try a ${rig.name.toLowerCase()} and target ${fish.map((item) => item.name).join(", ")}. Keep hooks small, cast near cover or shade, and move after 15-20 quiet minutes without bites.`;
  }

  const recommendations = recommendSpeciesFromGear(question)
    .slice(0, 3)
    .map((fish) => fish.name)
    .join(", ");

  return `Based on that, start with: ${recommendations}. Keep it simple, use small hooks, and check official regulations first.`;
}
