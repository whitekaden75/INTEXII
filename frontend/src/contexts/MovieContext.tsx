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
  //rateMovie: (id: string, rating: number) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MovieFilter>({});
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

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

  // Apply filters when movies or filters change
  // In your MovieContext.tsx, update the filtering:
  useEffect(() => {
    let result = [...movies];

    if (filters.genre) {
      result = result.filter((movie) =>
        movie.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
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
  // Add a new movie
  const addMovie = async (movieData: Omit<Movie, "showId">) => {
    try {
      const newMovie = await createMovie(movieData);
      setMovies((prevMovies) => [...prevMovies, newMovie]);
      toast.success("Movie added successfully");
    } catch (error) {
      toast.error("Failed to fetch movies");

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
      toast.error("Failed to fetch movies");
    } catch (error) {
      toast.success("Movie added successfully");

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
      toast.success("Movie added successfully");
    } catch (error) {
      toast.error("Failed to fetch movies");

      throw error;
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
        setFilters,
        addMovie,
        updateMovie,
        deleteMovie,
        getMovieById,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

//   // Get recommended movies based on movie ID
//   const getRecommendedMoviesById = (id: string) => {
//     const movie = getMovieById(id);
//     if (!movie) return [];

//     // Find movies with similar genres
//     return movies
//       .filter(m =>
//         m.id !== movie.id && // Exclude current movie
//         m.genres.some(genre => movie.genres.includes(genre)) // Must share at least one genre
//       )
//       .sort((a, b) => {
//         // Count matching genres for better sorting
//         const aMatches = a.genres.filter(genre => movie.genres.includes(genre)).length;
//         const bMatches = b.genres.filter(genre => movie.genres.includes(genre)).length;
//         return bMatches - aMatches; // Sort by most matching genres first
//       })
//       .slice(0, 6); // Limit to 6 recommendations
//   };

  // // Rate a movie
  //   const rateMovie = (id: string, rating: number) => {
  //   setMovies(prevMovies =>
  //     prevMovies.map(movie =>
  //       movie.id === id ? { ...movie, userRating: rating } : movie
  //     )
  //   );
  //   toast.success('Rating submitted successfully!');
  // };

//   // Add a new movie
//   const addMovie = (movie: Omit<Movie, 'id'>) => {
//     const newMovie = {
//       ...movie,
//       id: Date.now().toString(),
//     };

//     setMovies(prevMovies => [...prevMovies, newMovie]);
//     toast.success(`Movie "${movie.title}" added successfully!`);
//   };

//   // Update a movie
//   const updateMovie = (id: string, updates: Partial<Movie>) => {
//     setMovies(prevMovies =>
//       prevMovies.map(movie =>
//         movie.id === id ? { ...movie, ...updates } : movie
//       )
//     );
//     toast.success('Movie updated successfully!');
//   };

//   // Delete a movie
//   const deleteMovie = (id: string) => {
//     setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
//     toast.success('Movie deleted successfully!');
//   };

//   return (
//     <MovieContext.Provider
//       value={{
//         movies,
//         featuredMovies,
//         loading,
//         filteredMovies,
//         filters,
//         setFilters,
//         getMovieById,
//         rateMovie,
//         addMovie,
//         updateMovie,
//         deleteMovie,
//         getRecommendedMoviesById,
//       }}
//     >
//       {children}
//     </MovieContext.Provider>
//   );
// };

// Custom hook to use the movie context
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
export type { Movie };

