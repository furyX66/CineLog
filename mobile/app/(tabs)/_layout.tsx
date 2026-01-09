import { Tabs } from "expo-router";
import {
  Bookmark,
  Clapperboard,
  Heart,
  HeartOff,
  House,
} from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7e22ce",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "WatchList",
          tabBarIcon: ({ color }) => <Bookmark color={color} />,
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: "Liked",
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="disliked"
        options={{
          title: "Disliked",
          tabBarIcon: ({ color }) => <HeartOff color={color} />,
        }}
      />
      <Tabs.Screen
        name="viewed"
        options={{
          title: "Viewed",
          tabBarIcon: ({ color }) => <Clapperboard color={color} />,
        }}
      />
      <Tabs.Screen
        name="movie/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
