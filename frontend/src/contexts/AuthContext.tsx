import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "sonner";

// User and context types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  emailConfirmed?: boolean;
  mfaEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  csrfToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory storage for JWT and CSRF token
let accessToken: string | null = null;
let csrfTokenMemory: string | null = null;

// Helpers to manage tokens in localStorage (fallback)
const saveTokens = () => {
  if (accessToken) localStorage.setItem("jwtToken", accessToken);
  if (csrfTokenMemory) localStorage.setItem("csrfToken", csrfTokenMemory);
};

const loadTokens = () => {
  accessToken = localStorage.getItem("jwtToken");
  csrfTokenMemory = localStorage.getItem("csrfToken");
};

const clearTokens = () => {
  accessToken = null;
  csrfTokenMemory = null;
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("csrfToken");
};

// Axios request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // Attach CSRF token only for refresh endpoint
    if (config.url?.includes("/refresh-token") && csrfTokenMemory) {
      config.headers["X-CSRF-TOKEN"] = csrfTokenMemory;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor to handle 401 and refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth service object to avoid circular deps
const authService: any = {};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [csrfTokenState, setCsrfTokenState] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  let accessToken: string | null = null;
  let csrfTokenMemory: string | null = null;


  useEffect(() => {
    loadTokens();
    setCsrfTokenState(csrfTokenMemory);
    if (accessToken) {
      const userData = parseJwt(accessToken);
      setUser(userData);
    }
  }, []);

  interface LoginResponse {
    token?: string;
    accessToken?: string;
  }
  
  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting login with", email);
  
      // Using ASP.NET Identity's login endpoint
      const response = await api.post("/login", { email, password });
  
      // Cast response.data to the LoginResponse type
      const { token, accessToken: receivedToken } = response.data as LoginResponse;
  
      // Handle token or accessToken
      const tokenToUse = receivedToken || token;
  
      if (!tokenToUse) {
        console.error("No token received in login response");
        throw new Error("Authentication failed - no token received");
      }
  
      accessToken = typeof tokenToUse === 'string' ? tokenToUse : JSON.stringify(tokenToUse);
      csrfTokenMemory = generateCsrfToken();
      saveTokens();
      setCsrfTokenState(csrfTokenMemory);
  
      try {
        const userData = parseJwt(accessToken);
        setUser(userData);
  
        // Decode expiry and set proactive refresh
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const expiry = payload.exp * 1000;
        setTokenExpiry(expiry);
  
        if (refreshTimer) clearTimeout(refreshTimer);
        const refreshTime = expiry - Date.now() - 60 * 1000;
        if (refreshTime > 0) {
          const timer = setTimeout(refreshToken, refreshTime);
          setRefreshTimer(timer);
        }
      } catch (parseError) {
        console.error("Failed to parse JWT token:", parseError);
        throw new Error("Authentication succeeded but identity verification failed");
      }
  
      toast.success("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.title || error.message || "Login failed");
      throw error;
    }
  };
  
  

  const register = async (email: string, password: string) => {
    try {
      const response = await api.post("/Auth/register", { email, password });
      const { token } = response.data as { token: string };
      accessToken = token;
      csrfTokenMemory = generateCsrfToken();
      saveTokens();
      setCsrfTokenState(csrfTokenMemory);
      const userData = parseJwt(token);
      setUser(userData);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;
      setTokenExpiry(expiry);

      if (refreshTimer) clearTimeout(refreshTimer);
      const refreshTime = expiry - Date.now() - 60 * 1000;
      if (refreshTime > 0) {
        const timer = setTimeout(refreshToken, refreshTime);
        setRefreshTimer(timer);
      }
      toast.success("Registration successful. Please confirm your email.");
    } catch (error: any) {
      toast.error("Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore errors
    }
    clearTokens();
    setUser(null);
    setCsrfTokenState(null);
    setTokenExpiry(null);
    if (refreshTimer) clearTimeout(refreshTimer);
    setRefreshTimer(null);
    toast.info("Logged out");
    window.location.href = "/login";
  };

  const refreshToken = async () => {
    try {
      const response = await api.post(
        "/auth/refresh-token",
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfTokenMemory || "",
          },
        }
      );
      const { token } = response.data as { token: string };
      accessToken = token;
      saveTokens();
      const userData = parseJwt(token);
      setUser(userData);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;
      setTokenExpiry(expiry);

      if (refreshTimer) clearTimeout(refreshTimer);
      const refreshTime = expiry - Date.now() - 60 * 1000;
      if (refreshTime > 0) {
        const timer = setTimeout(refreshToken, refreshTime);
        setRefreshTimer(timer);
      }
    } catch (error) {
      clearTokens();
      setUser(null);
      setTokenExpiry(null);
      if (refreshTimer) clearTimeout(refreshTimer);
      setRefreshTimer(null);
      throw error;
    }
  };

  // Expose refreshToken for interceptor
  authService.refreshToken = refreshToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        refreshToken,
        csrfToken: csrfTokenState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// JWT parsing helper
function parseJwt(token: string): User {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      avatar: payload.avatar,
      emailConfirmed: payload.emailConfirmed,
      mfaEnabled: payload.mfaEnabled,
    };
  } catch {
    return {
      id: "",
      username: "",
      email: "",
      role: "",
    };
  }
}

// CSRF token generator
function generateCsrfToken(): string {
  return crypto.randomUUID();
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
