import { Movie } from "@/contexts/MovieContext";

interface FetchMovieResponse {
  movies: Movie[];
}

const API_BASE_URL = "http://localhost:5016/api/Movies";
