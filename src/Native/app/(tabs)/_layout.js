import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "../../contexts/ThemeContext"; // 1. שים לב: מייבאים את ה-Hook, לא את ה-Provider

export default function TabLayout() {
  // 2. שולפים את המידע מה-Provider הראשי שנמצא ב-_layout.js החיצוני
  const { theme } = useTheme(); 

  return (
    // 3. מחקנו את <ThemeProvider> מכאן!
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        // 4. (אופציונלי) מעדכנים את צבע הטאב-בר עצמו לפי ה-Theme
        tabBarStyle: {
            backgroundColor: theme.surface, 
            borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.icon,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="starred" 
        options={{ 
          title: "Starred",
          tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="shared" 
        options={{ 
          title: "Shared",
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="myDrive" 
        options={{ 
          title: "Files",
          tabBarIcon: ({ color }) => <Ionicons name="folder-open" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}