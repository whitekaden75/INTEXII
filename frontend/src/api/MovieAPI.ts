import { Movie } from "../data/MovieType";

interface FetchMovieResponse {
  movies: Movie[];
}

const API_BASE_URL = "http://localhost:5000/api/Movies";
const RECOMMENDATION_API_URL = "http://localhost:5000/api/MovieRecommendations";
const USER_API_URL = "http://localhost:5000/api/UserRecommendations";


// Function to fetch all movies
export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    console.log('API Response:', data); // Add this line for debugging
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Function to fetch a single movie by ID
export const getMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

// Function to create a new movie
export const createMovie = async (movie: Omit<Movie, 'showId'>): Promise<Movie> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    });
    if (!response.ok) {
      throw new Error('Failed to create movie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

// Function to update a movie
export const updateMovie = async (id: string, movie: Partial<Movie>): Promise<Movie> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    });
    if (!response.ok) {
      throw new Error('Failed to update movie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// Function to delete a movie
export const deleteMovie = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete movie');
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

// Function to fetch movie recommendations by showId
export const getMovieRecommendationsAPI = async (showId: string): Promise<string[]> => {
  try {
    const response = await fetch(`${RECOMMENDATION_API_URL}/${showId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return []; // No recommendations found
      }
      throw new Error('Failed to fetch recommendations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// Function to fetch user recommendations
export const getUserRecommendations = async (userId: number): Promise<string[]> => {
  try {
    console.log(`Fetching user recommendations for user ${userId}`);
    const response = await fetch(`${USER_API_URL}/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No recommendations found for this user');
        return []; // No recommendations found
      }
      throw new Error('Failed to fetch user recommendations');
    }
    const data = await response.json();
    console.log('Received user recommendations:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user recommendations:', error);
    return [];
  }
};
