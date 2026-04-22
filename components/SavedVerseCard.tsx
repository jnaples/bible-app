import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type SavedVerseCardProps = {
  verse: {
    id: string;
    reference: string;
    verse: string;
  };
  onDelete: () => void;
};

export default function SavedVerseCard({
  verse,
  onDelete,
}: SavedVerseCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.verseCard, { borderBottomColor: colors.cardBorder }]}>
      <View style={styles.cardContent}>
        <View style={styles.verseContent}>
          <Text style={[styles.verseText, { color: colors.text }]}>
            {verse.verse}
          </Text>
          <Text style={[styles.reference, { color: colors.text }]}>
            — {verse.reference}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verseCard: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    paddingBottom: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  verseContent: {
    flex: 1,
    marginRight: 16,
  },
  verseText: {
    fontSize: 20,
    marginBottom: 12,
    lineHeight: 26,
    fontFamily: "AveriaSerifLibre_300Light",
    letterSpacing: -0.5,
  },
  reference: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "EBGaramond_600SemiBold_Italic",
  },
  deleteButton: {
    padding: 8,
  },
});
