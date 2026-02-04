import FilmCard from "@/components/main-screen/film-card";
import { apiGet } from "@/lib/api";
import { tmdbEndpoints } from "@/lib/tmdb";
import { useAuth } from "@/stores/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatsGrid from "../../components/main-screen/stats-grid";
import { IMovieBase } from "../../interfaces/IMovieBase";

interface ITMDBResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ICounts {
  liked: number;
  disliked: number;
  watched: number;
  watchlist: number;
}

interface IMovie extends IMovieBase {
  genre_ids: number[];
}

export default function Index() {
  const { token } = useAuth();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [moviesCounts, setMoviesCounts] = useState<ICounts>({
    watchlist: 0,
    liked: 0,
    disliked: 0,
    watched: 0,
  });
  const TMDBapiKey = process.env.EXPO_PUBLIC_TMDB_API_TOKEN;
  const insets = useSafeAreaInsets();

  const fetchMovies = async (pageNum: number) => {
    try {
      setLoading(true);
      const url = tmdbEndpoints.discoverMovies(pageNum, "popularity.desc");
      const data = await apiGet<ITMDBResponse>(undefined, TMDBapiKey, url);

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

  const fetchMoviesCounts = async () => {
    const response = await apiGet<ICounts>("/movies/counts", token!);
    setMoviesCounts(response);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMoviesCounts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    fetchMovies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      fetchMovies(page + 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchMovies(1);
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
      colors={["#F12711", "#F5AF19"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={{ paddingBottom: insets.top - 12 }} className="items-center">
        <Text className="h-11 font-[DMSansB] text-4xl text-white">CineLog</Text>
        <Text className="font-[DMSansM] text-white">
          Your personal movie companion
        </Text>
      </View>
      <View className="w-full flex-1 rounded-t-2xl bg-white">
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#F5AF19"
              title="Pull to refresh"
              titleColor="#F5AF19"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-3 gap-2 pt-5 pb-8"
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <FilmCard
              movie={{ type: "tmdb", ...item }}
              href={`/movie/${item.id}`}
            />
          )}
          ListHeaderComponent={
            <View className="gap-8">
              <StatsGrid count={moviesCounts} />
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
