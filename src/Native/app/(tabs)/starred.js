import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { getToken, getUserId } from "../../tokenUtil";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // ✅ הוסף
import { styles } from "../../styles/starred.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import SideMenu from "../../components/SideMenu";
import PermissionsModal from "../../components/PermissionsModal";
import { useUser } from "../../contexts/UserContext"; // <--- 1. Import the Hook
import Button from "../../components/Button";
import UserProfileModal from "../../components/UserProfileModal"; // Added for profile click
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "../../contexts/ThemeContext";

export default function Starred() {
  const rootFolder = {
    name: "root",
    parentId: null,
  };
  const { user } = useUser();
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [folder, setFolder] = useState(rootFolder);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const IP = process.env.EXPO_PUBLIC_IP;
  const { theme, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchStarredFiles();
      fetchCurrentFolder();
    }, [currentFolderId]),
  );

  const fetchStarredFiles = async () => {
    const token = await getToken();
    if (!token) return;

    console.log("⭐ Fetching starred files...");
    console.log("Current Folder ID:", currentFolderId);
    const url = currentFolderId
      ? `http://${IP}:8080/api/files/permissions/folders/${currentFolderId}`
      : `http://${IP}:8080/api/files/starred`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const starredFiles = await response.json();
        console.log("✅ Starred files loaded:", starredFiles.length);
        console.log(starredFiles);
        setEntries(starredFiles);
      } else {
        const error  = await response.json();
        console.log(error.error)
      }
    } catch (error) {
      console.error("Error fetching starred files:", error);
    } finally {
      setLoading(false);
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
    setIsAddOpen(false);
  };

  const handleBack = () => {
    setCurrentFolderId(folder.parentId);
  };

  // // ✅ Use the hook
  // const { handleDelete, handleRename, handleStar } = useFileActions(
  //   token,
  //   currentUserId,
  //   fetchStarredFiles,
  //   IP
  // );

  useEffect(() => {
    const init = async () => {
      const userToken = await getToken();
      const userId = await getUserId();

      if (!userToken || !userId) {
        router.replace("/(auth)/login");
        setLoading(false);
      }
    };
    init();
  }, []);

  const handlePress = (file) => {
    if (file.type === "folder") {
      setCurrentFolderId(file._id);
    } else {
      router.push({
        pathname: "/[id]",
        params: { id: file._id },
      });
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <View style={{ zIndex: 100, elevation: 10, width: "100%" }}>
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
      </View>
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
          refreshFiles={fetchStarredFiles}
          setParentIdInTab={(id) => {
            setCurrentFolderId(id);
          }}
          // handleDelete={handleDelete}
          // handleRename={handleRename}
          // handleStar={handleStar}
          // handleDetails={handleOpenPermissions}
        />
      )}
     {/* {!currentFolderId && (
        <Button
          title="+"
          style={styles.addbutton}
          onPress={() => setIsAddOpen(true)}
        />
      )}*/}

      {/* <AddMenu
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleFileUpload}
      /> */}

      {/* <PermissionsModal
          visible={showPermissions}
          file={selectedFile}
          onClose={() => setShowPermissions(false)}
        /> */}
    </View>
  );
}
