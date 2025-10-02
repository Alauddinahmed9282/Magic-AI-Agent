import React, { useState } from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

const Button = ({ children, ...props }: PressableProps) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
  button: {
    backgroundColor: "#5e41f7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  buttonPressed: {
    backgroundColor: "blue",
    opacity: 0.8,
  },
});
