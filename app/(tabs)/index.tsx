import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");

type Verse = {
  id: string;
  reference: string;
  text: string;
};

const bgDark = require("../../assets/images/bg-dark.png");
const bgLight = require("../../assets/images/bg-light.png");

export default function HomeScreen() {
  const { colors, theme } = useTheme();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [verseHistory, setVerseHistory] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const translateX = useSharedValue(0);
  const backgroundImage = theme === "light" ? bgLight : bgDark;

  const styles = {
    container: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      padding: 20,
    },
    card: {
      borderRadius: 20,
      padding: 40,
      width: width - 40,
      alignItems: "center" as const,
      position: "relative" as const,
      borderWidth: 1,
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    heartIcon: {
      position: "absolute" as const,
      top: 20,
      right: 20,
      zIndex: 10,
    },
    divider: {
      width: 2,
      height: 40,
      marginBottom: 24,
    },
    verseText: {
      fontSize: 24,
      textAlign: "center" as const,
      fontStyle: "italic" as const,
      lineHeight: 32,
      marginBottom: 24,
      fontFamily: "Newsreader_400Regular_Italic",
      color: colors.text,
    },
    reference: {
      fontSize: 14,
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      fontFamily: "Inter_500Medium",
      color: colors.reference,
    },
    errorText: {
      fontSize: 16,
      color: colors.text,
    },
  };

  useEffect(() => {
    fetchAllVerses();
  }, []);

  useEffect(() => {
    if (verseHistory.length > 0) {
      checkIfSaved();
    }
  }, [currentIndex, verseHistory]);

  const fetchAllVerses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("verses").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        // Shuffle the verses array
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
          topOffset: 60,
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
          topOffset: 60,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        topOffset: 60,
      });
    }
  };

  const getNextVerse = () => {
    if (verses.length === 0) return;

    // Get the next verse in the shuffled order
    const nextIndex = verseHistory.length;

    // If we've seen all verses, reshuffle and start over
    if (nextIndex >= verses.length) {
      const reshuffled = [...verses].sort(() => Math.random() - 0.5);
      setVerses(reshuffled);
      setVerseHistory([reshuffled[0]]);
      setCurrentIndex(0);
    } else {
      // Get next verse in order
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
      <ImageBackground source={backgroundImage} style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </ImageBackground>
    );
  }

  if (verseHistory.length === 0) {
    return (
      <ImageBackground source={backgroundImage} style={styles.container}>
        <Text style={styles.errorText}>
          No verses found. Add some in Supabase!
        </Text>
      </ImageBackground>
    );
  }

  const currentVerse = verseHistory[currentIndex];

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <TouchableOpacity style={styles.heartIcon} onPress={handleSave}>
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
          <Text style={styles.verseText}>"{currentVerse.text}"</Text>
          <Text style={styles.reference}>{currentVerse.reference}</Text>
        </Animated.View>
      </GestureDetector>
    </ImageBackground>
  );
}
