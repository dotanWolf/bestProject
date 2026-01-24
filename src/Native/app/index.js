import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { getToken } from "../tokenUtil";

export default function Index() {
  const router = useRouter();

 useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      
      console.log("🔍 Initial check - Token:", token ? "EXISTS" : "NULL");
      console.log("🔍 Initial check - UserId:", userId ? "EXISTS" : "NULL");
      
      if (!token || !userId) {
        console.log("❌ No auth - redirecting to login");
        router.replace("/(auth)/login");
        return;
      }
      
      console.log("✅ Redirecting to tabs");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Auth check error:", error);
      router.replace("/(auth)/login");
    }
  };

  checkAuth();
}, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}