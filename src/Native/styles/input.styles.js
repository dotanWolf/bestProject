import { StyleSheet } from "react-native";
import { COLORS, FONTS} from "./Theme";

export const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: "center"
  },
  input: {
    height: FONTS.inputHeight,
    width: '90%',
    borderWidth: 1,
    borderColor: COLORS.googleGray,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.googleText,
    backgroundColor: 'transparent',
  },
});