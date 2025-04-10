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
      try {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();
        if (data.email && data.roles) {
          setUser({ email: data.email, roles: data.roles });
          setAuthorized(true);
        } else {
          throw new Error('Invalid user session');
        }
      } catch (error) {
        setUser(null);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    fetchWithRetry('https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net/pingauth', {
      method: 'GET',
      credentials: 'include',
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!authorized) {
    // Not authorized, redirect to login.
    return <Navigate to="/login" />;
  }
  
  return (
    <UserContext.Provider value={user}>
      <Outlet />
    </UserContext.Provider>
  );
};

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null;
  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeViewWrapper;
