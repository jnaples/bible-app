import React from "react";
import { ImageBackground, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type BackgroundWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const bgDark = require("../assets/images/bg-dark.png");
const bgLight = require("../assets/images/paper-bg.webp");

export default function BackgroundWrapper({
  children,
  style,
}: BackgroundWrapperProps) {
  const { theme } = useTheme();
  const backgroundImage = theme === "light" ? bgLight : bgDark;

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
