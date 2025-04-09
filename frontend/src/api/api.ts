import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

// Function to check if we're currently redirecting
const isRedirecting = () => {
  return sessionStorage.getItem("isAuthRedirecting") === "true";
};

// Function to set redirecting state
const setRedirecting = (value: boolean) => {
  if (value) {
    sessionStorage.setItem("isAuthRedirecting", "true");
  } else {
    sessionStorage.removeItem("isAuthRedirecting");
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if we should skip the redirect for this request
    const skipRedirect = error.config?.headers?.["X-Skip-Auth-Redirect"];

    // Only redirect if we get a 401, we're not already redirecting, and we haven't been asked to skip
    if (
      error.response &&
      error.response.status === 401 &&
      !isRedirecting() &&
      !skipRedirect
    ) {
      console.log("API interceptor: 401 detected, redirecting to login page");
      setRedirecting(true);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Clear the redirecting flag when the page loads
// This ensures a fresh state when the app initializes
window.addEventListener("load", () => {
  setRedirecting(false);
});

export default api;
