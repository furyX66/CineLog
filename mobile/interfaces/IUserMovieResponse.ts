import { IGenre } from "./IGenre";
import { IMovieBase } from "./IMovieBase";

export interface IUserMovieResponse {
  count: number;
  movies: IUserMovie[];
}

export interface IUserMovie extends IMovieBase {
  tmdbId: number;
  genres: IGenre[];
  isWatched: boolean;
  isLiked: boolean;
  isDisliked: boolean;
  inWatchlist: boolean;
  userRating: number;
}
