import Button from "@/components/button";
import Input from "@/components/input";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

export default function Login() {
  return (
    <LinearGradient
      className="flex-1 items-center justify-end gap-12"
      colors={["#8E2DE2", "#4A00E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text className="line-h h-16 font-[DMSansB] text-5xl text-white">
        Login
      </Text>
      <View className="h-[70%] w-full gap-6 rounded-t-2xl bg-white px-4 pt-16">
        <View className="gap-2">
          <Text className="font-[DMSansSB] text-purple-700">
            Email or Username
          </Text>
          <Input />
        </View>
        <View className="gap-2">
          <Text className="font-[DMSansSB] text-purple-700">Password</Text>
          <Input type="password" />
        </View>
        <Button>Login</Button>
      </View>
    </LinearGradient>
  );
}
