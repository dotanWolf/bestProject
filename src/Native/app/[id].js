import React, { useEffect, useMemo } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useFocusEffect } from '@react-navigation/native'; // 👇 חשוב לרענון בחזרה למסך

import { styles } from "../styles/index.styles";
import TopBar from "../components/TopBar";
import EntryList from "../components/EntryList";
import Button from "../components/Button";
import AddMenu from "../components/addMenu";
import PermissionsModal from "../components/PermissionsModal";
import { useFolderView } from "../hooks/useFolderView";
import { useFiles } from "../contexts/FilesContext";

export default function FolderView() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const folderId = useMemo(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    return id;
  }, [params.id]);

  // בדיקה בלוג - תראה את זה בטרמינל
  useEffect(() => {
    console.log("📂 Active Folder ID:", folderId);
  }, [folderId]);

  // שימוש ב-Hook עם ה-ID המתוקן
  const {
    entries,
    loading: hookLoading,
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
  } = useFolderView(folderId);

  const { refreshFiles, token } = useFiles();

  // 2. רענון אוטומטי בכניסה לתיקייה (גם אם כבר יש קבצים)
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        // console.log("🔄 Folder focused - refreshing...");
        refreshFiles();
      }
    }, [token, folderId])
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handlePress = (file) => {
    if (file.type === "folder") {
      // ניווט לתיקייה בתוך תיקייה (רקורסיה)
      router.push({
        pathname: "/[id]",
        params: { id: file.id },
      });
    } else {
      Alert.alert("File", `Opening: ${file.name}`);
    }
  };

  if (hookLoading && entries.length === 0) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar handleMenuOpen={handleBack} text="← Back" />

      {/* בדיקה ויזואלית אם הרשימה ריקה */}
      {entries.length === 0 ? (
         <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color: 'gray'}}>This folder is empty</Text>
            <Text style={{fontSize: 10, color: '#ccc'}}>ID: {folderId}</Text>
         </View>
      ) : (
        <EntryList 
          entries={entries} 
          handlePress={handlePress} 
          handleRename={handleRename}
          handleDelete={handleDelete}
          handleDetails={handleOpenPermissions}
          handleStar={handleStar}
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