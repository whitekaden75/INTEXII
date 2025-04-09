import React, { useState, useEffect, createContext } from "react";
import { Navigate } from "react-router-dom";
import api from "@/api/api";

const UserContext = createContext<User | null>(null);

interface User {
  email: string;
}

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // add a loading state
  let emptyuser: User = { email: "" };
  const [user, setUser] = useState(emptyuser);

  // Create a ref to track whether we've already started checking auth
  const authCheckAttempted = React.useRef(false);

  useEffect(() => {
    // Prevent multiple auth checks
    if (authCheckAttempted.current) return;
    authCheckAttempted.current = true;

    // We need to disable the redirect for this specific check
    // Since our api instance already has redirect handling, we need to
    // avoid double redirects by using a modified version just for this check
    const checkAuth = async () => {
      try {
        console.log("AuthorizeView: Checking authentication status");
        console.log("Ping URL:", import.meta.env.VITE_AUTH_PING_URL);
        console.log("API Base URL:", api.defaults.baseURL);
        
        const response = await api.get(import.meta.env.VITE_AUTH_PING_URL, {
          headers: { "X-Skip-Auth-Redirect": "true" },
        });
    
        // Log the complete response for debugging
        console.log("Auth response:", response.data);
        
        // Continue with existing logic...
      } catch (error) {
        console.error("AuthorizeView: Authentication check failed", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authorized) {
    return (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    );
  }

  console.log("AuthorizeView: Redirecting to login page");
  return <Navigate to="/login" />;
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null; // Prevents errors if context is null

  return props.value === "email" ? <>{user.email}</> : null;
}

export default AuthorizeView;
