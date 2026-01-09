import { ICounts } from "@/app/(tabs)";
import { Href, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface StatsGridProps {
  count: ICounts;
}

interface Stat {
  label: string;
  count: number;
  color: string;
  route: string;
}

export default function StatsGrid({ count }: StatsGridProps) {
  const router = useRouter();
  const stats: Stat[] = [
    {
      label: "Watch List",
      count: count.watchlist,
      color: "text-purple-700",
      route: "watchlist",
    },
    {
      label: "Liked",
      count: count.liked,
      color: "text-green-500",
      route: "liked",
    },
    {
      label: "Disliked",
      count: count.disliked,
      color: "text-red-500",
      route: "disliked",
    },
    {
      label: "Viewed",
      count: count.watched,
      color: "text-blue-300",
      route: "viewed",
    },
  ];

  return (
    <View className="w-full flex-row flex-wrap justify-center gap-3">
      {stats?.map((stat, i) => (
        <Pressable
          onPress={() => router.push(`/${stat.route}` as Href)}
          key={i}
          className="w-[47%] items-center justify-center rounded-xl bg-white p-4 shadow-2xl"
        >
          <Text className="font-[DMSansM] text-xl">{stat.label}</Text>
          <Text className={`font-[DMSansB] text-2xl ${stat.color}`}>
            {stat.count}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
