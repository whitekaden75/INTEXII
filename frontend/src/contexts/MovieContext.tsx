import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Movie } from "../data/MovieType";
import {
  getAllMovies,
  getMovieById as getMovieByIdAPI,
  updateMovie as updateMovieAPI,
  deleteMovie as deleteMovieAPI,
  createMovie,
} from "../api/MovieAPI";

export interface MovieFilter {
  genre?: string;
  searchQuery?: string;
}

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  filteredMovies: Movie[];
  filters: MovieFilter;
  setFilters: (filters: MovieFilter) => void;
  addMovie: (movie: Omit<Movie, "showId">) => Promise<void>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
<<<<<<< HEAD
  getMovieRecommendations: (id: string) => Promise<Movie[]>;
  //rateMovie: (id: string, rating: number) => void;
=======
>>>>>>> 9eba555d5519e0050fd09500da35200c3bd87ffe
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState<MovieFilter>({});
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Wrapper function for setFilters to expose to consumers
  const setFilters = (newFilters: MovieFilter) => {
    setFiltersState(newFilters);
  };

  // Load movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getAllMovies();
        setMovies(data);
      } catch (error) {
        toast.error("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let result = [...movies];
  
    if (filters.genre) {
      result = result.filter((movie) =>
        movie.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }
  
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase(); // Ensure it's never null or undefined
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.director.toLowerCase().includes(query) ||
          movie.cast.toLowerCase().includes(query)
      );
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

<<<<<<< HEAD
  // Function to your MovieProvider
const getMovieRecommendations = async (id: string): Promise<Movie[]> => {
  try {
    return await getMovieRecommendationsAPI(id);
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

=======
>>>>>>> 9eba555d5519e0050fd09500da35200c3bd87ffe
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
        setFilters,
        addMovie,
        updateMovie,
        deleteMovie,
        getMovieById,
        getMovieRecommendations
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