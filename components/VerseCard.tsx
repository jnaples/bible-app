import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const bgDark = require("../assets/images/paper-dark.png");
const bgLight = require("../assets/images/paper-light.png");

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
  const { theme, colors } = useTheme();
  const backgroundImage = theme === "light" ? bgLight : bgDark;

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View
        style={[
          styles.cardInner,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.cardBackground}
          resizeMode="cover"
        >
          <View style={styles.cardContent}>
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
          </View>
        </ImageBackground>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    shadowColor: "#000",
    backgroundColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
  },
  cardInner: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardBackground: {
    width: "100%",
  },
  cardContent: {
    padding: 40,
    alignItems: "center",
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
