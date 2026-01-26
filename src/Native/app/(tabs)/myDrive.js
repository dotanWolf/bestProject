import React, { useCallback, useEffect, useState } from "react"; // Added useState
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { styles } from "../../styles/myDrive.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu from "../../components/SideMenu";
import PermissionsModal from "../../components/PermissionsModal";
import { useFolderView } from "../../hooks/useFolderView";
import { useFiles } from "../../contexts/FilesContext";
import { getToken } from "../../tokenUtil";
import { useFocusEffect } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import UserProfileModal from "../../components/UserProfileModal"; // ✅ Added Import
import { useUser } from "../../contexts/UserContext"; // ✅ Added Import

export default function Main() {
  const rootFolder = {
    name: "root",
    parentId: null,
  };
  const router = useRouter();
  
  const { user } = useUser(); 
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const IP = process.env.EXPO_PUBLIC_IP;
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folder, setFolder] = useState(rootFolder);
  
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
      fetchCurrentFolder();
    }, [currentFolderId])
  );

  const fetchFiles = async () => {
    let token = await getToken();

    if (!token) {
      console.log("token doesnt exist");
    }

    console.log("🔄 Refreshing all files from server...");
    setLoading(true);

    const url = currentFolderId
      ? `http://${IP}:8080/api/files/folders/${currentFolderId}`
      : `http://${IP}:8080/api/files`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const activeFiles = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed)
          : [];
        setEntries(activeFiles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrentFolder = async () => {
    const token = await getToken();
    if (!currentFolderId) {
      setFolder(rootFolder);
      return;
    }

    try {
      const response = await fetch(`http://${IP}:8080/api/files/${currentFolderId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFolder(data); // This provides the parentId for the Back button
      }
    } catch (error) {
      console.error("Fetch Folder error:", error);
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
    if (!token) {
      console.log("token doesnt exist");
    }

    console.log(`📂 Creating "${name}" inside ROOT}`);

    try {
      const folder = {
        name: name,
        type: "folder",
        parentId: currentFolderId,
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
        await fetchFiles();
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

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Update TopBar to pass User and Handle Press */}
      {currentFolderId ? (
        <TopBar
          user={user}
          handleMenuOpen={handleBack}
          text="← Back"
          handlePicturePress={() => setIsProfileVisible(true)}
          isPictureVisible={true}
        />
      ) : (
        <TopBar
          user={user}
          handleMenuOpen={() => setIsMenuOpen(true)}
          handlePicturePress={() => setIsProfileVisible(true)}
          isPictureVisible={true}
        />
      )}
      
      {/* ✅ 4. Add UserProfileModal */}
      <UserProfileModal
        user={user}
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />

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
          // handleDelete={handleDelete}
          // handleRename={handleRename}
          // handleStar={handleStar}
          // handleDetails={handleOpenPermissions}
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

      {/* <PermissionsModal
        visible={showPermissions}
        file={selectedFile}
        onClose={() => setShowPermissions(false)}
      /> */}
    </View>
  );
}