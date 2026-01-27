import { Alert, Platform } from "react-native";

export function useFileActions(token, currentUserId, fetchFiles, IP) {
  const handleDelete = (file) => {
    console.log("🎣 handleDelete CALLED!");

    if (!token || !currentUserId) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    const isOwner = file.ownerId === currentUserId;
    const actionName = isOwner ? "Move to Trash" : "Remove Access";

    Alert.alert(
      actionName,
      `Are you sure you want to ${actionName.toLowerCase()} "${file.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionName,
          style: "destructive",
          onPress: async () => {
            console.log("🚀 Deleting...");
            try {
              if (isOwner) {
                const url = `http://${IP}:8080/api/files/${file._id}`;
                console.log("📍 URL:", url);

                const response = await fetch(url, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    userid: currentUserId,
                  },
                  body: JSON.stringify({
                    isTrashed: true,
                    isStarred: false,
                    parentId: null,
                  }),
                });

                console.log("📥 Status:", response.status);

                if (response.ok) {
                  await fetchFiles();
                } else {
                }
              } else {
                const url = `http://${IP}:8080/api/files/${file._id}/permissions/${file.permissionId}`;

                const response = await fetch(url, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    userid: currentUserId,
                  },
                });

                if (response.ok) {
                  await fetchFiles();
                } else {
                  console.log("❌ Remove access failed");
                }
              }
            } catch (err) {
              console.error("❌ Error:", err);
            }
          },
        },
      ],
    );
  };

  const handleRename = (file) => {
    if (!token || !currentUserId) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    Alert.prompt(
      "Rename",
      `Enter new name for ${file.name}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rename",
          onPress: async (newName) => {
            if (!newName || newName === file.name) return;
            try {
              await fetch(`http://${IP}:8080/api/files/${file._id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  userid: currentUserId,
                },
                body: JSON.stringify({ name: newName }),
              });
              await fetchFiles();
            } catch (err) {
              console.error("Rename failed:", err);
            }
          },
        },
      ],
      "plain-text",
      file.name,
    );
  };

  const handleStar = async (file) => {
    if (!token || !currentUserId) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    try {
      const isOwner = file.ownerId === currentUserId;
      const url = isOwner
        ? `http://${IP}:8080/api/files/${file._id}`
        : `http://${IP}:8080/api/files/${file._id}/permissions/${file.permissionId}`;

      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: JSON.stringify({ isStarred: !file.isStarred }),
      });
      await fetchFiles();
    } catch (err) {
      console.error("Star failed", err);
    }
  };

  return {
    handleDelete,
    handleRename,
    handleStar,
  };
}
