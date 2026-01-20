import { Redirect } from "expo-router";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function Main() {
  const token = null; // change this to get from some storage like localstorage in the web

  if (!token) { // might need to change this
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Main Screen</Text>
    </View>
  );
}
