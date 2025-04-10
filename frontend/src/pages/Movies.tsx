import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import MovieGrid from "@/components/movies/MovieGrid";
import GenreFilter from "@/components/movies/GenreFilter";
import { useMovies } from "@/contexts/MovieContext";
// import { useAuth } from "@/contexts/AuthContext";
import { useInView } from "@/hooks/useInView";
import FeaturedMovies from "@/components/movies/FeaturedMovies";
import { UserContext } from "@/components/auth/AuthorizeView";


const Movies = () => {
  const [displayCount, setDisplayCount] = useState(12); // start with 12
  const { ref, inView } = useInView();
  const [visibleGenreCount, setVisibleGenreCount] = useState(2); // show 2 genres at a time

  // const { isAuthenticated } = useAuth();
  const {
    movies,
    filteredMovies,
    loading,
    filters,
    setFilters,
    featuredMovies,
  } = useMovies();
  const navigate = useNavigate();
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  // Redirect if not authenticated
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, navigate]);

  // Extract all unique genres from movies
  const allGenres = movies
  .reduce<string[]>((genres, movie) => {
    if (movie.genre) {
      const movieGenres = movie.genre.split(",").map((g) => g.trim());
      movieGenres.forEach((genre) => {
        if (genre && !genres.includes(genre)) { // Add check for empty genre
          genres.push(genre);
        }
      });
    }
    return genres;
  }, [])
  .sort();

// Handle search from navbar
const handleSearch = (query: string) => {
  setFilters({ ...filters, searchQuery: query || "" });
  setDisplayCount(12);
};

// Handle genre filter
const handleGenreFilter = (genre: string | undefined) => {
  setFilters({ ...filters, genre: genre || undefined });
  setDisplayCount(12);
};

  // Generate movie categories
  const getMoviesByCategory = () => {
    // Recent releases (sort by release year)
    // Recent releases (sort by release year)
    const recentReleases = [...movies]
        .filter(movie => movie && typeof movie.releaseYear === 'number') // Add this filter
        .sort((a, b) => b.releaseYear - a.releaseYear)
        .slice(0, 10);
    // Group movies by genre
    const moviesByGenre = movies.reduce((acc, movie) => {
      if (movie.genre) {
        const genres = movie.genre.split(",").map((g) => g.trim());
        genres.forEach((genre) => {
          if (genre) { // Add check for empty genre
            if (!acc[genre]) {
              acc[genre] = [];
            }
            acc[genre].push(movie);
          }
        });
      }
      return acc;
    }, {} as Record<string, typeof movies>);

    return {
      recentReleases,
      ...moviesByGenre,
    };
  };

  // Get all category movies
  const categories = getMoviesByCategory();

  // if (!isAuthenticated) {
  //   return null; // Don't render anything while redirecting
  // }

  useEffect(() => {
    if (!inView) return;

    const hasMoreFiltered =
      (filters.genre || filters.searchQuery) &&
      filteredMovies.length > displayCount;

    const hasMoreCategories =
      !filters.genre &&
      !filters.searchQuery &&
      Object.keys(categories).length > visibleGenreCount;

    if (hasMoreFiltered) {
      setDisplayCount((prev) => prev + 12);
    }

    if (!filters.genre && !filters.searchQuery && hasMoreCategories) {
      setVisibleGenreCount((prev) => prev + 2);
    }
  }, [inView, filters, filteredMovies.length, displayCount]);
  // useEffect(() => {
  //   setDisplayCount(12);
  // }, [filters.genre, filters.searchQuery]);

  return (
    <Layout onSearch={handleSearch}>
      {/* Auto-Rotating Featured Movie */}
      {featuredMovies.length > 0 && !filters.searchQuery && !filters.genre && (
        <div className="bg-cineniche-dark-blue py-6">
          <div className="container">
            <FeaturedMovies
              title="Recommended For You"
              movies={featuredMovies}
            />
          </div>
        </div>
      )}

      <div className="container py-8 min-h-[80vh]">
        {/* Genre Filter */}
        <GenreFilter
          genres={allGenres}
          selectedGenre={filters.genre}
          onSelectGenre={handleGenreFilter}
        />

        {/* Search Results */}
        {filters.searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Search Results for "{filters.searchQuery}"
            </h2>
            <p className="text-muted-foreground">
              Found {filteredMovies.length}{" "}
              {filteredMovies.length === 1 ? "movie" : "movies"}
            </p>
            <MovieGrid movies={filteredMovies.slice(0)} loading={loading} />
            <div
              // ref={ref}
              className="h-10 w-full flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                {filteredMovies.length > displayCount
                  ? "Loading more..."
                  : "No more results"}
              </p>
            </div>
          </div>
        )}

        {/* Genre Filtered Results (no search) */}
        {filters.genre && !filters.searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{filters.genre} Movies</h2>
            <p className="text-muted-foreground">
              Found {filteredMovies.length}{" "}
              {filteredMovies.length === 1 ? "movie" : "movies"}
            </p>
            <MovieGrid movies={filteredMovies.slice(0)} loading={loading} />
            <div
              // ref={ref}
              className="h-10 w-full flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                {filteredMovies.length > displayCount
                  ? "Loading more..."
                  : "No more results"}
              </p>
            </div>
          </div>
        )}

        {/* Default Category Sections (no filters) */}
        {!filters.genre && !filters.searchQuery && (
          <>
            {/* Recent Releases */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recent Releases</h2>
              <MovieGrid
                movies={categories.recentReleases.slice(0, 10)}
                loading={loading}
              />
            </div>

            {/* Genre Categories */}
            {Object.entries(categories)
              .filter(([key]) => key !== "recentReleases")
              .slice(0, visibleGenreCount)
              .map(([genre, movies]) =>
                movies.length > 0 ? (
                  <div key={genre} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{genre}</h2>
                    <MovieGrid movies={movies.slice(0, 10)} loading={loading} />
                  </div>
                ) : null
              )}

            {/* Infinite Scroll Trigger for genres */}
            <div
              ref={ref}
              className="h-10 w-full flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                {movies.length > displayCount
                  ? "Loading more..."
                  : "No more results"}
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Movies;