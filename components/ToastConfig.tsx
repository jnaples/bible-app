import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const bgDark = require("../assets/images/paper-dark.png");
const bgLight = require("../assets/images/paper-light.png");

export function useToastConfig() {
  const { colors, theme } = useTheme();
  const backgroundImage = theme === "light" ? bgLight : bgDark;

  return {
    success: ({ text1 }: { text1?: string }) => (
      <View style={styles.toastContainer}>
        <View
          style={[
            styles.toast,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <ImageBackground
            source={backgroundImage}
            style={styles.toastBackground}
            resizeMode="cover"
          >
            <Text style={[styles.text, { color: colors.text }]}>{text1}</Text>
          </ImageBackground>
        </View>
      </View>
    ),
    error: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <View style={styles.toastContainer}>
        <View
          style={[
            styles.toast,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <ImageBackground
            source={backgroundImage}
            style={styles.toastBackground}
            resizeMode="cover"
          >
            <Text style={[styles.text, { color: "#e74c3c" }]}>{text1}</Text>
            {text2 && (
              <Text style={[styles.subtext, { color: colors.reference }]}>
                {text2}
              </Text>
            )}
          </ImageBackground>
        </View>
      </View>
    ),
  };
}

const styles = StyleSheet.create({
  toastContainer: {
    shadowColor: "#000",
    backgroundColor: "#000",
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  toast: {
    width: "90%",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  toastBackground: {
    width: "100%",
    padding: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  subtext: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
});
