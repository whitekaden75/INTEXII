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
        console.log('Attempting to fetch authentication status...');
        const response = await fetch(url, options);
        
        // Check if the response is ok before trying to parse JSON
        if (!response.ok) {
          console.error('Authentication check failed with status:', response.status);
          throw new Error(`Auth check failed: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Invalid content type:', contentType);
          throw new Error('Invalid response format from server');
        }
        
        const data = await response.json();
        console.log('Auth response data:', data);
        
        // Validate data structure explicitly
        if (data && typeof data === 'object' && data.email && Array.isArray(data.roles)) {
          setUser({ 
            email: data.email, 
            roles: data.roles 
          });
          setAuthorized(true);
          console.log('User authenticated successfully');
        } else {
          console.error('Invalid user data structure:', data);
          throw new Error('Invalid user session data');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    // Make sure this URL matches what's allowed in your CORS policy
    fetchWithRetry('https://intexii-team2-12-b9b2h9ead7cwd9ax.eastus-01.azurewebsites.net/pingauth', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });
  }, []);

  if (loading) {
    return <p>Loading authentication status...</p>;
  }

  if (!authorized) {
    console.log('User not authorized, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  return (
    <UserContext.Provider value={user}>
      <Outlet />
    </UserContext.Provider>
  );
};

// Modified to handle null user context safely
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  
  // Safe guard against null user
  if (!user) return null;
  
  // Only return email if specifically requested
  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeViewWrapper;