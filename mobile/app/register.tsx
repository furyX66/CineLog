import Button from "@/components/button";
import Input from "@/components/input";
import { apiPost, extractErrorMessage } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

interface RegisterResponse {
  token: string;
  user: { id: number; username: string };
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    setErrorMessage("");
    if (password !== repeatPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await apiPost("/auth/register", {
        username,
        email,
        password,
      });
      console.log("Response: ", response);
    } catch (err: any) {
      console.log("Error: ", err);
      const cleanError = extractErrorMessage(err.message);
      setErrorMessage(cleanError);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
      >
        <LinearGradient
          className="flex-1 items-center justify-center gap-8"
          colors={["#8E2DE2", "#4A00E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text className="mt-32 h-16 font-[DMSansB] text-5xl text-white">
            Sign up
          </Text>
          <View className="w-full flex-1 gap-2 rounded-t-2xl bg-white px-4 pt-8">
            <View className="gap-2">
              <Text className="font-[DMSansSB] text-purple-700">Username</Text>
              <Input value={username} onChangeText={setUsername} />
            </View>
            <View className="gap-2">
              <Text className="font-[DMSansSB] text-purple-700">Email</Text>
              <Input value={email} onChangeText={setEmail} />
            </View>
            <View className="gap-2">
              <Text className="font-[DMSansSB] text-purple-700">Password</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                type="password"
              />
            </View>
            <View className="gap-2">
              <Text className="font-[DMSansSB] text-purple-700">
                Repeat Password
              </Text>
              <Input
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                type="password"
              />
            </View>
            {errorMessage && (
              <Text className="font-[DMSansM] text-red-600">
                {errorMessage}
              </Text>
            )}
            <Button onPress={handleSignUp}>Sign up</Button>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
