import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import Gradient from "../Gradiant";

const SessionScreen = () => {
  const { user } = useUser();
  const [isStarting, setIsStarting] = useState(false);
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
  const startConversation = async () => {
    if (isStarting) return;
    try {
      setIsStarting(true);
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          user_name: user?.username ?? "user",
          session_title: "user",
          session_description: "test",
        },
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsStarting(false);
    }
  };
  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.log("error", error);
    }
  };
  const canStart = conversation.status === "disconnected" && !isStarting;
  const canEnd = conversation.status === "connected";

  return (
    <>
      <Gradient
        position="top"
        isSpeaking={
          conversation.status === "connected" ||
          conversation.status === "connecting"
        }
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Gradient
          position="top"
          isSpeaking={
            conversation.status === "connected" ||
            conversation.status === "connecting"
          }
        />
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Magic Agent</Text>
        {/* <Button title="Start Conversation" onPress={startConversation} />
        <Button
          title="End Conversation"
          onPress={endConversation}
          color="#841584"
        /> */}
        <Button
          onPress={canStart ? startConversation : endConversation}
          disabled={!canStart && !canEnd}
        >
          {isStarting ? "End Conversation" : "Start Conversation"}
        </Button>
      </View>
    </>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({});
