import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken, getUserId } from "../tokenUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IP = process.env.EXPO_PUBLIC_IP; // Ensure this is set in your .env

export default function PermissionsModal({ visible, file, onClose }) {
  const [permissions, setPermissions] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("viewer");
  // 1. Get User ID on load
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setCurrentUserId(id);
    };
    fetchUserId();
  }, []);

  // 2. Fetch Permissions when Modal opens
  useEffect(() => {
    if (visible && file) {
      fetchPermissions();
    }
  }, [visible, file]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `http://${IP}:8080/api/files/${file._id}/permissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        setPermissions(await response.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Share File Logic
  const handleShare = async () => {
    if (!email) return;
    try {
      const token = await getToken();

      // A. Find User by Email
      const userRes = await fetch(
        `http://${IP}:8080/api/users/email/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!userRes.ok) {
        Alert.alert("Error", "User not found");
        return;
      }
      const userData = await userRes.json();

      // B. Add Permission
      const res = await fetch(
        `http://${IP}:8080/api/files/${file._id}/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userData.userId,
            role: selectedRole,
            email: email,
          }),
        },
      );

      if (res.ok) {
        setEmail("");
        fetchPermissions(); // Refresh list
        Alert.alert("Success", "User added!");
      } else {
        const err = await res.json();
        Alert.alert("Error", err.error || "Failed to share");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Remove User Logic
  const handleRemove = async (permId) => {
    try {
      const token = await getToken();
      await fetch(
        `http://${IP}:8080/api/files/${file._id}/permissions/${permId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, userid: currentUserId },
        },
      );
      fetchPermissions();
    } catch (e) {
      console.error(e);
    }
  };

  if (!file) return null;
  const isOwner = file.ownerId === currentUserId;
  console.log(currentUserId);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share "{file.name}"</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Add User Section (Only for Owner) */}
          {isOwner && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="User email"
                value={email}
                autoCapitalize="none"
                onChangeText={setEmail}
              />
              {/* Role Toggle (Simple Viewer/Editor toggle) */}
              <TouchableOpacity
                style={styles.roleBtn}
                onPress={() =>
                  setSelectedRole(
                    selectedRole === "viewer" ? "editor" : "viewer",
                  )
                }
              >
                <Text>{selectedRole === "viewer" ? "👁️" : "✏️"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* List of Users */}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={permissions}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={{ color: "white" }}>
                        {item.email?.[0].toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.userEmail}>
                        {item.email}{" "}
                        {item.userId === currentUserId ? "(You)" : ""}
                      </Text>
                      <Text style={styles.userRole}>{item.role}</Text>
                    </View>
                  </View>

                  {/* Remove Button (Only Owner can remove others) */}
                  {isOwner && item.role !== "owner" && (
                    <TouchableOpacity onPress={() => handleRemove(item._id)}>
                      <Ionicons name="trash-outline" size={20} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  inputContainer: { flexDirection: "row", marginBottom: 20, gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
  },
  roleBtn: {
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  shareBtn: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },
  shareBtnText: { color: "white", fontWeight: "bold" },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
  userEmail: { fontSize: 14, fontWeight: "500" },
  userRole: { fontSize: 12, color: "gray" },
});
