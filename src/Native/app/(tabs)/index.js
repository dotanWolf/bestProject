import { useRouter } from "expo-router";
import { View } from "react-native";
import {
  saveToken,
  getToken,
  removeToken,
  saveUserId,
  getUserId,
} from "../../tokenUtil";
import { useEffect, useState } from "react";
import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu from "../../components/SideMenu";

export default function Main() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const IP = process.env.EXPO_PUBLIC_IP;

  const handleLogOut = async () => {
    await removeToken();
  };

  useEffect(() => {
    console.log("Current Entries State:", JSON.stringify(entries, null, 2));
  }, [entries]); // This runs every time entries updates

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
      setLoadingUser(false);
    }
  };

  const fetchFiles = async (token) => {
    // Use parentId from URL
    const url = currentFolderId
      ? `http://${IP}:8080/api/files/folders/${currentFolderId}`
      : `http://${IP}:8080/api/files`;

    console.log(url);
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
        console.log(activeFiles);
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
        const userId = await getUserId();

        if (token && userId) {
          setToken(token);
          setUserId(userId);
          await fetchUser(token, userId);
          await fetchFiles(token);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    checkAuthAndFetch();
  }, []);

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
        fetchFiles(token);
      } else {
        alert("Creation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async () => {
    console.log("Upload logic goes here");
    // You will need expo-document-picker for this later!
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handlePress = (file) => {
    console.log(file)
    if (file.type == "folder") {
      alert("NOIGIG")
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
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TopBar handleMenuOpen={handleMenuOpen}></TopBar>
      <EntryList entries={entries} handlePress={handlePress}></EntryList>
      <Button
        title="+"
        style={styles.addbutton}
        onPress={() => setIsAddOpen(true)}
      ></Button>
      <AddMenu
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleFileUpload}
      />
    </View>
  );
}
