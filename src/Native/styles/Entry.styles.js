import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "./Theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.md,
  },

  info: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: SPACING.sm,
  },
  input: {
    height: FONTS.inputHeight,
    width: "90%",
    borderWidth: 1,
    borderColor: COLORS.googleGray,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.googleText,
    backgroundColor: "transparent",
  },
});
