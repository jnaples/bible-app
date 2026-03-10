import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { signIn, signUp, resetPassword, continueAsGuest } = useAuth();
  const router = useRouter();

  const darkColors = {
    background: "#191F2F",
    cardBackground: "#1D2230",
    cardBorder: "#443A37",
    text: "#E8E6E3",
    reference: "#DE9D36",
    divider: "#D4A574",
    tabBarBackground: "#0E1419",
    tabBarActive: "#DE9D36",
    tabBarInactive: "#717070",
    accent: "#DE9D36",
  };
  const colors = darkColors;

  const handleAuth = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (isForgotPassword) {
      try {
        await resetPassword(email);
        Alert.alert(
          "Email Sent",
          "Check your email for a password reset link",
          [{ text: "OK", onPress: () => setIsForgotPassword(false) }],
        );
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
      return;
    }

    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert("Success", "Check your email to confirm your account");
      } else {
        await signIn(email, password);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const styles = {
    container: {
      flex: 1,
      justifyContent: "center" as const,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 40,
      textAlign: "center" as const,
      marginBottom: 8,
      color: colors.text,
      fontFamily: "Newsreader_300Light",
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center" as const,
      marginBottom: 24,
      color: colors.accent,
      textTransform: "uppercase" as const,
      letterSpacing: 2,
      fontFamily: "Inter_400Regular",
      lineHeight: 20,
    },
    forgotText: {
      color: colors.text,
      textAlign: "center" as const,
      marginBottom: 20,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
    },
    input: {
      backgroundColor: colors.cardBackground,
      padding: 15,
      borderRadius: 12,
      marginBottom: 24,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      fontFamily: "Inter_400Regular",
    },
    button: {
      backgroundColor: colors.accent,
      padding: 18,
      borderRadius: 12,
      alignItems: "center" as const,
      marginTop: 10,
      marginBottom: 20,
    },
    buttonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "700" as const,
      fontFamily: "Inter_600SemiBold",
    },
    forgotPasswordButton: {
      alignItems: "flex-end" as const,
      marginBottom: 10,
      marginTop: -5,
    },
    forgotPasswordText: {
      color: colors.divider,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
    },
    toggleText: {
      textAlign: "center" as const,
      color: colors.accent,
      fontSize: 14,
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
    },
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-dark.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Sacred Armor</Text>
      <Text style={styles.subtitle}>
        Put on the full armor of God to Protect Your Mind and Soul
      </Text>

      {isForgotPassword ? (
        <>
          <Text style={styles.forgotText}>
            Enter your email and we will send you a reset link
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#656464"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsForgotPassword(false)}
            style={{ alignItems: "center" }}
          >
            <Text style={styles.forgotPasswordText}>Back to Sign In</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#656464"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#656464"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isSignUp && (
            <TouchableOpacity
              onPress={() => setIsForgotPassword(true)}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              continueAsGuest();
              router.replace("/(tabs)");
            }}
            style={{ alignItems: "center", marginTop: 24 }}
          >
            <Text
              style={{
                color: colors.reference,
                fontSize: 14,
                fontFamily: "Inter_400Regular",
              }}
            >
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ImageBackground>
  );
}
