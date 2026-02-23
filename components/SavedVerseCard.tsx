import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.verseCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
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
  );
}

const styles = StyleSheet.create({
  verseCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
