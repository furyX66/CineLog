import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatsGrid from "../../components/main-screen/stats-grid";

export default function index() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={{ paddingTop: insets.top + 12 }}
      className="flex-1 items-center justify-end"
      colors={["#F12711", "#F5AF19"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ paddingBottom: insets.top }} className="items-center">
        <Text className="h-11 font-[DMSansB] text-4xl text-white">CineLog</Text>
        <Text className="font-[DMSansM] text-white">
          Your personal movie companion
        </Text>
      </View>
      <ScrollView className="w-full rounded-t-2xl bg-white p-4">
        <StatsGrid
          count={{ reviewed: 4, watchLater: 2, liked: 3, disliked: 1 }}
        />
      </ScrollView>
    </LinearGradient>
  );
}
