import FilmCard from "@/components/main-screen/film-card";
import {
  IUserMovie,
  IUserMovieResponse,
} from "@/interfaces/IUserMovieResponse";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Liked() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const [movies, setMovies] = useState<IUserMovie[]>([]);
  const [moviesCount, setMovieCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await apiGet<IUserMovieResponse>("/movies/liked", token!);
      setMovies(data.movies);
      setMovieCount(data.count);
    } catch (error) {
      console.error("Fetch movies error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchMovies();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <LinearGradient
      style={{ paddingTop: insets.top + 12 }}
      className="flex-1 items-center justify-end"
      colors={["#11998E", "#38EF7D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ paddingBottom: insets.top - 12 }} className="items-center">
        <Text className="h-11 font-[DMSansB] text-4xl text-white">Liked</Text>
        <Text className="font-[DMSansM] text-white">
          {moviesCount} {moviesCount > 1 ? "movies" : "movie"} liked
        </Text>
      </View>
      <View className="h-[80%] w-full rounded-t-2xl bg-white pt-4">
        <FlatList
          ListEmptyComponent={
            <Text className="text-center font-[DMSansM] text-2xl text-blue-400">
              You have not like any movie
            </Text>
          }
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#F5AF19"
              title="Pull to refresh"
              titleColor="#F5AF19"
            />
          }
          contentContainerClassName="px-3 gap-2  pb-8"
          showsVerticalScrollIndicator={false}
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <FilmCard
              movie={{ type: "backend", ...item }}
              href={`/movie/${item.tmdbId}`}
            />
          )}
        />
      </View>
    </LinearGradient>
  );
}
