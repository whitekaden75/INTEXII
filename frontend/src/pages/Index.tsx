import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMovies } from "@/contexts/MovieContext";
import Layout from "@/components/layout/Layout";
import FeaturedMovies from "@/components/movies/FeaturedMovies";
import { Button } from "@/components/ui/button";
import { Film, Play } from "lucide-react";
import { UserContext } from "@/components/auth/AuthorizeView";

const Index = () => {
  const { movies, loading } = useMovies();
  const navigate = useNavigate();
  const user = React.useContext(UserContext);

  // Now we don't automatically redirect users to the movies page
  // We want them to be able to see the movies but prompt login
  // when they try to access a specific movie

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-cineniche-purple border-t-transparent animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (user) {
    return <Navigate to="/movies" replace />;
  }

  // For unauthenticated users, we'll show a modified version of the Movies page
  return (
    <Layout>
      {/* Hero Section with Call to Action */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="myke-simon-atsUqIm3wxo-unsplash.jpg"
            alt="CineNiche Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Discover Unique Cinema Experiences
            </h1>
            <p className="text-base md:text-lg text-gray-300">
              CineNiche brings you cult classics, international masterpieces,
              indie gems, and niche documentaries you won't find anywhere else.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              
                <>
                  <Button
                    className="gap-2"
                    size="lg"
                    onClick={() => navigate("/register")}>
                    <Play className="h-4 w-4" />
                    Start Watching
                  </Button>
                  <Button
  variant="outline"
  size="lg"
  onClick={() => navigate("/login")}
  className="hover:bg-[#0C4A6E] hover:text-white border-[#0C4A6E] transition-colors"
>
  Already a Member? Log In
</Button>
                </>
          
            
                <Button
                  className="gap-2"
                  size="lg"
                  onClick={() => navigate("/movies")}>
                  <Play className="h-4 w-4" />
                  Browse All Movies
                </Button>
        
            </div>
          </div>
        </div>
      </section>

      {/*
  {featuredMovies.length > 0 && (
    <div className="bg-cineniche-dark-blue py-6">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6 text-white">Featured Movies</h2>
        <div className="space-y-4">
          {featuredMovies.slice(0, 5).map((movie) => (
            <div key={movie.id} className="p-1">
              <Hero movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
*/}

      {/* 
  {movies && movies.length > 0 && (
    <>
      <FeaturedMovies 
        title="Popular Movies" 
        movies={movies.filter(m => m.userRating >= 4).slice(0, 10)} 
      />
      
      <FeaturedMovies 
        title="Recent Releases" 
        movies={[...movies]
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, 10)} 
      />
      
      <FeaturedMovies 
        title="Action Movies" 
        movies={movies.filter(m => m.genres.includes('Action')).slice(0, 10)} 
      />
    </>
  )}
*/}

      {/* Features Section */}
      <section className="py-20 bg-cineniche-blue/10">
  <div className="container">
    <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose CineNiche?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 rounded-lg bg-cineniche-blue/10">
          <div className="w-12 h-12 rounded-full bg-cineniche-blue/20 flex items-center justify-center">
            <Film className="h-6 w-6 text-cineniche-purple" />
              </div>
              <h3 className="text-xl font-semibold">Curated Selection</h3>
              <p className="text-muted-foreground">
                Discover films hand-picked by cinema experts, focusing on
                quality over quantity.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-cineniche-blue/10">
              <div className="w-12 h-12 rounded-full bg-cineniche-blue/20 flex items-center justify-center">
              <Film className="h-6 w-6 text-cineniche-purple" />
              </div>
              <h3 className="text-xl font-semibold">Global Perspective</h3>
              <p className="text-muted-foreground">
                Experience cinema from around the world, with films from every
                corner of the globe.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-cineniche-blue/10">
            <div className="w-12 h-12 rounded-full bg-cineniche-blue/20 flex items-center justify-center">
            <Film className="h-6 w-6 text-cineniche-purple" />
              </div>
              <h3 className="text-xl font-semibold">
                Personal Recommendations
              </h3>
              <p className="text-muted-foreground">
                Get tailored suggestions based on your unique taste and viewing
                history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}

        <section className="py-20 bg-cineniche-dark-purple">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-center mb-12">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground">
              Discover films beyond the mainstream. <br />
              Join CineNiche and explore the unexpected.
            </p>
            <br />
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                className="gap-2"
                size="lg"
                onClick={() => navigate("/register")}>
                Create an Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-[#0C4A6E] hover:text-white border-[#0C4A6E] transition-colors"

                onClick={() => navigate("/login")}>
                Log In
              </Button>
            </div>
          </div>
        </section>
 
    </Layout>
  );
};

export default Index;
