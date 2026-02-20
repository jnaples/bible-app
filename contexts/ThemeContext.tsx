import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    cardBackground: string;
    cardBorder: string;
    text: string;
    reference: string;
    divider: string;
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
    accent: string;
  };
};

const lightColors = {
  background: "#E8E3D6",
  cardBackground: "#F5F1E8",
  cardBorder: "#F6F0E9",
  text: "#1a1a1a",
  reference: "#668059",
  divider: "#D4A574",
  tabBarBackground: "#E8E3D6",
  tabBarActive: "#D4A574",
  tabBarInactive: "#8B7355",
  accent: "#D4A574",
};

const darkColors = {
  background: "#1a1d23",
  cardBackground: "#2a2d35",
  cardBorder: "#443A37",
  text: "#E8E6E3",
  reference: "#DE9D36",
  divider: "#D4A574",
  tabBarBackground: "#1a1d23",
  tabBarActive: "#DE9D36",
  tabBarInactive: "#666",
  accent: "#DE9D36",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
