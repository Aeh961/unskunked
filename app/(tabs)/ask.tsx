import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  UIManager,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors, radii, spacing } from "@/src/theme";
import { getDemoSearchHistory, saveRecentSearch } from "@/src/utils/localStore";
import { answerLocalQuestion } from "@/src/utils/recommendations";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Message = {
  role: "user" | "assistant";
  text: string;
};

const suggestedQuestions = [
  "I have worms and a spinning rod, what can I catch?",
  "What bait should I use for trout?",
  "Can I keep salmon here?",
  "What knot should I tie?",
  "I got skunked, what should I change?",
  "What can beginners fish for near Seattle?"
];

const searchChips = ["Bait", "Rigs", "Knots", "Regulations", "Beginners"];

export default function AskScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    getDemoSearchHistory().then(setRecent);
  }, []);

  const filteredQuestions = useMemo(() => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return suggestedQuestions;
    return suggestedQuestions.filter((question) => question.toLowerCase().includes(trimmed));
  }, [input]);

  async function submit(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: answerLocalQuestion(trimmed) }
    ]);
    setInput("");
    const next = await saveRecentSearch(trimmed);
    setRecent(next);
  }

  const showSuggestions = messages.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <AppText variant="heading">Ask Unskunked</AppText>
            <AppText variant="caption" style={styles.headerSubtitle}>Offline answers from the local fish, rig, and waterbody catalog.</AppText>
          </View>
          {messages.length > 0 ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear conversation" style={styles.clearButton} onPress={() => setMessages([])}>
              <Ionicons name="trash-outline" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {showSuggestions ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.suggestionContent} keyboardShouldPersistTaps="handled">
          <SectionHeader title="Suggested questions" />
          <View style={styles.chipWrap}>
            {filteredQuestions.map((question) => (
              <Pressable key={question} accessibilityRole="button" style={styles.suggestionChip} onPress={() => submit(question)}>
                <AppText style={styles.suggestionText}>{question}</AppText>
              </Pressable>
            ))}
          </View>

          <SectionHeader title="Search by topic" />
          <View style={styles.chipWrap}>
            {searchChips.map((chip) => (
              <Pressable key={chip} accessibilityRole="button" style={styles.topicChip} onPress={() => submit(`What should I know about ${chip.toLowerCase()}?`)}>
                <AppText variant="caption" style={styles.topicText}>{chip}</AppText>
              </Pressable>
            ))}
          </View>

          {recent.length > 0 ? (
            <>
              <SectionHeader title="Recent" />
              <View style={styles.chipWrap}>
                {recent.slice(0, 6).map((item) => (
                  <Pressable key={item} accessibilityRole="button" style={styles.topicChip} onPress={() => submit(item)}>
                    <AppText variant="caption" style={styles.topicText}>{item}</AppText>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>
      ) : (
        <FlatList
          style={styles.flex}
          contentContainerStyle={styles.messageContent}
          data={messages}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === "user" ? styles.user : styles.assistant]}>
              <AppText style={item.role === "user" ? styles.userText : undefined}>{item.text}</AppText>
            </View>
          )}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about bait, rigs, knots, or water..."
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" style={styles.sendButton} onPress={() => submit()}>
            <Ionicons name="send" size={20} color="#fff" />
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
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  suggestionContent: {
    gap: spacing.sm,
    padding: spacing.md
  },
  messageContent: {
    gap: spacing.sm,
    padding: spacing.md
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  suggestionChip: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: "100%",
    padding: spacing.md
  },
  suggestionText: {
    color: colors.river,
    fontWeight: "700"
  },
  topicChip: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  topicText: {
    color: colors.forest,
    fontWeight: "800"
  },
  bubble: {
    borderRadius: radii.lg,
    maxWidth: "88%",
    padding: spacing.md
  },
  assistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.mist
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: colors.river
  },
  userText: {
    color: "#fff"
  },
  inputRow: {
    alignItems: "flex-end",
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  input: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
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
    borderRadius: radii.md,
    height: 48,
    justifyContent: "center",
    width: 48
  }
});
