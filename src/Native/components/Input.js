import { TextInput } from "react-native";
import { styles } from "../styles/input.styles";

export default function Input({ text, value, onChangeText }) {
  return (
    <TextInput
      placeholder={text}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    ></TextInput>
  );
}
