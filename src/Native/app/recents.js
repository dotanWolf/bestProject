import { useRouter } from "expo-router";
import { View } from "react-native";
import {
  saveToken,
  getToken,
  removeToken,
  saveUserId,
  getUserId,
} from "../tokenUtil";
import { useEffect, useState } from "react";
import { styles } from "../styles/index.styles";
import TopBar from "../components/TopBar";
import EntryList from "../components/EntryList";
import { useUser } from "../contexts/UserContext";
import React from "react";

export default function Main() {
  const router = useRouter();
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [token, setToken] = useState(null);
  const [entries, setEntries] = useState([]);
  const { user } = useUser();

  const IP = process.env.EXPO_PUBLIC_IP;

  const fetchFiles = async () => {
    const token = await getToken();

    try {
      const response = await fetch(`http://${IP}:8080/api/files/recent`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const recentsFiles = await response.json();
        setEntries(recentsFiles);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
    }
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = await getToken();

        if (token) {
          setToken(token);
          await fetchFiles(token);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      } finally {
      }
    };

    checkAuthAndFetch();
  }, []);

  const handleBack = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <TopBar
        user={user}
        handleMenuOpen={handleBack}
        text="← Back"
        handlePicturePress={() => setIsProfileVisible(true)}
        isPictureVisible={false}
      />
      <EntryList entries={entries}></EntryList>
    </View>
  );
}
