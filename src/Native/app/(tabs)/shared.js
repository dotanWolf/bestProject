import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import React, { useCallback } from "react";
import {
  saveToken,
  getToken,
  removeToken,
  saveUserId,
  getUserId,
} from "../../tokenUtil";
import { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu

from "../../components/SideMenu";
export default function Shared() {
  const rootFolder = {
    name: "root",
    parentId: null,
  };
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folder, setFolder] = useState(rootFolder);

  const IP = process.env.EXPO_PUBLIC_IP;

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
      fetchCurrentFolder();
    }, [currentFolderId]),
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
          authorization: `Bearer ${token}`, // Use Capital A and standard Bearer casing
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
    } finally {
    }
  };

  const fetchFiles = async () => {
    const token = await getToken();
    if (!token) return;
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
        console.log(data);
        const activeFiles = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed)
          : [];
        setEntries(activeFiles);
        console.log(activeFiles);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const fetchCurrentFolder = async () => {
    const token = await getToken();
    if (!token) {
      console.log("token doesnt exist");
    }
    // Use parentId from URL
    if (currentFolderId) {
      try {
        const response = await fetch(
          `http://${IP}:8080/api/files/${currentFolderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setFolder(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setFolder(rootFolder);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (!result.canceled) {
        const fileAsset = result.assets[0];
        setLoading(true);

        // 1. Fetch the local URI to get a Blob (standard Web API)
        const response = await fetch(fileAsset.uri);
        const blob = await response.blob();

        // 2. Convert to Base64 (to fit your JSON requirement)
        // We use a Promise with FileReader for the most modern approach
        const base64Content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // reader.result is "data:application/pdf;base64,JVBER..."
            // We split to get only the base64 part
            const base64 = reader.result.split(",")[1];
            resolve(base64);
          };
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
          await fetchFiles();
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
      setIsAddOpen(false);
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

  const handleCreateFolder = async (name) => {
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
        // fetchFiles(token);
        router.push("/myDrive");
      } else {
        alert("Creation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {currentFolderId ? (
        <TopBar handleMenuOpen={handleBack} text="← Back" />
      ) : (
        <TopBar handleMenuOpen={() => setIsMenuOpen(true)} />
      )}

      {currentFolderId && (
        <View style={styles.folderHeader}>
          <Text style={styles.folderTitle} numberOfLines={1}>
            {folder.name}
          </Text>
        </View>
      )}

      {entries.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "gray" }}>No files found</Text>
        </View>
      ) : (
        <EntryList
          entries={entries}
          handlePress={handlePress}
          refreshFiles={fetchFiles}
          setParentIdInTab={(id) => {
            setCurrentFolderId(id);
          }}
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
