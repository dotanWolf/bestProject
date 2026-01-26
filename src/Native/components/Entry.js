import React, { useState } from "react";
import { Text, View, Pressable, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/Entry.styles";
import FileActionMenu from "./FileActionMenu";
import { useTheme } from "../contexts/ThemeContext";

export default function Entry({
  entry,
  handlePress,
  handleDelete,
  handleRename,
  handleStar,
  handleDetails,
  refreshFiles,
  setParentIdInTab
}) {
  const { theme } = useTheme();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  // const showMenu = (e) => {
  //   if (e) {
  //     e.stopPropagation();
  //   }

  //   const options = [
  //     {
  //       text: "Cancel",
  //       style: "cancel",
  //     },
  //     {
  //       text: entry.isStarred ? "Unstar ★" : "Star ☆",
  //       onPress: () => {
  //         console.log("⭐ Star clicked!"); // ✅ הוסף
  //         handleStar && handleStar(entry);
  //       },
  //     },
  //     {
  //       text: "Rename",
  //       onPress: () => {
  //         console.log("✏️ Rename clicked!"); // ✅ הוסף
  //         handleRename && handleRename(entry);
  //       },
  //     },
  //     {
  //       text: "Permissions",
  //       onPress: () => {
  //         console.log("👥 Permissions clicked!"); // ✅ הוסף
  //         handleDetails && handleDetails(entry);
  //       },
  //     },
  //     {
  //       text: "Delete",
  //       style: "destructive",
  //       onPress: () => {
  //         console.log("🗑️ DELETE CLICKED!"); // ✅ הוסף
  //         handleDelete && handleDelete(entry);
  //       },
  //     },
  //   ];

  //   Alert.alert(
  //     entry.name,
  //     `Choose an action`,
  //     options
  //   );
  // };

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.divider,
        },
      ]}
      onPress={() => handlePress?.(entry)}
      onLongPress={() => setIsActionMenuOpen(true)}
      delayLongPress={400}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={{ fontSize: 24 }}>
            {entry.type === "folder" ? "📁" : "📄"}
          </Text>
          <Text style={{ color: theme.textSecondary ,marginLeft: 10, fontSize: 16 }}>{entry.name}</Text>
          {entry.isStarred && (
            <Text style={{ marginLeft: 5, fontSize: 16 }}>⭐</Text>
          )}
        </View>

        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={(e) => {
            e.stopPropagation();
            console.log("🔘 Three dots pressed!");
            setIsActionMenuOpen(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="gray" />
        </TouchableOpacity>

        <FileActionMenu
          setParentIdInTab={setParentIdInTab}
          visible={isActionMenuOpen}
          onClose={() => {
            setIsActionMenuOpen(false);
          }}
          file={entry}
          refreshFiles={refreshFiles}
        ></FileActionMenu>
      </View>
    </Pressable>
  );
}
