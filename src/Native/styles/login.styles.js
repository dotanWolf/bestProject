import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "./Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  top: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  bottom: {
    flex: 2,
    padding: FONTS.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  header: {
    fontSize: FONTS.xxlarge,
    fontWeight: FONTS.bold,
    color: "#1C1C1E",
  },
});
