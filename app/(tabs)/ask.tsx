import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { Card } from "@/src/components/Card";
import { Disclaimer } from "@/src/components/Disclaimer";
import { EmptyState } from "@/src/components/EmptyState";
import { Screen } from "@/src/components/Screen";
import { colors, spacing } from "@/src/theme";
import { answerLocalQuestion } from "@/src/utils/recommendations";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const examples = [
  "I have worms and a spinning rod, what can I catch?",
  "What rig should I use for trout?",
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
      <AppText variant="title">Ask Unskunked</AppText>
      <AppText>Ask about the local mock catalog. Answers are rule-based, offline, and beginner-focused for the demo.</AppText>
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
  examples: {
    gap: spacing.sm
  },
  exampleButton: {
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md
  },
  exampleText: {
    color: colors.river,
    fontWeight: "800"
  },
  chatCard: {
    gap: spacing.sm
  },
  bubble: {
    borderRadius: 8,
    maxWidth: "92%",
    padding: spacing.sm
  },
  assistant: {
    alignSelf: "flex-start",
    backgroundColor: "#eef6ef"
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
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderRadius: 8,
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
    borderRadius: 8,
    height: 54,
    justifyContent: "center",
    width: 54
  }
});
