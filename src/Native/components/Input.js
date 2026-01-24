import { TextInput } from "react-native";
import { styles } from "../styles/input.styles";

export default function Input({ text, value, onChangeText, style }) {
  return (
    <TextInput
      placeholder={text}
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
    ></TextInput>
  );
}
