import React, { useState, useEffect, createContext } from 'react';
import { Outlet } from 'react-router-dom';

interface User {
  email: string;
  roles: string[];
}

export const UserContext = createContext<User | null>(null);

// Define the props to accept children
interface UserLoaderProps {
  children: React.ReactNode;
}

/**
 * UserLoader fetches the user state and provides it to its children.
 */
const UserLoader: React.FC<UserLoaderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchWithRetry(url: string, options: RequestInit) {
      console.log("[UserLoader] Fetching auth state from:", url);
      try {
        const response = await fetch(url, options);
        console.log("[UserLoader] Fetch response status:", response.status, "OK:", response.ok);
        const contentType = response.headers.get('content-type');
        console.log("[UserLoader] Response content-type:", contentType);

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();
        console.log("[UserLoader] Parsed response data:", data);
        if (data.email && data.roles) {
          setUser({ email: data.email, roles: data.roles });
          console.log("[UserLoader] User set:", { email: data.email, roles: data.roles });
        } else {
          throw new Error('Invalid user session');
        }
      } catch (error) {
        console.error("[UserLoader] Fetch error:", error);
        setUser(null);
        console.log("[UserLoader] User set to null");
      } finally {
        setLoading(false);
        console.log("[UserLoader] Loading state set to false");
      }
    }

    console.log("[UserLoader] useEffect triggered, checking auth state");
    fetchWithRetry(`${import.meta.env.VITE_API_BASE_URL}/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
  }, []);

  if (loading) {
    console.log("[UserLoader] Rendering: Still loading");
    return <p>Loading...</p>;
  }

  console.log("[UserLoader] Rendering children with user:", user);
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  console.log("[AuthorizedUser] Rendering with user:", user);
  if (!user) return null;
  return props.value === 'email' ? <>{user.email}</> : null;
}

export default UserLoader;
