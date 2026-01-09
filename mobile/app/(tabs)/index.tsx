import Button from "@/components/button";
import FilmCard from "@/components/main-screen/film-card";
import { apiGet } from "@/lib/api";
import { tmdbEndpoints } from "@/lib/tmdb";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatsGrid from "../../components/main-screen/stats-grid";
import { IMovieBase } from "../../interfaces/IMovieBase";

interface ITMDBResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IMovie extends IMovieBase {
  genre_ids: number[];
}

export default function Index() {
  const { logout } = useAuth();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const TMDBapiKey = process.env.EXPO_PUBLIC_TMDB_API_TOKEN;
  const insets = useSafeAreaInsets();

  const fetchMovies = async (pageNum: number) => {
    try {
      setLoading(true);
      const url = tmdbEndpoints.discoverMovies(pageNum, "popularity.desc");
      const data: ITMDBResponse = await apiGet<ITMDBResponse>(
        undefined,
        TMDBapiKey,
        url,
      );

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error("Fetch movies error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome-screen");
  };

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      fetchMovies(page + 1);
    }
  };

  return (
    <LinearGradient
      style={{ paddingTop: insets.top + 12 }}
      className="flex-1 items-center justify-end"
      colors={["#F12711", "#F5AF19"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ paddingBottom: insets.top - 12 }} className="items-center">
        <Text className="h-11 font-[DMSansB] text-4xl text-white">CineLog</Text>
        <Text className="font-[DMSansM] text-white">
          Your personal movie companion
        </Text>
        {/* Temporary */}
        <Button className="px-8" onPress={handleLogout}>
          Logout
        </Button>
      </View>
      <View className="w-full flex-1 rounded-t-2xl bg-white">
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 20,
            gap: 8,
            paddingBottom: 32,
          }}
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <FilmCard movie={item} href={`/movie/${item.id}`} />
          )}
          ListHeaderComponent={
            <View className="gap-8">
              <StatsGrid
                count={{ watchLater: 2, liked: 3, disliked: 1, viewed: 4 }}
              />
              <Text className="mb-4 font-[DMSansB] text-3xl text-orange-500">
                All movies
              </Text>
            </View>
          }
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#F5AF19" /> : null
          }
          onEndReached={handleLoadMore}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          scrollEnabled={true}
        />
      </View>
    </LinearGradient>
  );
}
