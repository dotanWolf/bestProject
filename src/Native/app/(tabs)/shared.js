import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { getToken } from "../../tokenUtil";
import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu from "../../components/SideMenu";
import UserProfileModal from "../../components/UserProfileModal"; // Added for profile click
import { useUser } from "../../contexts/UserContext"; // ✅ 1. Hook for User Data

export default function Shared() {
  const rootFolder = {
    name: "Shared with me",
    parentId: null,
  };

  // ✅ 2. Get user directly from Context
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false); // Added for modal
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folder, setFolder] = useState(rootFolder);

  const IP = process.env.EXPO_PUBLIC_IP;

  // 3. Refresh when folder changes or screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFiles();
      fetchCurrentFolder();
    }, [currentFolderId])
  );

  const fetchFiles = async () => {
    const token = await getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    // Logic: If in root, fetch ALL shared. If in folder, fetch permissions for that folder.
    const url = currentFolderId
      ? `http://${IP}:8080/api/files/permissions/folders/${currentFolderId}`
      : `http://${IP}:8080/api/files/permissions`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out trashed files
        const activeFiles = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed)
          : [];
        setEntries(activeFiles);
      } else {
        // If specific folder fails (e.g. access denied), just clear entries
        setEntries([]);
      }
    } catch (error) {
      console.error("Fetch shared files error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentFolder = async () => {
    const token = await getToken();
    if (currentFolderId) {
      try {
        const response = await fetch(
          `http://${IP}:8080/api/files/${currentFolderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFolder(data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setFolder(rootFolder);
    }
  };

  const handlePress = (file) => {
    if (file.type === "folder") {
      setCurrentFolderId(file.id);
    } else {
      router.push({
        pathname: "/[id]",
        params: { id: file.id },
      });
    }
  };

  const handleBack = () => {
    setCurrentFolderId(folder.parentId);
  };

  // --- UPLOAD & CREATE LOGIC (Standard) ---
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result.canceled) {
        const fileAsset = result.assets[0];
        setLoading(true);

        const response = await fetch(fileAsset.uri);
        const blob = await response.blob();
        
        const base64Content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const token = await getToken();
        const requestBody = {
          name: fileAsset.name,
          type: "file",
          content: base64Content,
          parentId: currentFolderId, 
          isTrashed: false,
          isStarred: false,
        };

        const uploadResponse = await fetch(`http://${IP}:8080/api/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (uploadResponse.ok) {
          Alert.alert("Success", "File uploaded!");
          setIsAddOpen(false);
          fetchFiles();
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (name) => {
    const token = await getToken();
    try {
      const response = await fetch(`http://${IP}:8080/api/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          type: "folder",
          content: "",
          parentId: currentFolderId,
          isTrashed: false,
          isStarred: false,
        }),
      });

      if (response.ok) {
        setIsAddOpen(false);
        fetchFiles();
      } else {
        Alert.alert("Error", "Folder creation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header Logic: Show Back if deep in folder, else Menu */}
      {currentFolderId ? (
        <TopBar
          user={user} // ✅ Passing User Context
          handleMenuOpen={handleBack}
          text="← Back"
          handlePicturePress={() => setIsProfileVisible(true)}
          isPictureVisible={true}
        />
      ) : (
        <TopBar
          user={user} // ✅ Passing User Context
          handleMenuOpen={() => setIsMenuOpen(true)}
          handlePicturePress={() => setIsProfileVisible(true)}
          isPictureVisible={true}
        />
      )}

      {/* Profile Modal */}
      <UserProfileModal
        user={user}
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />

      {/* Folder Name Header */}
      {currentFolderId && (
        <View style={styles.folderHeader}>
          <Text style={styles.folderTitle} numberOfLines={1}>
            {folder.name}
          </Text>
        </View>
      )}

      {/* File List */}
      {entries.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "gray" }}>No shared files found</Text>
        </View>
      ) : (
        <EntryList
          entries={entries}
          handlePress={handlePress}
          refreshFiles={fetchFiles}
          setParentIdInTab={setCurrentFolderId}
        />
      )}

      {/* Add Button & Menu */}
      <Button
        title="+"
        style={styles.addbutton}
        onPress={() => setIsAddOpen(true)}
      />

      <AddMenu
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleFileUpload}
      />
    </View>
  );
}