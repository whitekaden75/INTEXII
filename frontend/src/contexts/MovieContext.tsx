import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Movie } from "../data/MovieType";
import {
  getAllMovies,
  getMovieById as getMovieByIdAPI,
  updateMovie as updateMovieAPI,
  deleteMovie as deleteMovieAPI,
  createMovie,
  getMovieRecommendationsAPI,
} from "../api/MovieAPI";
import { getUserRecommendations } from "../api/MovieAPI";

export interface MovieFilter {
  genre?: string;
  searchQuery?: string;
}

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  filteredMovies: Movie[];
  filters: MovieFilter;
  featuredMovies: Movie[];
  setFilters: (filters: MovieFilter) => void;
  addMovie: (movie: Omit<Movie, "showId">) => Promise<void>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
  getMovieRecommendations: (id: string) => Promise<Movie[]>;

  adminMovies: Movie[];
  adminPage: number;
  adminPageSize: number;
  adminTotalPages: number;
  setAdminPage: (page: number) => void;
  setAdminPageSize: (size: number) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("[MovieProvider] React version:", React.version);
  console.log("[MovieProvider] React object:", React);
  if (typeof window !== "undefined") {
    console.log(
      "[MovieProvider] window.React === React:",
      window.React === React
    );
  }
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState<MovieFilter>({});
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [adminMovies, setAdminMovies] = useState<Movie[]>([]);
  const [adminPage, setAdminPage] = useState(1);
  const [adminPageSize, setAdminPageSize] = useState(10);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);

  // Wrapper function for setFilters to expose to consumers
  const setFilters = (newFilters: MovieFilter) => {
    setFiltersState(newFilters);
  };

  // Load movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getAllMovies({
          page: 1,
          pageSize: 20,
          search: filters.searchQuery ?? undefined,
          genre: filters.genre ?? undefined,
        });
        setMovies(data);
      } catch (error) {
        toast.error("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters.searchQuery, filters.genre]);

  // Fetch movies for Admin page with pagination
  useEffect(() => {
    const fetchAdminMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/Movies?page=${adminPage}&pageSize=${adminPageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch admin movies");
        const totalCount = response.headers.get("X-Total-Count");
        const data = await response.json();
        setAdminMovies(data);
        if (totalCount) {
          setAdminTotalPages(Math.ceil(parseInt(totalCount) / adminPageSize));
        } else {
          setAdminTotalPages(1);
        }
      } catch (error) {
        toast.error("Failed to fetch admin movies");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMovies();
  }, [adminPage, adminPageSize]);

  // Add this useEffect after the movies data loading useEffect
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      if (movies.length === 0) return;

      try {
        // For demo purposes, we'll use user ID 1
        // In a real app, you'd get the current user's ID from auth context
        const userId = 1;
        const recommendationIds = await getUserRecommendations(userId);

        if (recommendationIds.length > 0) {
          const userRecommendedMovies = recommendationIds
            .map((id) => movies.find((movie) => movie.showId === id))
            .filter((movie): movie is Movie => movie !== undefined);

          setFeaturedMovies(userRecommendedMovies);
        } else {
          // Fallback: use some popular movies if no recommendations
          const fallbackFeatured = movies
            .sort((a, b) => b.releaseYear - a.releaseYear)
            .slice(0, 5);

          setFeaturedMovies(fallbackFeatured);
        }
      } catch (error) {
        console.error("Error loading featured movies:", error);
        // Fallback to recent movies if there's an error
        const fallbackFeatured = movies
          .sort((a, b) => b.releaseYear - a.releaseYear)
          .slice(0, 5);

        setFeaturedMovies(fallbackFeatured);
      }
    };

    fetchFeaturedMovies();
  }, [movies]);

  useEffect(() => {
    let result = [...movies];

    if (filters.genre) {
      result = result.filter((movie) =>
        movie.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();

      result = result.filter((movie) => {
        const title = movie.title?.toLowerCase() || "";
        const director = movie.director?.toLowerCase() || "";
        const cast = movie.cast?.toLowerCase() || "";

        return (
          title.includes(query) ||
          director.includes(query) ||
          cast.includes(query)
        );
      });
    }

    setFilteredMovies(result);
  }, [movies, filters]);

  // Add a new movie
  const addMovie = async (movieData: Omit<Movie, "showId">) => {
    try {
      const newMovie = await createMovie(movieData);
      setMovies((prevMovies) => [...prevMovies, newMovie]);
      toast.success("Movie added successfully");
    } catch (error) {
      toast.error("Failed to add movie");
      throw error;
    }
  };

  // Update a movie
  const updateMovie = async (id: string, movieData: Partial<Movie>) => {
    try {
      const updatedMovie = await updateMovieAPI(id, movieData);
      setMovies((prevMovies) =>
        prevMovies.map((movie) => (movie.showId === id ? updatedMovie : movie))
      );
      toast.success("Movie updated successfully");
    } catch (error) {
      toast.error("Failed to update movie");
      throw error;
    }
  };

  // Delete a movie
  const deleteMovie = async (id: string) => {
    try {
      await deleteMovieAPI(id);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.showId !== id)
      );
      toast.success("Movie deleted successfully");
    } catch (error) {
      toast.error("Failed to delete movie");
      throw error;
    }
  };

  // Function to your MovieProvider
  // Add this function to the MovieProvider component
  const getMovieRecommendations = async (id: string): Promise<Movie[]> => {
    try {
      // Get recommendation IDs
      const recommendationIds = await getMovieRecommendationsAPI(id);

      if (!recommendationIds.length) {
        return [];
      }

      // Map IDs to movies from our loaded movies array
      const recommendedMovies = recommendationIds
        .map((recId) => movies.find((movie) => movie.showId === recId))
        .filter((movie): movie is Movie => movie !== undefined);

      return recommendedMovies;
    } catch (error) {
      toast.error("Failed to fetch movie recommendations");
      return [];
    }
  };

  // Get featured movies
  //const featuredMovies = movies.filter(movie => movie.featured);

  // Get a movie by ID
  //const getMovieById = (id: string) => {
  //return movies.find(movie => movie.id === id);
  //};

  // Get a movie by ID
  const getMovieById = (id: string) => {
    return movies.find((movie) => movie.showId === id);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        loading,
        filters,
        filteredMovies,
        featuredMovies,
        setFilters,
        addMovie,
        updateMovie,
        deleteMovie,
        getMovieById,
        getMovieRecommendations,
        adminMovies,
        adminPage,
        adminPageSize,
        adminTotalPages,
        setAdminPage,
        setAdminPageSize,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook to use the movie context
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
export type { Movie };
