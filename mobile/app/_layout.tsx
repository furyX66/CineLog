import { AuthProvider, useAuth } from "@/stores/auth-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../global.css";
import { useEffect } from "react";

function RootLayoutContent() {
  const { loading, isAuthenticated, validateToken, token, logout } = useAuth();
  const [fontsLoaded] = useFonts({
    DMSansL: require("@/assets/fonts/DMSans-ExtraLight.ttf"),
    DMSansR: require("@/assets/fonts/DMSans-Regular.ttf"),
    DMSansM: require("@/assets/fonts/DMSans-Medium.ttf"),
    DMSansSB: require("@/assets/fonts/DMSans-SemiBold.ttf"),
    DMSansB: require("@/assets/fonts/DMSans-Bold.ttf"),
  });

  useEffect(() => {
    validateToken();
  }, [token, logout, validateToken]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="welcome-screen" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
