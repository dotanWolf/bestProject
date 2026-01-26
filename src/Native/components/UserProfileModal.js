import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { removeToken } from "../tokenUtil";

export default function UserProfileModal({ user, visible, onClose }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await removeToken();
    onClose();
    router.replace("/login");
  };

  if (!user) return null;

  const renderAvatar = () => {
    if (user.profileImage && user.profileImage !== "placeholder") {
      const imageSource = user.profileImage.startsWith("data:")
        ? user.profileImage
        : `data:image/png;base64,${user.profileImage}`;

      return (
        <Image
          source={{ uri: imageSource }}
          style={styles.largeAvatarImage}
        />
      );
    }

    return (
      <Text style={styles.largeAvatarText}>
        {user.username?.[0].toUpperCase() || "U"}
      </Text>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          {/* Header with Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#5f6368" />
          </TouchableOpacity>

          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.largeAvatar}>
              {renderAvatar()}
            </View>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          <View style={styles.divider} />

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#3c4043" />
            <Text style={styles.signOutText}>Sign out of your account</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
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
  modalCard: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#34a853",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden", // חובה כדי שהתמונה תהיה עגולה
  },
  largeAvatarImage: {
    width: "100%",
    height: "100%",
  },
  largeAvatarText: {
    fontSize: 32,
    color: "white",
    fontWeight: "500",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202124",
  },
  userEmail: {
    fontSize: 14,
    color: "#5f6368",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#dadce0",
    marginBottom: 15,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 10,
    marginBottom: 20,
  },
  signOutText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#3c4043",
  },
});