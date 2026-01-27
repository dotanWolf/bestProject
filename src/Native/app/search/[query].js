import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getToken } from "../../tokenUtil";
import { styles } from "../../styles/index.styles"; 
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import SideMenu from "../../components/SideMenu";
import UserProfileModal from "../../components/UserProfileModal";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function SearchResults() {
  // 1. Get the query from the URL
  const { query } = useLocalSearchParams(); 
  const router = useRouter();
  
  const { user } = useUser();
  const { theme } = useTheme(); // ✅ Dark Mode hook

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const IP = process.env.EXPO_PUBLIC_IP;

  // 2. Fetch Logic
  const fetchSearchResults = async () => {
    const token = await getToken();
    const term = query?.trim() || "";
    
    if (!term) return;

    setLoading(true);
    try {
      // NOTE: This endpoint should be configured on your backend to search 
      // both "My Files" and "Shared Files".
      const response = await fetch(
        `http://${IP}:8080/api/search/${encodeURIComponent(term)}`, 
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const activeFiles = Array.isArray(data) 
          ? data.filter((f) => !f.isTrashed) 
          : [];
        setEntries(activeFiles);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  // 3. Navigation Handler
  const handlePress = (file) => {
    if (file.type === "folder") {
      // Navigate to folder view
      router.push({
        pathname: "/[id]",
        params: { currentFolderId: file.id } 
      });
    } else {
      // Open file viewer
      router.push({
        pathname: "/[id]",
        params: { id: file.id },
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* TopBar with Back Button */}
      <View style={{ zIndex: 100, elevation: 10, width: "100%" }}>
        <TopBar
          user={user}
          handleMenuOpen={handleBack}
          text="← Back" 
          handlePicturePress={() => setIsProfileVisible(true)}
          isPictureVisible={true}
        />
      </View>

      <UserProfileModal
        user={user}
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />

      {/* Results Header */}
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.text }}>
          Results for "{query}"
        </Text>
      </View>

      {/* Results List */}
      {entries.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: theme.subText }}>No files found matching your search.</Text>
        </View>
      ) : (
        <EntryList
          entries={entries}
          handlePress={handlePress}
          refreshFiles={fetchSearchResults} 
        />
      )}

      {/* Side Menu (Hidden but required for structure consistency) */}
      <View style={{ zIndex: 999, elevation: 20 }}>
        <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </View>
    </View>
  );
}