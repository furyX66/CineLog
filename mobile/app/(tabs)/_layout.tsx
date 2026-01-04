import { Tabs } from "expo-router";
import {
  Bookmark,
  Heart,
  HeartOff,
  House,
  MessageSquare,
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
        name="reviews"
        options={{
          title: "Reviews",
          tabBarIcon: ({ color }) => <MessageSquare color={color} />,
        }}
      />
    </Tabs>
  );
}
