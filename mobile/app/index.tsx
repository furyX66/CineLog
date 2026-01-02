import Button from "@/components/button";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Popcorn } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      className="flex-1 items-center justify-end gap-12"
      colors={["#8E2DE2", "#4A00E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Popcorn color="white" size={120} />
      <View className="h-[70%] w-full items-center rounded-t-2xl bg-white pt-16">
        <Text className="font-[DMSansB] text-4xl text-purple-700">
          Welcome to CineLog
        </Text>
        <Text className="font-[DMSansR] text-xl text-purple-700">
          Your personal cinema diary is ready
        </Text>
        <View className="mt-8 w-full flex-1 items-center justify-start gap-6 px-4">
          <Button>Sign up</Button>
          <Button onPress={() => router.navigate("/login")} variant="outline">
            Login
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}
