import React, { useState, useEffect, createContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface User {
  email: string;
  roles: string[];
}

export const UserContext = createContext<User | null>(null);

const AuthorizeViewWrapper = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    async function fetchWithRetry(url: string, options: RequestInit) {
      console.log("[AuthorizeView] Fetching auth state from: ", url);
      try {
        const response = await fetch(url, options);
        console.log("[AuthorizeView] Fetch response status: ", response.status, " OK: ", response.ok);
        const contentType = response.headers.get('content-type');
        console.log("[AuthorizeView] Response content-type: ", contentType);

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();
        console.log("[AuthorizeView] Parsed response data: ", data);
        if (data.email && data.roles) {
          setUser({ email: data.email, roles: data.roles });
          console.log("[AuthorizeView] User set: ", { email: data.email, roles: data.roles });
          setAuthorized(true);
          console.log("[AuthorizeView] Authorized state set to true");
        } else {
          throw new Error('Invalid user session');
        }
      } catch (error) {
        console.error("[AuthorizeView] Fetch error: ", error);
        setUser(null);
        console.log("[AuthorizeView] User set to null");
        setAuthorized(false);
        console.log("[AuthorizeView] Authorized state set to false");
      } finally {
        setLoading(false);
        console.log("[AuthorizeView] Loading state set to false");
      }
    }

    console.log("[AuthorizeView] useEffect triggered, checking auth state");
    fetchWithRetry(`${import.meta.env.VITE_API_BASE_URL}/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
  }, []);

  if (loading) {
    console.log("[AuthorizeView] Rendering: Still loading");
    return <p>Loading...</p>;
  }

  if (!authorized) {
    console.log("[AuthorizeView] Rendering: Not authorized, redirecting to /login");
    return <Navigate to="/login" />;
  }
  
  console.log("[AuthorizeView] Rendering: Authorized, rendering Outlet with user: ", user);
  return (
    <UserContext.Provider value={user}>
      <Outlet />
    </UserContext.Provider>
  );
};

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  console.log("[AuthorizedUser] Rendering with user: ", user);
  if (!user) return null;
  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeViewWrapper;