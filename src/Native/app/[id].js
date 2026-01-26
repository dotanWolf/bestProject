import * as FileSystem from 'expo-file-system/legacy';
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { getToken } from "../tokenUtil";
import TopBar from "../components/TopBar";
import { useUser } from "../contexts/UserContext";

export default function FileView() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;

  const fileId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [fileType, setFileType] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  // Helper: Decode Base64 to Text (Simple check)
  const decodeIfNeeded = (str) => {
    // If it's empty or looks like normal text, return it
    if (!str || str.includes(" ")) return str;
    
    try {
      // Try to decode. If it fails (it wasn't base64), it goes to catch block.
      // Note: "atob" is standard in React Native (Hermes engine)
      const decoded = atob(str);
      return decoded;
    } catch (e) {
      // It wasn't base64, so it's just normal text. Return as is.
      return str;
    }
  };

  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "text";
  };

  const fetchFile = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`http://${IP}:8080/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch file");

      const data = await response.json();
      setFile(data);

      const type = getFileType(data.name);
      setFileType(type);

      // ✅ FIX: If it's a text file, try to decode it.
      if (type === "text" && data.content) {
        setContent(decodeIfNeeded(data.content));
      } else {
        setContent(data.content || "");
      }

    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Error loading file");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const preparePdf = async () => {
    try {
      const filePath = `${FileSystem.cacheDirectory}${fileId}.pdf`;
      const base64Content = content.includes("base64,") 
        ? content.split("base64,")[1] 
        : content;

      await FileSystem.writeAsStringAsync(filePath, base64Content, {
        encoding: "base64",
      });

      setPdfUri(filePath);
    } catch (err) {
      console.error("PDF Prep Error:", err);
    }
  };

  useEffect(() => {
    if (fileId) fetchFile();
  }, [fileId]);

  useEffect(() => {
    if (fileType === "pdf" && content) {
      preparePdf();
    }
  }, [fileType, content]);

  const handleSave = async () => {
    if (fileType !== "text") {
      Alert.alert("Notice", "You can only edit text files.");
      return;
    }

    setIsSaving(true);
    try {
      // NOTE: We send the text AS IS (Plain Text) to match your Web logic
      // This ensures the next time you open it on Web, it's still readable.
      
      const token = await getToken();
      const response = await fetch(`http://${IP}:8080/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          content: content, // Sending plain text
          isTrashed: file.isTrashed,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Saved successfully!");
        router.back();
      } else {
        const error = await response.json();
        Alert.alert("Error", `Save failed: ${error.error}`);
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (fileType === "image") {
      let imgSrc = content;
      if (content && !content.startsWith("data:") && !content.startsWith("http")) {
        imgSrc = `data:image/png;base64,${content}`;
      }

      return (
        <View style={localStyles.previewContainer}>
          <Image
            source={{ uri: imgSrc }}
            style={localStyles.previewImage}
            resizeMode="contain"
          />
        </View>
      );
    }

    if (fileType === "pdf") {
      if (!pdfUri) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
      return (
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={["*"]}
            scalesPageToFit={true}
            allowFileAccess={true}
            source={{ uri: pdfUri }}
            style={{ flex: 1 }}
            onError={(e) => console.warn("WebView error: ", e.nativeEvent)}
          />
        </View>
      );
    }

    // TEXT VIEW
    if (fileType === "text") {
     return (
       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
         <TextInput 
            value={content} 
            onChangeText={setContent}
            multiline 
            style={localStyles.editor} 
            placeholder="Start typing..."
            textAlignVertical="top"
          />
       </ScrollView>
     );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View style={localStyles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <TopBar
        user={user}
        handleMenuOpen={() => router.back()}
        text={fileType === "text" ? "Cancel" : "Back"}
      />

      <View style={localStyles.header}>
        <Text style={localStyles.fileName} numberOfLines={1}>
          {fileType === "image" ? "🖼️ " : fileType === "pdf" ? "📄 " : "📝 "}
          {file?.name}
        </Text>

        {fileType === "text" && (
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={[localStyles.saveBtn, isSaving && { opacity: 0.5 }]}
          >
            <Text style={localStyles.saveBtnText}>
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  fileName: { fontSize: 18, fontWeight: "bold", flex: 1 },
  saveBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  previewContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  editor: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#333",
    minHeight: 300,
  },
});