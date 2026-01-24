import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TrashEntry({ entry, onRestore, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 24, marginRight: 10 }}>
          {entry.type === "folder" ? "📁" : "📄"}
        </Text>
        <Text style={{ fontSize: 16, flex: 1 }}>{entry.name}</Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity 
          style={[styles.button, styles.restoreButton]} 
          onPress={onRestore}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.buttonText}>Restore</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { marginLeft: 10 }]} 
          onPress={onDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restoreButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
});