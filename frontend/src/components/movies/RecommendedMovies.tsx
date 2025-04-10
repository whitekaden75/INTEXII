import React from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "@/data/MovieType";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RecommendedMoviesProps {
  title: string;
  movies: Movie[];
  sourceMovieId?: string;
  visibleCount?: number;
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({
  title,
  movies,
  sourceMovieId,
  visibleCount = 5, // Default to showing 5 movies
}) => {
  const navigate = useNavigate();

  if (!movies.length) return null;

  return (
    <section className="py-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="w-full">
          <CarouselContent>
            {movies.map((movie) => (
              <CarouselItem
                key={movie.showId}
                className="basis-1/2 md:basis-1/4 lg:basis-1/5">
                <div
                  className="p-1 cursor-pointer"
                  onClick={() => navigate(`/movies/${movie.showId}`)}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`https://intex212.blob.core.windows.net/movie-posters/${movie.title.replace(
                    /[:'&-()!?./]/g,
                    ""
                  )}.jpg`}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {movie.releaseYear}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};

export default RecommendedMovies;
