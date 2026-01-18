import Button from "@/components/button";
import Input from "@/components/input";
import { apiPut, extractErrorMessage } from "@/lib/api";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
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
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const { user, token, login, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateProfile = async () => {
    setProfileErrorMessage("");
    setProfileSuccessMessage("");
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
      setProfileSuccessMessage("User data successfully updated");
    } catch (error: any) {
      const cleanError = extractErrorMessage(error.message);
      setProfileErrorMessage(cleanError);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordErrorMessage("");
    setPasswordSuccessMessage("");
    if (newPassword !== repeatNewPassword) {
      setPasswordErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await apiPut(
        {
          currentPassword: curPassword,
          newPassword: newPassword,
        },
        "/account/password",
        token!,
      );
      console.log(response);
      console.log(curPassword);
      setPasswordSuccessMessage("Password successfully updated");
    } catch (error: any) {
      const cleanError = extractErrorMessage(error.message);
      setPasswordErrorMessage(cleanError);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setProfileSuccessMessage("");
      setProfileErrorMessage("");
      setPasswordErrorMessage("");
      setPasswordSuccessMessage("");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        style={{ paddingTop: insets.top + 12 }}
        className="flex-1 items-center justify-end"
        colors={["#4361ee", "#3a0ca3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View
          style={{ paddingBottom: insets.top - 12 }}
          className="items-center"
        >
          <Text className="h-11 font-[DMSansB] text-4xl text-white">
            Profile
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="items-center pb-12 pt-4"
          className="h-[80%] w-full rounded-t-2xl bg-white pt-4"
        >
          <View className="w-[95%]">
            <View className="mb-4">
              <Text className="mb-2 font-[DMSansSB] text-purple-700">
                Username
              </Text>
              <Input value={username} onChangeText={setUsername} />
              <Text className="mb-2 font-[DMSansSB] text-purple-700">
                Email
              </Text>
              <Input value={email} onChangeText={setEmail} />
              {profileErrorMessage && (
                <Text className="font-[DMSansM] text-red-600">
                  {profileErrorMessage}
                </Text>
              )}
              {profileSuccessMessage && (
                <Text className="font-[DMSansM] text-green-600">
                  {profileSuccessMessage}
                </Text>
              )}
              <Button onPress={handleUpdateProfile} className="mt-4">
                Save
              </Button>
            </View>
            <View>
              <Text className="mb-2 font-[DMSansSB] text-purple-700">
                Current password
              </Text>
              <Input value={curPassword} onChangeText={setCurPassword} />
              <Text className="mb-2 font-[DMSansSB] text-purple-700">
                New password
              </Text>
              <Input value={newPassword} onChangeText={setNewPassword} />
              <Text className="mb-2 font-[DMSansSB] text-purple-700">
                Repeat new password
              </Text>
              <Input
                value={repeatNewPassword}
                onChangeText={setRepeatNewPassword}
              />
              {passwordErrorMessage && (
                <Text className="font-[DMSansM] text-red-600">
                  {passwordErrorMessage}
                </Text>
              )}
              {passwordSuccessMessage && (
                <Text className="font-[DMSansM] text-green-600">
                  {passwordSuccessMessage}
                </Text>
              )}
              <Button onPress={handleUpdatePassword} className="mt-4">
                Save
              </Button>
            </View>
            <Button className="mt-4" variant="outline" onPress={handleLogout}>
              Logout
            </Button>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
