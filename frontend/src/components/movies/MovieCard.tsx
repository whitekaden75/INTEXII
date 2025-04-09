import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/MovieType"; // Update the import to use the correct Movie type
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  // Temporary default poster URL until you have real poster URLs
  const safeTitle = movie.title.replace(/[:'&]/g, "");
  const defaultPosterUrl = `https://intex212.blob.core.windows.net/movie-posters/${safeTitle}.jpg`;

  return (
    <Link
      to={`/movies/${movie.showId}`}
      className={cn("movie-card block", className)}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <img
          src={defaultPosterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="movie-card-content">
          <h3 className="font-medium text-base md:text-lg mb-1 text-balance">
            {movie.title}
          </h3>
          <div className="flex items-center text-xs md:text-sm text-gray-300">
            <span>{movie.releaseYear}</span>
            <span className="mx-2">•</span>
            <span>{movie.rating} min</span>
            {/* <span>{movie.contentRating}</span>
            {movie.userRating > 0 && (
              <>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{movie.userRating.toFixed(1)}</span>
                </div>
              </>
            )} */}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {movie.genre && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-full bg-cineniche-blue/20 px-2 py-0.5 text-xs font-medium text-cineniche-light-blue">
                  {movie.genre}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
