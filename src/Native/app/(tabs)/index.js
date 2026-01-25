import React, { useCallback, useEffect } from "react"; // 1. חובה לייבא useCallback
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // 2. חובה לייבא useFocusEffect
import { useState } from "react";
import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu from "../../components/SideMenu";
import PermissionsModal from "../../components/PermissionsModal";
import { useFolderView } from "../../hooks/useFolderView";
import { useFiles } from "../../contexts/FilesContext";
import { getToken, getUserId } from "../../tokenUtil";
import UserProfileModal from "../../components/UserProfileModal";

export default function Main() {
  const rootFolder = {
    name: "root",
    parentId: null,
  };

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
    try {
      const [ownedResponse, sharedResponse] = await Promise.all([
        fetch(`http://${IP}:8080/api/files`, {
          headers: { authorization: `Bearer ${token}` },
        }),
        fetch(`http://${IP}:8080/api/files/permissions`, {
          headers: { authorization: `Bearer ${token}` },
        }),
      ]);

      if (ownedResponse.ok && sharedResponse.ok) {
        const ownedData = await ownedResponse.json();
        const sharedData = await sharedResponse.json();

        const allFiles = [...ownedData, ...sharedData].filter(
          (f) => !f.isTrashed,
        );

        allFiles.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "folder" ? -1 : 1;
        });

        setEntries(allFiles);
      }
    } catch (error) {
      console.error("Error fetching home files:", error);
    }
  };

  const handleCreateFolder = async (name) => {
    const token = await getToken();
    if (!token) {
      console.log("token doesnt exist");
    }

    console.log(`📂 Creating "${name}" inside ROOT}`);

    try {
      const folder = {
        name: name,
        type: "folder",
        parentId: null,
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
        body: JSON.stringify(folder),
      });

      if (response.ok) {
        console.log("✅ Folder created!");
        // await fetchFiles();
        router.push("/myDrive");
      } else {
        const err = await response.json();
        console.error("❌ Create error:", err);
      }
    } catch (error) {
      console.error(error);
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
          router.push("/myDrive");
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

  console.log("is profile visible:", isProfileVisible);

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {currentFolderId ? (
        <TopBar
          handleMenuOpen={handleBack}
          text="← Back"
          handlePicturePress={() => setIsProfileVisible(true)}
        />
      ) : (
        <TopBar
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
      {!currentFolderId && (
        <Button
          title="+"
          style={styles.addbutton}
          onPress={() => setIsAddOpen(true)}
        />
      )}

      <AddMenu
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleFileUpload}
      />
    </View>
  );
}
