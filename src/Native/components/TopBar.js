import { Text, TextInput, TouchableOpacity, View, Image } from "react-native"; // 1. Add Image here
import { styles } from "../styles/TopBar.styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TopBar({
  handleMenuOpen,
  text,
  handlePicturePress,
  isPictureVisible = true,
  user,
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const renderAvatar = () => {
    // 2. Uncomment this block logic
    if (user?.profileImage && user.profileImage !== "placeholder") {
      return (
        <Image
          source={{
            uri: user.profileImage.startsWith("data:")
              ? user.profileImage
              : `data:image/png;base64,${user.profileImage}`,
          }}
          style={styles.avatarImage} // Ensure this style exists in your styles file
        />
      );
    }
    // Fallback to Initials
    return (
      <Text style={styles.avatarText}>
        {user?.username ? user.username[0].toUpperCase() : "U"}
      </Text>
    );
   };
    const handleSearch = () => {
      if (searchInput.trim().length > 0) {
        // Navigate to the dynamic search route
        router.push(`/search/${encodeURIComponent(searchInput)}`);
        setSearchInput(""); // Optional: Clear bar after search
      }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMenuOpen} style={styles.iconButton}>
        <Ionicons
          name={text === "← Back" ? "arrow-back" : "menu"}
          size={24}
          color="#5f6368"
        />
      </TouchableOpacity>
      
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#5f6368"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search in Drive"
          value={searchInput}
          onChangeText={setSearchInput}
          style={styles.searchInput}
          placeholderTextColor="#5f6368"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
      </View>
      
      {isPictureVisible && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handlePicturePress}
        >
          <View style={styles.avatar}>{renderAvatar()}</View>
        </TouchableOpacity>
      )}
    </View>
  );
}