import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/src/theme";

export default function RootLayout() {
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
        <Stack.Screen name="learn" options={{ title: "Learning Center" }} />
        <Stack.Screen name="start" options={{ title: "Start Here" }} />
        <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
      </Stack>
    </>
  );
}
