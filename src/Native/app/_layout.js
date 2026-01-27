import { Stack } from "expo-router";
import { FilesProvider } from "../contexts/FilesContext";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext"; // <--- Import

export default function RootLayout() {
  return (
    <ThemeProvider>
     <UserProvider>
       <FilesProvider>
        {/* <--- Wrap it here */}
          <Stack screenOptions={{ headerShown: false }}>
             <Stack.Screen name="(tabs)" />
             <Stack.Screen name="index" />
             <Stack.Screen name="(auth)" />
             <Stack.Screen name="[id]" />
          </Stack>
      </FilesProvider>
     </UserProvider>
    </ThemeProvider>
  );
}