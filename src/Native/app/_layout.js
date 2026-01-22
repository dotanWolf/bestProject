import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerLeft: () => <></>}}
      />
      <Stack.Screen name="login" options={{ title: "Login", headerLeft: () => <></> ,  headerShown:false}} />
      <Stack.Screen name="signup" options={{ title: "SignUp", headerLeft: () => <></> ,  headerShown:false}} />
    </Stack>
  );
}
