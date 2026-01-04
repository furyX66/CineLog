import Button from "@/components/button";
import Input from "@/components/input";
import { apiPost, extractErrorMessage } from "@/lib/api";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

interface LoginResponse {
  token: string;
  user: { id: number; username: string; email: string };
}

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const response: LoginResponse = await apiPost("/auth/Login", {
        identifier,
        password,
      });
      console.log("Response: ", response);
      await login(response.token, response.user);
      router.dismissAll();
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Error: ", err);
      const cleanError = extractErrorMessage(err.message);
      setErrorMessage(cleanError);
    }
  };

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
      <View className="h-[70%] w-full gap-4 rounded-t-2xl bg-white px-4 pt-16">
        <View className="gap-2">
          <Text className="font-[DMSansSB] text-purple-700">
            Email or Username
          </Text>
          <Input value={identifier} onChangeText={setIdentifier} />
        </View>
        <View className="gap-2">
          <Text className="font-[DMSansSB] text-purple-700">Password</Text>
          <Input value={password} onChangeText={setPassword} type="password" />
        </View>
        {errorMessage && (
          <Text className="font-[DMSansM] text-red-600">{errorMessage}</Text>
        )}
        <Button onPress={handleLogin}>Login</Button>
      </View>
    </LinearGradient>
  );
}
