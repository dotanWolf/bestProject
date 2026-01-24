import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="starred" options={{ title: "starred" }} />
      <Tabs.Screen name="shared" options={{ title: "shared" }} />
    </Tabs>
  );
}
