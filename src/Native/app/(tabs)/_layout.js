import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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