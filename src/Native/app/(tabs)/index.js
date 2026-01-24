import React, { useCallback, useEffect } from "react"; // 1. חובה לייבא useCallback
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useFocusEffect } from '@react-navigation/native'; // 2. חובה לייבא useFocusEffect

import { styles } from "../../styles/index.styles";
import TopBar from "../../components/TopBar";
import EntryList from "../../components/EntryList";
import Button from "../../components/Button";
import AddMenu from "../../components/addMenu";
import SideMenu from "../../components/SideMenu";
import PermissionsModal from "../../components/PermissionsModal";
import { useFolderView } from "../../hooks/useFolderView";
import { useFiles } from "../../contexts/FilesContext";

export default function Main() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // שימוש ב-Hook שלנו עבור תיקיית השורש (null)
  const {
    entries,
    loading: hookLoading, // שיניתי את השם כדי למנוע התנגשות
    isAddOpen,
    setIsAddOpen,
    showPermissions,
    setShowPermissions,
    selectedFile,
    handleDelete,
    handleRename,
    handleStar,
    handleFileUpload,
    handleCreateFolder,
    handleOpenPermissions,
  } = useFolderView(null); 

  const { refreshFiles, token, initialize } = useFiles();

  // אתחול ראשוני (Login check)
  useEffect(() => {
    initialize();
  }, []);

  // 👇 התיקון הקריטי: רענון בכל פעם שנכנסים למסך הבית
  useFocusEffect(
    useCallback(() => {
      if (token) {
        console.log("🏠 Home Screen focused - Refreshing list...");
        refreshFiles(); // זה מה שיביא את הקובץ ששוחזר!
      }
    }, [token]) // ירוץ כשיש טוקן וחוזרים למסך
  );

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

  const handleMenuOpen = () => setIsMenuOpen(true);

  // מציגים טעינה רק אם אין שום קבצים עדיין
  if (hookLoading && entries.length === 0) {
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
      
      {entries.length === 0 ? (
         <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color: 'gray'}}>No files found</Text>
         </View>
      ) : (
        <EntryList 
          entries={entries} 
          handlePress={handlePress}
          handleDelete={handleDelete}
          handleRename={handleRename}
          handleStar={handleStar}
          handleDetails={handleOpenPermissions} 
        />
      )}
      
      <Button
        title="+"
        style={styles.addbutton}
        onPress={() => setIsAddOpen(true)}
      />
      
      <AddMenu
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleFileUpload} 
      />

      <PermissionsModal 
        visible={showPermissions}
        file={selectedFile}
        onClose={() => setShowPermissions(false)}
      />
    </View>
  );
}