import Button from "@/components/button";
import FilmCard from "@/components/main-screen/film-card";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatsGrid from "../../components/main-screen/stats-grid";

export default function index() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome-screen");
  };

  const [movies] = useState([
    {
      id: "1",
      title: "The Shawshank Redemption",
      year: 1994,
      genre: "Drama",
      rating: 5.0,
      ratingCount: 1,
      description: "Two imprisoned men bond over a number of years...",
      poster: "https://m.media-amazon.com/images/I/815qtzaP9iL._AC_SX569_.jpg",
    },
    {
      id: "2",
      title: "The Godfather",
      year: 1972,
      genre: "Crime, Drama",
      rating: 4.9,
      ratingCount: 5,
      description: "The aging patriarch of an organized crime dynasty...",
      poster: "https://via.placeholder.com/100x150",
    },
    {
      id: "3",
      title: "The Dark Knight",
      year: 2008,
      genre: "Action, Crime",
      rating: 4.8,
      ratingCount: 3,
      description: "When the menace known as the Joker emerges...",
      poster: "https://via.placeholder.com/100x150",
    },
    {
      id: "4",
      title: "Inception",
      year: 2010,
      genre: "Sci-Fi, Thriller",
      rating: 4.7,
      ratingCount: 8,
      description: "A skilled thief who steals corporate secrets...",
      poster: "https://via.placeholder.com/100x150",
    },
  ]);
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
        {/* Temporary */}
        <Button className="w-[250px]" onPress={handleLogout}>
          Logout
        </Button>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full rounded-t-2xl bg-white pt-4"
      >
        <StatsGrid
          count={{ reviewed: 4, watchLater: 2, liked: 3, disliked: 1 }}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 20,
            gap: 12,
            paddingBottom: 32,
          }}
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FilmCard {...item} />}
          ListHeaderComponent={
            <Text className="mb-4 font-[DMSansB] text-3xl text-orange-500">
              All movies
            </Text>
          }
          scrollEnabled={false}
        />
      </ScrollView>
    </LinearGradient>
  );
}
