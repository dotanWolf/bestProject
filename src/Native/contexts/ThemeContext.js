import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("theme");
      if (saved === "dark") setIsDarkMode(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const theme = isDarkMode
    ? {
        mode: "dark",

        // Backgrounds
        background: "#0f1115",
        surface: "#161a22",
        card: "#1c2230",

        // Text
        textPrimary: "#e6e8ee",
        textSecondary: "#a1a7b3",
        textMuted: "#7a8091",

        // UI
        border: "#2a3042",
        divider: "#22283a",
        icon: "#e6e8ee",

        // Accent
        accent: "#4c8dff",
        danger: "#ff5c5c",
        success: "#4caf50",
      }
    : {
        mode: "light",

        // Backgrounds
        background: "#f5f6fa",
        surface: "#ffffff",
        card: "#ffffff",

        // Text
        textPrimary: "#1f2937",
        textSecondary: "#4b5563",
        textMuted: "#9ca3af",

        // UI
        border: "#e5e7eb",
        divider: "#edf0f4",
        icon: "#374151",

        // Accent
        accent: "#2563eb",
        danger: "#dc2626",
        success: "#16a34a",
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
