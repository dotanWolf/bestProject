import { Redirect } from "expo-router";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import {
  saveToken,
  getToken,
  removeToken,
  saveUserId,
  getUserId,
} from "../tokenUtil";
import { useEffect, useState } from "react";

export default function Main() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = await getToken();
        const userId = await getUserId();

        if (token && userId) {
          await fetchUser(token, userId);
          setToken(token)
          setUserId(userId)
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{token}</Text>
    </View>
  );
}
