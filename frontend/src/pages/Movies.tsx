import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import MovieGrid from "@/components/movies/MovieGrid";
import GenreFilter from "@/components/movies/GenreFilter";
import { useMovies } from "@/contexts/MovieContext";
import { useAuth } from "@/contexts/AuthContext";

const Movies = () => {
  const { isAuthenticated } = useAuth();
  const {
    movies,
    filteredMovies,
    loading,
    filters,
    setFilters,
  } = useMovies();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Extract all unique genres from movies
  const allGenres = movies
    .reduce<string[]>((genres, movie) => {
      const movieGenres = movie.genre.split(',').map(g => g.trim());
      movieGenres.forEach(genre => {
        if (!genres.includes(genre)) {
          genres.push(genre);
        }
      });
      return genres;
    }, [])
    .sort();

  // Handle search from navbar
  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };

  // Handle genre filter
  const handleGenreFilter = (genre: string | undefined) => {
    setFilters({ ...filters, genre });
  };

  // Generate movie categories
  const getMoviesByCategory = () => {
    // Recent releases (sort by release year)
    const recentReleases = [...movies]
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .slice(0, 10);

    // Group movies by genre
    const moviesByGenre = movies.reduce((acc, movie) => {
      const genres = movie.genre.split(',').map(g => g.trim());
      genres.forEach(genre => {
        if (!acc[genre]) {
          acc[genre] = [];
        }
        acc[genre].push(movie);
      });
      return acc;
    }, {} as Record<string, typeof movies>);

    return {
      recentReleases,
      ...moviesByGenre
    };
  };

  // Get all category movies
  const categories = getMoviesByCategory();

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Layout onSearch={handleSearch}>
      <div className="container py-8">
        {/* Genre Filter */}
        <GenreFilter
          genres={allGenres}
          selectedGenre={filters.genre}
          onSelectGenre={handleGenreFilter}
        />

        {/* Search Results Display */}
        {filters.searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Search Results for "{filters.searchQuery}"
            </h2>
            <p className="text-muted-foreground">
              Found {filteredMovies.length}{" "}
              {filteredMovies.length === 1 ? "movie" : "movies"}
            </p>
            <MovieGrid movies={filteredMovies} loading={loading} />
          </div>
        )}

        {/* Genre Results Display */}
        {filters.genre && !filters.searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{filters.genre} Movies</h2>
            <p className="text-muted-foreground">
              Found {filteredMovies.length}{" "}
              {filteredMovies.length === 1 ? "movie" : "movies"}
            </p>
            <MovieGrid movies={filteredMovies} loading={loading} />
          </div>
        )}

        {/* Category Sections - Only show when no filters active */}
        {!filters.genre && !filters.searchQuery && (
          <>
            {/* Recent Releases Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recent Releases</h2>
              <MovieGrid 
                movies={categories.recentReleases} 
                loading={loading} 
              />
            </div>

            {/* Genre Categories */}
            {Object.entries(categories)
              .filter(([key]) => key !== 'recentReleases')
              .map(([genre, movies]) => (
                movies.length > 0 && (
                  <div key={genre} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{genre}</h2>
                    <MovieGrid 
                      movies={movies.slice(0, 10)} 
                      loading={loading} 
                    />
                  </div>
                )
              ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Movies;