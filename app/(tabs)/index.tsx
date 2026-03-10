import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import VerseCard from "../../components/VerseCard";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

type Verse = {
  id: string;
  reference: string;
  text: string;
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [verseHistory, setVerseHistory] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { isGuest } = useAuth();
  const router = useRouter();

  const translateX = useSharedValue(0);

  useEffect(() => {
    fetchAllVerses();
  }, []);

  useEffect(() => {
    if (verseHistory.length > 0) {
      checkIfSaved();
    }
  }, [currentIndex, verseHistory]);

  useFocusEffect(
    React.useCallback(() => {
      if (verseHistory.length > 0) {
        checkIfSaved();
      }
    }, [currentIndex, verseHistory]),
  );

  const fetchAllVerses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("verses").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setVerses(shuffled);
        setVerseHistory([shuffled[0]]);
      }
    } catch (error) {
      console.error("Error fetching verses:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const currentVerse = verseHistory[currentIndex];
      if (!currentVerse) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("saved_verses")
        .select("id")
        .eq("user_id", user.id)
        .eq("verse_id", currentVerse.id)
        .single();

      setIsSaved(!!data);
    } catch {
      setIsSaved(false);
    }
  };

  const handleSave = async () => {
    if (isGuest) {
      router.replace("/auth");
      return;
    }

    try {
      const currentVerse = verseHistory[currentIndex];
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (isSaved) {
        await supabase
          .from("saved_verses")
          .delete()
          .eq("user_id", user.id)
          .eq("verse_id", currentVerse.id);

        setIsSaved(false);
        Toast.show({
          type: "success",
          text1: "Verse removed from saved",
          position: "top",
          topOffset: 64,
        });
      } else {
        await supabase
          .from("saved_verses")
          .insert({ user_id: user.id, verse_id: currentVerse.id });

        setIsSaved(true);
        Toast.show({
          type: "success",
          text1: "Verse saved to collection",
          position: "top",
          topOffset: 64,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        topOffset: 64,
      });
    }
  };

  const getNextVerse = () => {
    if (verses.length === 0) return;

    const nextIndex = verseHistory.length;

    if (nextIndex >= verses.length) {
      const reshuffled = [...verses].sort(() => Math.random() - 0.5);
      setVerses(reshuffled);
      setVerseHistory([reshuffled[0]]);
      setCurrentIndex(0);
    } else {
      setVerseHistory([...verseHistory, verses[nextIndex]]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getPreviousVerse = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        translateX.value = withSpring(0);
        runOnJS(getNextVerse)();
      } else if (event.translationX > 100 && currentIndex > 0) {
        translateX.value = withSpring(0);
        runOnJS(getPreviousVerse)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (loading) {
    return (
      <BackgroundWrapper style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </BackgroundWrapper>
    );
  }

  if (verseHistory.length === 0) {
    return (
      <BackgroundWrapper style={styles.container}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          No verses found. Add some in Supabase!
        </Text>
      </BackgroundWrapper>
    );
  }

  const currentVerse = verseHistory[currentIndex];

  return (
    <BackgroundWrapper style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <VerseCard
          verse={currentVerse}
          isSaved={isSaved}
          onSave={handleSave}
          animatedStyle={animatedStyle}
        />
      </GestureDetector>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16, // 8pt × 2
  },
  errorText: {
    fontSize: 16, // 8pt × 2
  },
});
