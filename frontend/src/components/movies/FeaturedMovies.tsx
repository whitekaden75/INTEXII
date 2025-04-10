import React, { useEffect, useState } from "react";
import { Movie } from "@/data/MovieType";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedMoviesProps {
  title: string;
  movies: Movie[];
}

const FeaturedMovies: React.FC<FeaturedMoviesProps> = ({ title, movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);

  // Effect for auto-rotation
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [api]);

  // Update current index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle navigation
  const handleNavigateToMovie = (movieId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/movies/${movieId}`);
  };

  if (!movies.length) return null;

  return (
    <section className="w-full relative">
      {/* Title with absolute positioning */}
      <div className="absolute top-4 left-8 z-20">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          {title}
        </h2>
      </div>

      <Carousel
        opts={{
          loop: true,
          align: "start",
          skipSnaps: false,
          duration: 50,
        }}
        setApi={setApi}
        className="w-full">
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.showId} className="w-full pt-0">
              <div
                className="relative aspect-[21/9] w-full overflow-hidden cursor-pointer rounded-xl"
                // onClick={() => handleNavigateToMovie(movie.showId)}
              >
                {/* Movie Poster Image */}
                <img
                  src={`https://intex212.blob.core.windows.net/movie-posters/${movie.title.replace(
                    /[^a-zA-Z0-9]/g,
                    ""
                  )}.jpg`}
                  alt={movie.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* Movie info */}
                <div className="absolute bottom-0 left-0 p-8 text-white w-full md:w-2/3 lg:w-1/2">
                  <h3 className="text-4xl font-bold mb-2">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <span>{movie.releaseYear}</span>
                    <span>•</span>
                    <span>{movie.type || "TV-MA"}</span>
                    <span>•</span>
                    <span>{movie.duration || "1 Season"}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <svg
                        className="h-4 w-4 fill-yellow-400 mr-1"
                        viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      4.9
                    </span>
                  </div>

                  <p className="text-white/80 mb-6 line-clamp-3">
                    {movie.description}
                  </p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="bg-white text-black hover:bg-white/20 px-8"
                      onClick={(e) => handleNavigateToMovie(movie.showId, e)}>
                      <Play className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white text-black hover:bg-white/20 px-8"
                      onClick={(e) => handleNavigateToMovie(movie.showId, e)}>
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation dots */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              } transition-colors duration-300`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`View movie ${index + 1}`}>
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default FeaturedMovies;
