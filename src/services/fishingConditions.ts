import { Waterbody } from "@/src/data/types";

export type WeatherSnapshot = {
  airTempF: number;
  windMph: number;
  pressureInHg: number;
  cloudCoverPercent: number;
  rainChancePercent: number;
  uvIndex: number;
};

export type TideSnapshot = {
  current: string;
  high: string;
  low: string;
  movement: "Incoming" | "Outgoing" | "Slack";
};

export type SunWindows = {
  sunrise: string;
  sunset: string;
  morningBite: string;
  eveningBite: string;
  goldenHour: string;
  nightFishing: string;
};

export function getMockWeather(water: Pick<Waterbody, "waterType" | "region">): WeatherSnapshot {
  const marine = water.waterType === "Saltwater" || water.waterType === "Pier";
  return {
    airTempF: marine ? 58 : 64,
    windMph: marine ? 11 : 6,
    pressureInHg: 30.04,
    cloudCoverPercent: marine ? 62 : 48,
    rainChancePercent: marine ? 24 : 16,
    uvIndex: marine ? 4 : 6
  };
}

export function getHourlyWeather(weather: WeatherSnapshot) {
  return ["Now", "+1 hr", "+2 hr", "+3 hr"].map((label, index) => ({
    label,
    airTempF: weather.airTempF + index,
    windMph: Math.max(2, weather.windMph + (index % 2)),
    rainChancePercent: Math.max(0, weather.rainChancePercent - index * 2)
  }));
}

export function getSevenDayWeather(weather: WeatherSnapshot) {
  return ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"].map((label, index) => ({
    label,
    highF: weather.airTempF + 5 + (index % 3),
    lowF: weather.airTempF - 7 + (index % 2),
    rainChancePercent: Math.min(80, weather.rainChancePercent + index * 3)
  }));
}

export function getSunWindows(date = new Date()): SunWindows {
  const month = date.getMonth() + 1;
  const summer = month >= 5 && month <= 8;
  const sunrise = summer ? "5:18 AM" : "7:12 AM";
  const sunset = summer ? "9:08 PM" : "4:42 PM";
  return {
    sunrise,
    sunset,
    morningBite: `${sunrise} - ${summer ? "7:30 AM" : "9:00 AM"}`,
    eveningBite: `${summer ? "7:45 PM" : "3:45 PM"} - ${sunset}`,
    goldenHour: `Around ${sunrise} and before ${sunset}`,
    nightFishing: summer ? "After 10 PM where legal and safe" : "Limited winter night window"
  };
}

export function getTideSnapshot(water: Pick<Waterbody, "waterType">): TideSnapshot | null {
  if (water.waterType !== "Saltwater" && water.waterType !== "Pier") return null;
  return {
    current: "+3.4 ft",
    high: "8:42 AM",
    low: "2:51 PM",
    movement: "Incoming"
  };
}

export function calculateTripScore(input: {
  weather: WeatherSnapshot;
  waterbody: Pick<Waterbody, "waterType" | "beginnerDifficulty" | "bestSeason">;
  userExperience: "Beginner" | "Intermediate" | "Advanced";
  targetSpecies?: string;
  date?: Date;
}) {
  let score = 78;
  if (input.weather.windMph <= 8) score += 8;
  if (input.weather.cloudCoverPercent >= 35 && input.weather.cloudCoverPercent <= 75) score += 5;
  if (input.weather.rainChancePercent > 50) score -= 10;
  if (input.waterbody.beginnerDifficulty === "Easy") score += input.userExperience === "Beginner" ? 7 : 3;
  if (input.waterbody.waterType === "Saltwater" && input.userExperience === "Beginner") score -= 8;
  if (input.targetSpecies?.toLowerCase().includes("trout")) score += 4;
  return Math.max(0, Math.min(100, score));
}
