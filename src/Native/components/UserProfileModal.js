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
              <Text style={styles.largeAvatarText}>
                {user.username?.[0].toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Storage Section (Google Drive Style)
          <View style={styles.storageSection}>
            <View style={styles.storageHeader}>
              <Ionicons name="cloud-outline" size={20} color="#5f6368" />
              <Text style={styles.storageTitle}>Storage</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "45%" }]} />
            </View>
            <Text style={styles.storageText}>1.2 GB of 15 GB used</Text>
          </View> */}

          <View style={styles.divider} />

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#3c4043" />
            <Text style={styles.signOutText}>Sign out of your account</Text>
          </TouchableOpacity>

          {/* Footer Links */}
          {/* <View style={styles.footer}>
            <Text style={styles.footerText}>
              Privacy Policy • Terms of Service
            </Text>
          </View> */}
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
  storageSection: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 20,
  },
  storageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  storageTitle: {
    marginLeft: 10,
    fontSize: 14,
    color: "#3c4043",
    fontWeight: "500",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#dadce0",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1a73e8",
    borderRadius: 4,
  },
  storageText: {
    fontSize: 12,
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
  footer: {
    flexDirection: "row",
  },
  footerText: {
    fontSize: 11,
    color: "#5f6368",
  },
});
