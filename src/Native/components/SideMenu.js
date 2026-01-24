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
export default function SideMenu({ visible, onClose }) {
  const router = useRouter();
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.driveText}>Google Drive</Text>
        </View>
        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.item} onPress={() => {
            router.push("/recents")
            onClose()
          }}>
            <Text style={styles.icon}>📄</Text>
            <Text style={styles.itemText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => {
            router.push("/trash")
            onClose()
          }}>
            <Text style={styles.icon}>🗑️</Text>
            <Text style={styles.itemText}>Trash</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
}
