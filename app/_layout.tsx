import { EBGaramond_500Medium, EBGaramond_600SemiBold_Italic } from "@expo-google-fonts/eb-garamond";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Newsreader_300Light,
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
  Newsreader_500Medium_Italic,
  Newsreader_600SemiBold
} from "@expo-google-fonts/newsreader";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useToastConfig } from "../components/ToastConfig";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
// import { Settings } from 'react-native-fbsdk-next';
// import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';


SplashScreen.preventAutoHideAsync();

function AppContent() {
  const toastConfig = useToastConfig();
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="reset-password" />
      </Stack>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    EBGaramond_500Medium,
    EBGaramond_600SemiBold_Italic,
    Newsreader_300Light,
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_500Medium,
    Newsreader_500Medium_Italic,
    Newsreader_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
  // const initFacebook = async () => {
  //   const { status } = await requestTrackingPermissionsAsync();
  //   Settings.initializeSDK();
  //   if (status === 'granted') {
  //     await Settings.setAdvertiserTrackingEnabled(true);
  //   }
  // };
  // initFacebook();
}, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
