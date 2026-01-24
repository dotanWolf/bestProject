import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/EntryList.styles";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

export default function EntryList({ file, refreshFiles, onNavigate, show }) {
  const handleOpenMenu = () => {};

  return (
    <View style={styles.container}>
      <Button title=":" onPress={handleOpenMenu}></Button>
    </View>
  );
}
