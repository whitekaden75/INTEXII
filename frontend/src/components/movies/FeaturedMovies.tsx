import React, { useState, useEffect } from 'react';
import { Movie } from '@/data/MovieType';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface FeaturedMoviesProps {
  title: string;
  movies: Movie[];
}

const FeaturedMovies: React.FC<FeaturedMoviesProps> = ({ title, movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right-to-left' | 'left-to-right'>('right-to-left');
  
  // Auto-rotate featured movies every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection('right-to-left');
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [movies.length]);
  
  if (movies.length === 0) return null;
  
  const currentMovie = movies[currentIndex];
  
  const goToNextSlide = () => {
    setSlideDirection('right-to-left');
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };
  
  const goToPrevSlide = () => {
    setSlideDirection('left-to-right');
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };
  
  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setSlideDirection(index > currentIndex ? 'right-to-left' : 'left-to-right');
    setCurrentIndex(index);
  };
  
  // Simplified animation classes
  const slideAnimationClass = slideDirection === 'right-to-left' 
    ? 'animate-slide-left'
    : 'animate-slide-right';
  
  return (
    <section className="py-0">
      <h2 className="text-3xl font-bold mb-4 text-white pl-8">{title}</h2>
      
      <div className="relative w-full overflow-hidden rounded-lg">
        {/* Current slide with animation */}
        <div 
          className={`relative aspect-[21/9] w-full ${slideAnimationClass}`}
          style={{
            backgroundImage: `url(https://picsum.photos/seed/${currentMovie.showId}/1600/600)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          
          {/* Movie info */}
          <div className="absolute bottom-0 left-0 p-8 text-white w-full md:w-2/3 lg:w-1/2">
            <h3 className="text-4xl font-bold mb-2">{currentMovie.title}</h3>
            <div className="flex items-center gap-2 text-sm mb-4">
              <span>{currentMovie.releaseYear}</span>
              <span>•</span>
              <span>{currentMovie.type || 'TV-MA'}</span>
              <span>•</span>
              <span>{currentMovie.duration || '1 Season'}</span>
              <span>•</span>
              <span className="flex items-center">
                <svg className="h-4 w-4 fill-yellow-400 mr-1" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                4.9
              </span>
            </div>
            
            <p className="text-white/80 mb-6 line-clamp-3">
              {currentMovie.description}
            </p>
            
            <div className="flex gap-3">
              <Button 
              variant="outline"
                className="bg-white text-black hover:bg-white/20 px-8"
                onClick={() => navigate(`/movies/${currentMovie.showId}`)}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-black hover:bg-white/20 px-8"
                onClick={() => navigate(`/movies/${currentMovie.showId}`)}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
        
        {/* Left/Right Navigation */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors z-10"
          onClick={goToPrevSlide}
          aria-label="Previous movie"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors z-10"
          onClick={goToNextSlide}
          aria-label="Next movie"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Navigation dots */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              } transition-colors duration-300`}
              onClick={() => goToSlide(index)}
              aria-label={`View movie ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovies;