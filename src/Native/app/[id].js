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
import { WebView } from "react-native-webview"; // Install: npx expo install react-native-webview
import { getToken } from "../tokenUtil";
import TopBar from "../components/TopBar";

export default function FileView() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;

  // Normalize ID
  const fileId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return "image";
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
      setContent(data.content || "");
      setFileType(getFileType(data.name));
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Error loading file");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) fetchFile();
  }, [fileId]);

  const handleSave = async () => {
    if (fileType !== "text") {
      Alert.alert("Notice", "You can only edit text files.");
      return;
    }

    setIsSaving(true);
    try {
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
          content: content,
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
      console.error("Error:", error);
      Alert.alert("Error", "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (fileType === "image") {
      let imgSrc = content;
      // Handle Base64 prefixing
      if (
        content &&
        !content.startsWith("data:") &&
        !content.startsWith("http")
      ) {
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
      // 1. Ensure the prefix is there
      const pdfSource = content.startsWith("data:application/pdf;base64,")
        ? content
        : `data:application/pdf;base64,${content}`;

      return (
        <WebView
          originWhitelist={["*"]}
          // Allow file access and hardware acceleration for Android
          allowFileAccess={true}
          scalesPageToFit={true}
          source={{ uri: pdfSource }}
          style={{ flex: 1 }}
          // Debugging: If it fails, show why
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
          }}
        />
      );
    }

    // Default: Text Editor
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TextInput
          value={content}
          onChangeText={setContent}
          style={localStyles.editor}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Start typing..."
          placeholderTextColor="#999"
          textAlignVertical="top"
        />
      </ScrollView>
    );
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
    fontFamily: "System", // Use 'Courier' for a code-editor feel
    color: "#333",
    minHeight: 300,
  },
});
