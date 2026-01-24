import React from "react"; // ✅ הוסף
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert } from "react-native";
import { getToken, getUserId } from "../../tokenUtil";
import { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native'; // ✅ הוסף
import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import SideMenu from "../../components/SideMenu";
import PermissionsModal from "../../components/PermissionsModal";
import { useFileActions } from "../../hooks/useFileActions"; // ✅ הוסף

export default function Starred() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const IP = process.env.EXPO_PUBLIC_IP;

  const fetchStarredFiles = async () => {
    if (!token) return;

    console.log("⭐ Fetching starred files...");
    
    try {
      const response = await fetch(`http://${IP}:8080/api/files/starred`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const starredFiles = await response.json();
        console.log("✅ Starred files loaded:", starredFiles.length);
        setEntries(starredFiles);
      }
    } catch (error) {
      console.error("Error fetching starred files:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Use the hook
  const { handleDelete, handleRename, handleStar } = useFileActions(
    token,
    currentUserId,
    fetchStarredFiles,
    IP
  );

  useEffect(() => {
    const init = async () => {
      const userToken = await getToken();
      const userId = await getUserId();
      
      if (userToken) {
        setToken(userToken);
        setCurrentUserId(userId);
      } else {
        router.replace("/(auth)/login");
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (token) {
      fetchStarredFiles();
    }
  }, [token]);

  // ✅ רענון כשחוזרים ל-Starred tab
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        console.log("⭐ Starred tab focused - refreshing...");
        fetchStarredFiles();
      }
    }, [token])
  );

  const handleOpenPermissions = (file) => {
    setSelectedFile(file);
    setShowPermissions(true);
  };

  const handleMenuOpen = () => setIsMenuOpen(true);

  const handlePress = (file) => {
    if (file.type === "folder") {
      router.push({
        pathname: "/[id]",
        params: { id: file.id },
      });
    } else {
      Alert.alert("File", `Opening: ${file.name}`);
    }
  };

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TopBar handleMenuOpen={handleMenuOpen} />
      
      <EntryList 
        entries={entries} 
        handlePress={handlePress}
        handleDelete={handleDelete}
        handleRename={handleRename}
        handleStar={handleStar}
        handleDetails={handleOpenPermissions} 
      />

      <PermissionsModal 
        visible={showPermissions}
        file={selectedFile}
        onClose={() => setShowPermissions(false)}
      />
    </View>
  );
}