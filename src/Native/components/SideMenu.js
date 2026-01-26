import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/SideMenu.styles";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext"; // 1. Import Hook

export default function SideMenu({ visible, onClose }) {
  const router = useRouter();
  
  // 2. Get theme data
  const { isDarkMode, toggleTheme, theme } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={onClose} />
      
      {/* 3. Apply dynamic background color */}
      <View style={[styles.panel, { backgroundColor: theme.background }]}>
        
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            router.push("/(tabs)");
            onClose();
          }}
        >
          <View style={styles.header}>
            {/* 4. Apply dynamic text color */}
            <Text style={[styles.driveText, { color: theme.textPrimary }]}>Google Drive</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              router.push("/recents");
              onClose();
            }}
          >
            <Text style={styles.icon}>📄</Text>
            <Text style={[styles.itemText, { color: theme.textSecondary }]}>Recent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              router.push("/trash");
              onClose();
            }}
          >
            <Text style={styles.icon}>🗑️</Text>
            <Text style={[styles.itemText, { color: theme.textSecondary }]}>Trash</Text>
          </TouchableOpacity>

          {/* DARK MODE TOGGLE */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              console.log("is dark mode:", isDarkMode);
              toggleTheme();
            }} // 5. Connect function
          >
            <Text style={styles.icon}>{isDarkMode ? "☀️" : "🌙"}</Text>
            <Text style={[styles.itemText, { color: theme.textSecondary }]}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
        </View>
      </View>
    </View>
  );
}