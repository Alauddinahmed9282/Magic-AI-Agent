import { useConversation } from "@elevenlabs/react-native";
import React from "react";
import { Button, StyleSheet, View } from "react-native";

const SessionScreen = () => {
  const conversation = useConversation({
    onConnect: () => console.log("Connected to conversation"),
    onDisconnect: () => console.log("Disconnected from conversation"),
    onMessage: (message) => console.log("Received message:", message),
    onError: (error) => console.error("Conversation error:", error),
    onModeChange: (mode) => console.log("Conversation mode changed:", mode),
    onStatusChange: (prop) =>
      console.log("Conversation status changed:", prop.status),
    onCanSendFeedbackChange: (prop) =>
      console.log("Can send feedback changed:", prop.canSendFeedback),
    onUnhandledClientToolCall: (params) =>
      console.log("Unhandled client tool call:", params),
  });
  const startconversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          user_name: "user",
          session_title: "user",
          session_description: "test",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View>
      <Button title="Start conversation" onPress={startconversation} />
      <Button
        title="End converssconversationion"
        onPress={endConversation}
        color="#841584"
      />
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({});
