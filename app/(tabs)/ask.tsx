import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen } from "@/src/components/Screen";
import { colors, radii, spacing } from "@/src/theme";
import { answerLocalQuestion } from "@/src/utils/recommendations";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const examples = [
  "I have worms and a spinning rod, what can I catch?",
  "What fish bite in July?",
  "What knot should I use?",
  "Can I fish Lake Washington today?"
];

export default function AskScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask about bait, rigs, knots, or one of the mock Washington waters. I use local demo data only."
    }
  ]);

  function submit(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: answerLocalQuestion(trimmed) }
    ]);
    setInput("");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">Ask Unskunked</AppText>
        <AppText style={styles.heroText}>Rule-based, offline answers from the local fish, rig, and waterbody catalog.</AppText>
      </View>
      <Disclaimer />
      <View style={styles.examples}>
        {examples.map((example) => (
          <Pressable key={example} style={styles.exampleButton} onPress={() => submit(example)}>
            <AppText style={styles.exampleText}>{example}</AppText>
          </Pressable>
        ))}
      </View>

      <Card style={styles.chatCard}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <View key={`${message.role}-${index}`} style={[styles.bubble, message.role === "user" ? styles.user : styles.assistant]}>
              <AppText style={message.role === "user" ? styles.userText : undefined}>{message.text}</AppText>
            </View>
          ))
        ) : (
          <EmptyState icon="chatbubble-ellipses" title="No messages yet" body="Tap an example or ask about bait, rigs, knots, or water." />
        )}
      </Card>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about bait, rigs, knots, or water..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          multiline
        />
        <Pressable style={styles.sendButton} onPress={() => submit()}>
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.deepWater,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg
  },
  heroText: {
    color: colors.mist,
    fontWeight: "700"
  },
  examples: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  exampleButton: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: "48%",
    padding: spacing.md
  },
  exampleText: {
    color: colors.river,
    fontWeight: "800"
  },
  chatCard: {
    backgroundColor: "#fbf6ea",
    gap: spacing.sm
  },
  bubble: {
    borderRadius: radii.md,
    maxWidth: "92%",
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
    flexDirection: "row",
    gap: spacing.sm
  },
  input: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.pine,
    borderRadius: radii.md,
    height: 54,
    justifyContent: "center",
    width: 54
  }
});
