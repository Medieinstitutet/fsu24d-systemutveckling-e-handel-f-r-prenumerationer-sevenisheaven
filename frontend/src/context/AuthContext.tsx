import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { User } from "../models/User";
import { API_URL } from "../services/baseService";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, expectedRole: "admin" | "customer") => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <- Start as true, since we try to restore session

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL + "/users/refresh-token", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser({ email: data.user.email, role: data.user.role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    expectedRole: "customer" | "admin"
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL + "/users/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (data.user.role !== expectedRole) {
        throw new Error(`You do not have permission to login as ${expectedRole}`);
      }

      setUser({ email: data.user.email, role: data.user.role });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await fetch(`${API_URL}/users/clear-token`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;