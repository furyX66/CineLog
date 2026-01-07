const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const tmdbEndpoints = {
  discoverMovies: (page: number = 1, sortBy: string = "popularity.desc") =>
    `${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortBy}`,

  searchMovies: (query: string) =>
    `${TMDB_BASE_URL}/search/movie?query=${query}&language=en-US`,

  movieDetails: (id: number) => `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
};
