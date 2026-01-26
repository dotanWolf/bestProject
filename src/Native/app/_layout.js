import { Stack } from "expo-router";
import { FilesProvider } from "../contexts/FilesContext";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext"; // <--- Import

export default function RootLayout() {
  return (
    <UserProvider>
      <FilesProvider>
        <ThemeProvider> {/* <--- Wrap it here */}
          <Stack screenOptions={{ headerShown: false }}>
             {/* ... your screens ... */}
             <Stack.Screen name="(tabs)" />
             <Stack.Screen name="index" />
             <Stack.Screen name="(auth)" />
             <Stack.Screen name="[id]" />
          </Stack>
        </ThemeProvider>
      </FilesProvider>
    </UserProvider>
  );
}