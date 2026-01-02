import Button from "@/components/button";
import { LinearGradient } from "expo-linear-gradient";
import { Popcorn } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <LinearGradient
      className="flex-1 items-center justify-end gap-12"
      colors={["#8E2DE2", "#4A00E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Popcorn color="white" size={120} />
      <View className="bg-white rounded-t-2xl h-[70%] pt-16 items-center w-full">
        <Text className="text-purple-700 text-4xl font-[DMSansB]">
          Welcome to CineLog
        </Text>
        <Text className="text-purple-700 text-xl font-[DMSansR]">
          Your personal cinema diary is ready
        </Text>
        <View className="w-full gap-6 items-center justify-start flex-1 px-4 mt-8">
          <Button>Sign up</Button>
          <Button variant="outline">Login</Button>
        </View>
      </View>
    </LinearGradient>
  );
}
