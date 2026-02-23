import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

type VerseCardProps = {
  verse: {
    text: string;
    reference: string;
  };
  isSaved: boolean;
  onSave: () => void;
  animatedStyle: any;
};

export default function VerseCard({
  verse,
  isSaved,
  onSave,
  animatedStyle,
}: VerseCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      style={[
        styles.card,
        animatedStyle,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <TouchableOpacity style={styles.bookmarkIcon} onPress={onSave}>
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={28}
          color={colors.accent}
        />
      </TouchableOpacity>

      <LinearGradient
        colors={["transparent", colors.accent, "transparent"]}
        style={styles.divider}
      />

      <Text style={[styles.verseText, { color: colors.text }]}>
        "{verse.text}"
      </Text>

      <Text style={[styles.reference, { color: colors.reference }]}>
        {verse.reference}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 40,
    width: width - 40,
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  bookmarkIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  divider: {
    width: 2,
    height: 40,
    marginBottom: 24,
  },
  verseText: {
    fontSize: 24,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 32,
    marginBottom: 24,
    fontFamily: "Newsreader_400Regular_Italic",
  },
  reference: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Inter_500Medium",
  },
});
