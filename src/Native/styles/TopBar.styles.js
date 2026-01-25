import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "./Theme";

export const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: "white", // Give it a clean background
    // Suble shadow for elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: SPACING.md,
    borderRadius: 30, // Pill shape
    height: 50,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flex: 1, // Takes up remaining space
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#202124",
    height: "100%",
  },
  profileButton: {
    marginLeft: SPACING.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#34a853", // Brand color
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
