import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved preference on startup
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme === "dark") setIsDarkMode(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      AsyncStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Define your colors here
  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#000000",
    subText: isDarkMode ? "#aaaaaa" : "#5f6368",
    card: isDarkMode ? "#1e1e1e" : "#f8f9fa",
    border: isDarkMode ? "#333333" : "#e0e0e0",
    icon: isDarkMode ? "#ffffff" : "#5f6368",
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);