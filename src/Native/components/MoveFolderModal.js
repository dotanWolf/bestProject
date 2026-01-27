import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../tokenUtil";
import { useTheme } from "../contexts/ThemeContext";

export default function MoveFolderModal({ visible, onClose, file, onMoveSuccess }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const IP = process.env.EXPO_PUBLIC_IP;

  useEffect(() => {
    if (visible) {
      fetchFolders();
    }
  }, [visible]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`http://${IP}:8080/api/files/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const validFolders = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed && f.id !== file?.id)
          : [];
        setFolders(validFolders);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (targetParentId) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://${IP}:8080/api/files/${file.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parentId: targetParentId }),
      });

      if (response.ok) {
        Alert.alert("Success", "File moved successfully", [
          {
            text: "OK",
            onPress: () => {
              // ✅ CRITICAL FIX: Close modal FIRST, then refresh list
              onClose(); 
              setTimeout(() => {
                 if (onMoveSuccess) onMoveSuccess();
              }, 300); // Small delay prevents UI freeze
            }
          }
        ]);
      } else {
        const error = await response.json();
        Alert.alert("Error", error.error || "Failed to move");
      }
    } catch (err) {
      Alert.alert("Error", "Network connection failed");
    }
  };

  const renderFolderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.folderItem, { borderBottomColor: theme.border }]}
      onPress={() => handleMove(item.id)}
    >
      <Ionicons name="folder" size={24} color="#5f6368" style={{ marginRight: 15 }} />
      <Text style={[styles.folderName, { color: theme.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Move to...</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.folderItem, { borderBottomColor: theme.border }]}
                onPress={() => handleMove(null)}
              >
                <Ionicons name="home" size={24} color="#007AFF" style={{ marginRight: 15 }} />
                <Text style={[styles.folderName, { color: theme.text, fontWeight: "bold" }]}>
                  My Drive (Root)
                </Text>
              </TouchableOpacity>

              <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={renderFolderItem}
              />
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "60%",
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  folderName: {
    fontSize: 16,
  },
});