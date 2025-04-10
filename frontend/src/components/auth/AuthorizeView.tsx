import React, { useState, useEffect, createContext } from 'react';

interface User {
  email: string;
  roles: string[];
}

interface UserContextType {
  user: User | null;
  refetchUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  refetchUser: () => {},
});

interface UserLoaderProps {
  children: React.ReactNode;
}

/**
 * UserLoader fetches the auth state and provides it along with a refetch function.
 */
const UserLoader: React.FC<UserLoaderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAuthState = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pingauth`, {
        method: 'GET',
        credentials: 'include',
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }
      const data = await response.json();
      if (data.email && data.roles) {
        setUser({ email: data.email, roles: data.roles });
      } else {
        throw new Error('Invalid user session');
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <UserContext.Provider value={{ user, refetchUser: fetchAuthState }}>
      {children}
    </UserContext.Provider>
  );
};

export function AuthorizedUser(props: { value: string }) {
  const { user } = React.useContext(UserContext);
  if (!user) return null;
  return props.value === 'email' ? <>{user.email}</> : null;
}

export default UserLoader;
