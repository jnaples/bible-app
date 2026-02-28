import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const bgDark = require("../assets/images/paper-dark.png");
const bgLight = require("../assets/images/paper-light.png");

type SavedVerseCardProps = {
  verse: {
    id: string;
    reference: string;
    text: string;
  };
  onDelete: () => void;
};

export default function SavedVerseCard({
  verse,
  onDelete,
}: SavedVerseCardProps) {
  const { theme, colors } = useTheme();
  const backgroundImage = theme === "light" ? bgLight : bgDark;

  return (
    <View style={styles.verseCard}>
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
            <View style={styles.verseContent}>
              <Text style={[styles.verseText, { color: colors.text }]}>
                "{verse.text}"
              </Text>
              <Text style={[styles.reference, { color: colors.reference }]}>
                {verse.reference}
              </Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verseCard: {
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  verseContent: {
    flex: 1,
    marginRight: 16,
  },
  verseText: {
    fontSize: 20,
    marginBottom: 8,
    lineHeight: 28,
    fontFamily: "Newsreader_400Regular_Italic",
  },
  reference: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Inter_500Medium",
  },
  deleteButton: {
    padding: 8,
  },
});
