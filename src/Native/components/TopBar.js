import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/TopBar.styles";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { Ionicons } from "@expo/vector-icons"; // Added Icons
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

  const handleChangeInput = (input) => {
    setSearchInput(input);
  };

  // Logic to determine the image source
  const renderAvatar = () => {
    // if (user?.profileImage && user.profileImage !== "placeholder") {
    //   return (
    //     <Image
    //       source={{
    //         uri: user.profileImage.startsWith("data:")
    //           ? user.profileImage
    //           : `data:image/png;base64,${user.profileImage}`,
    //       }}
    //       style={styles.avatarImage}
    //     />
    //   );
    // }

    // Fallback to Initials
    return (
      <Text style={styles.avatarText}>
        {user?.username ? user.username[0].toUpperCase() : "U"}
      </Text>
    );
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
      {/* Styled Search Bar */}
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
