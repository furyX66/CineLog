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
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: "#F5AF19",
        tabBarInactiveTintColor: "#6A7282",
        headerShown: false,
        animation: "fade",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          paddingBottom: 8,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <House color={focused ? "#F5AF19" : "#6A7282"} size={24} />
          ),
          tabBarActiveTintColor: "#F5AF19",
          tabBarInactiveTintColor: "#6A7282",
          tabBarLabelStyle: {
            fontFamily: "DMSansB",
          },
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ focused }) => (
            <Bookmark color={focused ? "#8E2DE2" : "#6A7282"} size={24} />
          ),
          tabBarActiveTintColor: "#8E2DE2",
          tabBarInactiveTintColor: "#6A7282",
          tabBarLabelStyle: {
            fontFamily: "DMSansB",
          },
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: "Liked",
          tabBarIcon: ({ focused }) => (
            <Heart color={focused ? "#38EF7D" : "#6A7282"} size={24} />
          ),
          tabBarActiveTintColor: "#38EF7D",
          tabBarInactiveTintColor: "#6A7282",
          tabBarLabelStyle: {
            fontFamily: "DMSansB",
          },
        }}
      />
      <Tabs.Screen
        name="disliked"
        options={{
          title: "Disliked",
          tabBarIcon: ({ focused }) => (
            <HeartOff color={focused ? "#ED213A" : "#6A7282"} size={24} />
          ),
          tabBarActiveTintColor: "#ED213A",
          tabBarInactiveTintColor: "#6A7282",
          tabBarLabelStyle: {
            fontFamily: "DMSansB",
          },
        }}
      />
      <Tabs.Screen
        name="viewed"
        options={{
          title: "Viewed",
          tabBarIcon: ({ focused }) => (
            <Clapperboard color={focused ? "#6DD5ED" : "#6A7282"} size={24} />
          ),
          tabBarActiveTintColor: "#6DD5ED",
          tabBarInactiveTintColor: "#6A7282",
          tabBarLabelStyle: {
            fontFamily: "DMSansB",
          },
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
