import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

type VerseCardProps = {
  verse: {
    text: string;
    reference: string;
  };
  animatedStyle: any;
};

export default function VerseCard({ verse, animatedStyle }: VerseCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.textContainer}>
        <Text style={[styles.verseText, { color: colors.text }]}>
          {verse.text}
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
  textContainer: {
    width: "100%",
  },
  verseText: {
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 24,
    fontFamily: "EBGaramond_500Medium",
  },
  reference: {
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "EBGaramond_600SemiBold_Italic",
  },
});
