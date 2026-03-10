import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import SavedVerseCard from "../../components/SavedVerseCard";
import { useAuth } from "../../contexts/AuthContext";
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
  const { isGuest } = useAuth();
  const router = useRouter();

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
      setSavedVerses(
        (data || []).map((item) => ({
          ...item,
          verse: Array.isArray(item.verse) ? item.verse[0] : item.verse,
        })),
      );
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
      Toast.show({
        type: "success",
        text1: "Verse deleted",
        position: "top",
        topOffset: 64,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const renderVerse = ({ item }: { item: SavedVerse }) => (
    <SavedVerseCard verse={item.verse} onDelete={() => handleDelete(item.id)} />
  );

  if (loading) {
    return (
      <BackgroundWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </BackgroundWrapper>
    );
  }

  if (isGuest) {
    return (
      <BackgroundWrapper style={styles.container}>
        <Text style={[styles.header, { color: colors.text }]}>
          Saved Verses
        </Text>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color={colors.tabBarInactive}
          />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Sign in to save verses
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text }]}>
            Create an account to build your collection
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/auth")}
            style={{
              marginTop: 24,
              padding: 14,
              backgroundColor: colors.accent,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: colors.background,
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
              }}
            >
              Sign In / Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper style={styles.container}>
      <Text style={[styles.header, { color: colors.text }]}>Saved Verses</Text>

      {savedVerses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color={colors.tabBarInactive}
          />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No saved verses yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.reference }]}>
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
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Newsreader_300Light",
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 32,
    marginTop: 20,
    marginBottom: 12,
    fontFamily: "Newsreader_400Regular",
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    lineHeight: 22,
  },
});
