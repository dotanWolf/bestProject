import { Stack } from "expo-router";
import { FilesProvider } from "../contexts/FilesContext";

export default function RootLayout() {
  return (
    <FilesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="[id]" />
      </Stack>
    </FilesProvider>
  );
}