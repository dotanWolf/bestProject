import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";

import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu from "../../components/SideMenu";
import UserProfileModal from "../../components/UserProfileModal";
import { getToken, getUserId } from "../../tokenUtil";
import { useTheme } from "../../contexts/ThemeContext";

export default function Main() {
  const rootFolder = {
    name: "root",
    parentId: null,
  };

  const { theme } = useTheme();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const IP = process.env.EXPO_PUBLIC_IP;
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [folder, setFolder] = useState(rootFolder);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // 1. Wrap fetch functions in useCallback to ensure stability across renders
  const fetchFiles = useCallback(async () => {
    const token = await getToken();
    setLoading(true);

    const url = currentFolderId
      ? `http://${IP}:8080/api/files/folders/${currentFolderId}`
      : `http://${IP}:8080/api/files`;

    try {
      // If we are in a sub-folder, just fetch that folder's content
      if (currentFolderId) {
        const response = await fetch(url, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const activeFiles = Array.isArray(data) ? data.filter((f) => !f.isTrashed) : [];
          setEntries(activeFiles);
        }
      } else {
        // If at root, fetch owned AND shared files
        const [ownedResponse, sharedResponse] = await Promise.all([
          fetch(`http://${IP}:8080/api/files`, { headers: { authorization: `Bearer ${token}` } }),
          fetch(`http://${IP}:8080/api/files/permissions`, { headers: { authorization: `Bearer ${token}` } }),
        ]);

        if (ownedResponse.ok && sharedResponse.ok) {
          const ownedData = await ownedResponse.json();
          const sharedData = await sharedResponse.json();
          const allFiles = [...ownedData, ...sharedData].filter((f) => !f.isTrashed);
          
          allFiles.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === "folder" ? -1 : 1;
          });
          setEntries(allFiles);
        }
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, IP]); // Re-create ONLY when currentFolderId changes

  const fetchCurrentFolder = useCallback(async () => {
    const token = await getToken();
    if (!currentFolderId) {
      setFolder(rootFolder);
      return;
    }
    try {
      const response = await fetch(`http://${IP}:8080/api/files/${currentFolderId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFolder(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [currentFolderId, IP]);

  // 2. The Trigger: run these functions whenever they change (which happens when currentFolderId changes)
  useFocusEffect(
    useCallback(() => {
      fetchFiles();
      fetchCurrentFolder();
    }, [fetchFiles, fetchCurrentFolder])
  );

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = await getToken();
        const userId = await getUserId();
        if (token && userId) {
          await fetchUser(token, userId);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    };
    checkAuthAndFetch();
  }, []);

  const fetchUser = async (token, userId) => {
    try {
      const response = await fetch(`http://${IP}:8080/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        router.replace("/signup");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
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

  const handleCreateFolder = async (name) => {
    const token = await getToken();
    try {
      const folderData = {
        name: name,
        type: "folder",
        parentId: currentFolderId, // Use current folder!
        isTrashed: false,
        isStarred: false,
        content: null,
      };

      const response = await fetch(`http://${IP}:8080/api/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(folderData),
      });

      if (response.ok) {
        console.log("✅ Folder created!");
        setIsAddOpen(false);
        fetchFiles(); // Just refresh the list
      } else {
        const err = await response.json();
        console.error("❌ Create error:", err);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          parentId: currentFolderId, // Use current folder!
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
          fetchFiles(); // Refresh list
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentFolderId(folder.parentId);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
    //console.log("is profile visible:", isProfileVisible);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {currentFolderId ? (
        <TopBar
          user={user}
          handleMenuOpen={handleBack}
          text="← Back"
          handlePicturePress={() => setIsProfileVisible(true)}
        />
      ) : (
        <TopBar
          user={user}
          handleMenuOpen={() => setIsMenuOpen(true)}
          handlePicturePress={() => setIsProfileVisible(true)}
        />
      )}

      {currentFolderId && (
        <View style={styles.folderHeader}>
          <Text style={styles.folderTitle} numberOfLines={1}>
            {folder.name}
          </Text>
        </View>
      )}

      <UserProfileModal
        user={user}
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />

      {entries.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "gray" }}>No files found</Text>
        </View>
      ) : (
        <EntryList
          entries={entries}
          handlePress={handlePress}
          refreshFiles={fetchFiles}
          setParentIdInTab={setCurrentFolderId}
        />
      )}

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