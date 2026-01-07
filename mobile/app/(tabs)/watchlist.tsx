import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Watchlist() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={{ paddingTop: insets.top + 12 }}
      className="flex-1 items-center justify-end"
      colors={["#8E2DE2", "#4A00E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ paddingBottom: insets.top - 12 }} className="items-center">
        <Text className="h-11 font-[DMSansB] text-4xl text-white">
          Watchlist
        </Text>
        <Text className="font-[DMSansM] text-white">3 movies saved</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full rounded-t-2xl bg-white pt-4"
      ></ScrollView>
    </LinearGradient>
  );
}
