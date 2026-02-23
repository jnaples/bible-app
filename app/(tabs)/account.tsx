import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function AccountScreen() {
  const { signOut, deleteAccount, session } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/auth");
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This will permanently delete your account and all your saved verses. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace("/auth");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://www.sacredarmor.app/privacy-policy");
  };

  return (
    <BackgroundWrapper style={styles.container}>
      <Text style={[styles.header, { color: colors.text }]}>Settings</Text>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.reference }]}>
          Account
        </Text>
        <Text style={[styles.email, { color: colors.text }]}>
          {session?.user?.email}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.accent }]}
        onPress={handleSignOut}
      >
        <Text style={[styles.signOutText, { color: colors.background }]}>
          Sign Out
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.privacyButton, { borderColor: colors.cardBorder }]}
        onPress={handlePrivacyPolicy}
      >
        <Text style={[styles.privacyButtonText, { color: colors.reference }]}>
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    fontFamily: "Newsreader_300Light",
  },
  section: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Inter_400Regular",
  },
  email: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  signOutButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  deleteButton: {
    backgroundColor: "transparent",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  deleteButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  privacyButton: {
    marginTop: 16,
  },
  privacyButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
