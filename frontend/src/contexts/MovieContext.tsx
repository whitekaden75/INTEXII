import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
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
import { useAuth } from "../contexts/AuthContext";

export interface MovieFilter {
  genre?: string;
  searchQuery?: string;
}

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  filteredMovies: Movie[];
  filters: MovieFilter;
  featuredMovies: Movie[]; // Add this line
  setFilters: (filters: MovieFilter) => void;
  addMovie: (movie: Omit<Movie, "showId">) => Promise<void>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
  getMovieRecommendations: (id: string) => Promise<Movie[]>;

}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [filters, setFiltersState] = useState<MovieFilter>({});
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);


  // Wrapper function for setFilters to expose to consumers
  const setFilters = (newFilters: MovieFilter) => {
    setFiltersState(newFilters);
  };

  // Load movies from API with React Query
  const { data: moviesData = [], isLoading, error } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => getAllMovies(),
    retry: false,
  });

  const movies = useMemo(() => moviesData as Movie[], [moviesData]);
  const loading = isLoading;

  React.useEffect(() => {
    if (error) {
      const errObj = error as any;
      if (errObj.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error("Failed to fetch movies");
      }
    }
  }, [error]);

  // Add this useEffect after the movies data loading useEffect
useEffect(() => {
  if (!isAuthenticated) return;

  console.log("Fetching featured movies");
  const fetchFeaturedMovies = async () => {
    console.log("Calling getUserRecommendations");
    if (movies.length === 0) return;
    
    try {
      // For demo purposes, we'll use user ID 1
      // In a real app, you'd get the current user's ID from auth context
      const userId = 1;
      const recommendationIds = await getUserRecommendations(userId);
      
      if (recommendationIds.length > 0) {
        const userRecommendedMovies = recommendationIds
          .map(id => movies.find(movie => movie.showId === id))
          .filter((movie): movie is Movie => movie !== undefined);
        
        // Only update if recommendations actually changed
        const isDifferent = userRecommendedMovies.length !== featuredMovies.length ||
          userRecommendedMovies.some((m, idx) => m.showId !== featuredMovies[idx]?.showId);
        if (isDifferent) {
          setFeaturedMovies(userRecommendedMovies);
        }
      } else {
        // Fallback: use some popular movies if no recommendations
        const fallbackFeatured = movies
          .sort((a, b) => b.releaseYear - a.releaseYear)
          .slice(0, 5);
        
        // Only update if fallback actually changed
        const isDifferent = fallbackFeatured.length !== featuredMovies.length ||
          fallbackFeatured.some((m, idx) => m.showId !== featuredMovies[idx]?.showId);
        if (isDifferent) {
          setFeaturedMovies(fallbackFeatured);
        }
      }
    } catch (error) {
      console.error('Error loading featured movies:', error);
      // Fallback to recent movies if there's an error
      const fallbackFeatured = movies
        .sort((a, b) => b.releaseYear - a.releaseYear)
        .slice(0, 5);
      
      setFeaturedMovies(fallbackFeatured);
    }
  };

  fetchFeaturedMovies();
}, [movies, isAuthenticated]);

  useEffect(() => {
    console.log("Filtering movies");
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
    
    // Only update if filteredMovies actually changed
    const isDifferent = result.length !== filteredMovies.length ||
      result.some((m, idx) => m.showId !== filteredMovies[idx]?.showId);
    if (isDifferent) {
      setFilteredMovies(result);
    }
  }, [movies, filters]);
  

  // Add a new movie
  const addMovie = async (movieData: Omit<Movie, "showId">) => {
    try {
      await createMovie(movieData);
      toast.success("Movie added successfully");
    } catch (error) {
      toast.error("Failed to add movie");
      throw error;
    }
  };

  // Update a movie
  const updateMovie = async (id: string, movieData: Partial<Movie>) => {
    try {
      await updateMovieAPI(id, movieData);
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
      .map(recId => movies.find(movie => movie.showId === recId))
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

      }}>
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