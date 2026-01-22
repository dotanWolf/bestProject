import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "./Theme";

export const styles = StyleSheet.create({
  button: {
    height: FONTS.inputHeight,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xl,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: FONTS.standard,
    fontWeight: FONTS.semiBold,
  },
});
