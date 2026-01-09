import { IMovieBase } from "@/interfaces/IMovieBase";
import { apiGet, apiPost } from "@/lib/api";
import { tmdbEndpoints } from "@/lib/tmdb";
import { useAuth } from "@/stores/auth-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Clapperboard,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IMovie extends IMovieBase {
  genres: {
    id: number;
    name: string;
  }[];
}

type Action = "like" | "dislike" | "watchlist" | "watched";

export default function MovieDetails() {
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = parseInt(id || "0", 10);
  const TMDBapiKey = process.env.EXPO_PUBLIC_TMDB_API_TOKEN;
  const [movie, setMovie] = useState<IMovie>();
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const handleUserAction = async (movie: IMovie, action: Action) => {
    const response = await apiPost(movie, `/movies/${action}`, token!);
    console.log(`${action} response`, response);
  };

  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      const url = tmdbEndpoints.movieDetails(movieId);
      const data: IMovie = await apiGet<IMovie>(undefined, TMDBapiKey, url);
      setMovie(data);
    } catch (error) {
      console.error("Fetch movie details error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

  if (!token) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0e27",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Token has expired</Text>
      </View>
    );
  }
  if (loading) return <ActivityIndicator size="large" color="#F5AF19" />;
  if (!movie) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0e27",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>
          Movie does not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-900"
      showsVerticalScrollIndicator={false}
    >
      <View className="relative h-72">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
          }}
          className="absolute h-full w-full"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          className="absolute left-4 top-5 z-10 h-12 w-12 items-center justify-center rounded-full bg-slate-900"
          style={{
            marginTop: insets.top - 16,
          }}
        >
          <ArrowLeft color={"white"} size={24} />
        </TouchableOpacity>
      </View>

      <View className="z-5 relative mt-[-30px] px-4">
        <View className="mb-6 flex-row gap-4">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={{
              width: 120,
              height: 180,
              borderRadius: 12,
              backgroundColor: "#1a1f3a",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          />

          <View className="mt-12 flex-1 justify-center">
            <Text className="mb-2 font-[DMSansB] text-2xl color-white">
              {movie.title}
            </Text>
            <View className="flex-row flex-wrap">
              <Text className="font-[DMSansL] text-sm text-gray-500">
                {movie.genres.map((genre) => genre.name).join(" | ")}
              </Text>
            </View>

            <View className={"gap-1"}>
              <View className="flex-row items-center gap-2">
                <CalendarDays size={16} color={"white"} />
                <Text className="font-[DMSansM] text-base color-white">
                  {movie.release_date?.slice(0, 4)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Star color={"#F5AF19"} fill={"#F5AF19"} size={16} />
                <Text className="font-[DMSansB] text-base text-[#F5AF19]">
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text className="font-[DMSansL] text-xs color-gray-500">
                  ({movie.vote_count} votes)
                </Text>
              </View>
              <Text className="font-[DMSansM] text-sm color-gray-500">
                Language: {movie.original_language?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6 flex-row gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleUserAction(movie, "watchlist")}
            className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800"
          >
            <Bookmark color={"white"} />
            <Text className="font-[DMSansB] text-base text-white">
              Plan to watch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleUserAction(movie, "watched")}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800"
          >
            <Clapperboard color={"white"} />
            <Text className="font-[DMSansB] text-base text-white">
              Add to watched
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-[DMSansB] text-lg color-white">
            Description
          </Text>
          <Text className="font-[DMSansR] text-base color-slate-400">
            {movie.overview || "Description unavailable"}
          </Text>
        </View>
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => handleUserAction(movie, "like")}
            activeOpacity={0.8}
            className="h-14 w-14 items-center justify-center rounded-lg bg-green-200 px-3 py-2"
          >
            <ThumbsUp color={"#008236"} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleUserAction(movie, "dislike")}
            activeOpacity={0.8}
            className="h-14 w-14 items-center justify-center rounded-lg bg-red-100 px-3 py-2"
          >
            <ThumbsDown color={"#ED213A"} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
