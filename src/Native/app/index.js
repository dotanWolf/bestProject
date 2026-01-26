import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native"; // 1. Added StyleSheet
import { getToken, getUserId } from "../tokenUtil";
import { useTheme } from "../contexts/ThemeContext";

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();

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
    // 2. Now styles.container exists
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

// 3. Define the missing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});