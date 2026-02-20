import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function AccountScreen() {
  const { signOut, deleteAccount, session } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const styles = {
    container: {
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold" as const,
      marginBottom: 30,
      fontFamily: "Newsreader_300Light",
      color: colors.text,
    },
    section: {
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder,
    },
    sectionTitle: {
      fontSize: 14,
      marginBottom: 8,
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      fontFamily: "Inter_400Regular",
      color: colors.reference,
    },
    email: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.text,
    },
    signOutButton: {
      backgroundColor: colors.accent,
      padding: 18,
      borderRadius: 15,
      alignItems: "center" as const,
      marginBottom: 15,
    },
    signOutText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    deleteButton: {
      backgroundColor: "transparent",
      padding: 18,
      borderRadius: 15,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: "#e74c3c",
    },
    deleteButtonText: {
      color: "#e74c3c",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.email}>{session?.user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}
