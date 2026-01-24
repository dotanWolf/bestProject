import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { getToken, getUserId } from "../tokenUtil";
import * as DocumentPicker from 'expo-document-picker';
import { useFileActions } from "./useFileActions";

export function useFolderView(folderId, IP) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Get token and userId
  useEffect(() => {
    const init = async () => {
      const userToken = await getToken();
      const userId = await getUserId();
      setToken(userToken);
      setCurrentUserId(userId);
    };
    init();
  }, []);

  // Fetch files
  const fetchFiles = useCallback(async () => {
    if (!token) return;
    
    console.log("🔄 Fetching files for folder:", folderId || "root");
    setLoading(true);
    
    try {
      if (!folderId) {
        // Root level - get owned + shared
        const [ownedResponse, sharedResponse] = await Promise.all([
          fetch(`http://${IP}:8080/api/files`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }),
          fetch(`http://${IP}:8080/api/files/permissions`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          })
        ]);

        if (ownedResponse.ok && sharedResponse.ok) {
          const ownedData = await ownedResponse.json();
          const sharedData = await sharedResponse.json();

          const allFiles = [...ownedData, ...sharedData].filter(f => !f.isTrashed);

          allFiles.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
          });

          setEntries(allFiles);
        }
      } else {
        // Inside folder
        const response = await fetch(`http://${IP}:8080/api/files/folders/${folderId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const activeFiles = Array.isArray(data) ? data.filter(f => !f.isTrashed) : [];
          setEntries(activeFiles);
        }
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId, IP, token]);

  // File actions hook
  const { handleDelete, handleRename, handleStar } = useFileActions(
    token,
    currentUserId,
    fetchFiles,
    IP
  );

  // Load files when token is ready
  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [token, fetchFiles]);

  // File upload
  const handleFileUpload = async () => {
    try {
      console.log("📤 Starting file upload...");
      
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("❌ Cancelled");
        return;
      }

      const file = result.assets[0];
      console.log("📁 File selected:", file.name);
      
      // קרא כ-blob
      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      // המר ל-base64
      const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const uploadResponse = await fetch(`http://${IP}:8080/api/files`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "userid": currentUserId,
        },
        body: JSON.stringify({
          name: file.name,
          type: "file",
          content: base64Content,
          mimeType: file.mimeType || "application/octet-stream",
          parentId: folderId || null, // ✅ זה ההבדל היחיד!
          isTrashed: false,
          isStarred: false,
        }),
      });

      if (uploadResponse.ok) {
        Alert.alert("Success", "File uploaded!");
        await fetchFiles();
        setIsAddOpen(false);
      } else {
        const errorText = await uploadResponse.text();
        Alert.alert("Error", `Upload failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", error.message);
    }
  };

  // Create folder
  const handleCreateFolder = async (name) => {
    if (!token) return;
    try {
      const response = await fetch(`http://${IP}:8080/api/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "userid": currentUserId,
        },
        body: JSON.stringify({
          name,
          type: "folder",
          content: "",
          parentId: folderId || null,
          isTrashed: false,
          isStarred: false,
        }),
      });

      if (response.ok) {
        fetchFiles();
        setIsAddOpen(false);
      } else {
        Alert.alert("Error", "Folder creation failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred");
    }
  };

  const handleOpenPermissions = (file) => {
    setSelectedFile(file);
    setShowPermissions(true);
  };

  return {
    entries,
    loading,
    token,
    currentUserId,
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
    fetchFiles,
  };
}