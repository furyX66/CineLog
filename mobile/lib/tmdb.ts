const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const tmdbEndpoints = {
  discoverMovies: (page: number = 1, sortBy: string = "popularity.desc") =>
    `${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortBy}`,

  searchMovies: (query: string) =>
    `${TMDB_BASE_URL}/search/movie?query=${query}&language=en-US`,

  movieDetails: (id: number) => `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
};

export const getGenreNames = (genreIds: number[]) =>
  genreIds.map((id) => TMDB_GENRES[id as keyof typeof TMDB_GENRES]).join(", ");

const TMDB_GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
