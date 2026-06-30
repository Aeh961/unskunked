import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { waterbodies } from "@/src/data/waterbodies";
import { calculateTripScore, getHourlyWeather, getMockWeather, getSevenDayWeather, getSunWindows, getTideSnapshot } from "@/src/services/fishingConditions";
import { colors, radii, spacing } from "@/src/theme";

export default function WeatherScreen() {
  const [waterbodyId, setWaterbodyId] = useState("green-lake");
  const water = waterbodies.find((item) => item.id === waterbodyId) ?? waterbodies[0];
  const weather = useMemo(() => getMockWeather(water), [water]);
  const score = calculateTripScore({ weather, waterbody: water, userExperience: "Beginner", targetSpecies: water.speciesIds[0] });
  const sun = getSunWindows();
  const tide = getTideSnapshot(water);

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title" style={styles.lightText}>Fishing Conditions</AppText>
        <AppText style={styles.heroText}>{score} / 100 smart trip score for {water.name}</AppText>
      </View>
      <Card style={styles.card}>
        <SectionHeader title="Choose water" eyebrow="Offline mock weather" />
        <View style={styles.options}>
          {waterbodies.slice(0, 8).map((item) => (
            <Pressable key={item.id} onPress={() => setWaterbodyId(item.id)} style={[styles.option, waterbodyId === item.id && styles.optionActive]}>
              <AppText variant="caption" style={[styles.optionText, waterbodyId === item.id && styles.optionTextActive]}>{item.name}</AppText>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <SectionHeader title="Current" eyebrow="Weather factors" />
        <Stack>
          <AppText>Air temp: {weather.airTempF}F</AppText>
          <AppText>Wind: {weather.windMph} mph</AppText>
          <AppText>Pressure: {weather.pressureInHg} inHg</AppText>
          <AppText>Cloud cover: {weather.cloudCoverPercent}%</AppText>
          <AppText>Rain: {weather.rainChancePercent}%</AppText>
          <AppText>UV: {weather.uvIndex}</AppText>
        </Stack>
      </Card>
      <Card>
        <SectionHeader title="Hourly" eyebrow="Next few hours" />
        <Stack>
          {getHourlyWeather(weather).map((hour) => (
            <AppText key={hour.label}>{hour.label}: {hour.airTempF}F, wind {hour.windMph} mph, rain {hour.rainChancePercent}%</AppText>
          ))}
        </Stack>
      </Card>
      <Card>
        <SectionHeader title="Tomorrow and 7 day" eyebrow="Outlook" />
        <Stack>
          {getSevenDayWeather(weather).map((day) => (
            <AppText key={day.label}>{day.label}: {day.lowF}-{day.highF}F, rain {day.rainChancePercent}%</AppText>
          ))}
        </Stack>
      </Card>
      <Card>
        <SectionHeader title="Sun windows" eyebrow="Bite timing" />
        <Stack>
          <AppText>Sunrise: {sun.sunrise}</AppText>
          <AppText>Sunset: {sun.sunset}</AppText>
          <AppText>Morning bite: {sun.morningBite}</AppText>
          <AppText>Evening bite: {sun.eveningBite}</AppText>
          <AppText>Golden hour: {sun.goldenHour}</AppText>
          <AppText>Night fishing: {sun.nightFishing}</AppText>
        </Stack>
      </Card>
      {tide ? (
        <Card>
          <SectionHeader title="Tide" eyebrow="Saltwater support" />
          <AppText>{tide.movement}: current {tide.current}, high {tide.high}, low {tide.low}</AppText>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.deepWater, borderRadius: radii.md, gap: spacing.sm, padding: spacing.lg },
  lightText: { color: "#fff" },
  heroText: { color: colors.mist, fontWeight: "700" },
  card: { gap: spacing.md },
  options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  option: { backgroundColor: colors.surfaceStrong, borderColor: colors.line, borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  optionActive: { backgroundColor: colors.pine, borderColor: colors.pine },
  optionText: { fontWeight: "900" },
  optionTextActive: { color: "#fff" }
});
