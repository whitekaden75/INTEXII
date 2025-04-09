import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Film, User } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMovies } from "@/contexts/MovieContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Movie } from "@/data/MovieType";
import MovieCard from "@/components/movies/MovieCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import RecommendedMovies from "@/components/movies/RecommendedMovies";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getMovieById, getMovieRecommendations, loading } = useMovies();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      if (id) {
        setLoadingRecommendations(true);
        try {
          const recommendedMovies = await getMovieRecommendations(id);
          console.log("Recommendations loaded:", recommendedMovies);
          setRecommendations(recommendedMovies);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        } finally {
          setLoadingRecommendations(false);
        }
      }
    }

    fetchRecommendations();
  }, [id, getMovieRecommendations]);

  const movie = id ? getMovieById(id) : undefined;

  // Handle dialog close
  const handleClose = () => {
    setDialogOpen(false);
    navigate("/movies");
  };

  // No longer redirect unauthenticated users, instead show a login prompt

  // Handle rating submission
  // const handleRateMovie = () => {
  //   if (id && userRating !== null) {
  //     rateMovie(id, userRating);
  //   }
  // };

  // Get recommended movies based on genre
  //const recommendedMovies = id ? getRecommendedMoviesById(id) : [];

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-cineniche-purple border-t-transparent animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The movie you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/movies")}>Back to Movies</Button>
        </div>
      </Layout>
    );
  }
  const safeTitle = movie.title.replace(/[:'&]/g, "");
  const defaultPosterUrl = `/Movie_Posters/${safeTitle}.jpg`;

  return (
    <Layout>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}>
          {!isAuthenticated ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Login Required</DialogTitle>
                <DialogDescription>
                  Please sign in or create an account to view movie details and
                  rate movies.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 flex flex-col items-center space-y-4">
                <img
                  src={defaultPosterUrl}
                  alt={movie.title}
                  className="w-1/2 max-w-[200px] aspect-[2/3] rounded-lg object-cover mb-4 opacity-80"
                />
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-center text-muted-foreground">
                  Create an account to access our full library of movies and
                  personalized recommendations.
                </p>
              </div>

              <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto">
                  Back to Movies
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto">
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto">
                  Create Account
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-sm">
                  <span>{movie.releaseYear}</span>
                  <span>•</span>
                  <span>{movie.duration}</span>
                  <span>•</span>
                  <span>{movie.rating}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                {/* Movie Poster */}
                <div className="md:col-span-4">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={defaultPosterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Movie Details */}
                <div className="md:col-span-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      {/* <span className="font-medium">
                        {movie.userRating.toFixed(1)}
                      </span> */}
                    </div>

                    <div className="flex flex-wrap gap-2 ml-4">
                      {movie.genre.split(",").map((genre) => (
                        <span
                          key={genre}
                          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
                      <p className="text-muted-foreground">
                        {movie.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Director</h2>
                        <div className="flex items-center">
                          <Film className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{movie.director}</span>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold mb-2">Cast</h2>
                        <div className="space-y-1">
                          {movie.cast
                            ?.split(",")
                            .slice(0, 3)
                            .map((actor) => (
                              <div key={actor} className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{actor}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-3">
                        Rate this Movie
                      </h2>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setUserRating(rating)}
                            className="p-1">
                            <Star
                              className={`h-6 w-6 ${
                                userRating !== null && rating <= userRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        ))}
                        <Button
                          // onClick={handleRateMovie}
                          disabled={userRating === null}
                          className="ml-4"
                          size="sm">
                          Submit Rating
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Recommended Movies */}
              {!loadingRecommendations && recommendations.length > 0 && (
                <div className="mt-4">
                  <RecommendedMovies
                    title="Movies Like This"
                    movies={recommendations}
                  />
                </div>
              )}

              {loadingRecommendations && (
                <div className="mt-6 text-center">
                  <div className="h-8 w-8 rounded-full border-2 border-cineniche-purple border-t-transparent animate-spin mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading recommendations...
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MovieDetail;
