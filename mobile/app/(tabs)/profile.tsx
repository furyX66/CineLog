import Button from "@/components/button";
import Input from "@/components/input";
import { apiPut, extractErrorMessage } from "@/lib/api";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IUpdateUserResponse {
  id: number;
  email: string;
  username: string;
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user, token, login } = useAuth();

  const handleSaveProfile = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await apiPut<IUpdateUserResponse>(
        {
          username,
          email,
        },
        "/account/profile",
        token!,
      );
      await login(token!, {
        id: response.id,
        email: response.email,
        username: response.username,
      });
      setSuccessMessage("User data successfully updated");
    } catch (error: any) {
      const cleanError = extractErrorMessage(error.message);
      setErrorMessage(cleanError);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSuccessMessage("");
      setErrorMessage("");
      if (user) {
        setUsername(user.username || "");
        setEmail(user.email || "");
        setLoading(false);
      } else {
        router.replace("/auth/login");
        setLoading(false);
      }
    }, [user]),
  );

  if (loading) {
    return (
      <LinearGradient
        className="flex-1 items-center justify-center"
        colors={["#11998E", "#38EF7D"]}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text className="mt-4 font-[DMSansM] text-xl text-white">
          Loading user data...
        </Text>
      </LinearGradient>
    );
  }
  if (!user) {
    return (
      <Text className="mt-4 font-[DMSansM] text-xl text-white">
        User not found
      </Text>
    );
  }

  return (
    <LinearGradient
      style={{ paddingTop: insets.top + 12 }}
      className="flex-1 items-center justify-end"
      colors={["#4361ee", "#3a0ca3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ paddingBottom: insets.top - 12 }} className="items-center">
        <Text className="h-11 font-[DMSansB] text-4xl text-white">Profile</Text>
      </View>
      <View className="h-[80%] w-full items-center rounded-t-2xl bg-white pt-4">
        <View className="w-[95%]">
          <Text className="mb-2 font-[DMSansSB] text-purple-700">Username</Text>
          <Input value={username} onChangeText={setUsername} />
          <Text className="mb-2 font-[DMSansSB] text-purple-700">Email</Text>
          <Input value={email} onChangeText={setEmail} />
          {errorMessage && (
            <Text className="font-[DMSansM] text-red-600">{errorMessage}</Text>
          )}
          {successMessage && (
            <Text className="font-[DMSansM] text-green-600">
              {successMessage}
            </Text>
          )}
          <Button onPress={handleSaveProfile} className="mt-4">
            Save
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}
