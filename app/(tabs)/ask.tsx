import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  UIManager,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Autocomplete } from "@/src/components/Autocomplete";
import { colors, radii, spacing } from "@/src/theme";
import { getSuggestions } from "@/src/utils/autocomplete";
import { getDemoSearchHistory, saveRecentSearch } from "@/src/utils/localStore";
import { answerLocalQuestion } from "@/src/utils/recommendations";
import { FollowUp, isTripIntent, mergeFollowUpAnswer, nextFollowUp, ParsedTrip, parseTripText } from "@/src/utils/tripParser";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Message = {
  role: "user" | "assistant";
  text: string;
  route?: string;
};

function buildTripsRoute(parsed: ParsedTrip): string {
  const params = new URLSearchParams();
  if (parsed.activityType) params.set("activityType", parsed.activityType);
  if (parsed.waterbodyId) params.set("waterbodyId", parsed.waterbodyId);
  if (parsed.targetFishId) params.set("targetFishId", parsed.targetFishId);
  if (parsed.targetShellfishId) params.set("targetShellfishId", parsed.targetShellfishId);
  if (parsed.shellfishLocationId) params.set("shellfishLocationId", parsed.shellfishLocationId);
  const query = params.toString();
  return query ? `/trips?${query}` : "/trips";
}

function titleCase(slug: string): string {
  return slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

function describeParsed(parsed: ParsedTrip): string {
  const activity = parsed.activityType ? titleCase(parsed.activityType) : "Trip";
  const target = parsed.targetFishId ? titleCase(parsed.targetFishId) : parsed.targetShellfishId ? titleCase(parsed.targetShellfishId) : "your target";
  const location = parsed.waterbodyId
    ? titleCase(parsed.waterbodyId)
    : parsed.shellfishLocationId
      ? titleCase(parsed.shellfishLocationId)
      : parsed.accessType ?? "your spot";
  return `${activity} mission ready: ${target} at ${location}. Open it below to review gear, regulations, and conditions.`;
}

export default function AskScreen() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [pendingParsed, setPendingParsed] = useState<ParsedTrip | null>(null);
  const [pendingFollowUp, setPendingFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    getDemoSearchHistory().then(setRecent);
  }, []);

  const suggestions = useMemo(() => getSuggestions(input), [input]);

  function respondToTripStep(parsed: ParsedTrip) {
    const followUp = nextFollowUp(parsed);
    if (followUp) {
      setPendingParsed(parsed);
      setPendingFollowUp(followUp);
      return { role: "assistant" as const, text: followUp.question };
    }
    setPendingParsed(null);
    setPendingFollowUp(null);
    return { role: "assistant" as const, text: describeParsed(parsed), route: buildTripsRoute(parsed) };
  }

  async function submit(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    let reply: Message;
    if (pendingParsed) {
      reply = respondToTripStep(mergeFollowUpAnswer(pendingParsed, trimmed));
    } else if (isTripIntent(trimmed)) {
      reply = respondToTripStep(parseTripText(trimmed));
    } else {
      reply = { role: "assistant", text: answerLocalQuestion(trimmed) };
    }

    setMessages((current) => [...current, { role: "user", text: trimmed }, reply]);
    setInput("");
    const next = await saveRecentSearch(trimmed);
    setRecent(next);
  }

  function clearConversation() {
    setMessages([]);
    setPendingParsed(null);
    setPendingFollowUp(null);
  }

  const showEmptyState = messages.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <AppText variant="display">ASK</AppText>
            <AppText variant="caption" style={styles.headerSubtitle}>Command console for bait, rigs, knots, and trip building.</AppText>
          </View>
          {messages.length > 0 ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear conversation" style={styles.clearButton} onPress={clearConversation}>
              <Ionicons name="trash-outline" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {showEmptyState ? (
        recent.length > 0 ? (
          <View style={styles.recentWrap}>
            <AppText variant="caption" style={styles.recentLabel}>RECENT</AppText>
            <View style={styles.chipWrap}>
              {recent.slice(0, 6).map((item) => (
                <Pressable key={item} accessibilityRole="button" style={styles.recentChip} onPress={() => submit(item)}>
                  <AppText variant="caption" style={styles.recentChipText}>{item}</AppText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.flex} />
        )
      ) : (
        <FlatList
          style={styles.flex}
          contentContainerStyle={styles.messageContent}
          data={messages}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === "user" ? styles.user : styles.assistant]}>
              <AppText style={item.role === "user" ? styles.userText : undefined}>{item.text}</AppText>
              {item.route ? (
                <Pressable accessibilityRole="button" style={styles.openMissionButton} onPress={() => router.push(item.route as Href)}>
                  <AppText style={styles.openMissionText}>OPEN MISSION</AppText>
                </Pressable>
              ) : null}
            </View>
          )}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        {input.trim().length > 0 ? <Autocomplete items={suggestions} onSelect={(item) => submit(item.label)} /> : null}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={pendingFollowUp ? pendingFollowUp.question : "Ask about bait, rigs, knots, or type a trip..."}
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
            accessibilityLabel="Ask Unskunked"
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" style={styles.sendButton} onPress={() => submit()}>
            <Ionicons name="send" size={20} color={colors.ink} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1
  },
  flex: {
    flex: 1
  },
  header: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  headerSubtitle: {
    color: colors.muted
  },
  clearButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  recentWrap: {
    gap: spacing.sm,
    padding: spacing.md
  },
  recentLabel: {
    color: colors.amber,
    fontWeight: "900",
    letterSpacing: 1
  },
  messageContent: {
    gap: spacing.sm,
    padding: spacing.md
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  recentChip: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  recentChipText: {
    color: colors.forest,
    fontWeight: "800"
  },
  bubble: {
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    gap: spacing.sm,
    maxWidth: "88%",
    padding: spacing.md
  },
  assistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: colors.river,
    borderColor: colors.river
  },
  userText: {
    color: colors.ink
  },
  openMissionButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.pine,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  openMissionText: {
    color: colors.ink,
    fontWeight: "900"
  },
  inputRow: {
    alignItems: "flex-end",
    borderTopColor: colors.line,
    borderTopWidth: 2,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 2,
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderColor: colors.forest,
    borderRadius: radii.md,
    borderWidth: 2,
    height: 48,
    justifyContent: "center",
    width: 48
  }
});
