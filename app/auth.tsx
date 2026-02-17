import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sacred Armor</Text>
      <Text style={styles.subtitle}>
        Bible versuses to renew your mind and relcaim your life.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1a1d23",
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    marginBottom: 8,
    color: "#E8E6E3",
    fontFamily: "Newsreader_400Regular",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 50,
    color: "#D4A574",
    textTransform: "uppercase",
    letterSpacing: 2,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#2a2d35",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#E8E6E3",
    borderWidth: 1,
    borderColor: "#443A37",
  },
  button: {
    backgroundColor: "#D4A574",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#1a1d23",
    fontSize: 16,
    fontWeight: "700",
  },
  toggleText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});
