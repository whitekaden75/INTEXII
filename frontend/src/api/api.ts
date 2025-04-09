// src/api/api.ts
import axios from 'axios';

// Create an instance with the correct base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-azure-backend-url.azurewebsites.net',
  withCredentials: true // Required for cookies if you're using cookie auth
});

// Add debugging
api.interceptors.request.use(config => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log(`[API Response] ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error(`[API Error] ${error.response?.status || 'Network Error'} from ${error.config?.url}:`, error);
    return Promise.reject(error);
  }
);

export default api;