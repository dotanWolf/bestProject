import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/SideMenu.styles";
import { useRouter } from "expo-router";
import { removeToken, removeUserId } from "../tokenUtil";
export default function SideMenu({ visible, onClose }) {
  const router = useRouter();
  if (!visible) return null;

  const handleDarkModeToggle = () => {
    // Implement dark mode toggle functionality here
    console.log("Dark mode toggled!");
  }


  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.panel}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            router.push("/(tabs)");
            onClose();
          }}
        >
          <View style={styles.header}>
            <Text style={styles.driveText}>Google Drive</Text>
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
            <Text style={styles.itemText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              router.push("/trash");
              onClose();
            }}
          >
            <Text style={styles.icon}>🗑️</Text>
            <Text style={styles.itemText}>Trash</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.item}
            onPress={async () => {
              await removeToken();
              await removeUserId();
              router.push("/signup");
              onClose();
            }}
          >
            {/* <Text style={styles.icon}>🗑️</Text> */}
            {/* <Text style={styles.itemText}>Log Out</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.item}
            onPress={handleDarkModeToggle}
          >
            <Text style={styles.icon}>🌙</Text>
            <Text style={styles.itemText}>dark mode</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
}
