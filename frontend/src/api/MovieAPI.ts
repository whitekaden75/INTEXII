import { Movie } from "../data/MovieType";
import api from "./api";

interface FetchMovieResponse {
  movies: Movie[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RECOMMENDATION_API_URL = import.meta.env.VITE_RECOMMENDATION_API_URL;
const USER_API_URL = import.meta.env.VITE_USER_API_URL;

// Function to fetch all movies
export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>(API_BASE_URL);
    console.log("API Response:", response.data); // Add this line for debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Function to fetch a single movie by ID
export const getMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await api.get<Movie>(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// Function to create a new movie
export const createMovie = async (
  movie: Omit<Movie, "showId">
): Promise<Movie> => {
  try {
    const response = await api.post<Movie>(API_BASE_URL, movie);
    return response.data;
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error;
  }
};

// Function to update a movie
export const updateMovie = async (
  id: string,
  movie: Partial<Movie>
): Promise<Movie> => {
  try {
    const response = await api.put<Movie>(`${API_BASE_URL}/${id}`, movie);
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

// Function to delete a movie
export const deleteMovie = async (id: string): Promise<void> => {
  try {
    await api.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

// Function to fetch movie recommendations by showId
export const getMovieRecommendationsAPI = async (
  showId: string
): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(
      `${RECOMMENDATION_API_URL}/${showId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

// Function to fetch user recommendations
export const getUserRecommendations = async (
  userId: number
): Promise<string[]> => {
  try {
    console.log(`Fetching user recommendations for user ${userId}`);
    const response = await api.get<string[]>(`${USER_API_URL}/${userId}`);
    console.log("Received user recommendations:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user recommendations:", error);
    return [];
  }
};
