import React, { useRef } from "react"; // 1. ייבוא useRef (חובה)
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, ScrollView, Text } from "react-native";
import { getToken, getUserId } from "../tokenUtil";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "../styles/index.styles";
import TopBar from "../components/TopBar";
import Button from "../components/Button";
import TrashEntry from "../components/TrashEntry";
import SideMenu from "../components/SideMenu";
import {useUser} from "../contexts/UserContext";

export default function Trash() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  // 2. יצירת רפרנס לרכיב הגלילה
  const scrollViewRef = useRef(null);

  const IP = process.env.EXPO_PUBLIC_IP;

  const fetchTrashedFiles = async () => {
    const token = await getToken();
    try {
      // Point to the specific trash endpoint
      const response = await fetch(`http://${IP}:8080/api/files/trash`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const trashFiles = await response.json();
        //console.log("Trash Files fetched:", trashFiles);
        setEntries(trashFiles);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userToken = await getToken();
      const userId = await getUserId();

      if (userToken) {
        setToken(userToken);
        setCurrentUserId(userId);
        await fetchTrashedFiles(userToken);
      } else {
        router.replace("/(auth)/login");
        setLoading(false);
      }
    };
    init();
  }, []);

  // 3. שימוש ב-useRef: גלילה לראש העמוד כשהרשימה מתעדכנת
  useEffect(() => {
    if (scrollViewRef.current && entries.length > 0) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [entries]);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        fetchTrashedFiles(token);
      }
    }, [token]),
  );

  const handleRestore = async (file) => {
    try {
      const response = await fetch(`http://${IP}:8080/api/files/${file.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify({
          isTrashed: false,
          parentId: null,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", `"${file.name}" restored to home!`);
        fetchTrashedFiles(token);
      } else {
        Alert.alert("Error", "Restore failed");
      }
    } catch (error) {
      console.error("Restore error:", error);
    }
  };

  const handlePermanentDelete = (file) => {
    Alert.alert("Permanent Delete", `Are you sure?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete Forever",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(
              `http://${IP}:8080/api/files/${file.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  userid: currentUserId,
                },
              },
            );

            if (response.ok) {
              fetchTrashedFiles(token);
            }
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const handleEmptyTrash = () => {
    if (entries.length === 0) return;

    Alert.alert("Empty Trash", `Delete all ${entries.length} items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Empty Trash",
        style: "destructive",
        onPress: async () => {
          // אופטימיזציה: מחיקה במקביל במקום בלולאה איטית
          const promises = entries.map((file) =>
            fetch(`http://${IP}:8080/api/files/${file.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                userid: currentUserId,
              },
            }),
          );
          await Promise.all(promises);
          Alert.alert("Success", "Trash emptied");
          fetchTrashedFiles(token);
        },
      },
    ]);
  };

  const handleMenuOpen = () => setIsMenuOpen(true);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TopBar
        user={user}
        handleMenuOpen={handleBack}
        text="← Back"
        handlePicturePress={() => setIsProfileVisible(true)}
        isPictureVisible={false}
      />
      {entries.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#999" }}>Trash is empty</Text>
        </View>
      ) : (
        <>
          <ScrollView ref={scrollViewRef}>
            {entries.map((entry) => (
              <TrashEntry
                key={entry.id}
                entry={entry}
                onRestore={() => handleRestore(entry)}
                onDelete={() => handlePermanentDelete(entry)}
              />
            ))}
          </ScrollView>

          {entries.length > 0 && (
            <Button
              title={`Empty Trash (${entries.length})`}
              style={[styles.addbutton, { backgroundColor: "#ff4444" }]}
              onPress={handleEmptyTrash}
            />
          )}
        </>
      )}
    </View>
  );
}
