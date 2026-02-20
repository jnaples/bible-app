import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

type SavedVerse = {
  id: string;
  verse_id: string;
  verse: {
    id: string;
    reference: string;
    text: string;
  };
};

export default function SavedScreen() {
  const { colors } = useTheme();
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      flex: 1,
      paddingTop: 60,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.background,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold" as const,
      paddingHorizontal: 20,
      marginBottom: 20,
      color: colors.text,
      fontFamily: "Newsreader_300Light",
    },
    listContainer: {
      padding: 20,
      paddingTop: 0,
    },
    verseCard: {
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder,
    },
    verseContent: {
      flex: 1,
      marginRight: 15,
    },
    verseText: {
      fontSize: 20,
      marginBottom: 8,
      lineHeight: 28,
      fontFamily: "Newsreader_500Medium_Italic",
      color: colors.text,
    },
    reference: {
      fontSize: 12,
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      fontFamily: "Inter_500Medium",
      color: colors.reference,
    },
    deleteButton: {
      padding: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 20,
      marginTop: 20,
      marginBottom: 10,
      color: colors.text,
    },
    emptySubtext: {
      fontSize: 14,
      textAlign: "center" as const,
      color: colors.reference,
    },
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedVerses();
    }, []),
  );

  const fetchSavedVerses = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_verses")
        .select(`id, verse_id, verse:verses(id, reference, text)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedVerses(data || []);
    } catch (error) {
      console.error("Error fetching saved verses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (savedVerseId: string) => {
    Alert.alert("Delete Verse", "Remove this verse from saved?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteSavedVerse(savedVerseId),
      },
    ]);
  };

  const deleteSavedVerse = async (savedVerseId: string) => {
    try {
      const { error } = await supabase
        .from("saved_verses")
        .delete()
        .eq("id", savedVerseId);

      if (error) throw error;
      setSavedVerses(savedVerses.filter((v) => v.id !== savedVerseId));
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const renderVerse = ({ item }: { item: SavedVerse }) => (
    <View style={styles.verseCard}>
      <View style={styles.verseContent}>
        <Text style={styles.verseText} numberOfLines={2}>
          "{item.verse.text}"
        </Text>
        <Text style={styles.reference}>{item.verse.reference}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Verses</Text>

      {savedVerses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color={colors.tabBarInactive}
          />
          <Text style={styles.emptyText}>No saved verses yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the bookmark icon on verses to save them
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedVerses}
          renderItem={renderVerse}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}
