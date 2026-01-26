import { Stack } from "expo-router";
import { FilesProvider } from "../contexts/FilesContext";
import { UserProvider } from "../contexts/UserContext"; // <--- 1. Import UserProvider

export default function RootLayout() {
  return (
    // 2. Wrap UserProvider around FilesProvider (or vice versa)
    <UserProvider>
      <FilesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="[id]" />
        </Stack>
      </FilesProvider>
    </UserProvider>
  );
}