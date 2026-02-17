import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

export default function HomeScreen() {
  const { colors } = useTheme();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [verseHistory, setVerseHistory] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const translateX = useSharedValue(0);

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
        setVerses(data);
        const randomVerse = data[Math.floor(Math.random() * data.length)];
        setVerseHistory([randomVerse]);
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
    } catch (error) {
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
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    setVerseHistory([...verseHistory, randomVerse]);
    setCurrentIndex(currentIndex + 1);
  };

  const getPreviousVerse = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (verseHistory.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          No verses found. Add some in Supabase!
        </Text>
      </View>
    );
  }

  const currentVerse = verseHistory[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GestureDetector gesture={panGesture}>
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
          <TouchableOpacity style={styles.heartIcon} onPress={handleSave}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={28}
              color={colors.accent}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[styles.verseText, { color: colors.text }]}>
            "{currentVerse.text}"
          </Text>
          <Text style={[styles.reference, { color: colors.reference }]}>
            {currentVerse.reference}
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 40,
    width: width - 40,
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
  },
  heartIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  divider: {
    width: 1,
    height: 40,
    marginBottom: 30,
  },
  verseText: {
    fontSize: 24,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 36,
    marginBottom: 30,
    fontFamily: "Newsreader_400Regular_Italic",
  },
  reference: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Inter_500Medium",
  },
  errorText: {
    fontSize: 16,
  },
});
