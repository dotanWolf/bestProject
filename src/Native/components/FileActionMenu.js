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
  ScrollView, // Added ScrollView
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getToken, getUserId } from "../tokenUtil";
import Input from "./Input";
import Button from "./Button";
import PermissionsModal from "./PermissionsModal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FileActionMenu({
  visible,
  onClose,
  file,
  refreshFiles,
  setParentIdInTab,
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isPermissionMenuOpen, setIsPermissionMenuOpen] = useState(false);
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;

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

  const handleOpen = () => {
    onClose();
    if (file.type === "folder") {
      setParentIdInTab(file.id);
    } else {
      router.push({
        pathname: "/[id]",
        params: { id: file.id },
      });
    }
  };

  const handleRename = async () => {
    if (!newName || newName === file.name) return;
    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch(`http://${IP}:8080/api/files/${file.id}`, {
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
        setIsRenaming(false);
        onClose();
      } else {
        Alert.alert("Error", "Could not rename file");
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

      const url = isOwnerAction
        ? `http://${IP}:8080/api/files/${file.id}`
        : `http://${IP}:8080/api/files/${file.id}/permissions/${file.permissionId}`;

      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify({ isStarred: !file.isStarred }),
      });
      refreshFiles();
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

    const trashFolderRecursively = async (folderId) => {
      try {
        const response = await fetch(
          `http://${IP}:8080/api/files/folders/${folderId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const children = await response.json();
          for (const child of children) {
            if (child.type === "folder") {
              await trashFolderRecursively(child.id);
            }
            await fetch(`http://${IP}:8080/api/files/${child.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
                userid: currentUserId,
              },
              body: JSON.stringify({ isTrashed: true }),
            });
          }
        }
      } catch (err) {
        console.error("Recursion error", err);
      }
    };

    try {
      if (file.type === "folder" && isOwner) {
        await trashFolderRecursively(file.id);
      }

      const url = isOwner
        ? `http://${IP}:8080/api/files/${file.id}`
        : `http://${IP}:8080/api/files/${file.id}/permissions/${file.permissionId}`;

      await fetch(url, {
        method: isOwner ? "PATCH" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: isOwner ? JSON.stringify({ isTrashed: true }) : null,
      });

      refreshFiles();
      onClose();
    } catch (err) {
      Alert.alert("Error", "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : isRenaming ? (
              <View style={{ width: "100%" }}>
                <Text style={styles.modalTitle}>Rename</Text>
                <Input
                  text="New Name"
                  value={newName}
                  onChangeText={setNewName}
                />
                <View style={styles.buttonRow}>
                  <Button title="Cancel" onPress={() => setIsRenaming(false)} />
                  <Button title="Save" onPress={handleRename} />
                </View>
              </View>
            ) : (
              <View style={{ width: "100%" }}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {file.name}
                </Text>

                {/* Wrap options in ScrollView for Android visibility */}
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  <TouchableOpacity style={styles.option} onPress={handleOpen}>
                    <Text style={styles.optionIcon}>
                      {file.type === "folder" ? "📂" : "✏️"}
                    </Text>
                    <Text style={styles.optionText}>
                      {file.type === "folder"
                        ? "Open"
                        : canEdit
                          ? "View/Edit"
                          : "View"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.option, !canEdit && styles.disabled]}
                    onPress={() => canEdit && setIsRenaming(true)}
                    disabled={!canEdit}
                  >
                    <Text style={styles.optionIcon}>📛</Text>
                    <Text style={styles.optionText}>Rename</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.option}
                    onPress={handleStarred}
                  >
                    <Text style={styles.optionIcon}>
                      {file.isStarred ? "❌" : "⭐"}
                    </Text>
                    <Text style={styles.optionText}>
                      {file.isStarred ? "Unstar" : "Star"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setIsPermissionMenuOpen(true)}
                  >
                    <Text style={styles.optionIcon}>👥</Text>
                    <Text style={styles.optionText}>Permissions</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.option}
                    onPress={() =>
                      Alert.alert("Move", "Navigate to Move Screen")
                    }
                  >
                    <Text style={styles.optionIcon}>➡️</Text>
                    <Text style={styles.optionText}>Move</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.option}
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
      <PermissionsModal
        file={file}
        onClose={() => setIsPermissionMenuOpen(false)}
        visible={isPermissionMenuOpen}
      ></PermissionsModal>
    </Modal>
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
    maxHeight: SCREEN_HEIGHT * 0.7, // Ensure it doesn't exceed 70% of screen height
    backgroundColor: "white",
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
    paddingVertical: 15, // Slightly larger touch targets
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
