import React, { useState, useEffect } from "react";
import { Movie } from "@/data/MovieType";
import { createMovie, updateMovie } from "@/api/MovieAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Movie) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const MovieForm: React.FC<MovieFormProps> = ({
  movie,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Omit<Movie, "showId">>({
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    releaseYear: new Date().getFullYear(),
    rating: "",
    duration: "",
    description: "",
    genre: "",
  });

  useEffect(() => {
    if (movie && isEditing) {
      const { showId, ...rest } = movie;
      setFormData(rest);
    }
  }, [movie, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response: Movie;
      if (isEditing && movie?.showId) {
        response = await updateMovie(movie.showId, {
          ...formData,
          showId: movie.showId,
        });
      } else {
        response = await createMovie(formData);
      }
      onSubmit(response);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Movie" : "Add New Movie"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the movie details below"
            : "Fill in the details to add a new movie to the catalog"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Movie title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                name="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Movie rating (e.g., PG-13)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g. 2h 15m"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Movie description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Genre (e.g., Action, Comedy)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              placeholder="Director name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cast">Cast</Label>
            <Input
              id="cast"
              name="cast"
              value={formData.cast}
              onChange={handleInputChange}
              placeholder="Comma-separated cast (e.g., Actor 1, Actor 2)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country of origin"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? "Update Movie" : "Add Movie"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieForm;
