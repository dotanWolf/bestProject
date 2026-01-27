import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ✅ Added Icon import
import { getToken, getUserId } from "../tokenUtil";
import Input from "./Input";
import Button from "./Button";
import PermissionsModal from "./PermissionsModal";
import MoveFolderModal from "./MoveFolderModal";
import { useTheme } from "../contexts/ThemeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FileActionMenu({
  file,
  refreshFiles,
  setParentIdInTab,
}) {
  // ✅ 1. Manage visibility internally
  const [visible, setVisible] = useState(false);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [isPermissionMenuOpen, setIsPermissionMenuOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getUserId();
      setCurrentUserId(id);
      if (file) setNewName(file.name);
    };
    if (visible) fetchUser();
  }, [visible, file]);

  if (!file) return null;

  const userRole = file.role ? file.role.toLowerCase() : "";
  const isOwner = file.ownerId === currentUserId || userRole === "owner";
  const isEditor = userRole === "editor";
  const canEdit = isOwner || isEditor;

  // --- Handlers ---

  const onClose = () => {
    setVisible(false);
    setIsRenaming(false); // Reset states
  };

  const handleOpen = () => {
    onClose();
    if (file.type === "folder") {
      setParentIdInTab(file._id);
    } else {
      router.push({
        pathname: "/[id]",
        params: { id: file._id },
      });
    }
  };

  const handleRename = async () => {
    if (!newName || newName === file.name) return;
    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch(`http://${IP}:8080/api/files/${file._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        refreshFiles();
        onClose(); // ✅ Closes properly
      } else {
        const err = await response.json();
        console.error("Rename error response:", err.error);
        Alert.alert("Error", err.error || "Rename failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStarred = async () => {
    onClose();
    try {
      const token = await getToken();
      const isOwnerAction = file.ownerId === currentUserId;
      console.log("Current User ID:", currentUserId);
      console.log("File Owner ID:", file.ownerId);
      console.log("Is Owner Action:", isOwnerAction);
      const url = isOwnerAction
        ? `http://${IP}:8080/api/files/${file._id}`
        : `http://${IP}:8080/api/files/${file._id}/permissions/${file.permissionId}`;

      console.log("Star URL:", url);
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify({ isStarred: !file.isStarred }),
      });

      if (response.ok) {
        console.log("Star/unstar successful");
        refreshFiles();
      } else {
        const err = await response.json();
        console.error("Star failed:", err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    const actionName = isOwner ? "Move to Trash" : "Remove Access";
    Alert.alert("Confirm Action", `Are you sure you want to ${actionName}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: performDelete },
    ]);
  };

  const performDelete = async () => {
    setLoading(true);
    const token = await getToken();

    try {
      const url = isOwner
        ? `http://${IP}:8080/api/files/${file._id}`
        : `http://${IP}:8080/api/files/${file._id}/permissions/${file.permissionId}`;
      console.log("Delete URL:", url);
      const res = await fetch(url, {
        method: isOwner ? "PATCH" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: isOwner ? JSON.stringify({ isTrashed: true }) : null,
      });
      if (!res.ok) {
        const err = await res.json();
        console.log("fsajkjf", err.error)
      }
      refreshFiles();
      onClose();
    } catch (err) {
      Alert.alert("Error", "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix: Move Success closes everything properly
  const onMoveSuccess = () => {
    setIsMoveModalOpen(false); // Close Move Modal
    setVisible(false); // Close Menu Modal
    refreshFiles(); // Refresh list
  };

  return (
    <View>
      {/* ✅ 2. The Trigger Button (Inside the component) */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ padding: 10 }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Easier to click
      >
        <Ionicons name="ellipsis-vertical" size={20} color={theme.icon} />
      </TouchableOpacity>

      {/* Main Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: theme.card }]}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : isRenaming ? (
                <View style={{ width: "100%" }}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    Rename
                  </Text>
                  <Input
                    text="New Name"
                    value={newName}
                    onChangeText={setNewName}
                  />
                  <View style={styles.buttonRow}>
                    <Button
                      title="Cancel"
                      onPress={() => setIsRenaming(false)}
                    />
                    <Button title="Save" onPress={handleRename} />
                  </View>
                </View>
              ) : (
                <View style={{ width: "100%" }}>
                  <Text
                    style={[styles.modalTitle, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {file.name}
                  </Text>

                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={handleOpen}
                    >
                      <Text style={styles.optionIcon}>
                        {file.type === "folder" ? "📂" : "✏️"}
                      </Text>
                      <Text style={[styles.optionText, { color: theme.text }]}>
                        {file.type === "folder"
                          ? "Open"
                          : canEdit
                            ? "View/Edit"
                            : "View"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: theme.border },
                        !canEdit && styles.disabled,
                      ]}
                      onPress={() => canEdit && setIsRenaming(true)}
                      disabled={!canEdit}
                    >
                      <Text style={styles.optionIcon}>📛</Text>
                      <Text style={[styles.optionText, { color: theme.text }]}>
                        Rename
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={handleStarred}
                    >
                      <Text style={styles.optionIcon}>
                        {file.isStarred ? "❌" : "⭐"}
                      </Text>
                      <Text style={[styles.optionText, { color: theme.text }]}>
                        {file.isStarred ? "Unstar" : "Star"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={() => setIsPermissionMenuOpen(true)}
                    >
                      <Text style={styles.optionIcon}>👥</Text>
                      <Text style={[styles.optionText, { color: theme.text }]}>
                        Permissions
                      </Text>
                    </TouchableOpacity>

                    {/* ✅ Move Button */}
                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={() => setIsMoveModalOpen(true)}
                    >
                      <Text style={styles.optionIcon}>➡️</Text>
                      <Text style={[styles.optionText, { color: theme.text }]}>
                        Move
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: "transparent" },
                      ]}
                      onPress={handleDelete}
                    >
                      <Text style={styles.optionIcon}>
                        {isOwner ? "🗑️" : "🚫"}
                      </Text>
                      <Text style={[styles.optionText, { color: "red" }]}>
                        {isOwner ? "Trash" : "Remove Access"}
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </Pressable>

        {/* --- Nested Modals --- */}
        <PermissionsModal
          file={file}
          onClose={() => setIsPermissionMenuOpen(false)}
          visible={isPermissionMenuOpen}
        />

        {/* ✅ Move Modal is rendered inside here */}
        <MoveFolderModal
          visible={isMoveModalOpen}
          file={file}
          onClose={() => setIsMoveModalOpen(false)}
          onMoveSuccess={onMoveSuccess}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalView: {
    width: "85%",
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  scrollView: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    width: "100%",
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});
