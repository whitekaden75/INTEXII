/**
 * A fetch API wrapper that handles authentication redirects consistently
 */

// Function to check if we're currently redirecting (use the same storage as api.ts)
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

/**
 * Fetch wrapper that handles 401 redirects consistently
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  skipRedirect = false
) {
  // Default to include credentials
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  try {
    if (isRedirecting() && !skipRedirect) {
      console.warn("Skipping fetch because redirect is in progress");
      throw new Error("Redirecting to login, fetch aborted");
    }
    const response = await fetch(url, fetchOptions);

    // Handle 401 response (unauthenticated)
    if (response.status === 401 && !isRedirecting() && !skipRedirect) {
      console.log("fetchWithAuth: 401 detected, redirecting to login page");
      setRedirecting(true);
      window.location.href = "/login";
      throw new Error("Unauthenticated. Redirecting to login page.");
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default fetchWithAuth;
