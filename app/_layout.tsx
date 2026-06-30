import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/src/theme";
import { seedDemoData } from "@/src/utils/localStore";

export default function RootLayout() {
  useEffect(() => {
    if (__DEV__) {
      seedDemoData();
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: "800" }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="fish/[id]" options={{ title: "Fish details" }} />
        <Stack.Screen name="log" options={{ title: "Trip Log" }} />
        <Stack.Screen name="journal" options={{ title: "Fishing Journal" }} />
        <Stack.Screen name="learn" options={{ title: "Learning Center" }} />
        <Stack.Screen name="start" options={{ title: "Start Here" }} />
        <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
        <Stack.Screen name="plan" options={{ title: "Plan Trip" }} />
        <Stack.Screen name="search" options={{ title: "Search" }} />
        <Stack.Screen name="stats" options={{ title: "Fishing Stats" }} />
        <Stack.Screen name="feedback" options={{ title: "Feedback" }} />
        <Stack.Screen name="export" options={{ title: "Export Data" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="insights" options={{ title: "Beta Insights" }} />
        <Stack.Screen name="regulations" options={{ title: "Regulations" }} />
        <Stack.Screen name="weather" options={{ title: "Weather" }} />
        <Stack.Screen name="offline" options={{ title: "Offline Mode" }} />
        <Stack.Screen name="data-sources" options={{ title: "Data Sources" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </>
  );
}
