  import { Text, TouchableOpacity, View } from "react-native";
  import { styles } from "../styles/TopBar.styles";
  import { useState } from "react";
  import Button from "./Button";
  import Input from "./Input";
  import { useRouter } from "expo-router";
  export default function TopBar({handleMenuOpen, text}) {
    const router = useRouter();

    const [searchInput, setSearchInput] = useState("");

    const handleChangeInput = (input) => {
      setSearchInput(input);
    };

    return (
      <View style={styles.container}>
        <Button title={text|| "menu"} onPress={handleMenuOpen}></Button>
        <Input
          text="search"
          value={searchInput}
          onChangeText={handleChangeInput}
          style={{ width: "40%" }}
        ></Input>
        <Text>pfp</Text>
      </View>
    );
  }
