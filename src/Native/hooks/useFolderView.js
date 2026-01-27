import { useState, useMemo, useEffect, useCallback } from "react";
import { Alert, Platform } from "react-native";
import { useFiles } from "../contexts/FilesContext";
import * as DocumentPicker from "expo-document-picker";

export function useFolderView(currentFolderId = null) {
  // Global context data (for Root view)
  const {
    allFiles,
    refreshFiles,
    token,
    currentUserId,
    loading: contextLoading,
  } = useFiles();

  // Local state (for Folder view)
  const [folderFiles, setFolderFiles] = useState([]);
  const [folderLoading, setFolderLoading] = useState(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const IP = process.env.EXPO_PUBLIC_IP;

  // Normalize ID to string to avoid mismatch issues (e.g. number vs string)
  const targetId = currentFolderId ? String(currentFolderId) : null;

  // =========================================================================
  // 1. FETCH LOGIC (Hierarchy Handling)
  // =========================================================================

  // Function to fetch ONLY the content of the current folder
  // This bypasses the "Root only" limitation of the main API
  const refreshCurrentFolder = useCallback(async () => {
    if (!targetId || !token) return;

    console.log(`🔄 Fetching content for folder: ${targetId}`);
    setFolderLoading(true);

    try {
      // Endpoint: GET /api/files/folders/:parentId
      // Added Cache-Control to ensure we see new files immediately
      const response = await fetch(
        `http://${IP}:8080/api/files/folders/${targetId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Loaded ${data.length} items for folder ${targetId}`);
        setFolderFiles(data);
      } else {
        console.error("❌ Failed to fetch folder content");
      }
    } catch (error) {
      console.error("❌ Network error fetching folder:", error);
    } finally {
      setFolderLoading(false);
    }
  }, [targetId, token, IP]);

  // Trigger fetch when entering a folder
  useEffect(() => {
    if (targetId) {
      refreshCurrentFolder();
    }
  }, [targetId, refreshCurrentFolder]);

  // =========================================================================
  // 2. DATA SELECTION (Root vs Folder)
  // =========================================================================

  const entries = useMemo(() => {
    if (!targetId) {
      // --- ROOT VIEW ---
      // Filter from Global Context (allFiles)
      // Criteria: Not trashed AND Parent is null (or "null" string)
      return allFiles.filter(
        (f) => !f.isTrashed && (!f.parentId || f.parentId === "null"),
      );
    } else {
      // --- FOLDER VIEW ---
      // Use the Local State we fetched from the specific endpoint
      return folderFiles.filter((f) => !f.isTrashed);
    }
  }, [allFiles, folderFiles, targetId]);

  // Unified loading state
  const loading = targetId ? folderLoading : contextLoading;

  // Helper to refresh the correct list after an action
  const refreshCorrectList = async () => {
    if (targetId)
      await refreshCurrentFolder(); // Refresh local folder
    else await refreshFiles(); // Refresh global context
  };

  // --- CREATE FOLDER ---
  const handleCreateFolder = async (name) => {
    const pid = targetId;
    console.log(`📂 Creating "${name}" inside Parent: ${pid || "ROOT"}`);

    if (!token) return;

    try {
      const payload = {
        name: name,
        type: "folder",
        parentId: pid, // Send targetId (or null for root)
        isTrashed: false,
        isStarred: false,
        content: null,
      };

      const response = await fetch(`http://${IP}:8080/api/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ Folder created!");
        await refreshCorrectList();
      } else {
        const err = await response.json();
        console.error("❌ Create error:", err);
        Alert.alert("Error", "Folder creation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- UPLOAD FILE (Blob -> Base64) ---
  const handleFileUpload = async () => {
    const pid = targetId;
    console.log(`📤 Uploading file to Parent: ${pid || "ROOT"}`);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const file = result.assets[0];

      // Convert file to Base64 using Fetch+Blob (Works natively)
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const payload = {
        name: file.name,
        type: "file",
        parentId: pid, // Send targetId
        isTrashed: false,
        isStarred: false,
        content: base64Content,
        mimeType: file.mimeType,
      };

      console.log("🚀 Sending JSON upload request...");

      const serverResponse = await fetch(`http://${IP}:8080/api/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify(payload),
      });

      if (serverResponse.ok) {
        console.log("✅ Upload success!");
        await refreshCorrectList();
        setIsAddOpen(false);
      } else {
        const err = await serverResponse.text();
        console.error("❌ Upload failed:", err);
        Alert.alert("Error", "Upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      Alert.alert("Error", "Failed to upload file");
    }
  };

  // --- RENAME ---
  const handleRename = (file) => {
    Alert.prompt(
      "Rename",
      `Rename ${file.name}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rename",
          onPress: async (n) => {
            if (!n) return;
            await fetch(`http://${IP}:8080/api/files/${file.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                userid: currentUserId,
              },
              body: JSON.stringify({ name: n }),
            });
            refreshCorrectList();
          },
        },
      ],
      "plain-text",
      file.name,
    );
  };

  // --- DELETE (Move to Trash + Remove Star) ---
  const handleDelete = (file) => {
    const isOwner = file.ownerId === currentUserId;
    const actionName = isOwner ? "Move to Trash" : "Remove Access";

    Alert.alert("Delete", `Are you sure you want to ${actionName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const url = isOwner
            ? `http://${IP}:8080/api/files/${file.id}`
            : `http://${IP}:8080/api/files/${file.id}/permissions/${file.permissionId}`;

          const method = isOwner ? "PATCH" : "DELETE";

          // UPDATED LOGIC:
          // 1. isTrashed: true (Move to trash)
          // 2. isStarred: false (Remove star automatically)
          const body = isOwner
            ? JSON.stringify({ isTrashed: true, isStarred: false })
            : null;

          await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              userid: currentUserId,
            },
            body,
          });
          refreshCorrectList();
        },
      },
    ]);
  };

  // --- STAR ---
  const handleStar = async (file) => {
    const isOwner = file.ownerId === currentUserId;
    const url = isOwner
      ? `http://${IP}:8080/api/files/${file.id}`
      : `http://${IP}:8080/api/files/${file.id}/permissions/${file.permissionId}`;
    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userid: currentUserId,
      },
      body: JSON.stringify({ isStarred: !file.isStarred }),
    });
    refreshCorrectList();
  };

  const handleOpenPermissions = (file) => {
    setSelectedFile(file);
    setShowPermissions(true);
  };

  return {
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
  };
}
