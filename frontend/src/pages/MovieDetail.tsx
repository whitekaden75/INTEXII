import React from "react";
import { Star, Film, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AverageRating from "@/components/movies/AverageRating";
import RecommendedMovies from "@/components/movies/RecommendedMovies";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const MovieDetailsContent = ({
  movie,
  userRating,
  setUserRating,
  handleRateMovie,
  defaultPosterUrl,
  recommendations,
  loadingRecommendations,
  handleClose,
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          {movie.title}
        </DialogTitle>
        <DialogDescription className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span>{movie.duration}</span>
          <span>•</span>
          <span>{movie.rating}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        {/* Poster */}
        <div className="md:col-span-4">
          <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md">
            <img
              src={defaultPosterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Movie Info */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genre.split(",").map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Synopsis</h2>
            <p className="text-muted-foreground">{movie.description}</p>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Director + Ratings */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">Director</h2>
                <div className="flex items-center text-muted-foreground">
                  <Film className="h-4 w-4 mr-2" />
                  <span>{movie.director}</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Average Rating
                </h2>
                <AverageRating showId={movie.showId} />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-1">Rate this Movie</h2>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setUserRating(rating)}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          userRating !== null && rating <= userRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                  <Button
                    onClick={handleRateMovie}
                    disabled={userRating === null}
                    className="ml-2"
                    size="sm"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Cast */}
            <div>
              <h2 className="text-lg font-semibold mb-1">Cast</h2>
              <div className="space-y-1 text-muted-foreground">
                {movie.cast
                  ?.split(",")
                  .slice(0, 3)
                  .map((actor) => (
                    <div key={actor} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{actor}</span>
                    </div>
                  ))}
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
  );
};

export default MovieDetailsContent;
