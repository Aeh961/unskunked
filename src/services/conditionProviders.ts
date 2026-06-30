import { ActivityLocation, ActivityType, Waterbody, WaterType } from "@/src/data/types";
import { getMockWeather, getTideSnapshot, TideSnapshot, WeatherSnapshot } from "@/src/services/fishingConditions";
import { saveCachedCondition } from "@/src/utils/localStore";

export type ConditionsProvider = {
  name: string;
  getCurrentWeather: (waterbody: ConditionLocation) => Promise<WeatherSnapshot>;
  getTide: (waterbody: ConditionLocation) => Promise<TideSnapshot | null>;
};

export type ConditionLocation = Pick<Waterbody, "waterType" | "region"> | Pick<ActivityLocation, "waterType" | "region">;

function normalizeWaterType(waterbody: ConditionLocation): WaterType {
  return waterbody.waterType === "Beach" || waterbody.waterType === "Marine Area" ? "Saltwater" : waterbody.waterType;
}

export class MockConditionsProvider implements ConditionsProvider {
  name = "Mock offline conditions";

  async getCurrentWeather(waterbody: ConditionLocation) {
    return getMockWeather({ ...waterbody, waterType: normalizeWaterType(waterbody) });
  }

  async getTide(waterbody: ConditionLocation) {
    return getTideSnapshot({ waterType: normalizeWaterType(waterbody) });
  }
}

export class LiveConditionsProvider implements ConditionsProvider {
  name = "Live provider placeholder";

  async getCurrentWeather(waterbody: ConditionLocation) {
    return getMockWeather({ ...waterbody, waterType: normalizeWaterType(waterbody) });
  }

  async getTide(waterbody: ConditionLocation) {
    return getTideSnapshot({ waterType: normalizeWaterType(waterbody) });
  }
}

export const conditionsProvider = new MockConditionsProvider();

export async function cacheConditionsForLocation(input: {
  id: string;
  locationName: string;
  activityType: ActivityType;
  location: ConditionLocation;
  provider?: ConditionsProvider;
}) {
  const provider = input.provider ?? conditionsProvider;
  const weather = await provider.getCurrentWeather(input.location);
  const tide = await provider.getTide(input.location);
  await saveCachedCondition({
    id: input.id,
    locationName: input.locationName,
    activityType: input.activityType,
    updatedAt: new Date().toISOString(),
    weather,
    tide
  });
  return { weather, tide };
}
