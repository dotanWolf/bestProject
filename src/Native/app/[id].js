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
import { useLocalSearchParams } from "expo-router";

export default function FolderView() {
  const { id } = useLocalSearchParams(); // This is the folderId from the URL
  const router = useRouter();
  const [currentFolderId, setCurrentFolderId] = useState(id);
  const [token, setToken] = useState(null);
  const [entries, setEntries] = useState([]);

  const IP = process.env.EXPO_PUBLIC_IP;

  const fetchFiles = async (token) => {
    // Use parentId from URL
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
      // setLoading(false);
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

  const handleMenuOpen = () => {
    router.back();
  };

  const handlePress = (file) => {
    if (file.type === "folder") {
      router.push({
        pathname: "/[id]",
        params: { id: file.id },
      });
    } else {
      // open the file
    }
  };
  return (
    <View style={styles.container}>
      <TopBar handleMenuOpen={handleMenuOpen} text="<--"></TopBar>
      <EntryList entries={entries} handlePress={handlePress}></EntryList>
    </View>
  );
}
