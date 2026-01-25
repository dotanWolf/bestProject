import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "./Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the main view fills the screen
  },
  addbutton: {
    position: "absolute", // Pulls it out of the normal layout flow
    bottom: 30, // 30 pixels from the bottom
    right: 30, // 30 pixels from the right
    zIndex: 10, // Ensures it stays on top of the list
    backgroundColor: "blue",
    borderRadius: 50, // Makes it circular if it's a square
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  folderHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },

  folderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  backButtonText: {
    color: "#007AFF", // Classic iOS Blue
    fontSize: 16,
    fontWeight: "600",
  },
});
