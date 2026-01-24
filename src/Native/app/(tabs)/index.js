import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Alert } from "react-native";

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

  // ✅ קבל הכל מה-hook!
  const {
    entries,
    loading,
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
  } = useFolderView(null); // null = root

  const { allFiles, refreshFiles, initialize } = useFiles();

  useEffect(() => {
    const init = async () => {
      await initialize();
      
      // Fetch only if no data
      if (allFiles.length === 0) {
        refreshFiles();
      }
    };
    init();
  }, []);

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

  if (loading && allFiles.length === 0) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TopBar handleMenuOpen={() => setIsMenuOpen(true)} />
      
      <EntryList 
        entries={entries} 
        handlePress={handlePress}
        handleDelete={handleDelete}
        handleRename={handleRename}
        handleStar={handleStar}
        handleDetails={handleOpenPermissions} 
      />
      
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