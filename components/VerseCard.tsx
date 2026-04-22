import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

type VerseCardProps = {
  verse: {
    verse: string;
    reference: string;
  };
  isSaved: boolean;
  onSave: () => void;
  animatedStyle: any;
};

export default function VerseCard({ verse, isSaved, onSave, animatedStyle }: VerseCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity style={styles.bookmarkIcon} onPress={onSave}>
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={24}
          color={colors.accent}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.verseText, { color: colors.text }]}>
          {verse.verse}
        </Text>
        <Text style={[styles.reference, { color: colors.text }]}>
          — {verse.reference}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 48,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 10,
  },
  textContainer: {
    width: "100%",
  },
  verseText: {
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 24,
    fontFamily: "AveriaSerifLibre_300Light",
    letterSpacing: -0.5,
  },
  reference: {
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "EBGaramond_600SemiBold_Italic",
  },
});
