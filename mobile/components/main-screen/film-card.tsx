import { IGenre } from "@/interfaces/IGenre";
import { IMovieBase } from "@/interfaces/IMovieBase";
import { getGenreNames } from "@/lib/tmdb";
import { Href, router } from "expo-router";
import { Star } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface IFilmCardProps {
  movie: IMovie;
  href?: string;
}

interface ITmdbMovie extends IMovieBase {
  type: "tmdb";
  genre_ids: number[];
  genres?: never;
}

interface IBackendMovie extends IMovieBase {
  type: "backend";
  genres: IGenre[];
  genre_ids?: never;
}

type IMovie = ITmdbMovie | IBackendMovie;

export default function FilmCard({ movie, href }: IFilmCardProps) {
  const getGenresDisplay = (movie: IMovie): string => {
    if (movie.type === "tmdb") {
      return getGenreNames(movie.genre_ids);
    }
    if (movie.type === "backend") {
      if (!movie.genres || movie.genres.length === 0) {
        return "No genres";
      }
      return movie.genres.map((g) => g.name).join(", ");
    }

    return "";
  };

  const handleNavigation = () => {
    router.navigate(href as Href);
  };
  return (
    <Pressable
      onPress={handleNavigation}
      className="w-100 w-full rounded-xl bg-white p-4 shadow-xl"
    >
      <View className="flex-row gap-4">
        {movie.poster_path && (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            className="h-36 w-24 rounded-lg bg-gray-200"
          />
        )}
        <View className="flex-1">
          <Text className="font-[DMSansB] text-lg">{movie.title}</Text>
          <Text className="font-[DMSansL] text-sm text-black">
            {getGenresDisplay(movie)}
          </Text>
          <Text className="mt-2 font-[DMSansL] text-sm text-gray-500">
            {movie.release_date}
          </Text>

          <View className="mt-2 flex-row items-center gap-2">
            <Star fill={"#FFA500"} color={"#FFA500"} size={16} />
            <Text className="font-[DMSansR] text-orange-400">
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
      <Text className="mt-3 font-[DMSansR] text-sm leading-5 text-gray-600">
        {movie.overview}
      </Text>
    </Pressable>
  );
}
