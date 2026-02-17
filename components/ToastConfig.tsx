import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function useToastConfig() {
  const { colors } = useTheme();

  return {
    success: ({ text1 }: { text1?: string }) => (
      <View
        style={[
          styles.toast,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>{text1}</Text>
      </View>
    ),
    error: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <View
        style={[
          styles.toast,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text style={[styles.text, { color: "#e74c3c" }]}>{text1}</Text>
        {text2 && (
          <Text style={[styles.subtext, { color: colors.reference }]}>
            {text2}
          </Text>
        )}
      </View>
    ),
  };
}

const styles = StyleSheet.create({
  toast: {
    width: "90%",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
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
