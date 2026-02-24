"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "username" | "bio" | "avatar">>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "mpdf_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get stored token
  const getToken = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  // Set token
  const setToken = useCallback((newToken: string | null) => {
    if (typeof window === "undefined") return;
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(newToken);
  }, []);

  // Create headers with auth
  const authHeaders = useCallback(
    (contentType = true): HeadersInit => {
      const headers: HeadersInit = {};
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (contentType) {
        headers["Content-Type"] = "application/json";
      }
      return headers;
    },
    [getToken]
  );

  // Fetch current user
  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: authHeaders(false),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setToken(null);
        setUser(null);
      }
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, setToken, authHeaders]);

  // Initialize on mount
  useEffect(() => {
    // Initialize token state from localStorage
    const storedToken = getToken();
    if (storedToken) {
      setTokenState(storedToken);
    }
    refreshUser();
  }, [refreshUser, getToken]);

  // Login
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setToken(data.token);
          setUser(data.user);
          return { success: true };
        }

        return { success: false, error: data.error || "Login failed" };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [setToken]
  );

  // Register
  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setToken(data.token);
          setUser(data.user);
          return { success: true };
        }

        return { success: false, error: data.error || "Registration failed" };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [setToken]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: authHeaders(false),
      });
    } catch {
      // Ignore errors
    } finally {
      setToken(null);
      setUser(null);
    }
  }, [setToken, authHeaders]);

  // Update profile
  const updateProfile = useCallback(
    async (
      data: Partial<Pick<User, "username" | "bio" | "avatar">>
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          setUser(result.user);
          return { success: true };
        }

        return { success: false, error: result.error || "Update failed" };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [authHeaders]
  );

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
