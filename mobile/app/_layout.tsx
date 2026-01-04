import { AuthProvider } from "@/stores/auth-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  useFonts({
    DMSansL: require("@/assets/fonts/DMSans-ExtraLight.ttf"),
    DMSansR: require("@/assets/fonts/DMSans-Regular.ttf"),
    DMSansM: require("@/assets/fonts/DMSans-Medium.ttf"),
    DMSansSB: require("@/assets/fonts/DMSans-SemiBold.ttf"),
    DMSansB: require("@/assets/fonts/DMSans-Bold.ttf"),
  });

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </AuthProvider>
  );
}
