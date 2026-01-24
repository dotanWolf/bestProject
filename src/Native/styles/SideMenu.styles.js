import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Covers the whole screen
    zIndex: 1000,
    flexDirection: "row",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  panel: {
    width: "75%", // Standard side menu width
    backgroundColor: "white",
    height: "100%",
    paddingTop: 50,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  driveText: { fontSize: 22, fontWeight: "bold", color: "#444" },
  userEmail: { fontSize: 14, color: "#888", marginTop: 5 },
  menuItems: { padding: 10 },
  item: { flexDirection: "row", padding: 15, alignItems: "center" },
  itemText: { fontSize: 16, marginLeft: 20, color: "#333" },
  icon: { fontSize: 20 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  logout: { marginTop: 20 },
});