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

export default function Main() {
  const router = useRouter();
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [token, setToken] = useState(null);
  const [entries, setEntries] = useState([]);

  const IP = process.env.EXPO_PUBLIC_IP;

  const fetchFiles = async () => {
    const token = await getToken()
    try {
      // Point to the specific trash endpoint
      const response = await fetch(`http://${IP}:8080/api/files/trash`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const trashFiles = await response.json();
        setEntries(trashFiles);
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

  const handleMenuOpen = () => {
    router.back()
  }
  return (
    <View style={styles.container}>
      <TopBar handleMenuOpen={handleMenuOpen} text="<--"></TopBar>
      <EntryList entries={entries}></EntryList>
    </View>
  );
}
